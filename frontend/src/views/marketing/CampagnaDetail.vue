<template>
  <div class="p-6">
    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Campagna Details -->
    <div v-else-if="campagna" class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <div class="flex items-center space-x-4 mb-2">
            <h1 class="text-3xl font-bold text-gray-900">{{ campagna.nome }}</h1>
            <span :class="getStatoBadgeClass(campagna.stato)" class="inline-flex px-3 py-1 text-sm font-semibold rounded-full">
              {{ getStatoLabel(campagna.stato) }}
            </span>
          </div>
          <p v-if="campagna.descrizione" class="text-gray-600">{{ campagna.descrizione }}</p>
          <div class="flex items-center space-x-4 text-sm text-gray-500 mt-2">
            <span>Tipo: {{ getTipoLabel(campagna.tipo) }}</span>
            <span>•</span>
            <span>Creata: {{ formatDate(campagna.createdAt) }}</span>
          </div>
        </div>
        
        <div class="flex space-x-3">
          <router-link
            to="/marketing/campagne"
            class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Torna alle Campagne
          </router-link>
          
          <button
            v-if="campagna.stato === 'bozza'"
            @click="showLancioModal = true"
            class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Lancia Campagna
          </button>
          
          <button
            v-if="campagna.stato === 'in_corso'"
            @click="showSospensioneModal = true"
            class="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Sospendi
          </button>
          
          <router-link
            v-if="['bozza', 'programmata'].includes(campagna.stato)"
            :to="`/marketing/campagne/${campagna._id}/edit`"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Modifica
          </router-link>
          
          <button
            @click="showDeleteModal = true" 
            class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg> 
            Elimina
          </button>
        </div>
      </div>

      <!-- Statistiche -->
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div class="bg-white rounded-lg shadow p-4">
          <div class="flex items-center">
            <div class="p-2 rounded-full bg-blue-100">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-600">Invii</p>
              <p class="text-xl font-semibold text-gray-900">{{ campagna.statistiche.invii || 0 }}</p>
            </div>
          </div>
        </div>
        
        <div v-if="campagna.tipo === 'email'" class="bg-white rounded-lg shadow p-4">
          <div class="flex items-center">
            <div class="p-2 rounded-full bg-green-100">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-600">Aperture</p>
              <p class="text-xl font-semibold text-gray-900">{{ campagna.statistiche.aperture || 0 }}</p>
            </div>
          </div>
        </div>
        
        <div v-if="campagna.tipo === 'email'" class="bg-white rounded-lg shadow p-4">
          <div class="flex items-center">
            <div class="p-2 rounded-full bg-purple-100">
              <MousePointer class="w-5 h-5 text-purple-600" />
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-600">Click</p>
              <p class="text-xl font-semibold text-gray-900">{{ campagna.statistiche.click || 0 }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-4">
          <div class="flex items-center">
            <div class="p-2 rounded-full bg-yellow-100">
              <MessageCircle class="w-5 h-5 text-yellow-600" />
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-600">Risposte</p>
              <p class="text-xl font-semibold text-gray-900">{{ campagna.statistiche.risposte || 0 }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-4">
          <div class="flex items-center">
            <div class="p-2 rounded-full bg-emerald-100">
              <TrendingUp class="w-5 h-5 text-emerald-600" />
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-600">Conversioni</p>
              <p class="text-xl font-semibold text-gray-900">{{ campagna.statistiche.conversioni || 0 }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Contenuto e Configurazione -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Contenuto -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Contenuto</h2>
          
          <div class="space-y-4">
            <div v-if="campagna.contenuto.oggetto">
              <label class="block text-sm font-medium text-gray-700 mb-1">Oggetto</label>
              <p class="text-gray-900 bg-gray-50 p-3 rounded-md">{{ campagna.contenuto.oggetto }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ campagna.tipo === 'email' ? 'Corpo Email' : 'Messaggio' }}
              </label>
              <div class="text-gray-900 bg-gray-50 p-3 rounded-md whitespace-pre-wrap">{{ campagna.contenuto.corpo }}</div>
            </div>
            
            <div v-if="campagna.contenuto.templateHtml">
              <label class="block text-sm font-medium text-gray-700 mb-1">Template HTML</label>
              <pre class="text-sm text-gray-600 bg-gray-50 p-3 rounded-md overflow-x-auto">{{ campagna.contenuto.templateHtml }}</pre>
            </div>
          </div>
        </div>
        
        <!-- Configurazione -->
        <div class="space-y-6">
          <!-- Segmentazione -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Destinatari</h2>
            
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tipo di Segmentazione</label>
                <p class="text-gray-900">{{ getSegmentazioneLabel(campagna.segmentazione.tipo) }}</p>
              </div>
              
              <div v-if="campagna.segmentazione.criteri">
                <label class="block text-sm font-medium text-gray-700 mb-1">Criteri</label>
                <pre class="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">{{ 
                  typeof campagna.segmentazione.criteri === 'object' 
                    ? JSON.stringify(campagna.segmentazione.criteri, null, 2)
                    : campagna.segmentazione.criteri 
                }}</pre>
              </div>
              
              <div class="flex items-center justify-between pt-2 border-t">
                <span class="text-sm text-gray-600">Destinatari target</span>
                <span class="font-semibold text-gray-900">{{ clientiTarget.length }} clienti</span>
              </div>
              
              <button
                @click="loadClientiTarget"
                class="w-full bg-blue-50 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-100 transition-colors"
              >
                <Users class="w-4 h-4 inline mr-2" />
                Visualizza Lista Clienti
              </button>
            </div>
          </div>
          
          <!-- Programmazione -->
          <div v-if="campagna.programmazione" class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Programmazione</h2>
            
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <p class="text-gray-900">{{ getProgrammazioneLabel(campagna.programmazione.tipo) }}</p>
              </div>
              
              <div v-if="campagna.programmazione.dataInizio">
                <label class="block text-sm font-medium text-gray-700 mb-1">Data Inizio</label>
                <p class="text-gray-900">{{ formatDate(campagna.programmazione.dataInizio) }}</p>
              </div>
              
              <div v-if="campagna.programmazione.dataFine">
                <label class="block text-sm font-medium text-gray-700 mb-1">Data Fine</label>
                <p class="text-gray-900">{{ formatDate(campagna.programmazione.dataFine) }}</p>
              </div>
              
              <div v-if="campagna.programmazione.ricorrenza?.tipo !== 'nessuna'">
                <label class="block text-sm font-medium text-gray-700 mb-1">Ricorrenza</label>
                <p class="text-gray-900">{{ campagna.programmazione.ricorrenza?.tipo }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Lista Clienti Target (se caricata) -->
      <div v-if="showClientiTarget && clientiTarget.length > 0" class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 class="text-lg font-semibold text-gray-900">Clienti Target ({{ clientiTarget.length }})</h2>
          <button
            @click="showClientiTarget = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <X class="w-5 h-5" />
          </button>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefono</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data Nascita</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="cliente in clientiTarget" :key="cliente._id">
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
