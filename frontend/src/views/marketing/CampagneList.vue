<!-- filepath: /home/mirco/Documents/Dev/saloon-crm/frontend/src/views/marketing/CampagneList.vue -->
<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Campagne Marketing</h1>
        <p class="text-gray-600 mt-1">Gestisci le tue campagne email, SMS e promozionali</p>
      </div>
      <router-link
        to="/marketing/campagne/nuova"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Plus class="w-4 h-4 inline mr-2" />
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
          <input
            v-model="filtri.search"
            type="text"
            placeholder="Nome campagna..."
            class="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
        <div class="flex items-end">
          <button
            @click="resetFiltri"
            class="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
          >
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
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Campagna
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stato
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statistiche
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data Creazione
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Azioni
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="campagna in campagneFiltrate" :key="campagna._id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ campagna.nome }}</div>
                  <div class="text-sm text-gray-500">{{ campagna.descrizione }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getTipoBadgeClass(campagna.tipo)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                  {{ getTipoLabel(campagna.tipo) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatoBadgeClass(campagna.stato)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                  {{ getStatoLabel(campagna.stato) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div class="space-y-1">
                  <div>Invii: {{ campagna.statistiche?.invii || 0 }}</div>
                  <div v-if="campagna.tipo === 'email'">Aperture: {{ campagna.statistiche?.aperture || 0 }}</div>
                  <div v-if="campagna.tipo === 'sms'">Risposte: {{ campagna.statistiche?.risposte || 0 }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(campagna.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <router-link
                  :to="`/marketing/campagne/${campagna._id}`"
                  class="text-blue-600 hover:text-blue-900"
                >
                  <Eye class="w-4 h-4 inline" />
                </router-link>
                
                <button
                  v-if="campagna.stato === 'bozza'"
                  @click="lanciaCampagna(campagna._id)"
                  class="text-green-600 hover:text-green-900"
                  title="Lancia campagna"
                >
                  <Play class="w-4 h-4 inline" />
                </button>
                
                <button
                  v-if="campagna.stato === 'in_corso'"
                  @click="sospendiCampagna(campagna._id)"
                  class="text-yellow-600 hover:text-yellow-900"
                  title="Sospendi campagna"
                >
                  <Pause class="w-4 h-4 inline" />
                </button>
                
                <router-link
                  v-if="['bozza', 'programmata'].includes(campagna.stato)"
                  :to="`/marketing/campagne/${campagna._id}/edit`"
                  class="text-gray-600 hover:text-gray-900"
                  title="Modifica"
                >
                  <Edit class="w-4 h-4 inline" />
                </router-link>
                
                <button
                  @click="duplicaCampagna(campagna._id)"
                  class="text-purple-600 hover:text-purple-900"
                  title="Duplica"
                >
                  <Copy class="w-4 h-4 inline" />
                </button>
                
                <button
                  v-if="campagna.stato !== 'in_corso'"
                  @click="eliminaCampagna(campagna._id)"
                  class="text-red-600 hover:text-red-900"
                  title="Elimina"
                >
                  <Trash2 class="w-4 h-4 inline" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Paginazione -->
      <div v-if="pagination.pages > 1" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        <div class="flex items-center justify-between">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="prevPage"
              :disabled="pagination.current === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Precedente
            </button>
            <button
              @click="nextPage"
              :disabled="pagination.current === pagination.pages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Successivo
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Mostrando <span class="font-medium">{{ (pagination.current - 1) * 20 + 1 }}</span> a
                <span class="font-medium">{{ Math.min(pagination.current * 20, pagination.total) }}</span> di
                <span class="font-medium">{{ pagination.total }}</span> risultati
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  @click="prevPage"
                  :disabled="pagination.current === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronLeft class="h-5 w-5" />
                </button>
                
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="goToPage(page)"
                  :class="[
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                    page === pagination.current
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  ]"
                >
                  {{ page }}
                </button>
                
                <button
                  @click="nextPage"
                  :disabled="pagination.current === pagination.pages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronRight class="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  Plus, Mail, Play, Send, Eye, Edit, Copy, Trash2, Pause,
  ChevronLeft, ChevronRight
} from 'lucide-vue-next'
import { useCampagneStore } from '@/stores/campagne'
import { useNotificationStore } from '@/stores/notifications'

const router = useRouter()
const campagneStore = useCampagneStore()
const notificationStore = useNotificationStore()

const loading = ref(false)
const campagne = ref([])
const statistiche = ref({})
const pagination = ref({
  current: 1,
  pages: 1,
  total: 0
})

const filtri = ref({
  tipo: '',
  stato: '',
  search: ''
})

const campagneFiltrate = computed(() => {
  let risultato = [...campagne.value]
  
  if (filtri.value.tipo) {
    risultato = risultato.filter(c => c.tipo === filtri.value.tipo)
  }
  
  if (filtri.value.stato) {
    risultato = risultato.filter(c => c.stato === filtri.value.stato)
  }
  
  if (filtri.value.search) {
    const search = filtri.value.search.toLowerCase()
    risultato = risultato.filter(c => 
      c.nome.toLowerCase().includes(search) ||
      (c.descrizione && c.descrizione.toLowerCase().includes(search))
    )
  }
  
  return risultato
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
    const response = await campagneStore.fetchCampagne({
      page: pagination.value.current,
      limit: 20,
      ...filtri.value
    })
    
    campagne.value = response.campagne
    pagination.value = response.pagination
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

const eliminaCampagna = async (id: string) => {
  if (!confirm('Sei sicuro di voler eliminare questa campagna?')) return
  
  try {
    await campagneStore.deleteCampagna(id)
    notificationStore.add({
      type: 'success',
      message: 'Campagna eliminata con successo'
    })
    await loadCampagne()
  } catch (error) {
    notificationStore.add({
      type: 'error',
      message: 'Errore nell\'eliminazione della campagna'
    })
  }
}

const resetFiltri = () => {
  filtri.value = {
    tipo: '',
    stato: '',
    search: ''
  }
  pagination.value.current = 1
}

const prevPage = () => {
  if (pagination.value.current > 1) {
    pagination.value.current--
  }
}

const nextPage = () => {
  if (pagination.value.current < pagination.value.pages) {
    pagination.value.current++
  }
}

const goToPage = (page: number) => {
  pagination.value.current = page
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

watch(() => pagination.value.current, loadCampagne)
watch(filtri, () => {
  pagination.value.current = 1
  loadCampagne()
}, { deep: true })

onMounted(() => {
  loadCampagne()
  loadStatistiche()
})
</script>
