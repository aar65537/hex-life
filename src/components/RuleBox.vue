<script setup lang="ts">
import { Tooltip } from 'reka-ui/namespaced'
import { useHexStore } from '@/stores/hex'

const hex = useHexStore()
</script>

<template>
  <div class="SettingsContainer">
    <Tooltip.Root>
      <Tooltip.Trigger class="SettingsLabel">Rules</Tooltip.Trigger>
      <Tooltip.Content class="SettingsTooltip" side="left">
        <Tooltip.Arrow class="SettingsTooltipArrow" />
        Appling rulset {{ hex.ruleSet[0].toLocaleString() }}
      </Tooltip.Content>
    </Tooltip.Root>
    <div class="SettingsControl"></div>
  </div>
</template>

<style scoped></style>
