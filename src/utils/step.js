import { prefix } from "./common";
import { initProgram } from "./program";
import { src as vSrc } from "./vertex"

const src = `#version 300 es
precision mediump float;

out float cellState;

${prefix}

Cell neighbor(int index, Cell cell) {
    if(index == 0){
        return Cell(cell.q + 1, cell.r);
    } else if(index == 1) {
        return Cell(cell.q + 1, cell.r - 1);
    } else if(index == 2) {
        return Cell(cell.q, cell.r - 1);
    } else if(index == 3) {
        return Cell(cell.q - 1, cell.r);
    } else if(index == 4) {
        return Cell(cell.q - 1, cell.r + 1);
    } else if(index == 5){
        return Cell(cell.q, cell.r + 1);
    }
}

int sumOfNeighbors(Cell cell) {
    int sum = 0;
    for(int i = 0; i < 6; i++){
        Cell neighborCell = neighbor(i, cell);
        if(inWorld(neighborCell)){
            sum += isCellAlive(neighborCell) ? 1 : 0; 
        }
    }
    return sum;
}

void main() {
    Cell cell = Cell(int(gl_FragCoord.x), int(gl_FragCoord.y));
    int numOfNeighbors = sumOfNeighbors(cell);
    if(numOfNeighbors == 2) {
        cellState = 1.0;
    } else {
        cellState = 0.0;
    }
}
`

function initStep(ctx) {
    return initProgram(ctx, vSrc, src)
}

function step(ctx, program, vao, cellData) {
    const offset = 0
    const vertexCount = 4
    ctx.viewport(0, 0, cellData.textureSize, cellData.textureSize)
    ctx.clear(ctx.COLOR_BUFFER_BIT)
    ctx.useProgram(program)
    ctx.bindVertexArray(vao)
    ctx.bindTexture(ctx.TEXTURE_2D, cellData.getCurrentBuffer())
    ctx.bindFramebuffer(ctx.FRAMEBUFFER, cellData.getCurrentFB())
    ctx.drawArrays(ctx.TRIANGLE_STRIP, offset, vertexCount)
    ctx.bindFramebuffer(ctx.FRAMEBUFFER, null)
    ctx.bindTexture(ctx.TEXTURE_2D, null)
    ctx.bindVertexArray(null)
    ctx.useProgram(null)
    cellData.flip()
}

export { initStep, step }