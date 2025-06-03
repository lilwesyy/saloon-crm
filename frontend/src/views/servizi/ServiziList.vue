<template>
  <div class="container mx-auto px-4 py-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Servizi</h1>
      <router-link 
        to="/servizi/nuovo" 
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Nuovo Servizio
      </router-link>
    </div>
    
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <div class="p-6">
        <div v-if="loading" class="text-center py-4">
          Caricamento servizi...
        </div>
        
        <div v-else-if="servizi.length === 0" class="text-center py-4 text-gray-500">
          Nessun servizio trovato
        </div>
        
        <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div 
            v-for="servizio in servizi" 
            :key="servizio.id"
            class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <h3 class="font-semibold text-lg">{{ servizio.nome }}</h3>
            <p class="text-gray-600 text-sm">{{ servizio.descrizione }}</p>
            <div class="mt-3 flex justify-between items-center">
              <div>
                <p class="text-xl font-bold text-green-600">€{{ servizio.prezzo }}</p>
                <p class="text-sm text-gray-500">{{ servizio.durata }} min</p>
              </div>
              <div class="flex gap-2">
                <router-link 
                  :to="`/servizi/${servizio.id}`"
                  class="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  Modifica
                </router-link>
                <button 
                  @click="deleteServizio(servizio.id)"
                  class="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                >
                  Elimina
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const loading = ref(true)
const servizi = ref([])

const fetchServizi = async () => {
  loading.value = true
  try {
    // TODO: Implementare chiamata API
    servizi.value = []
  } catch (error) {
    console.error('Errore nel caricamento dei servizi:', error)
  } finally {
    loading.value = false
  }
}

const deleteServizio = async (id: string) => {
  if (confirm('Sei sicuro di voler eliminare questo servizio?')) {
    try {
      // TODO: Implementare chiamata API
      await fetchServizi()
    } catch (error) {
      console.error('Errore nell\'eliminazione del servizio:', error)
    }
  }
}

onMounted(fetchServizi)
</script>
