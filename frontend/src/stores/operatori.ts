import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import operatoriService, { type Operatore } from '../services/operatori.service'

export const useOperatoriStore = defineStore('operatori', () => {
  // State
  const operatori = ref<Operatore[]>([])
  const operatoreSelezionato = ref<Operatore | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Getters
  const getOperatoreById = computed(() => {
    return (id: string) => {
      if (!operatori.value || !Array.isArray(operatori.value)) return null
      return operatori.value.find(o => o._id === id) || null
    }
  })
  
  const operatoriOrdinati = computed(() => {
    if (!operatori.value || !Array.isArray(operatori.value)) return []
    return [...operatori.value].sort((a, b) => 
      a.cognome.localeCompare(b.cognome) || a.nome.localeCompare(b.nome)
    )
  })

  const operatoriAttivi = computed(() => {
    if (!operatori.value || !Array.isArray(operatori.value)) return []
    return operatori.value.filter(operatore => operatore.attivo === true)
  })

  const totalOperatori = computed(() => {
    if (!operatori.value || !Array.isArray(operatori.value)) return 0
    return operatori.value.length
  })
  
  // Actions
  async function fetchOperatori() {
    loading.value = true
    error.value = null
    
    try {
      const response = await operatoriService.getAllOperatori()
      operatori.value = response.users
    } catch (err: any) {
      error.value = err.message || 'Errore durante il recupero degli operatori'
    } finally {
      loading.value = false
    }
  }
  
  async function fetchOperatoriAttivi() {
    loading.value = true
    error.value = null
    
    try {
      const operatoriAttiviData = await operatoriService.getActiveOperatori()
      operatori.value = operatoriAttiviData
      return operatoriAttiviData
    } catch (err: any) {
      error.value = err.message || 'Errore durante il recupero degli operatori attivi'
      return []
    } finally {
      loading.value = false
    }
  }
  
  async function fetchOperatoreById(id: string) {
    loading.value = true
    error.value = null
    
    try {
      operatoreSelezionato.value = await operatoriService.getOperatoreById(id)
      return operatoreSelezionato.value
    } catch (err: any) {
      error.value = err.message || 'Errore durante il recupero del operatore'
      return null
    } finally {
      loading.value = false
    }
  }
  
  async function createOperatore(operatore: any) {
    loading.value = true
    error.value = null
    
    try {
      const nuovoOperatore = await operatoriService.createOperatore(operatore)
      operatori.value.push(nuovoOperatore)
      return nuovoOperatore
    } catch (err: any) {
      error.value = err.message || 'Errore durante la creazione del operatore'
      return null
    } finally {
      loading.value = false
    }
  }
  
  async function updateOperatore(id: string, data: any) {
    loading.value = true
    error.value = null
    
    try {
      const operatoreAggiornato = await operatoriService.updateOperatore(id, data)
      
      // Aggiorna nella lista
      const index = operatori.value.findIndex(o => o._id === id)
      if (index !== -1) {
        operatori.value[index] = operatoreAggiornato
      }
      
      // Aggiorna il operatore selezionato se è quello modificato
      if (operatoreSelezionato.value && operatoreSelezionato.value._id === id) {
        operatoreSelezionato.value = operatoreAggiornato
      }
      
      return operatoreAggiornato
    } catch (err: any) {
      error.value = err.message || 'Errore durante l\'aggiornamento del operatore'
      return null
    } finally {
      loading.value = false
    }
  }
  
  async function deleteOperatore(id: string) {
    loading.value = true
    error.value = null
    
    try {
      await operatoriService.deleteOperatore(id)
      
      // Rimuovi dalla lista
      operatori.value = operatori.value.filter(o => o._id !== id)
      
      // Resetta il operatore selezionato se è quello eliminato
      if (operatoreSelezionato.value && operatoreSelezionato.value._id === id) {
        operatoreSelezionato.value = null
      }
      
      return true
    } catch (err: any) {
      error.value = err.message || 'Errore durante l\'eliminazione del operatore'
      return false
    } finally {
      loading.value = false
    }
  }

  async function toggleOperatoreAttivo(id: string) {
    loading.value = true
    error.value = null
    
    try {
      const operatoreAggiornato = await operatoriService.toggleOperatoreStatus(id)
      
      // Aggiorna nella lista
      const index = operatori.value.findIndex(o => o._id === id)
      if (index !== -1) {
        operatori.value[index] = operatoreAggiornato
      }
      
      return operatoreAggiornato
    } catch (err: any) {
      error.value = err.message || 'Errore durante l\'aggiornamento dello stato del operatore'
      return null
    } finally {
      loading.value = false
    }
  }
  
  async function fetchOperatoriDisponibili() {
    loading.value = true
    error.value = null
    
    try {
      const operatoriDisponibili = await operatoriService.getOperatoriDisponibili()
      // Update the main array with available operators
      operatori.value = operatoriDisponibili
      return operatoriDisponibili
    } catch (err: any) {
      error.value = err.message || 'Errore durante il recupero degli operatori disponibili'
      return []
    } finally {
      loading.value = false
    }
  }
  
  return {
    // State
    operatori,
    operatoreSelezionato,
    loading,
    error,
    
    // Getters
    getOperatoreById,
    operatoriOrdinati,
    operatoriAttivi,
    totalOperatori,
    
    // Actions
    fetchOperatori,
    fetchOperatoriAttivi,
    fetchOperatoreById,
    createOperatore,
    updateOperatore,
    deleteOperatore,
    toggleOperatoreAttivo,
    fetchOperatoriDisponibili
  }
})
