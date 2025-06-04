<template>
  <div class="container mx-auto px-4 py-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">
        {{ isEditing ? 'Modifica Appuntamento' : 'Nuovo Appuntamento' }}
      </h1>
      <router-link 
        to="/appuntamenti" 
        class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
      >
        Torna al Calendario
      </router-link>
    </div>
    
    <div class="bg-white shadow-md rounded-lg p-6">
      <form @submit.prevent="handleSubmit">
        <div class="grid gap-6 md:grid-cols-2">
          <div>
            <label for="cliente" class="block text-sm font-medium text-gray-700 mb-2">Cliente *</label>
            <select 
              id="cliente"
              v-model="appuntamento.clienteId" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleziona cliente</option>
              <option v-for="cliente in clienti" :key="cliente.id" :value="cliente.id">
                {{ cliente.nome }} {{ cliente.cognome }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Servizi *</label>
            <div class="space-y-2">
              <div v-for="servizio in servizi" :key="servizio._id" class="flex items-center">
                <input 
                  type="checkbox"
                  :id="`servizio-${servizio._id}`" 
                  :checked="serviziSelezionati.includes(servizio._id)"
                  @change="aggiungiRimuoviServizio(servizio)"
                  class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label :for="`servizio-${servizio._id}`" class="ml-2 block text-sm text-gray-900">
                  {{ servizio.nome }} - €{{ servizio.prezzo }}
                </label>
              </div>
              <p v-if="appuntamento.servizi.length === 0" class="text-red-500 text-xs mt-1">
                Seleziona almeno un servizio
              </p>
            </div>
          </div>
          
          <div>
            <label for="data" class="block text-sm font-medium text-gray-700 mb-2">Data *</label>
            <input 
              id="data"
              v-model="appuntamento.data" 
              type="date" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          
          <div>
            <label for="ora" class="block text-sm font-medium text-gray-700 mb-2">Ora *</label>
            <input 
              id="ora"
              v-model="appuntamento.ora" 
              type="time" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          
          <div>
            <label for="operatore" class="block text-sm font-medium text-gray-700 mb-2">Operatore *</label>
            <select 
              id="operatore"
              v-model="appuntamento.operatoreId" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleziona operatore</option>
              <option v-for="operatore in operatori" :key="operatore._id" :value="operatore._id">
                {{ operatore.nome }} {{ operatore.cognome }}
              </option>
            </select>
          </div>
          
          <div>
            <label for="durata" class="block text-sm font-medium text-gray-700 mb-2">Durata (minuti)</label>
            <input 
              id="durata"
              v-model="appuntamento.durata" 
              type="number" 
              min="15" 
              step="15"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          
          <div>
            <label for="stato" class="block text-sm font-medium text-gray-700 mb-2">Stato</label>
            <select 
              id="stato"
              v-model="appuntamento.stato"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="prenotato">Prenotato</option>
              <option value="confermato">Confermato</option>
              <option value="completato">Completato</option>
              <option value="cancellato">Cancellato</option>
              <option value="noshow">No-show</option>
            </select>
          </div>
        </div>
        
        <div class="mt-6">
          <label for="note" class="block text-sm font-medium text-gray-700 mb-2">Note</label>
          <textarea 
            id="note"
            v-model="appuntamento.note" 
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            to="/appuntamenti" 
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
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const isEditing = computed(() => !!route.params.id)
const serviziSelezionati = ref<string[]>([])

import { useAppuntamentiStore } from '@/stores/appuntamenti'
import { useClientiStore } from '@/stores/clienti'
import { useServiziStore } from '@/stores/servizi'
import { useOperatoriStore } from '@/stores/operatori'

const appuntamentiStore = useAppuntamentiStore()
const clientiStore = useClientiStore()
const serviziStore = useServiziStore()
const operatoriStore = useOperatoriStore()

const appuntamento = ref({
  clienteId: '',
  servizi: [] as { servizio: string, prezzo: number }[],
  operatoreId: '',
  data: new Date().toISOString().split('T')[0],
  ora: '',
  durata: 60,
  stato: 'prenotato',
  note: ''
})

const clienti = computed(() => clientiStore.clienti)
const servizi = computed(() => serviziStore.servizi)
const operatori = computed(() => operatoriStore.operatoriAttivi)

const aggiungiRimuoviServizio = (servizio: any) => {
  const servicioId = servizio._id
  const servicioPrezzo = servizio.prezzo
  
  // Trova se il servizio è già selezionato
  const index = appuntamento.value.servizi.findIndex(s => s.servizio === servicioId)
  
  if (index >= 0) {
    // Rimuovi il servizio se già presente
    appuntamento.value.servizi.splice(index, 1)
  } else {
    // Aggiungi il servizio se non presente
    appuntamento.value.servizi.push({
      servizio: servicioId,
      prezzo: servicioPrezzo
    })
  }
}

// Watch per sincronizzare serviziSelezionati con appuntamento.servizi
watch(() => appuntamento.value.servizi, (newServizi) => {
  serviziSelezionati.value = newServizi.map(s => s.servizio)
}, { deep: true })

const handleSubmit = async () => {
  // Validazione form
  if (!appuntamento.value.clienteId) {
    alert('Seleziona un cliente')
    return
  }
  
  if (appuntamento.value.servizi.length === 0) {
    alert('Seleziona almeno un servizio')
    return
  }
  
  if (!appuntamento.value.operatoreId) {
    alert('Seleziona un operatore')
    return
  }
  
  loading.value = true
  try {
    // Componi i dati dell'appuntamento nel formato richiesto dall'API
    const dataOraInizio = new Date(`${appuntamento.value.data}T${appuntamento.value.ora}:00`)
    
    // Calcola la data e ora di fine in base alla durata
    const dataOraFine = new Date(dataOraInizio)
    dataOraFine.setMinutes(dataOraFine.getMinutes() + appuntamento.value.durata)
    
    const appuntamentoData = {
      cliente: appuntamento.value.clienteId,
      servizi: appuntamento.value.servizi,
      operatore: appuntamento.value.operatoreId,
      dataOraInizio: dataOraInizio.toISOString(),
      dataOraFine: dataOraFine.toISOString(),
      stato: appuntamento.value.stato,
      note: appuntamento.value.note
    }
    
    if (isEditing.value) {
      await appuntamentiStore.updateAppuntamento(route.params.id as string, appuntamentoData)
    } else {
      await appuntamentiStore.createAppuntamento(appuntamentoData)
    }
    
    // Reindirizza al calendario degli appuntamenti
    router.push('/appuntamenti')
  } catch (error) {
    console.error('Errore nel salvare l\'appuntamento:', error)
    alert('Errore nel salvare l\'appuntamento. Riprova.')
  } finally {
    loading.value = false
  }
}

const loadAppuntamento = async (id: string) => {
  try {
    loading.value = true
    
    // Carica i dettagli dell'appuntamento
    await appuntamentiStore.fetchAppuntamento(id)
    const appuntamentoData = appuntamentiStore.currentAppuntamento
    
    if (appuntamentoData) {
      // Converti i dati dell'appuntamento nel formato del form
      const dataOraInizio = new Date(appuntamentoData.dataOraInizio)
      const dataOraFine = new Date(appuntamentoData.dataOraFine)
      
      // Calcola la durata in minuti
      const durata = Math.round((dataOraFine.getTime() - dataOraInizio.getTime()) / (1000 * 60))
      
      appuntamento.value = {
        clienteId: appuntamentoData.cliente._id,
        servizi: appuntamentoData.servizi.map(servizio => ({
          servizio: servizio.servizio._id,
          prezzo: servizio.prezzo
        })),
        operatoreId: appuntamentoData.operatore._id,
        data: dataOraInizio.toISOString().split('T')[0],
        ora: dataOraInizio.toTimeString().substring(0, 5),
        durata: durata,
        stato: appuntamentoData.stato,
        note: appuntamentoData.note || ''
      }
      
      // Aggiorna anche serviziSelezionati per i checkbox
      serviziSelezionati.value = appuntamento.value.servizi.map(s => s.servizio)
    }
  } catch (error) {
    console.error('Errore nel caricamento dell\'appuntamento:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    loading.value = true
    
    // Carica i clienti, servizi e operatori
    await Promise.all([
      clientiStore.fetchClienti(),
      serviziStore.fetchServizi(),
      operatoriStore.fetchOperatori()
    ])
    
    // Se stiamo modificando un appuntamento esistente, carica i suoi dati
    if (isEditing.value) {
      await loadAppuntamento(route.params.id as string)
    } 
    // Se abbiamo un cliente specificato nei query parameters
    else if (route.query.cliente) {
      appuntamento.value.clienteId = route.query.cliente as string
    }
  } catch (error) {
    console.error('Errore nel caricamento dei dati:', error)
  } finally {
    loading.value = false
  }
})
</script>
