<template>
  <div class="container mx-auto px-4 py-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Programma Fedeltà</h1>
        <p v-if="programma" class="text-gray-600 mt-1">
          {{ programma.cliente.nome }} {{ programma.cliente.cognome }}
        </p>
      </div>
      <div v-if="programma" class="flex space-x-3">
        <button
          @click="$router.go(-1)"
          class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft class="w-4 h-4 inline mr-2" />
          Indietro
        </button>
        <button
          @click="mostraModalePunti('aggiungi')"
          class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus class="w-4 h-4 inline mr-2" />
          Aggiungi Punti
        </button>
        <button
          @click="mostraModalePunti('riscatta')"
          :disabled="!programma.punti || programma.punti === 0"
          class="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
        >
          <Minus class="w-4 h-4 inline mr-2" />
          Riscatta Punti
        </button>
        <button
          @click="sincronizzaPunti"
          class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          <RefreshCw class="w-4 h-4 inline mr-2" />
          Sincronizza
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Contenuto principale -->
    <div v-else-if="programma" class="space-y-6">
      <!-- Info cliente e punti -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Info cliente -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Informazioni Cliente</h2>
            <div class="space-y-3">
              <div class="flex items-center space-x-3">
                <div class="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <User class="w-6 h-6 text-gray-500" />
                </div>
                <div>
                  <div class="font-medium text-gray-900">
                    {{ programma.cliente.nome }} {{ programma.cliente.cognome }}
                  </div>
                  <div class="text-sm text-gray-500">{{ programma.cliente.email }}</div>
                </div>
              </div>
              <div class="pt-3 border-t border-gray-200">
                <div class="text-sm text-gray-500">Telefono</div>
                <div class="font-medium">{{ programma.cliente.telefono }}</div>
              </div>
              <div v-if="programma.cliente.dataNascita">
                <div class="text-sm text-gray-500">Data di nascita</div>
                <div class="font-medium">{{ formatDate(programma.cliente.dataNascita) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Statistiche punti -->
        <div class="lg:col-span-2">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-white rounded-lg shadow-md p-6">
              <div class="flex items-center">
                <div class="p-3 rounded-full bg-blue-100">
                  <Star class="w-6 h-6 text-blue-600" />
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600">Punti Attuali</p>
                  <p class="text-3xl font-bold text-blue-600">{{ programma.punti.toLocaleString() }}</p>
                </div>
              </div>
            </div>
            
            <div class="bg-white rounded-lg shadow-md p-6">
              <div class="flex items-center">
                <div class="p-3 rounded-full bg-green-100">
                  <TrendingUp class="w-6 h-6 text-green-600" />
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600">Punti Totali Guadagnati</p>
                  <p class="text-3xl font-bold text-green-600">{{ programma.puntiTotaliGuadagnati.toLocaleString() }}</p>
                </div>
              </div>
            </div>
            
            <div class="bg-white rounded-lg shadow-md p-6">
              <div class="flex items-center">
                <div :class="getLivelloIconClass(programma.livello)">
                  <Award class="w-6 h-6" />
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600">Livello</p>
                  <p class="text-2xl font-bold" :class="getLivelloTextClass(programma.livello)">
                    {{ getLivelloLabel(programma.livello) }}
                  </p>
                </div>
              </div>
            </div>
            
            <div class="bg-white rounded-lg shadow-md p-6">
              <div class="flex items-center">
                <div class="p-3 rounded-full bg-purple-100">
                  <CreditCard class="w-6 h-6 text-purple-600" />
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600">Punti Utilizzati</p>
                  <p class="text-3xl font-bold text-purple-600">{{ programma.puntiUtilizzati.toLocaleString() }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistiche dettagliate -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Statistiche Cliente</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div class="text-sm font-medium text-gray-500">Totale Appuntamenti</div>
            <div class="text-2xl font-bold text-gray-900">{{ programma.statistiche.totaleAppuntamenti || 0 }}</div>
          </div>
          <div>
            <div class="text-sm font-medium text-gray-500">Totale Speso</div>
            <div class="text-2xl font-bold text-gray-900">€{{ (programma.statistiche.totaleSpeso || 0).toFixed(2) }}</div>
          </div>
          <div>
            <div class="text-sm font-medium text-gray-500">Media Spesa Mensile</div>
            <div class="text-2xl font-bold text-gray-900">€{{ (programma.statistiche.mediaSpesaMensile || 0).toFixed(2) }}</div>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div v-if="programma.statistiche.ultimoGuadagno">
            <div class="text-sm font-medium text-gray-500">Ultimo Guadagno</div>
            <div class="text-lg font-medium text-gray-900">{{ formatDate(programma.statistiche.ultimoGuadagno) }}</div>
          </div>
          <div v-if="programma.statistiche.ultimoUtilizzo">
            <div class="text-sm font-medium text-gray-500">Ultimo Utilizzo</div>
            <div class="text-lg font-medium text-gray-900">{{ formatDate(programma.statistiche.ultimoUtilizzo) }}</div>
          </div>
        </div>
      </div>

      <!-- Storico transazioni -->
      <div class="bg-white rounded-lg shadow-md">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">Storico Transazioni</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Punti
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Motivo
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Premio
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="transazione in programma.transazioni" :key="transazione._id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatDate(transazione.data) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getTipoBadgeClass(transazione.tipo)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                    {{ getTipoLabel(transazione.tipo) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <span :class="transazione.tipo === 'guadagno' || transazione.tipo === 'bonus' ? 'text-green-600' : 'text-red-600'">
                    {{ transazione.tipo === 'guadagno' || transazione.tipo === 'bonus' ? '+' : '-' }}{{ transazione.punti }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ transazione.motivo }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ transazione.premio || '-' }}
                </td>
              </tr>
              <tr v-if="!programma.transazioni?.length">
                <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                  Nessuna transazione trovata
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-8">
      <div class="text-red-600 mb-4">{{ error }}</div>
      <button
        @click="loadProgramma"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Riprova
      </button>
    </div>

    <!-- Modal Gestione Punti -->
    <div v-if="modalePunti.show" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-md rounded-lg bg-white">
        <div class="mt-3">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
            <component :is="modalePunti.tipo === 'aggiungi' ? Plus : Minus" class="h-6 w-6 text-blue-600" />
          </div>
          <div class="mt-5 text-center">
            <h3 class="text-xl leading-6 font-semibold text-gray-900">
              {{ modalePunti.tipo === 'aggiungi' ? 'Aggiungi Punti' : 'Riscatta Punti' }}
            </h3>
            <div class="mt-2">
              <p class="text-sm text-gray-500">
                Punti attuali: {{ programma?.punti.toLocaleString() }}
              </p>
            </div>
            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 text-left">Punti</label>
              <input
                v-model.number="modalePunti.punti"
                type="number"
                :min="modalePunti.tipo === 'riscatta' ? 1 : 0"
                :max="modalePunti.tipo === 'riscatta' ? programma?.punti : undefined"
                class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Inserisci punti"
              />
            </div>
            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 text-left">Motivo</label>
              <input
                v-model="modalePunti.motivo"
                type="text"
                class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                :placeholder="modalePunti.tipo === 'aggiungi' ? 'Motivo aggiunta punti' : 'Descrizione premio'"
              />
            </div>
            <div v-if="modalePunti.tipo === 'riscatta'" class="mt-4">
              <label class="block text-sm font-medium text-gray-700 text-left">Premio</label>
              <input
                v-model="modalePunti.premio"
                type="text"
                class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Descrizione premio riscattato"
              />
            </div>
          </div>
          <div class="flex justify-between mt-6">
            <button
              @click="chiudiModalePunti"
              class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Annulla
            </button>
            <button
              @click="salvaPunti"
              :disabled="!modalePunti.punti || modalePunti.punti <= 0"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
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
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLeft, Plus, Minus, RefreshCw, User, Star, TrendingUp, Award, CreditCard
} from 'lucide-vue-next'
import { useProgrammaFedeltaStore } from '@/stores/programmaFedelta'
import { useNotificationStore } from '@/stores/notifications'
import type { ProgrammaFedelta } from '@/services/programmaFedelta.service'

const route = useRoute()
const router = useRouter()
const programmaFedeltaStore = useProgrammaFedeltaStore()
const notificationStore = useNotificationStore()

const loading = ref(false)
const error = ref<string | null>(null)
const programma = ref<ProgrammaFedelta | null>(null)

const modalePunti = ref({
  show: false,
  tipo: 'aggiungi' as 'aggiungi' | 'riscatta',
  punti: 0,
  motivo: '',
  premio: ''
})

const loadProgramma = async () => {
  const id = route.params.id as string
  if (!id) {
    error.value = 'ID programma non valido'
    return
  }

  try {
    loading.value = true
    error.value = null
    programma.value = await programmaFedeltaStore.fetchProgrammaById(id)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Errore durante il caricamento del programma'
  } finally {
    loading.value = false
  }
}

const mostraModalePunti = (tipo: 'aggiungi' | 'riscatta') => {
  modalePunti.value = {
    show: true,
    tipo,
    punti: 0,
    motivo: '',
    premio: ''
  }
}

const chiudiModalePunti = () => {
  modalePunti.value = {
    show: false,
    tipo: 'aggiungi',
    punti: 0,
    motivo: '',
    premio: ''
  }
}

const salvaPunti = async () => {
  if (!programma.value || !modalePunti.value.punti) return
  
  try {
    const data = {
      punti: modalePunti.value.punti,
      motivo: modalePunti.value.motivo || (modalePunti.value.tipo === 'aggiungi' ? 'Punti aggiunti manualmente' : 'Riscatto premio'),
      ...(modalePunti.value.tipo === 'riscatta' && { premio: modalePunti.value.premio })
    }
    
    if (modalePunti.value.tipo === 'aggiungi') {
      await programmaFedeltaStore.aggiungiPunti(programma.value._id, data)
      notificationStore.success('Punti aggiunti con successo')
    } else {
      await programmaFedeltaStore.riscattaPunti(programma.value._id, data)
      notificationStore.success('Punti riscattati con successo')
    }
    
    chiudiModalePunti()
    await loadProgramma()
  } catch (error) {
    notificationStore.error(`Errore durante ${modalePunti.value.tipo === 'aggiungi' ? 'l\'aggiunta' : 'il riscatto'} dei punti`)
  }
}

const sincronizzaPunti = async () => {
  if (!programma.value) return
  
  try {
    await programmaFedeltaStore.sincronizzaPunti(programma.value.cliente._id)
    notificationStore.success('Punti sincronizzati con successo')
    await loadProgramma()
  } catch (error) {
    notificationStore.error('Errore durante la sincronizzazione dei punti')
  }
}

const getLivelloIconClass = (livello: string) => {
  const classes = {
    bronzo: 'p-3 rounded-full bg-amber-100',
    argento: 'p-3 rounded-full bg-gray-100',
    oro: 'p-3 rounded-full bg-yellow-100',
    platino: 'p-3 rounded-full bg-purple-100'
  }
  return classes[livello] || 'p-3 rounded-full bg-gray-100'
}

const getLivelloTextClass = (livello: string) => {
  const classes = {
    bronzo: 'text-amber-600',
    argento: 'text-gray-600',
    oro: 'text-yellow-600',
    platino: 'text-purple-600'
  }
  return classes[livello] || 'text-gray-600'
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

const getTipoBadgeClass = (tipo: string) => {
  const classes = {
    guadagno: 'bg-green-100 text-green-800',
    spesa: 'bg-red-100 text-red-800',
    bonus: 'bg-blue-100 text-blue-800',
    scadenza: 'bg-gray-100 text-gray-800',
    rettifica: 'bg-yellow-100 text-yellow-800'
  }
  return classes[tipo] || 'bg-gray-100 text-gray-800'
}

const getTipoLabel = (tipo: string) => {
  const labels = {
    guadagno: 'Guadagno',
    spesa: 'Spesa',
    bonus: 'Bonus',
    scadenza: 'Scadenza',
    rettifica: 'Rettifica'
  }
  return labels[tipo] || tipo
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

onMounted(() => {
  loadProgramma()
})
</script>
