const Buffers = Object.freeze({
    LOCAL: Symbol("local"),
    FRONT: Symbol("front"),
    BACK: Symbol("back"),
})

export class CellData {
    #ctx
    #textureSize
    #localBuffer
    #frontBuffer
    #backBuffer
    #frontFB
    #backFB
    #currentBufferFlag

    constructor(ctx) {
        this.#ctx = ctx
        this.#textureSize = this.#ctx.getParameter(this.#ctx.MAX_TEXTURE_SIZE)
        this.#localBuffer = new Uint8Array(this.#textureSize**2)
        this.#frontBuffer = this.#initTexture()
        this.#backBuffer = this.#initTexture()
        this.#frontFB = this.#initFrameBuffer(this.#frontBuffer)
        this.#backFB = this.#initFrameBuffer(this.#backBuffer)
        this.#currentBufferFlag = Buffers.FRONT
    }

    get textureSize() {
        return this.#textureSize
    }

    get currentBufferFlag () {
        return this.#currentBufferFlag
    }

    get currentBuffer() {
        if(this.#currentBufferFlag === Buffers.LOCAL) {
            return this.#localBuffer
        } else if (this.#currentBufferFlag === Buffers.FRONT) {
            return this.#frontBuffer
        } else if (this.#currentBufferFlag === Buffers.BACK) {
            return this.#backBuffer
        } else {
            alert ("Invalid buffer flag.")
        }
    }

    get currentFB() {
        if (this.#currentBufferFlag === Buffers.FRONT) {
            return this.#backFB
        } else if (this.#currentBufferFlag === Buffers.BACK) {
            return this.#frontFB
        } else {
            alert("Invalid buffer flag.")
        }
    }

    syncLocal() {
        if (this.#currentBufferFlag === Buffers.LOCAL) {
            return
        }

        if(this.#currentBufferFlag === Buffers.FRONT) {
            this.#ctx.bindFramebuffer(this.#ctx.FRAMEBUFFER, this.#frontFB)
        } else if(this.#currentBufferFlag === Buffers.BACK) {
            this.#ctx.bindFramebuffer(this.#ctx.FRAMEBUFFER, this.#backFB)
        }

        const alignment = 1
        const format = this.#ctx.RED
        const type = this.#ctx.UNSIGNED_BYTE

        this.#ctx.pixelStorei(this.#ctx.PACK_ALIGNMENT, alignment)
        this.#ctx.readPixels(0, 0, this.textureSize, this.textureSize, format, type, this.#localBuffer)
        this.#ctx.bindFramebuffer(this.#ctx.FRAMEBUFFER, null)
        this.#currentBufferFlag = Buffers.LOCAL
    }

    syncGPU() {
        if(this.#currentBufferFlag === Buffers.LOCAL){
            const alignment = 1
            const level = 0
            const internalFormat = this.#ctx.R8
            const width = this.textureSize
            const height = this.textureSize
            const border = 0
            const format = this.#ctx.RED
            const type = this.#ctx.UNSIGNED_BYTE

            this.#ctx.pixelStorei(this.#ctx.UNPACK_ALIGNMENT, alignment)
            this.#ctx.bindTexture(this.#ctx.TEXTURE_2D, this.#frontBuffer)
            this.#ctx.texImage2D(this.#ctx.TEXTURE_2D, level, internalFormat, width, height, border, format, type, this.#localBuffer)
            this.#ctx.bindTexture(this.#ctx.TEXTURE_2D, null)
            this.#currentBufferFlag = Buffers.FRONT
        }
    }

    setCell(cell, state) {
        this.syncLocal()
        this.#localBuffer[cell] = state ? 255: 0
    }

    getCell(cell) {
        this.syncLocal()
        return this.#localBuffer[cell] > 128
    }

    toggleCell(cell) {
        this.setCell(cell, !this.getCell(cell))
    }

    flip() {
        if (this.#currentBufferFlag === Buffers.FRONT) {
            this.#currentBufferFlag = Buffers.BACK
        } else if (this.#currentBufferFlag === Buffers.BACK) {
            this.#currentBufferFlag = Buffers.FRONT
        } else {
            alert("Invalid buffer flag.")
        }
    }

    #initTexture() {
        const ctx = this.#ctx
        const alignment = 1
        const level = 0
        const internalFormat = ctx.R8
        const width = this.#textureSize
        const height = this.#textureSize
        const border = 0
        const format = ctx.RED
        const type = ctx.UNSIGNED_BYTE

        const texture = ctx.createTexture()
        ctx.bindTexture(ctx.TEXTURE_2D, texture)
        ctx.pixelStorei(ctx.UNPACK_ALIGNMENT, alignment)
        ctx.texImage2D(
            ctx.TEXTURE_2D, level, internalFormat, width,
            height, border, format, type, this.#localBuffer
        )
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.NEAREST)
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.NEAREST)
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE)
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE)
        ctx.bindTexture(ctx.TEXTURE_2D, null)
        return texture
    }

    #initFrameBuffer(texture) {
        const ctx = this.#ctx
        const level = 0
        const fb = ctx.createFramebuffer()
        ctx.bindFramebuffer(ctx.FRAMEBUFFER, fb)
        ctx.framebufferTexture2D(ctx.FRAMEBUFFER, ctx.COLOR_ATTACHMENT0, ctx.TEXTURE_2D, texture, level)
        ctx.bindFramebuffer(ctx.FRAMEBUFFER, null)
        return fb
    }
}
