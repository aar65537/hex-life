export class VertexBuffer {
  #ctx
  #name
  #buffer
  #index
  #size
  #type
  #glslType
  #normalized
  #stride
  #offset

  constructor(
    ctx: WebGL2RenderingContext,
    name: string,
    index: GLuint,
    size: GLint,
    type: GLenum,
    glslType: string,
    normalized: GLboolean,
    stride: GLsizei,
    offset: GLintptr,
  ) {
    this.#ctx = ctx
    this.#name = name
    this.#buffer = this.#ctx.createBuffer()
    this.#index = index
    this.#size = size
    this.#type = type
    this.#glslType = glslType
    this.#normalized = normalized
    this.#stride = stride
    this.#offset = offset
  }

  bind() {
    this.#ctx.bindBuffer(this.#ctx.ARRAY_BUFFER, this.#buffer)
  }

  unbind() {
    this.#ctx.bindBuffer(this.#ctx.ARRAY_BUFFER, null)
  }

  write(data: AllowSharedBufferSource | null, usage: GLenum) {
    this.bind()
    this.#ctx.bufferData(this.#ctx.ARRAY_BUFFER, data, usage)
    this.unbind()
  }

  register() {
    this.bind()
    this.#ctx.enableVertexAttribArray(this.#index)
    this.#ctx.vertexAttribPointer(
      this.#index,
      this.#size,
      this.#type,
      this.#normalized,
      this.#stride,
      this.#offset,
    )
    this.unbind()
  }

  inject() {
    return `layout(location = ${this.#index}) in ${this.#glslType} ${this.#name};`
  }

  delete() {
    this.#ctx.deleteBuffer(this.#buffer)
  }
}

export class VertexArray {
  #ctx
  #vao
  #buffers

  constructor(ctx: WebGL2RenderingContext, buffers: VertexBuffer[]) {
    this.#ctx = ctx
    this.#vao = this.#ctx.createVertexArray()
    this.#buffers = buffers

    this.bind()
    this.#buffers.forEach((buffer) => buffer.register())
    this.unbind()
  }

  bind() {
    this.#ctx.bindVertexArray(this.#vao)
  }

  unbind() {
    this.#ctx.bindVertexArray(null)
  }

  inject() {
    return this.#buffers.map((buffer) => buffer.inject()).join('\n')
  }

  delete() {
    this.#ctx.deleteVertexArray(this.#vao)
  }
}
