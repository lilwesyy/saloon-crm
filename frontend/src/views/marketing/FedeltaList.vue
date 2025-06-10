<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="sm:flex sm:items-center sm:justify-between">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-bold text-gray-900">Programmi Fedeltà</h1>
        <p class="mt-2 text-sm text-gray-700">Gestisci i punti fedeltà dei tuoi clienti</p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <router-link
          to="/marketing/fedelta/create"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus class="w-4 h-4 mr-2" />
          Nuovo Programma
        </router-link>
      </div>
    </div>

    <!-- Filtri -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Filtri</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Livello</label>
            <select v-model="filtri.livello" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Tutti i livelli</option>
              <option value="bronzo">Bronzo</option>
              <option value="argento">Argento</option>
              <option value="oro">Oro</option>
              <option value="platino">Platino</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Stato</label>
            <select v-model="filtri.stato" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Tutti gli stati</option>
              <option value="attivo">Attivo</option>
              <option value="inattivo">Inattivo</option>
              <option value="sospeso">Sospeso</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
            <input
              v-model="filtri.cliente"
              type="text"
              placeholder="Nome o cognome cliente..."
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
    </div>

    <!-- Statistiche rapide -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="p-3 rounded-full bg-blue-100">
                <Users class="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div class="ml-4 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Totale Programmi
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ statistiche.totaleProgrammi || 0 }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-5 py-3">
          <div class="text-sm">
            <router-link to="/marketing/fedelta" class="font-medium text-blue-700 hover:text-blue-900">
              Vedi tutti i programmi
            </router-link>
          </div>
        </div>
      </div>
      
      <div class="bg-white shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="p-3 rounded-full bg-green-100">
                <Star class="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div class="ml-4 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Programmi Attivi
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ programmiAttivi }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-5 py-3">
          <div class="text-sm">
            <router-link to="/marketing/fedelta?status=attivo" class="font-medium text-green-700 hover:text-green-900">
              Gestisci programmi attivi
            </router-link>
          </div>
        </div>
      </div>
      
      <div class="bg-white shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="p-3 rounded-full bg-yellow-100">
                <Award class="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div class="ml-4 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Punti Totali
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ totalePunti.toLocaleString() }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-5 py-3">
          <div class="text-sm">
            <span class="font-medium text-yellow-700">
              Punti distribuiti ai clienti
            </span>
          </div>
        </div>
      </div>
      
      <div class="bg-white shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="p-3 rounded-full bg-purple-100">
                <TrendingUp class="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div class="ml-4 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Punti Medi
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ puntiMedi }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-5 py-3">
          <div class="text-sm">
            <span class="font-medium text-purple-700">
              Media per cliente
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <div class="flex justify-center items-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span class="ml-3 text-gray-600">Caricamento programmi fedeltà...</span>
        </div>
      </div>
    </div>

    <!-- Lista programmi -->
    <div v-else class="bg-white shadow rounded-lg overflow-hidden">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Programmi Fedeltà Clienti</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Punti
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Livello
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stato
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ultimo Movimento
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Azioni
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="programma in programmiFiltrati" :key="programma._id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User class="w-5 h-5 text-gray-500" />
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ programma.cliente.nome }} {{ programma.cliente.cognome }}
                      </div>
                      <div class="text-sm text-gray-500">{{ programma.cliente.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    <div class="font-medium">{{ programma.punti.toLocaleString() }} punti</div>
                    <div class="text-gray-500">Tot: {{ programma.puntiTotaliGuadagnati.toLocaleString() }}</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getLivelloBadgeClass(programma.livello)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                    {{ getLivelloLabel(programma.livello) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatoBadgeClass(programma.stato)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                    {{ getStatoLabel(programma.stato) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div v-if="programma.statistiche?.ultimoGuadagno">
                    {{ formatDate(programma.statistiche.ultimoGuadagno) }}
                  </div>
                  <div v-else class="text-gray-400">Nessun movimento</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <router-link
                    :to="`/marketing/fedelta/${programma._id}`"
                    class="text-blue-600 hover:text-blue-900"
                    title="Visualizza dettagli"
                  >
                    <Eye class="w-4 h-4 inline" />
                  </router-link>
                  
                  <button
                    @click="mostraModalePunti(programma, 'aggiungi')"
                    class="text-green-600 hover:text-green-900"
                    title="Aggiungi punti"
                  >
                    <Plus class="w-4 h-4 inline" />
                  </button>
                  
                  <button
                    @click="mostraModalePunti(programma, 'riscatta')"
                    class="text-yellow-600 hover:text-yellow-900"
                    title="Riscatta punti"
                    :disabled="programma.punti === 0"
                  >
                    <Minus class="w-4 h-4 inline" />
                  </button>
                  
                  <button
                    @click="sincronizzaPunti(programma.cliente._id)"
                    class="text-purple-600 hover:text-purple-900"
                    title="Sincronizza punti"
                  >
                    <RefreshCw class="w-4 h-4 inline" />
                  </button>
                  
                  <router-link
                    :to="`/marketing/fedelta/${programma._id}/edit`"
                    class="text-gray-600 hover:text-gray-900"
                    title="Modifica"
                  >
                    <Edit class="w-4 h-4 inline" />
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
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

    <!-- Modal Gestione Punti -->
    <div v-if="modalePunti.show" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
            <component :is="modalePunti.tipo === 'aggiungi' ? Plus : Minus" class="h-6 w-6 text-blue-600" />
          </div>
          <div class="mt-5 text-center">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              {{ modalePunti.tipo === 'aggiungi' ? 'Aggiungi Punti' : 'Riscatta Punti' }}
            </h3>
            <div class="mt-2">
              <p class="text-sm text-gray-500">
                Cliente: {{ modalePunti.programma?.cliente.nome }} {{ modalePunti.programma?.cliente.cognome }}
              </p>
              <p class="text-sm text-gray-500">
                Punti attuali: {{ modalePunti.programma?.punti.toLocaleString() }}
              </p>
            </div>
            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 text-left">Punti</label>
              <input
                v-model.number="modalePunti.punti"
                type="number"
                :min="modalePunti.tipo === 'riscatta' ? 1 : 0"
                :max="modalePunti.tipo === 'riscatta' ? modalePunti.programma?.punti : undefined"
                class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Inserisci punti"
              />
            </div>
            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 text-left">Motivo</label>
              <input
                v-model="modalePunti.motivo"
                type="text"
                class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                :placeholder="modalePunti.tipo === 'aggiungi' ? 'Motivo aggiunta punti' : 'Descrizione premio'"
              />
            </div>
            <div v-if="modalePunti.tipo === 'riscatta'" class="mt-4">
              <label class="block text-sm font-medium text-gray-700 text-left">Premio</label>
              <input
                v-model="modalePunti.premio"
                type="text"
                class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Descrizione premio riscattato"
              />
            </div>
          </div>
          <div class="flex justify-between mt-6">
            <button
              @click="chiudiModalePunti"
              class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              Annulla
            </button>
            <button
              @click="salvaPunti"
              :disabled="!modalePunti.punti || modalePunti.punti <= 0"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {{ modalePunti.tipo === 'aggiungi' ? 'Aggiungi' : 'Riscatta' }}
            </button>
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
  Plus, Users, Star, Award, TrendingUp, Eye, Edit, Minus, RefreshCw, User,
  ChevronLeft, ChevronRight
} from 'lucide-vue-next'
import { useProgrammaFedeltaStore } from '@/stores/programmaFedelta'
import { useNotificationStore } from '@/stores/notifications'
import type { ProgrammaFedelta } from '@/services/programmaFedelta.service'

const router = useRouter()
const programmaFedeltaStore = useProgrammaFedeltaStore()
const notificationStore = useNotificationStore()

const loading = ref(false)
const programmi = ref<ProgrammaFedelta[]>([])
const statistiche = ref<any>({})
const pagination = ref({
  current: 1,
  pages: 1,
  total: 0
})

const filtri = ref({
  livello: '',
  stato: '',
  cliente: ''
})

const modalePunti = ref({
  show: false,
  tipo: 'aggiungi' as 'aggiungi' | 'riscatta',
  programma: null as ProgrammaFedelta | null,
  punti: 0,
  motivo: '',
  premio: ''
})

const programmiFiltrati = computed(() => {
  let risultato = [...programmi.value]
  
  if (filtri.value.livello) {
    risultato = risultato.filter(p => p.livello === filtri.value.livello)
  }
  
  if (filtri.value.stato) {
    risultato = risultato.filter(p => p.stato === filtri.value.stato)
  }
  
  if (filtri.value.cliente) {
    const search = filtri.value.cliente.toLowerCase()
    risultato = risultato.filter(p => 
      p.cliente.nome.toLowerCase().includes(search) ||
      p.cliente.cognome.toLowerCase().includes(search) ||
      p.cliente.email.toLowerCase().includes(search)
    )
  }
  
  return risultato
})

const programmiAttivi = computed(() => {
  return programmi.value.filter(p => p.stato === 'attivo').length
})

const totalePunti = computed(() => {
  return programmi.value.reduce((total, p) => total + p.punti, 0)
})

const puntiMedi = computed(() => {
  if (programmi.value.length === 0) return 0
  return Math.round(totalePunti.value / programmi.value.length)
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

const loadProgrammi = async () => {
  try {
    loading.value = true
    const response = await programmaFedeltaStore.fetchProgrammi({
      page: pagination.value.current,
      limit: 20,
      ...filtri.value
    })
    
    programmi.value = response.programmi
    pagination.value = {
      current: response.currentPage,
      pages: response.totalPages,
      total: response.totalItems
    }
  } catch (error) {
    notificationStore.error('Errore nel caricamento dei programmi fedeltà')
  } finally {
    loading.value = false
  }
}

const loadStatistiche = async () => {
  try {
    statistiche.value = await programmaFedeltaStore.fetchStatistiche()
  } catch (error) {
    console.error('Errore nel caricamento delle statistiche:', error)
  }
}

const resetFiltri = () => {
  filtri.value = {
    livello: '',
    stato: '',
    cliente: ''
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

const mostraModalePunti = (programma: ProgrammaFedelta, tipo: 'aggiungi' | 'riscatta') => {
  modalePunti.value = {
    show: true,
    tipo,
    programma,
    punti: 0,
    motivo: '',
    premio: ''
  }
}

const chiudiModalePunti = () => {
  modalePunti.value = {
    show: false,
    tipo: 'aggiungi',
    programma: null,
    punti: 0,
    motivo: '',
    premio: ''
  }
}

const salvaPunti = async () => {
  if (!modalePunti.value.programma || !modalePunti.value.punti) return
  
  try {
    const data = {
      punti: modalePunti.value.punti,
      motivo: modalePunti.value.motivo || (modalePunti.value.tipo === 'aggiungi' ? 'Punti aggiunti manualmente' : 'Riscatto premio'),
      ...(modalePunti.value.tipo === 'riscatta' && { premio: modalePunti.value.premio })
    }
    
    if (modalePunti.value.tipo === 'aggiungi') {
      await programmaFedeltaStore.aggiungiPunti(modalePunti.value.programma._id, data)
      notificationStore.success('Punti aggiunti con successo')
    } else {
      await programmaFedeltaStore.riscattaPunti(modalePunti.value.programma._id, data)
      notificationStore.success('Punti riscattati con successo')
    }
    
    chiudiModalePunti()
    await loadProgrammi()
  } catch (error) {
    notificationStore.error(`Errore durante ${modalePunti.value.tipo === 'aggiungi' ? 'l\'aggiunta' : 'il riscatto'} dei punti`)
  }
}

const sincronizzaPunti = async (clienteId: string) => {
  try {
    await programmaFedeltaStore.sincronizzaPunti(clienteId)
    notificationStore.success('Punti sincronizzati con successo')
    await loadProgrammi()
  } catch (error) {
    notificationStore.error('Errore durante la sincronizzazione dei punti')
  }
}

const getLivelloBadgeClass = (livello: string) => {
  const classes = {
    bronzo: 'bg-amber-100 text-amber-800',
    argento: 'bg-gray-100 text-gray-800',
    oro: 'bg-yellow-100 text-yellow-800',
    platino: 'bg-purple-100 text-purple-800'
  }
  return classes[livello] || 'bg-gray-100 text-gray-800'
}

const getLivelloLabel = (livello: string) => {
  const labels = {
    bronzo: 'Bronzo',
    argento: 'Argento',
    oro: 'Oro',
    platino: 'Platino'
  }
  return labels[livello] || livello
}

const getStatoBadgeClass = (stato: string) => {
  const classes = {
    attivo: 'bg-green-100 text-green-800',
    inattivo: 'bg-gray-100 text-gray-800',
    sospeso: 'bg-red-100 text-red-800'
  }
  return classes[stato] || 'bg-gray-100 text-gray-800'
}

const getStatoLabel = (stato: string) => {
  const labels = {
    attivo: 'Attivo',
    inattivo: 'Inattivo',
    sospeso: 'Sospeso'
  }
  return labels[stato] || stato
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

watch(() => pagination.value.current, loadProgrammi)
watch(filtri, () => {
  pagination.value.current = 1
  loadProgrammi()
}, { deep: true })

onMounted(() => {
  loadProgrammi()
  loadStatistiche()
})
</script>
