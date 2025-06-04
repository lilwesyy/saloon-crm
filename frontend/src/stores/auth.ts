import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import router from '../router'
import AuthService from '../services/auth.service'
import { User, LoginResponse } from '../types/api'

export const useAuthStore = defineStore('auth', () => {
  // State
  const currentUser = ref<User | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Getters
  const isLoggedIn = computed(() => {
    return !!token.value && !!currentUser.value
  })
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
      console.log('Tentativo di login con API...', { email })
      const response: LoginResponse = await AuthService.login(email, password)
      console.log('Risposta API ricevuta:', { hasToken: !!response.token, hasUser: !!response.user })
      
      // Now response is properly typed as LoginResponse
      token.value = response.token
      currentUser.value = response.user
      
      // Salva token e utente in localStorage
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      console.log('Token e utente salvati in localStorage')
      
      // Redirect to home or intended page SOLO dopo successo
      const redirectPath = router.currentRoute.value.query.redirect as string || '/'
      console.log('Login completato con successo, reindirizzamento a:', redirectPath)
      await router.push(redirectPath)
      
      return true
    } catch (err: any) {
      console.error('Login fallito con errore:', err)
      error.value = err.message || 'Email o password non corretti'
      
      // Pulizia completa in caso di errore
      token.value = null
      currentUser.value = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
      console.log('Stato autenticazione pulito dopo errore')
      return false
    } finally {
      loading.value = false
      console.log('Loading completato')
    }
  }
  
  function logout() {
    token.value = null
    currentUser.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }
  
  async function checkAuth() {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    
    console.log('checkAuth: verifico token e utente', { tokenExist: !!savedToken, userExist: !!savedUser })
    
    if (!savedToken) {
      console.log('checkAuth: nessun token trovato in localStorage')
      return false
    }
    
    try {
      // Imposta lo stato dell'autenticazione dai dati salvati localmente
      token.value = savedToken
      
      if (savedUser) {
        console.log('checkAuth: utente trovato in localStorage, non serve chiamare API')
        currentUser.value = JSON.parse(savedUser)
        return true
      }
      
      // Solo se non abbiamo l'utente nel localStorage, lo recuperiamo dall'API
      console.log('checkAuth: token trovato, verifico validità con API')
      const user = await AuthService.getCurrentUser()
      console.log('checkAuth: utente recuperato con successo dall\'API', user)
      currentUser.value = user
      localStorage.setItem('user', JSON.stringify(user))
      return true
    } catch (err) {
      console.error('checkAuth: errore durante la verifica del token', err)
      token.value = null
      currentUser.value = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
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
