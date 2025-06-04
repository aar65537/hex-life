import { prefix } from "./common";
import { initProgram } from "./init";
import { src as vSrc } from "./vertex"
import { uniformLocations } from "../scripts/store";

const src = `#version 300 es
precision mediump float;

out float cellState;

${prefix}

ivec2 neighbors[6] = ivec2[6](
    ivec2(1, 0), ivec2(0, 1), ivec2(-1, 0), ivec2(0, -1), ivec2(1, -1), ivec2(-1, 1)
);

int sumOfNeighbors(ivec2 cell) {
    int sum = 0;
    for(int i = 0; i < 6; i++) {
        ivec2 neighbor = cell + neighbors[i];
        if(inWorld(neighbor)) {
            sum += isAlive(neighbor) ? 1 : 0; 
        }
    }
    return sum;
}

void main() {
    ivec2 cell = ivec2(gl_FragCoord);
    int numOfNeighbors = sumOfNeighbors(cell);
    if(numOfNeighbors == 2) {
        cellState = 1.0;
    } else {
        cellState = 0.0;
    }
}
`

export function initStep(ctx) {
    const program = initProgram(ctx, vSrc, src)
    uniformLocations.stepBoardSize = ctx.getUniformLocation(program, "boardSize")
    return program
}
