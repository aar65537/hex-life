import { initProgram } from "./program";
import { src as vSrc } from "./vertex"

const src = `#version 300 es
precision mediump float;

out float cellState;

uniform sampler2D cellData;

void main() {
    cellState = gl_FragCoord.x / 6.0;
}
`

function initStep(ctx) {
    return initProgram(ctx, vSrc, src)
}

function step(ctx, program, vao, cellData) {
    const offset = 0
    const vertexCount = 4
    ctx.viewport(0, 0, cellData.textureSize, cellData.textureSize)
    ctx.clear(ctx.COLOR_BUFFER_BIT)
    ctx.useProgram(program)
    ctx.bindVertexArray(vao)
    ctx.bindTexture(ctx.TEXTURE_2D, cellData.back)
    ctx.bindFramebuffer(ctx.FRAMEBUFFER, cellData.frontFB)
    ctx.drawArrays(ctx.TRIANGLE_STRIP, offset, vertexCount)
    ctx.bindFramebuffer(ctx.FRAMEBUFFER, null)
    ctx.bindTexture(ctx.TEXTURE_2D, null)
    ctx.bindVertexArray(null)
    ctx.useProgram(null)
}

export { initStep, step }