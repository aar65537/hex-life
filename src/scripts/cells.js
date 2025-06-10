import { cellCount } from "@/store"

const alignment = 1
const border = 0
const level = 0

const Buffers = Object.freeze({
    LOCAL: Symbol("local"),
    FRONT: Symbol("front"),
    BACK: Symbol("back"),
})

function nextPowerOfTwo(x) {
    let power = 0
    while(true) {
        const value = 1 << power
        if(x <= value) {
            return value
        }
        power += 1
    }
}

export class CellData {
    #ctx
    #singleBuffer
    #textureSize
    #localBuffer
    #frontBuffer
    #backBuffer
    #frontFB
    #backFB
    #currentBufferFlag

    constructor(ctx) {
        this.#ctx = ctx
        this.#singleBuffer = new Uint8Array(1)
        this.#init()
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

    get #width() {
        return cellCount.value < this.#textureSize ? cellCount.value: this.#textureSize
    }

    get #height() {
        return cellCount.value / this.#textureSize + 1
    }

    get #format() {
        return this.#ctx.RED
    }

    get #internalFormat() {
        return this.#ctx.R8
     }

    get #type() {
        return this.#ctx.UNSIGNED_BYTE
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
        this.#ctx.pixelStorei(this.#ctx.PACK_ALIGNMENT, alignment)
        this.#ctx.readPixels(0, 0, this.#width, this.#height, this.#format, this.#type, this.#localBuffer)
        this.#ctx.bindFramebuffer(this.#ctx.FRAMEBUFFER, null)
        this.#currentBufferFlag = Buffers.LOCAL
    }

    syncGPU() {
        if(this.#currentBufferFlag !== Buffers.LOCAL){
            return
        }
        this.#ctx.bindTexture(this.#ctx.TEXTURE_2D, this.#frontBuffer)
        this.#ctx.pixelStorei(this.#ctx.UNPACK_ALIGNMENT, alignment)
        this.#ctx.texSubImage2D(this.#ctx.TEXTURE_2D, level, 0, 0, this.#width, this.#height, this.#format, this.#type, this.#localBuffer)
        this.#ctx.bindTexture(this.#ctx.TEXTURE_2D, null)
        this.#currentBufferFlag = Buffers.FRONT
    }

    getCell(index) {
        if(this.#currentBufferFlag === Buffers.LOCAL){
            return this.#localBuffer[index] > 128
        }
        if(this.#currentBufferFlag === Buffers.FRONT) {
            this.#ctx.bindFramebuffer(this.#ctx.FRAMEBUFFER, this.#frontFB)
        } else if(this.#currentBufferFlag === Buffers.BACK) {
            this.#ctx.bindFramebuffer(this.#ctx.FRAMEBUFFER, this.#backFB)
        }
        const col = index.mod(this.#textureSize)
        const row = Math.floor(index / this.#textureSize)
        this.#ctx.pixelStorei(this.#ctx.PACK_ALIGNMENT, alignment)
        this.#ctx.readPixels(col, row, 1, 1, this.#format, this.#type, this.#singleBuffer)
        this.#ctx.bindFramebuffer(this.#ctx.FRAMEBUFFER, null)
        return this.#singleBuffer[0] > 128
    }

    setCell(index, state) {
        if(this.#currentBufferFlag === Buffers.LOCAL){
            this.#localBuffer[index] = state ? 255: 0
            return
        }
        const col = index.mod(this.#textureSize)
        const row = Math.floor(index / this.#textureSize)
        this.#singleBuffer[0] = state ? 255: 0
        this.#ctx.bindTexture(this.#ctx.TEXTURE_2D, this.currentBuffer)
        this.#ctx.pixelStorei(this.#ctx.UNPACK_ALIGNMENT, alignment)
        this.#ctx.texSubImage2D(this.#ctx.TEXTURE_2D, level, col, row, 1, 1, this.#format, this.#type, this.#singleBuffer)
        this.#ctx.bindTexture(this.#ctx.TEXTURE_2D, null)
    }

    toggleCell(index) {
        this.setCell(index, !this.getCell(index))
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

    viewport() {
        this.#ctx.viewport(0, 0, this.#width, this.#height)
    }

    delete() {
        this.#ctx.deleteFramebuffer(this.#frontFB)
        this.#ctx.deleteFramebuffer(this.#backFB)
        this.#ctx.deleteTexture(this.#frontBuffer)
        this.#ctx.deleteTexture(this.#backBuffer)
    }

    resize() {
        this.delete()
        this.#init()
    }

    #init() {
        this.#textureSize = nextPowerOfTwo(cellCount.value**0.5)
        this.#localBuffer = new Uint8Array(this.#textureSize**2)
        this.#frontBuffer = this.#initTexture()
        this.#backBuffer = this.#initTexture()
        this.#frontFB = this.#initFrameBuffer(this.#frontBuffer)
        this.#backFB = this.#initFrameBuffer(this.#backBuffer)
        this.#currentBufferFlag = Buffers.FRONT
    }

    #initTexture() {
        const texture = this.#ctx.createTexture()
        this.#ctx.bindTexture(this.#ctx.TEXTURE_2D, texture)
        this.#ctx.pixelStorei(this.#ctx.UNPACK_ALIGNMENT, alignment)
        this.#ctx.texImage2D(
            this.#ctx.TEXTURE_2D, level, this.#internalFormat, this.#textureSize,
            this.#textureSize, border, this.#format, this.#type, this.#localBuffer
        )
        this.#ctx.texParameteri(this.#ctx.TEXTURE_2D, this.#ctx.TEXTURE_MIN_FILTER, this.#ctx.NEAREST)
        this.#ctx.texParameteri(this.#ctx.TEXTURE_2D, this.#ctx.TEXTURE_MAG_FILTER, this.#ctx.NEAREST)
        this.#ctx.texParameteri(this.#ctx.TEXTURE_2D, this.#ctx.TEXTURE_WRAP_S, this.#ctx.CLAMP_TO_EDGE)
        this.#ctx.texParameteri(this.#ctx.TEXTURE_2D, this.#ctx.TEXTURE_WRAP_T, this.#ctx.CLAMP_TO_EDGE)
        this.#ctx.bindTexture(this.#ctx.TEXTURE_2D, null)
        return texture
    }

    #initFrameBuffer(texture) {
        const fb = this.#ctx.createFramebuffer()
        this.#ctx.bindFramebuffer(this.#ctx.FRAMEBUFFER, fb)
        this.#ctx.framebufferTexture2D(this.#ctx.FRAMEBUFFER, this.#ctx.COLOR_ATTACHMENT0, this.#ctx.TEXTURE_2D, texture, level)
        this.#ctx.bindFramebuffer(this.#ctx.FRAMEBUFFER, null)
        return fb
    }
}
