<template>
  <div class="city-card">
    <img class="card-bg-img" :src="imagenClima" :alt="clima.nombre" @error="handleImageError">
    <div class="card-overlay"></div>
    <div class="card-body">
      <div>
        <div class="d-flex justify-content-between align-items-start">
          <div>
            <div class="city-name">{{ clima.nombre }}</div>
            <div class="small opacity-75">Chile</div>
          </div>
        </div>
        <div class="mt-3">
          <div class="temp-actual">
            {{ convertTemp(clima.temperatura) }}<small>{{ unitSymbol }}</small>
          </div>
          <div class="temp-range-btn mt-2">
            <span class="temp-max-val"><i class="fas fa-arrow-up"></i> {{ convertTemp(tempMax) }}{{ unitSymbol === '°C' ? '°' : '°F' }}</span>
            <span class="mx-2">|</span>
            <span class="temp-min-val"><i class="fas fa-arrow-down"></i> {{ convertTemp(tempMin) }}{{ unitSymbol === '°C' ? '°' : '°F' }}</span>
          </div>
        </div>
      </div>
      <div class="mt-4 text-center">
        <div class="clase-dia-badge d-inline-block mb-2">
          <i :class="['fas', iconoClima]"></i> {{ capitalizar(clima.tipoClima) }}
        </div>
        <button class="btn-detalle w-100" @click="verDetalle">
          Ver pronóstico 6 días
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { capitalizar } from '../composables/useWeather'

const props = defineProps({
  clima: Object,
  convertTemp: Function,
  unitSymbol: String
})

const router = useRouter()

const imagenesClima = {
  "soleado": "src/assets/img/dia soleado.jpeg",
  "parcial despejado": "src/assets/img/parcial_despejado.jpeg",
  "nublado": "src/assets/img/dia-nublado2.jpeg",
  "lluvioso": "src/assets/img/lluvia.jpeg",
  "viento": "src/assets/img/dia de viento.jpeg",
  "tormenta eléctrica": "src/assets/img/tormenta_electrica.jpeg"
}

const iconosClima = {
  "soleado": "fa-sun",
  "parcial despejado": "fa-cloud-sun",
  "nublado": "fa-cloud",
  "lluvioso": "fa-cloud-showers-heavy",
  "viento": "fa-wind",
  "tormenta eléctrica": "fa-bolt"
}

const imagenClima = computed(() => imagenesClima[props.clima.tipoClima] || imagenesClima["parcial despejado"])
const iconoClima = computed(() => iconosClima[props.clima.tipoClima] || "fa-cloud")

const tempMax = computed(() => props.clima.temperatura + Math.floor(Math.random() * 4) + 2)
const tempMin = computed(() => props.clima.temperatura - Math.floor(Math.random() * 5) - 1)

const verDetalle = () => {
  router.push(`/lugar/${encodeURIComponent(props.clima.nombre)}`)
}

const handleImageError = (e) => {
  e.target.src = 'https://picsum.photos/id/29/400/300'
}
</script>