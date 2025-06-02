import { attributeLocations } from "../scripts/store"

function loadShader (ctx, type, src) {
    const shader = ctx.createShader(type)

    ctx.shaderSource(shader, src)
    ctx.compileShader(shader)

    if (!ctx.getShaderParameter(shader, ctx.COMPILE_STATUS)) {
        alert(`An error occurred compiling the shaders: ${ctx.getShaderInfoLog(shader)}`)
        ctx.deleteShader(shader)
        return null
    }

    return shader
}

export function initProgram(ctx, vSrc, fSrc) {
    const vShader = loadShader(ctx, ctx.VERTEX_SHADER, vSrc)
    const fShader = loadShader(ctx, ctx.FRAGMENT_SHADER, fSrc)
    const program = ctx.createProgram()

    ctx.attachShader(program, vShader)
    ctx.attachShader(program, fShader)
    ctx.linkProgram(program)

    if (!ctx.getProgramParameter(program, ctx.LINK_STATUS)) {
        alert(`An error occurred linking the shaders: ${ctx.getProgramInfoLog(program)}`)
        ctx.deleteProgram(program)
        return null
     }

     return program
}

export function initVao(ctx) {
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
    ctx.bindBuffer(ctx.ARRAY_BUFFER, null)
    ctx.bindVertexArray(null)

    return vao
}
