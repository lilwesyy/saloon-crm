import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import programmaFedeltaService, { 
  type ProgrammaFedelta, 
  type CreateProgrammaFedeltaData, 
  type UpdateProgrammaFedeltaData,
  type ProgrammaFedeltaFilters,
  type AggiungiPuntiData,
  type RiscattaPuntiData
} from '../services/programmaFedelta.service'

export const useProgrammaFedeltaStore = defineStore('programmaFedelta', () => {
  // State
  const programmi = ref<ProgrammaFedelta[]>([])
  const currentProgramma = ref<ProgrammaFedelta | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const statistics = ref<any>(null)
  const pagination = ref({
    current: 1,
    pages: 1,
    total: 0
  })

  // Getters
  const totaleProgrammi = computed(() => programmi.value.length)
  
  const programmiByLivello = computed(() => {
    return (livello: string) => programmi.value.filter(programma => programma.livello === livello)
  })
  
  const programmiByStato = computed(() => {
    return (attivo: boolean) => programmi.value.filter(programma => programma.attivo === attivo)
  })

  const programmiAttivi = computed(() => {
    return programmi.value.filter(programma => programma.attivo === true).length
  })

  const totalePuntiDistribuiti = computed(() => {
    return programmi.value.reduce((total, programma) => total + programma.puntiTotaliGuadagnati, 0)
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

  const fetchProgrammi = async (filters?: ProgrammaFedeltaFilters) => {
    setLoading(true)
    clearError()
    
    try {
      const response = await programmaFedeltaService.getAll(filters)
      programmi.value = response.programmi
      pagination.value = {
        current: response.currentPage,
        pages: response.totalPages,
        total: response.totalItems
      }
      return response
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Errore durante il recupero dei programmi fedeltà'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const fetchProgrammaById = async (id: string) => {
    setLoading(true)
    clearError()
    
    try {
      const programma = await programmaFedeltaService.getById(id)
      currentProgramma.value = programma
      return programma
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Errore durante il recupero del programma fedeltà'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const fetchProgrammaByCliente = async (clienteId: string) => {
    setLoading(true)
    clearError()
    
    try {
      const programma = await programmaFedeltaService.getByCliente(clienteId)
      currentProgramma.value = programma
      return programma
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Errore durante il recupero del programma fedeltà del cliente'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const createProgramma = async (data: CreateProgrammaFedeltaData) => {
    setLoading(true)
    clearError()
    
    try {
      const nuovoProgramma = await programmaFedeltaService.create(data)
      programmi.value.unshift(nuovoProgramma)
      return nuovoProgramma
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Errore durante la creazione del programma fedeltà'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateProgramma = async (id: string, data: UpdateProgrammaFedeltaData) => {
    setLoading(true)
    clearError()
    
    try {
      const programmaAggiornato = await programmaFedeltaService.update(id, data)
      const index = programmi.value.findIndex(prog => prog._id === id)
      if (index !== -1) {
        programmi.value[index] = programmaAggiornato
      }
      if (currentProgramma.value?._id === id) {
        currentProgramma.value = programmaAggiornato
      }
      return programmaAggiornato
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Errore durante l\'aggiornamento del programma fedeltà'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteProgramma = async (id: string) => {
    setLoading(true)
    clearError()
    
    try {
      await programmaFedeltaService.delete(id)
      programmi.value = programmi.value.filter(prog => prog._id !== id)
      if (currentProgramma.value?._id === id) {
        currentProgramma.value = null
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Errore durante l\'eliminazione del programma fedeltà'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const aggiungiPunti = async (id: string, data: AggiungiPuntiData) => {
    setLoading(true)
    clearError()
    
    try {
      const programmaAggiornato = await programmaFedeltaService.aggiungiPunti(id, data)
      const index = programmi.value.findIndex(prog => prog._id === id)
      if (index !== -1) {
        programmi.value[index] = programmaAggiornato
      }
      if (currentProgramma.value?._id === id) {
        currentProgramma.value = programmaAggiornato
      }
      return programmaAggiornato
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Errore durante l\'aggiunta dei punti'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const riscattaPunti = async (id: string, data: RiscattaPuntiData) => {
    setLoading(true)
    clearError()
    
    try {
      const programmaAggiornato = await programmaFedeltaService.riscattaPunti(id, data)
      const index = programmi.value.findIndex(prog => prog._id === id)
      if (index !== -1) {
        programmi.value[index] = programmaAggiornato
      }
      if (currentProgramma.value?._id === id) {
        currentProgramma.value = programmaAggiornato
      }
      return programmaAggiornato
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Errore durante il riscatto dei punti'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const sincronizzaPunti = async (clienteId: string) => {
    setLoading(true)
    clearError()
    
    try {
      const programmaAggiornato = await programmaFedeltaService.sincronizzaPunti(clienteId)
      const index = programmi.value.findIndex(prog => prog.cliente._id === clienteId)
      if (index !== -1) {
        programmi.value[index] = programmaAggiornato
      }
      if (currentProgramma.value?.cliente._id === clienteId) {
        currentProgramma.value = programmaAggiornato
      }
      return programmaAggiornato
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Errore durante la sincronizzazione dei punti'
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
      const statistiche = await programmaFedeltaService.getStatistiche()
      statistics.value = statistiche
      return statistiche
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Errore durante il recupero delle statistiche'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Alias methods for backward compatibility
  const fetchStatistics = fetchStatistiche
  const getProgramma = fetchProgrammaById
  const getStatisticheProgramma = async (id: string) => {
    // This should fetch specific statistics for a program
    // For now, we'll use the general statistics
    return await fetchStatistiche()
  }
  const getMembriProgramma = async (id: string) => {
    // This should fetch members for a specific program
    // For now, we'll fetch the program and return its related data
    const programma = await fetchProgrammaById(id)
    return programma ? [] : [] // Return empty array for now, implement based on backend
  }
  const disattivaProgramma = async (id: string) => {
    return await updateProgramma(id, { attivo: false })
  }
  const attivaProgramma = async (id: string) => {
    return await updateProgramma(id, { attivo: true })
  }

  // Reset store state
  const resetStore = () => {
    programmi.value = []
    currentProgramma.value = null
    loading.value = false
    error.value = null
    statistics.value = null
    pagination.value = {
      current: 1,
      pages: 1,
      total: 0
    }
  }

  return {
    // State
    programmi,
    currentProgramma,
    loading,
    error,
    statistics,
    pagination,
    
    // Getters
    totaleProgrammi,
    programmiByLivello,
    programmiByStato,
    programmiAttivi,
    totalePuntiDistribuiti,
    
    // Actions
    clearError,
    setLoading,
    setError,
    fetchProgrammi,
    fetchProgrammaById,
    fetchProgrammaByCliente,
    createProgramma,
    updateProgramma,
    deleteProgramma,
    aggiungiPunti,
    riscattaPunti,
    sincronizzaPunti,
    fetchStatistiche,
    resetStore,
    // Alias methods
    fetchStatistics,
    getProgramma,
    getStatisticheProgramma,
    getMembriProgramma,
    disattivaProgramma,
    attivaProgramma
  }
})
