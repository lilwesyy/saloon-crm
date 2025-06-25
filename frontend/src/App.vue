<template>
  <!-- Layout per pagine di autenticazione -->
  <div v-if="isAuthPage" class="min-h-screen">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
  
  <!-- Layout principale per pagine autenticate -->
  <div v-else class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <AppSidebar :is-open="isSidebarOpen" @close="closeSidebar" />
    
    <!-- Main Content -->
    <div class="flex flex-col flex-1 overflow-hidden">
      <AppHeader @toggle-sidebar="toggleSidebar" />
      
      <main class="flex-1 overflow-auto p-4 md:p-6">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
      
      <AppFooter />
    </div>
    
    <!-- Toast notifications -->
    <Toast />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import Header from '@/components/layout/Header.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import Footer from '@/components/layout/Footer.vue'
import Toast from '@/components/ui/Toast.vue'
import { useSettingsStore } from '@/stores/settings'
import { useAuthStore } from '@/stores/auth'

export default defineComponent({
  name: 'App',
  components: {
    AppHeader: Header,
    AppSidebar: Sidebar,
    AppFooter: Footer,
    Toast
  },
  setup() {
    const route = useRoute()
    const isSidebarOpen = ref(false)
    const settingsStore = useSettingsStore()
    const authStore = useAuthStore()
    
    // Pagine che non devono mostrare il layout principale
    const authPages = ['Login', 'NotFound']
    
    // Pagine pubbliche (prenotazione online e landing page)
    const publicPages = ['PrenotazioneOnline', 'ConfermaPrenotazione', 'CancellaPrenotazione', 'LandingPage', 'Home', 'HomeRoute']
    
    const isAuthPage = computed(() => {
      return authPages.includes(route.name as string) || publicPages.includes(route.name as string)
    })
    
    // Carica le impostazioni del sistema solo se l'utente è admin
    const loadSystemSettingsIfAdmin = () => {
      if (authStore.isLoggedIn && authStore.isAdmin) {
        settingsStore.fetchSystemSettings()
      }
    }
    
    // Carica le impostazioni quando l'app si monta e l'utente è admin
    onMounted(() => {
      loadSystemSettingsIfAdmin()
    })
    
    // Monitora i cambiamenti nell'autenticazione e carica le impostazioni quando necessario
    watch(() => authStore.isLoggedIn, () => {
      loadSystemSettingsIfAdmin()
    })
    
    watch(() => authStore.isAdmin, () => {
      loadSystemSettingsIfAdmin()
    })
    
    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value
    }
    
    const closeSidebar = () => {
      isSidebarOpen.value = false
    }
    
    return {
      isSidebarOpen,
      isAuthPage,
      toggleSidebar,
      closeSidebar
    }
  }
})
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
