import { resolution } from "@/store"
import { CellData } from "@/scripts/cells"
import { Program } from "@/scripts/program"
import { Vao } from "@/scripts/vao"
import { src as drawSrc, uniforms as drawUniforms } from "@/shaders/draw"
import { src as stepSrc, uniforms as stepUniforms } from "@/shaders/step"
import { src as vertexSrc } from "@/shaders/vertex"

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
        this.#vao = new Vao(this.#ctx)
        this.#cells = new CellData(this.#ctx)
        this.#drawProgram = new Program(this.#ctx, vertexSrc, drawSrc, drawUniforms)
        this.#stepProgram = new Program(this.#ctx, vertexSrc, stepSrc, stepUniforms)
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
        this.#drawProgram.bind()
        this.#vao.bind()
        this.cells.syncGPU()
        this.#ctx.bindTexture(this.#ctx.TEXTURE_2D, this.cells.currentBuffer)
        this.#ctx.drawArrays(this.#ctx.TRIANGLE_STRIP, offset, vertexCount)
        this.#ctx.bindTexture(this.#ctx.TEXTURE_2D, null)
        this.#vao.unbind()
        this.#drawProgram.unbind()
    }

    step() {
        this.cells.viewport()
        this.#stepProgram.bind()
        this.#vao.bind()
        this.cells.syncGPU()
        this.#ctx.bindTexture(this.#ctx.TEXTURE_2D, this.cells.currentBuffer)
        this.#ctx.bindFramebuffer(this.#ctx.FRAMEBUFFER, this.cells.currentFB)
        this.#ctx.drawArrays(this.#ctx.TRIANGLE_STRIP, offset, vertexCount)
        this.#ctx.bindFramebuffer(this.#ctx.FRAMEBUFFER, null)
        this.#ctx.bindTexture(this.#ctx.TEXTURE_2D, null)
        this.#vao.unbind()
        this.#stepProgram.unbind()
        this.cells.flip()
    }
}
