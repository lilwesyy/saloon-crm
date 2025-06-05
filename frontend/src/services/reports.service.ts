import apiClient from './api.service'

export interface ReportsStats {
  fatturato: number
  appuntamenti: number
  nuoviClienti: number
  ticketMedio: number
}

export interface TopServizio {
  _id: string
  nome: string
  count: number
  fatturato: number
}

export interface AndamentoMensile {
  mese: string
  fatturato: number
  appuntamenti: number
}

export interface TopCliente {
  _id: string
  nome: string
  cognome: string
  email: string
  appuntamenti: number
  spesaTotale: number
  ultimaVisita: string
}

export interface ReportsData {
  stats: ReportsStats
  topServizi: TopServizio[]
  andamentoMensile: AndamentoMensile[]
  topClienti: TopCliente[]
  periodo: {
    dataInizio: string
    dataFine: string
  }
}

class ReportsService {
  private readonly baseUrl = 'reports'

  // Ottiene i dati dei reports per un periodo specifico
  async getReportsData(dataInizio: string, dataFine: string): Promise<ReportsData> {
    const response: ReportsData = await apiClient.get(this.baseUrl, {
      params: {
        dataInizio,
        dataFine
      }
    })
    return response
  }

  // Esporta i reports in formato CSV
  async exportReport(dataInizio: string, dataFine: string): Promise<Blob> {
    const response = await apiClient.get(`${this.baseUrl}/export`, {
      params: {
        dataInizio,
        dataFine
      },
      responseType: 'blob'
    })
    return response.data
  }

  // Scarica il file CSV
  downloadCSV(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }
}

export default new ReportsService()
