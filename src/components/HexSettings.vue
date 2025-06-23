<script setup lang="ts">
import { Popover } from 'reka-ui/namespaced'
import { ByClose } from '@kalimahapps/vue-icons'
import CustomSlider from '@/components/CustomSlider.vue'
import CustomSwitch from '@/components/CustomSwitch.vue'
import { useHexStore } from '@/stores/hex'
import type { FocusOutsideEvent, PointerDownOutsideEvent } from 'reka-ui'

const hex = useHexStore()

function dontClose(e: PointerDownOutsideEvent | FocusOutsideEvent): void {
  e.preventDefault()
}
</script>

<template>
  <Popover.Content
    class="SettingsContent"
    :collision-padding="12"
    side="bottom"
    :side-offset="2"
    @interact-outside="dontClose"
  >
    <Popover.Arrow class="SettingsArrow" :rounded="true" />
    <Popover.Close class="SettingsClose"> <ByClose /> </Popover.Close>
    <h1>Settings</h1>
    <CustomSlider
      v-model="hex.boardSize"
      label="Board Size"
      :tooltip="hex.cellCount"
      unit="cells"
      :max="hex.maxBoardSize"
      :min="1"
      :step="1"
    />
    <CustomSlider
      v-model="hex.fps"
      label="Frames/Sec"
      unit="frames/sec"
      :max="144"
      :min="24"
      :step="1"
    />
    <CustomSlider
      v-model="hex.sps"
      label="Steps/Sec"
      unit="steps/sec"
      :max="24"
      :min="1"
      :step="1"
    />
    <CustomSwitch v-model="hex.mirror" label="Mirror" tooltip="Display the mirror boards" />
    <CustomSwitch v-model="hex.wrap" label="Wrap" tooltip="Wrap cells around the board" />
    <p>Rules: {{ hex.rules }}</p>
  </Popover.Content>
</template>

<style>
.SettingsContent {
  width: 17.5rem;

  border: 0.125rem outset var(--color-background-mute);
  border-top: 0.125rem outset var(--color-border-hover);
  border-radius: 0.25rem;
  background-color: var(--color-background-soft);
  padding: 0.125rem;

  display: flex;
  flex-direction: column;
  align-items: center;
}

.SettingsArrow {
  fill: var(--color-border-hover);
}
</style>

<style scoped>
.SettingsClose {
  position: fixed;
  top: 0.625rem;
  right: 0.5rem;
  height: 1.75rem;
  width: 1.75rem;

  color: var(--color-foreground-mute);
  background-color: var(--color-background-mute);
  border: 0.125rem outset var(--color-border);
  border-radius: 0.25rem;

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

.SettingsContent h1 {
  font-size: 1.25rem;
  margin: 0.5rem 0rem;
}
</style>
