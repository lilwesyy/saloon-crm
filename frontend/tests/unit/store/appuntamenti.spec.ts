import { setActivePinia, createPinia } from 'pinia'
import { useAppuntamentiStore } from '@/stores/appuntamenti'
import appuntamentiService from '@/services/appuntamenti.service'

// Mock the appuntamenti service
jest.mock('@/services/appuntamenti.service', () => ({
  getAll: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  updateStato: jest.fn(),
  getCalendario: jest.fn(),
  registraPagamento: jest.fn()
}))

describe('Appuntamenti Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('should initialize with default values', () => {
    const store = useAppuntamentiStore()
    expect(store.appuntamenti).toEqual([])
    expect(store.currentAppuntamento).toBeNull()
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
    expect(store.pagination).toEqual({ current: 1, pages: 1, total: 0 })
  })

  describe('fetchAppuntamenti', () => {
    it('should set appuntamenti and pagination when API call succeeds', async () => {
      const mockAppuntamenti = [
        { _id: '1', dataOraInizio: '2023-08-01T10:00:00Z' },
        { _id: '2', dataOraInizio: '2023-08-01T11:00:00Z' }
      ]
      
      const mockResponse = {
        appuntamenti: mockAppuntamenti,
        pagination: {
          current: 1,
          pages: 1,
          total: 2
        }
      }
      
      // Mock getAll success
      appuntamentiService.getAll.mockResolvedValue(mockResponse)
      
      const store = useAppuntamentiStore()
      await store.fetchAppuntamenti()
      
      expect(appuntamentiService.getAll).toHaveBeenCalled()
      expect(store.appuntamenti).toEqual(mockAppuntamenti)
      expect(store.pagination).toEqual(mockResponse.pagination)
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })

    it('should set error when API call fails', async () => {
      // Mock getAll failure
      const errorMsg = 'Failed to fetch appointments'
      appuntamentiService.getAll.mockRejectedValue(new Error(errorMsg))
      
      const store = useAppuntamentiStore()
      
      try {
        await store.fetchAppuntamenti()
        fail('Should have thrown an error')
      } catch (err) {
        expect(appuntamentiService.getAll).toHaveBeenCalled()
        expect(store.loading).toBe(false)
        expect(store.error).toBe(errorMsg)
      }
    })
  })

  describe('fetchAppuntamentiByDate', () => {
    it('should set appuntamenti for specific date when API call succeeds', async () => {
      const mockDate = '2023-08-01'
      const mockAppuntamenti = [
        { _id: '1', dataOraInizio: '2023-08-01T10:00:00Z' },
        { _id: '2', dataOraInizio: '2023-08-01T11:00:00Z' }
      ]
      
      const mockResponse = {
        appuntamenti: mockAppuntamenti,
        pagination: {
          current: 1,
          pages: 1,
          total: 2
        }
      }
      
      // Mock getAll success with date filter
      appuntamentiService.getAll.mockResolvedValue(mockResponse)
      
      const store = useAppuntamentiStore()
      await store.fetchAppuntamentiByDate(mockDate)
      
      expect(appuntamentiService.getAll).toHaveBeenCalledWith({ data: mockDate })
      expect(store.appuntamenti).toEqual(mockAppuntamenti)
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })
  })

  describe('updateStatoAppuntamento', () => {
    it('should update appointment status when API call succeeds', async () => {
      const mockAppuntamentoId = '1'
      const mockNewStatus = 'confermato'
      
      const mockAppuntamentoUpdated = {
        _id: mockAppuntamentoId,
        stato: mockNewStatus,
        dataOraInizio: '2023-08-01T10:00:00Z'
      }
      
      // Set initial appuntamenti array with the appointment to update
      const initialAppuntamenti = [
        { _id: mockAppuntamentoId, stato: 'prenotato', dataOraInizio: '2023-08-01T10:00:00Z' },
        { _id: '2', stato: 'prenotato', dataOraInizio: '2023-08-01T11:00:00Z' }
      ]
      
      // Mock updateStato success
      appuntamentiService.updateStato.mockResolvedValue(mockAppuntamentoUpdated)
      
      const store = useAppuntamentiStore()
      store.$patch({ appuntamenti: initialAppuntamenti })
      
      await store.updateStatoAppuntamento(mockAppuntamentoId, mockNewStatus)
      
      expect(appuntamentiService.updateStato).toHaveBeenCalledWith(mockAppuntamentoId, { stato: mockNewStatus })
      
      // The specific appointment should have been updated
      const updatedAppuntamento = store.appuntamenti.find(app => app._id === mockAppuntamentoId)
      expect(updatedAppuntamento?.stato).toBe(mockNewStatus)
      
      // The other appointment should remain unchanged
      const unchangedAppuntamento = store.appuntamenti.find(app => app._id === '2')
      expect(unchangedAppuntamento?.stato).toBe('prenotato')
    })

    it('should set error when API call fails', async () => {
      const mockAppuntamentoId = '1'
      const mockNewStatus = 'confermato'
      
      // Mock updateStato failure
      const errorMsg = 'Could not update appointment status'
      appuntamentiService.updateStato.mockRejectedValue(new Error(errorMsg))
      
      const store = useAppuntamentiStore()
      
      try {
        await store.updateStatoAppuntamento(mockAppuntamentoId, mockNewStatus)
        fail('Should have thrown an error')
      } catch (err) {
        expect(appuntamentiService.updateStato).toHaveBeenCalledWith(mockAppuntamentoId, { stato: mockNewStatus })
        expect(store.loading).toBe(false)
        expect(store.error).toBe(errorMsg)
      }
    })
  })

  describe('getters', () => {
    it('totalAppuntamenti should return the total count', () => {
      const mockAppuntamenti = [
        { _id: '1', dataOraInizio: '2023-08-01T10:00:00Z' },
        { _id: '2', dataOraInizio: '2023-08-01T11:00:00Z' }
      ]
      
      const store = useAppuntamentiStore()
      store.$patch({ appuntamenti: mockAppuntamenti })
      
      expect(store.totalAppuntamenti.value).toBe(2)
    })

    it('appuntamentiOggi should return today\'s appointments', () => {
      // Create a date object for today
      const today = new Date()
      const todayStr = today.toISOString().split('T')[0]
      
      // Create mock appointments with dates
      const mockAppuntamenti = [
        { _id: '1', dataOraInizio: `${todayStr}T10:00:00Z` }, // today
        { _id: '2', dataOraInizio: `${todayStr}T14:00:00Z` }, // today
        { _id: '3', dataOraInizio: '2023-01-01T10:00:00Z' }   // not today
      ]
      
      const store = useAppuntamentiStore()
      store.$patch({ appuntamenti: mockAppuntamenti })
      
      expect(store.appuntamentiOggi.value.length).toBe(2)
      expect(store.appuntamentiOggi.value[0]._id).toBe('1')
      expect(store.appuntamentiOggi.value[1]._id).toBe('2')
    })

    it('appuntamentiByStato should group appointments by status', () => {
      const mockAppuntamenti = [
        { _id: '1', stato: 'prenotato', dataOraInizio: '2023-08-01T10:00:00Z' },
        { _id: '2', stato: 'confermato', dataOraInizio: '2023-08-01T11:00:00Z' },
        { _id: '3', stato: 'prenotato', dataOraInizio: '2023-08-01T12:00:00Z' },
        { _id: '4', stato: 'completato', dataOraInizio: '2023-08-01T13:00:00Z' }
      ]
      
      const store = useAppuntamentiStore()
      store.$patch({ appuntamenti: mockAppuntamenti })
      
      const result = store.appuntamentiByStato.value
      
      expect(result.prenotato).toHaveLength(2)
      expect(result.confermato).toHaveLength(1)
      expect(result.completato).toHaveLength(1)
      expect(result.annullato).toHaveLength(0)
      
      expect(result.prenotato).toContainEqual(mockAppuntamenti[0])
      expect(result.prenotato).toContainEqual(mockAppuntamenti[2])
      expect(result.confermato).toContainEqual(mockAppuntamenti[1])
      expect(result.completato).toContainEqual(mockAppuntamenti[3])
    })
  })

  describe('resetStore', () => {
    it('should reset all store values to defaults', () => {
      const store = useAppuntamentiStore()
      
      // Modify store values
      store.$patch({
        appuntamenti: [{ _id: '1' }],
        currentAppuntamento: { _id: '1' },
        loading: true,
        error: 'Some error',
        pagination: { current: 2, pages: 5, total: 23 }
      })
      
      // Reset the store
      store.resetStore()
      
      // Verify values were reset
      expect(store.appuntamenti).toEqual([])
      expect(store.currentAppuntamento).toBeNull()
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
      expect(store.pagination).toEqual({ current: 1, pages: 1, total: 0 })
    })
  })
})
