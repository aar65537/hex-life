import type { CellData } from '@/scripts/cells'
import { Uniform } from '@/scripts/shader-utils/uniform'
import { common } from '@/shaders/common'
import { useGLStore } from '@/stores/gl'
import { useHexStore } from '@/stores/hex'

export function spec(cells: CellData) {
  const gl = useGLStore()
  const hex = useHexStore()
  const uniforms = [
    new Uniform(gl.ctx, 'border', gl.ctx.FLOAT, () => hex.border),
    new Uniform(gl.ctx, 'margin', gl.ctx.FLOAT, () => hex.margin),
    new Uniform(gl.ctx, 'size', gl.ctx.FLOAT, () => hex.size),
    new Uniform(gl.ctx, 'zoomMult', gl.ctx.FLOAT, () => gl.zoomMult),
    new Uniform(gl.ctx, 'activeCell', gl.ctx.INT, () => hex.activeCell),
    new Uniform(gl.ctx, 'boardSize', gl.ctx.INT, () => hex.boardSize),
    new Uniform(gl.ctx, 'drawDot', gl.ctx.INT, () => hex.drawDot),
    new Uniform(gl.ctx, 'mirror', gl.ctx.INT, () => hex.mirror),
    new Uniform(gl.ctx, 'resolution', gl.ctx.FLOAT_VEC2, () => gl.resolution),
    new Uniform(gl.ctx, 'center', gl.ctx.FLOAT_VEC2, () => gl.center),
    new Uniform(gl.ctx, 'aliveColor', gl.ctx.FLOAT_VEC4, () => hex.aliveColor),
    new Uniform(gl.ctx, 'borderColor', gl.ctx.FLOAT_VEC4, () => hex.borderColor),
    new Uniform(gl.ctx, 'deadColor', gl.ctx.FLOAT_VEC4, () => hex.deadColor),
    new Uniform(gl.ctx, 'highlightBorderColor', gl.ctx.FLOAT_VEC4, () => hex.highlightBorderColor),
    new Uniform(gl.ctx, 'marginColor', gl.ctx.FLOAT_VEC4, () => hex.marginColor),
  ]
  const src = /*glsl*/ `#version 300 es

precision mediump float;

out vec4 outColor;

${cells.inject()}
${Uniform.inject(uniforms)}
${common}

vec2 axialToPixel(ivec2 axial) {
    return size * mat2(sqrt(3.0), 0.0, sqrt(3.0) / 2.0, -3.0 / 2.0) * vec2(axial);
}

ivec2 pixelToAxial(vec2 pixel) {
    // Calculate cube coordinates
    vec2 frac_cell = mat2(sqrt(3.0) / 3.0, 0.0, 1.0 / 3.0, -2.0 / 3.0) * pixel / size;
    int q = int(floor(frac_cell.x + 0.5));
    int r = int(floor(frac_cell.y + 0.5));
    int s = int(floor(-frac_cell.x - frac_cell.y + 0.5));

    // Round cube coordinates
    float qDiff = abs(float(q) - frac_cell.x);
    float rDiff = abs(float(r) - frac_cell.y);
    float sDiff = abs(float(s) + frac_cell.x + frac_cell.y);
    if(qDiff > rDiff && qDiff > sDiff) {
        q = -r - s;
    } else if(rDiff > sDiff) {
        r = -q - s;
    }

    // First two cube coordinates are axial coordinates
    return ivec2(q, r);
}

vec4 pixelColor(vec2 pixel, ivec2 axial, int index) {
    vec2 cellCenter = axialToPixel(axial);
    float d = distance(pixel, cellCenter);
    float innerRadius = size * sqrt(3.0) / 2.0;
    if (drawDot > 0 && d >= innerRadius - margin) {
        return marginColor;
    } else if (drawDot > 0 && d >= innerRadius - margin - border) {
        return activeCell == index ? highlightBorderColor : borderColor;
    } else if (getCell(index)) {
        return aliveColor;
    } else {
      return deadColor;
    }
}

void main() {
    vec2 pixel = (2.0 * gl_FragCoord.xy - resolution) / min(resolution.x, resolution.y);
    pixel = pixel * zoomMult + center;
    ivec2 axial = pixelToAxial(pixel);
    int index = axialToIndex(axial);
    if (mirror > 0 || inCore(axial)) {
        outColor = pixelColor(pixel, axial, index);
    } else {
        outColor = marginColor;
    }
}
`
  return { uniforms, src }
}
