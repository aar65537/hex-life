<script setup>
    import { onMounted, useTemplateRef } from "vue"
    import { Game } from "../utils/game"
    import { observeCanvasResize } from "../utils/canvas"
    import { fps } from "../utils/store"

    const canvas = useTemplateRef("board")

    onMounted(() => {
        const resolution = {width: canvas.value.width, height: canvas.value.height}
        observeCanvasResize(canvas.value, resolution)

        const canvas_ctx = canvas.value.getContext("webgl2")
        if (canvas_ctx === null) {
            alert("Unable to initialize WebGL context.")
        }

        const game = new Game(canvas_ctx, resolution)
        game.step()
        window.setInterval(game.draw.bind(game), 1000.0 / fps.value);
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

