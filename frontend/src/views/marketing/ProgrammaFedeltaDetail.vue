<template>
  <div class="space-y-6">
    <!-- Loading -->
    <div v-if="loading" class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <div class="flex justify-center items-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span class="ml-3 text-gray-600">Caricamento programma fedeltà...</span>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div v-else-if="programma">
      <!-- Header Section -->
      <div class="sm:flex sm:items-center sm:justify-between">
        <div class="sm:flex-auto">
          <div class="flex items-center">
            <button 
              @click="router.go(-1)"
              class="mr-4 p-2 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">
                {{ programma.cliente.nome }} {{ programma.cliente.cognome }}
              </h1>
              <div class="mt-1 flex items-center space-x-2">
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="programma.attivo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                >
                  {{ programma.attivo ? 'Attivo' : 'Inattivo' }}
                </span>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {{ programma.livello }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <div class="flex space-x-3">
            <button 
              @click="editProgramma"
              class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Modifica
            </button>
            <button 
              @click="toggleProgramma"
              class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg v-if="programma.attivo" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h6m2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {{ programma.attivo ? 'Disattiva' : 'Attiva' }}
            </button>
            <button 
              @click="openDeleteConfirm"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Elimina
            </button>
          </div>
        </div>
      </div>

      <!-- Statistiche -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div class="bg-white shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="p-3 rounded-full bg-purple-100">
                  <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Membri Attivi
                  </dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {{ statistiche.membriAttivi || 0 }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="p-3 rounded-full bg-yellow-100">
                  <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Punti Distribuiti
                  </dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {{ statistiche.puntiDistribuiti || 0 }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="p-3 rounded-full bg-blue-100">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Premi Riscattati
                  </dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {{ statistiche.premiRiscattati || 0 }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="p-3 rounded-full bg-green-100">
                  <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Fatturato Generato
                  </dt>
                  <dd class="text-lg font-medium text-gray-900">
                    €{{ (statistiche.fatturatoGenerato || 0).toFixed(2) }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Informazioni Programma -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Informazioni Programma</h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-sm font-medium text-gray-500">Descrizione:</span>
                <span class="text-sm text-gray-900">{{ programma.cliente.email || 'Nessuna descrizione' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm font-medium text-gray-500">Tipo Punti:</span>
                <span class="text-sm text-gray-900">Per Spesa</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm font-medium text-gray-500">Punti per Euro:</span>
                <span class="text-sm text-gray-900">1</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm font-medium text-gray-500">Data Creazione:</span>
                <span class="text-sm text-gray-900">{{ formatDate(programma.createdAt) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm font-medium text-gray-500">Ultimo Aggiornamento:</span>
                <span class="text-sm text-gray-900">{{ formatDate(programma.updatedAt) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Regole -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Regole e Configurazioni</h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-sm font-medium text-gray-500">Scadenza Punti:</span>
                <span class="text-sm text-gray-900">
                  Mai
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm font-medium text-gray-500">Punti Minimi Riscatto:</span>
                <span class="text-sm text-gray-900">100</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm font-medium text-gray-500">Max Punti al Giorno:</span>
                <span class="text-sm text-gray-900">
                  Illimitati
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm font-medium text-gray-500">Max Sconto per Ordine:</span>
                <span class="text-sm text-gray-900">20%</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm font-medium text-gray-500">Cumulabile con Promozioni:</span>
                <span class="text-sm text-gray-900">Sì</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm font-medium text-gray-500">Assegnazione Automatica:</span>
                <span class="text-sm text-gray-900">Sì</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Livelli -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Livello Attuale</h3>
          <div class="grid grid-cols-1 gap-4">
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div class="flex justify-between items-center mb-3">
                <h4 class="text-base font-medium text-gray-900 capitalize">{{ programma.livello }}</h4>
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getLivelloColor(programma.livello)"
                >
                  {{ programma.livello }}
                </span>
              </div>
              <div class="space-y-2">
                <div class="flex items-center text-sm text-gray-600">
                  <svg class="w-4 h-4 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {{ programma.punti }} punti attuali
                </div>
                <div class="flex items-center text-sm text-gray-600">
                  <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  {{ programma.puntiTotaliGuadagnati }} punti totali guadagnati
                </div>
                <div class="flex items-center text-sm text-gray-600">
                  <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  {{ programma.puntiUtilizzati }} punti utilizzati
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Membri del Programma -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Membri del Programma</h3>
            <button 
              @click="loadMembri"
              class="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Aggiorna
            </button>
          </div>
          
          <div v-if="loadingMembri" class="flex justify-center items-center py-8">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span class="ml-3 text-sm text-gray-600">Caricamento membri...</span>
          </div>
          
          <div v-else-if="membri.length === 0" class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            <p class="mt-2 text-sm text-gray-500">Nessun membro nel programma</p>
          </div>
          
          <div v-else class="overflow-hidden">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Livello</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Punti</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Iscrizione</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Azioni</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="membro in membri.slice(0, 10)" :key="membro._id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div class="text-sm font-medium text-gray-900">
                          {{ membro.cliente.nome }} {{ membro.cliente.cognome }}
                        </div>
                        <div class="text-sm text-gray-500">{{ membro.cliente.email }}</div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {{ membro.livelloAttuale }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {{ membro.puntiAttuali }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ formatDate(membro.dataIscrizione) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        @click="viewCliente(membro.cliente._id)"
                        class="text-blue-600 hover:text-blue-900"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div v-if="membri.length > 10" class="bg-gray-50 px-6 py-3 border-t border-gray-200">
              <div class="flex justify-between items-center">
                <p class="text-sm text-gray-700">
                  Visualizzati 10 di {{ membri.length }} membri
                </p>
                <button 
                                  @click="viewAllMembri"
                  class="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Vedi tutti
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <div class="text-center py-8">
          <svg class="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h2 class="mt-4 text-lg font-medium text-gray-900">Programma non trovato</h2>
          <p class="mt-2 text-sm text-gray-500">Il programma fedeltà richiesto non esiste.</p>
          <div class="mt-6">
            <button 
              @click="router.push({ name: 'ProgrammiFedelta' })"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Torna alla lista
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <ProgrammaFedeltaForm
      v-if="showEditForm"
      :programma="programma"
      @close="showEditForm = false"
      @saved="onProgrammaUpdated"
    />

    <!-- Delete Confirm Modal -->
    <DeleteConfirmModal
      :model-value="showDeleteConfirm"
      title="Conferma Eliminazione"
      :message="`Sei sicuro di voler eliminare questo programma fedeltà?`"
      warning-text="Questa operazione eliminerà definitivamente il programma e tutti i dati associati."
      @confirm="deleteProgramma"
      @update:model-value="showDeleteConfirm = $event"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProgrammaFedeltaStore } from '../../stores/programmaFedelta'
import { useNotificationStore } from '../../stores/notifications'
import ProgrammaFedeltaForm from './ProgrammaFedeltaForm.vue'
import DeleteConfirmModal from '@/components/common/DeleteConfirmModal.vue'
import type { ProgrammaFedelta } from '../../services/programmaFedelta.service'

export default defineComponent({
  name: 'ProgrammaFedeltaDetail',
  components: {
    ProgrammaFedeltaForm,
    DeleteConfirmModal
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const programmaFedeltaStore = useProgrammaFedeltaStore()
    const notificationStore = useNotificationStore()
    
    // Reactive state
    const loading = ref(false)
    const loadingMembri = ref(false)
    const programma = ref<ProgrammaFedelta | null>(null)
    const statistiche = ref<any>({})
    const membri = ref<any[]>([])
    const showEditForm = ref(false)
    const showDeleteConfirm = ref(false)
    
    // Load programma data
    const loadProgramma = async () => {
      const id = route.params.id as string
      if (!id) return
      
      try {
        loading.value = true
        programma.value = await programmaFedeltaStore.fetchProgrammaById(id)
        
        // Load statistiche (mock data for now)
        statistiche.value = {
          membriAttivi: 1,
          puntiDistribuiti: programma.value?.puntiTotaliGuadagnati || 0,
          premiRiscattati: programma.value?.premiUtilizzati?.length || 0,
          fatturatoGenerato: programma.value?.statistiche?.spesaTotale || 0
        }
      } catch (error) {
        notificationStore.error('Errore nel caricamento del programma')
      } finally {
        loading.value = false
      }
    }
    
    // Load membri data
    const loadMembri = async () => {
      if (!programma.value) return
      
      try {
        loadingMembri.value = true
        // Mock data for now - implement based on backend
        membri.value = [
          {
            _id: '1',
            cliente: programma.value.cliente,
            puntiAttuali: programma.value.punti,
            livelloAttuale: programma.value.livello,
            dataIscrizione: programma.value.createdAt,
            dataUltimaAttivita: programma.value.updatedAt
          }
        ]
      } catch (error) {
        notificationStore.error('Errore nel caricamento dei membri')
      } finally {
        loadingMembri.value = false
      }
    }
    
    // Edit programma
    const editProgramma = () => {
      showEditForm.value = true
    }
    
    // Toggle programma status
    const toggleProgramma = async () => {
      if (!programma.value) return
      
      try {
        const newStatus = !programma.value.attivo
        await programmaFedeltaStore.updateProgramma(programma.value._id, { attivo: newStatus })
        notificationStore.success(`Programma ${newStatus ? 'attivato' : 'disattivato'} con successo`)
        await loadProgramma()
      } catch (error) {
        notificationStore.error('Errore nell\'aggiornamento del programma')
      }
    }
    
    // Delete confirmation
    const openDeleteConfirm = () => {
      showDeleteConfirm.value = true
    }
    
    // Delete programma
    const deleteProgramma = async () => {
      if (!programma.value) return
      
      try {
        await programmaFedeltaStore.deleteProgramma(programma.value._id)
        notificationStore.success('Programma eliminato con successo')
        router.push({ name: 'ProgrammiFedelta' })
      } catch (error) {
        notificationStore.error('Errore nell\'eliminazione del programma')
      }
    }
    
    // Handle form updates
    const onProgrammaUpdated = () => {
      showEditForm.value = false
      loadProgramma()
    }
    
    // View all membri (placeholder)
    const viewAllMembri = () => {
      // Navigate to membri list or open modal
      notificationStore.info('Funzionalità in sviluppo')
    }
    
    // View cliente details (placeholder)
    const viewCliente = (clienteId: string) => {
      // Navigate to cliente detail page
      router.push({ name: 'ClienteDetail', params: { id: clienteId } })
    }
    
    // Utility functions
    const formatDate = (date: string) => {
      return new Date(date).toLocaleDateString('it-IT')
    }
    
    const getTipoLabel = (tipo: string) => {
      const labels = {
        spesa: 'Per Spesa',
        visite: 'Per Visite',
        servizi: 'Per Servizi'
      }
      return labels[tipo as keyof typeof labels] || tipo
    }
    
    const getLivelloColor = (livello: string) => {
      const colors = {
        bronzo: 'bg-amber-100 text-amber-800',
        argento: 'bg-gray-100 text-gray-800',
        oro: 'bg-yellow-100 text-yellow-800',
        platino: 'bg-purple-100 text-purple-800'
      }
      return colors[livello as keyof typeof colors] || 'bg-gray-100 text-gray-800'
    }
    
    // Load data on mount
    onMounted(() => {
      loadProgramma()
    })
    
    // Watch for programma changes to load membri
    watch(programma, (newProgramma) => {
      if (newProgramma) {
        loadMembri()
      }
    })
    
    return {
      loading,
      loadingMembri,
      programma,
      statistiche,
      membri,
      showEditForm,
      showDeleteConfirm,
      router,
      loadProgramma,
      loadMembri,
      editProgramma,
      toggleProgramma,
      openDeleteConfirm,
      deleteProgramma,
      onProgrammaUpdated,
      viewAllMembri,
      viewCliente,
      formatDate,
      getTipoLabel,
      getLivelloColor
    }
  }
})
</script>
