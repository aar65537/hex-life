<script setup lang="ts">
import { Popover } from 'reka-ui/namespaced'
import { ByClose } from '@kalimahapps/vue-icons'
import { useHexStore } from '@/stores/hex'

const hex = useHexStore()
</script>

<template>
  <Popover.Content class="SettingsContent" :collision-padding="12" side="bottom" :side-offset="2">
    <h1>Settings</h1>
    <p>Board Size: {{ hex.boardSize[0] }}</p>
    <p>FPS: {{ hex.fps[0] }}</p>
    <p>SPS: {{ hex.sps[0] }}</p>
    <p>Mirror: {{ hex.mirror[0] }}</p>
    <p>Wrap: {{ hex.wrap[0] }}</p>
    <p>Rules: {{ hex.rules }}</p>
    <Popover.Close class="SettingsClose"> <ByClose /> </Popover.Close>
    <Popover.Arrow class="SettingsArrow" :rounded="true" />
  </Popover.Content>
</template>

<style>
.SettingsContent {
  width: 18rem;
  background-color: var(--color-background-soft);
  border-radius: 5px;

  display: flex;
  flex-direction: column;
}

.SettingsContent h1 {
  font-size: 1.25rem;
  text-align: center;
  margin: 0.5rem;
  width: 100%;
}

.SettingsContent p {
  margin: 0.25rem;
}

.SettingsClose {
  position: fixed;
  top: 0.25rem;
  right: 0.25rem;
  height: 1.75rem;
  width: 1.75rem;

  color: var(--color-foreground-mute);
  background-color: var(--color-background-mute);
  border: 2px outset var(--color-border);
  border-radius: 5px;

  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.SettingsClose:hover {
  border-color: var(--color-border-hover);
}

.SettingsClose svg {
  width: 100%;
  height: 100%;
  padding: 2px;
}

.SettingsArrow {
  fill: var(--color-background-soft);
}
</style>
