import apiClient from './api.service'
import { Cliente } from '@/stores/clienti'

class ClientiService {
  async getAll(): Promise<Cliente[]> {
    return apiClient.get('/clienti')
  }
  
  async getById(id: string): Promise<Cliente> {
    return apiClient.get(`/clienti/${id}`)
  }
  
  async create(cliente: Omit<Cliente, '_id' | 'createdAt' | 'updatedAt'>): Promise<Cliente> {
    return apiClient.post('/clienti', cliente)
  }
  
  async update(id: string, data: Partial<Cliente>): Promise<Cliente> {
    return apiClient.put(`/clienti/${id}`, data)
  }
  
  async delete(id: string): Promise<void> {
    return apiClient.delete(`/clienti/${id}`)
  }
  
  async search(query: string): Promise<Cliente[]> {
    return apiClient.get(`/clienti/search?q=${encodeURIComponent(query)}`)
  }
  
  async uploadFoto(id: string, file: File): Promise<{ fotoProfilo: string }> {
    const formData = new FormData()
    formData.append('foto', file)
    
    return apiClient.post(`/clienti/${id}/foto`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

export default new ClientiService()
