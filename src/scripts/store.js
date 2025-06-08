import { ref, computed } from "vue";

export const attributeLocations = {position: 0}
export const uniformLocations = {}

export const boardSize = ref(3)
export const cellCount = computed(() => 3 * boardSize.value ** 2 - 3 * boardSize.value + 1)
export const qStep = computed(() => 3 * boardSize.value - 2)
export const mirror = ref(true)
export const wrap = ref(true)
export const resolution = ref({width: 1, height: 1})
export const viewCenter = ref({x: 0, y: 0})
export const zoom = ref(1.0)
export const size = ref(0.075)
export const margin = ref(0.003)
export const border = ref(0.003)
export const marginColor = ref([0.075, 0.115, 0.25, 1])
export const borderColor = ref([1.0, 0.8, 0.4, 1])
export const aliveColor = ref([0.9, 0.95, 0.85, 1])
export const deadColor = ref([0.1, 0.2, 0.35, 1])
export const fps = ref(24)
export const sps = ref(4)
