<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-purple-100">
          <svg class="h-12 w-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Accedi al tuo account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          CRM Centro Estetico
        </p>
      </div>
      
      <form @submit.prevent="handleLogin" class="mt-8 space-y-6">
        <div class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autocomplete="email"
              required
              v-model="form.email"
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
              placeholder="Indirizzo email"
            />
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              v-model="form.password"
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
              placeholder="Password"
            />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              v-model="form.remember"
              class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">
              Ricordami
            </label>
          </div>

          <div class="text-sm">
            <a href="#" class="font-medium text-purple-600 hover:text-purple-500" @click.prevent="showForgotPassword = true">
              Password dimenticata?
            </a>
          </div>
        </div>

        <!-- Error message -->
        <div v-if="authStore.error" class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            <div class="ml-3">
              <p class="text-sm text-red-800">{{ authStore.error }}</p>
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="authStore.loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="authStore.loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="animate-spin h-5 w-5 text-purple-300" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            <span v-else class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="h-5 w-5 text-purple-500 group-hover:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a5 5 0 0110 0z" clip-rule="evenodd" />
              </svg>
            </span>
            {{ authStore.loading ? 'Accesso in corso...' : 'Accedi' }}
          </button>
        </div>
      </form>

      <!-- Modal per reset password -->
      <ForgotPasswordModal v-if="showForgotPassword" @close="showForgotPassword = false" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import ForgotPasswordModal from '@/components/auth/ForgotPasswordModal.vue'

const authStore = useAuthStore()
const router = useRouter()

const form = ref({
  email: '',
  password: '',
  remember: false
})

const showForgotPassword = ref(false)

// Redirect se già loggato
onMounted(() => {
  if (authStore.isLoggedIn) {
    router.push('/')
  }
})

const handleLogin = async (event?: Event) => {
  // Previeni qualsiasi comportamento predefinito
  if (event) {
    event.preventDefault()
    event.stopPropagation()
  }
  
  console.log('Tentativo di login con:', { email: form.value.email });
  
  // Validazione semplice
  if (!form.value.email || !form.value.password) {
    console.log('Email o password mancanti');
    return;
  }
  
  try {
    const success = await authStore.login(form.value.email, form.value.password)
    
    if (success) {
      console.log('Login riuscito, reindirizzamento gestito dallo store');
      if (form.value.remember) {
        localStorage.setItem('remember', 'true')
      }
      // La navigazione è già gestita dallo store auth nel metodo login()
    } else {
      console.log('Login fallito, mostro solo l\'errore senza navigazione');
      // Non fare nessuna navigazione quando il login fallisce
      // L'errore è già mostrato tramite authStore.error
    }
  } catch (error) {
    console.error('Errore durante il login:', error)
    // Non propagare l'errore per evitare ricaricamenti
  }
}
</script>
