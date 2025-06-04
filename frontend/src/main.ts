import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/css/tailwind.css'
import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { useAuthStore } from './stores/auth'

const app = createApp(App)

// Pinia store
app.use(createPinia())

// Router
app.use(router)

// Toast notifications
app.use(Vue3Toastify, {
  autoClose: 3000,
  position: 'top-right',
  theme: 'light'
})

// Initialize authentication only for protected routes
const initApp = async () => {
  const authStore = useAuthStore()
  
  // Only check auth if we're not on a public route
  const currentPath = window.location.pathname
  const publicRoutes = ['/prenotazione-online', '/prenotazione']
  const isPublicRoute = publicRoutes.some(route => currentPath.startsWith(route))
  
  if (!isPublicRoute) {
    await authStore.checkAuth()
  }
  
  app.mount('#app')
}

initApp()
