<template>
  <div class="bg-white shadow-md rounded-lg overflow-hidden">
    <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
      <h3 class="text-lg font-semibold text-gray-900">Panoramica Clienti</h3>
      <router-link 
        to="/clienti" 
        class="text-blue-600 hover:text-blue-800 text-sm font-medium"
      >
        Vedi tutti
      </router-link>
    </div>
    
    <div v-if="loading" class="p-6 text-center">
      <svg class="animate-spin h-8 w-8 mx-auto text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="mt-2 text-gray-500">Caricamento statistiche clienti...</p>
    </div>
    
    <div v-else-if="error" class="p-6 text-center">
      <p class="text-red-600">{{ error }}</p>
    </div>
    
    <div v-else class="p-6">
      <div class="grid grid-cols-2 gap-6">
        <div class="bg-blue-50 rounded-lg p-4 flex items-center">
          <div class="bg-blue-100 rounded-full p-3 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <div class="text-sm text-blue-800 font-medium">Clienti totali</div>
            <div class="text-2xl font-bold text-gray-900">{{ statistiche.totale }}</div>
          </div>
        </div>
        
        <div class="bg-green-50 rounded-lg p-4 flex items-center">
          <div class="bg-green-100 rounded-full p-3 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <div class="text-sm text-green-800 font-medium">Nuovi ultimo mese</div>
            <div class="text-2xl font-bold text-gray-900">{{ statistiche.nuoviUltimoMese }}</div>
          </div>
        </div>
      </div>
      
      <div class="mt-6">
        <h4 class="text-sm font-medium text-gray-700 mb-2">Clienti per classificazione</h4>
        <div class="grid grid-cols-4 gap-2">
          <div class="rounded-md p-2 bg-yellow-100 border border-yellow-200">
            <div class="text-xs font-medium text-yellow-800">Nuovi</div>
            <div class="mt-1 text-xl font-semibold text-gray-900">
              {{ statistiche.perClassificazione.nuovo || 0 }}
            </div>
          </div>
          
          <div class="rounded-md p-2 bg-blue-100 border border-blue-200">
            <div class="text-xs font-medium text-blue-800">Attivi</div>
            <div class="mt-1 text-xl font-semibold text-gray-900">
              {{ statistiche.perClassificazione.attivo || 0 }}
            </div>
          </div>
          
          <div class="rounded-md p-2 bg-green-100 border border-green-200">
            <div class="text-xs font-medium text-green-800">Fedeli</div>
            <div class="mt-1 text-xl font-semibold text-gray-900">
              {{ statistiche.perClassificazione.fedele || 0 }}
            </div>
          </div>
          
          <div class="rounded-md p-2 bg-red-100 border border-red-200">
            <div class="text-xs font-medium text-red-800">Inattivi</div>
            <div class="mt-1 text-xl font-semibold text-gray-900">
              {{ statistiche.perClassificazione.inattivo || 0 }}
            </div>
          </div>
        </div>
      </div>
      
      <div class="mt-6">
        <div class="flex justify-between items-center mb-2">
          <h4 class="text-sm font-medium text-gray-700">Consenso marketing</h4>
          <span class="text-sm text-gray-600">
            {{ formatPercentage(statistiche.conConsensoMarketing, statistiche.totale) }}
          </span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            class="bg-blue-600 h-2.5 rounded-full" 
            :style="`width: ${(statistiche.conConsensoMarketing / statistiche.totale * 100) || 0}%`"
          ></div>
        </div>
      </div>
      
      <div class="mt-6 flex justify-between items-center">
        <router-link 
          to="/clienti/ricerca" 
          class="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center"
        >
          Ricerca avanzata
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </router-link>
        
        <router-link 
          to="/clienti/nuovo" 
          class="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center"
        >
          Nuovo cliente
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ClientiService from '@/services/clienti.service';

const loading = ref(true);
const error = ref('');
const statistiche = ref({
  totale: 0,
  perClassificazione: {} as Record<string, number>,
  conConsensoMarketing: 0,
  nuoviUltimoMese: 0
});

const formatPercentage = (value: number, total: number) => {
  if (!total) return '0%';
  const percentage = (value / total) * 100;
  return `${percentage.toFixed(1)}% (${value}/${total})`;
};

const fetchStatistiche = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    const data = await ClientiService.getStatistiche();
    statistiche.value = data;
  } catch (err: any) {
    console.error('Errore durante il recupero delle statistiche clienti:', err);
    error.value = 'Impossibile caricare le statistiche clienti';
  } finally {
    loading.value = false;
  }
};

onMounted(fetchStatistiche);
</script>
