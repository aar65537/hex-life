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

export class Program {
    #ctx
    #program
    #uniforms

    constructor(ctx, vSrc, fSrc, uniforms) {
        this.#ctx = ctx
        this.#program = ctx.createProgram()
        this.#uniforms = uniforms

        ctx.attachShader(this.#program, loadShader(ctx, ctx.VERTEX_SHADER, vSrc))
        ctx.attachShader(this.#program, loadShader(ctx, ctx.FRAGMENT_SHADER, fSrc))
        ctx.linkProgram(this.#program)

        if (!ctx.getProgramParameter(this.#program, ctx.LINK_STATUS)) {
            alert(`An error occurred linking the shaders: ${ctx.getProgramInfoLog(this.#program)}`)
            ctx.deleteProgram(this.#program)
            return null
        }

        uniforms.forEach(uniform => uniform.setLocation(ctx, this.#program))
    }

    bind() {
        this.#ctx.useProgram(this.#program)
        this.#uniforms.forEach(uniform => {uniform.apply(this.#ctx)})
    }

    unbind() {
        this.#ctx.useProgram(null)
    }
}