<template>
  <div class="bg-secondary py-4 min-vh-100">
    <div class="container">
      <header class="py-3 text-center text-white">
        <h1 class="display-5">Clima en Ciudades de Chile</h1>
        <p class="lead">Datos actualizados desde Open-Meteo</p>
        
        <!-- Interacción con v-model: búsqueda y unidad -->
        <div class="row justify-content-center mt-3 g-2">
          <div class="col-md-5 col-8">
            <div class="input-group">
              <span class="input-group-text bg-white"><i class="fas fa-search"></i></span>
              <input type="text" class="form-control search-input" placeholder="Buscar ciudad..." v-model="searchTerm">
            </div>
          </div>
          <div class="col-md-3 col-4">
            <button class="btn btn-light w-100" @click="toggleUnit">
              <i class="fas fa-thermometer-half me-1"></i> {{ unitSymbol }} 
              <i class="fas fa-exchange-alt ms-1"></i>
            </button>
          </div>
        </div>
        <div id="api-status" class="small mt-2">
          <span class="badge" :class="apiConnected ? 'bg-success' : 'bg-warning'">
            {{ apiConnected ? '🌐 Conectado a Open-Meteo' : '📀 Usando datos locales' }}
          </span>
        </div>
      </header>

      <!-- Loading -->
      <div v-if="loadingCities" class="text-center py-5">
        <div class="spinner-border text-light" role="status"><span class="visually-hidden">Cargando...</span></div>
        <p class="text-white mt-3">Cargando clima de ciudades...</p>
      </div>

      <!-- Grid de tarjetas -->
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
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useWeather } from '../composables/useWeather'
import { useUnit } from '../composables/useUnit'
import WeatherCard from '../components/WeatherCard.vue'

// Lista de ciudades (mismo orden original)
const ciudades = [
  "Arica", "Antofagasta", "Iquique", "La Serena", "Valparaíso",
  "Santiago", "Rancagua", "Concepción", "Temuco", "Puerto Montt"
]

const { fetchCurrentWeather } = useWeather()
const { unitSymbol, toggleUnit, convertTemp } = useUnit()

const climas = ref([])
const loadingCities = ref(true)
const apiConnected = ref(true)
const searchTerm = ref("")

const filteredClimas = computed(() => {
  if (!searchTerm.value) return climas.value
  const term = searchTerm.value.toLowerCase()
  return climas.value.filter(c => c.nombre.toLowerCase().includes(term))
})

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