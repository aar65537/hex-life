import { prefix } from "./common"
import { initProgram } from "./init"
import { src as vSrc } from "./vertex"
import { uniformLocations } from "../scripts/store"

const src  = `#version 300 es
precision mediump float;

out vec4 outColor;

uniform int mirror;
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

int axialToIndex(ivec2 axial) {
    return imod(axial.x - axial.y * qStep(), cellCount());
}

bool inWorld(ivec2 axial) {
    int q = abs(axial.x);
    int r = abs(axial.y);
    int s = abs(axial.x + axial.y);
    return mirror > 0 || (q < boardSize && r < boardSize && s < boardSize);
}

vec4 pixelColor(vec2 pixel, ivec2 axial, int index) {
    vec2 cellCenter = axialToPixel(axial);
    float d = distance(pixel, cellCenter);
    float innerRadius = size * sqrt(3.0) / 2.0;
    if (d >= innerRadius - margin) {
        return marginColor;
    } else if (d >= innerRadius - margin - border) {
        return borderColor;
    } else if (getCell(index)) {
        return aliveColor;
    } else {
       return deadColor;
    }
}

void main() {
    vec2 pixel = (2.0 * gl_FragCoord.xy - uResolution) / min(uResolution.x, uResolution.y);
    pixel = pixel / zoom + viewCenter;
    ivec2 axial = pixelToAxial(pixel);
    int index = axialToIndex(axial);
    if (inWorld(axial)) {
        outColor = pixelColor(pixel, axial, index);
    } else {
        outColor = marginColor;
    }
}
`
export function initDraw(ctx){
    const program = initProgram(ctx, vSrc, src)
    uniformLocations.drawBoardSize = ctx.getUniformLocation(program, "boardSize")
    uniformLocations.mirror = ctx.getUniformLocation(program, "mirror")
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
