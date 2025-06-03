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
            <label for="servizio" class="block text-sm font-medium text-gray-700 mb-2">Servizio *</label>
            <select 
              id="servizio"
              v-model="appuntamento.servizioId" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleziona servizio</option>
              <option v-for="servizio in servizi" :key="servizio.id" :value="servizio.id">
                {{ servizio.nome }} - €{{ servizio.prezzo }}
              </option>
            </select>
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
              <option value="programmato">Programmato</option>
              <option value="confermato">Confermato</option>
              <option value="completato">Completato</option>
              <option value="cancellato">Cancellato</option>
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
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const isEditing = computed(() => !!route.params.id)

const appuntamento = ref({
  clienteId: '',
  servizioId: '',
  data: '',
  ora: '',
  durata: 60,
  stato: 'programmato',
  note: ''
})

const clienti = ref([])
const servizi = ref([])

const handleSubmit = async () => {
  loading.value = true
  try {
    // TODO: Implementare chiamata API
    router.push('/appuntamenti')
  } catch (error) {
    console.error('Errore nel salvare l\'appuntamento:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    // TODO: Caricare clienti e servizi
    // Se editing, caricare i dati dell'appuntamento
    if (route.query.cliente) {
      appuntamento.value.clienteId = route.query.cliente as string
    }
  } catch (error) {
    console.error('Errore nel caricamento dei dati:', error)
  }
})
</script>
