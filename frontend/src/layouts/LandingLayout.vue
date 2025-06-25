<template>
  <div class="min-h-screen flex flex-col">
    <!-- Simple Clean Header -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo/Brand -->
          <div class="flex items-center">
            <router-link to="/home" class="flex items-center">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <i class="fas fa-brain text-white text-lg"></i>
              </div>
              <div>
                <h1 class="text-xl font-bold text-gray-900">{{ appName }}</h1>
                <div class="text-xs text-blue-600 font-medium">Powered by AI</div>
              </div>
            </router-link>
          </div>

          <!-- Navigation -->
          <nav class="hidden lg:flex items-center space-x-8">
            <a href="#ai-features" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              AI Features
            </a>
            <a href="#caratteristiche" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Funzionalità
            </a>
            <a href="#pricing" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Prezzi
            </a>
            <a href="#contatti" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Contatti
            </a>
          </nav>
          
          <!-- Action Buttons -->
          <div class="flex items-center space-x-4">
            <router-link 
              v-if="authStore.isLoggedIn"
              to="/dashboard" 
              class="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              <i class="fas fa-tachometer-alt mr-2"></i>
              Dashboard
            </router-link>
            
            <template v-else>
              <router-link 
                to="/login" 
                class="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Accedi
              </router-link>
              
              <router-link 
                to="/prenotazione-online" 
                class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all">
                <i class="fas fa-calendar-plus mr-2"></i>
                Prova l'AI
              </router-link>
            </template>

            <!-- Mobile Menu Button -->
            <button 
              @click="toggleMobileMenu"
              class="lg:hidden p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-all">
              <div class="hamburger-icon" :class="{ 'active': showMobileMenu }">
                <span class="block w-6 h-0.5 bg-current mb-1 transition-all"></span>
                <span class="block w-6 h-0.5 bg-current mb-1 transition-all"></span>
                <span class="block w-6 h-0.5 bg-current transition-all"></span>
              </div>
            </button>
          </div>
        </div>

        <!-- Mobile Menu -->
        <div v-if="showMobileMenu" class="lg:hidden border-t border-gray-200 py-4">
          <div class="space-y-2">
            <a href="#ai-features" 
               @click="closeMobileMenu"
               class="block px-4 py-2 text-gray-700 hover:text-blue-600 font-medium">
              AI Features
            </a>
            <a href="#caratteristiche" 
               @click="closeMobileMenu"
               class="block px-4 py-2 text-gray-700 hover:text-blue-600 font-medium">
              Funzionalità
            </a>
            <a href="#pricing" 
               @click="closeMobileMenu"
               class="block px-4 py-2 text-gray-700 hover:text-blue-600 font-medium">
              Prezzi
            </a>
            <a href="#contatti" 
               @click="closeMobileMenu"
               class="block px-4 py-2 text-gray-700 hover:text-blue-600 font-medium">
              Contatti
            </a>

            <!-- Mobile Action Buttons -->
            <div class="pt-4 border-t border-gray-200 space-y-2">
              <router-link 
                v-if="!authStore.isLoggedIn" 
                to="/login" 
                @click="closeMobileMenu"
                class="block px-4 py-2 text-gray-700 hover:text-blue-600 font-medium">
                Accedi
              </router-link>
              
              <router-link 
                :to="authStore.isLoggedIn ? '/dashboard' : '/prenotazione-online'" 
                @click="closeMobileMenu"
                class="block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium mx-4">
                {{ authStore.isLoggedIn ? 'Dashboard' : 'Prova l\'AI' }}
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

    <!-- Enhanced AI Footer -->
    <footer class="relative bg-gray-900 text-white overflow-hidden">
      <!-- AI Background Pattern -->
      <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-purple-900/20 to-transparent">
        <div class="ai-grid absolute inset-0 opacity-10"></div>
      </div>
      
      <div class="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-12">
        <div class="max-w-7xl mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <!-- Enhanced Brand -->
            <div class="col-span-1 md:col-span-2">
              <div class="flex items-center mb-6">
                <div class="w-12 h-12 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                  <i class="fas fa-brain text-white text-lg animate-pulse"></i>
                </div>
                <div>
                  <h3 class="text-2xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">{{ appName }}</h3>
                  <p class="text-cyan-300 text-sm font-medium">AI Beauty Platform</p>
                </div>
              </div>
              <p class="text-gray-300 max-w-md leading-relaxed">
                {{ appDescription }}
              </p>
            </div>

            <!-- Contatti -->
            <div>
              <h4 class="font-semibold mb-4 text-cyan-300">Contatti</h4>
              <div class="space-y-3 text-gray-300">
                <div class="flex items-center group hover:text-white transition-colors duration-300">
                  <i class="fas fa-phone mr-3 text-cyan-400 group-hover:scale-110 transition-transform duration-300"></i>
                  <span>{{ appPhone }}</span>
                </div>
                <div class="flex items-center group hover:text-white transition-colors duration-300">
                  <i class="fas fa-envelope mr-3 text-purple-400 group-hover:scale-110 transition-transform duration-300"></i>
                  <span>{{ appEmail }}</span>
                </div>
              </div>
            </div>

            <!-- Link utili -->
            <div>
              <h4 class="font-semibold mb-4 text-cyan-300">Link utili</h4>
              <div class="space-y-3">
                <router-link to="/prenotazione-online" class="block text-gray-300 hover:text-white transition-colors duration-300 group">
                  <i class="fas fa-calendar-plus mr-2 text-cyan-400 group-hover:scale-110 transition-transform duration-300"></i>
                  Prova l'AI
                </router-link>
                <router-link v-if="!authStore.isLoggedIn" to="/login" class="block text-gray-300 hover:text-white transition-colors duration-300 group">
                  <i class="fas fa-sign-in-alt mr-2 text-purple-400 group-hover:scale-110 transition-transform duration-300"></i>
                  Area riservata
                </router-link>
                <router-link v-else to="/dashboard" class="block text-gray-300 hover:text-white transition-colors duration-300 group">
                  <i class="fas fa-tachometer-alt mr-2 text-blue-400 group-hover:scale-110 transition-transform duration-300"></i>
                  Dashboard
                </router-link>
              </div>
            </div>
          </div>

          <div class="border-t border-gray-800 mt-12 pt-8 text-center">
            <p class="text-gray-400">
              &copy; {{ new Date().getFullYear() }} {{ appName }}. Tutti i diritti riservati.
              <span class="block mt-2 text-sm">
                <i class="fas fa-brain mr-1 text-cyan-400"></i>
                Powered by Advanced Artificial Intelligence
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const showMobileMenu = ref(false);

// Dati statici dell'applicazione AI
const appName = 'BeautyHub AI';
const appPhone = '+39 800 123 456';
const appEmail = 'info@beautyhub.it';
const appDescription = 'La prima piattaforma AI per centri estetici. Ottimizza le tue operazioni, migliora l\'esperienza clienti e aumenta i ricavi con l\'intelligenza artificiale avanzata.';

// Mobile menu methods
const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
};

const closeMobileMenu = () => {
  showMobileMenu.value = false;
};
</script>

<style scoped>
/* Simple Header Styles */
.hamburger-icon.active span:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.hamburger-icon.active span:nth-child(2) {
  opacity: 0;
}

.hamburger-icon.active span:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

/* Footer AI Grid */
.ai-grid {
  background-image: 
    linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: gridFloat 20s linear infinite;
}

@keyframes gridFloat {
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
}

/* Smooth scrolling for anchor links */
html {
  scroll-behavior: smooth;
}
</style>
