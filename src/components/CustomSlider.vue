<script setup lang="ts">
import { Slider, Tooltip } from 'reka-ui/namespaced'

const model = defineModel<number[]>({ required: true })
const props = defineProps<{
  label: string
  tooltip?: number
  unit?: string
  max?: number
  min?: number
  step?: number
}>()
</script>

<template>
  <div class="SettingsContainer">
    <Tooltip.Root>
      <Tooltip.Trigger class="SettingsLabel"> {{ props.label }} </Tooltip.Trigger>
      <Tooltip.Content class="SettingsTooltip" side="left">
        <Tooltip.Arrow class="SettingsTooltipArrow" />
        {{ (typeof tooltip === 'undefined' ? model[0] : tooltip).toLocaleString() }} {{ unit }}
      </Tooltip.Content>
    </Tooltip.Root>
    <div class="SettingsControl">
      <Slider.Root v-model="model" class="SliderRoot" :max="max" :min="min" :step="step">
        <Slider.Track class="SliderTrack">
          <Slider.Range class="SliderRange" />
        </Slider.Track>
        <Slider.Thumb class="SliderThumb" />
      </Slider.Root>
    </div>
  </div>
</template>

<style scoped>
.SliderRoot {
  position: relative;
  width: 100%;

  display: flex;
  align-items: center;
  user-select: none;
  touch-action: none;
}

.SliderTrack {
  position: relative;
  background-color: var(--color-background-mute);
  flex-grow: 1;
  border-radius: 9999px;
  height: 0.25rem;
}

.SliderRange {
  position: absolute;
  background-color: var(--color-foreground-mute);
  border-radius: 9999px;
}

.SliderThumb {
  display: block;
  width: 1rem;
  height: 1rem;
  background-color: var(--color-foreground-soft);
  border-radius: 10px;
}

.SliderThumb:hover {
  background-color: var(--color-border-hover);
}
</style>
