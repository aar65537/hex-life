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

ivec2 indexToAxial(int index) {
    index = imod(index, cellCount());
    ivec2 axial = ivec2(0, 0);
    int width = boardSize;
    while(true) {
        if(index < width) {
            axial.x += index;
            return axial;
        }
        index -= width;
        if(axial.y > 0) {
            axial.y -= boardSize;
        } else {
            axial.y += boardSize - 1;
        }
        axial.x = -(boardSize - 1) - min(axial.y, 0);
        width = 2 * boardSize - abs(axial.y) - 1;
    }
}

int neighborOffsetIndex(int index) {
    int axis = index / 2;
    int direction = index % 2;
    int offset = 0;
    if (axis == 0) {
        offset = 1;
    } else if (axis == 1) {
        offset = rStep();
    } else {
        offset = rStep() - 1;
    }
    if (direction == 1) {
        offset *= -1;
    }
    return offset;
}

ivec2 neighborOffsetAxial[6] = ivec2[](
    ivec2(1, 0), ivec2(-1, 0),
    ivec2(0, 1), ivec2(0, -1),
    ivec2(-1, 1), ivec2(1, -1)
);

bool getNeighbor(int cellIndex, int neighborIndex) {
    if(wrap > 0) {
        int neighbor = cellIndex + neighborOffsetIndex(neighborIndex);
        neighbor = imod(neighbor, cellCount());
        return getCell(neighbor);
    }
    ivec2 axial = indexToAxial(cellIndex);
    ivec2 neighbor = axial + neighborOffsetAxial[neighborIndex];
    neighborIndex = axialToIndex(neighbor);
    return inCore(neighbor) && getCell(neighborIndex);
}

int sumOfNeighbors(int index) {
    int sum = 0;
    for(int i = 0; i < 6; i++) {
        sum += getNeighbor(index, i) ? 1 : 0;
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
