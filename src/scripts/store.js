import { ref, computed } from "vue";

export const attributeLocations = {position: 0}
export const uniformLocations = {}


export const boardSize = ref(16)
export const textureSize = computed(() => 2 * boardSize.value - 1)
export const resolution = ref({width: 1, height: 1})
export const viewCenter = ref({x: 0, y: 0})
export const zoom = ref(1.0)
export const size = ref(0.05)
export const margin = ref(0.05)
export const border = ref(0.01)
export const fps = ref(24)
export const sps = ref(4)
