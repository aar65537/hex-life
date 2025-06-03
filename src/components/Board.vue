<script setup>
    import { onMounted, useTemplateRef } from "vue"
    import { Game } from "../scripts/game"
    import { observeCanvasResize } from "../scripts/canvas"
    import { fps, sps } from "../scripts/store"

    const canvas = useTemplateRef("board")

    onMounted(() => {
        observeCanvasResize(canvas.value)

        const ctx = canvas.value.getContext("webgl2")
        if (ctx === null) {
            alert("Unable to initialize WebGL context.")
        }

        const game = new Game(ctx)
        window.setInterval(game.draw.bind(game), 1000.0 / fps.value)
        window.setInterval(game.step.bind(game), 1000.0 / sps.value)
    })
</script>

<template>
    <canvas ref="board"/>
</template>

<style scoped>
    canvas {
        position: fixed;
        width: 100%;
        height: 100%;
    }
</style>

