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

function initProgram(ctx, vSrc, fSrc) {
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

export { initProgram }