<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="!pagamento" class="text-center py-12">
      <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
        <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Pagamento non trovato</h3>
      <p class="mt-1 text-sm text-gray-500">Il pagamento richiesto non esiste o è stato eliminato.</p>
      <div class="mt-6">
        <router-link
          to="/pagamenti"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Torna ai Pagamenti
        </router-link>
      </div>
    </div>

    <!-- Content -->
    <template v-else>
      <!-- Header -->
      <div class="sm:flex sm:items-center sm:justify-between">
        <div class="sm:flex-auto">
          <h1 class="text-2xl font-bold text-gray-900">Dettaglio Pagamento</h1>
          <p class="mt-2 text-sm text-gray-700">
            Pagamento #{{ pagamento._id.slice(-8).toUpperCase() }} - {{ formatDate(pagamento.dataPagamento) }}
          </p>
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none space-x-3">
          <router-link
            :to="`/pagamenti/${pagamento._id}/modifica`"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Modifica
          </router-link>
          <button
            v-if="pagamento.stato === 'completato'"
            @click="showRefundModal = true"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700"
          >
            <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            Rimborsa
          </button>
          <button
            @click="showDeleteModal = true"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
          >
            <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Elimina
          </button>
          <router-link
            to="/pagamenti"
            class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Torna alla Lista
          </router-link>
        </div>
      </div>

      <!-- Main Content -->
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Informazioni Pagamento</h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">Dettagli completi del pagamento selezionato.</p>
        </div>
        <div class="border-t border-gray-200">
          <dl>
            <!-- Stato -->
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Stato</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span :class="getStatoColor(pagamento.stato)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                  {{ formatStato(pagamento.stato) }}
                </span>
              </dd>
            </div>

            <!-- Cliente -->
            <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Cliente</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div class="flex items-center">
                  <div>
                    <p class="font-medium">{{ pagamento.cliente.nome }} {{ pagamento.cliente.cognome }}</p>
                    <p v-if="pagamento.cliente.email" class="text-gray-500">{{ pagamento.cliente.email }}</p>
                    <p v-if="pagamento.cliente.telefono" class="text-gray-500">{{ pagamento.cliente.telefono }}</p>
                  </div>
                </div>
              </dd>
            </div>

            <!-- Servizio -->
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Servizio</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <template v-if="pagamento.servizio">
                  <p class="font-medium">{{ pagamento.servizio.nome }}</p>
                  <p class="text-gray-500">Durata: {{ pagamento.servizio.durata }} minuti</p>
                  <p class="text-gray-500">Prezzo listino: €{{ pagamento.servizio.prezzo }}</p>
                </template>
                <span v-else class="text-gray-400 italic">Nessun servizio associato</span>
              </dd>
            </div>

            <!-- Importo -->
            <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Importo</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span class="text-lg font-bold text-green-600">€{{ pagamento.importo.toFixed(2) }}</span>
              </dd>
            </div>

            <!-- Metodo di Pagamento -->
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Metodo di Pagamento</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {{ formatMetodo(pagamento.metodo) }}
              </dd>
            </div>

            <!-- Tipo -->
            <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Tipo</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {{ formatTipo(pagamento.tipo) }}
              </dd>
            </div>

            <!-- Data Pagamento -->
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Data Pagamento</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {{ formatDate(pagamento.dataPagamento) }} alle {{ formatTime(pagamento.dataPagamento) }}
              </dd>
            </div>

            <!-- Note -->
            <div v-if="pagamento.note" class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Note</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <p class="whitespace-pre-wrap">{{ pagamento.note }}</p>
              </dd>
            </div>

            <!-- Metadati -->
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Creato</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {{ formatDate(pagamento.createdAt) }} alle {{ formatTime(pagamento.createdAt) }}
              </dd>
            </div>

            <div v-if="pagamento.updatedAt !== pagamento.createdAt" class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Ultima Modifica</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {{ formatDate(pagamento.updatedAt) }} alle {{ formatTime(pagamento.updatedAt) }}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </template>

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
                :max="pagamento?.importo"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :placeholder="`Massimo €${pagamento?.importo || 0}`"
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
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import pagamentiService, { type Pagamento } from '@/services/pagamenti.service'
import { useToast } from '@/composables/useToast'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const loading = ref(true)
const pagamento = ref<Pagamento | null>(null)
const showRefundModal = ref(false)
const showDeleteModal = ref(false)

// Dati per rimborso
const refundData = ref({
  motivo: '',
  importo: undefined as number | undefined
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('it-IT')
}

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
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

const formatTipo = (tipo: string) => {
  const tipi = {
    servizio: 'Servizio',
    prodotto: 'Prodotto',
    abbonamento: 'Abbonamento',
    altro: 'Altro'
  }
  return tipi[tipo as keyof typeof tipi] || tipo
}

const getStatoColor = (stato: string) => {
  const colori = {
    completato: 'bg-green-100 text-green-800',
    rimborsato: 'bg-yellow-100 text-yellow-800',
    annullato: 'bg-red-100 text-red-800'
  }
  return colori[stato as keyof typeof colori] || 'bg-gray-100 text-gray-800'
}

const closeRefundModal = () => {
  showRefundModal.value = false
  refundData.value = { motivo: '', importo: undefined }
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
}

const confermaRimborso = async () => {
  if (!pagamento.value) return
  
  try {
    await pagamentiService.refundPagamento(pagamento.value._id, {
      motivo: refundData.value.motivo,
      importo: refundData.value.importo
    })
    
    toast.success('Rimborso elaborato con successo')
    closeRefundModal()
    
    // Ricarica i dati del pagamento
    await loadPagamento()
  } catch (error) {
    console.error('Errore nel rimborso:', error)
    toast.error('Errore nell\'elaborazione del rimborso')
  }
}

const confermaEliminazione = async () => {
  if (!pagamento.value) return
  
  try {
    await pagamentiService.deletePagamento(pagamento.value._id)
    toast.success('Pagamento eliminato con successo')
    router.push('/pagamenti')
  } catch (error) {
    console.error('Errore nell\'eliminazione:', error)
    toast.error('Errore nell\'eliminazione del pagamento')
  }
}

const loadPagamento = async () => {
  loading.value = true
  try {
    const id = route.params.id as string
    pagamento.value = await pagamentiService.getPagamentoById(id)
    
    // Inizializza l'importo del rimborso con l'importo del pagamento
    if (pagamento.value) {
      refundData.value.importo = pagamento.value.importo
    }
  } catch (error) {
    console.error('Errore nel caricamento del pagamento:', error)
    toast.error('Pagamento non trovato')
    pagamento.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadPagamento()
})
</script>
