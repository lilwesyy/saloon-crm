<template>
  <div class="container mx-auto px-4 py-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Clienti</h1>
      <router-link 
        to="/clienti/nuovo" 
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Nuovo Cliente
      </router-link>
    </div>
    
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <div class="p-6">
        <div class="mb-4">
          <input 
            v-model="searchTerm" 
            type="text" 
            placeholder="Cerca clienti..." 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>
        
        <div v-if="loading" class="text-center py-4">
          Caricamento clienti...
        </div>
        
        <div v-else-if="filteredClienti.length === 0" class="text-center py-4 text-gray-500">
          Nessun cliente trovato
        </div>
        
        <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div 
            v-for="cliente in filteredClienti" 
            :key="cliente.id"
            class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            @click="$router.push(`/clienti/${cliente.id}`)"
          >
            <h3 class="font-semibold text-lg">{{ cliente.nome }} {{ cliente.cognome }}</h3>
            <p class="text-gray-600">{{ cliente.telefono }}</p>
            <p class="text-gray-600">{{ cliente.email }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useClientiStore } from '@/stores/clienti'

const clientiStore = useClientiStore()
const searchTerm = ref('')
const loading = ref(true)

const filteredClienti = computed(() => {
  if (!searchTerm.value) return clientiStore.clienti
  
  return clientiStore.clienti.filter(cliente => 
    cliente.nome.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    cliente.cognome.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    cliente.telefono.includes(searchTerm.value) ||
    cliente.email.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
})

onMounted(async () => {
  try {
    await clientiStore.fetchClienti()
  } catch (error) {
    console.error('Errore nel caricamento dei clienti:', error)
  } finally {
    loading.value = false
  }
})
</script>
