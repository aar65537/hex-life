<script setup>
    import { onMounted, useTemplateRef } from "vue"
    import { Game } from "../scripts/game"
    import { observeCanvasResize } from "../scripts/canvas"
    import { fps, sps, viewCenter, zoom, size, boardSize, resolution } from "../scripts/store"

    const canvas = useTemplateRef("board")

    function pixelToCell(x, y) {
        // Calculate position in clip space
        const minRes = Math.min(resolution.value.width, resolution.value.height)
        const dpi = window.devicePixelRatio
        x = (2 * x * dpi - resolution.value.width) / minRes
        y = (resolution.value.height - 2 * y * dpi) / minRes
        x = x / zoom.value + viewCenter.value.x
        y = y / zoom.value + viewCenter.value.y

        // Calculate cell coordinates
        x /= size.value
        y /= size.value
        const frac_q = 3**0.5 / 3 * x + y / 3 + boardSize.value - 1
        const frac_r = -2 / 3 * y + boardSize.value - 1
        const cell = {q: Math.round(frac_q), r: Math.round(frac_r)}
        const s = Math.round(-frac_q - frac_r)
        const q_diff = Math.abs(cell.q - frac_q)
        const r_diff = Math.abs(cell.r - frac_r)
        const s_diff = Math.abs(s + frac_q + frac_r)

        if(q_diff > r_diff && q_diff > s_diff) {
            cell.q = -cell.r - s
        } else if(r_diff > s_diff) {
            cell.r = -cell.q - s
        }

        return cell
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

