import { CellData } from "./data"
import { initDraw, draw } from "./draw"
import { initStep, step } from "./step"
import { initVao } from "./vertex"

class Game {
    constructor(ctx, resolution) {
        this.ctx = ctx
        this.resolution = resolution
        this.vao = initVao(ctx)
        this.cellData = new CellData(ctx)
        this.stepProgram = initStep(ctx)
        this.drawProgram = initDraw(ctx)
        ctx.clearColor(0.0, 0.0, 0.0, 1.0)
    }

    draw() {
        draw(this.ctx, this.drawProgram, this.vao, this.cellData, this.resolution)
    }

    step() {
        step(this.ctx, this.stepProgram, this.vao, this.cellData)
    }
}

export { Game }