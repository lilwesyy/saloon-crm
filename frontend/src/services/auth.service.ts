import apiClient from './api.service'
import { LoginResponse, RegisterResponse, User } from '@/types/api'

class AuthService {
  async login(email: string, password: string): Promise<LoginResponse> {
    return apiClient.post('/api/auth/login', { email, password })
  }
  
  async register(userData: any): Promise<RegisterResponse> {
    return apiClient.post('/api/auth/register', userData)
  }
  
  async getCurrentUser(): Promise<User> {
    return apiClient.get('/api/auth/me')
  }
  
  async updatePassword(oldPassword: string, newPassword: string) {
    return apiClient.post('/api/auth/update-password', { oldPassword, newPassword })
  }
  
  async requestPasswordReset(email: string) {
    return apiClient.post('/api/auth/forgot-password', { email })
  }
  
  async resetPassword(token: string, newPassword: string) {
    return apiClient.post('/api/auth/reset-password', { token, newPassword })
  }
}

export default new AuthService()
