<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef, watch } from 'vue'
import { usePreferredColorScheme } from '@vueuse/core'
import GLCanvas from '@/components/GLCanvas.vue'
import HexToolbar from '@/components/HexToolbar.vue'
import { Game } from '@/scripts/game'
import { pixelToIndex, syncColors } from '@/scripts/utils'
import { useGLStore } from '@/stores/gl'
import { useHexStore } from '@/stores/hex'

const gl = useGLStore()
const hex = useHexStore()
const container = useTemplateRef('container')
const colorScheme = usePreferredColorScheme()

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

watch(
  () => hex.clearFlag,
  () => {
    if (hex.clearFlag && game) {
      hex.stepping = false
      game.cells.clear()
    }
    hex.clearFlag = false
  },
)

watch(
  () => hex.stepFlag,
  () => {
    if (hex.stepFlag && game) {
      game.step()
    }
    hex.stepFlag = false
  },
)

watch(() => colorScheme.value, syncColors, { immediate: true })

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
          hex.clearFlag = true
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
        hex.clearFlag = true
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
  <HexToolbar class="toolbar" />
</template>

<style scoped>
.container {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0px;
  left: 0px;
}

.toolbar {
  position: fixed;
  width: 18rem;
  height: 2.5rem;
  top: 20px;
  right: 12px;
}
</style>
