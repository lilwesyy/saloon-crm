<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- Header pubblico -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo/Brand -->
          <div class="flex items-center">
            <router-link to="/prenotazione-online" class="flex items-center">
              <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                <i class="fas fa-spa text-white text-sm"></i>
              </div>
              <h1 class="text-xl font-bold text-gray-900">{{ nomeAzienda }}</h1>
            </router-link>
          </div>

          <!-- Info contatto -->
          <div class="hidden md:flex items-center space-x-6 text-sm text-gray-600">
            <div class="flex items-center">
              <i class="fas fa-phone text-blue-500 mr-2"></i>
              <span>{{ telefono }}</span>
            </div>
            <div class="flex items-center">
              <i class="fas fa-envelope text-blue-500 mr-2"></i>
              <span>{{ email }}</span>
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
    <footer class="bg-white border-t mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="text-sm text-gray-600">
            © {{ new Date().getFullYear() }} {{ nomeAzienda }}. Tutti i diritti riservati.
          </div>
          <div class="flex items-center space-x-4 mt-4 md:mt-0">
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
// Configurazione aziendale - questi valori potrebbero venire da un servizio di configurazione
const nomeAzienda = process.env.VUE_APP_BUSINESS_NAME || 'Centro Estetico Bellezza';
const telefono = process.env.VUE_APP_BUSINESS_PHONE || '+39 123 456 7890';
const email = process.env.VUE_APP_BUSINESS_EMAIL || 'info@centroestetico.it';
const linkPrivacy = process.env.VUE_APP_PRIVACY_LINK || '';
const linkTermini = process.env.VUE_APP_TERMS_LINK || '';
</script>
