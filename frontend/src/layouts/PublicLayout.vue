<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
    <!-- Header pubblico -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo/Brand -->
          <div class="flex items-center">
            <router-link to="/home" class="flex items-center">
              <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                <i class="fas fa-spa text-white text-sm"></i>
              </div>
              <h1 class="text-xl font-bold text-gray-900">{{ nomeAzienda }}</h1>
            </router-link>
          </div>

          <!-- Info contatto e azioni -->
          <div class="flex items-center space-x-6 text-sm">
            <div class="hidden md:flex items-center space-x-6 text-gray-600">
              <div class="flex items-center">
                <i class="fas fa-phone text-blue-500 mr-2"></i>
                <span>{{ telefono }}</span>
              </div>
              <div class="flex items-center">
                <i class="fas fa-envelope text-blue-500 mr-2"></i>
                <span>{{ email }}</span>
              </div>
            </div>
            
            <!-- Pulsanti di autenticazione -->
            <div class="flex items-center space-x-3">
              <router-link 
                v-if="authStore.isLoggedIn" 
                to="/dashboard" 
                class="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Dashboard
              </router-link>
              <router-link 
                v-else 
                to="/login" 
                class="bg-gray-100 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Accedi
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Contenuto principale -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col items-center justify-center text-center">
          <div class="text-sm text-gray-600">
            © {{ new Date().getFullYear() }} {{ nomeAzienda }}. Tutti i diritti riservati.
          </div>
          <div class="flex items-center space-x-4 mt-4">
            <a 
              v-if="linkPrivacy" 
              :href="linkPrivacy" 
              target="_blank" 
              class="text-sm text-blue-600 hover:text-blue-800"
            >
              Privacy Policy
            </a>
            <a 
              v-if="linkTermini" 
              :href="linkTermini" 
              target="_blank" 
              class="text-sm text-blue-600 hover:text-blue-800"
            >
              Termini di Servizio
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useSettingsStore } from '@/stores/settings';
import { useAuthStore } from '@/stores/auth';

const settingsStore = useSettingsStore();
const authStore = useAuthStore();

// Riferimenti reattivi per i valori delle impostazioni
const nomeAzienda = ref(settingsStore.businessName);
const telefono = ref(settingsStore.businessPhone || '+39 123 456 7890');
const email = ref(settingsStore.businessEmail || 'info@centroestetico.it');
const linkPrivacy = ref(process.env.VUE_APP_PRIVACY_LINK || '');
const linkTermini = ref(process.env.VUE_APP_TERMS_LINK || '');

// Carica le impostazioni del sistema all'avvio del componente
onMounted(async () => {
  await settingsStore.fetchSystemSettings();
  // Aggiorna i valori reattivi con quelli dallo store
  nomeAzienda.value = settingsStore.businessName;
  telefono.value = settingsStore.businessPhone || telefono.value;
  email.value = settingsStore.businessEmail || email.value;
});
</script>
