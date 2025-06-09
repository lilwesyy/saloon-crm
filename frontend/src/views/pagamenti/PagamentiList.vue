<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="sm:flex sm:items-center sm:justify-between">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-bold text-gray-900">Pagamenti</h1>
        <p class="mt-2 text-sm text-gray-700">Gestisci i pagamenti e le transazioni del centro</p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <button 
          @click="exportData"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Esporta Dati
        </button>
      </div>
    </div>
    
    <!-- Filters Section -->
    <div class="bg-white overflow-hidden shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Filtri</h3>
        <div class="grid gap-5 md:grid-cols-3">
          <div>
            <label for="dataInizio" class="block text-sm font-medium text-gray-700 mb-2">Data Inizio</label>
            <input 
              id="dataInizio"
              v-model="filtri.dataInizio" 
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          <div>
            <label for="dataFine" class="block text-sm font-medium text-gray-700 mb-2">Data Fine</label>
            <input 
              id="dataFine"
              v-model="filtri.dataFine" 
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          <div>
            <label for="stato" class="block text-sm font-medium text-gray-700 mb-2">Stato</label>
            <select 
              id="stato"
              v-model="filtri.stato"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tutti</option>
              <option value="pagato">Pagato</option>
              <option value="in_attesa">In Attesa</option>
              <option value="scaduto">Scaduto</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Section -->
    <div class="bg-white overflow-hidden shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="mt-2 text-sm text-gray-500">Caricamento pagamenti...</p>
        </div>
        
        <!-- Empty State -->
        <div v-else-if="pagamentiFiltrati.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Nessun pagamento trovato</h3>
          <p class="mt-1 text-sm text-gray-500">Modifica i filtri per visualizzare i pagamenti.</p>
        </div>
        
        <!-- Table -->
        <div v-else>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Servizio</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Importo</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stato</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metodo</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="pagamento in pagamentiFiltrati" :key="pagamento.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ formatDate(pagamento.data) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ pagamento.cliente.nome }} {{ pagamento.cliente.cognome }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ pagamento.servizio.nome }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                    €{{ pagamento.importo.toFixed(2) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getStatoColor(pagamento.stato)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                      {{ formatStato(pagamento.stato) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ formatMetodo(pagamento.metodo) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Summary Section -->
    <div v-if="!loading && pagamentiFiltrati.length > 0" class="bg-white overflow-hidden shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Riepilogo</h3>
        <div class="grid gap-5 md:grid-cols-4">
          <div class="text-center">
            <p class="text-sm text-gray-600">Totale Pagamenti</p>
            <p class="text-2xl font-bold text-gray-900">€{{ totali.totale.toFixed(2) }}</p>
          </div>
          <div class="text-center">
            <p class="text-sm text-gray-600">Pagati</p>
            <p class="text-2xl font-bold text-green-600">€{{ totali.pagati.toFixed(2) }}</p>
          </div>
          <div class="text-center">
            <p class="text-sm text-gray-600">In Attesa</p>
            <p class="text-2xl font-bold text-yellow-600">€{{ totali.inAttesa.toFixed(2) }}</p>
          </div>
          <div class="text-center">
            <p class="text-sm text-gray-600">Scaduti</p>
            <p class="text-2xl font-bold text-red-600">€{{ totali.scaduti.toFixed(2) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';

interface Cliente {
  nome: string
  cognome: string
}

interface Servizio {
  nome: string
}

interface Pagamento {
  id: string
  data: string
  cliente: Cliente
  servizio: Servizio
  importo: number
  stato: 'pagato' | 'in_attesa' | 'scaduto'
  metodo: 'contanti' | 'carta' | 'bonifico'
}

const loading = ref(true)
const pagamenti = ref<Pagamento[]>([])

const filtri = ref({
  dataInizio: '',
  dataFine: '',
  stato: ''
})

const pagamentiFiltrati = computed(() => {
  let risultato = pagamenti.value
  
  if (filtri.value.dataInizio) {
    risultato = risultato.filter(p => p.data >= filtri.value.dataInizio)
  }
  
  if (filtri.value.dataFine) {
    risultato = risultato.filter(p => p.data <= filtri.value.dataFine)
  }
  
  if (filtri.value.stato) {
    risultato = risultato.filter(p => p.stato === filtri.value.stato)
  }
  
  return risultato
})

const totali = computed(() => {
  const pagamentiFilt = pagamentiFiltrati.value
  return {
    totale: pagamentiFilt.reduce((sum, p) => sum + p.importo, 0),
    pagati: pagamentiFilt.filter(p => p.stato === 'pagato').reduce((sum, p) => sum + p.importo, 0),
    inAttesa: pagamentiFilt.filter(p => p.stato === 'in_attesa').reduce((sum, p) => sum + p.importo, 0),
    scaduti: pagamentiFilt.filter(p => p.stato === 'scaduto').reduce((sum, p) => sum + p.importo, 0)
  }
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('it-IT')
}

const formatStato = (stato: string) => {
  const stati = {
    pagato: 'Pagato',
    in_attesa: 'In Attesa',
    scaduto: 'Scaduto'
  }
  return stati[stato as keyof typeof stati] || stato
}

const formatMetodo = (metodo: string) => {
  const metodi = {
    contanti: 'Contanti',
    carta: 'Carta',
    bonifico: 'Bonifico'
  }
  return metodi[metodo as keyof typeof metodi] || metodo
}

const getStatoColor = (stato: string) => {
  const colori = {
    pagato: 'bg-green-100 text-green-800',
    in_attesa: 'bg-yellow-100 text-yellow-800',
    scaduto: 'bg-red-100 text-red-800'
  }
  return colori[stato as keyof typeof colori] || 'bg-gray-100 text-gray-800'
}

const fetchPagamenti = async () => {
  loading.value = true
  try {
    // TODO: Implementare chiamata API
    // Simulazione dati per demo
    await new Promise(resolve => setTimeout(resolve, 1000))
    pagamenti.value = []
  } catch (error) {
    console.error('Errore nel caricamento dei pagamenti:', error)
  } finally {
    loading.value = false
  }
}

const exportData = () => {
  // TODO: Implementare esportazione dati
  console.log('Esportazione dati...')
}

watch([() => filtri.value.dataInizio, () => filtri.value.dataFine, () => filtri.value.stato], () => {
  // I dati vengono filtrati automaticamente tramite computed
})

onMounted(() => {
  // Imposta date di default (ultimo mese)
  const oggi = new Date()
  const unMeseFa = new Date(oggi.getFullYear(), oggi.getMonth() - 1, oggi.getDate())
  
  filtri.value.dataInizio = unMeseFa.toISOString().split('T')[0]
  filtri.value.dataFine = oggi.toISOString().split('T')[0]
  
  fetchPagamenti()
})
</script>
