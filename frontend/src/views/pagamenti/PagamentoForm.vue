<template>
  <div class="container mx-auto px-4 py-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">
        {{ isEditing ? 'Modifica Pagamento' : 'Nuovo Pagamento' }}
      </h1>
      <router-link 
        to="/pagamenti" 
        class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
      >
        Torna alla Lista
      </router-link>
    </div>
    
    <div class="bg-white shadow-md rounded-lg p-6">
      <form @submit.prevent="handleSubmit">
        <div class="grid gap-6 md:grid-cols-2">
          <!-- Cliente -->
          <div>
            <label for="cliente" class="block text-sm font-medium text-gray-700 mb-2">Cliente *</label>
            <select 
              id="cliente"
              v-model="pagamento.cliente" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleziona cliente</option>
              <option v-for="cliente in clienti" :key="cliente._id" :value="cliente._id">
                {{ cliente.nome }} {{ cliente.cognome }}
              </option>
            </select>
          </div>
          
          <!-- Servizio -->
          <div>
            <label for="servizio" class="block text-sm font-medium text-gray-700 mb-2">Servizio (opzionale)</label>
            <select 
              id="servizio"
              v-model="pagamento.servizio"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              @change="onServizioChange"
            >
              <option value="">Nessun servizio</option>
              <option v-for="servizio in servizi" :key="servizio._id" :value="servizio._id">
                {{ servizio.nome }} - €{{ servizio.prezzo }}
              </option>
            </select>
          </div>
          
          <!-- Importo -->
          <div>
            <label for="importo" class="block text-sm font-medium text-gray-700 mb-2">Importo (€) *</label>
            <input 
              id="importo"
              v-model.number="pagamento.importo" 
              type="number" 
              step="0.01"
              min="0"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          
          <!-- Metodo -->
          <div>
            <label for="metodo" class="block text-sm font-medium text-gray-700 mb-2">Metodo di Pagamento *</label>
            <select 
              id="metodo"
              v-model="pagamento.metodo" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="contanti">Contanti</option>
              <option value="carta">Carta</option>
              <option value="bonifico">Bonifico</option>
              <option value="assegno">Assegno</option>
              <option value="altro">Altro</option>
            </select>
          </div>
          
          <!-- Tipo -->
          <div>
            <label for="tipo" class="block text-sm font-medium text-gray-700 mb-2">Tipo *</label>
            <select 
              id="tipo"
              v-model="pagamento.tipo" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="servizio">Servizio</option>
              <option value="prodotto">Prodotto</option>
              <option value="abbonamento">Abbonamento</option>
              <option value="altro">Altro</option>
            </select>
          </div>
          
          <!-- Stato -->
          <div>
            <label for="stato" class="block text-sm font-medium text-gray-700 mb-2">Stato *</label>
            <select 
              id="stato"
              v-model="pagamento.stato" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="completato">Completato</option>
              <option value="rimborsato">Rimborsato</option>
              <option value="annullato">Annullato</option>
            </select>
          </div>
        </div>
        
        <!-- Data -->
        <div class="mt-6">
          <label for="dataPagamento" class="block text-sm font-medium text-gray-700 mb-2">Data Pagamento *</label>
          <input 
            id="dataPagamento"
            v-model="pagamento.dataPagamento" 
            type="date" 
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>
        
        <!-- Note -->
        <div class="mt-6">
          <label for="note" class="block text-sm font-medium text-gray-700 mb-2">Note</label>
          <textarea 
            id="note"
            v-model="pagamento.note" 
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Informazioni aggiuntive sul pagamento..."
          ></textarea>
        </div>
        
        <div class="mt-8 flex gap-4">
          <button 
            type="submit" 
            :disabled="loading"
            class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {{ loading ? 'Salvando...' : (isEditing ? 'Aggiorna' : 'Crea') }}
          </button>
          <router-link 
            to="/pagamenti" 
            class="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Annulla
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import pagamentiService, { type CreatePagamentoData, type UpdatePagamentoData } from '@/services/pagamenti.service'
import clientiService from '@/services/clienti.service'
import type { Cliente } from '@/stores/clienti'
import serviziService from '@/services/servizi.service'
import type { Servizio } from '@/services/servizi.service'
import { useToast } from '@/composables/useToast'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const loading = ref(false)
const clienti = ref<Cliente[]>([])
const servizi = ref<Servizio[]>([])
const isEditing = computed(() => !!route.params.id)

const pagamento = ref<CreatePagamentoData>({
  cliente: '',
  servizio: '',
  importo: 0,
  metodo: 'contanti',
  tipo: 'servizio',
  stato: 'completato',
  dataPagamento: new Date().toISOString().split('T')[0],
  note: ''
})

const onServizioChange = () => {
  if (pagamento.value.servizio) {
    const servizioSelezionato = servizi.value.find(s => s._id === pagamento.value.servizio)
    if (servizioSelezionato && pagamento.value.importo === 0) {
      pagamento.value.importo = servizioSelezionato.prezzo
    }
  }
}

const handleSubmit = async () => {
  loading.value = true
  try {
    if (isEditing.value) {
      await pagamentiService.updatePagamento(route.params.id as string, pagamento.value as UpdatePagamentoData)
      toast.success('Pagamento aggiornato con successo')
    } else {
      await pagamentiService.createPagamento(pagamento.value)
      toast.success('Pagamento creato con successo')
    }
    router.push('/pagamenti')
  } catch (error: any) {
    console.error('Errore nel salvare il pagamento:', error)
    toast.error('Errore nel salvare il pagamento: ' + (error.response?.data?.message || error.message || 'Errore sconosciuto'))
  } finally {
    loading.value = false
  }
}

const loadClienti = async () => {
  try {
    const response = await clientiService.getAll({ limit: 1000 })
    clienti.value = response.clienti
  } catch (error) {
    console.error('Errore nel caricamento clienti:', error)
    toast.error('Errore nel caricamento clienti')
  }
}

const loadServizi = async () => {
  try {
    servizi.value = await serviziService.getAllServizi()
  } catch (error) {
    console.error('Errore nel caricamento servizi:', error)
    toast.error('Errore nel caricamento servizi')
  }
}

onMounted(async () => {
  await Promise.all([loadClienti(), loadServizi()])
  
  if (isEditing.value) {
    try {
      const pagamentoData = await pagamentiService.getPagamentoById(route.params.id as string)
      console.log('Pagamento caricato:', pagamentoData)
      
      if (pagamentoData) {
        pagamento.value = {
          cliente: pagamentoData.cliente._id,
          servizio: pagamentoData.servizio?._id || '',
          importo: pagamentoData.importo,
          metodo: pagamentoData.metodo,
          tipo: pagamentoData.tipo,
          stato: pagamentoData.stato,
          dataPagamento: pagamentoData.dataPagamento.split('T')[0],
          note: pagamentoData.note || ''
        }
      } else {
        console.error('Pagamento non trovato')
        toast.error('Pagamento non trovato')
        router.push('/pagamenti')
      }
    } catch (error) {
      console.error('Errore nel caricamento del pagamento:', error)
      toast.error('Errore nel caricamento del pagamento')
      router.push('/pagamenti')
    }
  }
})
</script>
