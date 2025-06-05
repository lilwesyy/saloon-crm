<!-- filepath: /home/mirco/Documents/Dev/saloon-crm/frontend/src/views/marketing/CampagneList.vue -->
<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Campagne Marketing</h1>
        <p class="text-gray-600 mt-1">Gestisci le tue campagne email, SMS e promozionali</p>
      </div>
      <router-link to="/marketing/campagne/nuova"
        class="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
        <Plus class="h-5 w-5 mr-2" />
        Nuova Campagna
      </router-link>
    </div>

    <!-- Filtri -->
    <div class="bg-white rounded-lg shadow mb-6 p-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
          <select v-model="filtri.tipo" class="w-full border border-gray-300 rounded-md px-3 py-2">
            <option value="">Tutti i tipi</option>
            <option value="email">Email</option>
            <option value="sms">SMS</option>
            <option value="promozione">Promozione</option>
            <option value="compleanno">Compleanno</option>
            <option value="callback">Callback</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Stato</label>
          <select v-model="filtri.stato" class="w-full border border-gray-300 rounded-md px-3 py-2">
            <option value="">Tutti gli stati</option>
            <option value="bozza">Bozza</option>
            <option value="programmata">Programmata</option>
            <option value="in_corso">In Corso</option>
            <option value="completata">Completata</option>
            <option value="sospesa">Sospesa</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Cerca</label>
          <div class="relative">
            <input v-model="filtri.search" type="text" placeholder="Nome campagna..."
              class="w-full border border-gray-300 rounded-md px-3 py-2 pr-8" />
            <div v-if="loading" class="absolute right-2 top-1/2 transform -translate-y-1/2">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
        <div class="flex items-end">
          <button @click="resetFiltri"
            class="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors">
            Reset
          </button>
        </div>
      </div>
    </div>

    <!-- Statistiche rapide -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100">
            <Mail class="w-6 h-6 text-blue-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Campagne Totali</p>
            <p class="text-2xl font-semibold text-gray-900">{{ statistiche.totaleCampagne || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100">
            <Play class="w-6 h-6 text-green-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Attive</p>
            <p class="text-2xl font-semibold text-gray-900">{{ statistiche.campagneAttive || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-yellow-100">
            <Send class="w-6 h-6 text-yellow-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Invii Totali</p>
            <p class="text-2xl font-semibold text-gray-900">{{ statistiche.totaleInvii || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-purple-100">
            <Eye class="w-6 h-6 text-purple-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Aperture</p>
            <p class="text-2xl font-semibold text-gray-900">{{ statistiche.totaleAperture || 0 }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Lista campagne -->
    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <!-- Messaggio nessun risultato -->
      <div v-if="campagneFiltrate.length === 0" class="text-center py-12">
        <div class="text-gray-400 mb-4">
          <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m13-8v2a1 1 0 001 1h2m-6 0h2v6a2 2 0 002 2h.01M9 7h1m3 0h1m-5 3v3a1 1 0 001 1h1M9 7H6m3 0h1m5 0v5a1 1 0 01-1 1H9V7h5z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Nessuna campagna trovata</h3>
        <p class="text-gray-500 mb-4">
          {{ hasActiveFilters ? 'Non ci sono campagne che corrispondono ai filtri selezionati.' : 'Non hai ancora creato nessuna campagna.' }}
        </p>
        <button v-if="hasActiveFilters" @click="resetFiltri" 
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
          Rimuovi filtri
        </button>
        <router-link v-else to="/marketing/campagne/nuova"
                     class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
          <Plus class="h-4 w-4 mr-2" />
          Crea prima campagna
        </router-link>
      </div>

      <!-- Vista Mobile/Tablet - Cards -->
      <div v-if="campagneFiltrate.length > 0" class="block lg:hidden">
        <div class="space-y-4 p-4">
          <div v-for="campagna in campagneFiltrate" :key="campagna._id" 
               class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1 min-w-0">
                <h3 class="text-sm font-medium text-gray-900 truncate" :title="campagna.nome">
                  {{ campagna.nome }}
                </h3>
                <p class="text-xs text-gray-500 mt-1 line-clamp-2" :title="campagna.descrizione">
                  {{ campagna.descrizione }}
                </p>
              </div>
              <div class="flex items-center space-x-2 ml-3">
                <span :class="getTipoBadgeClass(campagna.tipo)"
                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                  {{ getTipoLabel(campagna.tipo) }}
                </span>
                <span :class="getStatoBadgeClass(campagna.stato)"
                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                  {{ getStatoLabel(campagna.stato) }}
                </span>
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4 text-xs text-gray-600 mb-3">
              <div>
                <span class="font-medium">Invii:</span> {{ campagna.statistiche?.invii || 0 }}
              </div>
              <div v-if="campagna.tipo === 'email'">
                <span class="font-medium">Aperture:</span> {{ campagna.statistiche?.aperture || 0 }}
              </div>
              <div v-if="campagna.tipo === 'sms'">
                <span class="font-medium">Risposte:</span> {{ campagna.statistiche?.risposte || 0 }}
              </div>
              <div>
                <span class="font-medium">Data:</span> {{ formatDateShort(campagna.createdAt) }}
              </div>
            </div>
            
            <div class="flex justify-end space-x-3">
              <router-link :to="`/marketing/campagne/${campagna._id}`" 
                           class="text-blue-600 hover:text-blue-900" title="Visualizza">
                <Eye class="w-4 h-4" />
              </router-link>
              
              <button v-if="campagna.stato === 'bozza'" @click="lanciaCampagna(campagna._id)"
                      class="text-green-600 hover:text-green-900" title="Lancia campagna">
                <Play class="w-4 h-4" />
              </button>
              
              <button v-if="campagna.stato === 'in_corso'" @click="sospendiCampagna(campagna._id)"
                      class="text-yellow-600 hover:text-yellow-900" title="Sospendi campagna">
                <Pause class="w-4 h-4" />
              </button>
              
              <router-link v-if="['bozza', 'programmata'].includes(campagna.stato)"
                           :to="`/marketing/campagne/${campagna._id}/edit`" 
                           class="text-gray-600 hover:text-gray-900" title="Modifica">
                <Edit class="w-4 h-4" />
              </router-link>
              
              <button @click="duplicaCampagna(campagna._id)" 
                      class="text-purple-600 hover:text-purple-900" title="Duplica">
                <Copy class="w-4 h-4" />
              </button>
              
              <button v-if="campagna.stato !== 'in_corso'" @click="() => eliminaCampagna(campagna)"
                      class="text-red-600 hover:text-red-900" title="Elimina">
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Vista Desktop - Tabella Compatta -->
      <div v-if="campagneFiltrate.length > 0" class="hidden lg:block">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                  Campagna
                </th>
                <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stato
                </th>
                <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statistiche
                </th>
                <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  Azioni
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="campagna in campagneFiltrate" :key="campagna._id" class="hover:bg-gray-50">
                <td class="px-4 py-3">
                  <div class="max-w-xs">
                    <div class="text-sm font-medium text-gray-900 truncate" :title="campagna.nome">
                      {{ campagna.nome }}
                    </div>
                    <div class="text-xs text-gray-500 truncate" :title="campagna.descrizione">
                      {{ campagna.descrizione }}
                    </div>
                  </div>
                </td>
                <td class="px-3 py-3 whitespace-nowrap">
                  <span :class="getTipoBadgeClass(campagna.tipo)"
                        class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                    {{ getTipoLabel(campagna.tipo) }}
                  </span>
                </td>
                <td class="px-3 py-3 whitespace-nowrap">
                  <span :class="getStatoBadgeClass(campagna.stato)"
                        class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                    {{ getStatoLabel(campagna.stato) }}
                  </span>
                </td>
                <td class="px-3 py-3 whitespace-nowrap text-xs text-gray-900">
                  <div class="space-y-1">
                    <div>{{ campagna.statistiche?.invii || 0 }} invii</div>
                    <div v-if="campagna.tipo === 'email'" class="text-blue-600">
                      {{ campagna.statistiche?.aperture || 0 }} aperture
                    </div>
                    <div v-if="campagna.tipo === 'sms'" class="text-green-600">
                      {{ campagna.statistiche?.risposte || 0 }} risposte
                    </div>
                  </div>
                </td>
                <td class="px-3 py-3 whitespace-nowrap text-xs text-gray-900">
                  {{ formatDateShort(campagna.createdAt) }}
                </td>
                <td class="px-3 py-3 whitespace-nowrap">
                  <div class="flex items-center justify-center space-x-2">
                    <router-link :to="`/marketing/campagne/${campagna._id}`" 
                                 class="text-blue-600 hover:text-blue-900 p-1" title="Visualizza">
                      <Eye class="w-4 h-4" />
                    </router-link>

                    <button v-if="campagna.stato === 'bozza'" @click="lanciaCampagna(campagna._id)"
                            class="text-green-600 hover:text-green-900 p-1" title="Lancia campagna">
                      <Play class="w-4 h-4" />
                    </button>

                    <button v-if="campagna.stato === 'in_corso'" @click="sospendiCampagna(campagna._id)"
                            class="text-yellow-600 hover:text-yellow-900 p-1" title="Sospendi campagna">
                      <Pause class="w-4 h-4" />
                    </button>

                    <router-link v-if="['bozza', 'programmata'].includes(campagna.stato)"
                                 :to="`/marketing/campagne/${campagna._id}/edit`" 
                                 class="text-gray-600 hover:text-gray-900 p-1" title="Modifica">
                      <Edit class="w-4 h-4" />
                    </router-link>

                    <div class="relative" @click.stop>
                      <button @click="toggleActionsMenu(campagna._id)"
                              class="text-gray-400 hover:text-gray-600 p-1" title="Altre azioni">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                      
                      <div v-if="activeActionsMenu === campagna._id" 
                           class="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                        <div class="py-1">
                          <button @click="duplicaCampagna(campagna._id); activeActionsMenu = null" 
                                  class="flex items-center w-full px-3 py-2 text-xs text-purple-600 hover:bg-gray-50">
                            <Copy class="w-3 h-3 mr-2" />
                            Duplica
                          </button>
                          <button v-if="campagna.stato !== 'in_corso'" 
                                  @click="() => { eliminaCampagna(campagna); activeActionsMenu = null }"
                                  class="flex items-center w-full px-3 py-2 text-xs text-red-600 hover:bg-gray-50">
                            <Trash2 class="w-3 h-3 mr-2" />
                            Elimina
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Paginazione -->
      <div v-if="campagneFiltrate.length > 0" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        <!-- Selettore risultati per pagina per mobile -->
        <div class="flex justify-center mb-4 sm:hidden">
          <div class="flex items-center space-x-1">
            <label class="text-sm text-gray-600">Risultati:</label>
            <select v-model.number="pagination.limit" class="border rounded px-1 py-0 text-sm">
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
            </select>
          </div>
        </div>
        
        <div class="flex items-center justify-between">
          <div class="flex-1 flex justify-between sm:hidden">
            <button @click="prevPage" :disabled="pagination.current === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
              Precedente
            </button>
            <button @click="nextPage" :disabled="pagination.current === pagination.pages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
              Successivo
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div class="flex items-center space-x-4">
              <p class="text-sm text-gray-700">
                Mostrando <span class="font-medium">{{ (pagination.current - 1) * pagination.limit + 1 }}</span> a
                <span class="font-medium">{{ Math.min(pagination.current * pagination.limit, pagination.total) }}</span> di
                <span class="font-medium">{{ pagination.total }}</span> risultati
              </p>
              <div class="flex items-center space-x-3">
                <label class="text-sm text-gray-700 whitespace-nowrap">Risultati per pagina:</label>
                <select v-model.number="pagination.limit" class="border border-gray-300 rounded-md px-3 py-2 text-sm min-w-[80px]">
                  <option :value="5">5</option>
                  <option :value="10">10</option>
                  <option :value="20">20</option>
                  <option :value="50">50</option>
                </select>
              </div>
            </div>
            <div v-if="pagination.pages > 1">
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button @click="prevPage" :disabled="pagination.current === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                  <ChevronLeft class="h-5 w-5" />
                </button>

                <button v-for="page in visiblePages" :key="page" @click="goToPage(page)" :class="[
                  'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                  page === pagination.current
                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                ]">
                  {{ page }}
                </button>

                <button @click="nextPage" :disabled="pagination.current === pagination.pages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                  <ChevronRight class="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal di conferma eliminazione -->
    <DeleteConfirmModal :modelValue="showDeleteModal" :title="'Conferma Eliminazione'"
      :message="'Sei sicuro di voler eliminare questa campagna?'"
      :warning-text="'Questa operazione eliminerà definitivamente la campagna e tutti i dati associati.'"
      @confirm="confirmDeleteCampagna" @cancel="showDeleteModal = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  PlusIcon as Plus,
  EnvelopeIcon as Mail,
  PlayIcon as Play,
  PaperAirplaneIcon as Send,
  EyeIcon as Eye,
  PauseIcon as Pause,
  PencilIcon as Edit,
  DocumentDuplicateIcon as Copy,
  TrashIcon as Trash2,
  ChevronLeftIcon as ChevronLeft,
  ChevronRightIcon as ChevronRight
} from '@heroicons/vue/24/outline'

import { useCampagneStore } from '@/stores/campagne'
import { useNotificationStore } from '@/stores/notifications'
import DeleteConfirmModal from '@/components/common/DeleteConfirmModal.vue'

const router = useRouter()
const campagneStore = useCampagneStore()
const notificationStore = useNotificationStore()

const loading = ref(false)
const campagne = ref([])
const statistiche = ref({
  totaleCampagne: 0,
  campagneAttive: 0,
  totaleInvii: 0,
  totaleAperture: 0
})
const pagination = ref({
  current: 1,
  pages: 1,
  total: 0,
  limit: 5
})

const filtri = ref({
  tipo: '',
  stato: '',
  search: ''
})

// Modal state
const showDeleteModal = ref(false)
const campagnaToDelete = ref(null)
const activeActionsMenu = ref(null)

// Ora le campagne sono già filtrate lato server, quindi restituiamo direttamente l'array
const campagneFiltrate = computed(() => {
  return campagne.value
})

const hasActiveFilters = computed(() => {
  return filtri.value.tipo || filtri.value.stato || filtri.value.search
})

const visiblePages = computed(() => {
  const pages = []
  const current = pagination.value.current
  const total = pagination.value.pages

  const start = Math.max(1, current - 2)
  const end = Math.min(total, current + 2)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

const loadCampagne = async () => {
  try {
    loading.value = true
    
    // Prepara i parametri di query includendo i filtri
    const queryParams: any = {
      page: pagination.value.current,
      limit: pagination.value.limit
    }
    
    // Aggiungi i filtri solo se hanno valori
    if (filtri.value.tipo) {
      queryParams.tipo = filtri.value.tipo
    }
    
    if (filtri.value.stato) {
      queryParams.stato = filtri.value.stato
    }
    
    if (filtri.value.search) {
      queryParams.search = filtri.value.search
    }
    
    const response = await campagneStore.fetchCampagne(queryParams)

    campagne.value = response.campagne
    
    // Salva il limit corrente per non perderlo
    const currentLimit = pagination.value.limit
    pagination.value = response.pagination
    
    // Ripristina il limit se non è presente nella risposta
    if (!pagination.value.limit) {
      pagination.value.limit = currentLimit
    }
    
    // Debug: vediamo cosa arriva dal backend
    console.log('Response from backend:', response)
    console.log('Pagination data:', response.pagination)
    
    // Fallback per dati di paginazione mancanti
    if (!pagination.value.pages) {
      pagination.value.pages = Math.ceil(pagination.value.total / pagination.value.limit) || 1
    }
    if (!pagination.value.current) {
      pagination.value.current = 1
    }
  } catch (error) {
    notificationStore.add({
      type: 'error',
      message: 'Errore nel caricamento delle campagne'
    })
  } finally {
    loading.value = false
  }
}

const loadStatistiche = async () => {
  try {
    statistiche.value = await campagneStore.fetchStatistiche()
  } catch (error) {
    console.error('Errore nel caricamento delle statistiche:', error)
  }
}

const lanciaCampagna = async (id: string) => {
  try {
    await campagneStore.lanciaCampagna(id)
    notificationStore.add({
      type: 'success',
      message: 'Campagna lanciata con successo'
    })
    await loadCampagne()
  } catch (error) {
    notificationStore.add({
      type: 'error',
      message: 'Errore nel lancio della campagna'
    })
  }
}

const sospendiCampagna = async (id: string) => {
  try {
    await campagneStore.sospendiCampagna(id)
    notificationStore.add({
      type: 'success',
      message: 'Campagna sospesa con successo'
    })
    await loadCampagne()
  } catch (error) {
    notificationStore.add({
      type: 'error',
      message: 'Errore nella sospensione della campagna'
    })
  }
}

const duplicaCampagna = async (id: string) => {
  try {
    await campagneStore.duplicaCampagna(id)
    notificationStore.add({
      type: 'success',
      message: 'Campagna duplicata con successo'
    })
    await loadCampagne()
  } catch (error) {
    notificationStore.add({
      type: 'error',
      message: 'Errore nella duplicazione della campagna'
    })
  }
}

const eliminaCampagna = async (campagna) => {
  campagnaToDelete.value = campagna
  showDeleteModal.value = true
}

const confirmDeleteCampagna = async () => {
  if (!campagnaToDelete.value) return

  try {
    await campagneStore.deleteCampagna(campagnaToDelete.value._id)
    notificationStore.add({
      type: 'success',
      message: 'Campagna eliminata con successo'
    })
    await loadCampagne()
  } catch (error: any) {
    notificationStore.add({
      type: 'error',
      message: 'Errore nell\'eliminazione della campagna'
    })
  } finally {
    showDeleteModal.value = false
    campagnaToDelete.value = null
  }
}

const resetFiltri = () => {
  filtri.value = {
    tipo: '',
    stato: '',
    search: ''
  }
  pagination.value.current = 1
  pagination.value.limit = 5 // Reset al default
  loadCampagne()
}

const prevPage = () => {
  if (pagination.value.current > 1) {
    pagination.value.current--
    loadCampagne()
  }
}

const nextPage = () => {
  if (pagination.value.current < pagination.value.pages) {
    pagination.value.current++
    loadCampagne()
  }
}

const goToPage = (page: number) => {
  pagination.value.current = page
  loadCampagne()
}

const getTipoBadgeClass = (tipo: string) => {
  const classes = {
    email: 'bg-blue-100 text-blue-800',
    sms: 'bg-green-100 text-green-800',
    promozione: 'bg-purple-100 text-purple-800',
    compleanno: 'bg-pink-100 text-pink-800',
    callback: 'bg-yellow-100 text-yellow-800'
  }
  return classes[tipo] || 'bg-gray-100 text-gray-800'
}

const getTipoLabel = (tipo: string) => {
  const labels = {
    email: 'Email',
    sms: 'SMS',
    promozione: 'Promozione',
    compleanno: 'Compleanno',
    callback: 'Callback'
  }
  return labels[tipo] || tipo
}

const getStatoBadgeClass = (stato: string) => {
  const classes = {
    bozza: 'bg-gray-100 text-gray-800',
    programmata: 'bg-blue-100 text-blue-800',
    in_corso: 'bg-green-100 text-green-800',
    completata: 'bg-emerald-100 text-emerald-800',
    sospesa: 'bg-red-100 text-red-800'
  }
  return classes[stato] || 'bg-gray-100 text-gray-800'
}

const getStatoLabel = (stato: string) => {
  const labels = {
    bozza: 'Bozza',
    programmata: 'Programmata',
    in_corso: 'In Corso',
    completata: 'Completata',
    sospesa: 'Sospesa'
  }
  return labels[stato] || stato
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDateShort = (date: string) => {
  return new Date(date).toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  })
}

const toggleActionsMenu = (campaignId: string) => {
  activeActionsMenu.value = activeActionsMenu.value === campaignId ? null : campaignId
}

// Debounce per la ricerca
let searchTimeout = null

const handleSearchChange = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  searchTimeout = setTimeout(() => {
    pagination.value.current = 1
    loadCampagne()
  }, 500) // Aspetta 500ms dopo l'ultima digitazione
}

// Chiudi il menu quando si clicca fuori
const handleClickOutside = () => {
  activeActionsMenu.value = null
}

// Watcher separati per i diversi tipi di filtri
watch(() => filtri.value.tipo, () => {
  pagination.value.current = 1
  loadCampagne()
})

watch(() => filtri.value.stato, () => {
  pagination.value.current = 1
  loadCampagne()
})

watch(() => filtri.value.search, handleSearchChange)

watch(() => pagination.value.limit, () => {
  pagination.value.current = 1
  loadCampagne()
})

onMounted(() => {
  loadCampagne()
  loadStatistiche()
  
  // Aggiungi event listener per chiudere il menu delle azioni
  document.addEventListener('click', handleClickOutside)
})

// Pulisci l'event listener quando il componente viene smontato
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.max-w-xs {
  max-width: 20rem;
}

@media (max-width: 1024px) {
  .max-w-xs {
    max-width: 16rem;
  }
}
</style>
