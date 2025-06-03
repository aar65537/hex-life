import { textureSize } from "./store";

function initTexture(ctx, data) {
    const alignment = 1
    const level = 0
    const internalFormat = ctx.R8
    const width = textureSize.value
    const height = textureSize.value
    const border = 0
    const format = ctx.RED
    const type = ctx.UNSIGNED_BYTE

    const texture = ctx.createTexture()
    ctx.bindTexture(ctx.TEXTURE_2D, texture)
    ctx.pixelStorei(ctx.UNPACK_ALIGNMENT, alignment)
    ctx.texImage2D(ctx.TEXTURE_2D, level, internalFormat, width, height, border, format, type, data)
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.NEAREST)
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.NEAREST)
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE)
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE)
    ctx.bindTexture(ctx.TEXTURE_2D, null)
    return texture
}

function initFrameBuffer(ctx, texture) {
    const level = 0
    const fb = ctx.createFramebuffer()
    ctx.bindFramebuffer(ctx.FRAMEBUFFER, fb)
    ctx.framebufferTexture2D(ctx.FRAMEBUFFER, ctx.COLOR_ATTACHMENT0, ctx.TEXTURE_2D, texture, level)
    ctx.bindFramebuffer(ctx.FRAMEBUFFER, null)
    return fb
}

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
        this.initTextures(textureSize.value)
    }

    get textureSize() {
        return this.#textureSize
    }

    initTextures(textureSize) {
        this.#textureSize = textureSize
        this.#localBuffer = new Uint8Array(this.#textureSize**2)
        const middle = (this.textureSize - 1) / 2
        this.setCell(middle, middle, true)
        this.setCell(middle + 1, middle, true)
        this.setCell(middle - 1, middle, true)
        this.#frontBuffer = initTexture(this.#ctx, this.#localBuffer)
        this.setCell(middle, middle, false)
        this.#backBuffer = initTexture(this.#ctx, this.#localBuffer)
        this.#frontFB = initFrameBuffer(this.#ctx, this.#frontBuffer)
        this.#backFB = initFrameBuffer(this.#ctx, this.#backBuffer)
        this.#currentBufferFlag = Buffers.FRONT
    }

    setCell(q, r, state) {
        this.#localBuffer[q % this.textureSize + this.textureSize * (r % this.textureSize)] = state ? 255: 0
    }

    getCell(q, r) {
        return this.#localBuffer[q % this.textureSize + this.textureSize * (r % this.textureSize)] > 128
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

    flip() {
        if (this.#currentBufferFlag === Buffers.FRONT) {
            this.#currentBufferFlag = Buffers.BACK
        } else if (this.#currentBufferFlag === Buffers.BACK) {
            this.#currentBufferFlag = Buffers.FRONT
        } else {
            alert("Invalid buffer flag.")
        }
    }
}
