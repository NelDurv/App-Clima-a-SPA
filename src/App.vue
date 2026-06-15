<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg bg-primary bg-gradient px-4">
      <div class="container-fluid">
        <router-link to="/" class="navbar-brand text-white">
          <i class="fas fa-cloud-sun me-2"></i>Vue Clima Chile
        </router-link>
        <div class="ms-auto text-white small">
          <i class="fas fa-map-marker-alt me-1"></i> 10 ciudades
        </div>
      </div>
    </nav>
    <main>
      <router-view />
    </main>
    <footer class="bg-dark mt-5">
      <p class="text-white text-center p-3 mb-0">© Neldur 2026 - App del Clima Chile | Datos: Open-Meteo</p>
    </footer>
  </div>
</template>

<script setup>
// Componente raíz con router-view
</script>

<style scoped>
main {
  min-height: calc(100vh - 130px);
}
</style>