import apiClient from './api.service'

export interface ProgrammaFedelta {
  _id: string
  cliente: {
    _id: string
    nome: string
    cognome: string
    email: string
    telefono: string
    dataNascita?: string
  }
  punti: number
  puntiTotaliGuadagnati: number
  puntiUtilizzati: number
  livello: 'bronzo' | 'argento' | 'oro' | 'platino'
  attivo: boolean
  movimenti: Movimento[]
  premiUtilizzati: Premio[]
  statistiche: {
    ultimoGuadagno?: string
    ultimoUtilizzo?: string
    mediaGuadagnoMensile: number
    appuntamentiTotali: number
    spesaTotale: number
  }
  createdAt: string
  updatedAt: string
}

export interface Movimento {
  _id?: string
  tipo: 'guadagno' | 'utilizzo' | 'scadenza' | 'bonus' | 'rettifica'
  punti: number
  descrizione: string
  appuntamento?: string
  data: string
}

export interface Premio {
  _id?: string
  nome: string
  puntiUtilizzati: number
  dataUtilizzo: string
  appuntamento?: string
}

export interface CreateProgrammaFedeltaData {
  cliente: string
  punti?: number
  livello?: 'bronzo' | 'argento' | 'oro' | 'platino'
  attivo?: boolean
}

export interface UpdateProgrammaFedeltaData {
  punti?: number
  livello?: 'bronzo' | 'argento' | 'oro' | 'platino'
  attivo?: boolean
}

export interface AggiungiPuntiData {
  punti: number
  descrizione: string
  appuntamento?: string
}

export interface RiscattaPuntiData {
  punti: number
  descrizione: string
  nomePremio?: string
}

export interface ProgrammaFedeltaFilters {
  page?: number
  limit?: number
  cliente?: string
  livello?: string
  stato?: string
}

export interface ProgrammaFedeltaResponse {
  programmi: ProgrammaFedelta[]
  currentPage: number
  totalPages: number
  totalItems: number
}

export interface ProgrammaFedeltaStatistiche {
  totalPrograms: number
  totalMembers: number
  totalRewards: number
  totalPointsIssued: number
  averagePointsPerMember: number
  monthlyGrowth: number
}

class ProgrammaFedeltaService {
  async getAll(filters?: ProgrammaFedeltaFilters): Promise<ProgrammaFedeltaResponse> {
    const params = new URLSearchParams()
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString())
        }
      })
    }
    
    const queryString = params.toString()
    const url = queryString ? `/programma-fedelta?${queryString}` : '/programma-fedelta'
    
    return apiClient.get(url)
  }
  
  async getById(id: string): Promise<ProgrammaFedelta> {
    return apiClient.get(`/programma-fedelta/${id}`)
  }
  
  async getByCliente(clienteId: string): Promise<ProgrammaFedelta> {
    return apiClient.get(`/programma-fedelta/cliente/${clienteId}`)
  }
  
  async create(data: CreateProgrammaFedeltaData): Promise<ProgrammaFedelta> {
    return apiClient.post('/programma-fedelta', data)
  }
  
  async update(id: string, data: UpdateProgrammaFedeltaData): Promise<ProgrammaFedelta> {
    return apiClient.put(`/programma-fedelta/${id}`, data)
  }
  
  async delete(id: string): Promise<void> {
    return apiClient.delete(`/programma-fedelta/${id}`)
  }
  
  async aggiungiPunti(id: string, data: AggiungiPuntiData): Promise<ProgrammaFedelta> {
    return apiClient.post(`/programma-fedelta/${id}/aggiungi-punti`, data)
  }
  
  async riscattaPunti(id: string, data: RiscattaPuntiData): Promise<ProgrammaFedelta> {
    return apiClient.post(`/programma-fedelta/${id}/riscatta-punti`, data)
  }
  
  async sincronizzaPunti(clienteId: string): Promise<ProgrammaFedelta> {
    return apiClient.post(`/programma-fedelta/cliente/${clienteId}/sincronizza`)
  }
  
  async getStatistiche(): Promise<ProgrammaFedeltaStatistiche> {
    return apiClient.get('/programma-fedelta/statistiche')
  }
}

export default new ProgrammaFedeltaService()
