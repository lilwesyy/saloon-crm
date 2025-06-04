import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import appuntamentiService, { 
  type Appuntamento, 
  type CreateAppuntamentoData, 
  type UpdateAppuntamentoData 
} from '../services/appuntamenti.service'

export const useAppuntamentiStore = defineStore('appuntamenti', () => {
  // State
  const appuntamenti = ref<Appuntamento[]>([])
  const currentAppuntamento = ref<Appuntamento | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    current: 1,
    pages: 1,
    total: 0
  })

  // Getters
  const totalAppuntamenti = computed(() => appuntamenti.value.length)
  
  const appuntamentiOggi = computed(() => {
    const oggi = new Date().toISOString().split('T')[0]
    return appuntamenti.value.filter(app => {
      const dataApp = new Date(app.dataOraInizio).toISOString().split('T')[0]
      return dataApp === oggi && app.stato !== 'cancellato'
    })
  })

  const appuntamentiByStato = computed(() => {
    return appuntamenti.value.reduce((acc, app) => {
      if (!acc[app.stato]) {
        acc[app.stato] = []
      }
      acc[app.stato].push(app)
      return acc
    }, {} as Record<string, Appuntamento[]>)
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
    console.error('Errore store appuntamenti:', message)
  }

  // Fetch all appointments with optional filters
  const fetchAppuntamenti = async (params?: {
    data?: string
    dataInizio?: string
    dataFine?: string
    stato?: string
    cliente?: string
    operatore?: string
    page?: number
    limit?: number
  }) => {
    setLoading(true)
    clearError()
    
    try {
      const response = await appuntamentiService.getAppuntamenti(params)
      appuntamenti.value = response.appuntamenti
      pagination.value = response.pagination
      return response.appuntamenti
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Errore nel caricamento degli appuntamenti'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Fetch appointments for a specific date
  const fetchAppuntamentiByDate = async (data: string) => {
    return await fetchAppuntamenti({ data })
  }

  // Fetch appointments for date range
  const fetchAppuntamentiByDateRange = async (dataInizio: string, dataFine: string) => {
    return await fetchAppuntamenti({ dataInizio, dataFine })
  }

  // Fetch single appointment by ID
  const fetchAppuntamento = async (id: string) => {
    setLoading(true)
    clearError()
    
    try {
      const appuntamento = await appuntamentiService.getAppuntamentoById(id)
      currentAppuntamento.value = appuntamento
      return appuntamento
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Errore nel caricamento dell\'appuntamento'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Create new appointment
  const createAppuntamento = async (data: CreateAppuntamentoData) => {
    setLoading(true)
    clearError()
    
    try {
      const nuovoAppuntamento = await appuntamentiService.createAppuntamento(data)
      appuntamenti.value.push(nuovoAppuntamento)
      return nuovoAppuntamento
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Errore nella creazione dell\'appuntamento'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Update appointment
  const updateAppuntamento = async (id: string, data: UpdateAppuntamentoData) => {
    setLoading(true)
    clearError()
    
    try {
      const appuntamentoAggiornato = await appuntamentiService.updateAppuntamento(id, data)
      const index = appuntamenti.value.findIndex(app => app._id === id)
      if (index !== -1) {
        appuntamenti.value[index] = appuntamentoAggiornato
      }
      if (currentAppuntamento.value?._id === id) {
        currentAppuntamento.value = appuntamentoAggiornato
      }
      return appuntamentoAggiornato
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Errore nell\'aggiornamento dell\'appuntamento'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Delete appointment
  const deleteAppuntamento = async (id: string) => {
    setLoading(true)
    clearError()
    
    try {
      await appuntamentiService.deleteAppuntamento(id)
      appuntamenti.value = appuntamenti.value.filter(app => app._id !== id)
      if (currentAppuntamento.value?._id === id) {
        currentAppuntamento.value = null
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Errore nell\'eliminazione dell\'appuntamento'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Update appointment status only
  const updateStatoAppuntamento = async (id: string, stato: string) => {
    setLoading(true)
    clearError()
    
    try {
      const appuntamentoAggiornato = await appuntamentiService.updateStatoAppuntamento(id, stato)
      const index = appuntamenti.value.findIndex(app => app._id === id)
      if (index !== -1) {
        appuntamenti.value[index] = appuntamentoAggiornato
      }
      return appuntamentoAggiornato
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Errore nell\'aggiornamento dello stato'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Get calendar appointments (grouped by day)
  const fetchAppuntamentiCalendario = async (anno: number, mese: number) => {
    setLoading(true)
    clearError()
    
    try {
      const calendario = await appuntamentiService.getAppuntamentiCalendario(anno, mese)
      return calendario
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Errore nel caricamento del calendario'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Register payment for appointment
  const registraPagamento = async (id: string, data: {
    metodo: string
    importo: number
    stato: string
  }) => {
    setLoading(true)
    clearError()
    
    try {
      const appuntamentoAggiornato = await appuntamentiService.registraPagamento(id, data)
      const index = appuntamenti.value.findIndex(app => app._id === id)
      if (index !== -1) {
        appuntamenti.value[index] = appuntamentoAggiornato
      }
      return appuntamentoAggiornato
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Errore nella registrazione del pagamento'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Reset store state
  const resetStore = () => {
    appuntamenti.value = []
    currentAppuntamento.value = null
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
    appuntamenti,
    currentAppuntamento,
    loading,
    error,
    pagination,
    
    // Getters
    totalAppuntamenti,
    appuntamentiOggi,
    appuntamentiByStato,
    
    // Actions
    clearError,
    setLoading,
    setError,
    fetchAppuntamenti,
    fetchAppuntamentiByDate,
    fetchAppuntamentiByDateRange,
    fetchAppuntamento,
    createAppuntamento,
    updateAppuntamento,
    deleteAppuntamento,
    updateStatoAppuntamento,
    fetchAppuntamentiCalendario,
    registraPagamento,
    resetStore
  }
})
