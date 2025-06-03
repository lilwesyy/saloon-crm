<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="$emit('close')">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
      <div class="mt-3 text-center">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
          <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
        </div>
        
        <h3 class="text-lg leading-6 font-medium text-gray-900 mt-4">
          Password dimenticata?
        </h3>
        
        <div class="mt-2 px-7 py-3">
          <p class="text-sm text-gray-500">
            Inserisci la tua email e ti invieremo le istruzioni per reimpostare la password.
          </p>
        </div>
        
        <form @submit.prevent="handleSubmit" class="mt-4">
          <div class="mb-4">
            <input
              v-model="email"
              type="email"
              required
              placeholder="Inserisci la tua email"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          
          <!-- Error message -->
          <div v-if="error" class="mb-4 text-sm text-red-600">
            {{ error }}
          </div>
          
          <!-- Success message -->
          <div v-if="success" class="mb-4 text-sm text-green-600">
            Email inviata! Controlla la tua casella di posta.
          </div>
          
          <div class="flex items-center justify-between space-x-4">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 bg-gray-300 text-gray-700 text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Annulla
            </button>
            
            <button
              type="submit"
              :disabled="loading"
              class="px-4 py-2 bg-blue-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading">Invio...</span>
              <span v-else>Invia</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AuthService from '@/services/auth.service'

const emit = defineEmits(['close'])

const email = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)

const handleSubmit = async () => {
  if (!email.value) return
  
  loading.value = true
  error.value = ''
  
  try {
    await AuthService.requestPasswordReset(email.value)
    success.value = true
    
    // Chiudi il modal dopo 3 secondi
    setTimeout(() => {
      emit('close')
    }, 3000)
  } catch (err: any) {
    error.value = err.message || 'Errore durante l\'invio dell\'email'
  } finally {
    loading.value = false
  }
}
</script>
