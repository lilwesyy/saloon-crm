<template>
  <div class="container mx-auto px-4 py-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Clienti</h1>
      <div class="flex gap-2">
        <router-link 
          to="/clienti/ricerca" 
          class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Ricerca Avanzata
        </router-link>
        <router-link 
          to="/clienti/nuovo" 
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Nuovo Cliente
        </router-link>
      </div>
    </div>

    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <div class="p-6">
        <div class="mb-6">
          <!-- Filtri e ricerca -->
          <div class="flex flex-wrap gap-4">
            <div class="flex-grow">          <div class="relative">
            <input 
              v-model="searchTerm" 
              type="text" 
              placeholder="Cerca clienti..." 
              class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
              <router-link 
                to="/clienti/ricerca" 
                class="text-sm text-blue-600 hover:text-blue-800"
                title="Ricerca avanzata"
              >
                Avanzata
              </router-link>
            </div>
          </div>
            </div>
            <div class="flex gap-2">
              <button 
                v-for="filtro in filtri" 
                :key="filtro.value"
                @click="toggleFiltro(filtro.value)"
                class="px-3 py-2 rounded-md border text-sm font-medium transition-colors"
                :class="filtroAttivo === filtro.value ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 text-gray-700 hover:bg-gray-50'"
              >
                {{ filtro.label }}
                <span class="ml-1 text-xs">({{ countClassificazione(filtro.value) }})</span>
              </button>
            </div>
          </div>
        </div>
        
        <div v-if="loading" class="text-center py-4">
          <svg class="animate-spin h-8 w-8 mx-auto text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="mt-2 text-gray-600">Caricamento clienti...</p>
        </div>
        
        <div v-else-if="filteredClienti.length === 0" class="text-center py-8 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <p>Nessun cliente trovato</p>
          <p v-if="searchTerm" class="text-sm mt-1">Prova a modificare i criteri di ricerca</p>
        </div>
        
        <div v-else>
          <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div 
              v-for="cliente in filteredClienti" 
              :key="cliente._id"
              class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer bg-white"
              @click="$router.push(`/clienti/${cliente._id}`)"
            >
              <div class="flex items-center">
                <div class="mr-3 w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                  <img 
                    v-if="cliente.fotoProfilo" 
                    :src="cliente.fotoProfilo" 
                    :alt="`Foto di ${cliente.nome} ${cliente.cognome}`"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <div class="flex-grow">
                  <h3 class="font-semibold text-lg">{{ cliente.nome }} {{ cliente.cognome }}</h3>
                  <p class="text-gray-600 text-sm">{{ cliente.telefono }}</p>
                </div>
              </div>

              <div class="mt-3 flex items-center justify-between">
                <p v-if="cliente.email" class="text-gray-600 text-sm truncate mr-2">{{ cliente.email }}</p>
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap"
                  :class="{
                    'bg-green-100 text-green-800': cliente.classificazione === 'fedele',
                    'bg-blue-100 text-blue-800': cliente.classificazione === 'attivo',
                    'bg-yellow-100 text-yellow-800': cliente.classificazione === 'nuovo',
                    'bg-red-100 text-red-800': cliente.classificazione === 'inattivo'
                  }"
                >
                  {{ cliente.classificazione }}
                </span>
              </div>
            </div>
          </div>

          <!-- Paginazione (per implementazioni future) -->
          <div class="mt-6 flex justify-center">
            <!-- Componenti di paginazione andranno qui -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useClientiStore, Cliente } from '@/stores/clienti';
import { useToast } from '@/composables/useToast';

const clientiStore = useClientiStore();
const toast = useToast();
const searchTerm = ref('');
const loading = ref(true);
const filtroAttivo = ref('tutti');

const filtri = [
  { label: 'Tutti', value: 'tutti' },
  { label: 'Nuovi', value: 'nuovo' },
  { label: 'Attivi', value: 'attivo' },
  { label: 'Fedeli', value: 'fedele' },
  { label: 'Inattivi', value: 'inattivo' }
];

const filteredClienti = computed(() => {
  let result = clientiStore.clienti;
  
  // Filtro per classificazione
  if (filtroAttivo.value !== 'tutti') {
    result = result.filter(cliente => cliente.classificazione === filtroAttivo.value);
  }
  
  // Filtro per ricerca testuale
  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase();
    result = result.filter(cliente => 
      cliente.nome.toLowerCase().includes(search) ||
      cliente.cognome.toLowerCase().includes(search) ||
      cliente.telefono.includes(search) ||
      (cliente.email && cliente.email.toLowerCase().includes(search))
    );
  }
  
  return result;
});

const countClassificazione = (classificazione: string) => {
  if (classificazione === 'tutti') {
    return clientiStore.clienti.length;
  }
  return clientiStore.clienti.filter(c => c.classificazione === classificazione).length;
};

const toggleFiltro = (filtro: string) => {
  filtroAttivo.value = filtro;
};

// Per ricerche in tempo reale
watch(searchTerm, (newValue) => {
  if (newValue.length > 2) {
    // Qui si potrebbe implementare una ricerca in tempo reale sul server
    // Per ora usiamo il filtro locale
  }
});

onMounted(async () => {
  try {
    await clientiStore.fetchClienti();
  } catch (error) {
    console.error('Errore nel caricamento dei clienti:', error);
    toast.error('Impossibile caricare la lista dei clienti');
  } finally {
    loading.value = false;
  }
});
</script>
