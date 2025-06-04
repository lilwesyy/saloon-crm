import axios from 'axios';

const API_BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000/api';

export interface Servizio {
  _id: string;
  nome: string;
  descrizione: string;
  durata: number;
  prezzo: number;
  categoria: string;
}

export interface Operatore {
  id: string;
  nome: string;
  cognome: string;
}

export interface SlotDisponibile {
  inizio: string;
  fine: string;
  operatore: Operatore;
}

export interface DisponibilitaResponse {
  data: string;
  servizio: {
    id: string;
    nome: string;
    durata: number;
    prezzo: number;
  };
  slotsDisponibili: SlotDisponibile[];
}

export interface DatiCliente {
  nome: string;
  cognome: string;
  email: string;
  telefono: string;
  dataNascita?: string;
}

export interface PrenotazioneRequest {
  cliente: DatiCliente;
  servizioId: string;
  operatoreId: string;
  dataOraInizio: string;
  note?: string;
  consensoPrivacy: boolean;
  consensoMarketing?: boolean;
}

export interface PrenotazioneResponse {
  message: string;
  appuntamento: any;
  numeroPrenotazione: string;
}

class PrenotazioneOnlineService {
  private axiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: `${API_BASE_URL}/prenotazione-online`,
      timeout: 10000,
    });
  }

  // Ottiene i servizi disponibili per la prenotazione online
  async getServiziDisponibili(): Promise<{ servizi: Record<string, Servizio[]>; totale: number }> {
    try {
      const response = await this.axiosInstance.get('/servizi');
      return response.data;
    } catch (error: any) {
      console.error('Errore recupero servizi:', error);
      throw new Error(error.response?.data?.message || 'Errore durante il recupero dei servizi');
    }
  }

  // Ottiene le disponibilità per un servizio in una data specifica
  async getDisponibilita(data: string, servizioId: string, operatoreId?: string): Promise<DisponibilitaResponse> {
    try {
      const params: any = { data, servizioId };
      if (operatoreId) {
        params.operatoreId = operatoreId;
      }

      const response = await this.axiosInstance.get('/disponibilita', { params });
      return response.data;
    } catch (error: any) {
      console.error('Errore recupero disponibilità:', error);
      throw new Error(error.response?.data?.message || 'Errore durante il recupero delle disponibilità');
    }
  }

  // Crea una nuova prenotazione online
  async creaPrenotazione(prenotazione: PrenotazioneRequest): Promise<PrenotazioneResponse> {
    try {
      const response = await this.axiosInstance.post('/', prenotazione);
      return response.data;
    } catch (error: any) {
      console.error('Errore creazione prenotazione:', error);
      if (error.response?.status === 409) {
        throw new Error('Orario non più disponibile. Scegli un altro slot.');
      }
      throw new Error(error.response?.data?.message || 'Errore durante la creazione della prenotazione');
    }
  }

  // Conferma una prenotazione
  async confermaPrenotazione(id: string, token: string): Promise<any> {
    try {
      const response = await this.axiosInstance.put(`/${id}/conferma`, null, {
        params: { token }
      });
      return response.data;
    } catch (error: any) {
      console.error('Errore conferma prenotazione:', error);
      throw new Error(error.response?.data?.message || 'Errore durante la conferma della prenotazione');
    }
  }

  // Cancella una prenotazione
  async cancellaPrenotazione(id: string, token: string, motivoCancellazione?: string): Promise<any> {
    try {
      const response = await this.axiosInstance.delete(`/${id}/cancella`, {
        data: { token, motivoCancellazione }
      });
      return response.data;
    } catch (error: any) {
      console.error('Errore cancellazione prenotazione:', error);
      throw new Error(error.response?.data?.message || 'Errore durante la cancellazione della prenotazione');
    }
  }

  // Formatta data per display
  formatDataOra(dataOra: string): string {
    const data = new Date(dataOra);
    return data.toLocaleString('it-IT', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Formatta prezzo
  formatPrezzo(prezzo: number): string {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(prezzo);
  }

  // Valida email
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Valida telefono
  isValidPhone(telefono: string): boolean {
    const phoneRegex = /^[+]?[0-9\s\-()]{8,15}$/;
    return phoneRegex.test(telefono.replace(/\s/g, ''));
  }
}

export default new PrenotazioneOnlineService();
