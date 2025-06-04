<template>
  <PublicLayout>
    <div class="flex items-center justify-center px-4 py-8 min-h-96">
      <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-6">
        <!-- Header -->
        <div class="text-center mb-6">
          <div class="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-calendar-check text-white text-2xl"></i>
          </div>
          <h1 class="text-2xl font-bold text-gray-900">Conferma Prenotazione</h1>
          <p class="text-gray-600 mt-2">Conferma il tuo appuntamento</p>
        </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p class="mt-4 text-gray-600">Elaborazione in corso...</p>
      </div>

      <!-- Success State -->
      <div v-else-if="confermata" class="text-center">
        <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-check text-white text-2xl"></i>
        </div>
        <h2 class="text-xl font-semibold text-green-600 mb-2">Prenotazione Confermata!</h2>
        <p class="text-gray-600 mb-6">
          Il tuo appuntamento è stato confermato con successo.
        </p>
        <div v-if="dettagliAppuntamento" class="bg-gray-50 rounded-lg p-4 text-left mb-6">
          <h3 class="font-medium text-gray-900 mb-2">Dettagli appuntamento:</h3>
          <div class="space-y-2 text-sm text-gray-600">
            <div><strong>Servizio:</strong> {{ dettagliAppuntamento.servizio?.nome }}</div>
            <div><strong>Data e ora:</strong> {{ formatDataOra(dettagliAppuntamento.dataOraInizio) }}</div>
            <div><strong>Durata:</strong> {{ dettagliAppuntamento.servizio?.durata }} minuti</div>
            <div><strong>Operatore:</strong> {{ dettagliAppuntamento.operatore?.nome }} {{ dettagliAppuntamento.operatore?.cognome }}</div>
          </div>
        </div>
        <router-link 
          to="/prenotazione-online" 
          class="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors inline-block"
        >
          Nuova prenotazione
        </router-link>
      </div>

      <!-- Error State -->
      <div v-else class="text-center">
        <div class="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-times text-white text-2xl"></i>
        </div>
        <h2 class="text-xl font-semibold text-red-600 mb-2">Errore di Conferma</h2>
        <p class="text-gray-600 mb-6">{{ messaggioErrore }}</p>
        <div class="space-y-3">
          <button 
            @click="tentaConferma" 
            class="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Riprova
          </button>
          <router-link 
            to="/prenotazione-online" 
            class="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors inline-block"
          >
            Nuova prenotazione
          </router-link>
        </div>
      </div>
    </div>
    </div>

  </PublicLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import PublicLayout from '@/layouts/PublicLayout.vue';
import prenotazioneOnlineService from '@/services/prenotazioneOnline.service';

const route = useRoute();

const loading = ref(true);
const confermata = ref(false);
const messaggioErrore = ref('');
const dettagliAppuntamento = ref<any>(null);

const { id, token } = route.params as { id: string; token: string };

const tentaConferma = async () => {
  loading.value = true;
  confermata.value = false;
  messaggioErrore.value = '';

  try {
    const response = await prenotazioneOnlineService.confermaPrenotazione(id, token);
    confermata.value = true;
    dettagliAppuntamento.value = response.appuntamento;
  } catch (error: any) {
    confermata.value = false;
    messaggioErrore.value = error.message || 'Errore durante la conferma della prenotazione';
  } finally {
    loading.value = false;
  }
};

const formatDataOra = (dataOra: string): string => {
  return prenotazioneOnlineService.formatDataOra(dataOra);
};

onMounted(() => {
  if (!id || !token) {
    messaggioErrore.value = 'Link di conferma non valido';
    loading.value = false;
    return;
  }
  tentaConferma();
});
</script>
