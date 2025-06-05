<template>
  <div class="container mx-auto px-4 py-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Dettaglio Cliente</h1>
      <div class="flex gap-2">
        <router-link 
          :to="`/clienti/${cliente?._id}/modifica`" 
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Modifica
        </router-link>
        <router-link 
          to="/clienti" 
          class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Torna alla Lista
        </router-link>
      </div>
    </div>
    
    <div v-if="loading" class="text-center py-8">
      <svg class="animate-spin h-8 w-8 mx-auto text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="mt-2 text-gray-600">Caricamento cliente...</p>
    </div>
    
    <div v-else-if="!cliente" class="text-center py-8 text-gray-500">
      Cliente non trovato
    </div>
    
    <div v-else class="grid gap-6 lg:grid-cols-3">
      <!-- Informazioni Cliente (2/3 della larghezza) -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white shadow-md rounded-lg p-6">
          <div class="flex items-start mb-6">
            <div class="mr-6">
              <div class="w-24 h-24 rounded-full bg-gray-100 overflow-hidden border-2 border-gray-200">
                <img 
                  v-if="cliente.fotoProfilo" 
                  :src="cliente.fotoProfilo" 
                  :alt="`Foto di ${cliente.nome} ${cliente.cognome}`"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>

            <div class="flex-1">
              <h2 class="text-xl font-semibold">{{ cliente.nome }} {{ cliente.cognome }}</h2>
              <p class="text-sm text-gray-500">
                Cliente dal {{ formatDate(cliente.createdAt) }}
              </p>
              <div class="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
                :class="{
                  'bg-green-100 text-green-800': cliente.classificazione === 'fedele',
                  'bg-blue-100 text-blue-800': cliente.classificazione === 'attivo',
                  'bg-yellow-100 text-yellow-800': cliente.classificazione === 'nuovo',
                  'bg-red-100 text-red-800': cliente.classificazione === 'inattivo'
                }">
                {{ classificazioneLabel(cliente.classificazione) }}
              </div>
            </div>
          </div>

          <div class="grid gap-x-6 gap-y-4 md:grid-cols-2">
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-3">Informazioni di Contatto</h3>
              
              <div class="space-y-2">
                <div class="flex">
                  <span class="w-24 text-gray-500">Telefono:</span>
                  <a :href="`tel:${cliente.telefono}`" class="text-blue-600 hover:underline">{{ cliente.telefono }}</a>
                </div>
                <div class="flex">
                  <span class="w-24 text-gray-500">Email:</span>
                  <a v-if="cliente.email" :href="`mailto:${cliente.email}`" class="text-blue-600 hover:underline">{{ cliente.email }}</a>
                  <span v-else class="text-gray-400">Non specificata</span>
                </div>
                <div class="flex">
                  <span class="w-24 text-gray-500">Nascita:</span>
                  <span>{{ formatDate(cliente.dataNascita) || 'Non specificata' }}</span>
                </div>
              </div>
            </div>

            <div v-if="cliente.indirizzo && (cliente.indirizzo.via || cliente.indirizzo.citta)">
              <h3 class="text-lg font-medium text-gray-900 mb-3">Indirizzo</h3>
              
              <div class="space-y-2">
                <div v-if="cliente.indirizzo.via" class="flex">
                  <span class="w-24 text-gray-500">Via:</span>
                  <span>{{ cliente.indirizzo.via }}</span>
                </div>
                <div v-if="cliente.indirizzo.citta || cliente.indirizzo.cap || cliente.indirizzo.provincia" class="flex">
                  <span class="w-24 text-gray-500">Località:</span>
                  <span>
                    {{ cliente.indirizzo.citta || '' }}
                    {{ cliente.indirizzo.cap ? `(${cliente.indirizzo.cap})` : '' }}
                    {{ cliente.indirizzo.provincia ? `, ${cliente.indirizzo.provincia}` : '' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-6" v-if="cliente.note">
            <h3 class="text-lg font-medium text-gray-900 mb-3">Note</h3>
            <p class="text-gray-700 whitespace-pre-line">{{ cliente.note }}</p>
          </div>

          <div class="mt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-3">Consensi</h3>
            <div class="flex flex-wrap gap-4">
              <div class="inline-flex items-center">
                <span class="mr-2">Privacy:</span>
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="cliente.consensoPrivacy ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                >
                  {{ cliente.consensoPrivacy ? 'Accettato' : 'Non accettato' }}
                </span>
              </div>
              <div class="inline-flex items-center">
                <span class="mr-2">Marketing:</span>
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="cliente.consensoMarketing ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                >
                  {{ cliente.consensoMarketing ? 'Accettato' : 'Non accettato' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Componente per gli appuntamenti del cliente -->
        <AppuntamentiStorico 
          v-if="cliente._id" 
          :cliente-id="cliente._id"
        />
      </div>
      
      <!-- Sidebar con azioni rapide e statistiche (1/3 della larghezza) -->
      <div class="space-y-6">
        <div class="bg-white shadow-md rounded-lg p-6">
          <h3 class="text-lg font-semibold mb-4">Azioni Rapide</h3>
          <div class="space-y-3">
            <router-link 
              :to="`/appuntamenti/nuovo?cliente=${cliente._id}`"
              class="block w-full bg-green-600 text-white text-center px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Prenota Appuntamento
            </router-link>
            <button 
              @click="callClient" 
              class="block w-full bg-blue-600 text-white text-center px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Chiama Cliente
            </button>
            <button
              v-if="cliente.email" 
              @click="emailClient" 
              class="block w-full bg-purple-600 text-white text-center px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Invia Email
            </button>
            <button 
              @click="deleteClient" 
              class="block w-full bg-red-600 text-white text-center px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Elimina Cliente
            </button>
          </div>
        </div>
        
        <!-- Componente per le statistiche del cliente -->
        <StatisticheCliente 
          v-if="cliente._id" 
          :cliente-id="cliente._id" 
          @update:classificazione="showClassificazioneModal = true"
        />
      </div>
    </div>
    
    <!-- Modal per aggiornare la classificazione -->
    <div v-if="showClassificazioneModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-semibold mb-4">Aggiorna Classificazione Cliente</h3>
        <div class="space-y-4">
          <div v-for="classificazione in classificazioni" :key="classificazione.value" class="flex items-center">
            <input 
              type="radio" 
              :id="classificazione.value" 
              name="classificazione" 
              :value="classificazione.value" 
              v-model="nuovaClassificazione" 
              class="mr-2"
            />
            <label :for="classificazione.value">
              {{ classificazione.label }}
            </label>
          </div>
        </div>
        <div class="mt-6 flex justify-end gap-2">
          <button 
            @click="showClassificazioneModal = false" 
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Annulla
          </button>
          <button 
            @click="updateClassificazione" 
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Aggiorna
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useClientiStore, Cliente } from '@/stores/clienti';
import { useToast } from '@/composables/useToast';
import AppuntamentiStorico from '@/components/clienti/AppuntamentiStorico.vue';
import StatisticheCliente from '@/components/clienti/StatisticheCliente.vue';

const route = useRoute();
const router = useRouter();
const clientiStore = useClientiStore();
const toast = useToast();

const loading = ref(true);
const cliente = ref<Cliente | null>(null);
const showClassificazioneModal = ref(false);
const nuovaClassificazione = ref('');

const classificazioni = [
  { value: 'nuovo', label: 'Nuovo cliente' },
  { value: 'attivo', label: 'Cliente attivo' },
  { value: 'fedele', label: 'Cliente fedele' },
  { value: 'inattivo', label: 'Cliente inattivo' }
];

const formatDate = (date: string | Date | undefined) => {
  if (!date) return null;
  return new Date(date).toLocaleDateString('it-IT');
};

const classificazioneLabel = (classificazione: string) => {
  switch(classificazione) {
    case 'nuovo': return 'Nuovo cliente';
    case 'attivo': return 'Cliente attivo';
    case 'fedele': return 'Cliente fedele';
    case 'inattivo': return 'Cliente inattivo';
    default: return classificazione;
  }
};

const callClient = () => {
  if (cliente.value?.telefono) {
    window.open(`tel:${cliente.value.telefono}`);
  }
};

const emailClient = () => {
  if (cliente.value?.email) {
    window.open(`mailto:${cliente.value.email}`);
  }
};

const deleteClient = async () => {
  if (!cliente.value) return;
  
  if (confirm(`Sei sicuro di voler eliminare il cliente ${cliente.value.nome} ${cliente.value.cognome}?`)) {
    try {
      await clientiStore.deleteCliente(cliente.value._id);
      toast.success('Cliente eliminato con successo');
      router.push('/clienti');
    } catch (error) {
      console.error('Errore nell\'eliminazione del cliente:', error);
      toast.error('Errore nell\'eliminazione del cliente: ' + (error.response?.data?.message || error.message || 'Errore sconosciuto'));
    }
  }
};

const updateClassificazione = async () => {
  if (!cliente.value || !nuovaClassificazione.value) return;
  
  try {
    await clientiStore.updateCliente(cliente.value._id, { 
      classificazione: nuovaClassificazione.value as 'nuovo' | 'attivo' | 'fedele' | 'inattivo' 
    });
    
    // Aggiorna il cliente locale
    cliente.value.classificazione = nuovaClassificazione.value as any;
    showClassificazioneModal.value = false;
    toast.success('Classificazione cliente aggiornata');
  } catch (error) {
    console.error('Errore nell\'aggiornamento della classificazione:', error);
    toast.error('Errore nell\'aggiornamento della classificazione');
  }
};

const fetchClienteData = async () => {
  try {
    cliente.value = await clientiStore.fetchClienteById(route.params.id as string);
    if (cliente.value) {
      nuovaClassificazione.value = cliente.value.classificazione;
    }
  } catch (error) {
    console.error('Errore nel caricamento del cliente:', error);
    toast.error('Impossibile caricare i dati del cliente');
  } finally {
    loading.value = false;
  }
};

onMounted(fetchClienteData);
</script>
