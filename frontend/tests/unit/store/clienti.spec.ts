import { setActivePinia, createPinia } from 'pinia'
import { useClientiStore } from '@/stores/clienti'
import ClientiService from '@/services/clienti.service'

// Mock the ClientiService
jest.mock('@/services/clienti.service', () => ({
  getAll: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  uploadFoto: jest.fn(),
  search: jest.fn()
}))

describe('Clienti Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('should initialize with default values', () => {
    const store = useClientiStore()
    expect(store.clienti).toEqual([])
    expect(store.clienteSelezionato).toBeNull()
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  describe('fetchClienti', () => {
    it('should set clienti when API call succeeds', async () => {
      const mockClienti = [
        { 
          _id: '1', 
          nome: 'Mario', 
          cognome: 'Rossi', 
          email: 'mario@example.com',
          telefono: '123456789',
          consensoPrivacy: true,
          classificazione: 'attivo',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        { 
          _id: '2', 
          nome: 'Luigi', 
          cognome: 'Verdi', 
          email: 'luigi@example.com',
          telefono: '987654321',
          consensoPrivacy: true,
          classificazione: 'nuovo',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
      
      // Mock getAll success
      ClientiService.getAll.mockResolvedValue({ clienti: mockClienti })
      
      const store = useClientiStore()
      await store.fetchClienti()
      
      expect(ClientiService.getAll).toHaveBeenCalled()
      expect(store.clienti).toEqual(mockClienti)
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })

    it('should set error when API call fails', async () => {
      // Mock getAll failure
      const errorMsg = 'Failed to fetch clients'
      ClientiService.getAll.mockRejectedValue(new Error(errorMsg))
      
      const store = useClientiStore()
      await store.fetchClienti()
      
      expect(ClientiService.getAll).toHaveBeenCalled()
      expect(store.clienti).toEqual([])
      expect(store.loading).toBe(false)
      expect(store.error).toBe(errorMsg)
    })
  })

  describe('fetchClienteById', () => {
    it('should set clienteSelezionato when API call succeeds', async () => {
      const mockCliente = { 
        _id: '1', 
        nome: 'Mario', 
        cognome: 'Rossi', 
        email: 'mario@example.com',
        telefono: '123456789',
        consensoPrivacy: true,
        classificazione: 'attivo',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      // Mock getById success
      ClientiService.getById.mockResolvedValue(mockCliente)
      
      const store = useClientiStore()
      await store.fetchClienteById('1')
      
      expect(ClientiService.getById).toHaveBeenCalledWith('1')
      expect(store.clienteSelezionato).toEqual(mockCliente)
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })

    it('should set error when API call fails', async () => {
      // Mock getById failure
      const errorMsg = 'Cliente non trovato'
      ClientiService.getById.mockRejectedValue(new Error(errorMsg))
      
      const store = useClientiStore()
      await store.fetchClienteById('999')
      
      expect(ClientiService.getById).toHaveBeenCalledWith('999')
      expect(store.clienteSelezionato).toBeNull()
      expect(store.loading).toBe(false)
      expect(store.error).toBe(errorMsg)
    })
  })

  describe('createCliente', () => {
    it('should add new cliente when API call succeeds', async () => {
      const newClienteData = { 
        nome: 'Mario', 
        cognome: 'Rossi', 
        email: 'mario@example.com',
        telefono: '123456789',
        consensoPrivacy: true,
        classificazione: 'nuovo'
      }
      
      const createdCliente = {
        _id: '1',
        ...newClienteData,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      // Mock create success
      ClientiService.create.mockResolvedValue(createdCliente)
      
      const store = useClientiStore()
      // Set initial clienti array
      store.$patch({ clienti: [] })
      
      const result = await store.createCliente(newClienteData)
      
      expect(ClientiService.create).toHaveBeenCalledWith(newClienteData)
      expect(store.clienti).toContainEqual(createdCliente)
      expect(result).toEqual(createdCliente)
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })

    it('should set error when API call fails', async () => {
      const newClienteData = { 
        nome: '', // Invalid data
        cognome: 'Rossi', 
        email: 'mario@example.com',
        telefono: '123456789',
        consensoPrivacy: true,
        classificazione: 'nuovo'
      }
      
      // Mock create failure
      const errorMsg = 'Dati cliente non validi'
      ClientiService.create.mockRejectedValue(new Error(errorMsg))
      
      const store = useClientiStore()
      
      try {
        await store.createCliente(newClienteData)
        fail('Should have thrown an error')
      } catch (err) {
        expect(ClientiService.create).toHaveBeenCalledWith(newClienteData)
        expect(store.loading).toBe(false)
        expect(store.error).toBe(errorMsg)
      }
    })
  })

  describe('getters', () => {
    it('getClienteById should return correct cliente', () => {
      const mockClienti = [
        { _id: '1', nome: 'Mario', cognome: 'Rossi' } as any,
        { _id: '2', nome: 'Luigi', cognome: 'Verdi' } as any
      ]
      
      const store = useClientiStore()
      store.$patch({ clienti: mockClienti })
      
      expect(store.getClienteById.value('1')).toEqual(mockClienti[0])
      expect(store.getClienteById.value('2')).toEqual(mockClienti[1])
      expect(store.getClienteById.value('3')).toBeNull()
    })

    it('clientiOrdinati should return clients sorted by cognome and nome', () => {
      const mockClienti = [
        { _id: '1', nome: 'Mario', cognome: 'Bianchi' } as any,
        { _id: '2', nome: 'Luigi', cognome: 'Rossi' } as any,
        { _id: '3', nome: 'Anna', cognome: 'Rossi' } as any
      ]
      
      const store = useClientiStore()
      store.$patch({ clienti: mockClienti })
      
      const result = store.clientiOrdinati.value
      
      // Should be sorted by cognome first, then by nome
      expect(result[0]).toEqual(mockClienti[0]) // Bianchi
      expect(result[1]).toEqual(mockClienti[2]) // Rossi, Anna
      expect(result[2]).toEqual(mockClienti[1]) // Rossi, Luigi
    })

    it('clientiPerClassificazione should group clients by classification', () => {
      const mockClienti = [
        { _id: '1', nome: 'Mario', cognome: 'Rossi', classificazione: 'attivo' } as any,
        { _id: '2', nome: 'Luigi', cognome: 'Verdi', classificazione: 'nuovo' } as any,
        { _id: '3', nome: 'Anna', cognome: 'Bianchi', classificazione: 'fedele' } as any,
        { _id: '4', nome: 'Giulia', cognome: 'Neri', classificazione: 'attivo' } as any
      ]
      
      const store = useClientiStore()
      store.$patch({ clienti: mockClienti })
      
      const result = store.clientiPerClassificazione.value
      
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
