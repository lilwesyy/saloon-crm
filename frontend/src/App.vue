<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <Sidebar :is-open="isSidebarOpen" @close="closeSidebar" />
    
    <!-- Main Content -->
    <div class="flex flex-col flex-1 overflow-hidden">
      <Header @toggle-sidebar="toggleSidebar" />
      
      <main class="flex-1 overflow-auto p-4 md:p-6">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
      
      <Footer />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Header from '@/components/layout/Header.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import Footer from '@/components/layout/Footer.vue'

export default defineComponent({
  name: 'App',
  components: {
    Header,
    Sidebar,
    Footer
  },
  setup() {
    const isSidebarOpen = ref(false)
    
    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value
    }
    
    const closeSidebar = () => {
      isSidebarOpen.value = false
    }
    
    return {
      isSidebarOpen,
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
