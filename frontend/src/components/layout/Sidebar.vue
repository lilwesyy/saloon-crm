<template>
  <!-- Mobile sidebar backdrop -->
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 z-20 md:hidden"
    @click="$emit('close')"
  ></div>

  <!-- Sidebar -->
  <div
    :class="[
      'fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0',
      isOpen ? 'translate-x-0' : '-translate-x-full'
    ]"
  >
    <div class="flex flex-col h-full">
      <!-- Logo section -->
      <div class="flex items-center justify-between h-16 px-4 bg-purple-600 text-white">
        <div class="flex items-center space-x-2">
          <svg class="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
          </svg>
          <span class="text-lg font-semibold">Estetica CRM</span>
        </div>
        
        <!-- Close button for mobile -->
        <button
          @click="$emit('close')"
          class="md:hidden p-2 rounded-md text-purple-200 hover:text-white hover:bg-purple-700"
        >
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        <!-- Dashboard -->
        <router-link
          to="/"
          class="flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors"
          :class="$route.name === 'Dashboard' ? 'bg-purple-100 text-purple-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
        >
          <svg class="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          </svg>
          Dashboard
        </router-link>

        <!-- Clienti -->
        <router-link
          to="/clienti"
          class="flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors"
          :class="$route.path.startsWith('/clienti') ? 'bg-purple-100 text-purple-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
        >
          <svg class="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
          Clienti
        </router-link>

        <!-- Appuntamenti -->
        <router-link
          to="/appuntamenti"
          class="flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors"
          :class="$route.path.startsWith('/appuntamenti') ? 'bg-purple-100 text-purple-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
        >
          <svg class="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Calendario
        </router-link>

        <!-- Servizi -->
        <router-link
          to="/servizi"
          class="flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors"
          :class="$route.path.startsWith('/servizi') ? 'bg-purple-100 text-purple-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
        >
          <svg class="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14-7H5m14 14H5" />
          </svg>
          Servizi
        </router-link>

        <!-- Pagamenti -->
        <router-link
          to="/pagamenti"
          class="flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors"
          :class="$route.path.startsWith('/pagamenti') ? 'bg-purple-100 text-purple-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
        >
          <svg class="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Pagamenti
        </router-link>

        <!-- Marketing Section -->
        <div class="mt-6">
          <p class="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Marketing
          </p>
          
          <!-- Campagne -->
          <router-link
            to="/marketing/campagne"
            class="flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors"
            :class="$route.path.startsWith('/marketing/campagne') ? 'bg-purple-100 text-purple-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
          >
            <svg class="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
            Campagne
          </router-link>

          <!-- Programmi Fedeltà -->
          <router-link
            to="/marketing/programmi-fedelta"
            class="flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors"
            :class="$route.path.startsWith('/marketing/programmi-fedelta') || $route.path.startsWith('/marketing/fedelta') ? 'bg-purple-100 text-purple-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
          >
            <svg class="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            Programmi Fedeltà
          </router-link>
        </div>

        <!-- Reportistica -->
        <router-link
          to="/reports"
          class="flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors"
          :class="$route.path.startsWith('/reports') ? 'bg-purple-100 text-purple-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
        >
          <svg class="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Report
        </router-link>

        <!-- Divider -->
        <hr class="my-4 border-gray-200">

        <!-- Admin section (only for admin users) -->
        <div v-if="authStore.isAdmin">
          <p class="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Amministrazione
          </p>
          
          <router-link
            to="/admin/users"
            class="flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors"
            :class="$route.path.startsWith('/admin/users') ? 'bg-purple-100 text-purple-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
          >
            <svg class="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            Utenti
          </router-link>

          <router-link
            to="/admin/settings"
            class="flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors"
            :class="$route.path.startsWith('/admin/settings') ? 'bg-purple-100 text-purple-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
          >
            <svg class="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Impostazioni
          </router-link>
        </div>
      </nav>

      <!-- User info at bottom -->
      <div class="flex-shrink-0 border-t border-gray-200 p-4">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div
              v-if="!authStore.currentUser?.fotoProfilo"
              class="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center"
            >
              <span class="text-sm font-medium text-purple-700">
                {{ getUserInitials }}
              </span>
            </div>
            <img
              v-else
              :src="authStore.currentUser.fotoProfilo"
              :alt="authStore.userName"
              class="h-10 w-10 rounded-full object-cover"
            />
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-900">{{ authStore.userName }}</p>
            <p class="text-xs text-gray-500">{{ authStore.currentUser?.ruolo }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

interface Props {
  isOpen: boolean
}

defineProps<Props>()
defineEmits(['close'])

const authStore = useAuthStore()

const getUserInitials = computed(() => {
  if (!authStore.currentUser) return ''
  const nome = authStore.currentUser.nome.charAt(0).toUpperCase()
  const cognome = authStore.currentUser.cognome.charAt(0).toUpperCase()
  return nome + cognome
})
</script>
