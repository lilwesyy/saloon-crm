<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="sm:flex sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Reports</h1>
        <p class="mt-2 text-sm text-gray-700">Analisi e reportistica del centro estetico</p>
      </div>
      <div class="mt-4 sm:mt-0 flex space-x-3">
        <button 
          @click="exportReport"
          class="flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <svg class="mr-2 h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Esporta Report
        </button>
        <button 
          @click="refreshData"
          class="flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <svg class="mr-2 h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Aggiorna
        </button>
      </div>
    </div>

    <!-- Periodo di Analisi -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Periodo di Analisi</h3>
        <div class="grid gap-4 md:grid-cols-3">
          <div>
            <label for="dataInizio" class="block text-sm font-medium text-gray-700 mb-2">Data Inizio</label>
            <input 
              id="dataInizio"
              v-model="periodo.dataInizio" 
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
          </div>
          <div>
            <label for="dataFine" class="block text-sm font-medium text-gray-700 mb-2">Data Fine</label>
            <input 
              id="dataFine"
              v-model="periodo.dataFine" 
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
          </div>
          <div class="flex items-end">
            <button 
              @click="applicaFiltri"
              class="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Applica Filtri
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600 mb-3"></div>
      <p class="text-gray-600">Caricamento reports...</p>
    </div>

    <div v-else class="space-y-6">
      <!-- Statistiche Generali -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <!-- Fatturato Totale -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Fatturato Totale
                  </dt>
                  <dd class="text-lg font-medium text-gray-900">
                    €{{ stats.fatturato.toFixed(2) }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-5 py-3">
            <div class="text-sm">
              <router-link to="/pagamenti" class="font-medium text-green-700 hover:text-green-900">
                Vedi pagamenti
              </router-link>
            </div>
          </div>
        </div>
        
        <!-- Appuntamenti -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Appuntamenti
                  </dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {{ stats.appuntamenti }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-5 py-3">
            <div class="text-sm">
              <router-link to="/appuntamenti" class="font-medium text-blue-700 hover:text-blue-900">
                Vedi calendario
              </router-link>
            </div>
          </div>
        </div>
        
        <!-- Nuovi Clienti -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Nuovi Clienti
                  </dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {{ stats.nuoviClienti }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-5 py-3">
            <div class="text-sm">
              <router-link to="/clienti" class="font-medium text-purple-700 hover:text-purple-900">
                Vedi clienti
              </router-link>
            </div>
          </div>
        </div>
        
        <!-- Ticket Medio -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-8 w-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Ticket Medio
                  </dt>
                  <dd class="text-lg font-medium text-gray-900">
                    €{{ stats.ticketMedio.toFixed(2) }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-5 py-3">
            <div class="text-sm">
              <router-link to="/reports" class="font-medium text-orange-700 hover:text-orange-900">
                Analisi completa
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Servizi più Richiesti -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Servizi più Richiesti</h3>
            <div class="flex items-center gap-2">
              <label for="maxServizi" class="text-sm font-medium text-gray-700">Mostra max:</label>
              <select 
                id="maxServizi"
                v-model="maxServizi" 
                @change="applicaFiltroServizi"
                class="min-w-[80px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
              </select>
            </div>
          </div>
          <div class="space-y-4">
            <div v-for="servizio in topServiziFiltered" :key="servizio.nome" class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex justify-between items-center mb-1">
                  <span class="text-sm font-medium text-gray-900">{{ servizio.nome }}</span>
                  <span class="text-sm text-gray-500">{{ servizio.count }} volte</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    class="bg-purple-600 h-2 rounded-full" 
                    :style="{ width: `${(servizio.count / Math.max(...topServiziFiltered.map(s => s.count))) * 100}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Andamento Mensile -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Andamento Fatturato Mensile</h3>
          <div class="h-64 flex items-end justify-between space-x-2">
            <div v-for="mese in andamentoMensile" :key="mese.mese" class="flex-1 flex flex-col items-center">
              <div 
                class="w-full bg-gradient-to-t from-blue-600 to-purple-600 rounded-t"
                :style="{ height: `${(mese.fatturato / Math.max(...andamentoMensile.map(m => m.fatturato))) * 200}px` }"
              ></div>
              <div class="mt-2 text-xs text-gray-600 text-center">
                <div>{{ mese.mese }}</div>
                <div class="font-semibold">€{{ mese.fatturato.toFixed(0) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Clienti più Fedeli -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Clienti più Fedeli</h3>
            <div class="flex items-center gap-2">
              <label for="maxClienti" class="text-sm font-medium text-gray-700">Mostra max:</label>
              <select 
                id="maxClienti"
                v-model="maxClienti" 
                @change="applicaFiltroClienti"
                class="min-w-[80px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
              </select>
            </div>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appuntamenti</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spesa Totale</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ultima Visita</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="cliente in topClientiFiltered" :key="cliente._id" class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ cliente.nome }} {{ cliente.cognome }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ cliente.appuntamenti }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    €{{ cliente.spesaTotale.toFixed(2) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ formatDate(cliente.ultimaVisita) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import reportsService, { type ReportsData, type ReportsStats, type TopServizio, type AndamentoMensile, type TopCliente } from '@/services/reports.service'
import { useToast } from '@/composables/useToast'

const { success, error } = useToast()
const loading = ref(true)

const periodo = ref({
  dataInizio: '',
  dataFine: ''
})

const stats = ref<ReportsStats>({
  fatturato: 0,
  appuntamenti: 0,
  nuoviClienti: 0,
  ticketMedio: 0
})

const topServizi = ref<TopServizio[]>([])
const topServiziFiltered = ref<TopServizio[]>([])
const maxServizi = ref(5)
const andamentoMensile = ref<AndamentoMensile[]>([])
const topClienti = ref<TopCliente[]>([])
const topClientiFiltered = ref<TopCliente[]>([])
const maxClienti = ref(5)

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('it-IT')
}

const applicaFiltroServizi = () => {
  topServiziFiltered.value = topServizi.value.slice(0, maxServizi.value)
}

const applicaFiltroClienti = () => {
  topClientiFiltered.value = topClienti.value.slice(0, maxClienti.value)
}

const applicaFiltri = async () => {
  if (!periodo.value.dataInizio || !periodo.value.dataFine) {
    alert('Seleziona sia la data di inizio che quella di fine')
    return
  }
  await fetchReports()
}

const fetchReports = async () => {
  if (!periodo.value.dataInizio || !periodo.value.dataFine) {
    return
  }

  loading.value = true
  try {
    const data = await reportsService.getReportsData(
      periodo.value.dataInizio,
      periodo.value.dataFine
    )
    
    stats.value = data.stats
    topServizi.value = data.topServizi
    andamentoMensile.value = data.andamentoMensile
    topClienti.value = data.topClienti
    
    // Applica i filtri
    applicaFiltroServizi()
    applicaFiltroClienti()
    
  } catch (error) {
    console.error('Errore nel caricamento dei reports:', error)
    alert('Errore nel caricamento dei reports')
  } finally {
    loading.value = false
  }
}

const refreshData = async () => {
  try {
    await fetchReports()
    success('Dati aggiornati con successo!', 3000)
  } catch (err) {
    console.error('Errore durante l\'aggiornamento:', err)
    error('Errore durante l\'aggiornamento dei dati', 3000)
  }
}

const exportReport = async () => {
  if (!periodo.value.dataInizio || !periodo.value.dataFine) {
    alert('Seleziona un periodo per esportare il report')
    return
  }

  try {
    const blob = await reportsService.exportReport(
      periodo.value.dataInizio,
      periodo.value.dataFine
    )
    
    const filename = `report_${periodo.value.dataInizio}_${periodo.value.dataFine}.csv`
    reportsService.downloadCSV(blob, filename)
    
  } catch (error) {
    console.error('Errore nell\'esportazione del report:', error)
    alert('Errore nell\'esportazione del report')
  }
}

onMounted(() => {
  // Imposta periodo di default (ultimo mese)
  const oggi = new Date()
  const unMeseFa = new Date(oggi.getFullYear(), oggi.getMonth() - 1, oggi.getDate())
  
  periodo.value.dataInizio = unMeseFa.toISOString().split('T')[0]
  periodo.value.dataFine = oggi.toISOString().split('T')[0]
  
  fetchReports()
})
</script>
