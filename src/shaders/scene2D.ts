import type { VertexArray } from '@/scripts/shader-utils/vertex'

export function spec(vao: VertexArray) {
  const src = /* glsl */ `#version 300 es

${vao.inject()}
void main() {
  gl_Position = vec4(pos2D, 0, 1);
}
`
  return { uniforms: [], src }
}
