<script setup>
    import { onMounted, onUnmounted, useTemplateRef, watch } from "vue"
    import { fps, sps, viewCenter, zoom, cellCount } from "@/store"
    import { Game } from "@/scripts/game"
    import { pixelToIndex, observeCanvasResize } from "@/scripts/board"

    const canvas = useTemplateRef("board")
    let game

    onMounted(() => {
        observeCanvasResize(canvas.value)

        const ctx = canvas.value.getContext("webgl2")
        if (ctx === null) {
            alert("Unable to initialize WebGL context.")
        }
        game = new Game(ctx)
        game.startDrawing(fps.value)
        game.startStepping(sps.value)

        watch(cellCount, () => {
            game.cells.resize()
        })

        canvas.value.addEventListener("mousedown", event => {
            console.log(event)
            if(event.buttons == 1) {
                const index = pixelToIndex(event.layerX, event.layerY)
                console.log(index)
                if(index !== null) {
                    game.cells.toggleCell(index)
                }
            }
        })

        canvas.value.addEventListener("keyup", event => {
            console.log(event)
            switch (event.key) {
                case " ":
                    game.toggleStepping(sps.value)
                    break
                case "h":
                    viewCenter.value[0] = 0
                    viewCenter.value[1] = 0
                    zoom.value = 1
                    break
                default:
                    break
            }
        })

        canvas.value.addEventListener("keydown", event => {
            console.log(event)
            switch(event.key) {
               case "a":
                    viewCenter.value[0] -= 0.1
                    break
                case "d":
                    viewCenter.value[0] += 0.1
                    break
                case "s":
                    viewCenter.value[1] -= 0.1
                    break
                case "w":
                    viewCenter.value[1] += 0.1
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

    onUnmounted(() => {
        game.delete()
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

    canvas:focus {
        outline: none;
    }
</style>

