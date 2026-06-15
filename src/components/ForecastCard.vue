<template>
  <div class="forecast-card">
    <div class="fw-bold">{{ dia.diaSemana }}</div>
    <div class="small text-muted mb-2">{{ dia.fecha }}</div>
    <i :class="['fas', dia.icono, 'fa-2x', 'my-2']"></i>
    <div class="d-flex justify-content-center gap-3">
      <span class="text-danger fw-bold"><i class="fas fa-arrow-up"></i> {{ convertTemp(dia.tempMax) }}{{ unitSymbol === '°C' ? '°' : '°F' }}</span>
      <span class="text-primary fw-bold"><i class="fas fa-arrow-down"></i> {{ convertTemp(dia.tempMin) }}{{ unitSymbol === '°C' ? '°' : '°F' }}</span>
    </div>
    <div class="small text-muted mt-2">{{ capitalizar(dia.tipoClima) }}</div>
  </div>
</template>

<script setup>
import { capitalizar } from '../composables/useWeather'

defineProps({
  dia: Object,
  convertTemp: Function,
  unitSymbol: String
})
</script>