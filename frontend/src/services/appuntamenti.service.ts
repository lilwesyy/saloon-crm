import apiClient from './api.service'

export interface Appuntamento {
  _id: string
  cliente: {
    _id: string
    nome: string
    cognome: string
    email?: string
    telefono?: string
  }
  servizi: Array<{
    servizio: {
      _id: string
      nome: string
      durata: number
      prezzo: number
    }
    prezzo: number
  }>
  operatore: {
    _id: string
    nome: string
    cognome: string
  }
  dataOraInizio: string
  dataOraFine: string
  sala?: string
  stato: 'prenotato' | 'confermato' | 'completato' | 'cancellato' | 'noshow'
  note?: string
  pagamento?: {
    stato: 'non_pagato' | 'parziale' | 'completato'
    metodo?: string
    importo?: number
    dataOra?: string
  }
  createdAt: string
  updatedAt: string
}

export interface AppuntamentiResponse {
  appuntamenti: Appuntamento[]
  pagination: {
    current: number
    pages: number
    total: number
  }
}

export interface CreateAppuntamentoData {
  cliente: string
  servizi: Array<{
    servizio: string
    prezzo: number
  }>
  operatore: string
  dataOraInizio: string
  dataOraFine: string
  sala?: string
  note?: string
}

export interface UpdateAppuntamentoData extends Partial<CreateAppuntamentoData> {
  stato?: 'prenotato' | 'confermato' | 'completato' | 'cancellato' | 'noshow'
}

class AppuntamentiService {
  private readonly baseUrl = '/api/appuntamenti'

  // Ottiene tutti gli appuntamenti con filtri opzionali
  async getAppuntamenti(params?: {
    data?: string
    dataInizio?: string
    dataFine?: string
    stato?: string
    cliente?: string
    operatore?: string
    page?: number
    limit?: number
  }): Promise<AppuntamentiResponse> {
    const response: AppuntamentiResponse = await apiClient.get(this.baseUrl, { params })
    return response
  }

  // Ottiene un appuntamento specifico tramite ID
  async getAppuntamentoById(id: string): Promise<Appuntamento> {
    const response: Appuntamento = await apiClient.get(`${this.baseUrl}/${id}`)
    return response
  }

  // Crea un nuovo appuntamento
  async createAppuntamento(data: CreateAppuntamentoData): Promise<Appuntamento> {
    const response: Appuntamento = await apiClient.post(this.baseUrl, data)
    return response
  }

  // Modifica un appuntamento esistente
  async updateAppuntamento(id: string, data: UpdateAppuntamentoData): Promise<Appuntamento> {
    const response: Appuntamento = await apiClient.put(`${this.baseUrl}/${id}`, data)
    return response
  }

  // Elimina un appuntamento
  async deleteAppuntamento(id: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`)
  }

  // Aggiorna solo lo stato di un appuntamento
  async updateStatoAppuntamento(id: string, stato: string): Promise<Appuntamento> {
    const response: Appuntamento = await apiClient.put(`${this.baseUrl}/${id}/stato`, { stato })
    return response
  }

  // Ottiene appuntamenti per il calendario (raggruppati per giorno)
  async getAppuntamentiCalendario(anno: number, mese: number): Promise<Record<string, Appuntamento[]>> {
    const response: Record<string, Appuntamento[]> = await apiClient.get(`${this.baseUrl}/calendario/${anno}/${mese}`)
    return response
  }

  // Ottiene appuntamenti per operatore
  async getAppuntamentiByOperatore(operatoreId: string, params?: {
    dataInizio?: string
    dataFine?: string
    stato?: string
    page?: number
    limit?: number
  }): Promise<AppuntamentiResponse> {
    const response: AppuntamentiResponse = await apiClient.get(`${this.baseUrl}/operatore/${operatoreId}`, { params })
    return response
  }

  // Registra un pagamento per un appuntamento
  async registraPagamento(id: string, data: {
    metodo: string
    importo: number
    stato: string
  }): Promise<Appuntamento> {
    const response: Appuntamento = await apiClient.post(`${this.baseUrl}/${id}/pagamento`, data)
    return response
  }
}

export default new AppuntamentiService()
