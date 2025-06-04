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
