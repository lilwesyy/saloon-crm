<template>
  <div class="container mx-auto px-4 py-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">
        {{ isEditing ? 'Modifica Cliente' : 'Nuovo Cliente' }}
      </h1>
      <router-link 
        to="/clienti" 
        class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
      >
        Torna alla Lista
      </router-link>
    </div>
    
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <form @submit.prevent="handleSubmit" class="p-6">
        <!-- Sezione foto profilo -->
        <div class="mb-8 flex flex-col items-center">
          <div class="w-24 h-24 relative mb-2">
            <img 
              v-if="previewImage || cliente.fotoProfilo" 
              :src="previewImage || cliente.fotoProfilo" 
              alt="Foto profilo" 
              class="w-full h-full object-cover rounded-full border-2 border-gray-200"
            />
            <div 
              v-else 
              class="w-full h-full flex items-center justify-center bg-gray-100 rounded-full border-2 border-gray-200 text-gray-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <label 
              for="foto" 
              class="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 cursor-pointer hover:bg-blue-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </label>
            <input 
              id="foto" 
              type="file" 
              accept="image/*" 
              @change="handleFileUpload" 
              class="hidden"
            />
          </div>
          <span class="text-sm text-gray-500">{{ previewImage ? 'Foto selezionata' : 'Aggiungi foto profilo' }}</span>
        </div>

        <div class="grid gap-6 md:grid-cols-2">
          <div>
            <label for="nome" class="block text-sm font-medium text-gray-700 mb-2">Nome *</label>
            <input 
              id="nome"
              v-model="cliente.nome" 
              type="text" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          
          <div>
            <label for="cognome" class="block text-sm font-medium text-gray-700 mb-2">Cognome *</label>
            <input 
              id="cognome"
              v-model="cliente.cognome" 
              type="text" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          
          <div>
            <label for="telefono" class="block text-sm font-medium text-gray-700 mb-2">Telefono *</label>
            <input 
              id="telefono"
              v-model="cliente.telefono" 
              type="tel" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input 
              id="email"
              v-model="cliente.email" 
              type="email"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          
          <div>
            <label for="dataNascita" class="block text-sm font-medium text-gray-700 mb-2">Data di Nascita</label>
            <input 
              id="dataNascita"
              v-model="cliente.dataNascita" 
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>

          <div>
            <label for="classificazione" class="block text-sm font-medium text-gray-700 mb-2">Classificazione</label>
            <select
              id="classificazione"
              v-model="cliente.classificazione"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="nuovo">Nuovo</option>
              <option value="attivo">Attivo</option>
              <option value="fedele">Fedele</option>
              <option value="inattivo">Inattivo</option>
            </select>
          </div>
        </div>

        <!-- Indirizzo -->
        <div class="mt-6">
          <h3 class="text-lg font-medium text-gray-900 mb-3">Indirizzo</h3>
          <div class="grid gap-6 md:grid-cols-2">
            <div>
              <label for="via" class="block text-sm font-medium text-gray-700 mb-2">Via</label>
              <input 
                id="via"
                v-model="cliente.indirizzo.via" 
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
            
            <div>
              <label for="citta" class="block text-sm font-medium text-gray-700 mb-2">Città</label>
              <input 
                id="citta"
                v-model="cliente.indirizzo.citta" 
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
            
            <div>
              <label for="cap" class="block text-sm font-medium text-gray-700 mb-2">CAP</label>
              <input 
                id="cap"
                v-model="cliente.indirizzo.cap" 
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
            
            <div>
              <label for="provincia" class="block text-sm font-medium text-gray-700 mb-2">Provincia</label>
              <input 
                id="provincia"
                v-model="cliente.indirizzo.provincia" 
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
          </div>
        </div>
        
        <div class="mt-6">
          <label for="note" class="block text-sm font-medium text-gray-700 mb-2">Note</label>
          <textarea 
            id="note"
            v-model="cliente.note" 
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <!-- Consensi -->
        <div class="mt-6">
          <h3 class="text-lg font-medium text-gray-900 mb-3">Consensi</h3>
          <div class="space-y-4">
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input
                  id="consensoPrivacy"
                  v-model="cliente.consensoPrivacy"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
              <div class="ml-3 text-sm">
                <label for="consensoPrivacy" class="font-medium text-gray-700">Consenso Privacy</label>
                <p class="text-gray-500">Il cliente acconsente al trattamento dei dati personali.</p>
              </div>
            </div>
            
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input
                  id="consensoMarketing"
                  v-model="cliente.consensoMarketing"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
              <div class="ml-3 text-sm">
                <label for="consensoMarketing" class="font-medium text-gray-700">Consenso Marketing</label>
                <p class="text-gray-500">Il cliente acconsente a ricevere comunicazioni promozionali.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="mt-8 flex gap-4">
          <button 
            type="submit" 
            :disabled="loading"
            class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {{ loading ? 'Salvando...' : (isEditing ? 'Aggiorna' : 'Crea') }}
          </button>
          <router-link 
            to="/clienti" 
            class="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Annulla
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useClientiStore } from '@/stores/clienti';
import { useToast } from '@/composables/useToast';

const route = useRoute();
const router = useRouter();
const clientiStore = useClientiStore();
const toast = useToast();

const loading = ref(false);
const isEditing = computed(() => !!route.params.id);
const previewImage = ref<string | null>(null);
const fileToUpload = ref<File | null>(null);

const cliente = ref({
  nome: '',
  cognome: '',
  telefono: '',
  email: '',
  dataNascita: '',
  note: '',
  consensoPrivacy: false,
  consensoMarketing: false,
  fotoProfilo: '',
  classificazione: 'nuovo' as 'nuovo' | 'attivo' | 'fedele' | 'inattivo',
  indirizzo: {
    via: '',
    citta: '',
    cap: '',
    provincia: ''
  }
});

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    fileToUpload.value = input.files[0];
    previewImage.value = URL.createObjectURL(input.files[0]);
  }
};

const handleSubmit = async () => {
  loading.value = true;
  try {
    let clienteId;
    
    if (isEditing.value) {
      const clienteAggiornato = await clientiStore.updateCliente(route.params.id as string, cliente.value);
      clienteId = clienteAggiornato._id;
      toast.success('Cliente aggiornato con successo');
    } else {
      const nuovoCliente = await clientiStore.createCliente(cliente.value);
      clienteId = nuovoCliente._id;
      toast.success('Cliente creato con successo');
    }
    
    // Se è stata selezionata una foto, caricala
    if (fileToUpload.value && clienteId) {
      await clientiStore.uploadFoto(clienteId, fileToUpload.value);
      toast.info('Foto profilo aggiornata');
    }
    
    router.push('/clienti');
  } catch (error) {
    console.error('Errore nel salvare il cliente:', error);
    toast.error('Errore nel salvare il cliente: ' + (error.message || 'Errore sconosciuto'));
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  if (isEditing.value) {
    try {
      const clienteData = await clientiStore.fetchClienteById(route.params.id as string);
      if (clienteData) {
        // Assicurati che l'indirizzo esista
        if (!clienteData.indirizzo) {
          clienteData.indirizzo = {
            via: '',
            citta: '',
            cap: '',
            provincia: ''
          };
        }
        cliente.value = { ...clienteData };
      }
    } catch (error) {
      console.error('Errore nel caricamento del cliente:', error);
    }
  }
});
</script>
