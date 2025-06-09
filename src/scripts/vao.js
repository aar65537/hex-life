import { attributeLocations } from "@/store"

export class Vao {
    #ctx
    #buffer
    #vao

    constructor(ctx) {
        this.#ctx = ctx
        this.#buffer = ctx.createBuffer()
        this.#vao = ctx.createVertexArray()

        const numComponents = 2
        const type = ctx.FLOAT
        const normalize = false
        const stride = 0
        const offset = 0
        const data = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0]

        this.bind()
        ctx.enableVertexAttribArray(attributeLocations.position)
        ctx.bindBuffer(ctx.ARRAY_BUFFER, this.#buffer)
        ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array(data), ctx.STATIC_DRAW)
        ctx.vertexAttribPointer(attributeLocations.position, numComponents, type, normalize, stride, offset)
        ctx.bindBuffer(ctx.ARRAY_BUFFER, null)
        this.unbind()
    }

    bind() {
        this.#ctx.bindVertexArray(this.#vao)
    }

    unbind() {
        this.#ctx.bindVertexArray(null)
    }

    delete() {
        this.#ctx.deleteVertexArray(this.#vao)
        this.#ctx.deleteBuffer(this.#buffer)
    }
}
