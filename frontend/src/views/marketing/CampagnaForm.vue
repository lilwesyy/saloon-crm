<!-- filepath: /home/mirco/Documents/Dev/saloon-crm/frontend/src/views/marketing/CampagnaForm.vue -->
<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">
          {{ isEditing ? 'Modifica Campagna' : 'Nuova Campagna' }}
        </h1>
        <p class="text-gray-600 mt-1">
          {{ isEditing ? 'Modifica i dettagli della campagna' : 'Crea una nuova campagna di marketing' }}
        </p>
      </div>
      <router-link
        to="/marketing/campagne"
        class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <ArrowLeft class="w-4 h-4 inline mr-2" />
        Torna alle Campagne
      </router-link>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Form -->
    <div v-else class="max-w-4xl mx-auto">
      <form @submit.prevent="salvaCampagna" class="space-y-8">
        <!-- Informazioni Base -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Informazioni Base</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nome Campagna *</label>
              <input
                v-model="form.nome"
                type="text"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nome della campagna"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tipo Campagna *</label>
              <select
                v-model="form.tipo"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="promozione">Promozione</option>
                <option value="compleanno">Compleanno</option>
                <option value="callback">Callback</option>
              </select>
            </div>
          </div>
          
          <div class="mt-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">Descrizione</label>
            <textarea
              v-model="form.descrizione"
              rows="3"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descrizione della campagna (opzionale)"
            ></textarea>
          </div>
        </div>

        <!-- Contenuto -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Contenuto</h2>
          
          <div v-if="form.tipo === 'email'" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Oggetto Email *</label>
              <input
                v-model="form.contenuto.oggetto"
                type="text"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Oggetto dell'email"
              />
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ form.tipo === 'email' ? 'Corpo Email' : 'Messaggio' }} *
            </label>
            <textarea
              v-model="form.contenuto.corpo"
              rows="6"
              required
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              :placeholder="form.tipo === 'email' ? 'Contenuto dell\'email...' : 'Testo del messaggio...'"
            ></textarea>
            <p class="text-sm text-gray-500 mt-1">
              Puoi usare le variabili: {nome}, {cognome}, {email} per personalizzare il messaggio
            </p>
          </div>
          
          <div v-if="form.tipo === 'email'" class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Template HTML (Opzionale)</label>
            <textarea
              v-model="form.contenuto.templateHtml"
              rows="4"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Template HTML personalizzato (lascia vuoto per usare il template di default)"
            ></textarea>
          </div>
        </div>

        <!-- Segmentazione -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Destinatari</h2>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tipo di Segmentazione *</label>
            <select
              v-model="form.segmentazione.tipo"
              required
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="tutti">Tutti i clienti</option>
              <option value="nuovi_clienti">Nuovi clienti (ultimi 30 giorni)</option>
              <option value="clienti_fedeli">Clienti fedeli (5+ appuntamenti)</option>
              <option value="inattivi">Clienti inattivi (60+ giorni)</option>
              <option value="compleanni">Compleanni del mese</option>
              <option value="personalizzato">Segmentazione personalizzata</option>
            </select>
          </div>
          
          <div v-if="form.segmentazione.tipo === 'personalizzato'" class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Criteri Personalizzati</label>
            <textarea
              v-model="form.segmentazione.criteri"
              rows="3"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Inserisci i criteri di filtro in formato JSON"
            ></textarea>
            <p class="text-sm text-gray-500 mt-1">
              Esempio: {"classificazione": "fedele", "consensoMarketing": true}
            </p>
          </div>
          
          <div class="mt-4">
            <button
              type="button"
              @click="anteprimaDestinatari"
              class="bg-blue-100 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-200 transition-colors"
            >
              <Eye class="w-4 h-4 inline mr-2" />
              Anteprima Destinatari ({{ destinatariCount }})
            </button>
          </div>
        </div>

        <!-- Programmazione -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Programmazione</h2>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tipo di Invio</label>
              <select
                v-model="form.programmazione.tipo"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="immediata">Invio Immediato</option>
                <option value="programmata">Invio Programmato</option>
                <option value="ricorrente">Invio Ricorrente</option>
              </select>
            </div>
            
            <div v-if="form.programmazione.tipo !== 'immediata'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Data Inizio</label>
                <input
                  v-model="form.programmazione.dataInizio"
                  type="datetime-local"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div v-if="form.programmazione.tipo === 'programmata'">
                <label class="block text-sm font-medium text-gray-700 mb-2">Data Fine (Opzionale)</label>
                <input
                  v-model="form.programmazione.dataFine"
                  type="datetime-local"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div v-if="form.programmazione.tipo === 'ricorrente'" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Tipo di Ricorrenza</label>
                <select
                  v-model="form.programmazione.ricorrenza.tipo"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="giornaliera">Giornaliera</option>
                  <option value="settimanale">Settimanale</option>
                  <option value="mensile">Mensile</option>
                  <option value="annuale">Annuale</option>
                </select>
              </div>
              
              <div v-if="form.programmazione.ricorrenza.tipo === 'settimanale'">
                <label class="block text-sm font-medium text-gray-700 mb-2">Giorni della Settimana</label>
                <div class="flex flex-wrap gap-2">
                  <label v-for="(giorno, index) in giorni" :key="index" class="flex items-center">
                    <input
                      type="checkbox"
                      :value="index"
                      v-model="form.programmazione.ricorrenza.giorni"
                      class="mr-2"
                    />
                    {{ giorno }}
                  </label>
                </div>
              </div>
              
              <div v-if="form.programmazione.ricorrenza.tipo === 'mensile'">
                <label class="block text-sm font-medium text-gray-700 mb-2">Giorno del Mese</label>
                <input
                  v-model.number="form.programmazione.ricorrenza.giornoMese"
                  type="number"
                  min="1"
                  max="31"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Azioni -->
        <div class="flex justify-between">
          <div class="space-x-4">
            <button
              type="button"
              @click="salvaBozza"
              class="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Save class="w-4 h-4 inline mr-2" />
              Salva come Bozza
            </button>
            
            <button
              v-if="isEditing && currentCampagna?.stato === 'bozza'"
              type="button"
              @click="testCampagna"
              class="bg-yellow-100 text-yellow-700 px-6 py-2 rounded-lg hover:bg-yellow-200 transition-colors"
            >
              <Send class="w-4 h-4 inline mr-2" />
              Invia Test
            </button>
          </div>
          
          <div class="space-x-4">
            <router-link
              to="/marketing/campagne"
              class="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors inline-block"
            >
              Annulla
            </router-link>
            
            <button
              type="submit"
              class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save class="w-4 h-4 inline mr-2" />
              {{ isEditing ? 'Aggiorna Campagna' : 'Crea Campagna' }}
            </button>
          </div>
        </div>
      </form>
    </div>

    <!-- Test Email Modal -->
    <div v-if="showTestModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">Invia Email di Test</h3>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Email di Test</label>
          <input
            v-model="testEmail"
            type="email"
            required
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="email@esempio.com"
          />
        </div>
        <div class="flex justify-end space-x-4">
          <button
            @click="showTestModal = false"
            class="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
          >
            Annulla
          </button>
          <button
            @click="inviaTest"
            class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Invia Test
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLeft, Save, Send, Eye
} from 'lucide-vue-next'
import { useCampagneStore } from '@/stores/campagne'
import { useNotificationStore } from '@/stores/notifications'
import type { CreateCampagnaData, UpdateCampagnaData } from '@/services/campagne.service'

const route = useRoute()
const router = useRouter()
const campagneStore = useCampagneStore()
const notificationStore = useNotificationStore()

const loading = ref(false)
const showTestModal = ref(false)
const testEmail = ref('')
const destinatariCount = ref(0)

const isEditing = computed(() => !!route.params.id)
const currentCampagna = computed(() => campagneStore.currentCampagna)

const giorni = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato']

const form = ref<CreateCampagnaData | UpdateCampagnaData>({
  nome: '',
  descrizione: '',
  tipo: 'email',
  contenuto: {
    oggetto: '',
    corpo: '',
    templateHtml: ''
  },
  segmentazione: {
    tipo: 'tutti',
    criteri: ''
  },
  programmazione: {
    tipo: 'immediata',
    dataInizio: '',
    dataFine: '',
    oraInvio: '',
    ricorrenza: {
      tipo: 'nessuna',
      giorni: [],
      giornoMese: 1,
      giornoAnno: ''
    }
  },
  clientiTarget: []
})

const loadCampagna = async () => {
  if (!isEditing.value) return
  
  const id = route.params.id as string
  try {
    loading.value = true
    await campagneStore.fetchCampagnaById(id)
    
    if (currentCampagna.value) {
      // Popola il form con i dati della campagna
      form.value = {
        nome: currentCampagna.value.nome,
        descrizione: currentCampagna.value.descrizione || '',
        tipo: currentCampagna.value.tipo,
        contenuto: {
          oggetto: currentCampagna.value.contenuto.oggetto || '',
          corpo: currentCampagna.value.contenuto.corpo,
          templateHtml: currentCampagna.value.contenuto.templateHtml || ''
        },
        segmentazione: {
          tipo: currentCampagna.value.segmentazione.tipo,
          criteri: typeof currentCampagna.value.segmentazione.criteri === 'object' 
            ? JSON.stringify(currentCampagna.value.segmentazione.criteri, null, 2)
            : currentCampagna.value.segmentazione.criteri || ''
        },
        programmazione: currentCampagna.value.programmazione || {
          tipo: 'immediata',
          dataInizio: '',
          dataFine: '',
          oraInvio: '',
          ricorrenza: {
            tipo: 'nessuna',
            giorni: [],
            giornoMese: 1,
            giornoAnno: ''
          }
        },
        clientiTarget: currentCampagna.value.clientiTarget || []
      }
      
      await anteprimaDestinatari()
    }
  } catch (error) {
    notificationStore.error('Errore nel caricamento della campagna')
    router.push('/marketing/campagne')
  } finally {
    loading.value = false
  }
}

const anteprimaDestinatari = async () => {
  if (!isEditing.value) {
    // Per nuove campagne, stima basata sul tipo di segmentazione
    const stime = {
      tutti: 100,
      nuovi_clienti: 15,
      clienti_fedeli: 40,
      inattivi: 25,
      compleanni: 8,
      personalizzato: 0
    }
    destinatariCount.value = stime[form.value.segmentazione.tipo] || 0
    return
  }
  
  try {
    const id = route.params.id as string
    const response = await campagneStore.fetchClientiTarget(id)
    destinatariCount.value = response.totale
  } catch (error) {
    console.error('Errore nel recupero destinatari:', error)
    destinatariCount.value = 0
  }
}

const salvaBozza = async () => {
  const campagnaData = preparaDati()
  campagnaData.stato = 'bozza'
  
  try {
    if (isEditing.value) {
      await campagneStore.updateCampagna(route.params.id as string, campagnaData)
      notificationStore.success('Bozza salvata con successo')
    } else {
      await campagneStore.createCampagna(campagnaData)
      notificationStore.success('Bozza creata con successo')
      router.push('/marketing/campagne')
    }
  } catch (error) {
    notificationStore.error('Errore nel salvataggio della bozza')
  }
}

const salvaCampagna = async () => {
  const campagnaData = preparaDati()
  
  try {
    loading.value = true
    
    if (isEditing.value) {
      await campagneStore.updateCampagna(route.params.id as string, campagnaData)
      notificationStore.success('Campagna aggiornata con successo')
    } else {
      await campagneStore.createCampagna(campagnaData)
      notificationStore.success('Campagna creata con successo')
    }
    
    router.push('/marketing/campagne')
  } catch (error) {
    notificationStore.error(isEditing.value ? 'Errore nell\'aggiornamento della campagna' : 'Errore nella creazione della campagna')
  } finally {
    loading.value = false
  }
}

const preparaDati = () => {
  const data = { ...form.value }
  
  // Converte i criteri personalizzati da stringa a oggetto se necessario
  if (data.segmentazione.tipo === 'personalizzato' && typeof data.segmentazione.criteri === 'string') {
    try {
      data.segmentazione.criteri = JSON.parse(data.segmentazione.criteri as string)
    } catch (error) {
      data.segmentazione.criteri = {}
    }
  }
  
  // Rimuove campi vuoti dalla programmazione
  if (data.programmazione?.tipo === 'immediata') {
    data.programmazione = { tipo: 'immediata' }
  }
  
  return data
}

const testCampagna = () => {
  if (form.value.tipo !== 'email') {
    notificationStore.warning('Il test è disponibile solo per le campagne email')
    return
  }
  
  showTestModal.value = true
}

const inviaTest = async () => {
  if (!testEmail.value || !isEditing.value) return
  
  try {
    await campagneStore.testCampagna(route.params.id as string, testEmail.value)
    notificationStore.success('Email di test inviata con successo')
    showTestModal.value = false
    testEmail.value = ''
  } catch (error) {
    notificationStore.error('Errore nell\'invio dell\'email di test')
  }
}

// Watch per aggiornare la stima dei destinatari quando cambia la segmentazione
watch(() => form.value.segmentazione.tipo, anteprimaDestinatari)

onMounted(() => {
  loadCampagna()
  anteprimaDestinatari()
})
</script>
