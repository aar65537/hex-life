import { CellData } from '@/scripts/cells'
import { VertexArray, VertexBuffer } from '@/scripts/shader-utils/vertex'
import { Program } from '@/scripts/shader-utils/program'
import { spec as specScene2D } from '@/shaders/scene2D'
import { spec as specDraw } from '@/shaders/draw'
import { spec as specStep } from '@/shaders/step'
import { useGLStore } from '@/stores/gl'

const offset = 0
const vertexCount = 4

export class Game {
  #gl
  #vb
  #vao
  #cells
  #draw
  #step

  constructor() {
    this.#gl = useGLStore()

    const ctx = this.#gl.ctx
    const index = 0
    const size = 2
    const type = ctx.FLOAT
    const glslType = 'vec2'
    const normal = false
    const stride = 0
    const offset = 0
    const data = new Float32Array([1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0])

    this.#vb = new VertexBuffer(ctx, 'pos2D', index, size, type, glslType, normal, stride, offset)
    this.#vb.write(data, ctx.STATIC_DRAW)
    this.#vao = new VertexArray(ctx, [this.#vb])
    this.#cells = new CellData()
    this.#draw = new Program(ctx, specScene2D(this.#vao), specDraw(this.#cells))
    this.#step = new Program(ctx, specScene2D(this.#vao), specStep(this.#cells))
  }

  get cells() {
    return this.#cells
  }

  bind() {
    this.#vao.bind()
    this.cells.bindInput()
  }

  unbind() {
    this.cells.unbindInput()
    this.#vao.unbind()
  }

  delete() {
    this.#step.delete()
    this.#draw.delete()
    this.cells.delete()
    this.#vao.delete()
    this.#vb.delete()
  }

  draw() {
    this.#gl.tick()
    this.bind()
    this.#draw.bind()
    this.#gl.ctx.viewport(0, 0, this.#gl.resolution[0], this.#gl.resolution[1])
    this.#gl.ctx.drawArrays(this.#gl.ctx.TRIANGLE_STRIP, offset, vertexCount)
    this.#draw.unbind()
    this.unbind()
  }

  step() {
    this.bind()
    this.#step.bind()
    this.cells.bindOutput()
    this.#gl.ctx.drawArrays(this.#gl.ctx.TRIANGLE_STRIP, offset, vertexCount)
    this.cells.unbindOutput()
    this.#step.unbind()
    this.unbind()
    this.cells.flip()
  }
}
