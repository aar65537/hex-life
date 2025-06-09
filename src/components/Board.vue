<script setup>
    import { onMounted, useTemplateRef } from "vue"
    import { Game } from "../scripts/game"
    import { observeCanvasResize } from "../scripts/canvas"
    import { fps, sps, viewCenter, zoom, size, resolution, cellCount, qStep } from "../scripts/store"

    const canvas = useTemplateRef("board")

    function pixelToCell(x, y) {
        // Calculate position in clip space
        const minRes = Math.min(...resolution.value)
        const dpi = window.devicePixelRatio
        x = (2 * x * dpi - resolution.value[0]) / minRes
        y = (resolution.value[1] - 2 * y * dpi) / minRes
        x = x / zoom.value + viewCenter.value[0]
        y = y / zoom.value + viewCenter.value[1]

        // Calculate cube coordinates
        x /= size.value
        y /= size.value
        const qFrac = x * 3**0.5 / 3 + y / 3
        const rFrac = -y * 2 / 3
        const sFrac = -qFrac - rFrac
        var q = Math.round(qFrac)
        var r = Math.round(rFrac)
        var s = Math.round(sFrac)

        // Round cube coordinates
        const qDiff = Math.abs(q - qFrac)
        const rDiff = Math.abs(r - rFrac)
        const sDiff = Math.abs(s - sFrac)
        if(qDiff > rDiff && qDiff > sDiff) {
            q = -r - s
        } else if(rDiff > sDiff) {
            r = -q - s
        } else {
            s = -q - r
        }
        console.log({q, r, s})

        // Calculate cell index
        return (q - r * qStep.value).mod(cellCount.value)
    }

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
            if(event.buttons == 1) {
                const cell = pixelToCell(event.layerX, event.layerY)
                console.log(cell)
                game.cells.toggleCell(cell)
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

