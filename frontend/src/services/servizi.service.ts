import apiClient from './api.service'

export interface Servizio {
  _id: string
  nome: string
  descrizione: string
  durata: number
  prezzo: number
  categoria: string
  immagine?: string
  attivo: boolean
  prenotabileOnline: boolean
  tempoRecupero: number
  createdAt: string
  updatedAt: string
}

export interface CreateServizioRequest {
  nome: string
  descrizione?: string
  durata: number
  prezzo: number
  categoria: string
  immagine?: string
  prenotabileOnline?: boolean
  tempoRecupero?: number
}

export interface UpdateServizioRequest {
  nome?: string
  descrizione?: string
  durata?: number
  prezzo?: number
  categoria?: string
  immagine?: string
  prenotabileOnline?: boolean
  tempoRecupero?: number
  attivo?: boolean
}

class ServiziService {
  // Ottiene tutti i servizi
  async getAllServizi(): Promise<Servizio[]> {
    try {
      const response = await apiClient.get<Servizio[]>('/servizi')
      console.log('Response from API:', response)
      // Se l'interceptor non funziona, proviamo con response.data
      const data = response.data || response
      console.log('Data to return:', data)
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error('Errore nel recupero dei servizi:', error)
      throw error
    }
  }

  // Ottiene un servizio per ID
  async getServizioById(id: string): Promise<Servizio> {
    try {
      const response = await apiClient.get<Servizio>(`/servizi/${id}`)
      console.log('Response getServizioById:', response)
      // Gestiamo sia response.data che response direttamente
      const data = response.data || (response as any)
      console.log('Data getServizioById:', data)
      return data as Servizio
    } catch (error) {
      console.error('Errore nel recupero del servizio:', error)
      throw error
    }
  }

  // Crea un nuovo servizio
  async createServizio(servizio: CreateServizioRequest): Promise<Servizio> {
    try {
      const response = await apiClient.post<Servizio>('/servizi', servizio)
      return response.data
    } catch (error) {
      console.error('Errore nella creazione del servizio:', error)
      throw error
    }
  }

  // Aggiorna un servizio
  async updateServizio(id: string, servizio: UpdateServizioRequest): Promise<Servizio> {
    try {
      const response = await apiClient.put<Servizio>(`/servizi/${id}`, servizio)
      return response.data
    } catch (error) {
      console.error('Errore nell\'aggiornamento del servizio:', error)
      throw error
    }
  }

  // Elimina un servizio
  async deleteServizio(id: string): Promise<void> {
    try {
      await apiClient.delete(`/servizi/${id}`)
    } catch (error) {
      console.error('Errore nell\'eliminazione del servizio:', error)
      throw error
    }
  }

  // Ottiene servizi per categoria
  async getServiziByCategoria(categoria: string): Promise<Servizio[]> {
    try {
      const response = await apiClient.get<Servizio[]>(`/servizi/categoria/${categoria}`)
      return response.data
    } catch (error) {
      console.error('Errore nel recupero dei servizi per categoria:', error)
      throw error
    }
  }

  // Attiva/disattiva un servizio
  async toggleServizioAttivo(id: string, attivo: boolean): Promise<Servizio> {
    try {
      const response = await apiClient.put<Servizio>(`/servizi/${id}/attivo`, { attivo })
      return response.data
    } catch (error) {
      console.error('Errore nel cambio stato del servizio:', error)
      throw error
    }
  }

  // Ottiene tutte le categorie disponibili
  async getCategorie(): Promise<string[]> {
    try {
      const response = await apiClient.get<string[]>('/servizi/categorie')
      console.log('Response getCategorie:', response)
      // Gestiamo il caso in cui response.data non sia definito
      const data = response.data || response
      console.log('Data getCategorie:', data)
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error('Errore nel recupero delle categorie:', error)
      throw error
    }
  }
}

export default new ServiziService()
