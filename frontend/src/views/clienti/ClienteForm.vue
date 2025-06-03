<template>
  <div class="container mx-auto px-4 py-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">
        {{ isEditing ? 'Modifica Cliente' : 'Nuovo Cliente' }}
      </h1>
      <router-link 
        to="/clienti" 
        class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
      >
        Torna alla Lista
      </router-link>
    </div>
    
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <form @submit.prevent="handleSubmit" class="p-6">
        <div class="grid gap-6 md:grid-cols-2">
          <div>
            <label for="nome" class="block text-sm font-medium text-gray-700 mb-2">Nome *</label>
            <input 
              id="nome"
              v-model="cliente.nome" 
              type="text" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          
          <div>
            <label for="cognome" class="block text-sm font-medium text-gray-700 mb-2">Cognome *</label>
            <input 
              id="cognome"
              v-model="cliente.cognome" 
              type="text" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          
          <div>
            <label for="telefono" class="block text-sm font-medium text-gray-700 mb-2">Telefono *</label>
            <input 
              id="telefono"
              v-model="cliente.telefono" 
              type="tel" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input 
              id="email"
              v-model="cliente.email" 
              type="email"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          
          <div>
            <label for="dataNascita" class="block text-sm font-medium text-gray-700 mb-2">Data di Nascita</label>
            <input 
              id="dataNascita"
              v-model="cliente.dataNascita" 
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
        </div>
        
        <div class="mt-6">
          <label for="note" class="block text-sm font-medium text-gray-700 mb-2">Note</label>
          <textarea 
            id="note"
            v-model="cliente.note" 
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
            to="/clienti" 
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
import { useClientiStore } from '@/stores/clienti'

const route = useRoute()
const router = useRouter()
const clientiStore = useClientiStore()

const loading = ref(false)
const isEditing = computed(() => !!route.params.id)

const cliente = ref({
  nome: '',
  cognome: '',
  telefono: '',
  email: '',
  dataNascita: '',
  note: ''
})

const handleSubmit = async () => {
  loading.value = true
  try {
    if (isEditing.value) {
      await clientiStore.updateCliente(route.params.id as string, cliente.value)
    } else {
      await clientiStore.createCliente(cliente.value)
    }
    router.push('/clienti')
  } catch (error) {
    console.error('Errore nel salvare il cliente:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (isEditing.value) {
    try {
      const clienteData = await clientiStore.fetchCliente(route.params.id as string)
      if (clienteData) {
        cliente.value = { ...clienteData }
      }
    } catch (error) {
      console.error('Errore nel caricamento del cliente:', error)
    }
  }
})
</script>
