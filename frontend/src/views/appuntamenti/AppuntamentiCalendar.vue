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
        <div class="flex gap-4 items-center justify-between">
          <div class="flex gap-4 items-center">
            <button 
              @click="navigateCalendar('prev')"
              class="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div class="text-lg font-medium">
              {{ calendarTitle }}
            </div>
            
            <button 
              @click="navigateCalendar('next')"
              class="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            <button
              @click="setToday"
              class="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
            >
              Oggi
            </button>
          </div>
          
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
      </div>
      
      <div v-if="loading" class="text-center py-8">
        Caricamento appuntamenti...
      </div>
      
      <div v-else-if="error" class="text-center py-8 text-red-500">
        {{ error }}
      </div>
      
      <!-- Day view -->
      <div v-else-if="viewMode === 'day'" class="space-y-4">
        <h3 class="text-lg font-medium text-center mb-4">
          {{ formatFullDate(currentViewStartDate) }}
        </h3>
        
        <div class="grid grid-cols-1 gap-4">
          <div v-if="appuntamentiFiltered.length === 0" class="text-center py-8 text-gray-500">
            Nessun appuntamento per la data selezionata
          </div>
          
          <div 
            v-for="appuntamento in appuntamentiFiltered.sort((a, b) => 
              new Date(a.dataOraInizio).getTime() - new Date(b.dataOraInizio).getTime())" 
            :key="appuntamento._id"
            class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            :class="{
              'border-yellow-300 bg-yellow-50': appuntamento.stato === 'prenotato',
              'border-green-300 bg-green-50': appuntamento.stato === 'confermato',
              'border-blue-300 bg-blue-50': appuntamento.stato === 'completato',
              'border-red-300 bg-red-50': appuntamento.stato === 'cancellato',
              'border-gray-300 bg-gray-50': appuntamento.stato === 'noshow'
            }"
          >
            <div class="flex flex-col gap-3">
              <div class="flex justify-between items-start">
                <div>
                  <div class="flex items-center gap-2">
                    <h3 class="font-semibold text-lg">{{ appuntamento.cliente.nome }} {{ appuntamento.cliente.cognome }}</h3>
                    <span 
                      class="inline-block px-2 py-1 text-xs rounded-full"
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
                  <p class="text-gray-600 font-medium">{{ getServizioNames(appuntamento) }}</p>
                  <p class="text-sm text-gray-500">
                    <span class="font-medium">Orario:</span> {{ formatTime(appuntamento.dataOraInizio) }} - {{ formatTime(appuntamento.dataOraFine) }} 
                    ({{ formatDuration(appuntamento) }})
                  </p>
                  <p class="text-sm text-gray-500">
                    <span class="font-medium">Operatore:</span> {{ appuntamento.operatore.nome }} {{ appuntamento.operatore.cognome }}
                  </p>
                </div>
                <div class="text-right">
                  <div class="text-lg font-bold">{{ formatTime(appuntamento.dataOraInizio) }}</div>
                  <div class="text-sm text-gray-500">{{ formatShortDate(new Date(appuntamento.dataOraInizio)) }}</div>
                </div>
              </div>
              
              <div class="flex gap-2 justify-between border-t pt-3 mt-1">
                <div class="flex gap-2">
                  <button
                    v-if="appuntamento.stato === 'prenotato'"
                    @click="updateStatoAppuntamento(appuntamento._id, 'confermato')"
                    class="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors flex items-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Conferma
                  </button>
                  <button 
                    v-if="appuntamento.stato === 'prenotato' || appuntamento.stato === 'confermato'"
                    @click="updateStatoAppuntamento(appuntamento._id, 'completato')"
                    class="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors flex items-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Completa
                  </button>
                  <button 
                    v-if="appuntamento.stato !== 'cancellato' && appuntamento.stato !== 'noshow'"
                    @click="updateStatoAppuntamento(appuntamento._id, 'noshow')"
                    class="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors flex items-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    No-show
                  </button>
                </div>
                <div class="flex gap-2">
                  <router-link 
                    :to="`/appuntamenti/${appuntamento._id}`"
                    class="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors flex items-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Modifica
                  </router-link>
                  <button 
                    v-if="appuntamento.stato !== 'cancellato'"
                    @click="updateStatoAppuntamento(appuntamento._id, 'cancellato')"
                    class="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors flex items-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Annulla
                  </button>
                  <button 
                    @click="deleteAppuntamento(appuntamento._id)"
                    class="bg-red-800 text-white px-3 py-1 rounded text-sm hover:bg-red-900 transition-colors flex items-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Elimina
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Week view -->
      <div v-else-if="viewMode === 'week'" class="space-y-4">
        <div class="grid grid-cols-7 gap-2">
          <div 
            v-for="(day, index) in weekDays" 
            :key="index" 
            class="p-3 text-center border-b-2"
            :class="isToday(day) ? 'border-blue-500 font-semibold' : 'border-gray-200'"
          >
            <div class="text-sm">{{ formatWeekDay(day) }}</div>
            <div class="text-xs text-gray-500">{{ formatShortDate(day) }}</div>
          </div>
          
          <template v-for="(day, dayIndex) in weekDays" :key="`day-${dayIndex}`">
            <div class="min-h-[150px] border border-gray-100 p-1">
              <div
                v-for="appuntamento in getAppuntamentiByDay(day)"
                :key="`${day}-${appuntamento._id}`" 
                class="mb-1 p-1 text-xs rounded text-white overflow-hidden"
                :class="{
                  'bg-yellow-500': appuntamento.stato === 'prenotato',
                  'bg-green-500': appuntamento.stato === 'confermato',
                  'bg-blue-500': appuntamento.stato === 'completato',
                  'bg-red-500': appuntamento.stato === 'cancellato',
                  'bg-gray-500': appuntamento.stato === 'noshow'
                }"
              >
                <div class="font-medium truncate">{{ formatTime(appuntamento.dataOraInizio) }}</div>
                <div class="truncate">{{ appuntamento.cliente.nome }} {{ appuntamento.cliente.cognome }}</div>
                <router-link 
                  :to="`/appuntamenti/${appuntamento._id}`"
                  class="block mt-1 bg-white bg-opacity-20 text-center hover:bg-opacity-30 rounded py-0.5"
                >
                  Dettagli
                </router-link>
              </div>
            </div>
          </template>
        </div>
      </div>
      
      <!-- Month view -->
      <div v-else-if="viewMode === 'month'" class="space-y-4">
        <div class="grid grid-cols-7 gap-2 mb-2">
          <div v-for="(day, index) in ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab']" :key="index" class="text-center font-medium text-sm py-2">
            {{ day }}
          </div>
        </div>
        
        <div class="grid grid-cols-7 gap-2">
          <div 
            v-for="(day, index) in calendarDays" 
            :key="index"
            class="border min-h-[100px] p-2 relative"
            :class="[
              getDateString(day) === getDateString(new Date()) ? 'bg-blue-50' : '',
              getMonth(day) !== getMonth(currentViewStartDate) ? 'bg-gray-50 text-gray-400' : ''
            ]"
          >
            <div class="text-right mb-1">{{ day.getDate() }}</div>
            <div class="absolute bottom-1 left-1 right-1">
              <div
                v-for="appuntamento in getFirstTwoAppuntamentiByDay(day)"
                :key="`${index}-${appuntamento._id}`" 
                class="mb-1 px-1 py-0.5 text-xs rounded overflow-hidden truncate text-white"
                :class="{
                  'bg-yellow-500': appuntamento.stato === 'prenotato',
                  'bg-green-500': appuntamento.stato === 'confermato',
                  'bg-blue-500': appuntamento.stato === 'completato',
                  'bg-red-500': appuntamento.stato === 'cancellato',
                  'bg-gray-500': appuntamento.stato === 'noshow'
                }"
              >
                {{ formatTime(appuntamento.dataOraInizio) }} {{ appuntamento.cliente.nome.charAt(0) }}. {{ appuntamento.cliente.cognome }}
              </div>
              <div 
                v-if="getAppuntamentiByDay(day).length > 2"
                class="text-xs text-center text-blue-600 bg-blue-50 py-0.5 rounded"
              >
                +{{ getAppuntamentiByDay(day).length - 2 }} altri
              </div>
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
const currentViewStartDate = ref(new Date())

// Computed properties for store state
const loading = computed(() => appuntamentiStore.loading)
const appuntamenti = computed(() => appuntamentiStore.appuntamenti)
const error = computed(() => appuntamentiStore.error)

// Calendar navigation title
const calendarTitle = computed(() => {
  const date = currentViewStartDate.value
  if (viewMode.value === 'day') {
    return formatFullDate(date)
  } else if (viewMode.value === 'week') {
    const endOfWeek = new Date(date)
    endOfWeek.setDate(date.getDate() + 6)
    return `${formatShortDate(date)} - ${formatShortDate(endOfWeek)}`
  } else {
    return date.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })
  }
})

// Calendar days for month view
const calendarDays = computed(() => {
  const year = currentViewStartDate.value.getFullYear()
  const month = currentViewStartDate.value.getMonth()
  
  // Primo giorno del mese
  const firstDayOfMonth = new Date(year, month, 1)
  // Ultimo giorno del mese
  const lastDayOfMonth = new Date(year, month + 1, 0)
  
  // Giorno della settimana del primo giorno del mese (0-6, dove 0 è domenica)
  const firstDayWeekday = firstDayOfMonth.getDay()
  
  // Totale giorni da visualizzare (fino a 42, per avere 6 settimane)
  const totalDays = 42
  
  // Array dei giorni
  const days: Date[] = []
  
  // Giorni del mese precedente
  for (let i = firstDayWeekday - 1; i >= 0; i--) {
    const day = new Date(year, month, -i)
    days.push(day)
  }
  
  // Giorni del mese corrente
  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    const day = new Date(year, month, i)
    days.push(day)
  }
  
  // Completiamo con i giorni del mese successivo
  const remainingDays = totalDays - days.length
  for (let i = 1; i <= remainingDays; i++) {
    const day = new Date(year, month + 1, i)
    days.push(day)
  }
  
  return days
})

// Week days for week view
const weekDays = computed(() => {
  const startDate = new Date(currentViewStartDate.value)
  const days: Date[] = []
  
  // Otteniamo il primo giorno della settimana (domenica)
  const dayOfWeek = startDate.getDay()
  startDate.setDate(startDate.getDate() - dayOfWeek)
  
  // Generiamo i 7 giorni della settimana
  for (let i = 0; i < 7; i++) {
    const day = new Date(startDate)
    day.setDate(startDate.getDate() + i)
    days.push(day)
  }
  
  return days
})

// Hours for day view
const hours = computed(() => {
  return Array.from({ length: 14 }, (_, i) => i + 8) // 8:00 - 21:00
})

// Filtered appointments based on current view
const appuntamentiFiltered = computed(() => {
  if (viewMode.value === 'day') {
    return appuntamenti.value.filter(app => {
      const appDate = new Date(app.dataOraInizio).toISOString().split('T')[0]
      const selectedDay = currentViewStartDate.value.toISOString().split('T')[0]
      return appDate === selectedDay
    })
  } else if (viewMode.value === 'week') {
    const startOfWeek = new Date(weekDays.value[0])
    const endOfWeek = new Date(weekDays.value[6])
    endOfWeek.setHours(23, 59, 59)
    
    return appuntamenti.value.filter(app => {
      const appDate = new Date(app.dataOraInizio)
      return appDate >= startOfWeek && appDate <= endOfWeek
    })
  } else {
    const year = currentViewStartDate.value.getFullYear()
    const month = currentViewStartDate.value.getMonth()
    const startOfMonth = new Date(year, month, 1)
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59)
    
    return appuntamenti.value.filter(app => {
      const appDate = new Date(app.dataOraInizio)
      return appDate >= startOfMonth && appDate <= endOfMonth
    })
  }
})

// Format methods
const formatTime = (dateTime: string) => {
  return new Date(dateTime).toLocaleTimeString('it-IT', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const formatFullDate = (date: Date) => {
  return date.toLocaleDateString('it-IT', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatShortDate = (date: Date) => {
  return date.toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'numeric'
  })
}

const formatWeekDay = (date: Date) => {
  return date.toLocaleDateString('it-IT', { weekday: 'short' })
}

const formatHour = (hour: number) => {
  return `${hour}:00`
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

const getDateString = (date: Date) => {
  return date.toISOString().split('T')[0]
}

const getMonth = (date: Date) => {
  return date.getMonth()
}

// Calendar navigation methods
const navigateCalendar = (direction: 'prev' | 'next') => {
  const current = new Date(currentViewStartDate.value)
  
  if (viewMode.value === 'day') {
    current.setDate(current.getDate() + (direction === 'next' ? 1 : -1))
  } else if (viewMode.value === 'week') {
    current.setDate(current.getDate() + (direction === 'next' ? 7 : -7))
  } else {
    current.setMonth(current.getMonth() + (direction === 'next' ? 1 : -1))
  }
  
  currentViewStartDate.value = current
  selectedDate.value = current.toISOString().split('T')[0]
  fetchAppuntamenti()
}

const setToday = () => {
  currentViewStartDate.value = new Date()
  selectedDate.value = currentViewStartDate.value.toISOString().split('T')[0]
  fetchAppuntamenti()
}

// Helper methods for appointments
const hasAppointmentAtHour = (hour: number) => {
  return appuntamentiFiltered.value.some(app => {
    const appHour = new Date(app.dataOraInizio).getHours()
    return appHour === hour
  })
}

const getAppuntamentiAtHour = (hour: number) => {
  return appuntamentiFiltered.value.filter(app => {
    const appHour = new Date(app.dataOraInizio).getHours()
    return appHour === hour
  })
}

const getAppuntamentiByDay = (day: Date) => {
  return appuntamentiFiltered.value.filter(app => {
    const appDate = new Date(app.dataOraInizio)
    return appDate.getDate() === day.getDate() && 
           appDate.getMonth() === day.getMonth() && 
           appDate.getFullYear() === day.getFullYear()
  })
}

const getFirstTwoAppuntamentiByDay = (day: Date) => {
  return getAppuntamentiByDay(day).slice(0, 2)
}

const isToday = (date: Date) => {
  const today = new Date()
  return date.getDate() === today.getDate() && 
         date.getMonth() === today.getMonth() && 
         date.getFullYear() === today.getFullYear()
}

const fetchAppuntamenti = async () => {
  try {
    if (viewMode.value === 'day') {
      // Fetch appointments for selected date
      const dateStr = currentViewStartDate.value.toISOString().split('T')[0]
      await appuntamentiStore.fetchAppuntamentiByDate(dateStr)
    } else if (viewMode.value === 'week') {
      // Calculate week start and end
      const startOfWeek = new Date(weekDays.value[0])
      const endOfWeek = new Date(weekDays.value[6])
      
      await appuntamentiStore.fetchAppuntamentiByDateRange(
        startOfWeek.toISOString().split('T')[0],
        endOfWeek.toISOString().split('T')[0]
      )
    } else if (viewMode.value === 'month') {
      // Calculate month start and end
      const year = currentViewStartDate.value.getFullYear()
      const month = currentViewStartDate.value.getMonth()
      const startOfMonth = new Date(year, month, 1)
      const endOfMonth = new Date(year, month + 1, 0)
      
      await appuntamentiStore.fetchAppuntamentiByDateRange(
        startOfMonth.toISOString().split('T')[0],
        endOfMonth.toISOString().split('T')[0]
      )
    }
  } catch (error) {
    console.error('Errore nel caricamento degli appuntamenti:', error)
  }
}

const updateStatoAppuntamento = async (id: string, stato: string) => {
  try {
    await appuntamentiStore.updateStatoAppuntamento(id, stato)
    // Refresh appointments after update
    await fetchAppuntamenti()
  } catch (error) {
    console.error('Errore nell\'aggiornamento dello stato dell\'appuntamento:', error)
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

watch(selectedDate, (newVal) => {
  currentViewStartDate.value = new Date(newVal)
  fetchAppuntamenti()
})

watch(viewMode, fetchAppuntamenti)

onMounted(async () => {
  await fetchAppuntamenti()
})
</script>
