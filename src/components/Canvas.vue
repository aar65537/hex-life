<script setup>
  import { onMounted, useTemplateRef } from "vue"

  const canvas = useTemplateRef("canvas")

  onMounted(() => {
    console.log(Object.getOwnPropertyNames(canvas));
    const gl = canvas.value.getContext("webgl")

    if (gl === null) {
      alert("Unable to initialize WebGL contex.")
    }
    gl.clearColor(0.0, 0.0, 1.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)
  })
</script>

<template>
  <canvas ref="canvas" width="640" height="480"/>
</template>

