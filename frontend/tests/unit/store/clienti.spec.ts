import { setActivePinia, createPinia } from 'pinia'
import { useClientiStore } from '@/stores/clienti'
import ClientiService from '@/services/clienti.service'

// Mock the ClientiService
jest.mock('@/services/clienti.service', () => ({
  default: {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    uploadFoto: jest.fn(),
    search: jest.fn()
  }
}))

const mockedClientiService = ClientiService as jest.Mocked<typeof ClientiService>

describe('Clienti Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  const mockClienti = [
    { 
      _id: '1', 
      nome: 'Mario', 
      cognome: 'Bianchi', 
      email: 'mario@example.com',
      telefono: '123456789',
      consensoPrivacy: true,
      consensoMarketing: false,
      classificazione: 'attivo' as const,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01')
    },
    { 
      _id: '2', 
      nome: 'Luigi', 
      cognome: 'Rossi', 
      email: 'luigi@example.com',
      telefono: '987654321',
      consensoPrivacy: true,
      consensoMarketing: true,
      classificazione: 'nuovo' as const,
      createdAt: new Date('2023-02-01'),
      updatedAt: new Date('2023-02-01')
    },
    { 
      _id: '3', 
      nome: 'Anna', 
      cognome: 'Rossi', 
      email: 'anna@example.com',
      telefono: '555666777',
      consensoPrivacy: true,
      consensoMarketing: false,
      classificazione: 'fedele' as const,
      createdAt: new Date('2023-03-01'),
      updatedAt: new Date('2023-03-01')
    },
    { 
      _id: '4', 
      nome: 'Giulia', 
      cognome: 'Verdi', 
      email: 'giulia@example.com',
      telefono: '444555666',
      consensoPrivacy: true,
      consensoMarketing: true,
      classificazione: 'attivo' as const,
      createdAt: new Date('2023-04-01'),
      updatedAt: new Date('2023-04-01')
    }
  ]

  it('should initialize with default values', () => {
    const store = useClientiStore()
    expect(store.clienti).toEqual([])
    expect(store.clienteSelezionato).toBeNull()
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  describe('fetchClienti', () => {
    it('should set clienti when API call succeeds', async () => {
      const mockResponse = {
        clienti: mockClienti,
        pagination: {
          total: 4,
          page: 1,
          limit: 50,
          pages: 1
        }
      }
      mockedClientiService.getAll.mockResolvedValue(mockResponse)
      const store = useClientiStore()

      await store.fetchClienti()

      expect(mockedClientiService.getAll).toHaveBeenCalled()
      expect(store.clienti).toEqual(mockClienti)
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })

    it('should set error when API call fails', async () => {
      const errorMsg = 'Network error'
      mockedClientiService.getAll.mockRejectedValue(new Error(errorMsg))
      const store = useClientiStore()

      await store.fetchClienti()

      expect(mockedClientiService.getAll).toHaveBeenCalled()
      expect(store.clienti).toEqual([])
      expect(store.loading).toBe(false)
      expect(store.error).toBe(errorMsg)
    })
  })

  describe('fetchClienteById', () => {
    it('should set clienteSelezionato when API call succeeds', async () => {
      const mockCliente = mockClienti[0]
      mockedClientiService.getById.mockResolvedValue(mockCliente)
      const store = useClientiStore()

      await store.fetchClienteById('1')

      expect(mockedClientiService.getById).toHaveBeenCalledWith('1')
      expect(store.clienteSelezionato).toEqual(mockCliente)
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })

    it('should set error when API call fails', async () => {
      const errorMsg = 'Cliente non trovato'
      mockedClientiService.getById.mockRejectedValue(new Error(errorMsg))
      const store = useClientiStore()

      await store.fetchClienteById('999')

      expect(mockedClientiService.getById).toHaveBeenCalledWith('999')
      expect(store.clienteSelezionato).toBeNull()
      expect(store.loading).toBe(false)
      expect(store.error).toBe(errorMsg)
    })
  })

  describe('createCliente', () => {
    it('should add new cliente when API call succeeds', async () => {
      const newClienteData = {
        nome: 'Marco',
        cognome: 'Neri',
        email: 'marco@example.com',
        telefono: '+39 123 456789',
        consensoPrivacy: true,
        consensoMarketing: false,
        classificazione: 'nuovo' as const
      }
      
      const createdCliente = {
        _id: '5',
        ...newClienteData,
        createdAt: new Date('2023-05-01'),
        updatedAt: new Date('2023-05-01')
      }

      mockedClientiService.create.mockResolvedValue(createdCliente)
      const store = useClientiStore()
      store.clienti = [...mockClienti]

      const result = await store.createCliente(newClienteData)

      expect(mockedClientiService.create).toHaveBeenCalledWith(newClienteData)
      expect(store.clienti).toContainEqual(createdCliente)
      expect(result).toEqual(createdCliente)
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })

    it('should set error when API call fails', async () => {
      const newClienteData = {
        nome: 'Mario',
        cognome: 'Rossi',
        email: 'mario@example.com',
        telefono: '+39 123 456789',
        consensoPrivacy: true,
        consensoMarketing: false,
        classificazione: 'nuovo' as const
      }
      
      const errorMsg = 'Dati cliente non validi'
      mockedClientiService.create.mockRejectedValue(new Error(errorMsg))
      const store = useClientiStore()

      try {
        await store.createCliente(newClienteData)
        fail('Should have thrown an error')
      } catch (error) {
        expect(mockedClientiService.create).toHaveBeenCalledWith(newClienteData)
        expect(store.loading).toBe(false)
        expect(store.error).toBe(errorMsg)
      }
    })
  })

  describe('getters', () => {
    it('getClienteById should return correct cliente', () => {
      const store = useClientiStore()
      store.clienti = mockClienti

      expect(store.getClienteById('1')).toEqual(mockClienti[0])
      expect(store.getClienteById('2')).toEqual(mockClienti[1])
      expect(store.getClienteById('999')).toBeNull()
    })

    it('clientiOrdinati should return clients sorted by cognome and nome', () => {
      const store = useClientiStore()
      store.clienti = mockClienti

      const result = store.clientiOrdinati

      expect(result[0]).toEqual(mockClienti[0]) // Bianchi
      expect(result[1]).toEqual(mockClienti[2]) // Rossi, Anna
      expect(result[2]).toEqual(mockClienti[1]) // Rossi, Luigi
    })

    it('clientiPerClassificazione should group clients by classification', () => {
      const store = useClientiStore()
      store.clienti = mockClienti

      const result = store.clientiPerClassificazione

      expect(result.attivo).toHaveLength(2)
      expect(result.nuovo).toHaveLength(1)
      expect(result.fedele).toHaveLength(1)
      expect(result.inattivo).toHaveLength(0)
      
      expect(result.attivo).toContainEqual(mockClienti[0])
      expect(result.attivo).toContainEqual(mockClienti[3])
      expect(result.nuovo).toContainEqual(mockClienti[1])
      expect(result.fedele).toContainEqual(mockClienti[2])
    })
  })
})
