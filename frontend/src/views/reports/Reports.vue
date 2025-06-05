<template>
  <div class="container mx-auto px-4 py-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Reports</h1>
      <div class="flex gap-2">
        <button 
          @click="exportReport"
          class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Esporta Report
        </button>
        <button 
          @click="refreshData"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Aggiorna
        </button>
      </div>
    </div>

    <!-- Filtri Periodo -->
    <div class="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 class="text-lg font-semibold mb-4">Periodo di Analisi</h2>
      <div class="grid gap-4 md:grid-cols-3">
        <div>
          <label for="dataInizio" class="block text-sm font-medium text-gray-700 mb-2">Data Inizio</label>
          <input 
            id="dataInizio"
            v-model="periodo.dataInizio" 
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>
        <div>
          <label for="dataFine" class="block text-sm font-medium text-gray-700 mb-2">Data Fine</label>
          <input 
            id="dataFine"
            v-model="periodo.dataFine" 
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>
        <div class="flex items-end">
          <button 
            @click="applicaFiltri"
            class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Applica Filtri
          </button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center py-8">
      Caricamento reports...
    </div>

    <div v-else class="space-y-6">
      <!-- Statistiche Generali -->
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div class="bg-white shadow-md rounded-lg p-6">
          <div class="flex items-center">
            <div class="flex-1">
              <p class="text-sm text-gray-600">Fatturato Totale</p>
              <p class="text-3xl font-bold text-green-600">€{{ stats.fatturato.toFixed(2) }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"/>
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-white shadow-md rounded-lg p-6">
          <div class="flex items-center">
            <div class="flex-1">
              <p class="text-sm text-gray-600">Appuntamenti</p>
              <p class="text-3xl font-bold text-blue-600">{{ stats.appuntamenti }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-white shadow-md rounded-lg p-6">
          <div class="flex items-center">
            <div class="flex-1">
              <p class="text-sm text-gray-600">Nuovi Clienti</p>
              <p class="text-3xl font-bold text-purple-600">{{ stats.nuoviClienti }}</p>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-white shadow-md rounded-lg p-6">
          <div class="flex items-center">
            <div class="flex-1">
              <p class="text-sm text-gray-600">Ticket Medio</p>
              <p class="text-3xl font-bold text-orange-600">€{{ stats.ticketMedio.toFixed(2) }}</p>
            </div>
            <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Servizi più Richiesti -->
      <div class="bg-white shadow-md rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">Servizi più Richiesti</h2>
        <div class="space-y-4">
          <div v-for="servizio in topServizi" :key="servizio.nome" class="flex items-center justify-between">
            <div class="flex-1">
              <div class="flex justify-between items-center mb-1">
                <span class="text-sm font-medium text-gray-900">{{ servizio.nome }}</span>
                <span class="text-sm text-gray-500">{{ servizio.count }} volte</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-blue-600 h-2 rounded-full" 
                  :style="{ width: `${(servizio.count / Math.max(...topServizi.map(s => s.count))) * 100}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Andamento Mensile -->
      <div class="bg-white shadow-md rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">Andamento Fatturato Mensile</h2>
        <div class="h-64 flex items-end justify-between space-x-2">
          <div v-for="mese in andamentoMensile" :key="mese.mese" class="flex-1 flex flex-col items-center">
            <div 
              class="w-full bg-blue-600 rounded-t"
              :style="{ height: `${(mese.fatturato / Math.max(...andamentoMensile.map(m => m.fatturato))) * 200}px` }"
            ></div>
            <div class="mt-2 text-xs text-gray-600 text-center">
              <div>{{ mese.mese }}</div>
              <div class="font-semibold">€{{ mese.fatturato.toFixed(0) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Clienti più Fedeli -->
      <div class="bg-white shadow-md rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">Clienti più Fedeli</h2>
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
              <tr v-for="cliente in topClienti" :key="cliente.id" class="hover:bg-gray-50">
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
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import reportsService, { type ReportsData, type ReportsStats, type TopServizio, type AndamentoMensile, type TopCliente } from '@/services/reports.service'

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
const andamentoMensile = ref<AndamentoMensile[]>([])
const topClienti = ref<TopCliente[]>([])

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('it-IT')
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
    
  } catch (error) {
    console.error('Errore nel caricamento dei reports:', error)
    alert('Errore nel caricamento dei reports')
  } finally {
    loading.value = false
  }
}

const refreshData = async () => {
  await fetchReports()
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
