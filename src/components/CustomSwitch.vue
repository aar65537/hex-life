<script setup lang="ts">
import { computed } from 'vue'
import { Switch, Tooltip } from 'reka-ui/namespaced'

const model = defineModel<number[]>({ required: true })
const props = defineProps<{
  label: string
  tooltip: string
}>()

const value = computed({
  get() {
    return Boolean(model.value[0])
  },
  set(newValue: boolean) {
    model.value[0] = Number(newValue)
  },
})
</script>

<template>
  <div class="SwitchContainer">
    <Tooltip.Root>
      <Tooltip.Trigger class="SwitchLabel">{{ props.label }}</Tooltip.Trigger>
      <Tooltip.Content class="SliderTooltip" side="left">
        <Tooltip.Arrow class="SliderTooltipArrow" />
        {{ props.tooltip }}
      </Tooltip.Content>
    </Tooltip.Root>
    <div class="SwitchControl">
      <Switch.Root v-model="value" class="SwitchRoot">
        <Switch.Thumb class="SwitchThumb" />
      </Switch.Root>
    </div>
  </div>
</template>

<style scoped>
.SwitchContainer {
  width: 100%;
  display: flex;
  align-items: stretch;
}

.SwitchLabel {
  width: 50%;
  text-align: center;
  color: var(--color-foreground);
  background-color: var(--color-background-soft);
  border: 0rem;
  padding: 0.125rem 0rem;
}

.SwitchControl {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 0.5rem;
}

.SwitchRoot {
  position: relative;
  height: 50%;
  width: 1.25rem;
  background-color: var(--color-background-mute);
  border-radius: 9999px;
}

.SwitchRoot[data-state='checked'] {
  background-color: var(--color-border-hover);
}

.SwitchThumb {
  display: block;
  height: 0.4375rem;
  width: 0.5rem;
  transform: translate(-0.225rem, -0.0625rem);
  background-color: var(--color-foreground-soft);
  border-radius: 9999px;
  transition: transform 100ms;
  will-change: transform;
}

.SwitchThumb[data-state='checked'] {
  transform: translate(0.225rem, -0.0625rem);
}
</style>
