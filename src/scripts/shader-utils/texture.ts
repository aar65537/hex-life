export class Texture {
  #ctx
  #name
  #alignment
  #level
  #internalFormat
  #border
  #format
  #type
  #texture
  #fb

  constructor(
    ctx: WebGL2RenderingContext,
    name: string,
    alignment: GLint,
    level: GLint,
    internalFormat: GLint,
    border: GLint,
    format: GLenum,
    type: GLenum,
  ) {
    this.#ctx = ctx
    this.#name = name
    this.#alignment = alignment
    this.#level = level
    this.#internalFormat = internalFormat
    this.#border = border
    this.#format = format
    this.#type = type
    this.#texture = this.#ctx.createTexture()
    this.#init()
    this.#fb = this.#ctx.createFramebuffer()
    this.#initFB()
  }

  bind() {
    this.#ctx.bindTexture(this.#ctx.TEXTURE_2D, this.#texture)
  }

  unbind() {
    this.#ctx.bindTexture(this.#ctx.TEXTURE_2D, null)
  }

  bindFB() {
    this.#ctx.bindFramebuffer(this.#ctx.FRAMEBUFFER, this.#fb)
  }

  unbindFB() {
    this.#ctx.bindFramebuffer(this.#ctx.FRAMEBUFFER, null)
  }

  read(x: GLint, y: GLint, width: GLsizei, height: GLsizei, buffer: Uint8Array) {
    this.bindFB()
    this.#ctx.pixelStorei(this.#ctx.PACK_ALIGNMENT, this.#alignment)
    this.#ctx.readPixels(x, y, width, height, this.#format, this.#type, buffer)
    this.unbindFB()
  }

  write(width: GLsizei, height: GLsizei, data: ArrayBufferView | null) {
    this.bind()
    this.#ctx.pixelStorei(this.#ctx.UNPACK_ALIGNMENT, this.#alignment)
    this.#ctx.texImage2D(
      this.#ctx.TEXTURE_2D,
      this.#level,
      this.#internalFormat,
      width,
      height,
      this.#border,
      this.#format,
      this.#type,
      data,
    )
    this.unbind()
  }

  writePart(x: GLint, y: GLint, width: GLsizei, height: GLsizei, data: ArrayBufferView | null) {
    this.bind()
    this.#ctx.pixelStorei(this.#ctx.UNPACK_ALIGNMENT, this.#alignment)
    this.#ctx.texSubImage2D(
      this.#ctx.TEXTURE_2D,
      this.#level,
      x,
      y,
      width,
      height,
      this.#format,
      this.#type,
      data,
    )
    this.unbind()
  }

  inject() {
    return `uniform sampler2D ${this.#name};`
  }

  delete() {
    this.#ctx.deleteFramebuffer(this.#fb)
    this.#ctx.deleteTexture(this.#texture)
  }

  #init() {
    this.bind()
    this.#ctx.texParameteri(this.#ctx.TEXTURE_2D, this.#ctx.TEXTURE_MIN_FILTER, this.#ctx.NEAREST)
    this.#ctx.texParameteri(this.#ctx.TEXTURE_2D, this.#ctx.TEXTURE_MAG_FILTER, this.#ctx.NEAREST)
    this.#ctx.texParameteri(this.#ctx.TEXTURE_2D, this.#ctx.TEXTURE_WRAP_S, this.#ctx.CLAMP_TO_EDGE)
    this.#ctx.texParameteri(this.#ctx.TEXTURE_2D, this.#ctx.TEXTURE_WRAP_T, this.#ctx.CLAMP_TO_EDGE)
    this.unbind()
  }

  #initFB() {
    this.bindFB()
    this.#ctx.framebufferTexture2D(
      this.#ctx.FRAMEBUFFER,
      this.#ctx.COLOR_ATTACHMENT0,
      this.#ctx.TEXTURE_2D,
      this.#texture,
      this.#level,
    )
    this.unbindFB()
  }
}
