<script setup>
    import { onMounted, useTemplateRef } from "vue"
    import { draw, initProgram, initBuffers, observeCanvasResize } from "../gl"
    import { src as fSrc } from "../shaders/draw"

    const canvas = useTemplateRef("board")
    const fps = 24

    onMounted(() => {
        const resolution = {width: canvas.value.width, height: canvas.value.height}
        observeCanvasResize(canvas.value, resolution)

        const ctx = canvas.value.getContext("webgl2")
        if (ctx === null) {
            alert("Unable to initialize WebGL context.")
        }
        ctx.clearColor(0.0, 0.0, 0.0, 1.0)

        const vao = initBuffers(ctx)
        const program = initProgram(ctx, fSrc)
        const programInfo = {
            program: program,
            attributeLocations: {
                vertexPosition: ctx.getAttribLocation(program, "aPos")
            },
            uniformLocations: {
                resolution: ctx.getUniformLocation(program, "uResolution")
            }
        }

        window.setInterval(draw, 1000.0 / fps, ctx, programInfo, vao, resolution);
    })
</script>

<template>
    <canvas ref="board"/>
</template>

<style scoped>
    canvas {
        width: 100vw;
        height: 100vh;
    }
</style>

