import type { CellData } from '@/scripts/cells'
import { Uniform } from '@/scripts/shader-utils/uniform'
import { common } from '@/shaders/common'
import { useGLStore } from '@/stores/gl'
import { useHexStore } from '@/stores/hex'

export function spec(cells: CellData) {
  const gl = useGLStore()
  const hex = useHexStore()
  const uniforms = [
    new Uniform(gl.ctx, 'boardSize', gl.ctx.INT, () => hex.boardSize),
    new Uniform(gl.ctx, 'ruleSet', gl.ctx.INT, () => hex.ruleSet),
    new Uniform(gl.ctx, 'wrap', gl.ctx.INT, () => hex.wrap),
  ]
  const src = /*glsl*/ `#version 300 es

precision mediump float;

out float cellState;

${cells.inject()}
${Uniform.inject(uniforms)}
${common}

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
    int ruleNumber = (getCell(index) ? 7 : 0) + sumOfNeighbors(index);
    cellState = (ruleSet & (1 << ruleNumber)) > 0 ? 1.0 : 0.0;
}
`
  return { uniforms, src }
}
