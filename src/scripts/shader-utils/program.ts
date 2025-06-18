import { Shader, type ShaderSpec } from '@/scripts/shader-utils/shader'

export class Program {
  #ctx: WebGL2RenderingContext
  #program
  #vShader
  #fShader

  constructor(ctx: WebGL2RenderingContext, vShaderSpec: ShaderSpec, fShaderSpec: ShaderSpec) {
    this.#ctx = ctx
    this.#program = this.#ctx.createProgram()
    this.#vShader = new Shader(ctx, this.#ctx.VERTEX_SHADER, vShaderSpec)
    this.#fShader = new Shader(ctx, this.#ctx.FRAGMENT_SHADER, fShaderSpec)
    this.#ctx.attachShader(this.#program, this.#vShader.shader)
    this.#ctx.attachShader(this.#program, this.#fShader.shader)
    this.#ctx.linkProgram(this.#program)

    if (!this.#ctx.getProgramParameter(this.#program, this.#ctx.LINK_STATUS)) {
      const log = this.#ctx.getProgramInfoLog(this.#program)
      this.#ctx.deleteProgram(this.#program)
      throw new Error('Could not link WebGL program:\n' + log)
    }

    this.#vShader.setUniformLocations(this.#program)
    this.#fShader.setUniformLocations(this.#program)
  }

  bind() {
    this.#ctx.useProgram(this.#program)
    this.#vShader.bind()
    this.#fShader.bind()
  }

  unbind() {
    this.#ctx.useProgram(null)
  }

  delete() {
    this.#vShader.delete()
    this.#fShader.delete()
    this.#ctx.deleteProgram(this.#program)
  }
}
