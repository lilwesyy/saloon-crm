import apiClient from './api.service'

export interface Operatore {
  _id: string
  nome: string
  cognome: string
  email: string
  telefono?: string
  ruolo: string
  attivo: boolean
  servizi?: string[]
  orariLavoro?: {
    lunedi?: { attivo: boolean; oraInizio: string; oraFine: string }
    martedi?: { attivo: boolean; oraInizio: string; oraFine: string }
    mercoledi?: { attivo: boolean; oraInizio: string; oraFine: string }
    giovedi?: { attivo: boolean; oraInizio: string; oraFine: string }
    venerdi?: { attivo: boolean; oraInizio: string; oraFine: string }
    sabato?: { attivo: boolean; oraInizio: string; oraFine: string }
    domenica?: { attivo: boolean; oraInizio: string; oraFine: string }
  }
  createdAt: string
  updatedAt: string
}

export interface CreateOperatoreRequest {
  nome: string
  cognome: string
  email: string
  password: string
  telefono?: string
  ruolo: string
  attivo?: boolean
  servizi?: string[]
  orariLavoro?: any
}

export interface UpdateOperatoreRequest {
  nome?: string
  cognome?: string
  email?: string
  telefono?: string
  ruolo?: string
  attivo?: boolean
  servizi?: string[]
  orariLavoro?: any
}

export interface OperatoriResponse {
  users: Operatore[]
  pagination: {
    currentPage: number
    itemsPerPage: number
    totalItems: number
    totalPages: number
  }
}

class OperatoriService {
  private baseUrl = '/users'
  private publicBaseUrl = '/prenotazione-online/operatori'

  // Ottiene tutti gli operatori con paginazione e filtri
  async getAllOperatori(params?: {
    page?: number
    limit?: number
    search?: string
    role?: string
    status?: string
  }): Promise<OperatoriResponse> {
    try {
      const response = await apiClient.get(this.baseUrl, { params })
      return response as unknown as OperatoriResponse
    } catch (error) {
      console.error('Errore nel recupero degli operatori:', error)
      throw error
    }
  }

  // Ottiene solo gli operatori attivi (per dropdown e selezioni)
  async getActiveOperatori(): Promise<Operatore[]> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/active`)
      return response as unknown as Operatore[]
    } catch (error) {
      console.error('Errore nel recupero degli operatori attivi:', error)
      throw error
    }
  }

  // Ottiene tutti gli operatori attivi (pubblico, per prenotazione online)
  async getOperatoriDisponibili(): Promise<Operatore[]> {
    try {
      const response = await apiClient.get(this.publicBaseUrl)
      return response as unknown as Operatore[]
    } catch (error) {
      console.error('Errore nel recupero degli operatori disponibili:', error)
      throw error
    }
  }

  // Ottiene un operatore per ID
  async getOperatoreById(id: string): Promise<Operatore> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/${id}`)
      return response as unknown as Operatore
    } catch (error) {
      console.error('Errore nel recupero dell\'operatore:', error)
      throw error
    }
  }

  // Crea un nuovo operatore
  async createOperatore(operatore: CreateOperatoreRequest): Promise<Operatore> {
    try {
      const response = await apiClient.post(this.baseUrl, operatore)
      return response as unknown as Operatore
    } catch (error) {
      console.error('Errore nella creazione dell\'operatore:', error)
      throw error
    }
  }

  // Aggiorna un operatore
  async updateOperatore(id: string, operatore: UpdateOperatoreRequest): Promise<Operatore> {
    try {
      const response = await apiClient.put(`${this.baseUrl}/${id}`, operatore)
      return response as unknown as Operatore
    } catch (error) {
      console.error('Errore nell\'aggiornamento dell\'operatore:', error)
      throw error
    }
  }

  // Cambia lo stato attivo/inattivo di un operatore
  async toggleOperatoreStatus(id: string): Promise<Operatore> {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/${id}/toggle-status`)
      // L'API restituisce { message, user }, quindi estraiamo l'utente
      return (response as any).user as Operatore
    } catch (error) {
      console.error('Errore nel cambio stato dell\'operatore:', error)
      throw error
    }
  }

  // Elimina un operatore
  async deleteOperatore(id: string): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${id}`)
    } catch (error) {
      console.error('Errore nell\'eliminazione dell\'operatore:', error)
      throw error
    }
  }

  // Aggiorna la password di un operatore
  async updateOperatorePassword(id: string, newPassword: string): Promise<void> {
    try {
      await apiClient.patch(`${this.baseUrl}/${id}/password`, { password: newPassword })
    } catch (error) {
      console.error('Errore nell\'aggiornamento della password:', error)
      throw error
    }
  }

  // Ottiene le statistiche degli operatori
  async getOperatoriStats(): Promise<{
    total: number
    active: number
    inactive: number
    byRole: Record<string, number>
  }> {
    try {
      const response = await this.getAllOperatori({ limit: 1000 }) // Get all for stats
      const operatori = response.users
      
      const stats = {
        total: operatori.length,
        active: operatori.filter(op => op.attivo).length,
        inactive: operatori.filter(op => !op.attivo).length,
        byRole: operatori.reduce((acc, op) => {
          acc[op.ruolo] = (acc[op.ruolo] || 0) + 1
          return acc
        }, {} as Record<string, number>)
      }
      
      return stats
    } catch (error) {
      console.error('Errore nel recupero delle statistiche operatori:', error)
      throw error
    }
  }
}

export default new OperatoriService()
