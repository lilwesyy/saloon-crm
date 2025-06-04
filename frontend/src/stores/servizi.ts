import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import serviziService, { type Servizio } from '../services/servizi.service'

export const useServiziStore = defineStore('servizi', () => {
  // State
  const servizi = ref<Servizio[]>([])
  const servizioSelezionato = ref<Servizio | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Getters
  const getServizioById = computed(() => {
    return (id: string) => servizi.value.find(s => s._id === id) || null
  })
  
  const serviziOrdinati = computed(() => {
    return [...servizi.value].sort((a, b) => 
      a.categoria.localeCompare(b.categoria) || a.nome.localeCompare(b.nome)
    )
  })

  const serviziAttivi = computed(() => {
    return servizi.value.filter(servizio => servizio.attivo === true)
  })

  const serviziPerCategoria = computed(() => {
    const result: Record<string, Servizio[]> = {}
    servizi.value.forEach(servizio => {
      const categoria = servizio.categoria || 'Altri'
      if (!result[categoria]) {
        result[categoria] = []
      }
      result[categoria].push(servizio)
    })
    return result
  })

  const categorie = computed(() => {
    const cats = new Set(servizi.value.map(s => s.categoria || 'Altri'))
    return Array.from(cats).sort()
  })
  
  // Utility functions
  const clearError = () => {
    error.value = null
  }
  
  const setLoading = (value: boolean) => {
    loading.value = value
  }
  
  const setError = (message: string) => {
    error.value = message
  }
  
  // Actions
  const fetchServizi = async () => {
    setLoading(true)
    clearError()
    
    try {
      const response = await serviziService.getAllServizi()
      servizi.value = response
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Errore durante il caricamento dei servizi'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const fetchServizio = async (id: string) => {
    setLoading(true)
    clearError()
    
    try {
      const servizio = await serviziService.getServizioById(id)
      servizioSelezionato.value = servizio
      
      // Aggiorna anche nella lista se presente
      const index = servizi.value.findIndex(s => s._id === id)
      if (index !== -1) {
        servizi.value[index] = servizio
      } else {
        servizi.value.push(servizio)
      }
      
      return servizio
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Errore durante il caricamento del servizio'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const createServizio = async (data: Omit<Servizio, '_id'>) => {
    setLoading(true)
    clearError()
    
    try {
      const nuovoServizio = await serviziService.createServizio(data)
      servizi.value.push(nuovoServizio)
      return nuovoServizio
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Errore durante la creazione del servizio'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateServizio = async (id: string, data: Partial<Servizio>) => {
    setLoading(true)
    clearError()
    
    try {
      const servizioAggiornato = await serviziService.updateServizio(id, data)
      
      // Aggiorna nella lista
      const index = servizi.value.findIndex(s => s._id === id)
      if (index !== -1) {
        servizi.value[index] = servizioAggiornato
      }
      
      // Aggiorna il servizio selezionato se corrisponde
      if (servizioSelezionato.value && servizioSelezionato.value._id === id) {
        servizioSelezionato.value = servizioAggiornato
      }
      
      return servizioAggiornato
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Errore durante l\'aggiornamento del servizio'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteServizio = async (id: string) => {
    setLoading(true)
    clearError()
    
    try {
      await serviziService.deleteServizio(id)
      
      // Rimuovi dalla lista
      servizi.value = servizi.value.filter(s => s._id !== id)
      
      // Resetta il servizio selezionato se è quello eliminato
      if (servizioSelezionato.value && servizioSelezionato.value._id === id) {
        servizioSelezionato.value = null
      }
      
      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Errore durante l\'eliminazione del servizio'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const toggleServizioAttivo = async (id: string, attivo: boolean) => {
    setLoading(true)
    clearError()
    
    try {
      const servizioAggiornato = await serviziService.toggleServizioAttivo(id, attivo)
      
      // Aggiorna nella lista
      const index = servizi.value.findIndex(s => s._id === id)
      if (index !== -1) {
        servizi.value[index] = servizioAggiornato
      }
      
      // Aggiorna il servizio selezionato se corrisponde
      if (servizioSelezionato.value && servizioSelezionato.value._id === id) {
        servizioSelezionato.value = servizioAggiornato
      }
      
      return servizioAggiornato
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Errore durante il cambio di stato del servizio'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const fetchServiziByCategoria = async (categoria: string) => {
    setLoading(true)
    clearError()
    
    try {
      const response = await serviziService.getServiziByCategoria(categoria)
      return response
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Errore durante il caricamento dei servizi per categoria'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Reset store state
  const resetStore = () => {
    servizi.value = []
    servizioSelezionato.value = null
    loading.value = false
    error.value = null
  }

  return {
    // State
    servizi,
    servizioSelezionato,
    loading,
    error,
    
    // Getters
    getServizioById,
    serviziOrdinati,
    serviziAttivi,
    serviziPerCategoria,
    categorie,
    
    // Actions
    clearError,
    setLoading,
    setError,
    fetchServizi,
    fetchServizio,
    createServizio,
    updateServizio,
    deleteServizio,
    toggleServizioAttivo,
    fetchServiziByCategoria,
    resetStore
  }
})
