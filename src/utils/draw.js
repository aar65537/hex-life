import { prefix } from "./common"
import { uniformLocations } from "./layout"
import { initProgram } from "./program"
import { src as vSrc } from "./vertex"

const src  = `#version 300 es
precision mediump float;

out vec4 outColor;

uniform vec2 uResolution;

float size = 0.12;
float spacing = 0.005;

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
    return distance(pixel, cellCenter) < (size * sqrt(3.0) / 2.0 - spacing);
}

vec4 cellColor(Cell cell) {
    float maxIndex = float(2 * (worldSize - 1));
    return vec4(float(abs(cell.q)) / maxIndex, float(abs(cell.r)) / maxIndex, 0.0, 1.0);
}

void main() {
    vec2 pixel = (2.0 * gl_FragCoord.xy - uResolution) / min(uResolution.x, uResolution.y);
    Cell cell = pixelToCell(pixel);
    if (inWorld(cell) && inCell(pixel, cell) && isCellAlive(cell)){
        outColor = cellColor(cell);
    } else {
        outColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
}
`
function initDraw(ctx){
    const program = initProgram(ctx, vSrc, src)
    uniformLocations.resolution = ctx.getUniformLocation(program, "uResolution")
    return program
}

function draw(ctx, program, vao, cellData, resolution) {
    const offset = 0
    const vertexCount = 4
    ctx.viewport(0, 0, resolution.width, resolution.height)
    ctx.clear(ctx.COLOR_BUFFER_BIT)
    ctx.useProgram(program)
    ctx.bindVertexArray(vao)
    ctx.bindTexture(ctx.TEXTURE_2D, cellData.getCurrentBuffer())
    ctx.uniform2f(uniformLocations.resolution, resolution.width, resolution.height)
    ctx.drawArrays(ctx.TRIANGLE_STRIP, offset, vertexCount)
    ctx.bindTexture(ctx.TEXTURE_2D, null)
    ctx.bindVertexArray(null)
    ctx.useProgram(null)
}

export { initDraw, draw }