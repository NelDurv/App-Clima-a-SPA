import { ref } from 'vue'

// Coordenadas de ciudades
const ciudadesCoord = {
    "Arica": { lat: -18.4780, lon: -70.3210 },
    "Antofagasta": { lat: -23.6500, lon: -70.4000 },
    "Iquique": { lat: -20.2133, lon: -70.1503 },
    "La Serena": { lat: -29.9027, lon: -71.2519 },
    "Valparaíso": { lat: -33.0458, lon: -71.6197 },
    "Santiago": { lat: -33.4489, lon: -70.6693 },
    "Rancagua": { lat: -34.1703, lon: -70.7408 },
    "Concepción": { lat: -36.8270, lon: -73.0498 },
    "Temuco": { lat: -38.7359, lon: -72.5904 },
    "Puerto Montt": { lat: -41.4718, lon: -72.9394 }
}

// Datos de respaldo local
const datosLocal = {
    "Arica": { temp: 22, clima: "soleado" },
    "Antofagasta": { temp: 20, clima: "parcial despejado" },
    "Iquique": { temp: 21, clima: "soleado" },
    "La Serena": { temp: 17, clima: "parcial despejado" },
    "Valparaíso": { temp: 16, clima: "parcial despejado" },
    "Santiago": { temp: 24, clima: "soleado" },
    "Rancagua": { temp: 23, clima: "soleado" },
    "Concepción": { temp: 14, clima: "lluvioso" },
    "Temuco": { temp: 12, clima: "lluvioso" },
    "Puerto Montt": { temp: 11, clima: "lluvioso" }
}

function codigoATipoClima(code) {
    if (code === 0) return "soleado";
    if (code === 1 || code === 2) return "parcial despejado";
    if (code === 3) return "nublado";
    if (code >= 51 && code <= 67) return "lluvioso";
    if (code >= 95 && code <= 99) return "tormenta eléctrica";
    return "parcial despejado";
}

export function useWeather() {
    const loading = ref(false)
    const error = ref(null)

    const fetchCurrentWeather = async (ciudad) => {
        try {
            const coords = ciudadesCoord[ciudad.nombre]
            if (!coords) throw new Error('Coordenadas no encontradas')
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`
            const resp = await fetch(url)
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
            const data = await resp.json()
            const temp = Math.round(data.current.temperature_2m)
            const humedad = Math.round(data.current.relative_humidity_2m)

            let tipoClima = "parcial despejado"
            if (temp > 25) tipoClima = "soleado"
            else if (temp > 22) tipoClima = "parcial despejado"
            else if (temp > 15) tipoClima = "parcial despejado"
            else if (temp > 10) tipoClima = "nublado"
            else tipoClima = "lluvioso"
            if (humedad > 80) tipoClima = "lluvioso"

            return {
                nombre: ciudad.nombre,
                temperatura: temp,
                humedad,
                viento: Math.round(data.current.wind_speed_10m),
                tipoClima,
                esReal: true
            }
        } catch (err) {
            console.warn(`Error con ${ciudad.nombre}, usando fallback`)
            const fallback = datosLocal[ciudad.nombre] || { temp: 18, clima: "parcial despejado" }
            return {
                nombre: ciudad.nombre,
                temperatura: fallback.temp,
                humedad: 65,
                viento: 12,
                tipoClima: fallback.clima,
                esReal: false
            }
        }
    }

    const fetchForecast = async (nombreCiudad) => {
        loading.value = true
        error.value = null
        try {
            const coords = ciudadesCoord[nombreCiudad]
            if (!coords) throw new Error('Ciudad no encontrada')
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto&forecast_days=7`
            const resp = await fetch(url)
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
            const data = await resp.json()

            const pronostico = []
            const diasSemana = ["DOMINGO", "LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO"]
            for (let i = 0; i < 6 && i < data.daily.time.length; i++) {
                const fecha = new Date(data.daily.time[i])
                const tipoClima = codigoATipoClima(data.daily.weathercode[i])
                pronostico.push({
                    diaSemana: diasSemana[fecha.getDay()],
                    fecha: `${fecha.getDate()}/${fecha.getMonth() + 1}`,
                    tempMax: Math.round(data.daily.temperature_2m_max[i]),
                    tempMin: Math.round(data.daily.temperature_2m_min[i]),
                    tipoClima,
                    icono: getIconoByTipo(tipoClima)
                })
            }
            return pronostico
        } catch (err) {
            error.value = err.message
            return null
        } finally {
            loading.value = false
        }
    }

    function getIconoByTipo(tipo) {
        const map = {
            "soleado": "fa-sun",
            "parcial despejado": "fa-cloud-sun",
            "nublado": "fa-cloud",
            "lluvioso": "fa-cloud-showers-heavy",
            "tormenta eléctrica": "fa-bolt"
        }
        return map[tipo] || "fa-cloud"
    }

    return {
        fetchCurrentWeather,
        fetchForecast,
        loading,
        error
    }
}

export function capitalizar(texto) {
    if (!texto) return ""
    return texto.charAt(0).toUpperCase() + texto.slice(1)
}