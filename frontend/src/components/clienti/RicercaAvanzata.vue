<template>
  <div class="bg-white shadow-md rounded-lg overflow-hidden">
    <div class="p-4 border-b border-gray-200">
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-medium">Ricerca Avanzata</h3>
        <button 
          @click="isExpanded = !isExpanded" 
          class="text-blue-600 hover:text-blue-800"
        >
          {{ isExpanded ? 'Nascondi' : 'Mostra' }} filtri
        </button>
      </div>
    </div>
    
    <div v-if="isExpanded" class="p-4 border-b border-gray-200">
      <form @submit.prevent="search">
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-4">
          <div>
            <label for="nome" class="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input 
              id="nome" 
              v-model="filters.nome" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label for="cognome" class="block text-sm font-medium text-gray-700 mb-1">Cognome</label>
            <input 
              id="cognome" 
              v-model="filters.cognome" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              id="email" 
              v-model="filters.email" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label for="telefono" class="block text-sm font-medium text-gray-700 mb-1">Telefono</label>
            <input 
              id="telefono" 
              v-model="filters.telefono" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label for="citta" class="block text-sm font-medium text-gray-700 mb-1">Città</label>
            <input 
              id="citta" 
              v-model="filters.citta" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label for="classificazione" class="block text-sm font-medium text-gray-700 mb-1">Classificazione</label>
            <select 
              id="classificazione" 
              v-model="filters.classificazione" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="tutti">Tutti</option>
              <option value="nuovo">Nuovo</option>
              <option value="attivo">Attivo</option>
              <option value="fedele">Fedele</option>
              <option value="inattivo">Inattivo</option>
            </select>
          </div>
        </div>
        
        <div class="grid gap-4 sm:grid-cols-2 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Data di nascita</label>
            <div class="flex space-x-2">
              <div class="flex-1">
                <input 
                  v-model="filters.dataNascitaInizio" 
                  type="date" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Da"
                />
              </div>
              <div class="flex-1">
                <input 
                  v-model="filters.dataNascitaFine" 
                  type="date" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="A"
                />
              </div>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Filtra per data</label>
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label for="creatoDopoData" class="block text-xs text-gray-500">Creato dopo il</label>
                <input 
                  id="creatoDopoData" 
                  v-model="filters.creatoDopoData" 
                  type="date" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label for="ultimaVisitaData" class="block text-xs text-gray-500">Ultima visita prima</label>
                <input 
                  id="ultimaVisitaData" 
                  v-model="filters.ultimaVisitaPrimaDi" 
                  type="date" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex flex-wrap gap-4 mb-4">
          <div class="flex items-center">
            <input 
              id="consensoPrivacy" 
              v-model="filters.consensoPrivacy" 
              type="checkbox" 
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="consensoPrivacy" class="ml-2 block text-sm text-gray-700">
              Consenso Privacy
            </label>
          </div>
          
          <div class="flex items-center">
            <input 
              id="consensoMarketing" 
              v-model="filters.consensoMarketing" 
              type="checkbox" 
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="consensoMarketing" class="ml-2 block text-sm text-gray-700">
              Consenso Marketing
            </label>
          </div>
        </div>
        
        <div class="flex justify-between">
          <button 
            type="button"
            @click="resetFilters" 
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancella filtri
          </button>
          
          <div>
            <button 
              type="submit" 
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              :disabled="loading"
            >
              <span v-if="loading">Ricerca in corso...</span>
              <span v-else>Cerca</span>
            </button>
          </div>
        </div>
      </form>
    </div>
    
    <div v-if="results.clienti && results.clienti.length > 0" class="p-4">
      <div class="mb-4 flex justify-between items-center">
        <p class="text-sm text-gray-600">
          Trovati {{ results.pagination?.total || results.clienti.length }} clienti
        </p>
        
        <div class="flex items-center space-x-2">
          <label for="sort" class="text-sm text-gray-600">Ordina per:</label>
          <select 
            id="sort" 
            v-model="sortOption" 
            @change="handleSortChange"
            class="text-sm border border-gray-300 rounded-md px-2 py-1"
          >
            <option value="cognome">Cognome (A-Z)</option>
            <option value="-cognome">Cognome (Z-A)</option>
            <option value="nome">Nome (A-Z)</option>
            <option value="-nome">Nome (Z-A)</option>
            <option value="-createdAt">Data creazione (recente)</option>
            <option value="createdAt">Data creazione (meno recente)</option>
          </select>
        </div>
      </div>

      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div 
          v-for="cliente in results.clienti" 
          :key="cliente._id"
          class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer bg-white"
          @click="$emit('select-cliente', cliente._id)"
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
      
      <!-- Paginazione -->
      <div v-if="results.pagination && results.pagination.pages > 1" class="mt-6 flex justify-center">
        <nav class="flex items-center" aria-label="Pagination">
          <button 
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="mr-2 px-2 py-1 border border-gray-300 rounded-md disabled:opacity-50"
            aria-label="Previous"
          >
            <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div class="flex space-x-1">
            <button 
              v-for="page in paginationRange" 
              :key="page"
              @click="goToPage(page)"
              :class="[
                'px-3 py-1 rounded-md',
                currentPage === page 
                  ? 'bg-blue-600 text-white' 
                  : 'border border-gray-300 hover:bg-gray-50'
              ]"
            >
              {{ page }}
            </button>
          </div>
          
          <button 
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage === results.pagination.pages"
            class="ml-2 px-2 py-1 border border-gray-300 rounded-md disabled:opacity-50"
            aria-label="Next"
          >
            <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </nav>
      </div>
    </div>
    
    <div v-else-if="hasSearched && !loading" class="p-4 text-center text-gray-500">
      Nessun risultato trovato
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import ClientiService from '@/services/clienti.service';
import { Cliente } from '@/stores/clienti';

const emit = defineEmits(['select-cliente']);

const isExpanded = ref(false);
const loading = ref(false);
const hasSearched = ref(false);
const currentPage = ref(1);
const sortOption = ref('cognome');

const filters = ref({
  nome: '',
  cognome: '',
  email: '',
  telefono: '',
  citta: '',
  classificazione: 'tutti' as 'nuovo' | 'attivo' | 'fedele' | 'inattivo' | 'tutti',
  consensoPrivacy: false as boolean | undefined,
  consensoMarketing: false as boolean | undefined,
  dataNascitaInizio: '',
  dataNascitaFine: '',
  creatoDopoData: '',
  ultimaVisitaPrimaDi: ''
});

const results = ref<{
  clienti: Cliente[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}>({
  clienti: []
});

const paginationRange = computed(() => {
  if (!results.value.pagination) return [];
  
  const totalPages = results.value.pagination.pages;
  const page = currentPage.value;
  const delta = 2; // Numero di pagine da mostrare prima e dopo la pagina corrente
  
  const range = [];
  const rangeWithDots = [];
  let l;
  
  range.push(1);
  
  if (totalPages <= 1) {
    return range;
  }
  
  for (let i = page - delta; i <= page + delta; i++) {
    if (i > 1 && i < totalPages) {
      range.push(i);
    }
  }
  
  range.push(totalPages);
  
  for (const i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push(-1); // Indica i puntini
      }
    }
    rangeWithDots.push(i);
    l = i;
  }
  
  return rangeWithDots.filter(num => num !== -1);
});

const search = async () => {
  loading.value = true;
  hasSearched.value = true;
  
  try {
    // Prepara i filtri rimuovendo i valori vuoti
    const activeFilters: any = {};
    Object.entries(filters.value).forEach(([key, value]) => {
      if (value !== '' && value !== undefined && value !== null && value !== false) {
        activeFilters[key] = value;
      }
    });
    
    // Preparare le opzioni di ordinamento
    const sortField = sortOption.value.startsWith('-') 
      ? sortOption.value.substring(1) 
      : sortOption.value;
    
    const sortOrder = sortOption.value.startsWith('-') ? 'desc' : 'asc';
    
    const response = await ClientiService.searchAdvanced(activeFilters, {
      page: currentPage.value,
      limit: 9, // Numero di risultati per pagina
      sort: sortField,
      order: sortOrder
    });
    
    results.value = response;
  } catch (error) {
    console.error('Errore nella ricerca clienti:', error);
  } finally {
    loading.value = false;
  }
};

const resetFilters = () => {
  filters.value = {
    nome: '',
    cognome: '',
    email: '',
    telefono: '',
    citta: '',
    classificazione: 'tutti',
    consensoPrivacy: false as boolean | undefined,
    consensoMarketing: false as boolean | undefined,
    dataNascitaInizio: '',
    dataNascitaFine: '',
    creatoDopoData: '',
    ultimaVisitaPrimaDi: ''
  };
  
  // Reset anche dei risultati
  results.value = { clienti: [] };
  hasSearched.value = false;
  currentPage.value = 1;
};

const goToPage = (page: number) => {
  if (page < 1 || (results.value.pagination && page > results.value.pagination.pages)) {
    return;
  }
  
  currentPage.value = page;
  search();
};

const handleSortChange = () => {
  if (hasSearched.value) {
    search();
  }
};

// Cerca automaticamente quando la pagina cambia
watch(currentPage, () => {
  if (hasSearched.value) {
    search();
  }
});
</script>
