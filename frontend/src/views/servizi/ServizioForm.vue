<template>
  <div class="container mx-auto px-4 py-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">
        {{ isEditing ? 'Modifica Servizio' : 'Nuovo Servizio' }}
      </h1>
      <router-link 
        to="/servizi" 
        class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
      >
        Torna alla Lista
      </router-link>
    </div>
    
    <div class="bg-white shadow-md rounded-lg p-6">
      <form @submit.prevent="handleSubmit">
        <div class="grid gap-6 md:grid-cols-2">
          <div>
            <label for="nome" class="block text-sm font-medium text-gray-700 mb-2">Nome Servizio *</label>
            <input 
              id="nome"
              v-model="servizio.nome" 
              type="text" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          
          <div>
            <label for="prezzo" class="block text-sm font-medium text-gray-700 mb-2">Prezzo (€) *</label>
            <input 
              id="prezzo"
              v-model="servizio.prezzo" 
              type="number" 
              step="0.01"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          
          <div>
            <label for="durata" class="block text-sm font-medium text-gray-700 mb-2">Durata (minuti) *</label>
            <input 
              id="durata"
              v-model="servizio.durata" 
              type="number" 
              min="15" 
              step="15"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          
          <div>
            <label for="categoria" class="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
            <select 
              id="categoria"
              v-model="servizio.categoria"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleziona categoria</option>
              <option value="taglio">Taglio</option>
              <option value="colore">Colore</option>
              <option value="piega">Piega</option>
              <option value="trattamento">Trattamento</option>
              <option value="altro">Altro</option>
            </select>
          </div>
        </div>
        
        <div class="mt-6">
          <label for="descrizione" class="block text-sm font-medium text-gray-700 mb-2">Descrizione</label>
          <textarea 
            id="descrizione"
            v-model="servizio.descrizione" 
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
        
        <div class="mt-6">
          <label class="flex items-center">
            <input 
              v-model="servizio.attivo" 
              type="checkbox" 
              class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            >
            <span class="ml-2 text-sm text-gray-700">Servizio attivo</span>
          </label>
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
            to="/servizi" 
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

const servizio = ref({
  nome: '',
  descrizione: '',
  prezzo: 0,
  durata: 60,
  categoria: '',
  attivo: true
})

const handleSubmit = async () => {
  loading.value = true
  try {
    // TODO: Implementare chiamata API
    router.push('/servizi')
  } catch (error) {
    console.error('Errore nel salvare il servizio:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (isEditing.value) {
    try {
      // TODO: Caricare i dati del servizio
    } catch (error) {
      console.error('Errore nel caricamento del servizio:', error)
    }
  }
})
</script>
