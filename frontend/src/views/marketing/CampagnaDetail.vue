<template>
  <div class="space-y-6">
    <!-- Loading -->
    <div v-if="loading" class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <div class="flex justify-center items-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span class="ml-3 text-gray-600">Caricamento campagna...</span>
        </div>
      </div>
    </div>

    <!-- Campagna Details -->
    <div v-else-if="campagna" class="space-y-6">
      <!-- Header -->
      <div class="sm:flex sm:items-center sm:justify-between">
        <div class="sm:flex-auto">
          <div class="flex items-center space-x-4 mb-2">
            <h1 class="text-2xl font-bold text-gray-900">{{ campagna.nome }}</h1>
            <span :class="getStatoBadgeClass(campagna.stato)" class="inline-flex px-3 py-1 text-sm font-semibold rounded-full">
              {{ getStatoLabel(campagna.stato) }}
            </span>
          </div>
          <p v-if="campagna.descrizione" class="mt-2 text-sm text-gray-700">{{ campagna.descrizione }}</p>
          <div class="flex items-center space-x-4 text-sm text-gray-500 mt-2">
            <span>Tipo: {{ getTipoLabel(campagna.tipo) }}</span>
            <span>•</span>
            <span>Creata: {{ formatDate(campagna.createdAt) }}</span>
          </div>
        </div>
        
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <div class="flex space-x-3">
            <router-link
              to="/marketing/campagne"
              class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              Torna alle Campagne
            </router-link>
            
            <button
              v-if="campagna.stato === 'bozza'"
              @click="showLancioModal = true"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Lancia Campagna
            </button>
            
            <button
              v-if="campagna.stato === 'in_corso'"
              @click="showSospensioneModal = true"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Sospendi
            </button>
            
            <router-link
              v-if="['bozza', 'programmata'].includes(campagna.stato)"
              :to="`/marketing/campagne/${campagna._id}/edit`"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Modifica
            </router-link>
            
            <button
              @click="showDeleteModal = true" 
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
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
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="p-3 rounded-full bg-blue-100">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Invii</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ campagna.statistiche?.invii || 0 }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="campagna.tipo === 'email'" class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="p-3 rounded-full bg-green-100">
                  <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Aperture</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ campagna.statistiche?.aperture || 0 }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="campagna.tipo === 'email'" class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="p-3 rounded-full bg-purple-100">
                  <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Click</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ campagna.statistiche?.click || 0 }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="p-3 rounded-full bg-yellow-100">
                  <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Risposte</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ campagna.statistiche?.risposte || 0 }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="p-3 rounded-full bg-emerald-100">
                  <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Conversioni</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ campagna.statistiche?.conversioni || 0 }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Contenuto e Configurazione -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Contenuto -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Contenuto</h2>
            
            <div class="space-y-4">
              <div v-if="campagna.contenuto?.oggetto">
                <label class="block text-sm font-medium text-gray-700 mb-1">Oggetto</label>
                <p class="text-gray-900 bg-gray-50 p-3 rounded-md">{{ campagna.contenuto?.oggetto }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ campagna.tipo === 'email' ? 'Corpo Email' : 'Messaggio' }}
                </label>
                <div class="text-gray-900 bg-gray-50 p-3 rounded-md whitespace-pre-wrap">{{ campagna.contenuto?.corpo || '' }}</div>
              </div>
              
              <div v-if="campagna.contenuto?.templateHtml">
                <label class="block text-sm font-medium text-gray-700 mb-1">Template HTML</label>
                <pre class="text-sm text-gray-600 bg-gray-50 p-3 rounded-md overflow-x-auto">{{ campagna.contenuto?.templateHtml }}</pre>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Configurazione -->
        <div class="space-y-6">
          <!-- Segmentazione -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Destinatari</h2>
              
              <div class="space-y-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Tipo di Segmentazione</label>
                  <p class="text-gray-900">{{ getSegmentazioneLabel(campagna.segmentazione?.tipo) }}</p>
                </div>
                
                <div v-if="campagna.segmentazione?.criteri">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Criteri</label>
                  <pre class="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">{{ 
                    typeof campagna.segmentazione?.criteri === 'object' 
                      ? JSON.stringify(campagna.segmentazione?.criteri, null, 2)
                      : campagna.segmentazione?.criteri 
                  }}</pre>
                </div>
                
                <div class="flex items-center justify-between pt-2 border-t">
                  <span class="text-sm text-gray-600">Destinatari target</span>
                  <span class="font-semibold text-gray-900">{{ clientiTarget.length }} clienti</span>
                </div>
                
                <button
                  @click="loadClientiTarget"
                  class="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  Visualizza Lista Clienti
                </button>
              </div>
            </div>
          </div>
          
          <!-- Programmazione -->
          <div v-if="campagna.programmazione" class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Programmazione</h2>
              
              <div class="space-y-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                  <p class="text-gray-900">{{ getProgrammazioneLabel(campagna.programmazione?.tipo) }}</p>
                </div>
                
                <div v-if="campagna.programmazione?.dataInizio">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Data Inizio</label>
                  <p class="text-gray-900">{{ formatDate(campagna.programmazione?.dataInizio) }}</p>
                </div>
                
                <div v-if="campagna.programmazione?.dataFine">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Data Fine</label>
                  <p class="text-gray-900">{{ formatDate(campagna.programmazione?.dataFine) }}</p>
                </div>
                
                <div v-if="campagna.programmazione?.ricorrenza?.tipo !== 'nessuna'">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Ricorrenza</label>
                  <p class="text-gray-900">{{ campagna.programmazione.ricorrenza?.tipo }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Lista Clienti Target (se caricata) -->
      <div v-if="showClientiTarget && clientiTarget.length > 0" class="bg-white shadow rounded-lg overflow-hidden">
        <div class="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
          <h2 class="text-lg font-semibold text-gray-900">Clienti Target ({{ clientiTarget.length }})</h2>
          <button
            @click="showClientiTarget = false"
            class="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefono</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Nascita</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="cliente in clientiTarget" :key="cliente._id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ cliente.nome }} {{ cliente.cognome }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ cliente.email }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ cliente.telefono }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ cliente.dataNascita ? formatDate(cliente.dataNascita) : '-' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Error state -->
    <div v-else class="text-center py-8">
      <p class="text-gray-500">Campagna non trovata</p>
    </div>

    <!-- Add confirmation modals -->
    <DeleteConfirmModal
      :modelValue="showLancioModal"
      title="Conferma Lancio Campagna"
      message="Sei sicuro di voler lanciare questa campagna?"
      warningText="Una volta lanciata, la campagna diventerà attiva e verrà inviata ai clienti selezionati."
      confirmButtonText="Lancia Campagna"
      @confirm="confirmLancioCampagna"
      @cancel="showLancioModal = false"
    />
    
    <DeleteConfirmModal
      :modelValue="showSospensioneModal"
      title="Conferma Sospensione"
      message="Sei sicuro di voler sospendere questa campagna?"
      warningText="Sospendendo la campagna, non sarà più attiva e non verranno inviate ulteriori comunicazioni."
      confirmButtonText="Sospendi Campagna"
      @confirm="confirmSospensioneCampagna" 
      @cancel="showSospensioneModal = false"
    />
    
    <DeleteConfirmModal
      :modelValue="showDeleteModal"
      title="Conferma Eliminazione"
      :message="`Sei sicuro di voler eliminare la campagna '${campagna?.nome || ''}'?`"
      warningText="L'eliminazione di una campagna è irreversibile e comporterà la perdita di tutti i dati associati, incluse le statistiche."
      confirmButtonText="Elimina Campagna"
      @confirm="confirmDelete"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCampagneStore } from '@/stores/campagne'
import { useNotificationStore } from '@/stores/notifications'
import DeleteConfirmModal from '@/components/common/DeleteConfirmModal.vue'

const route = useRoute()
const router = useRouter()
const campagneStore = useCampagneStore()
const notificationStore = useNotificationStore()

const loading = ref(false)
const showClientiTarget = ref(false)
const clientiTarget = ref([])
const deleteConfirmOpen = ref(false)
const showLancioModal = ref(false)
const showSospensioneModal = ref(false)
const showDeleteModal = ref(false)

const campagna = computed(() => campagneStore.currentCampagna)

const loadCampagna = async () => {
  const id = route.params.id as string
  try {
    loading.value = true
    await campagneStore.fetchCampagnaById(id)
  } catch (error) {
    notificationStore.error('Errore nel caricamento della campagna')
    router.push('/marketing/campagne')
  } finally {
    loading.value = false
  }
}

const loadClientiTarget = async () => {
  if (!campagna.value) return
  
  try {
    const response = await campagneStore.fetchClientiTarget(campagna.value._id)
    clientiTarget.value = response.clienti
    showClientiTarget.value = true
  } catch (error) {
    notificationStore.error('Errore nel caricamento dei clienti target')
  }
}

const lanciaCampagna = () => {
  if (!campagna.value) return
  showLancioModal.value = true
}

const confirmLancioCampagna = async () => {
  if (!campagna.value) return
  
  try {
    await campagneStore.lanciaCampagna(campagna.value._id)
    notificationStore.success('Campagna lanciata con successo')
    await loadCampagna()
  } catch (error) {
    notificationStore.error('Errore nel lancio della campagna')
  } finally {
    showLancioModal.value = false
  }
}

const sospendiCampagna = () => {
  if (!campagna.value) return
  showSospensioneModal.value = true
}

const confirmSospensioneCampagna = async () => {
  if (!campagna.value) return
  
  try {
    await campagneStore.sospendiCampagna(campagna.value._id)
    notificationStore.success('Campagna sospesa con successo')
    await loadCampagna()
  } catch (error) {
    notificationStore.error('Errore nella sospensione della campagna')
  } finally {
    showSospensioneModal.value = false
  }
}

const confirmDelete = async () => {
  if (!campagna.value) return
  
  try {
    await campagneStore.deleteCampagna(campagna.value._id)
    notificationStore.success('Campagna eliminata con successo')
    router.push('/marketing/campagne')
  } catch (error) {
    notificationStore.error('Errore nell\'eliminazione della campagna')
  } finally {
    showDeleteModal.value = false
  }
}

// The duplicate functions have been removed

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

const getSegmentazioneLabel = (tipo: string) => {
  const labels = {
    tutti: 'Tutti i clienti',
    nuovi_clienti: 'Nuovi clienti',
    clienti_fedeli: 'Clienti fedeli',
    inattivi: 'Clienti inattivi',
    compleanni: 'Compleanni del mese',
    personalizzato: 'Segmentazione personalizzata'
  }
  return labels[tipo] || tipo
}

const getProgrammazioneLabel = (tipo: string) => {
  const labels = {
    immediata: 'Invio Immediato',
    programmata: 'Invio Programmato',
    ricorrente: 'Invio Ricorrente'
  }
  return labels[tipo] || tipo
}

const formatDate = (date: string) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  loadCampagna()
})
</script>
