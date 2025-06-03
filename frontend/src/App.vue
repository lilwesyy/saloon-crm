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
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import Header from '@/components/layout/Header.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import Footer from '@/components/layout/Footer.vue'

export default defineComponent({
  name: 'App',
  components: {
    AppHeader: Header,
    AppSidebar: Sidebar,
    AppFooter: Footer
  },
  setup() {
    const route = useRoute()
    const isSidebarOpen = ref(false)
    
    // Pagine che non devono mostrare il layout principale
    const authPages = ['Login', 'NotFound']
    
    const isAuthPage = computed(() => {
      return authPages.includes(route.name as string)
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
