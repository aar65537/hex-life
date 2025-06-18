<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef } from 'vue'
import { startResizeObserver } from '@/scripts/canvas'
import { useGLStore } from '@/stores/gl'

const canvas = useTemplateRef('glCanvas')
const gl = useGLStore()
let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  if (!canvas.value) {
    throw new Error('No canvas found')
  }

  gl.setCtxFromCanvas(canvas.value)

  if (resizeObserver) {
    resizeObserver.disconnect()
  }
  resizeObserver = startResizeObserver(canvas.value)

  canvas.value.addEventListener('pointerdown', (e) => {
    if (e.buttons == 1) {
      gl.dragging = true
    }
  })

  canvas.value.addEventListener('pointermove', (e) => {
    if (e.pointerType == 'mouse') {
      gl.mousePos = [e.offsetX, e.offsetY]
    }

    if (e.buttons == 1) {
      const dpi = window.devicePixelRatio
      const minRes = Math.min(...gl.resolution)
      const [moveX, moveY] = [
        (gl.zoomMult[0] * e.movementX * dpi) / minRes,
        (-gl.zoomMult[0] * e.movementY * dpi) / minRes,
      ]
      gl.centerV[0] -= gl.acceleration * moveX
      gl.centerV[1] -= gl.acceleration * moveY
    }
  })

  canvas.value.addEventListener('pointerup', (e) => {
    if (e.buttons == 0) {
      gl.dragging = false
    }
  })

  canvas.value.addEventListener('wheel', (e) => {
    gl.centerV[0] /= gl.zoomMult[0]
    gl.centerV[1] /= gl.zoomMult[0]
    if (e.deltaY < 0) {
      gl.zoom[0] += 1
    } else {
      gl.zoom[0] -= 1
    }
    gl.centerV[0] *= gl.zoomMult[0]
    gl.centerV[1] *= gl.zoomMult[0]
  })

  canvas.value.addEventListener('keyup', (e) => {
    switch (e.key) {
      case 'h':
        gl.center = [0, 0]
        gl.centerV = [0, 0]
        gl.zoom = [0]
        break
      default:
        break
    }
  })
})

onUnmounted(() => {
  gl.clearCtx()

  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
})
</script>

<template>
  <canvas ref="glCanvas" tabindex="0" autofocus />
</template>

<style scoped>
canvas {
  width: 100%;
  height: 100%;
}

canvas:focus {
  outline: none;
}
</style>
