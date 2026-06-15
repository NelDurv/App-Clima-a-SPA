import { ref, computed } from 'vue'

export function useUnit() {
    const unit = ref('C') // 'C' or 'F'

    const toggleUnit = () => {
        unit.value = unit.value === 'C' ? 'F' : 'C'
    }

    const convertTemp = (celsius) => {
        if (unit.value === 'C') return celsius
        return Math.round((celsius * 9 / 5) + 32)
    }

    const unitSymbol = computed(() => unit.value === 'C' ? '°C' : '°F')

    return { unit, toggleUnit, convertTemp, unitSymbol }
}