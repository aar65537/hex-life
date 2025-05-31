const vSrc = `
attribute vec2 aPos;

void main() {
    gl_Position = vec4(aPos, 0.0, 1.0);
}
`

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

function initProgram(ctx, fSrc) {
    const vShader = loadShader(ctx, ctx.VERTEX_SHADER, vSrc)
    const fShader = loadShader(ctx, ctx.FRAGMENT_SHADER, fSrc)
    const program = ctx.createProgram()

    ctx.attachShader(program, vShader)
    ctx.attachShader(program, fShader)
    ctx.linkProgram(program)

    if (!ctx.getProgramParameter(program, ctx.LINK_STATUS)) {
        alert(`An error occurred linking the shaders: ${ctx.getProgramInfoLog(program)}`)
        return null
     }

     return program
}


function initBuffers(ctx) {
    const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0]
    const positionBuffer = ctx.createBuffer()

    ctx.bindBuffer(ctx.ARRAY_BUFFER, positionBuffer)
    ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array(positions), ctx.STATIC_DRAW)

    return {
        position: positionBuffer
    }
}


function setPositionAttribute(ctx, programInfo, buffers) {
    const numComponents = 2
    const type = ctx.FLOAT
    const normalize = false
    const stride = 0
    const offset = 0

    ctx.bindBuffer(ctx.ARRAY_BUFFER, buffers.position)
    ctx.vertexAttribPointer(programInfo.attributeLocations.vertexPosition, numComponents, type, normalize, stride, offset)
    ctx.enableVertexAttribArray(programInfo.attributeLocations.vertexPosition)
}

function draw(ctx, programInfo, buffers) {
    const offset = 0
    const vertexCount = 4

    ctx.clear(ctx.COLOR_BUFFER_BIT)
    setPositionAttribute(ctx, programInfo, buffers)
    ctx.useProgram(programInfo.program)
    ctx.drawArrays(ctx.TRIANGLE_STRIP, offset, vertexCount)
}

export {
    initProgram,
    initBuffers,
    draw,
}