import type { Uniform } from '@/scripts/shader-utils/uniform'

export interface ShaderSpec {
  uniforms: Uniform[]
  src: string
}

export class Shader {
  #ctx: WebGL2RenderingContext
  #src
  #uniforms
  #shader

  constructor(ctx: WebGL2RenderingContext, type: GLenum, spec: ShaderSpec) {
    this.#ctx = ctx
    this.#src = spec.src
    this.#uniforms = spec.uniforms

    const shader = this.#ctx.createShader(type)
    if (!shader) {
      throw new Error('Could not create WebGL shader')
    }
    this.#shader = shader

    this.#ctx.shaderSource(this.#shader, this.#src)
    this.#ctx.compileShader(this.#shader)
    if (!this.#ctx.getShaderParameter(this.#shader, this.#ctx.COMPILE_STATUS)) {
      const log = this.#ctx.getShaderInfoLog(this.#shader)
      this.delete()
      throw new Error('Could not compile WebGL shader:\n' + log)
    }
  }

  get shader() {
    return this.#shader
  }

  setUniformLocations(program: WebGLProgram) {
    this.#uniforms.forEach((uniform) => {
      uniform.setLocation(program)
    })
  }

  bind() {
    this.#uniforms.forEach((uniform) => {
      uniform.bind()
    })
  }

  delete() {
    this.#ctx.deleteShader(this.#shader)
  }
}
