import apiClient from './api.service'
import { LoginResponse, RegisterResponse, User } from '@/types/api'

class AuthService {
  async login(email: string, password: string): Promise<LoginResponse> {
    return apiClient.post('/auth/login', { email, password })
  }
  
  async register(userData: any): Promise<RegisterResponse> {
    return apiClient.post('/auth/register', userData)
  }
  
  async getCurrentUser(): Promise<User> {
    return apiClient.get('/auth/me')
  }
  
  async updatePassword(oldPassword: string, newPassword: string) {
    return apiClient.post('/auth/update-password', { oldPassword, newPassword })
  }
  
  async requestPasswordReset(email: string) {
    return apiClient.post('/auth/forgot-password', { email })
  }
  
  async resetPassword(token: string, newPassword: string) {
    return apiClient.post('/auth/reset-password', { token, newPassword })
  }
}

export default new AuthService()
