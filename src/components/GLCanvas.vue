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

  canvas.value.addEventListener('mousemove', (e: MouseEvent) => {
    gl.setMousePos(e.offsetX, e.offsetY)
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
