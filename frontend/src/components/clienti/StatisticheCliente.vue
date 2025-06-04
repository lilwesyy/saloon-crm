<template>
  <div class="bg-white shadow-md rounded-lg p-6">
    <h3 class="text-lg font-semibold mb-4">Statistiche Cliente</h3>
    
    <div v-if="loading" class="text-center py-4">
      Caricamento statistiche...
    </div>
    
    <div v-else class="space-y-3">
      <div class="flex justify-between items-center">
        <span class="text-gray-600">Appuntamenti totali:</span>
        <span class="font-semibold">{{ statistiche.totaleAppuntamenti }}</span>
      </div>

      <div class="flex justify-between items-center">
        <span class="text-gray-600">Ultima visita:</span>
        <span class="font-semibold">{{ formatDate(statistiche.ultimaVisita) || 'Mai' }}</span>
      </div>

      <div class="flex justify-between items-center">
        <span class="text-gray-600">Spesa totale:</span>
        <span class="font-semibold">{{ formatCurrency(statistiche.spesaTotale) }}</span>
      </div>

      <div class="flex justify-between items-center">
        <span class="text-gray-600">Spesa media:</span>
        <span class="font-semibold">{{ formatCurrency(statistiche.spesaMedia) }}</span>
      </div>

      <div class="flex justify-between items-center">
        <span class="text-gray-600">Frequenza visite:</span>
        <span class="font-semibold">{{ statistiche.frequenzaVisite || 'N/A' }}</span>
      </div>

      <div class="flex justify-between items-center">
        <span class="text-gray-600">Trattamento preferito:</span>
        <span class="font-semibold truncate max-w-[150px]" :title="statistiche.trattamentoPreferito">
          {{ statistiche.trattamentoPreferito || 'N/A' }}
        </span>
      </div>
    </div>

    <div class="mt-4 pt-4 border-t border-gray-200">
      <h4 class="text-sm font-medium text-gray-700 mb-2">Punti fedeltà</h4>
      <div class="flex items-center">
        <div class="flex-grow bg-gray-200 rounded-full h-2.5">
          <div class="bg-blue-600 h-2.5 rounded-full" :style="`width: ${puntiPercentuale}%`"></div>
        </div>
        <span class="ml-2 text-sm font-medium">
          {{ statistiche.puntiFedelta }} / 100
        </span>
      </div>
      <p class="mt-1 text-xs text-gray-500">
        {{ statistiche.puntiFedelta >= 100 ? 'Sconto disponibile!' : `Mancano ${100 - statistiche.puntiFedelta} punti per uno sconto` }}
      </p>
    </div>

    <div class="mt-4">
      <button 
        @click="$emit('update:classificazione')" 
        class="text-sm text-blue-600 hover:text-blue-800 font-medium"
      >
        Aggiorna classificazione cliente
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';

const props = defineProps<{
  clienteId: string;
}>();

const emit = defineEmits(['update:classificazione']);

const loading = ref(true);
const statistiche = ref({
  totaleAppuntamenti: 0,
  ultimaVisita: null,
  spesaTotale: 0,
  spesaMedia: 0,
  frequenzaVisite: '',
  trattamentoPreferito: '',
  puntiFedelta: 0
});

const puntiPercentuale = computed(() => {
  return Math.min(statistiche.value.puntiFedelta, 100);
});

const formatDate = (date: string | Date | null) => {
  if (!date) return null;
  return new Date(date).toLocaleDateString('it-IT');
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
};

const fetchStatistiche = async () => {
  loading.value = true;
  try {
    // In una implementazione reale chiameresti un servizio API
    // Esempio: const data = await statisticheService.getByClienteId(props.clienteId);
    
    // Dati di esempio - da sostituire con chiamate API reali
    setTimeout(() => {
      statistiche.value = {
        totaleAppuntamenti: 0,
        ultimaVisita: null,
        spesaTotale: 0,
        spesaMedia: 0,
        frequenzaVisite: '',
        trattamentoPreferito: '',
        puntiFedelta: 0
      };
      loading.value = false;
    }, 500);
  } catch (error) {
    console.error('Errore nel caricamento delle statistiche:', error);
    loading.value = false;
  }
};

watch(() => props.clienteId, (newVal) => {
  if (newVal) {
    fetchStatistiche();
  }
});

onMounted(() => {
  if (props.clienteId) {
    fetchStatistiche();
  }
});
</script>
