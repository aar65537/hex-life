export class Uniform {
  #ctx
  #name
  #type
  #state
  #location: WebGLUniformLocation | null

  constructor(ctx: WebGL2RenderingContext, name: string, type: GLenum, state: () => number[]) {
    this.#ctx = ctx
    this.#name = name
    this.#type = type
    this.#state = state
    this.#location = null
  }

  inject() {
    switch (this.#type) {
      case this.#ctx.FLOAT:
        return `uniform float ${this.#name};`
      case this.#ctx.INT:
        return `uniform int ${this.#name};`
      case this.#ctx.FLOAT_VEC2:
        return `uniform vec2 ${this.#name};`
      case this.#ctx.INT_VEC2:
        return `uniform ivec2 ${this.#name};`
      case this.#ctx.FLOAT_VEC3:
        return `uniform vec3 ${this.#name};`
      case this.#ctx.INT_VEC3:
        return `uniform ivec3 ${this.#name};`
      case this.#ctx.FLOAT_VEC4:
        return `uniform vec4 ${this.#name};`
      case this.#ctx.INT_VEC4:
        return `uniform ivec4 ${this.#name};`
      default:
        throw new Error(`Invalid uniform type: ${this.#type}`)
    }
  }

  setLocation(program: WebGLProgram) {
    this.#location = this.#ctx.getUniformLocation(program, this.#name)
  }

  bind() {
    const state = this.#state()
    switch (this.#type) {
      case this.#ctx.FLOAT:
        return this.#ctx.uniform1f(this.#location, state[0])
      case this.#ctx.INT:
        return this.#ctx.uniform1i(this.#location, state[0])
      case this.#ctx.FLOAT_VEC2:
        return this.#ctx.uniform2f(this.#location, state[0], state[1])
      case this.#ctx.INT_VEC2:
        return this.#ctx.uniform2i(this.#location, state[0], state[1])
      case this.#ctx.FLOAT_VEC3:
        return this.#ctx.uniform3f(this.#location, state[0], state[1], state[2])
      case this.#ctx.INT_VEC3:
        return this.#ctx.uniform3i(this.#location, state[0], state[1], state[2])
      case this.#ctx.FLOAT_VEC4:
        return this.#ctx.uniform4f(this.#location, state[0], state[1], state[2], state[3])
      case this.#ctx.INT_VEC4:
        return this.#ctx.uniform4i(this.#location, state[0], state[1], state[2], state[3])
      default:
        throw new Error('Invalid uniform type')
    }
  }

  static inject(uniforms: Uniform[]) {
    return uniforms.map((uniform) => uniform.inject()).join('\n')
  }
}
