import { axialToIndex, imod, inCore, indexToAxial, nextPowerOfTwo } from '@/scripts/utils'
import { Texture } from '@/scripts/shader-utils/texture'
import { useGLStore } from '@/stores/gl'
import { useHexStore } from '@/stores/hex'

const Buffers = Object.freeze({
  LOCAL: Symbol('local'),
  FRONT: Symbol('front'),
  BACK: Symbol('back'),
})

export class CellData {
  #gl
  #hex
  #single
  #currentBuffer
  #boardSize
  #cellCount
  #width
  #height
  #local
  #front
  #back

  constructor() {
    this.#gl = useGLStore()
    this.#hex = useHexStore()
    this.#single = new Uint8Array(1)
    this.#currentBuffer = Buffers.LOCAL
    this.#boardSize = this.#hex.boardSize[0]
    this.#cellCount = 3 * this.boardSize ** 2 - 3 * this.boardSize + 1
    this.#width = nextPowerOfTwo(Math.sqrt(this.cellCount))
    this.#height = Math.ceil(this.cellCount / this.width)
    this.#local = new Uint8Array(this.width * this.height)

    const name = 'cellData'
    const alignment = 1
    const level = 0
    const iFormat = this.#gl.ctx.R8
    const border = 0
    const format = this.#gl.ctx.RED
    const type = this.#gl.ctx.UNSIGNED_BYTE
    this.#front = new Texture(this.#gl.ctx, name, alignment, level, iFormat, border, format, type)
    this.#back = new Texture(this.#gl.ctx, name, alignment, level, iFormat, border, format, type)
  }

  get boardSize() {
    return this.#boardSize
  }

  setBoardSize(boardSize: number) {
    this.#boardSize = boardSize
    this.#cellCount = 3 * this.boardSize ** 2 - 3 * this.boardSize + 1
    this.#width = nextPowerOfTwo(Math.sqrt(this.cellCount))
    this.#height = Math.ceil(this.cellCount / this.width)
  }

  get cellCount() {
    return this.#cellCount
  }

  get width() {
    return this.#width
  }

  get height() {
    return this.#height
  }

  get currentBuffer() {
    return this.#currentBuffer
  }

  get input() {
    if (this.currentBuffer === Buffers.FRONT) {
      return this.#front
    } else if (this.currentBuffer === Buffers.BACK) {
      return this.#back
    } else {
      throw new Error('Invalid buffer flag.')
    }
  }

  get output() {
    if (this.currentBuffer === Buffers.FRONT) {
      return this.#back
    } else if (this.currentBuffer === Buffers.BACK) {
      return this.#front
    } else {
      throw new Error('Invalid buffer flag.')
    }
  }

  syncLocal() {
    if (this.currentBuffer === Buffers.LOCAL) {
      return
    }
    this.input.read(0, 0, this.width, this.height, this.#local)
    this.#currentBuffer = Buffers.LOCAL
  }

  syncGPU() {
    if (this.currentBuffer !== Buffers.LOCAL) {
      return
    }
    this.#front.write(this.width, this.height, this.#local)
    this.#back.write(this.width, this.height, this.#local)
    this.#currentBuffer = Buffers.BACK
  }

  getCell(index: number) {
    if (this.currentBuffer === Buffers.LOCAL) {
      return this.#local[index] > 128
    }
    const col = imod(index, this.width)
    const row = Math.floor(index / this.width)
    this.input.read(col, row, 1, 1, this.#single)
    return this.#single[0] > 128
  }

  setCell(index: number, state: boolean) {
    if (this.currentBuffer === Buffers.LOCAL) {
      this.#local[index] = state ? 255 : 0
      return
    }
    const col = imod(index, this.width)
    const row = Math.floor(index / this.width)
    this.#single[0] = state ? 255 : 0
    this.input.writePart(col, row, 1, 1, this.#single)
  }

  toggleCell(index: number) {
    this.setCell(index, !this.getCell(index))
  }

  flip() {
    if (this.currentBuffer === Buffers.FRONT) {
      this.#currentBuffer = Buffers.BACK
    } else if (this.currentBuffer === Buffers.BACK) {
      this.#currentBuffer = Buffers.FRONT
    } else {
      throw new Error('Invalid buffer flag.')
    }
  }

  bindInput() {
    this.syncGPU()
    this.input.bind()
  }

  unbindInput() {
    this.input.unbind()
  }

  bindOutput() {
    this.syncGPU()
    this.output.bindFB()
    this.#gl.ctx.viewport(0, 0, this.width, this.height)
  }

  unbindOutput() {
    this.output.unbindFB()
  }

  delete() {
    this.#front.delete()
    this.#back.delete()
  }

  resize() {
    this.syncLocal()
    const oldLocal = this.#local
    const oldBoardSize = this.boardSize
    const oldCellCount = this.#cellCount
    this.setBoardSize(this.#hex.boardSize[0])
    this.#local = new Uint8Array(this.width * this.height)
    if (Math.max(oldBoardSize, this.#boardSize) > this.#hex.maxBoardResizeCopy) {
      this.#hex.stepping = false
      return
    }
    for (let index = 0; index < oldCellCount; index++) {
      const [q, r] = indexToAxial(index, oldBoardSize)
      if (inCore(q, r)) {
        this.#local[axialToIndex(q, r)] = oldLocal[index]
      }
    }
  }

  clear() {
    this.#local.fill(0)
    this.#currentBuffer = Buffers.LOCAL
  }

  inject() {
    return this.#front.inject()
  }
}
