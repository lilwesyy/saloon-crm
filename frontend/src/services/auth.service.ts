import apiClient from './api.service'
import { User } from '@/stores/auth'

class AuthService {
  async login(email: string, password: string) {
    return apiClient.post('/auth/login', { email, password })
  }
  
  async register(userData: any) {
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
