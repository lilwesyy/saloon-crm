import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import campagneService, { 
  type Campagna, 
  type CreateCampagnaData, 
  type UpdateCampagnaData,
  type CampagnaFilters 
} from '../services/campagne.service'

export const useCampagneStore = defineStore('campagne', () => {
  // State
  const campagne = ref<Campagna[]>([])
  const currentCampagna = ref<Campagna | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    current: 1,
    pages: 1,
    total: 0
  })

  // Getters
  const totaleCampagne = computed(() => campagne.value.length)
  
  const campagneAttive = computed(() => {
    return campagne.value.filter(campagna => campagna.stato === 'in_corso').length
  })
  
  const campagneByStato = computed(() => {
    return (stato: string) => campagne.value.filter(campagna => campagna.stato === stato)
  })
  
  const campagneByTipo = computed(() => {
    return (tipo: string) => campagne.value.filter(campagna => campagna.tipo === tipo)
  })

  // Actions
  const clearError = () => {
    error.value = null
  }

  const setLoading = (value: boolean) => {
    loading.value = value
  }

  const setError = (message: string) => {
    error.value = message
  }

  const fetchCampagne = async (filters?: CampagnaFilters) => {
    setLoading(true)
    clearError()
    
    try {
      const response = await campagneService.getAll(filters)
      campagne.value = response.campagne
      pagination.value = response.pagination
      return response
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Errore durante il recupero delle campagne'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const fetchCampagnaById = async (id: string) => {
    setLoading(true)
    clearError()
    
    try {
      const campagna = await campagneService.getById(id)
      currentCampagna.value = campagna
      return campagna
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Errore durante il recupero della campagna'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const createCampagna = async (data: CreateCampagnaData) => {
    setLoading(true)
    clearError()
    
    try {
      const nuovaCampagna = await campagneService.create(data)
      campagne.value.unshift(nuovaCampagna)
      return nuovaCampagna
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Errore durante la creazione della campagna'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateCampagna = async (id: string, data: UpdateCampagnaData) => {
    setLoading(true)
    clearError()
    
    try {
      const campagnaAggiornata = await campagneService.update(id, data)
      const index = campagne.value.findIndex(camp => camp._id === id)
      if (index !== -1) {
        campagne.value[index] = campagnaAggiornata
      }
      if (currentCampagna.value?._id === id) {
        currentCampagna.value = campagnaAggiornata
      }
      return campagnaAggiornata
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Errore durante l\'aggiornamento della campagna'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteCampagna = async (id: string) => {
    setLoading(true)
    clearError()
    
    try {
      await campagneService.delete(id)
      campagne.value = campagne.value.filter(camp => camp._id !== id)
      if (currentCampagna.value?._id === id) {
        currentCampagna.value = null
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Errore durante l\'eliminazione della campagna'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const lanciaCampagna = async (id: string) => {
    setLoading(true)
    clearError()
    
    try {
      const risultato = await campagneService.lancia(id)
      const index = campagne.value.findIndex(camp => camp._id === id)
      if (index !== -1) {
        campagne.value[index].stato = 'in_corso'
      }
      return risultato
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Errore durante il lancio della campagna'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const sospendiCampagna = async (id: string) => {
    setLoading(true)
    clearError()
    
    try {
      const campagnaSospesa = await campagneService.sospendi(id)
      const index = campagne.value.findIndex(camp => camp._id === id)
      if (index !== -1) {
        campagne.value[index] = campagnaSospesa
      }
      return campagnaSospesa
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Errore durante la sospensione della campagna'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const duplicaCampagna = async (id: string) => {
    setLoading(true)
    clearError()
    
    try {
      const campagnaDuplicata = await campagneService.duplica(id)
      campagne.value.unshift(campagnaDuplicata)
      return campagnaDuplicata
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Errore durante la duplicazione della campagna'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const testCampagna = async (id: string, emailTest: string) => {
    setLoading(true)
    clearError()
    
    try {
      const risultato = await campagneService.test(id, emailTest)
      return risultato
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Errore durante il test della campagna'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const fetchStatistiche = async () => {
    setLoading(true)
    clearError()
    
    try {
      const statistiche = await campagneService.getStatistiche()
      return statistiche
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Errore durante il recupero delle statistiche'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const fetchClientiTarget = async (id: string) => {
    setLoading(true)
    clearError()
    
    try {
      const clienti = await campagneService.getClientiTarget(id)
      return clienti
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Errore durante il recupero dei clienti target'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Reset store state
  const resetStore = () => {
    campagne.value = []
    currentCampagna.value = null
    loading.value = false
    error.value = null
    pagination.value = {
      current: 1,
      pages: 1,
      total: 0
    }
  }

  return {
    // State
    campagne,
    currentCampagna,
    loading,
    error,
    pagination,
    
    // Getters
    totaleCampagne,
    campagneAttive,
    campagneByStato,
    campagneByTipo,
    
    // Actions
    clearError,
    setLoading,
    setError,
    fetchCampagne,
    fetchCampagnaById,
    createCampagna,
    updateCampagna,
    deleteCampagna,
    lanciaCampagna,
    sospendiCampagna,
    duplicaCampagna,
    testCampagna,
    fetchStatistiche,
    fetchClientiTarget,
    resetStore
  }
})
