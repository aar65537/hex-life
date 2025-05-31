<script setup>
  import { onMounted } from "vue";

  onMounted(() => {
    const canvas = document.querySelector("#gl-canvas")
    const gl = canvas.getContext("webgl")

    if (gl === null) {
      alert("Unable to initialize WebGL contex.")
    }
    gl.clearColor(0.0, 0.0, 1.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)
  })
</script>

<template>
  <canvas id="gl-canvas" width="640" height="480"></canvas>
</template>

<style scoped>
</style>
