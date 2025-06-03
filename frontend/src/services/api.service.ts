import axios from 'axios'

// Crea un'istanza di axios con la configurazione base
const apiClient = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor per aggiungere il token di autenticazione alle richieste
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

// Interceptor per gestire gli errori di risposta
apiClient.interceptors.response.use(
  response => {
    return response.data
  }, 
  error => {
    // Gestione errore 401 (token scaduto o non valido)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    
    const errorMsg = 
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      'Si è verificato un errore'
    
    return Promise.reject(new Error(errorMsg))
  }
)

export default apiClient
