import { CellData } from "./cells"
import { resolution } from "./store"
import { initProgram, initVao } from "../shaders/utils"
import { uniforms as drawUniforms, src as drawSrc } from "../shaders/draw"
import { uniforms as stepUniforms, src as stepSrc  } from "../shaders/step"
import { src as vertexSrc } from "../shaders/vertex"

const offset = 0
const vertexCount = 4
 
export class Game {
    #ctx
    #vao
    #cells
    #drawProgram
    #stepProgram
    #drawing
    #stepping
    #drawingID
    #steppingID

    constructor(ctx) {
        this.#ctx = ctx
        this.#vao = initVao(this.#ctx)
        this.#cells = new CellData(this.#ctx)
        this.#drawProgram = initProgram(this.#ctx, vertexSrc, drawSrc, drawUniforms)
        this.#stepProgram = initProgram(this.#ctx, vertexSrc, stepSrc, stepUniforms)
        this.#drawing = false
        this.#stepping = false
    }

    destructor() {
        console.log("destructing game")
    }

    get cells() {
        return this.#cells
    }

    get drawing() {
        return this.#drawing
    }

    get stepping() {
        return this.#stepping
    }

    startDrawing(fps) {
        if(this.drawing) {
            this.stopDrawing()
        }
        this.#drawingID = window.setInterval(this.draw.bind(this), 1000.0 / fps)
        this.#drawing = true
    }

    stopDrawing() {
        if(this.drawing) {
            clearInterval(this.#drawingID)
        }
        this.#drawing = false

    }

    toggleDrawing(fps) {
        if(this.drawing){
            this.stopDrawing()
        } else {
            this.startDrawing(fps)
        }
    }

    startStepping(sps) {
        if(this.stepping) {
            this.stopStepping()
        }
        this.#steppingID = window.setInterval(this.step.bind(this), 1000.0 / sps)
        this.#stepping = true
    }

    stopStepping() {
        if(this.stepping) {
            clearInterval(this.#steppingID)
        }
        this.#stepping = false
    }

    toggleStepping(sps) {
        if(this.stepping) {
            this.stopStepping()
        } else {
            this.startStepping(sps)
        }
    }

    draw() {
        this.#ctx.viewport(0, 0, ...resolution.value)
        this.#ctx.useProgram(this.#drawProgram)
        this.#ctx.bindVertexArray(this.#vao)
        this.cells.syncGPU()
        this.#ctx.bindTexture(this.#ctx.TEXTURE_2D, this.cells.currentBuffer)
        drawUniforms.forEach(uniform => {uniform.apply(this.#ctx)})
        this.#ctx.drawArrays(this.#ctx.TRIANGLE_STRIP, offset, vertexCount)
        this.#ctx.bindTexture(this.#ctx.TEXTURE_2D, null)
        this.#ctx.bindVertexArray(null)
        this.#ctx.useProgram(null)
    }

    step() {
        this.cells.viewport()
        this.#ctx.useProgram(this.#stepProgram)
        this.#ctx.bindVertexArray(this.#vao)
        this.cells.syncGPU()
        this.#ctx.bindTexture(this.#ctx.TEXTURE_2D, this.cells.currentBuffer)
        this.#ctx.bindFramebuffer(this.#ctx.FRAMEBUFFER, this.cells.currentFB)
        stepUniforms.forEach(uniform => {uniform.apply(this.#ctx)})
        this.#ctx.drawArrays(this.#ctx.TRIANGLE_STRIP, offset, vertexCount)
        this.#ctx.bindFramebuffer(this.#ctx.FRAMEBUFFER, null)
        this.#ctx.bindTexture(this.#ctx.TEXTURE_2D, null)
        this.#ctx.bindVertexArray(null)
        this.#ctx.useProgram(null)
        this.cells.flip()
    }
}
