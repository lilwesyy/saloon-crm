<template>
  <footer class="bg-white border-t border-gray-200 px-4 py-3">
    <div class="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
      <div class="flex items-center space-x-4">
        <span>&copy; 2025 Centro Estetico CRM</span>
        <span class="hidden sm:inline">|</span>
        <span class="text-xs">Versione 1.0.0</span>
      </div>
      
      <div class="flex items-center space-x-4 mt-2 sm:mt-0">
        <span class="text-xs">
          Ultimo aggiornamento: {{ formattedDate }}
        </span>
        <div class="flex items-center space-x-2">
          <div class="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
          <span class="text-xs">Sistema operativo</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const formattedDate = computed(() => {
  return new Date().toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
})
</script>
