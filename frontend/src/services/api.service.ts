import axios, { AxiosResponse } from 'axios'

// Create a custom axios instance with proper typing
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
  (response: AxiosResponse): any => {
    return response.data
  }, 
  error => {
    // Gestione errore 401 (token scaduto o non valido)
    if (error.response && error.response.status === 401) {
      const currentPath = window.location.pathname
      const publicRoutes = ['/', '/home', '/prenotazione-online', '/prenotazione']
      const isPublicRoute = publicRoutes.some(route => currentPath.startsWith(route))
      
      // Non fare redirect automatico per rotte pubbliche o pagina di login
      if (!window.location.pathname.includes('/login') && !isPublicRoute) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }
    
    const errorMsg = 
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      'Si è verificato un errore'
    
    return Promise.reject(new Error(errorMsg))
  }
)

export default apiClient

// Create namespaced API clients for specific resources
export const createApiClient = (endpoint: string) => {
  const client = axios.create({
    baseURL: `${process.env.VUE_APP_API_URL || 'http://localhost:3000/api'}/${endpoint}`,
    headers: {
      'Content-Type': 'application/json'
    }
  })
  
  // Set up interceptors (define them explicitly instead of trying to copy)
  client.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  }, error => {
    return Promise.reject(error)
  })
  
  client.interceptors.response.use(
    (response: AxiosResponse): any => {
      return response.data
    }, 
    error => {
      // Gestione errore 401 (token scaduto o non valido)
      if (error.response && error.response.status === 401) {
        const currentPath = window.location.pathname
        const publicRoutes = ['/', '/home', '/prenotazione-online', '/prenotazione']
        const isPublicRoute = publicRoutes.some(route => currentPath.startsWith(route))
        
        // Non fare redirect automatico per rotte pubbliche o pagina di login
        if (!window.location.pathname.includes('/login') && !isPublicRoute) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          window.location.href = '/login'
        }
      }
      
      const errorMsg = 
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        'Si è verificato un errore'
      
      return Promise.reject(new Error(errorMsg))
    }
  )
  
  return client
}
