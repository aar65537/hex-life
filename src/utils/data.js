import { worldSize } from "./store";

function textureSize() {
    return 2 * worldSize.value - 1
}

function initTexture(ctx, data) {
    const alignment = 1
    const level = 0
    const internalFormat = ctx.R8
    const width = textureSize()
    const height = textureSize()
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

class CellData {
    constructor(ctx) {
        this.textureSize = textureSize()
        this.local = new Uint8Array(this.textureSize**2)
        this.setCell(3, 3, true)
        this.setCell(4, 3, true)
        this.setCell(2, 3, true)
        this.front = initTexture(ctx, this.local)
        this.back = initTexture(ctx, this.local)
        this.frontFB = initFrameBuffer(ctx, this.front)
        this.backFB = initFrameBuffer(ctx, this.back)
        this.currentBuffer = Buffers.FRONT
        this.sideBuffer = Buffers.BACK
    }

    setCell(q, r, state) {
        this.local[q % this.textureSize + 7 * (r % this.textureSize)] = state ? 255: 0
    }

    getCell(q, r) {
        return this.local[q % this.textureSize + 7 * (r % this.textureSize)] > 128
    }

    getCurrentBuffer() {
        if(this.currentBuffer == Buffers.LOCAL) {
            return this.local
        } else if (this.currentBuffer == Buffers.FRONT) {
            return this.front
        } else {
            return this.back
        }
    }

    getCurrentFB() {
        if(this.sideBuffer == Buffers.LOCAL) {
            alert("Side buffer must be set to back or front!")
        } else if (this.sideBuffer == Buffers.FRONT) {
            return this.frontFB
        } else {
            return this.backFB
        }
    }

    flip() {
        const temp = this.currentBuffer
        this.currentBuffer = this.sideBuffer
        this.sideBuffer = temp
    }
}

export { CellData }