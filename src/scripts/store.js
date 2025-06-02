import { ref, computed } from "vue";

export const attributeLocations = {
    position: 0,
}

export const uniformLocations = {
    resolution: null,
}

export const boardSize = ref(4)
export const textureSize = computed(() => 2 * boardSize.value - 1)
export const resolution = ref({width: 1, height: 1})
export const size = ref(0.1)
export const margin = ref(0.05)
export const border = ref(0.01)
export const fps = ref(24)
export const sps = ref(1)
