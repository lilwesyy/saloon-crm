import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import ClientiService from '../services/clienti.service'

export interface Cliente {
  _id: string;
  nome: string;
  cognome: string;
  email: string;
  telefono: string;
  dataNascita?: Date;
  indirizzo?: {
    via?: string;
    citta?: string;
    cap?: string;
    provincia?: string;
  };
  note?: string;
  consensoPrivacy: boolean;
  consensoMarketing: boolean;
  fotoProfilo?: string;
  classificazione: 'nuovo' | 'attivo' | 'fedele' | 'inattivo';
  ultimaVisita?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const useClientiStore = defineStore('clienti', () => {
  // State
  const clienti = ref<Cliente[]>([])
  const clienteSelezionato = ref<Cliente | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Getters
  const getClienteById = computed(() => {
    return (id: string) => clienti.value.find(c => c._id === id) || null
  })
  
  const clientiOrdinati = computed(() => {
    return [...clienti.value].sort((a, b) => 
      a.cognome.localeCompare(b.cognome) || a.nome.localeCompare(b.nome)
    )
  })

  const clientiPerClassificazione = computed(() => {
    const result = {
      nuovo: [] as Cliente[],
      attivo: [] as Cliente[],
      fedele: [] as Cliente[],
      inattivo: [] as Cliente[]
    };
    
    clienti.value.forEach(cliente => {
      result[cliente.classificazione].push(cliente);
    });
    
    return result;
  })
  
  // Actions
  async function fetchClienti() {
    loading.value = true
    error.value = null
    
    try {
      const response = await ClientiService.getAll()
      clienti.value = response.clienti
    } catch (err: any) {
      error.value = err.message || 'Errore durante il recupero dei clienti'
    } finally {
      loading.value = false
    }
  }
  
  async function fetchClienteById(id: string) {
    loading.value = true
    error.value = null
    
    try {
      clienteSelezionato.value = await ClientiService.getById(id)
      return clienteSelezionato.value
    } catch (err: any) {
      error.value = err.message || 'Errore durante il recupero del cliente'
      return null
    } finally {
      loading.value = false
    }
  }
  
  async function createCliente(cliente: Omit<Cliente, '_id' | 'createdAt' | 'updatedAt'>) {
    loading.value = true
    error.value = null
    
    try {
      const nuovoCliente = await ClientiService.create(cliente)
      clienti.value.push(nuovoCliente)
      return nuovoCliente
    } catch (err: any) {
      error.value = err.message || 'Errore durante la creazione del cliente'
      return null
    } finally {
      loading.value = false
    }
  }
  
  async function updateCliente(id: string, data: Partial<Cliente>) {
    loading.value = true
    error.value = null
    
    try {
      const clienteAggiornato = await ClientiService.update(id, data)
      
      // Aggiorna la lista dei clienti
      const index = clienti.value.findIndex(c => c._id === id)
      if (index !== -1) {
        clienti.value[index] = clienteAggiornato
      }
      
      // Aggiorna il cliente selezionato se è quello modificato
      if (clienteSelezionato.value && clienteSelezionato.value._id === id) {
        clienteSelezionato.value = clienteAggiornato
      }
      
      return clienteAggiornato
    } catch (err: any) {
      error.value = err.message || 'Errore durante l\'aggiornamento del cliente'
      return null
    } finally {
      loading.value = false
    }
  }
  
  async function deleteCliente(id: string) {
    loading.value = true
    error.value = null
    
    try {
      await ClientiService.delete(id)
      
      // Rimuovi dalla lista
      clienti.value = clienti.value.filter(c => c._id !== id)
      
      // Resetta il cliente selezionato se è quello eliminato
      if (clienteSelezionato.value && clienteSelezionato.value._id === id) {
        clienteSelezionato.value = null
      }
      
      return true
    } catch (err: any) {
      error.value = err.message || 'Errore durante l\'eliminazione del cliente'
      return false
    } finally {
      loading.value = false
    }
  }

  async function uploadFoto(id: string, file: File) {
    loading.value = true
    error.value = null
    
    try {
      const result = await ClientiService.uploadFoto(id, file)
      
      // Aggiorna il percorso della foto nel cliente
      const index = clienti.value.findIndex(c => c._id === id)
      if (index !== -1) {
        clienti.value[index].fotoProfilo = result.fotoProfilo
      }
      
      // Aggiorna il cliente selezionato se è quello modificato
      if (clienteSelezionato.value && clienteSelezionato.value._id === id) {
        clienteSelezionato.value.fotoProfilo = result.fotoProfilo
      }
      
      return result.fotoProfilo
    } catch (err: any) {
      error.value = err.message || 'Errore durante il caricamento della foto'
      return null
    } finally {
      loading.value = false
    }
  }

  async function searchClienti(query: string) {
    loading.value = true
    error.value = null
    
    try {
      return await ClientiService.search(query)
    } catch (err: any) {
      error.value = err.message || 'Errore durante la ricerca dei clienti'
      return []
    } finally {
      loading.value = false
    }
  }
  
  return {
    // State
    clienti,
    clienteSelezionato,
    loading,
    error,
    
    // Getters
    getClienteById,
    clientiOrdinati,
    clientiPerClassificazione,
    
    // Actions
    fetchClienti,
    fetchClienteById,
    createCliente,
    updateCliente,
    deleteCliente,
    uploadFoto,
    searchClienti
  }
})
