import { imod } from '@/scripts/utils'
import { Texture } from '@/scripts/shader-utils/texture'
import { useGLStore } from '@/stores/gl'
import { useHexStore } from '@/stores/hex'

const Buffers = Object.freeze({
  LOCAL: Symbol('local'),
  FRONT: Symbol('front'),
  BACK: Symbol('back'),
})

function nextPowerOfTwo(x: number) {
  let power = 0
  while (true) {
    const value = 1 << power
    if (x <= value) {
      return value
    }
    power += 1
  }
}

export class CellData {
  #gl
  #hex
  #single
  #currentBuffer
  #width
  #local
  #front
  #back

  constructor() {
    this.#gl = useGLStore()
    this.#hex = useHexStore()
    this.#single = new Uint8Array(1)
    this.#currentBuffer = Buffers.LOCAL
    this.#width = nextPowerOfTwo(this.#hex.cellCount ** 0.5)
    this.#local = new Uint8Array(this.#width * this.#height)

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

  get #height() {
    return Math.ceil(this.#hex.cellCount / this.#width)
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
    this.input.read(0, 0, this.#width, this.#height, this.#local)
    this.#currentBuffer = Buffers.LOCAL
  }

  syncGPU() {
    if (this.currentBuffer !== Buffers.LOCAL) {
      return
    }
    this.#front.write(this.#width, this.#height, this.#local)
    this.#back.write(this.#width, this.#height, this.#local)
    this.#currentBuffer = Buffers.BACK
  }

  getCell(index: number) {
    if (this.currentBuffer === Buffers.LOCAL) {
      return this.#local[index] > 128
    }
    const col = imod(index, this.#width)
    const row = Math.floor(index / this.#width)
    this.input.read(col, row, 1, 1, this.#single)
    return this.#single[0] > 128
  }

  setCell(index: number, state: boolean) {
    if (this.currentBuffer === Buffers.LOCAL) {
      this.#local[index] = state ? 255 : 0
      return
    }
    const col = imod(index, this.#width)
    const row = Math.floor(index / this.#width)
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
    this.#gl.ctx.viewport(0, 0, this.#width, this.#height)
  }

  unbindOutput() {
    this.output.unbindFB()
  }

  delete() {
    this.#front.delete()
    this.#back.delete()
  }

  resize() {
    this.#width = nextPowerOfTwo(this.#hex.cellCount ** 0.5)
    this.#local = new Uint8Array(this.#width * this.#height)
    this.#currentBuffer = Buffers.LOCAL
  }

  inject() {
    return this.#front.inject()
  }
}
