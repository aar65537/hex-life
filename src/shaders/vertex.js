import { attributeLocations } from "../scripts/store"

export const src = `#version 300 es
layout(location = ${ attributeLocations.position }) in vec2 aPos;

void main() {
    gl_Position = vec4(aPos, 0, 1);
}
`
