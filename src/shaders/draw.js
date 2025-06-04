import { prefix } from "./common"
import { initProgram } from "./init"
import { src as vSrc } from "./vertex"
import { uniformLocations } from "../scripts/store"

const src  = `#version 300 es
precision mediump float;

out vec4 outColor;

uniform vec2 uResolution;
uniform vec2 viewCenter;
uniform float zoom;
uniform float size;
uniform float margin;
uniform float border;
uniform vec4 marginColor;
uniform vec4 borderColor;
uniform vec4 aliveColor;
uniform vec4 deadColor;

${prefix}

vec2 cellToPixel(ivec2 cell) {
    return size * mat2(sqrt(3.0), 0.0, sqrt(3.0) / 2.0, -3.0 / 2.0) * vec2(cell - boardSize + 1);
}

ivec2 pixelToCell(vec2 pixel) {
    vec2 frac_cell = mat2(sqrt(3.0) / 3.0, 0.0, 1.0 / 3.0, -2.0 / 3.0) * pixel / size + float(boardSize - 1);
    int q = int(floor(frac_cell.x + 0.5));
    int r = int(floor(frac_cell.y + 0.5));
    int s = int(floor(-frac_cell.x - frac_cell.y + 0.5));

    float q_diff = abs(float(q) - frac_cell.x);
    float r_diff = abs(float(r) - frac_cell.y);
    float s_diff = abs(float(s) + frac_cell.x + frac_cell.y);

    if(q_diff > r_diff && q_diff > s_diff) {
        q = -r - s;
    } else if(r_diff > s_diff) {
        r = -q - s;
    }

    return ivec2(q, r);
}

vec4 cellColor(ivec2 cell) {
    float maxIndex = float(2 * (boardSize - 1));
    return vec4(vec2(abs(cell)) / maxIndex, 0.0, 1.0);
}

vec4 pixelColor(vec2 pixel, ivec2 cell) {
    vec2 cellCenter = cellToPixel(cell);
    float d = distance(pixel, cellCenter);
    float innerRadius = size * sqrt(3.0) / 2.0;
    if (d >= innerRadius - margin) {
        return marginColor;
    } else if (d >= innerRadius - margin - border) {
        return borderColor;
    } else if (isAlive(cell)) {
        return aliveColor;
    } else {
       return deadColor;
    }
}

void main() {
    vec2 pixel = (2.0 * gl_FragCoord.xy - uResolution) / min(uResolution.x, uResolution.y);
    pixel = pixel / zoom + viewCenter;
    ivec2 cell = pixelToCell(pixel);
    if (inWorld(cell)) {
        outColor = pixelColor(pixel, cell);
    } else {
        outColor = marginColor;
    }
}
`
export function initDraw(ctx){
    const program = initProgram(ctx, vSrc, src)
    uniformLocations.drawBoardSize = ctx.getUniformLocation(program, "boardSize")
    uniformLocations.resolution = ctx.getUniformLocation(program, "uResolution")
    uniformLocations.viewCenter = ctx.getUniformLocation(program, "viewCenter")
    uniformLocations.zoom = ctx.getUniformLocation(program, "zoom")
    uniformLocations.size = ctx.getUniformLocation(program, "size")
    uniformLocations.margin = ctx.getUniformLocation(program, "margin")
    uniformLocations.border = ctx.getUniformLocation(program, "border")
    uniformLocations.marginColor = ctx.getUniformLocation(program, "marginColor")
    uniformLocations.borderColor = ctx.getUniformLocation(program, "borderColor")
    uniformLocations.aliveColor = ctx.getUniformLocation(program, "aliveColor")
    uniformLocations.deadColor = ctx.getUniformLocation(program, "deadColor")
    return program
}
