<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef, watch } from 'vue'
import GLCanvas from '@/components/GLCanvas.vue'
import { Game } from '@/scripts/game'
import { pixelToIndex } from '@/scripts/utils'
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

watch(
  () => hex.fps[0],
  () => {
    if (game) {
      hex.stopDrawing()
      hex.enforceDrawing(game)
    }
  },
)

watch(
  () => hex.sps[0],
  () => {
    if (game) {
      hex.stopStepping()
      hex.enforceStepping(game)
    }
  },
)

watch(
  () => hex.boardSize[0],
  () => {
    if (game) {
      game.cells.resize()
    }
  },
)

onMounted(() => {
  if (!container.value) {
    throw new Error('No container found.')
  }

  let start: number[]
  let touchDown = 0
  let touchUp = 0

  container.value.addEventListener('pointerdown', (e) => {
    if (e.isPrimary && e.buttons == 1) {
      start = [e.offsetX, e.offsetY]
    }
    if (e.pointerType == 'touch') {
      touchDown++
    }
  })

  container.value.addEventListener('pointerup', (e) => {
    if (!game) {
      return
    }
    if (e.isPrimary && e.buttons == 0) {
      const diffX = Math.abs(e.offsetX - start[0])
      const diffY = Math.abs(e.offsetY - start[1])
      if (diffX < hex.deltaPixels && diffY < hex.deltaPixels) {
        if (e.pointerType != 'touch' || touchDown == 1) {
          const index = pixelToIndex(e.offsetX, e.offsetY)
          if (index != -1) {
            game.cells.toggleCell(index)
          }
        } else if (touchDown == 2) {
          hex.stepping = !hex.stepping
        } else if (touchDown == 3) {
          game.step()
        } else if (touchDown == 4) {
          game.cells.clear()
        }
      }
    }
    if (e.pointerType == 'touch') {
      touchUp++
      if (touchUp == touchDown) {
        ;[touchUp, touchDown] = [0, 0]
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
      case 'p':
        hex.boardSize[0] += 1
        break
      case 'o':
        hex.boardSize[0] -= 1
        break
      default:
        break
    }
  })

  container.value.addEventListener('keyup', (e) => {
    if (game === null) {
      return
    }

    switch (e.key) {
      case ' ':
        hex.stepping = !hex.stepping
        break
      case 'c':
        game.cells.clear()
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
