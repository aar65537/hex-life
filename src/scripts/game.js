import { CellData } from "./cells"
import { resolution, uniformLocations } from "./store"
import { initVao } from "../shaders/init"
import { initDraw } from "../shaders/draw"
import { initStep } from "../shaders/step"

export class Game {
    #ctx
    #vao
    #cells
    #stepProgram
    #drawProgram

    constructor(ctx) {
        this.#ctx = ctx
        this.#vao = initVao(this.#ctx)
        this.#cells = new CellData(this.#ctx)
        this.#drawProgram = initDraw(this.#ctx)
        this.#stepProgram = initStep(this.#ctx)
    }

    get cells() {
        return this.#cells
    }

    draw() {
        const offset = 0
        const vertexCount = 4
        this.#ctx.viewport(0, 0, resolution.value.width, resolution.value.height)
        this.#ctx.useProgram(this.#drawProgram)
        this.#ctx.bindVertexArray(this.#vao)
        this.#ctx.bindTexture(this.#ctx.TEXTURE_2D, this.#cells.currentBuffer)
        this.#ctx.uniform2f(uniformLocations.resolution, resolution.value.width, resolution.value.height)
        this.#ctx.drawArrays(this.#ctx.TRIANGLE_STRIP, offset, vertexCount)
        this.#ctx.bindTexture(this.#ctx.TEXTURE_2D, null)
        this.#ctx.bindVertexArray(null)
        this.#ctx.useProgram(null)
    }

    step() {
        const offset = 0
        const vertexCount = 4
        this.#ctx.viewport(0, 0, this.#cells.textureSize, this.#cells.textureSize)
        this.#ctx.useProgram(this.#stepProgram)
        this.#ctx.bindVertexArray(this.#vao)
        this.#ctx.bindTexture(this.#ctx.TEXTURE_2D, this.#cells.currentBuffer)
        this.#ctx.bindFramebuffer(this.#ctx.FRAMEBUFFER, this.#cells.currentFB)
        this.#ctx.drawArrays(this.#ctx.TRIANGLE_STRIP, offset, vertexCount)
        this.#ctx.bindFramebuffer(this.#ctx.FRAMEBUFFER, null)
        this.#ctx.bindTexture(this.#ctx.TEXTURE_2D, null)
        this.#ctx.bindVertexArray(null)
        this.#ctx.useProgram(null)
        this.#cells.flip()
    }
}
