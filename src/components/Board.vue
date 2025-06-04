<script setup>
    import { onMounted, useTemplateRef } from "vue"
    import { Game } from "../scripts/game"
    import { observeCanvasResize } from "../scripts/canvas"
    import { fps, sps, viewCenter, zoom } from "../scripts/store"

    const canvas = useTemplateRef("board")

    onMounted(() => {
        observeCanvasResize(canvas.value)

        const ctx = canvas.value.getContext("webgl2")
        if (ctx === null) {
            alert("Unable to initialize WebGL context.")
        }
        const game = new Game(ctx)
        game.startDrawing(fps.value)
        game.startStepping(sps.value)

        canvas.value.addEventListener("mousedown", event => {
            console.log(event)
        })

        canvas.value.addEventListener("keyup", event => {
            console.log(event)
            switch (event.key) {
                case " ":
                    game.toggleStepping(sps.value)
                    break
                case "h":
                    viewCenter.value.x = 0
                    viewCenter.value.y = 0
                    break
                default:
                    break
            }
        })

        canvas.value.addEventListener("keydown", event => {
            console.log(event)
            switch(event.key) {
               case "a":
                    viewCenter.value.x -= 0.1
                    break
                case "d":
                    viewCenter.value.x += 0.1
                    break
                case "s":
                    viewCenter.value.y -= 0.1
                    break
                case "w":
                    viewCenter.value.y += 0.1
                    break
               case "=":
                    zoom.value += 0.1
                    break
                case "-":
                    if(zoom.value > 0.2) {
                        zoom.value -= 0.1
                    }
                    break
                default:
                    break
            }
        })
    })
</script>

<template>
    <canvas ref="board" tabindex="1" autofocus/>
</template>

<style scoped>
    canvas {
        position: fixed;
        width: 100%;
        height: 100%;
    }
</style>

