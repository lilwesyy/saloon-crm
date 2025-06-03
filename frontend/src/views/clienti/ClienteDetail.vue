<template>
  <div class="container mx-auto px-4 py-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Dettaglio Cliente</h1>
      <div class="flex gap-2">
        <router-link 
          :to="`/clienti/${cliente?.id}/modifica`" 
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Modifica
        </router-link>
        <router-link 
          to="/clienti" 
          class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Torna alla Lista
        </router-link>
      </div>
    </div>
    
    <div v-if="loading" class="text-center py-8">
      Caricamento cliente...
    </div>
    
    <div v-else-if="!cliente" class="text-center py-8 text-gray-500">
      Cliente non trovato
    </div>
    
    <div v-else class="grid gap-6 lg:grid-cols-3">
      <!-- Informazioni Cliente -->
      <div class="lg:col-span-2">
        <div class="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 class="text-xl font-semibold mb-4">Informazioni Personali</h2>
          <div class="grid gap-4 md:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700">Nome</label>
              <p class="mt-1 text-gray-900">{{ cliente.nome }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Cognome</label>
              <p class="mt-1 text-gray-900">{{ cliente.cognome }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Telefono</label>
              <p class="mt-1 text-gray-900">{{ cliente.telefono }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Email</label>
              <p class="mt-1 text-gray-900">{{ cliente.email || 'Non specificata' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Data di Nascita</label>
              <p class="mt-1 text-gray-900">{{ formatDate(cliente.dataNascita) || 'Non specificata' }}</p>
            </div>
          </div>
          <div v-if="cliente.note" class="mt-4">
            <label class="block text-sm font-medium text-gray-700">Note</label>
            <p class="mt-1 text-gray-900">{{ cliente.note }}</p>
          </div>
        </div>
      </div>
      
      <!-- Sidebar con azioni rapide -->
      <div>
        <div class="bg-white shadow-md rounded-lg p-6">
          <h3 class="text-lg font-semibold mb-4">Azioni Rapide</h3>
          <div class="space-y-3">
            <router-link 
              :to="`/appuntamenti/nuovo?cliente=${cliente.id}`"
              class="block w-full bg-green-600 text-white text-center px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Prenota Appuntamento
            </router-link>
            <button 
              @click="callClient" 
              class="block w-full bg-blue-600 text-white text-center px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Chiama Cliente
            </button>
            <button 
              @click="deleteClient" 
              class="block w-full bg-red-600 text-white text-center px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Elimina Cliente
            </button>
          </div>
        </div>
        
        <div class="bg-white shadow-md rounded-lg p-6 mt-6">
          <h3 class="text-lg font-semibold mb-4">Statistiche</h3>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-600">Appuntamenti totali:</span>
              <span class="font-semibold">0</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Ultima visita:</span>
              <span class="font-semibold">Mai</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Spesa totale:</span>
              <span class="font-semibold">€0.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useClientiStore } from '@/stores/clienti'

const route = useRoute()
const router = useRouter()
const clientiStore = useClientiStore()

const loading = ref(true)
const cliente = ref(null)

const formatDate = (date: string) => {
  if (!date) return null
  return new Date(date).toLocaleDateString('it-IT')
}

const callClient = () => {
  if (cliente.value?.telefono) {
    window.open(`tel:${cliente.value.telefono}`)
  }
}

const deleteClient = async () => {
  if (confirm('Sei sicuro di voler eliminare questo cliente?')) {
    try {
      await clientiStore.deleteCliente(route.params.id as string)
      router.push('/clienti')
    } catch (error) {
      console.error('Errore nell\'eliminazione del cliente:', error)
    }
  }
}

onMounted(async () => {
  try {
    cliente.value = await clientiStore.fetchCliente(route.params.id as string)
  } catch (error) {
    console.error('Errore nel caricamento del cliente:', error)
  } finally {
    loading.value = false
  }
})
</script>
