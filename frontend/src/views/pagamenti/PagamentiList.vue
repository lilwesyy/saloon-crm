<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="sm:flex sm:items-center sm:justify-between">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-bold text-gray-900">Pagamenti</h1>
        <p class="mt-2 text-sm text-gray-700">Gestisci i pagamenti e le transazioni del centro</p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none space-x-3">
        <router-link 
          to="/pagamenti/nuovo"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Nuovo Pagamento
        </router-link>
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
              <option value="completato">Completato</option>
              <option value="rimborsato">Rimborsato</option>
              <option value="annullato">Annullato</option>
            </select>
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
            <p class="text-sm text-gray-600">Completati</p>
            <p class="text-2xl font-bold text-green-600">€{{ totali.completati.toFixed(2) }}</p>
          </div>
          <div class="text-center">
            <p class="text-sm text-gray-600">Rimborsati</p>
            <p class="text-2xl font-bold text-yellow-600">€{{ totali.rimborsati.toFixed(2) }}</p>
          </div>
          <div class="text-center">
            <p class="text-sm text-gray-600">Annullati</p>
            <p class="text-2xl font-bold text-red-600">€{{ totali.annullati.toFixed(2) }}</p>
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
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Azioni</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="pagamento in pagamentiFiltrati" :key="pagamento._id" class="hover:bg-gray-50 cursor-pointer" @click="navigateToDetail(pagamento._id)">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ formatDate(pagamento.dataPagamento) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ pagamento.cliente.nome }} {{ pagamento.cliente.cognome }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ pagamento.servizio?.nome || 'N/A' }}
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
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500" @click.stop>
                    <div class="flex space-x-2">
                      <router-link 
                        :to="`/pagamenti/${pagamento._id}/modifica`"
                        class="text-blue-600 hover:text-blue-900"
                        title="Modifica"
                      >
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </router-link>
                      <button 
                        v-if="pagamento.stato === 'completato'"
                        @click="rimborsaPagamento(pagamento)"
                        class="text-yellow-600 hover:text-yellow-900"
                        title="Rimborsa"
                      >
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                      </button>
                      <button 
                        @click="deletePagamento(pagamento)"
                        class="text-red-600 hover:text-red-900"
                        title="Elimina"
                      >
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal per rimborso -->
    <div v-if="showRefundModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeRefundModal">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Rimborso Pagamento</h3>
          
          <form @submit.prevent="confermaRimborso" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Motivo del rimborso</label>
              <textarea 
                v-model="refundData.motivo" 
                rows="3" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Descrivi il motivo del rimborso..."
              ></textarea>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Importo da rimborsare (€)</label>
              <input 
                v-model.number="refundData.importo" 
                type="number" 
                step="0.01" 
                min="0" 
                :max="selectedPagamento?.importo"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :placeholder="`Massimo €${selectedPagamento?.importo || 0}`"
              >
              <p class="text-sm text-gray-500 mt-1">Lascia vuoto per rimborsare l'intero importo</p>
            </div>
            
            <div class="flex justify-end space-x-3 pt-4">
              <button 
                type="button" 
                @click="closeRefundModal"
                class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Annulla
              </button>
              <button 
                type="submit" 
                class="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
              >
                Conferma Rimborso
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal per conferma eliminazione -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeDeleteModal">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3 text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mt-2">Conferma Eliminazione</h3>
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-500">
              Sei sicuro di voler eliminare questo pagamento? Questa azione non può essere annullata.
            </p>
          </div>
          <div class="flex justify-center space-x-3 px-4 py-3">
            <button 
              @click="closeDeleteModal"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Annulla
            </button>
            <button 
              @click="confermaEliminazione"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Elimina
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import pagamentiService, { type Pagamento } from '@/services/pagamenti.service';
import { useToast } from '@/composables/useToast';

const loading = ref(true)
const pagamenti = ref<Pagamento[]>([])
const router = useRouter()
const toast = useToast()

// Stato dei modali
const showRefundModal = ref(false)
const showDeleteModal = ref(false)

// Dati per rimborso
const refundData = ref({
  motivo: '',
  importo: undefined as number | undefined
})

// Pagamento selezionato per operazioni
const selectedPagamento = ref<Pagamento | null>(null)

const filtri = ref({
  dataInizio: '',
  dataFine: '',
  stato: ''
})

const pagamentiFiltrati = computed(() => {
  let risultato = pagamenti.value
  
  if (filtri.value.dataInizio) {
    risultato = risultato.filter(p => p.dataPagamento >= filtri.value.dataInizio)
  }
  
  if (filtri.value.dataFine) {
    risultato = risultato.filter(p => p.dataPagamento <= filtri.value.dataFine)
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
    completati: pagamentiFilt.filter(p => p.stato === 'completato').reduce((sum, p) => sum + p.importo, 0),
    rimborsati: pagamentiFilt.filter(p => p.stato === 'rimborsato').reduce((sum, p) => sum + p.importo, 0),
    annullati: pagamentiFilt.filter(p => p.stato === 'annullato').reduce((sum, p) => sum + p.importo, 0)
  }
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('it-IT')
}

const formatStato = (stato: string) => {
  const stati = {
    completato: 'Completato',
    rimborsato: 'Rimborsato',
    annullato: 'Annullato'
  }
  return stati[stato as keyof typeof stati] || stato
}

const formatMetodo = (metodo: string) => {
  const metodi = {
    contanti: 'Contanti',
    carta: 'Carta',
    bonifico: 'Bonifico',
    assegno: 'Assegno',
    altro: 'Altro'
  }
  return metodi[metodo as keyof typeof metodi] || metodo
}

const getStatoColor = (stato: string) => {
  const colori = {
    completato: 'bg-green-100 text-green-800',
    rimborsato: 'bg-yellow-100 text-yellow-800',
    annullato: 'bg-red-100 text-red-800'
  }
  return colori[stato as keyof typeof colori] || 'bg-gray-100 text-gray-800'
}

// Navigazione
const navigateToDetail = (id: string) => {
  router.push(`/pagamenti/${id}`)
}

// Funzioni per gestire i modali
const closeRefundModal = () => {
  showRefundModal.value = false
  refundData.value = { motivo: '', importo: undefined }
  selectedPagamento.value = null
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  selectedPagamento.value = null
}

// Funzioni CRUD
const deletePagamento = (pagamento: Pagamento) => {
  selectedPagamento.value = pagamento
  showDeleteModal.value = true
}

const rimborsaPagamento = (pagamento: Pagamento) => {
  selectedPagamento.value = pagamento
  refundData.value.importo = pagamento.importo
  showRefundModal.value = true
}

const confermaRimborso = async () => {
  if (!selectedPagamento.value) return
  
  try {
    await pagamentiService.refundPagamento(selectedPagamento.value._id, {
      motivo: refundData.value.motivo,
      importo: refundData.value.importo
    })
    
    toast.success('Rimborso elaborato con successo')
    closeRefundModal()
    await fetchPagamenti()
  } catch (error) {
    console.error('Errore nel rimborso:', error)
    toast.error('Errore nell\'elaborazione del rimborso')
  }
}

const confermaEliminazione = async () => {
  if (!selectedPagamento.value) return
  
  try {
    await pagamentiService.deletePagamento(selectedPagamento.value._id)
    toast.success('Pagamento eliminato con successo')
    closeDeleteModal()
    await fetchPagamenti()
  } catch (error) {
    console.error('Errore nell\'eliminazione:', error)
    toast.error('Errore nell\'eliminazione del pagamento')
  }
}

const fetchPagamenti = async () => {
  loading.value = true
  try {
    const filters = {
      startDate: filtri.value.dataInizio || undefined,
      endDate: filtri.value.dataFine || undefined,
      stato: filtri.value.stato || undefined
    }
    
    pagamenti.value = await pagamentiService.getPagamenti(filters)
  } catch (error) {
    console.error('Errore nel caricamento dei pagamenti:', error)
    toast.error('Errore nel caricamento dei pagamenti')
  } finally {
    loading.value = false
  }
}

const exportData = async () => {
  try {
    // Implementa l'esportazione dati in CSV/Excel
    const csvData = pagamentiFiltrati.value.map(p => ({
      Data: formatDate(p.dataPagamento),
      Cliente: `${p.cliente.nome} ${p.cliente.cognome}`,
      Servizio: p.servizio?.nome || 'N/A',
      Importo: p.importo,
      Stato: formatStato(p.stato),
      Metodo: formatMetodo(p.metodo)
    }))
    
    // Converti in CSV
    const csvHeader = Object.keys(csvData[0] || {}).join(',')
    const csvRows = csvData.map(row => Object.values(row).join(','))
    const csvContent = [csvHeader, ...csvRows].join('\n')
    
    // Download del file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `pagamenti_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    
    toast.success('Dati esportati con successo')
  } catch (error) {
    console.error('Errore nell\'esportazione:', error)
    toast.error('Errore nell\'esportazione dei dati')
  }
}

watch([() => filtri.value.dataInizio, () => filtri.value.dataFine, () => filtri.value.stato], () => {
  fetchPagamenti()
})

onMounted(async () => {
  // Imposta date di default (ultimo mese)
  const oggi = new Date()
  const unMeseFa = new Date(oggi.getFullYear(), oggi.getMonth() - 1, oggi.getDate())
  
  filtri.value.dataInizio = unMeseFa.toISOString().split('T')[0]
  filtri.value.dataFine = oggi.toISOString().split('T')[0]
  
  // Carica i pagamenti
  await fetchPagamenti()
})
</script>
