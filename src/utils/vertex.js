import { attributeLocations } from "./layout"

const src = `#version 300 es
layout(location = ${ attributeLocations.position }) in vec2 aPos;

void main() {
    gl_Position = vec4(aPos, 0, 1);
}
`

function initVao(ctx) {
    const numComponents = 2
    const type = ctx.FLOAT
    const normalize = false
    const stride = 0
    const offset = 0
    const data = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0]

    const buffer = ctx.createBuffer()
    const vao = ctx.createVertexArray()

    ctx.bindVertexArray(vao)
    ctx.enableVertexAttribArray(attributeLocations.position)
    ctx.bindBuffer(ctx.ARRAY_BUFFER, buffer)
    ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array(data), ctx.STATIC_DRAW)
    ctx.vertexAttribPointer(attributeLocations.position, numComponents, type, normalize, stride, offset)
    ctx.bindVertexArray(null)

    return vao
}

export { src, initVao }