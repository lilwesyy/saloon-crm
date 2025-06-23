import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useServiziStore } from '@/stores/servizi';
import axios from 'axios';

// Mock axios
vi.mock('axios');

describe('Servizi Store', () => {
  let store;
  
  beforeEach(() => {
    // Create a fresh pinia instance for each test
    setActivePinia(createPinia());
    // Get the store instance
    store = useServiziStore();
    // Reset the state
    store.$reset();
  });
  
  it('initialize with empty state', () => {
    expect(store.servizi).toEqual([]);
    expect(store.currentServizio).toBe(null);
    expect(store.loading).toBe(false);
    expect(store.error).toBe(null);
  });
  
  it('fetches servizi', async () => {
    // Mock API response
    const mockServizi = [
      {
        _id: 's1',
        nome: 'Taglio',
        descrizione: 'Taglio capelli base',
        durata: 30,
        prezzo: 20
      },
      {
        _id: 's2',
        nome: 'Piega',
        descrizione: 'Messa in piega',
        durata: 45,
        prezzo: 25
      }
    ];
    
    axios.get.mockResolvedValue({ data: mockServizi });
    
    // Call the action
    await store.fetchServizi();
    
    // Check the state changes
    expect(store.servizi).toEqual(mockServizi);
    expect(store.loading).toBe(false);
    expect(store.error).toBe(null);
    // Check if the correct API endpoint was called
    expect(axios.get).toHaveBeenCalledWith('/api/servizi');
  });
  
  it('fetches a single servizio', async () => {
    // Mock API response
    const mockServizio = {
      _id: 's1',
      nome: 'Taglio',
      descrizione: 'Taglio capelli base',
      durata: 30,
      prezzo: 20
    };
    
    axios.get.mockResolvedValue({ data: mockServizio });
    
    // Call the action
    await store.fetchServizioById('s1');
    
    // Check the state changes
    expect(store.currentServizio).toEqual(mockServizio);
    expect(store.loading).toBe(false);
    expect(store.error).toBe(null);
    // Check if the correct API endpoint was called
    expect(axios.get).toHaveBeenCalledWith('/api/servizi/s1');
  });
  
  it('creates a new servizio', async () => {
    // Mock API response
    const newServizio = {
      nome: 'Trattamento',
      descrizione: 'Trattamento nutriente',
      durata: 60,
      prezzo: 40
    };
    
    const createdServizio = {
      _id: 's3',
      ...newServizio
    };
    
    axios.post.mockResolvedValue({ data: createdServizio });
    
    // Call the action
    await store.createServizio(newServizio);
    
    // Check if the correct API endpoint was called with the right data
    expect(axios.post).toHaveBeenCalledWith('/api/servizi', newServizio);
    // Check if the servizio is added to the list
    expect(store.servizi).toContain(createdServizio);
  });
  
  it('updates an existing servizio', async () => {
    // Set initial state
    store.servizi = [
      {
        _id: 's1',
        nome: 'Taglio',
        descrizione: 'Taglio capelli base',
        durata: 30,
        prezzo: 20
      }
    ];
    
    // Updated servizio
    const updatedServizio = {
      _id: 's1',
      nome: 'Taglio Moderno',
      descrizione: 'Taglio capelli moderno',
      durata: 35,
      prezzo: 25
    };
    
    axios.put.mockResolvedValue({ data: updatedServizio });
    
    // Call the action
    await store.updateServizio(updatedServizio);
    
    // Check if the correct API endpoint was called with the right data
    expect(axios.put).toHaveBeenCalledWith('/api/servizi/s1', updatedServizio);
    // Check if the servizio is updated in the list
    expect(store.servizi[0]).toEqual(updatedServizio);
  });
  
  it('deletes a servizio', async () => {
    // Set initial state
    store.servizi = [
      {
        _id: 's1',
        nome: 'Taglio',
        descrizione: 'Taglio capelli base',
        durata: 30,
        prezzo: 20
      },
      {
        _id: 's2',
        nome: 'Piega',
        descrizione: 'Messa in piega',
        durata: 45,
        prezzo: 25
      }
    ];
    
    axios.delete.mockResolvedValue({ status: 200 });
    
    // Call the action
    await store.deleteServizio('s1');
    
    // Check if the correct API endpoint was called
    expect(axios.delete).toHaveBeenCalledWith('/api/servizi/s1');
    // Check if the servizio is removed from the list
    expect(store.servizi.length).toBe(1);
    expect(store.servizi[0]._id).toBe('s2');
  });
  
  it('handles API errors', async () => {
    // Mock API error
    const error = { response: { data: { message: 'Server error' }, status: 500 } };
    axios.get.mockRejectedValue(error);
    
    // Call the action
    await store.fetchServizi();
    
    // Check error state
    expect(store.error).toBe('Server error');
    expect(store.loading).toBe(false);
  });
  
  it('filters servizi by categoria', async () => {
    // Set initial state
    store.servizi = [
      {
        _id: 's1',
        nome: 'Taglio',
        descrizione: 'Taglio capelli base',
        durata: 30,
        prezzo: 20,
        categoria: 'capelli'
      },
      {
        _id: 's2',
        nome: 'Manicure',
        descrizione: 'Manicure base',
        durata: 45,
        prezzo: 25,
        categoria: 'unghie'
      },
      {
        _id: 's3',
        nome: 'Colorazione',
        descrizione: 'Colorazione capelli',
        durata: 90,
        prezzo: 60,
        categoria: 'capelli'
      }
    ];
    
    // Call the getter
    const filteredServizi = store.getServiziByCatagoria('capelli');
    
    // Check if the correct servizi are returned
    expect(filteredServizi.length).toBe(2);
    expect(filteredServizi[0].nome).toBe('Taglio');
    expect(filteredServizi[1].nome).toBe('Colorazione');
  });
});
