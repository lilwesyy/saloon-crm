import apiClient from './api.service'
import { Cliente } from '@/stores/clienti'

interface PaginationOptions {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

interface SearchFilters {
  nome?: string;
  cognome?: string;
  email?: string;
  telefono?: string;
  citta?: string;
  classificazione?: 'nuovo' | 'attivo' | 'fedele' | 'inattivo' | 'tutti';
  consensoPrivacy?: boolean;
  consensoMarketing?: boolean;
  dataNascitaInizio?: Date | string;
  dataNascitaFine?: Date | string;
  creatoDopoData?: Date | string;
  ultimaVisitaPrimaDi?: Date | string;
}

interface PaginatedResponse<T> {
  clienti: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

interface StatisticheClienti {
  totale: number;
  perClassificazione: Record<string, number>;
  conConsensoMarketing: number;
  nuoviUltimoMese: number;
}

class ClientiService {
  async getAll(options?: PaginationOptions): Promise<PaginatedResponse<Cliente>> {
    const params = new URLSearchParams();
    
    if (options) {
      if (options.page) params.append('page', options.page.toString());
      if (options.limit) params.append('limit', options.limit.toString());
      if (options.sort) params.append('sort', options.sort);
      if (options.order) params.append('order', options.order);
    }
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return apiClient.get(`/clienti${queryString}`);
  }
  
  async getById(id: string): Promise<Cliente> {
    return apiClient.get(`/clienti/${id}`);
  }
  
  async create(cliente: Omit<Cliente, '_id' | 'createdAt' | 'updatedAt'>): Promise<Cliente> {
    return apiClient.post('/clienti', cliente);
  }
  
  async update(id: string, data: Partial<Cliente>): Promise<Cliente> {
    return apiClient.put(`/clienti/${id}`, data);
  }
  
  async delete(id: string): Promise<void> {
    return apiClient.delete(`/clienti/${id}`);
  }
  
  async search(query: string): Promise<Cliente[]> {
    return apiClient.get(`/clienti/search?q=${encodeURIComponent(query)}`);
  }
  
  async searchAdvanced(filters: SearchFilters, options?: PaginationOptions): Promise<PaginatedResponse<Cliente>> {
    const params = new URLSearchParams();
    
    // Aggiungi filtri
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    // Aggiungi opzioni di paginazione
    if (options) {
      if (options.page) params.append('page', options.page.toString());
      if (options.limit) params.append('limit', options.limit.toString());
      if (options.sort) params.append('sort', options.sort);
      if (options.order) params.append('order', options.order);
    }
    
    return apiClient.get(`/clienti/search/advanced?${params.toString()}`);
  }
  
  async uploadFoto(id: string, file: File): Promise<{ fotoProfilo: string }> {
    const formData = new FormData();
    formData.append('foto', file);
    
    return apiClient.post(`/clienti/${id}/foto`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
  
  async getStatistiche(): Promise<StatisticheClienti> {
    return apiClient.get('/clienti/statistiche');
  }
}

export default new ClientiService();
