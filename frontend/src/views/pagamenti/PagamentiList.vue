<template>
  <div class="container mx-auto px-4 py-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Pagamenti</h1>
      <button 
        @click="exportData"
        class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
      >
        Esporta Dati
      </button>
    </div>
    
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <div class="p-6">
        <div class="mb-6 grid gap-4 md:grid-cols-3">
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
        
        <div v-if="loading" class="text-center py-4">
          Caricamento pagamenti...
        </div>
        
        <div v-else-if="pagamentiFiltrati.length === 0" class="text-center py-4 text-gray-500">
          Nessun pagamento trovato
        </div>
        
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
          
          <div class="mt-6 bg-gray-50 p-4 rounded-lg">
            <div class="grid gap-4 md:grid-cols-4">
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

const loading = ref(true)
const pagamenti = ref([])

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
  return stati[stato] || stato
}

const formatMetodo = (metodo: string) => {
  const metodi = {
    contanti: 'Contanti',
    carta: 'Carta',
    bonifico: 'Bonifico'
  }
  return metodi[metodo] || metodo
}

const getStatoColor = (stato: string) => {
  const colori = {
    pagato: 'bg-green-100 text-green-800',
    in_attesa: 'bg-yellow-100 text-yellow-800',
    scaduto: 'bg-red-100 text-red-800'
  }
  return colori[stato] || 'bg-gray-100 text-gray-800'
}

const fetchPagamenti = async () => {
  loading.value = true
  try {
    // TODO: Implementare chiamata API
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
