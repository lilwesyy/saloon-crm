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
          Centro Estetico CRM
        </h1>
      </div>
      
      <!-- Spacer to push user menu to the right -->
      <div class="flex-grow"></div>

      <!-- User menu -->
      <div class="flex items-center space-x-4">
        <!-- Prenotazione Online Button -->
        <a href="/prenotazione-online" target="_blank" class="flex items-center p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-md">
          <svg class="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span class="hidden md:inline font-medium text-sm">Prenotazione Online</span>
        </a>
        
        <!-- Notifications -->
        <button class="p-2 text-gray-400 hover:text-gray-500 relative">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM10.07 2.82l-.09.32a7.5 7.5 0 000 14.72l.09.32A8.5 8.5 0 0010.07 2.82zM13.5 9.5l3-3m0 0l3 3m-3-3v12" />
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
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const emit = defineEmits(['toggle-sidebar'])

const authStore = useAuthStore()
const showUserMenu = ref(false)
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

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
