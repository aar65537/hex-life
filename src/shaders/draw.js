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

float size = 0.075;
float margin = 0.003;
float border = 0.003;
vec4 marginColor = vec4(0.075, 0.115, 0.25, 1);
vec4 borderColor = vec4(1.0, 0.8, 0.4, 1);
vec4 aliveColor = vec4(0.9, 0.95, 0.85, 1);
vec4 deadColor = vec4(0.1, 0.2, 0.35, 1);

${prefix}

vec2 cellToPixel(Cell cell) {
    return size * mat2(sqrt(3.0), 0.0, sqrt(3.0) / 2.0, -3.0 / 2.0) * (vec2(cell.q - worldSize + 1, cell.r - worldSize + 1));
}

Cell pixelToCell(vec2 pixel) {
    vec2 frac_cell = mat2(sqrt(3.0) / 3.0, 0.0, 1.0 / 3.0, -2.0 / 3.0) * pixel / size + float(worldSize - 1);
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

    return Cell(q, r);
}

bool inCell(vec2 pixel, Cell cell) {
    vec2 cellCenter = cellToPixel(cell);
    return distance(pixel, cellCenter) < (size * sqrt(3.0) / 2.0 - margin);
}

vec4 cellColor(Cell cell) {
    float maxIndex = float(2 * (worldSize - 1));
    return vec4(float(abs(cell.q)) / maxIndex, float(abs(cell.r)) / maxIndex, 0.0, 1.0);
}

vec4 pixelColor(vec2 pixel, Cell cell) {
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
    Cell cell = pixelToCell(pixel);
    if (inWorld(cell)) {
        outColor = pixelColor(pixel, cell);
    } else {
        outColor = marginColor;
    }
}
`
export function initDraw(ctx){
    const program = initProgram(ctx, vSrc, src)
    uniformLocations.resolution = ctx.getUniformLocation(program, "uResolution")
    uniformLocations.viewCenter = ctx.getUniformLocation(program, "viewCenter")
    uniformLocations.zoom = ctx.getUniformLocation(program, "zoom")
    return program
}
