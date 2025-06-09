import { prefix } from "./common"
import { Uniform } from "@/scripts/uniform"
import { 
    border, margin, size, zoom, boardSize, mirror, resolution,
    viewCenter, aliveColor, borderColor, deadColor, marginColor,
} from "@/scripts/store"

export const uniforms = [
    new Uniform("border", border, "float"),
    new Uniform("margin", margin, "float"),
    new Uniform("size", size, "float"),
    new Uniform("zoom", zoom, "float"),
    new Uniform("boardSize", boardSize, "int"),
    new Uniform("mirror", mirror, "int"),
    new Uniform("uResolution", resolution, "vec2"),
    new Uniform("viewCenter", viewCenter, "vec2"),
    new Uniform("aliveColor", aliveColor, "vec4"),
    new Uniform("borderColor", borderColor, "vec4"),
    new Uniform("deadColor", deadColor, "vec4"),
    new Uniform("marginColor", marginColor, "vec4"),
]

export const src  = `#version 300 es
precision mediump float;

out vec4 outColor;

${Uniform.inject(uniforms)}
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
