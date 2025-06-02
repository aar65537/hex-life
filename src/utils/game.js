import { initVao } from "./vertex"
import { initDraw, draw } from "./draw"

class Game {
    constructor(canvas_ctx, resolution) {
        this.canvas_ctx = canvas_ctx
        this.resolution = resolution

        this.vao = initVao(canvas_ctx)
        this.drawProgram = initDraw(canvas_ctx)

        canvas_ctx.clearColor(0.0, 0.0, 0.0, 1.0)
    }

    draw() {

        draw(this.canvas_ctx, this.drawProgram, this.vao, this.resolution)
    }
}

export { Game }