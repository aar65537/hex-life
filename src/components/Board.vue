<script setup>
    import { onMounted, onUnmounted, useTemplateRef, watch } from "vue"
    import { activeCell, fps, sps, viewCenter, zoom, cellCount, resolution, zoomFactor, delta, acceleration, viewVelocity } from "@/store"
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

        watch(cellCount, () => {
            game.cells.resize()
        })

        let startX
        let startY

        canvas.value.addEventListener("mousedown", event => {
            if(event.buttons == 1) {
                startX = event.layerX
                startY = event.layerY
            }
        })

        canvas.value.addEventListener("mousemove", event => {
            if(event.buttons == 0) {
                const index = pixelToIndex(event.layerX, event.layerY)
                activeCell.value = index === null ? -1 : index
            }
            if(event.buttons == 1) {
                const minRes = Math.min(...resolution.value)
                const dpi = window.devicePixelRatio
                activeCell.value = -1
                viewVelocity[0] += (1 + zoomFactor.value) ** -zoom.value * acceleration * event.movementX * dpi / minRes
                viewVelocity[1] += (1 + zoomFactor.value) ** -zoom.value * acceleration * event.movementY * dpi / minRes
            }
        })

        canvas.value.addEventListener("mouseup", event => {
            if(event.buttons == 0) {
                const diffX = Math.abs(event.layerX - startX)
                const diffY = Math.abs(event.layerY - startY)
                if(diffX < delta && diffY < delta){
                    const index = pixelToIndex(event.layerX, event.layerY)
                    if(index !== null) {
                        game.cells.toggleCell(index)
                    }
                }
           }
        })

        canvas.value.addEventListener("wheel", event => {
            if(event.buttons == 0) {
                if(event.wheelDelta > 0) {
                    zoom.value += 1
                } else {
                    zoom.value -= 1
                }
            }
        })

        canvas.value.addEventListener("keyup", event => {
            switch (event.key) {
                case " ":
                    game.toggleStepping(sps.value)
                    break
                case "c":
                    game.cells.resize()
                    break
                case "h":
                    viewCenter.value[0] = 0
                    viewCenter.value[1] = 0
                    viewVelocity[0] = 0
                    viewVelocity[1] = 0
                    zoom.value = 0
                    break
                default:
                    break
            }
        })

        canvas.value.addEventListener("keydown", event => {
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
                    zoom.value += 1
                    break
                case "-":
                    zoom.value -= 1
                    break
                case ".":
                    game.step()
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

