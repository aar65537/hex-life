import { CellData } from "./data"
import { initDraw, draw } from "./draw"
import { initStep, step } from "./step"
import { initVao } from "./vertex"

class Game {
    constructor(canvas_ctx, resolution) {
        this.canvas_ctx = canvas_ctx
        this.resolution = resolution

        this.vao = initVao(canvas_ctx)
        this.cellData = new CellData(canvas_ctx)
        this.stepProgram = initStep(canvas_ctx)
        this.drawProgram = initDraw(canvas_ctx)

        canvas_ctx.clearColor(0.0, 0.0, 0.0, 1.0)
    }

    draw() {
        draw(this.canvas_ctx, this.drawProgram, this.vao, this.cellData, this.resolution)
    }

    step() {
        step(this.canvas_ctx, this.stepProgram, this.vao, this.cellData)

    }
}

export { Game }