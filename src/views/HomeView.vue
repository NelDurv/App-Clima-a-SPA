<template>
  <div class="bg-secondary py-4 min-vh-100">
    <div class="container">
      <header class="py-3 text-center text-white">
        <h1 class="display-5">Clima en Ciudades de Chile</h1>
        <p class="lead">Datos actualizados desde Open-Meteo</p>

        <!-- Búsqueda, unidad mejorada y botón de alerta -->
        <div class="row justify-content-center mt-3 g-2">
          <div class="col-md-4 col-12">
            <div class="input-group">
              <span class="input-group-text bg-white"><i class="fas fa-search"></i></span>
              <input
                type="text"
                class="form-control search-input"
                placeholder="Buscar ciudad..."
                v-model="searchTerm"
              />
            </div>
          </div>
          <div class="col-md-3 col-6">
            <button
              class="btn btn-light w-100"
              @click="toggleUnit"
              :title="`Cambiar a ${unitSymbol === '°C' ? 'Fahrenheit' : 'Celsius'}`"
            >
              <i class="fas fa-thermometer-half me-1"></i>
              Cambiar a {{ unitSymbol === '°C' ? '°F' : '°C' }}
              <i class="fas fa-exchange-alt ms-1"></i>
            </button>
          </div>
          <div class="col-md-4 col-6">
            <button
              class="btn btn-danger w-100"
              @click="mostrarAlertaCultivos"
              title="Ver alertas de bajas temperaturas para cultivos"
            >
              <i class="fas fa-leaf me-1"></i> Peligro para Cultivos
            </button>
          </div>
        </div>
        <div id="api-status" class="small mt-2">
          <span class="badge" :class="apiConnected ? 'bg-success' : 'bg-warning'">
            {{ apiConnected ? '🌐 Conectado a Open-Meteo' : '📀 Usando datos locales' }}
          </span>
        </div>
      </header>

      <!-- Loading y grilla... (el resto queda igual) -->
      <div v-if="loadingCities" class="text-center py-5">
        <div class="spinner-border text-light" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="text-white mt-3">Cargando clima de ciudades...</p>
      </div>

      <div v-else class="grid-container">
        <WeatherCard
          v-for="clima in filteredClimas"
          :key="clima.nombre"
          :clima="clima"
          :convertTemp="convertTemp"
          :unitSymbol="unitSymbol"
        />
        <div v-if="filteredClimas.length === 0" class="text-center text-white w-100 py-5">
          <i class="fas fa-city fa-3x mb-3"></i>
          <h4>No se encontraron ciudades con "{{ searchTerm }}"</h4>
        </div>
      </div>
    </div>

    <!-- Modal de alerta para cultivos (sin cambios) -->
    <div
      class="modal fade"
      id="modalCultivos"
      tabindex="-1"
      aria-labelledby="modalCultivosLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="modalCultivosLabel">
              <i class="fas fa-exclamation-triangle me-2"></i>¡Alerta! Riesgo para Cultivos
            </h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Cerrar"
            ></button>
          </div>
          <div class="modal-body">
            <div v-if="ciudadesEnPeligro.length === 0" class="text-center">
              <i class="fas fa-check-circle fa-3x text-success mb-2"></i>
              <p>No se registran temperaturas peligrosas para cultivos en ninguna ciudad.</p>
            </div>
            <div v-else>
              <p>
                <strong
                  >Las siguientes ciudades presentan temperaturas mínimas bajo 2°C, lo que puede
                  dañar los cultivos:</strong
                >
              </p>
              <ul class="list-group">
                <li
                  v-for="ciudad in ciudadesEnPeligro"
                  :key="ciudad.nombre"
                  class="list-group-item d-flex justify-content-between align-items-center"
                >
                  {{ ciudad.nombre }}
                  <span class="badge bg-primary rounded-pill">{{ ciudad.tempMin }}°C</span>
                </li>
              </ul>
              <p class="mt-3 small text-muted">
                * Temperaturas iguales o inferiores a 2°C ponen en riesgo a cultivos sensibles.
              </p>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useWeather } from '../composables/useWeather'
import { useUnit } from '../composables/useUnit'
import WeatherCard from '../components/WeatherCard.vue'

const ciudades = [
  'Arica',
  'Antofagasta',
  'Iquique',
  'La Serena',
  'Valparaíso',
  'Santiago',
  'Rancagua',
  'Concepción',
  'Temuco',
  'Puerto Montt',
]

const { fetchCurrentWeather } = useWeather()
const { unitSymbol, toggleUnit, convertTemp } = useUnit()

const climas = ref([])
const loadingCities = ref(true)
const apiConnected = ref(true)
const searchTerm = ref('')
const ciudadesEnPeligro = ref([])

const filteredClimas = computed(() => {
  if (!searchTerm.value) return climas.value
  const term = searchTerm.value.toLowerCase()
  return climas.value.filter((c) => c.nombre.toLowerCase().includes(term))
})

const calcularTempMin = (tempActual) => {
  return tempActual - (Math.floor(Math.random() * 5) + 1)
}

const mostrarAlertaCultivos = () => {
  const peligro = []
  for (const clima of climas.value) {
    const tempMin = calcularTempMin(clima.temperatura)
    if (tempMin < 2) {
      peligro.push({
        nombre: clima.nombre,
        tempMin: tempMin,
      })
    }
  }
  ciudadesEnPeligro.value = peligro

  const modalElement = document.getElementById('modalCultivos')
  if (modalElement && window.bootstrap) {
    const modal = new window.bootstrap.Modal(modalElement)
    modal.show()
  } else {
    alert(
      ciudadesEnPeligro.value.length
        ? `Ciudades en riesgo: ${ciudadesEnPeligro.value.map((c) => `${c.nombre} (${c.tempMin}°C)`).join(', ')}`
        : 'No hay peligro para cultivos.',
    )
  }
}

onMounted(async () => {
  loadingCities.value = true
  const resultados = []
  for (const nombre of ciudades) {
    const clima = await fetchCurrentWeather({ nombre })
    resultados.push(clima)
    if (!clima.esReal) apiConnected.value = false
  }
  climas.value = resultados
  loadingCities.value = false
})
</script>
