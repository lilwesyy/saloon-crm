import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { setActivePinia, createPinia } from 'pinia';
import { useProgrammaFedeltaStore } from '@/stores/programmaFedelta';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Programma Fedeltà Store', () => {
  let store;
  
  beforeEach(() => {
    // Create a fresh pinia instance for each test
    setActivePinia(createPinia());
    // Get the store instance
    store = useProgrammaFedeltaStore();
    // Reset the state
    store.$reset();
  });
  
  it('initialize with empty state', () => {
    expect(store.programmi).toEqual([]);
    expect(store.currentProgramma).toBe(null);
    expect(store.loading).toBe(false);
    expect(store.error).toBe(null);
  });
  
  it('fetches programmi fedeltà', async () => {
    // Mock API response
    const mockProgrammi = [
      {
        _id: 'p1',
        nome: 'Programma Base',
        puntiPerEuro: 1,
        sogliePunti: [
          { punti: 100, premio: 'Sconto 10%' },
          { punti: 200, premio: 'Servizio gratuito' }
        ]
      },
      {
        _id: 'p2',
        nome: 'Programma Premium',
        puntiPerEuro: 2,
        sogliePunti: [
          { punti: 100, premio: 'Sconto 15%' },
          { punti: 200, premio: 'Prodotto omaggio' }
        ]
      }
    ];
    
    axios.get.mockResolvedValue({ data: mockProgrammi });
    
    // Call the action
    await store.fetchProgrammiFedelta();
    
    // Check the state changes
    expect(store.programmi).toEqual(mockProgrammi);
    expect(store.loading).toBe(false);
    expect(store.error).toBe(null);
    // Check if the correct API endpoint was called
    expect(axios.get).toHaveBeenCalledWith('/api/programma-fedelta');
  });
  
  it('fetches a single programma fedeltà', async () => {
    // Mock API response
    const mockProgramma = {
      _id: 'p1',
      nome: 'Programma Base',
      puntiPerEuro: 1,
      sogliePunti: [
        { punti: 100, premio: 'Sconto 10%' },
        { punti: 200, premio: 'Servizio gratuito' }
      ]
    };
    
    axios.get.mockResolvedValue({ data: mockProgramma });
    
    // Call the action
    await store.fetchProgrammaById('p1');
    
    // Check the state changes
    expect(store.currentProgramma).toEqual(mockProgramma);
    expect(store.loading).toBe(false);
    expect(store.error).toBe(null);
    // Check if the correct API endpoint was called
    expect(axios.get).toHaveBeenCalledWith('/api/programma-fedelta/p1');
  });
  
  it('creates a new programma fedeltà', async () => {
    // Mock API response
    const newProgramma = {
      nome: 'Nuovo Programma',
      puntiPerEuro: 1.5,
      sogliePunti: [
        { punti: 150, premio: 'Sconto 20%' }
      ]
    };
    
    const createdProgramma = {
      _id: 'p3',
      ...newProgramma
    };
    
    axios.post.mockResolvedValue({ data: createdProgramma });
    
    // Call the action
    await store.createProgramma(newProgramma);
    
    // Check if the correct API endpoint was called with the right data
    expect(axios.post).toHaveBeenCalledWith('/api/programma-fedelta', newProgramma);
    // Check if the programma is added to the list
    expect(store.programmi).toContain(createdProgramma);
  });
  
  it('updates an existing programma fedeltà', async () => {
    // Set initial state
    store.programmi = [
      {
        _id: 'p1',
        nome: 'Programma Base',
        puntiPerEuro: 1,
        sogliePunti: [
          { punti: 100, premio: 'Sconto 10%' }
        ]
      }
    ];
    
    // Updated programma
    const updatedProgramma = {
      _id: 'p1',
      nome: 'Programma Base Aggiornato',
      puntiPerEuro: 1.5,
      sogliePunti: [
        { punti: 100, premio: 'Sconto 10%' },
        { punti: 150, premio: 'Nuovo premio' }
      ]
    };
    
    axios.put.mockResolvedValue({ data: updatedProgramma });
    
    // Call the action
    await store.updateProgramma(updatedProgramma);
    
    // Check if the correct API endpoint was called with the right data
    expect(axios.put).toHaveBeenCalledWith('/api/programma-fedelta/p1', updatedProgramma);
    // Check if the programma is updated in the list
    expect(store.programmi[0]).toEqual(updatedProgramma);
  });
  
  it('deletes a programma fedeltà', async () => {
    // Set initial state
    store.programmi = [
      {
        _id: 'p1',
        nome: 'Programma Base',
        puntiPerEuro: 1,
        sogliePunti: [
          { punti: 100, premio: 'Sconto 10%' }
        ]
      },
      {
        _id: 'p2',
        nome: 'Programma Premium',
        puntiPerEuro: 2,
        sogliePunti: [
          { punti: 100, premio: 'Sconto 15%' }
        ]
      }
    ];
    
    axios.delete.mockResolvedValue({ status: 200 });
    
    // Call the action
    await store.deleteProgramma('p1');
    
    // Check if the correct API endpoint was called
    expect(axios.delete).toHaveBeenCalledWith('/api/programma-fedelta/p1');
    // Check if the programma is removed from the list
    expect(store.programmi.length).toBe(1);
    expect(store.programmi[0]._id).toBe('p2');
  });
  
  it('handles API errors', async () => {
    // Mock API error
    const error = { response: { data: { message: 'Server error' }, status: 500 } };
    axios.get.mockRejectedValue(error);
    
    // Call the action
    await store.fetchProgrammiFedelta();
    
    // Check error state
    expect(store.error).toBe('Server error');
    expect(store.loading).toBe(false);
  });
  
  it('adds punti to a cliente\'s programma fedeltà', async () => {
    const puntiData = {
      clienteId: 'c1',
      punti: 50,
      nota: 'Acquisto servizi'
    };
    
    const mockResponse = {
      _id: 'pf1',
      cliente: 'c1',
      puntiTotali: 150,
      storico: [
        { data: '2025-06-01T12:00:00Z', punti: 100, nota: 'Iscrizione' },
        { data: '2025-06-23T12:00:00Z', punti: 50, nota: 'Acquisto servizi' }
      ]
    };
    
    axios.post.mockResolvedValue({ data: mockResponse });
    
    // Call the action
    const result = await store.aggiungiPunti(puntiData);
    
    // Check if the correct API endpoint was called with the right data
    expect(axios.post).toHaveBeenCalledWith('/api/programma-fedelta/cliente/c1/punti', puntiData);
    // Check the returned result
    expect(result).toEqual(mockResponse);
  });
  
  it('riscatta premi from a cliente\'s programma fedeltà', async () => {
    const premioData = {
      clienteId: 'c1',
      sogliaPunti: 100,
      premio: 'Sconto 10%'
    };
    
    const mockResponse = {
      _id: 'pf1',
      cliente: 'c1',
      puntiTotali: 50,
      storico: [
        { data: '2025-06-01T12:00:00Z', punti: 100, nota: 'Iscrizione' },
        { data: '2025-06-23T12:00:00Z', punti: 50, nota: 'Acquisto servizi' },
        { data: '2025-06-23T14:00:00Z', punti: -100, nota: 'Riscatto premio: Sconto 10%' }
      ],
      premiRiscattati: [
        { data: '2025-06-23T14:00:00Z', premio: 'Sconto 10%' }
      ]
    };
    
    axios.post.mockResolvedValue({ data: mockResponse });
    
    // Call the action
    const result = await store.riscattaPremio(premioData);
    
    // Check if the correct API endpoint was called with the right data
    expect(axios.post).toHaveBeenCalledWith('/api/programma-fedelta/cliente/c1/premio', premioData);
    // Check the returned result
    expect(result).toEqual(mockResponse);
  });
});
