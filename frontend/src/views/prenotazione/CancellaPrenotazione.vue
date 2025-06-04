<template>
  <PublicLayout>
    <div class="flex items-center justify-center px-4 py-8 min-h-96">
      <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-6">
        <!-- Header -->
        <div class="text-center mb-6">
          <div class="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-calendar-times text-white text-2xl"></i>
          </div>
          <h1 class="text-2xl font-bold text-gray-900">Cancella Prenotazione</h1>
          <p class="text-gray-600 mt-2">Conferma la cancellazione del tuo appuntamento</p>
        </div>

      <!-- Dettagli appuntamento (se disponibili) -->
      <div v-if="dettagliAppuntamento && !loading && !cancellata" class="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 class="font-medium text-gray-900 mb-2">Dettagli appuntamento:</h3>
        <div class="space-y-2 text-sm text-gray-600">
          <div><strong>Servizio:</strong> {{ dettagliAppuntamento.servizio?.nome }}</div>
          <div><strong>Data e ora:</strong> {{ formatDataOra(dettagliAppuntamento.dataOraInizio) }}</div>
          <div><strong>Durata:</strong> {{ dettagliAppuntamento.servizio?.durata }} minuti</div>
          <div><strong>Operatore:</strong> {{ dettagliAppuntamento.operatore?.nome }} {{ dettagliAppuntamento.operatore?.cognome }}</div>
        </div>
      </div>

      <!-- Form motivo cancellazione -->
      <div v-if="!loading && !cancellata && !errore" class="space-y-4">
        <div>
          <label for="motivo" class="block text-sm font-medium text-gray-700 mb-2">
            Motivo della cancellazione (opzionale)
          </label>
          <textarea
            id="motivo"
            v-model="motivoCancellazione"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            rows="3"
            placeholder="Inserisci il motivo della cancellazione..."
          ></textarea>
        </div>

        <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <div class="flex">
            <div class="flex-shrink-0">
              <i class="fas fa-exclamation-triangle text-yellow-400"></i>
            </div>
            <div class="ml-3">
              <p class="text-sm text-yellow-700">
                <strong>Attenzione:</strong> Questa azione non può essere annullata. 
                Una volta cancellata, dovrai effettuare una nuova prenotazione.
              </p>
            </div>
          </div>
        </div>

        <div class="flex space-x-3">
          <button
            @click="confermaCancellazione"
            :disabled="loading"
            class="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Conferma Cancellazione
          </button>
          <router-link 
            to="/prenotazione-online" 
            class="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors text-center"
          >
            Annulla
          </router-link>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
        <p class="mt-4 text-gray-600">Elaborazione in corso...</p>
      </div>

      <!-- Success State -->
      <div v-else-if="cancellata" class="text-center">
        <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-check text-white text-2xl"></i>
        </div>
        <h2 class="text-xl font-semibold text-green-600 mb-2">Prenotazione Cancellata</h2>
        <p class="text-gray-600 mb-6">
          Il tuo appuntamento è stato cancellato con successo.
        </p>
        <router-link 
          to="/prenotazione-online" 
          class="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors inline-block"
        >
          Nuova prenotazione
        </router-link>
      </div>

      <!-- Error State -->
      <div v-else-if="errore" class="text-center">
        <div class="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-times text-white text-2xl"></i>
        </div>
        <h2 class="text-xl font-semibold text-red-600 mb-2">Errore di Cancellazione</h2>
        <p class="text-gray-600 mb-6">{{ messaggioErrore }}</p>
        <div class="space-y-3">
          <button 
            @click="tentaCancellazione" 
            class="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
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

const loading = ref(false);
const cancellata = ref(false);
const errore = ref(false);
const messaggioErrore = ref('');
const dettagliAppuntamento = ref<any>(null);
const motivoCancellazione = ref('');

const { id, token } = route.params as { id: string; token: string };

const confermaCancellazione = async () => {
  loading.value = true;
  errore.value = false;
  messaggioErrore.value = '';

  try {
    await prenotazioneOnlineService.cancellaPrenotazione(id, token, motivoCancellazione.value);
    cancellata.value = true;
  } catch (error: any) {
    errore.value = true;
    messaggioErrore.value = error.message || 'Errore durante la cancellazione della prenotazione';
  } finally {
    loading.value = false;
  }
};

const tentaCancellazione = () => {
  errore.value = false;
  messaggioErrore.value = '';
};

const formatDataOra = (dataOra: string): string => {
  return prenotazioneOnlineService.formatDataOra(dataOra);
};

onMounted(() => {
  if (!id || !token) {
    errore.value = true;
    messaggioErrore.value = 'Link di cancellazione non valido';
    return;
  }
  
  // Qui potresti fare una chiamata per ottenere i dettagli dell'appuntamento
  // Per ora lasciamo vuoto, i dettagli verranno mostrati se disponibili
});
</script>
