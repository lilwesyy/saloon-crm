<template>
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="flex items-center px-4 py-3">
      <!-- Mobile/Tablet menu button -->
      <button
        @click="$emit('toggle-sidebar')"
        class="xl:hidden p-2 mr-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
      >
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <!-- Logo/Title -->
      <div class="flex items-center">
        <h1 class="text-xl font-semibold text-gray-900">
          {{ settingsStore.businessName }}
        </h1>
      </div>
      
      <!-- Spacer to push user menu to the right -->
      <div class="flex-grow"></div>

      <!-- User menu -->
      <div class="flex items-center space-x-4">
        <!-- Prenotazione Online Button -->
        <button @click="handlePrenotazioneOnlineClick" class="flex items-center p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-md">
          <svg class="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span class="hidden md:inline font-medium text-sm">Prenotazione Online</span>
        </button>
        
        <!-- Notifications -->
        <button class="p-2 text-gray-400 hover:text-gray-500 relative">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
          </svg>
          <!-- Notification badge -->
          <span class="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        <!-- User dropdown -->
        <div class="relative" ref="userMenuRef">
          <button
            @click="showUserMenu = !showUserMenu"
            class="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <div class="flex-shrink-0">
              <img
                v-if="authStore.currentUser?.fotoProfilo"
                :src="authStore.currentUser.fotoProfilo"
                :alt="authStore.userName"
                class="h-8 w-8 rounded-full object-cover"
              />
              <div
                v-else
                class="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center"
              >
                <span class="text-sm font-medium text-purple-700">
                  {{ getUserInitials }}
                </span>
              </div>
            </div>
            <div class="hidden md:block text-left">
              <p class="text-sm font-medium text-gray-900">{{ authStore.userName }}</p>
              <p class="text-xs text-gray-500">{{ authStore.currentUser?.ruolo }}</p>
            </div>
            <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Dropdown menu -->
          <div
            v-if="showUserMenu"
            class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
          >
            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Il mio profilo
            </a>
            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Impostazioni
            </a>
            <hr class="my-1">
            <button
              @click="handleLogout"
              class="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50"
            >
              Esci
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal per prenotazioni online disabilitate -->
    <div v-if="showBookingDisabledModal" class="fixed z-50 inset-0 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" @click="showBookingDisabledModal = false">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  Prenotazioni Online Disabilitate
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Le prenotazioni online sono attualmente disabilitate. Per attivare questa funzionalità, 
                    vai alle impostazioni di sistema e abilita le prenotazioni online.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              @click="goToSettings"
              type="button"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Vai alle Impostazioni
            </button>
            <button
              @click="showBookingDisabledModal = false"
              type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Chiudi
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useSettingsStore } from '@/stores/settings'

const emit = defineEmits(['toggle-sidebar'])

const authStore = useAuthStore()
const settingsStore = useSettingsStore()
const showUserMenu = ref(false)
const showBookingDisabledModal = ref(false)
const userMenuRef = ref<HTMLElement>()

const getUserInitials = computed(() => {
  if (!authStore.currentUser) return ''
  const nome = authStore.currentUser.nome.charAt(0).toUpperCase()
  const cognome = authStore.currentUser.cognome.charAt(0).toUpperCase()
  return nome + cognome
})

const handleLogout = () => {
  authStore.logout()
}

// Close user menu when clicking outside
const handleClickOutside = (event: Event) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    showUserMenu.value = false
  }
}

const handlePrenotazioneOnlineClick = () => {
  // Verifica se le prenotazioni online sono abilitate
  if (!settingsStore.prenotazioniOnlineAbilitate) {
    showBookingDisabledModal.value = true
    return
  }
  
  // Se sono abilitate, apri in una nuova finestra
  window.open('/prenotazione-online', '_blank')
}

const goToSettings = () => {
  showBookingDisabledModal.value = false
  // Usa window.location per navigare alle impostazioni
  window.location.href = '/impostazioni'
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  
  // Carica le impostazioni del sistema se non sono già caricate
  if (!settingsStore.loaded) {
    settingsStore.fetchSystemSettings()
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
