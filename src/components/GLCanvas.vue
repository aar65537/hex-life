<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef } from 'vue'
import { startResizeObserver } from '@/scripts/canvas'
import { pixelToClip } from '@/scripts/utils'
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

  canvas.value.addEventListener('gesturestart', (e) => {
    e.preventDefault()
  })

  canvas.value.addEventListener('gesturechange', (e) => {
    e.preventDefault()
  })

  canvas.value.addEventListener('gestureend', (e) => {
    e.preventDefault()
  })

  const touches = [] as PointerEvent[]
  let lastDiff = null as number | null

  function pinchDiff() {
    const [x1, y1] = pixelToClip(touches[0].offsetX, touches[0].offsetY)
    const [x2, y2] = pixelToClip(touches[1].offsetX, touches[1].offsetY)
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)
  }

  canvas.value.addEventListener('pointerdown', (e) => {
    if (e.buttons == 1) {
      gl.dragging = true
    }
    if (e.pointerType == 'touch') {
      touches.push(e)
    }
  })

  canvas.value.addEventListener('pointermove', (e) => {
    if (e.pointerType == 'mouse') {
      gl.mousePos = [e.offsetX, e.offsetY]
    }
    if (e.pointerType == 'touch') {
      const index = touches.findIndex((touch) => touch.pointerId == e.pointerId)
      touches[index] = e
    }
    if (e.pointerType == 'touch' && touches.length == 2) {
      const diff = pinchDiff()
      if (lastDiff !== null) {
        let mult
        if (gl.zoom[0] > 0) {
          mult = gl.zoomMult[0]
        } else {
          mult = 1 / gl.zoomMult[0]
        }
        gl.zoom[0] += (diff - lastDiff) * gl.zoomPinch * mult
      }
      lastDiff = pinchDiff()
    } else if (e.buttons == 1) {
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
    if (e.pointerType == 'touch') {
      const index = touches.findIndex((touch) => touch.pointerId == e.pointerId)
      touches.splice(index, 1)
      lastDiff = null
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

  canvas.value.addEventListener('keydown', (e) => {
    switch (e.key) {
      case '=':
        gl.zoom[0] += 1
        break
      case '-':
        gl.zoom[0] -= 1
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
