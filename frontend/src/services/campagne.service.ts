import { createApiClient } from './api.service'

const apiClient = createApiClient('campagne')

export interface Campagna {
  _id: string
  nome: string
  descrizione?: string
  tipo: 'email' | 'sms' | 'promozione' | 'compleanno' | 'callback'
  stato: 'bozza' | 'programmata' | 'in_corso' | 'completata' | 'sospesa'
  contenuto: {
    oggetto?: string
    corpo: string
    templateHtml?: string
  }
  segmentazione: {
    tipo: 'tutti' | 'nuovi_clienti' | 'clienti_fedeli' | 'inattivi' | 'compleanni' | 'personalizzato'
    criteri?: any
  }
  programmazione?: {
    tipo: 'immediata' | 'programmata' | 'ricorrente'
    dataInizio?: string
    dataFine?: string
    oraInvio?: string
    ricorrenza?: {
      tipo: 'nessuna' | 'giornaliera' | 'settimanale' | 'mensile' | 'annuale'
      giorni?: number[]
      giornoMese?: number
      giornoAnno?: string
    }
  }
  clientiTarget?: string[]
  statistiche: {
    invii: number
    aperture: number
    click: number
    risposte: number
    conversioni: number
  }
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface CreateCampagnaData {
  nome: string
  descrizione?: string
  tipo: 'email' | 'sms' | 'promozione' | 'compleanno' | 'callback'
  contenuto: {
    oggetto?: string
    corpo: string
    templateHtml?: string
  }
  segmentazione: {
    tipo: 'tutti' | 'nuovi_clienti' | 'clienti_fedeli' | 'inattivi' | 'compleanni' | 'personalizzato'
    criteri?: any
  }
  programmazione?: {
    tipo: 'immediata' | 'programmata' | 'ricorrente'
    dataInizio?: string
    dataFine?: string
    oraInvio?: string
    ricorrenza?: {
      tipo: 'nessuna' | 'giornaliera' | 'settimanale' | 'mensile' | 'annuale'
      giorni?: number[]
      giornoMese?: number
      giornoAnno?: string
    }
  }
  clientiTarget?: string[]
}

export interface UpdateCampagnaData extends Partial<CreateCampagnaData> {
  stato?: 'bozza' | 'programmata' | 'in_corso' | 'completata' | 'sospesa'
}

export interface CampagnaFilters {
  page?: number
  limit?: number
  tipo?: string
  stato?: string
  search?: string
  dataInizio?: string
  dataFine?: string
}

export interface CampagnaResponse {
  campagne: Campagna[]
  pagination: {
    current: number
    pages: number
    total: number
  }
}

export interface CampagnaStatistiche {
  totaleCampagne: number
  campagneAttive: number
  totaleInvii: number
  totaleAperture: number
  totaleClick: number
  totaleRisposte: number
  tassoApertura: number
  tassoClick: number
  tassoRisposta: number
}

export interface ClientiTarget {
  clienti: any[]
  totale: number
}

class CampagneService {
  async getAll(filters?: CampagnaFilters): Promise<CampagnaResponse> {
    const params = new URLSearchParams()
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString())
        }
      })
    }
    
    const queryString = params.toString()
    const url = queryString ? `?${queryString}` : ''
    
    return apiClient.get(url)
  }
  
  async getById(id: string): Promise<Campagna> {
    return apiClient.get(`/${id}`)
  }
  
  async create(data: CreateCampagnaData): Promise<Campagna> {
    return apiClient.post('', data)
  }
  
  async update(id: string, data: UpdateCampagnaData): Promise<Campagna> {
    return apiClient.put(`/${id}`, data)
  }
  
  async delete(id: string): Promise<void> {
    return apiClient.delete(`/${id}`)
  }
  
  async lancia(id: string): Promise<any> {
    return apiClient.post(`/${id}/lancia`)
  }
  
  async sospendi(id: string): Promise<Campagna> {
    return apiClient.patch(`/${id}/sospendi`)
  }
  
  async duplica(id: string): Promise<Campagna> {
    return apiClient.post(`/${id}/duplica`)
  }
  
  async test(id: string, emailTest: string): Promise<any> {
    return apiClient.post(`/${id}/test`, { emailTest })
  }
  
  async getStatistiche(): Promise<CampagnaStatistiche> {
    return apiClient.get('/statistiche')
  }
  
  async getStatisticheCampagna(id: string): Promise<any> {
    return apiClient.get(`/${id}/statistiche`)
  }
  
  async getClientiTarget(id: string): Promise<ClientiTarget> {
    return apiClient.get(`/${id}/clienti-target`)
  }
}

export default new CampagneService()
