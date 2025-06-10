import apiClient from './api.service'

export interface SystemSettings {
  businessName: string
  businessPhone: string
  businessEmail: string
  businessAddress: string
  openingHours: string
  onlineBookingEnabled?: boolean
}

class SettingsService {
  async getSystemSettings(): Promise<SystemSettings> {
    return apiClient.get('/settings/system')
  }
  
  async updateSystemSettings(settings: SystemSettings): Promise<SystemSettings> {
    return apiClient.put('/settings/system', settings)
  }
  
  async getUserSettings(): Promise<any> {
    return apiClient.get('/settings/user')
  }
  
  async updateUserSettings(settings: any): Promise<any> {
    return apiClient.put('/settings/user', settings)
  }
}

export default new SettingsService()
