<script setup lang="ts">
import { Popover, Toolbar } from 'reka-ui/namespaced'
import {
  ByForwards,
  ByFullscreen,
  ByFullscreenExit,
  ByInfo,
  ByGithub,
  ByPause,
  ByPlay,
  ByReload,
  BySettings,
} from '@kalimahapps/vue-icons'
import HexSettings from '@/components/HexSettings.vue'
import { useHexStore } from '@/stores/hex'

const hex = useHexStore()
</script>

<template>
  <Toolbar.Root class="HexToolbar">
    <Toolbar.Button @click="hex.stepping = !hex.stepping">
      <ByPlay v-if="!hex.stepping" /> <ByPause v-if="hex.stepping" />
    </Toolbar.Button>
    <Toolbar.Button @click="hex.stepFlag = true"> <ByForwards /> </Toolbar.Button>
    <Toolbar.Button @click="hex.clearFlag = true"> <ByReload /> </Toolbar.Button>
    <Toolbar.Button> <ByInfo /> </Toolbar.Button>
    <Toolbar.Link href="https://github.com/aar65537/hex-life"> <ByGithub /> </Toolbar.Link>
    <Popover.Root>
      <Toolbar.Button as-child>
        <Popover.Trigger> <BySettings /> </Popover.Trigger>
      </Toolbar.Button>
      <HexSettings />
    </Popover.Root>
    <Toolbar.Button @click="hex.fullscreen = !hex.fullscreen">
      <ByFullscreen v-if="!hex.fullscreen" /> <ByFullscreenExit v-if="hex.fullscreen" />
    </Toolbar.Button>
  </Toolbar.Root>
</template>

<style scoped>
.HexToolbar {
  display: flex;
  gap: 2px;
}

a,
button {
  width: 100%;

  color: var(--color-foreground-mute);
  background-color: var(--color-background-soft);
  cursor: pointer;

  padding: 1px;
  border: 2px outset var(--color-border);
  border-radius: 5px;

  display: inline-flex;
  align-items: center;
  justify-content: center;
}

a:hover,
button:hover {
  background-color: var(--color-background-mute);
  border-color: var(--color-border-hover);
}

a svg,
button svg {
  width: 100%;
  height: 100%;

  padding: 2px;
}
</style>
