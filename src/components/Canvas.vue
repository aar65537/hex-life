<script setup>
  import { onMounted, useTemplateRef } from "vue"
  import { draw, initProgram, initBuffers } from "../gl"

  const canvas = useTemplateRef("canvas")

  const src  = `
    precision mediump float;

    vec2 resolution = vec2(640, 480);
    float size = 0.1;
    float spacing = 0.005;
    int worldSize = 5;

    struct Cell {
       int q;
       int r;
    };

    int abs(int x) {
        if(x < 0) {
            return -x;
        }
        return x;
    }

    vec2 cellToPixel(Cell cell) {
        return mat2(sqrt(3.0), 0.0, sqrt(3.0)/2.0, 3.0/2.0)*vec2(cell.q, cell.r)*size;
    }

    Cell pixelToCell(vec2 pixel) {
        vec2 frac_cell = mat2(sqrt(3.0)/3.0, 0.0, -1.0/3.0, 2.0/3.0)*pixel/size;
        int q = int(floor(frac_cell.x + 0.5));
        int r = int(floor(frac_cell.y + 0.5));
        int s = int(floor(-frac_cell.x - frac_cell.y + 0.5));

        float q_diff = abs(float(q) - frac_cell.x);
        float r_diff = abs(float(r) - frac_cell.y);
        float s_diff = abs(float(s) + frac_cell.x + frac_cell.y);

        if(q_diff > r_diff && q_diff > s_diff) {
            q = -r - s;
        } else if(r_diff > s_diff) {
            r = -q - s;
        }

        return Cell(q, r);
    }

    bool inWorld(Cell cell) {
        return abs(cell.q) < worldSize && abs(cell.r) < worldSize && abs(cell.q + cell.r) < worldSize;
    }

    bool inCell(vec2 pixel, Cell cell) {
        vec2 cellCenter = cellToPixel(cell);
        return distance(pixel, cellCenter) < (size * sqrt(3.0) / 2.0 - spacing);
    }

    void main() {
        vec2 pixel = (2.0 * gl_FragCoord.xy - resolution) / resolution;
        Cell cell = pixelToCell(pixel);

        vec3 color = vec3(float(cell.q) / float(worldSize), float(cell.r) / float(worldSize), 0.2);

        gl_FragColor = float(inWorld(cell)) * float(inCell(pixel, cell)) * vec4(color, 1.0);
    }
    `

  onMounted(() => {
    const ctx = canvas.value.getContext("webgl")

    if (ctx === null) {
      alert("Unable to initialize WebGL context.")
    }

    const program = initProgram(ctx, src)
    const programInfo = {
        program: program,
        attributeLocations: {
            vertexPosition: ctx.getAttribLocation(program, "aPos")
        }
    }
    const buffers = initBuffers(ctx)
    ctx.clearColor(0.0, 0.0, 0.0, 1.0)
    draw(ctx, programInfo, buffers)

  })
</script>

<template>
  <canvas ref="canvas" width="640" height="480"/>
</template>

