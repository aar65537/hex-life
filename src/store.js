import { ref, computed } from "vue";

export const attributeLocations = {position: 0}

export const rules = {
    born: [ref(false), ref(false), ref(true), ref(false), ref(false), ref(false), ref(false)],
    survive: [ref(false), ref(false), ref(true), ref(false), ref(false), ref(false), ref(false)]
}
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
export const boardSize = ref(10)
export const cellCount = computed(() => 3 * boardSize.value ** 2 - 3 * boardSize.value + 1)
export const rStep = computed(() => -3 * boardSize.value + 2)
export const mirror = ref(false)
export const wrap = ref(true)
export const resolution = ref([1, 1])
export const viewCenter = ref([0, 0])
export const zoom = ref(1.0)
export const size = ref(0.075)
export const margin = ref(0.003)
export const border = ref(0.000)
export const marginColor = ref([0.075, 0.115, 0.25, 1])
export const borderColor = ref([1.0, 0.8, 0.4, 1])
export const aliveColor = ref([0.9, 0.95, 0.85, 1])
export const deadColor = ref([0.1, 0.2, 0.35, 1])
export const fps = ref(24)
export const sps = ref(4)
