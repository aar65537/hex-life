import { attributeLocations } from "../scripts/store"

export class Uniform {
    #name
    #loc
    #ref
    #type

    constructor(name, ref, type) {
        this.#name = name
        this.#loc = null
        this.#ref = ref
        this.#type = type
    }

    getLocation(ctx, program) {
        this.#loc = ctx.getUniformLocation(program, this.#name)
    }

    apply(ctx) {
        switch(this.#type) {
            case "float":
                ctx.uniform1f(this.#loc, this.#ref.value)
                break
            case "int":
                ctx.uniform1i(this.#loc, this.#ref.value)
                break
            case "vec2":
                ctx.uniform2f(this.#loc, ...this.#ref.value)
                break
            case "vec4":
                ctx.uniform4f(this.#loc, ...this.#ref.value)
                break
        }
    }

    inject() {
        return `uniform ${this.#type} ${this.#name};`
    }
}

export function injectUniforms(uniforms) {
    return uniforms.map(uniform => uniform.inject()).join("\n")
}

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

export function initProgram(ctx, vSrc, fSrc, uniforms) {
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

    uniforms.forEach(uniform => uniform.getLocation(ctx, program))
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
