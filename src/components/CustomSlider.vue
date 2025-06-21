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
  <div class="SliderContainer">
    <Tooltip.Root>
      <Tooltip.Trigger class="SliderLabel"> {{ props.label }} </Tooltip.Trigger>
      <Tooltip.Content class="SliderTooltip" side="left">
        <Tooltip.Arrow class="SliderTooltipArrow" />
        {{ (typeof tooltip === 'undefined' ? model[0] : tooltip).toLocaleString() }} {{ unit }}
      </Tooltip.Content>
    </Tooltip.Root>
    <Slider.Root v-model="model" class="SliderRoot" :max="max" :min="min" :step="step">
      <Slider.Track class="SliderTrack">
        <Slider.Range class="SliderRange" />
      </Slider.Track>
      <Slider.Thumb class="SliderThumb" />
    </Slider.Root>
  </div>
</template>

<style>
.SliderTooltip {
  color: var(--color-foreground);
  background-color: var(--color-background-soft);
  border: 0.125rem outset var(--color-background-mute);
  border-right: 0.125rem outset var(--color-border-hover);
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
}

.SliderTooltipArrow {
  fill: var(--color-border-hover);
}
</style>

<style scoped>
.SliderContainer {
  width: 100%;

  display: flex;
  align-items: center;
}

.SliderLabel {
  width: 50%;
  text-align: center;
  color: var(--color-foreground);
  background-color: var(--color-background-soft);
  border: 0rem;
  padding: 0.125rem 0rem;
}

.SliderRoot {
  position: relative;
  height: 100%;
  width: 100%;
  padding-right: 0.5rem;

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
  height: 100%;
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
