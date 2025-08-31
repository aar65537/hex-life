<script setup lang="ts">
import { Combobox, Tooltip } from 'reka-ui/namespaced'
import { useHexStore } from '@/stores/hex'
import { ByChevronBottom, ByCheckmark } from '@kalimahapps/vue-icons'

const hex = useHexStore()

function makeOptions(group: string, offset: number) {
  return {
    name: group,
    children: [0, 1, 2, 3, 4, 5, 6].map((n) => {
      return { name: `${group}(N=${n})`, value: 1 << (n + offset) }
    }),
  }
}
const options = [makeOptions('Born', 0), makeOptions('Survive', 7)]
</script>

<template>
  <div class="SettingsContainer">
    <Tooltip.Root>
      <Tooltip.Trigger class="SettingsLabel">Rules</Tooltip.Trigger>
      <Tooltip.Content class="SettingsTooltip" side="left">
        <Tooltip.Arrow class="SettingsTooltipArrow" />
        Ruleset used in game
      </Tooltip.Content>
    </Tooltip.Root>
    <div class="SettingsControl">
      <Combobox.Root class="ComboboxRoot" multiple v-model="hex.rules">
        <Combobox.Anchor class="ComboboxAnchor">
          <span class="ComboboxValue">#{{ hex.ruleSet[0] }}</span>
          <Combobox.Trigger> <ByChevronBottom /> </Combobox.Trigger>
        </Combobox.Anchor>
        <Combobox.Content class="ComboboxContent">
          <template v-for="group in options" :key="group.name">
            <Combobox.Item
              v-for="option in group.children"
              class="ComboboxItem"
              :key="option.name"
              :value="option.value"
            >
              <span> {{ option.name }} </span>
              <Combobox.ItemIndicator> <ByCheckmark /> </Combobox.ItemIndicator>
            </Combobox.Item>
          </template>
        </Combobox.Content>
      </Combobox.Root>
    </div>
  </div>
</template>

<style scoped>
.ComboboxRoot button,
.ComboboxRoot input {
  all: unset;
}

.ComboboxAnchor {
  position: absolute;
  left: 0rem;
  bottom: 0rem;
  width: 11rem;

  padding: 0rem 0.5rem;

  display: inline-flex;
  justify-content: space-between;
}

.ComboboxValue {
  width: 100%;
  text-align: center;
}

.ComboboxContent {
  width: 12rem;
  position: absolute;
  left: 0rem;
  overflow: hidden;
  background-color: var(--color-background-soft);
  border-radius: 6px;
  margin-top: 8px;
}

.ComboboxItem {
  width: 11rem;
  border: 0.125rem outset var(--color-background-soft);
  padding: 0.125rem 0.375rem;
  display: inline-flex;
  justify-content: space-between;
}

.ComboboxItem:hover {
  border-color: var(--color-border-hover);
}
</style>
