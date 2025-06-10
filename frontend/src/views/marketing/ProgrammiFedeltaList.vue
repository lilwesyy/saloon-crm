<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-between">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-bold text-gray-900">Programmi Fedeltà</h1>
        <p class="mt-2 text-sm text-gray-700">Gestisci i programmi di fidelizzazione dei clienti</p>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <button 
          type="button"
          class="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          @click="showProgrammaForm = true"
        >
          <svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Nuovo Programma
        </button>
      </div>
    </div>

    <!-- Statistiche generali -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="p-3 rounded-full bg-purple-100">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Programmi Attivi</dt>
                <dd class="text-lg font-medium text-gray-900">{{ statistics?.totalPrograms || 0 }}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-5 py-3">
          <div class="text-sm">
            <span class="font-medium text-gray-500">Totale programmi nel sistema</span>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="p-3 rounded-full bg-blue-100">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Membri Totali</dt>
                <dd class="text-lg font-medium text-gray-900">{{ statistics?.totalMembers || 0 }}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-5 py-3">
          <div class="text-sm">
            <span class="font-medium text-gray-500">Clienti iscritti ai programmi</span>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="p-3 rounded-full bg-green-100">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Premi Riscattati</dt>
                <dd class="text-lg font-medium text-gray-900">{{ statistics?.totalRewards || 0 }}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-5 py-3">
          <div class="text-sm">
            <span class="font-medium text-gray-500">Premi utilizzati dai clienti</span>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
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
                <dt class="text-sm font-medium text-gray-500 truncate">Punti Distribuiti</dt>
                <dd class="text-lg font-medium text-gray-900">{{ statistics?.totalPointsIssued || 0 }}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-5 py-3">
          <div class="text-sm">
            <span class="font-medium text-gray-500">Punti totali assegnati</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtri -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Filtri</h3>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <label for="stato" class="block text-sm font-medium text-gray-700">Stato</label>
            <select 
              id="stato"
              v-model="filters.attivo" 
              @change="loadProgrammi"
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">Tutti</option>
              <option value="true">Attivi</option>
              <option value="false">Inattivi</option>
            </select>
          </div>
          <div>
            <label for="tipo" class="block text-sm font-medium text-gray-700">Tipo</label>
            <select 
              id="tipo"
              v-model="filters.tipoPunti" 
              @change="loadProgrammi"
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">Tutti i tipi</option>
              <option value="spesa">Per Spesa</option>
              <option value="visite">Per Visite</option>
              <option value="servizi">Per Servizi</option>
            </select>
          </div>
          <div>
            <label for="search" class="block text-sm font-medium text-gray-700">Cerca</label>
            <input 
              type="text" 
              id="search"
              v-model="filters.search" 
              placeholder="Cerca programmi..."
              @input="debouncedSearch"
              class="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <div class="flex justify-center items-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span class="ml-3 text-gray-600">Caricamento programmi...</span>
        </div>
      </div>
    </div>

    <!-- Lista programmi -->
    <div v-else>
      <div v-if="programmi.length === 0" class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <h3 class="mt-4 text-lg font-medium text-gray-900">Nessun programma fedeltà</h3>
            <p class="mt-2 text-sm text-gray-500">Crea il tuo primo programma di fidelizzazione</p>
          </div>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <div 
          v-for="programma in programmi" 
          :key="programma._id"
          class="bg-white overflow-hidden shadow rounded-lg"
          :class="{ 'opacity-75': !programma.attivo }"
        >
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-medium text-gray-900 truncate">{{ programma.nome }}</h3>
                <p class="mt-1 text-sm text-gray-500 line-clamp-2">{{ programma.descrizione || 'Nessuna descrizione' }}</p>
              </div>
              <span 
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-3"
                :class="programma.attivo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
              >
                {{ programma.attivo ? 'Attivo' : 'Inattivo' }}
              </span>
            </div>

            <div class="space-y-3 mb-4">
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Tipo:</span>
                <span class="font-medium text-gray-900">{{ getTipoLabel(programma.tipoPunti) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Punti per Euro:</span>
                <span class="font-medium text-gray-900">{{ programma.puntiPerEuro || 1 }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Membri:</span>
                <span class="font-medium text-gray-900">{{ programma.statistiche?.membriAttivi || 0 }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Punti Distribuiti:</span>
                <span class="font-medium text-gray-900">{{ programma.statistiche?.puntiDistribuiti || 0 }}</span>
              </div>
            </div>

            <div class="mb-4">
              <h4 class="text-sm font-medium text-gray-900 mb-2">Livelli ({{ programma.livelli?.length || 0 }})</h4>
              <div class="flex flex-wrap gap-1">
                <span 
                  v-for="livello in (programma.livelli || []).slice(0, 3)" 
                  :key="livello.nome"
                  class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {{ livello.nome }}
                </span>
                <span v-if="(programma.livelli?.length || 0) > 3" class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                  +{{ (programma.livelli?.length || 0) - 3 }}
                </span>
              </div>
            </div>

            <div class="flex flex-wrap gap-2">
              <button 
                class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                @click="viewProgramma(programma)"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Dettagli
              </button>
              <button 
                class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                @click="editProgramma(programma)"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Modifica
              </button>
              <button 
                class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                @click="toggleProgramma(programma)"
              >
                <svg v-if="programma.attivo" class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <svg v-else class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h6m2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {{ programma.attivo ? 'Disattiva' : 'Attiva' }}
              </button>
              <button 
                class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                @click="confirmDeleteProgramma(programma)"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Form -->
    <ProgrammaFedeltaForm
      v-if="showProgrammaForm"
      :programma="selectedProgramma as any"
      @close="closeProgrammaForm"
      @saved="onProgrammaSaved"
    />

    <!-- Modal conferma eliminazione -->
    <DeleteConfirmModal
      :model-value="showDeleteModal"
      title="Conferma Eliminazione"
      :message="`Sei sicuro di voler eliminare il programma '${programmaToDelete?.nome || ''}'?`"
      warning-text="Questa operazione eliminerà definitivamente il programma e tutti i dati associati."
      @confirm="confirmDelete"
      @update:model-value="showDeleteModal = $event"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// Use correct import paths for the store
import { useProgrammaFedeltaStore } from '@/stores/programmaFedelta'
import { useNotificationStore } from '@/stores/notifications'
import DeleteConfirmModal from '@/components/common/DeleteConfirmModal.vue'
import ProgrammaFedeltaForm from './ProgrammaFedeltaForm.vue'

// Define the ProgrammaFedelta type if it doesn't exist
interface ProgrammaFedelta {
  _id: string;
  nome: string;
  descrizione?: string;
  attivo: boolean;
  [key: string]: any;
}

export default defineComponent({
  name: 'ProgrammiFedeltaList',
  components: {
    ProgrammaFedeltaForm,
    DeleteConfirmModal
  },
  setup() {
    const programmaStore = useProgrammaFedeltaStore()
    const notificationStore = useNotificationStore()
    const router = useRouter()
    const route = useRoute()

    const loading = ref(false)
    const showProgrammaForm = ref(false)
    const selectedProgramma = ref<ProgrammaFedelta | null>(null)

    // Add state for delete confirmation modal
    const showDeleteModal = ref(false)
    const programmaToDelete = ref<ProgrammaFedelta | null>(null)

    const filters = ref({
      attivo: '',
      tipoPunti: '',
      search: '',
      page: 1,
      limit: 10
    })

    const programmi = computed(() => programmaStore.programmi)
    const statistics = computed(() => programmaStore.statistics)

    // Simple debounced search implementation
    const debouncedSearch = (() => {
      let timeout: number | null = null;
      return () => {
        if (timeout) clearTimeout(timeout);
        timeout = window.setTimeout(() => {
          loadProgrammi();
          timeout = null;
        }, 500);
      };
    })()

    const loadProgrammi = async () => {
      loading.value = true
      try {
        await programmaStore.fetchProgrammi(filters.value)
        await programmaStore.fetchStatistics()
      } catch (error) {
        notificationStore.error('Errore nel caricamento dei programmi fedeltà')
      } finally {
        loading.value = false
      }
    }

    const getTipoLabel = (tipo: string) => {
      const labels = {
        spesa: 'Per Spesa',
        visite: 'Per Visite',
        servizi: 'Per Servizi'
      }
      return labels[tipo as keyof typeof labels] || tipo
    }

    const viewProgramma = (programma: ProgrammaFedelta) => {
      // Navigate to detail view
      // router.push({ name: 'DettaglioProgrammaFedelta', params: { id: programma._id } })
    }

    const editProgramma = (programma: ProgrammaFedelta) => {
      selectedProgramma.value = programma
      showProgrammaForm.value = true
    }

    const toggleProgramma = async (programma: ProgrammaFedelta) => {
      try {
        if (programma.attivo) {
          await programmaStore.disattivaProgramma(programma._id)
          notificationStore.success('Programma disattivato con successo')
        } else {
          await programmaStore.attivaProgramma(programma._id)
          notificationStore.success('Programma attivato con successo')
        }
        await loadProgrammi()
      } catch (error) {
        notificationStore.error('Errore nell\'aggiornamento del programma')
      }
    }

    const confirmDeleteProgramma = (programma: ProgrammaFedelta) => {
      programmaToDelete.value = programma
      showDeleteModal.value = true
    }

    const confirmDelete = async () => {
      if (!programmaToDelete.value) return

      try {
        await programmaStore.deleteProgramma(programmaToDelete.value._id)
        notificationStore.success('Programma eliminato con successo')
        await loadProgrammi()
      } catch (error) {
        notificationStore.error('Errore nell\'eliminazione del programma')
      } finally {
        showDeleteModal.value = false
        programmaToDelete.value = null
      }
    }

    const closeProgrammaForm = () => {
      showProgrammaForm.value = false
      selectedProgramma.value = null
    }

    const onProgrammaSaved = () => {
      closeProgrammaForm()
      loadProgrammi()
    }

    onMounted(() => {
      loadProgrammi()
    })

    return {
      loading,
      showProgrammaForm,
      selectedProgramma,
      showDeleteModal,
      programmaToDelete,
      filters,
      programmi,
      statistics,
      debouncedSearch,
      loadProgrammi,
      getTipoLabel,
      viewProgramma,
      editProgramma,
      toggleProgramma,
      confirmDeleteProgramma,
      confirmDelete,
      closeProgrammaForm,
      onProgrammaSaved
    }
  }
})
</script>

<style scoped>
/* Utility class for line clamping */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
