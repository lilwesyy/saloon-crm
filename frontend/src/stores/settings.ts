import { defineStore } from 'pinia'
import { ref } from 'vue'
import settingsService, { SystemSettings } from '@/services/settings.service'

export const useSettingsStore = defineStore('settings', () => {
  // Stato
  const businessName = ref<string>('Centro Estetico CRM')
  const businessPhone = ref<string>('')
  const businessEmail = ref<string>('info@centroestetico.it')
  const businessAddress = ref<string>('')
  const openingHours = ref<string>('')
  const loading = ref<boolean>(false)
  const loaded = ref<boolean>(false)
  const error = ref<string | null>(null)

  // Getters
  const getBusinessName = () => businessName.value
  const getBusinessPhone = () => businessPhone.value
  const getBusinessEmail = () => businessEmail.value
  const getBusinessAddress = () => businessAddress.value
  const getOpeningHours = () => openingHours.value

  // Actions
  async function fetchSystemSettings() {
    if (loaded.value) return
    
    loading.value = true
    error.value = null

    try {
      const settings = await settingsService.getSystemSettings()
      
      // Aggiorna lo stato con i dati ricevuti
      businessName.value = settings.businessName || 'Centro Estetico CRM'
      businessPhone.value = settings.businessPhone || ''
      businessEmail.value = settings.businessEmail || 'info@centroestetico.it'
      businessAddress.value = settings.businessAddress || ''
      openingHours.value = settings.openingHours || ''
      
      loaded.value = true
    } catch (err: any) {
      error.value = err.message || 'Errore durante il caricamento delle impostazioni'
      console.error('Errore nel recupero delle impostazioni di sistema:', err)
    } finally {
      loading.value = false
    }
  }

  async function updateSystemSettings(settings: SystemSettings) {
    loading.value = true
    error.value = null

    try {
      const updated = await settingsService.updateSystemSettings(settings)
      
      // Aggiorna lo stato con i dati aggiornati
      businessName.value = updated.businessName || businessName.value
      businessPhone.value = updated.businessPhone || businessPhone.value
      businessEmail.value = updated.businessEmail || businessEmail.value
      businessAddress.value = updated.businessAddress || businessAddress.value
      openingHours.value = updated.openingHours || openingHours.value
      
      return updated
    } catch (err: any) {
      error.value = err.message || 'Errore durante l\'aggiornamento delle impostazioni'
      console.error('Errore nell\'aggiornamento delle impostazioni di sistema:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Esporta le funzionalità dello store
  return {
    // Stato
    businessName,
    businessPhone,
    businessEmail,
    businessAddress,
    openingHours,
    loading,
    loaded,
    error,
    
    // Getters
    getBusinessName,
    getBusinessPhone,
    getBusinessEmail,
    getBusinessAddress,
    getOpeningHours,
    
    // Actions
    fetchSystemSettings,
    updateSystemSettings
  }
})
