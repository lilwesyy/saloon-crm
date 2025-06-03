import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import router from '@/router'
import AuthService from '@/services/auth.service'

export interface User {
  id: string;
  nome: string;
  cognome: string;
  email: string;
  ruolo: string;
  fotoProfilo?: string;
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const currentUser = ref<User | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Getters
  const isLoggedIn = computed(() => !!token.value)
  const isAdmin = computed(() => currentUser.value?.ruolo === 'admin')
  const userName = computed(() => {
    if (!currentUser.value) return ''
    return `${currentUser.value.nome} ${currentUser.value.cognome}`
  })
  
  // Actions
  async function login(email: string, password: string) {
    loading.value = true
    error.value = null
    
    try {
      const response = await AuthService.login(email, password)
      token.value = response.token
      currentUser.value = response.user
      localStorage.setItem('token', response.token)
      
      // Redirect to home or intended page
      const redirectPath = router.currentRoute.value.query.redirect as string || '/'
      router.push(redirectPath)
      
      return true
    } catch (err: any) {
      error.value = err.message || 'Errore durante il login'
      return false
    } finally {
      loading.value = false
    }
  }
  
  function logout() {
    token.value = null
    currentUser.value = null
    localStorage.removeItem('token')
    router.push('/login')
  }
  
  async function checkAuth() {
    const savedToken = localStorage.getItem('token')
    if (!savedToken) return false
    
    try {
      token.value = savedToken
      const user = await AuthService.getCurrentUser()
      currentUser.value = user
      return true
    } catch (err) {
      token.value = null
      localStorage.removeItem('token')
      return false
    }
  }
  
  return {
    // State
    currentUser,
    token,
    loading,
    error,
    
    // Getters
    isLoggedIn,
    isAdmin,
    userName,
    
    // Actions
    login,
    logout,
    checkAuth
  }
})
