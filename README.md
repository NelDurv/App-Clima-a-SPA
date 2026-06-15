# App del Clima Chile – Vue 3 SPA

Aplicación meteorológica de una sola página (SPA) desarrollada con **Vue 3 Composition API** y **Vue Router**. Muestra el clima actual de 10 ciudades chilenas y el pronóstico detallado a 6 días, con estadísticas y alertas. Incluye un botón especial para **alertar a agricultores** sobre temperaturas peligrosas para los cultivos.



## Tecnologías utilizadas

- **Vue 3** – Framework progresivo con Composition API.
- **Vue Router 4** – Navegación SPA sin recarga de página.
- **Bootstrap 5** – Estilos, grid responsive y componentes (modal).
- **Font Awesome 6** – Iconografía climática y de interfaz.
- **Open-Meteo API** – Datos meteorológicos reales (current + 7‑day forecast).
- **Vite** – Empaquetador y servidor de desarrollo ultrarrápido.

## 📁 Estructura del proyecto

vue-clima-chile/
├── index.html
├── package.json
├── vite.config.js
├── src/
│ ├── main.js # Punto de entrada, registra router
│ ├── App.vue # Componente raíz (navbar + router-view)
│ ├── router/
│ │ └── index.js # Rutas: home y detalle dinámico
│ ├── views/
│ │ ├── HomeView.vue # Listado de ciudades + filtro + botones
│ │ └── DetailView.vue # Pronóstico 6 días + estadísticas + alertas
│ ├── components/
│ │ ├── WeatherCard.vue # Tarjeta individual de ciudad (Home)
│ │ └── ForecastCard.vue # Tarjeta de día (Detail)
│ ├── composables/
│ │ ├── useWeather.js # Lógica de llamadas a API y fallback
│ │ └── useUnit.js # Conversión °C / °F
│ └── assets/
│ ├── css/
│ │ └── style.css # Estilos originales (tarjetas, grid, etc.)
│ └── img/ # Imágenes de fondo por tipo de clima

---

##  Funcionalidades principales

###  Página de inicio (Home)

- Muestra **10 ciudades chilenas** con:
  - Temperatura actual.
  - Temperaturas máximas y mínimas estimadas.
  - Descripción del clima (soleado, nublado, lluvioso, etc.).
  - Imagen de fondo representativa.
- **Buscador** en tiempo real (filtra ciudades por nombre).
- **Selector de unidad** (°C / °F) – dos‑way binding con v‑model.
- **Botón especial: "Peligro para Cultivos"** – analiza todas las ciudades y muestra en un modal aquellas con temperaturas mínimas inferiores a 2°C (rango 2°C a -10°C), alertando sobre riesgo para agricultura.
- Navegación al detalle mediante `router.push()` (sin recarga).

###  Página de detalle (Detalle de ciudad)

- Ruta dinámica `/lugar/:nombre`.
- Pronóstico **6 días** (temperatura máx./mín., tipo de clima, icono, día de semana).
- **Estadísticas semanales**:
  - Temperatura máxima, mínima y promedio.
  - Número de días soleados y lluviosos.
- **Alertas climáticas** automáticas (calor extremo, frío, semana lluviosa).
- Botón **"Volver"** que utiliza `$router.go(-1)` para mantener historial sin recargar.

###  Consumo de API

- Uso de **Open‑Meteo** (gratuita, sin clave).
- Fallback a datos locales si falla la conexión o la ciudad no está en el mapa.
- Indicador visual de estado (conectado / datos locales).

###  Estilos

- Responsive con **CSS Grid** y **Flexbox**.
- Tarjetas con efecto hover y degradados.
- Totalmente adaptado a móviles, tablets y desktop.

---

## GitHub

https://github.com/NelDurv/App-Clima-a-SPA

https://github.com/NelDurv/App-Clima-a-SPA/commit/123cae4e53476b4527abb6ed04d0b36c82d1c80f

## Créditos

Datos meteorológicos: Open‑Meteo

Iconos: Font Awesome

Framework CSS: Bootstrap

Desarrollado como parte del Módulo 6 – Vue.js SPA

## Licencia

Proyecto educativo – sin fines comerciales.
© Neldur 2026
