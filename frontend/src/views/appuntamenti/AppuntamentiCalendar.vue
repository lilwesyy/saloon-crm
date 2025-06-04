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
      
      <div v-else-if="error" class="text-center py-8 text-red-500">
        {{ error }}
      </div>
      
      <div v-else class="grid gap-4">
        <div v-if="appuntamenti.length === 0" class="text-center py-8 text-gray-500">
          Nessun appuntamento per la data selezionata
        </div>
        
        <div 
          v-for="appuntamento in appuntamenti" 
          :key="appuntamento._id"
          class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div class="flex justify-between items-start">
            <div>
              <h3 class="font-semibold">{{ appuntamento.cliente.nome }} {{ appuntamento.cliente.cognome }}</h3>
              <p class="text-gray-600">{{ getServizioNames(appuntamento) }}</p>
              <p class="text-sm text-gray-500">
                {{ formatTime(appuntamento.dataOraInizio) }} - {{ formatDuration(appuntamento) }}
              </p>
              <p class="text-sm text-gray-500">
                Operatore: {{ appuntamento.operatore.nome }} {{ appuntamento.operatore.cognome }}
              </p>
              <span 
                class="inline-block px-2 py-1 text-xs rounded-full mt-2"
                :class="{
                  'bg-yellow-100 text-yellow-800': appuntamento.stato === 'prenotato',
                  'bg-green-100 text-green-800': appuntamento.stato === 'confermato',
                  'bg-blue-100 text-blue-800': appuntamento.stato === 'completato',
                  'bg-red-100 text-red-800': appuntamento.stato === 'cancellato',
                  'bg-gray-100 text-gray-800': appuntamento.stato === 'noshow'
                }"
              >
                {{ appuntamento.stato.charAt(0).toUpperCase() + appuntamento.stato.slice(1) }}
              </span>
            </div>
            <div class="flex gap-2">
              <router-link 
                :to="`/appuntamenti/${appuntamento._id}`"
                class="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
              >
                Modifica
              </router-link>
              <button 
                @click="deleteAppuntamento(appuntamento._id)"
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
import { ref, onMounted, watch, computed } from 'vue'
import { useAppuntamentiStore } from '@/stores/appuntamenti'
import type { Appuntamento } from '@/services/appuntamenti.service'

const appuntamentiStore = useAppuntamentiStore()

const selectedDate = ref(new Date().toISOString().split('T')[0])
const viewMode = ref('day')

// Computed properties for store state
const loading = computed(() => appuntamentiStore.loading)
const appuntamenti = computed(() => appuntamentiStore.appuntamenti)
const error = computed(() => appuntamentiStore.error)

const formatTime = (dateTime: string) => {
  return new Date(dateTime).toLocaleTimeString('it-IT', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const formatDuration = (appuntamento: Appuntamento) => {
  // Calculate duration from dataOraInizio and dataOraFine
  const inizio = new Date(appuntamento.dataOraInizio)
  const fine = new Date(appuntamento.dataOraFine)
  const minutes = Math.floor((fine.getTime() - inizio.getTime()) / (1000 * 60))
  
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
}

const getServizioNames = (appuntamento: Appuntamento) => {
  return appuntamento.servizi.map(s => s.servizio.nome).join(', ')
}

const fetchAppuntamenti = async () => {
  try {
    if (viewMode.value === 'day') {
      // Fetch appointments for selected date
      await appuntamentiStore.fetchAppuntamentiByDate(selectedDate.value)
    } else if (viewMode.value === 'week') {
      // Calculate week start and end
      const date = new Date(selectedDate.value)
      const startOfWeek = new Date(date)
      startOfWeek.setDate(date.getDate() - date.getDay())
      
      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6)
      
      await appuntamentiStore.fetchAppuntamentiByDateRange(
        startOfWeek.toISOString().split('T')[0],
        endOfWeek.toISOString().split('T')[0]
      )
    } else if (viewMode.value === 'month') {
      // Calculate month start and end
      const date = new Date(selectedDate.value)
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0)
      
      await appuntamentiStore.fetchAppuntamentiByDateRange(
        startOfMonth.toISOString().split('T')[0],
        endOfMonth.toISOString().split('T')[0]
      )
    }
  } catch (error) {
    console.error('Errore nel caricamento degli appuntamenti:', error)
  }
}

const deleteAppuntamento = async (id: string) => {
  if (confirm('Sei sicuro di voler eliminare questo appuntamento?')) {
    try {
      await appuntamentiStore.deleteAppuntamento(id)
      // Refresh appointments after deletion
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
