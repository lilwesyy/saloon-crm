<template>
  <div class="container mx-auto px-4 py-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Calendario Appuntamenti</h1>
      <router-link 
        to="/appuntamenti/nuovo" 
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Nuovo Appuntamento
      </router-link>
    </div>
    
    <div class="bg-white shadow-md rounded-lg p-6">
      <div class="mb-6">
        <div class="flex gap-4 items-center">
          <input 
            v-model="selectedDate" 
            type="date" 
            class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
          <select 
            v-model="viewMode" 
            class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="day">Giorno</option>
            <option value="week">Settimana</option>
            <option value="month">Mese</option>
          </select>
        </div>
      </div>
      
      <div v-if="loading" class="text-center py-8">
        Caricamento appuntamenti...
      </div>
      
      <div v-else class="grid gap-4">
        <div v-if="appuntamenti.length === 0" class="text-center py-8 text-gray-500">
          Nessun appuntamento per la data selezionata
        </div>
        
        <div 
          v-for="appuntamento in appuntamenti" 
          :key="appuntamento.id"
          class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div class="flex justify-between items-start">
            <div>
              <h3 class="font-semibold">{{ appuntamento.cliente.nome }} {{ appuntamento.cliente.cognome }}</h3>
              <p class="text-gray-600">{{ appuntamento.servizio.nome }}</p>
              <p class="text-sm text-gray-500">
                {{ formatTime(appuntamento.dataOra) }} - {{ formatDuration(appuntamento.durata) }}
              </p>
            </div>
            <div class="flex gap-2">
              <router-link 
                :to="`/appuntamenti/${appuntamento.id}`"
                class="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
              >
                Modifica
              </router-link>
              <button 
                @click="deleteAppuntamento(appuntamento.id)"
                class="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
              >
                Elimina
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const loading = ref(true)
const selectedDate = ref(new Date().toISOString().split('T')[0])
const viewMode = ref('day')
const appuntamenti = ref([])

const formatTime = (dateTime: string) => {
  return new Date(dateTime).toLocaleTimeString('it-IT', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
}

const fetchAppuntamenti = async () => {
  loading.value = true
  try {
    // TODO: Implementare chiamata API
    appuntamenti.value = []
  } catch (error) {
    console.error('Errore nel caricamento degli appuntamenti:', error)
  } finally {
    loading.value = false
  }
}

const deleteAppuntamento = async (id: string) => {
  if (confirm('Sei sicuro di voler eliminare questo appuntamento?')) {
    try {
      // TODO: Implementare chiamata API
      await fetchAppuntamenti()
    } catch (error) {
      console.error('Errore nell\'eliminazione dell\'appuntamento:', error)
    }
  }
}

watch(selectedDate, fetchAppuntamenti)
watch(viewMode, fetchAppuntamenti)

onMounted(fetchAppuntamenti)
</script>
