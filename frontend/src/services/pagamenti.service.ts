import { createApiClient } from './api.service'

const apiClient = createApiClient('pagamenti')

export interface Pagamento {
  _id: string
  cliente: {
    _id: string
    nome: string
    cognome: string
    telefono?: string
    email?: string
  }
  servizio?: {
    _id: string
    nome: string
    prezzo: number
    durata: number
  }
  importo: number
  metodo: 'contanti' | 'carta' | 'bonifico' | 'assegno' | 'altro'
  tipo: 'servizio' | 'prodotto' | 'abbonamento' | 'altro'
  stato: 'completato' | 'rimborsato' | 'annullato'
  dataPagamento: string
  note?: string
  createdBy?: string
  createdAt: string
  updatedAt: string
}

export interface CreatePagamentoData {
  cliente: string
  servizio?: string
  importo: number
  metodo: 'contanti' | 'carta' | 'bonifico' | 'assegno' | 'altro'
  tipo: 'servizio' | 'prodotto' | 'abbonamento' | 'altro'
  stato?: 'completato' | 'rimborsato' | 'annullato'
  dataPagamento?: string
  note?: string
}

export type UpdatePagamentoData = Partial<CreatePagamentoData>

export interface PagamentiFilters {
  startDate?: string
  endDate?: string
  metodo?: string
  tipo?: string
  stato?: string
  page?: number
  limit?: number
}

export interface PagamentiResponse {
  pagamenti?: Pagamento[]
  pagination?: {
    current: number
    pages: number
    total: number
  }
}

export interface StatsOverview {
  totale: number
  totaleMese: number
  perMetodo: Array<{ _id: string; total: number }>
  perTipo: Array<{ _id: string; total: number }>
  mese: {
    nome: string
    anno: number
  }
}

export interface StatsMensili {
  anno: number
  data: Array<{
    mese: number
    nome: string
    totale: number
    pagamenti: number
  }>
}

class PagamentiService {
  async getPagamenti(filters?: PagamentiFilters): Promise<Pagamento[]> {
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
  
  async getPagamentoById(id: string): Promise<Pagamento> {
    return apiClient.get(`/${id}`)
  }
  
  async createPagamento(data: CreatePagamentoData): Promise<Pagamento> {
    return apiClient.post('', data)
  }
  
  async updatePagamento(id: string, data: UpdatePagamentoData): Promise<Pagamento> {
    return apiClient.put(`/${id}`, data)
  }
  
  async deletePagamento(id: string): Promise<void> {
    return apiClient.delete(`/${id}`)
  }
  
  async getPagamentiByCliente(clienteId: string): Promise<Pagamento[]> {
    return apiClient.get(`/cliente/${clienteId}`)
  }
  
  async getStatsOverview(): Promise<StatsOverview> {
    return apiClient.get('/stats/overview')
  }
  
  async getStatsMensili(anno?: number): Promise<StatsMensili> {
    const params = anno ? `?anno=${anno}` : ''
    return apiClient.get(`/stats/mensili${params}`)
  }
  
  async rimborsaPagamento(id: string, motivo: string, importo?: number): Promise<Pagamento> {
    return apiClient.post(`/${id}/rimborso`, { motivo, importo })
  }
  
  async refundPagamento(id: string, data: { motivo: string; importo?: number }): Promise<Pagamento> {
    return apiClient.post(`/${id}/rimborso`, data)
  }
}

export default new PagamentiService()
