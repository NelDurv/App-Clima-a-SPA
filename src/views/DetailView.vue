<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
      <h1 class="display-6">
        <i class="fas fa-calendar-alt me-2"></i> Pronóstico 6 días: {{ nombreCiudad }}
      </h1>
      <button class="btn btn-secondary" @click="$router.go(-1)">
        <i class="fas fa-arrow-left"></i> Volver
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-3">Cargando pronóstico para 6 días...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="alert alert-danger text-center p-5">
      <i class="fas fa-exclamation-triangle fa-3x mb-3"></i>
      <h3>Error al cargar el pronóstico</h3>
      <p>{{ error }}</p>
      <button class="btn btn-primary mt-3" @click="$router.push('/')">Volver al inicio</button>
    </div>

    <!-- Pronóstico y estadísticas -->
    <div v-else-if="pronostico && pronostico.length">
      <!-- Grid de pronóstico: 6 tarjetas en fila horizontal -->
      <div class="row g-4 mb-5">
        <div v-for="(dia, idx) in pronostico" :key="idx" class="col-md-2 col-6">
          <ForecastCard :dia="dia" :convertTemp="convertTemp" :unitSymbol="unitSymbol" />
        </div>
      </div>

      <div class="row mt-5 g-4">
        <div class="col-md-6">
          <div class="card shadow-sm h-100">
            <div class="card-header">
              <i class="fas fa-chart-line me-2"></i>Estadísticas de la Semana
            </div>
            <div class="card-body">
              <div class="row text-center">
                <div class="col-4">
                  <div class="display-6 text-danger">{{ convertTemp(estadisticas.tempMax) }}°</div>
                  <small>Máxima</small>
                </div>
                <div class="col-4">
                  <div class="display-6 text-primary">{{ convertTemp(estadisticas.tempMin) }}°</div>
                  <small>Mínima</small>
                </div>
                <div class="col-4">
                  <div class="display-6 text-success">
                    {{ convertTemp(estadisticas.tempProm) }}°
                  </div>
                  <small>Promedio</small>
                </div>
              </div>
              <hr />
              <div class="row text-center">
                <div class="col-6">
                  <i class="fas fa-sun fa-2x text-warning"></i>
                  <p class="mt-2">
                    <strong>{{ estadisticas.diasSoleados }}</strong> días soleados
                  </p>
                </div>
                <div class="col-6">
                  <i class="fas fa-cloud-rain fa-2x text-info"></i>
                  <p class="mt-2">
                    <strong>{{ estadisticas.diasLluvia }}</strong> días lluviosos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card shadow-sm h-100">
            <div class="card-header"><i class="fas fa-bell me-2"></i>Alertas de Clima</div>
            <div class="card-body">
              <div v-if="alertas.length === 0" class="text-center">
                <i class="fas fa-smile-wink fa-3x text-success mb-2"></i>
                <p>No hay alertas climáticas para esta semana.</p>
              </div>
              <div v-for="(alerta, idx) in alertas" :key="idx" :class="['alert', alerta.clase]">
                <i :class="['fas', alerta.icono, 'me-2']"></i>
                <strong>{{ alerta.titulo }}</strong>
                <p class="mb-0 mt-1">{{ alerta.mensaje }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWeather } from '../composables/useWeather'
import { useUnit } from '../composables/useUnit'
import ForecastCard from '../components/ForecastCard.vue'

const route = useRoute()
const router = useRouter()
const nombreCiudad = computed(() => decodeURIComponent(route.params.nombre))
const { fetchForecast, loading, error } = useWeather()
const { convertTemp, unitSymbol } = useUnit()

const pronostico = ref([])
const estadisticas = ref({ tempMax: 0, tempMin: 0, tempProm: 0, diasSoleados: 0, diasLluvia: 0 })
const alertas = ref([])

function calcularEstadisticas(dias) {
  let tempMax = -100,
    tempMin = 100,
    suma = 0
  let soleados = 0,
    lluvia = 0
  for (const dia of dias) {
    tempMax = Math.max(tempMax, dia.tempMax)
    tempMin = Math.min(tempMin, dia.tempMin)
    suma += (dia.tempMax + dia.tempMin) / 2
    if (dia.tipoClima === 'soleado' || dia.tipoClima === 'parcial despejado') soleados++
    if (dia.tipoClima === 'lluvioso' || dia.tipoClima === 'tormenta eléctrica') lluvia++
  }
  return {
    tempMax,
    tempMin,
    tempProm: Math.round(suma / dias.length),
    diasSoleados: soleados,
    diasLluvia: lluvia,
  }
}

function generarAlertas(est) {
  const alerts = []
  if (est.tempProm > 28) {
    alerts.push({
      clase: 'alert-danger',
      icono: 'fa-temperature-high',
      titulo: '🔥 Alerta de Calor Extremo',
      mensaje: `Promedio de ${est.tempProm}°C. ¡Protégete del sol!`,
    })
  } else if (est.tempProm > 24) {
    alerts.push({
      clase: 'alert-warning',
      icono: 'fa-sun',
      titulo: '☀️ Clima Cálido',
      mensaje: `Promedio de ${est.tempProm}°C. Días agradables.`,
    })
  }
  if (est.tempMin < 5) {
    alerts.push({
      clase: 'alert-info',
      icono: 'fa-snowflake',
      titulo: '❄️ Alerta de Frío',
      mensaje: `Mínima de ${est.tempMin}°C. ¡Abrígate bien!`,
    })
  }
  if (est.diasLluvia >= 3) {
    alerts.push({
      clase: 'alert-primary',
      icono: 'fa-cloud-rain',
      titulo: '🌧️ Semana Lluviosa',
      mensaje: `${est.diasLluvia} días de lluvia. ¡Lleva paraguas!`,
    })
  }
  return alerts
}

onMounted(async () => {
  const data = await fetchForecast(nombreCiudad.value)
  if (data) {
    pronostico.value = data
    const stats = calcularEstadisticas(data)
    estadisticas.value = stats
    alertas.value = generarAlertas(stats)
  }
})
</script>
