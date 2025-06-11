import { ref, computed } from "vue";

// Settings
export const attributeLocations = { position: 0 }
export const size = { value: 0.075 }
export const margin = { value: 0.000 }
export const border = { value: 0.004 }
export const marginColor = { value: [0.075, 0.115, 0.25, 1] }
export const borderColor = { value: [0.075, 0.115, 0.25, 1] }
export const highlightBorderColor = { value: [1.0, 0.8, 0.4, 1] }
export const aliveColor = { value: [0.9, 0.95, 0.85, 1] }
export const deadColor = { value: [0.1, 0.2, 0.35, 1] }
export const delta = 10
export const acceleration = 0.35
export const dampening = 0.85

// Globals
export const activeCell = { value: -1 }
export const resolution = { value: [1, 1] }
export const viewCenter = { value: [0, 0] }
export const zoomFactor = { value: 0.15 }
export const viewVelocity = [0, 0]

// Refs
export const rules = {
    born: [ref(false), ref(false), ref(true), ref(false), ref(false), ref(false), ref(false)],
    survive: [ref(false), ref(false), ref(true), ref(false), ref(false), ref(false), ref(false)]
}
export const fps = ref(24)
export const sps = ref(4)
export const boardSize = ref(10)
export const wrap = ref(true)
export const mirror = ref(false)
export const zoom = ref(0.0)
export const zoomFail = ref(6)

// Computed
export const ruleSet = computed(() => {
    let ruleSet = 0
    for (let index = 0; index < rules.born.length; index++) {
        if(rules.born[index].value) {
            ruleSet += 1 << index
        }
    }
    for (let index = 0; index < rules.survive.length; index++) {
        if(rules.survive[index].value) {
            ruleSet += 1 << (index + 7)
        }
    }
    return ruleSet
})
export const cellCount = computed(() => 3 * boardSize.value ** 2 - 3 * boardSize.value + 1)
export const rStep = computed(() => -3 * boardSize.value + 2)
export const drawDot = computed(() => zoom.value > -zoomFail.value)