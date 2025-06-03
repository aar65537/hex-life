import { prefix } from "./common";
import { initProgram } from "./init";
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
            sum += isAlive(neighborCell) ? 1 : 0; 
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

export function initStep(ctx) {
    return initProgram(ctx, vSrc, src)
}
