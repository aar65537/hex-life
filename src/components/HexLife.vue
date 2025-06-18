<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef, watch } from 'vue'
import GLCanvas from '@/components/GLCanvas.vue'
import { Game } from '@/scripts/game'
import { useGLStore } from '@/stores/gl'
import { useHexStore } from '@/stores/hex'

const gl = useGLStore()
const hex = useHexStore()
const container = useTemplateRef('container')

let game: Game | null = null

function stop() {
  if (!game) {
    return
  }
  hex.enforceDrawing(game, false)
  hex.enforceStepping(game, false)
  game.delete()
  game = null
}

watch(
  () => gl.rawCtx,
  (ctx) => {
    stop()
    if (ctx) {
      game = new Game()
      hex.enforceDrawing(game, true)
      hex.enforceStepping(game)
    }
  },
  { immediate: true },
)

watch(
  () => hex.drawing,
  () => {
    if (game) {
      hex.enforceDrawing(game)
    }
  },
)

watch(
  () => hex.stepping,
  () => {
    if (game) {
      hex.enforceStepping(game)
    }
  },
)

onMounted(() => {
  if (!container.value) {
    throw new Error('No container found.')
  }

  let start: number[]

  container.value.addEventListener('mousedown', (e) => {
    if (e.buttons == 1) {
      start = [e.offsetX, e.offsetY]
    }
  })

  container.value.addEventListener('mousemove', (e) => {
    if (e.buttons == 1) {
      console.log(e)
    }
  })

  container.value.addEventListener('mouseup', (e) => {
    if (!game) {
      return
    }
    if (e.buttons == 0) {
      const diffX = Math.abs(e.offsetX - start[0])
      const diffY = Math.abs(e.offsetY - start[1])
      if (diffX < hex.deltaPixels && diffY < hex.deltaPixels) {
        if (hex.activeCell[0] != -1) {
          game.cells.toggleCell(hex.activeCell[0])
        }
      }
    }
  })

  container.value.addEventListener('keydown', (e) => {
    if (!game) {
      return
    }

    switch (e.key) {
      case '.':
        game.step()
        break
      default:
        break
    }
  })

  container.value.addEventListener('keyup', (e) => {
    switch (e.key) {
      case ' ':
        hex.stepping = !hex.stepping
        break
      default:
        break
    }
  })
})

onUnmounted(() => {
  stop()
})
</script>

<template>
  <div ref="container" class="container">
    <GLCanvas />
  </div>
</template>

<style scoped>
.container {
  position: fixed;
  width: 100vw;
  height: 100vh;
}
</style>
