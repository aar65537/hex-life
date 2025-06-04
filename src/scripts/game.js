import { CellData } from "./cells"
import { resolution, uniformLocations, viewCenter, zoom } from "./store"
import { initVao } from "../shaders/init"
import { initDraw } from "../shaders/draw"
import { initStep } from "../shaders/step"

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
        this.#drawProgram = initDraw(this.#ctx)
        this.#stepProgram = initStep(this.#ctx)
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
        if(!this.drawing) {
            this.#drawingID = window.setInterval(this.draw.bind(this), 1000.0 / fps)
        }
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
        if(!this.stepping) {
            this.#steppingID = window.setInterval(this.step.bind(this), 1000.0 / sps)
        }
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
        const offset = 0
        const vertexCount = 4
        this.#ctx.viewport(0, 0, resolution.value.width, resolution.value.height)
        this.#ctx.useProgram(this.#drawProgram)
        this.#ctx.bindVertexArray(this.#vao)
        this.#ctx.bindTexture(this.#ctx.TEXTURE_2D, this.#cells.currentBuffer)
        this.#ctx.uniform2f(uniformLocations.resolution, resolution.value.width, resolution.value.height)
        this.#ctx.uniform2f(uniformLocations.viewCenter, viewCenter.value.x, viewCenter.value.y)
        this.#ctx.uniform1f(uniformLocations.zoom, zoom.value)
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
