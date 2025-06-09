import { boardSize, wrap } from "@/store";
import { prefix } from "@/shaders/common";
import { Uniform } from "@/scripts/uniform";

export const uniforms = [
    new Uniform("boardSize", boardSize, "int"),
    new Uniform("wrap", wrap, "int"),
]

export const src = `#version 300 es
precision mediump float;

out float cellState;

${Uniform.inject(uniforms)}
${prefix}

int neighborOffset(int index) {
    int axis = index / 2;
    int direction = index % 2;
    int offset = 0;
    if (axis == 0) {
        offset = 1;
    } else if (axis == 1) {
        offset = qStep();
    } else {
        offset = qStep() + 1;
    }
    if (direction == 1) {
        offset *= -1;
    }
    return offset;
}

int neighbor(int cellIndex, int neighborIndex) {
    return imod(cellIndex + neighborOffset(neighborIndex), cellCount());
}

int sumOfNeighbors(int index) {
    int sum = 0;
    for(int i = 0; i < 6; i++) {
        sum += getCell(neighbor(index, i)) ? 1 : 0;
    }
    return sum;
}

void main() {
    int width = textureSize(cellData, 0).x;
    ivec2 pixel = ivec2(gl_FragCoord);
    int index = pixel.x + width * pixel.y;
    int numOfNeighbors = sumOfNeighbors(index);
    if(numOfNeighbors == 2) {
        cellState = 1.0;
    } else {
        cellState = 0.0;
    }
}
`
