export class Uniform {
    #name
    #loc
    #ref
    #type

    constructor(name, ref, type) {
        this.#name = name
        this.#loc = null
        this.#ref = ref
        this.#type = type
    }

    get declaration() {
        return `uniform ${this.#type} ${this.#name};`
    }

    setLocation(ctx, program) {
        this.#loc = ctx.getUniformLocation(program, this.#name)
    }

    apply(ctx) {
        switch(this.#type) {
            case "float":
                ctx.uniform1f(this.#loc, this.#ref.value)
                break
            case "int":
                ctx.uniform1i(this.#loc, this.#ref.value)
                break
            case "vec2":
                ctx.uniform2f(this.#loc, ...this.#ref.value)
                break
            case "vec4":
                ctx.uniform4f(this.#loc, ...this.#ref.value)
                break
        }
    }

    static inject(uniforms) {
        return uniforms.map(uniform => uniform.declaration).join("\n")
    }
}
