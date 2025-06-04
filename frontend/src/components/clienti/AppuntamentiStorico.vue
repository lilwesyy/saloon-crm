<template>
  <div class="bg-white shadow-md rounded-lg p-6">
    <h2 class="text-xl font-semibold mb-4">Storico Appuntamenti</h2>
    
    <div v-if="loading" class="text-center py-4">
      Caricamento appuntamenti...
    </div>
    
    <div v-else-if="appuntamenti.length === 0" class="text-center py-4 text-gray-500">
      Nessun appuntamento registrato
    </div>
    
    <div v-else class="space-y-4">
      <div 
        v-for="appuntamento in appuntamenti" 
        :key="appuntamento._id"
        class="border-b border-gray-200 pb-4 last:border-0 last:pb-0"
      >
        <div class="flex justify-between">
          <div>
            <h4 class="font-medium">{{ appuntamento.servizio.nome }}</h4>
            <p class="text-sm text-gray-500">
              {{ formatDateTime(appuntamento.dataInizio) }}
              <span v-if="appuntamento.operatore">
                • Operatore: {{ appuntamento.operatore.nome }}
              </span>
            </p>
          </div>
          <div class="text-right">
            <p class="font-medium">{{ formatCurrency(appuntamento.servizio.prezzo) }}</p>
            <p class="text-sm" :class="{
              'text-green-600': appuntamento.stato === 'completato',
              'text-blue-600': appuntamento.stato === 'confermato',
              'text-yellow-600': appuntamento.stato === 'in attesa',
              'text-red-600': appuntamento.stato === 'cancellato'
            }">
              {{ statoLabel(appuntamento.stato) }}
            </p>
          </div>
        </div>
        
        <div v-if="appuntamento.note" class="mt-2 text-sm text-gray-600 italic">
          {{ appuntamento.note }}
        </div>
      </div>
    </div>

    <div v-if="appuntamenti.length > 0 && !showAll && appuntamenti.length > limitDefault" class="mt-4 text-center">
      <button 
        @click="showAll = true"
        class="text-sm text-blue-600 hover:text-blue-800 font-medium"
      >
        Mostra tutti gli appuntamenti
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';

const props = defineProps<{
  clienteId: string;
}>();

const limitDefault = 5;
const loading = ref(true);
const appuntamenti = ref<any[]>([]);
const showAll = ref(false);

const appuntamentiMostrati = computed(() => {
  if (showAll.value) {
    return appuntamenti.value;
  }
  return appuntamenti.value.slice(0, limitDefault);
});

const formatDateTime = (date: string | Date) => {
  return new Date(date).toLocaleString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
};

const statoLabel = (stato: string) => {
  switch(stato) {
    case 'confermato': return 'Confermato';
    case 'completato': return 'Completato';
    case 'in attesa': return 'In attesa';
    case 'cancellato': return 'Cancellato';
    default: return stato;
  }
};

const fetchAppuntamenti = async () => {
  loading.value = true;
  try {
    // In una implementazione reale chiameresti un servizio API
    // Esempio: appuntamenti.value = await appuntamentiService.getByClienteId(props.clienteId);
    
    // Dati di esempio - da sostituire con chiamate API reali
    setTimeout(() => {
      appuntamenti.value = [
        // Qui verranno inseriti gli appuntamenti dal backend
      ];
      loading.value = false;
    }, 500);
  } catch (error) {
    console.error('Errore nel caricamento appuntamenti:', error);
    loading.value = false;
  }
};

watch(() => props.clienteId, (newVal) => {
  if (newVal) {
    fetchAppuntamenti();
  }
});

onMounted(() => {
  if (props.clienteId) {
    fetchAppuntamenti();
  }
});
</script>
