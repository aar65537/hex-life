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
  <div class="SettingsContainer">
    <Tooltip.Root>
      <Tooltip.Trigger class="SettingsLabel">{{ props.label }}</Tooltip.Trigger>
      <Tooltip.Content class="SettingsTooltip" side="left">
        <Tooltip.Arrow class="SettingsTooltipArrow" />
        {{ props.tooltip }}
      </Tooltip.Content>
    </Tooltip.Root>
    <div class="SettingsControl">
      <Switch.Root v-model="value" class="SwitchRoot">
        <Switch.Thumb class="SwitchThumb" />
      </Switch.Root>
    </div>
  </div>
</template>

<style scoped>
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
