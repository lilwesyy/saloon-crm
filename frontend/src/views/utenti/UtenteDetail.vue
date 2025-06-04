<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="sm:flex sm:items-center sm:justify-between">
      <div>
        <div class="flex items-center">
          <h1 class="text-2xl font-bold text-gray-900">
            {{ operatore ? 'Dettaglio utente' : 'Nuovo utente' }}
          </h1>
          <div v-if="operatore && operatore.attivo === false" class="ml-3">
            <span class="px-2 py-1 text-xs leading-4 font-semibold rounded-full bg-red-100 text-red-800">
              Disattivato
            </span>
          </div>
        </div>
        <p class="mt-2 text-sm text-gray-700">
          {{ operatore ? 'Modifica dati utente' : 'Inserisci i dati del nuovo utente' }}
        </p>
      </div>
      <div class="mt-4 sm:mt-0 flex space-x-3">
        <router-link
          to="/utenti"
          class="flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Torna alla lista
        </router-link>
      </div>
    </div>
    
    <!-- Loading Indicator -->
    <div v-if="loading" class="flex justify-center py-12">
      <svg class="animate-spin h-8 w-8 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <!-- User Form -->
    <div v-else class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <form @submit.prevent="saveUser">
          <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <!-- Nome -->
            <div class="sm:col-span-3">
              <label for="nome" class="block text-sm font-medium text-gray-700">Nome *</label>
              <div class="mt-1">
                <input
                  type="text"
                  id="nome"
                  v-model="form.nome"
                  required
                  class="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <!-- Cognome -->
            <div class="sm:col-span-3">
              <label for="cognome" class="block text-sm font-medium text-gray-700">Cognome *</label>
              <div class="mt-1">
                <input
                  type="text"
                  id="cognome"
                  v-model="form.cognome"
                  required
                  class="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <!-- Email -->
            <div class="sm:col-span-3">
              <label for="email" class="block text-sm font-medium text-gray-700">Email *</label>
              <div class="mt-1">
                <input
                  type="email"
                  id="email"
                  v-model="form.email"
                  required
                  class="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <!-- Telefono -->
            <div class="sm:col-span-3">
              <label for="telefono" class="block text-sm font-medium text-gray-700">Telefono</label>
              <div class="mt-1">
                <input
                  type="tel"
                  id="telefono"
                  v-model="form.telefono"
                  class="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <!-- Password (solo per nuovi utenti) -->
            <div v-if="!operatore" class="sm:col-span-3">
              <label for="password" class="block text-sm font-medium text-gray-700">Password *</label>
              <div class="mt-1">
                <input
                  type="password"
                  id="password"
                  v-model="form.password"
                  required
                  class="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
                <p class="mt-1 text-xs text-gray-500">Minimo 6 caratteri</p>
              </div>
            </div>

            <!-- Ruolo -->
            <div class="sm:col-span-3">
              <label for="ruolo" class="block text-sm font-medium text-gray-700">Ruolo *</label>
              <div class="mt-1">
                <select
                  id="ruolo"
                  v-model="form.ruolo"
                  required
                  class="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="">Seleziona ruolo</option>
                  <option value="admin">Amministratore</option>
                  <option value="manager">Manager</option>
                  <option value="operatore">Operatore</option>
                  <option value="receptionist">Receptionist</option>
                </select>
              </div>
            </div>

            <!-- Servizi (solo per operatori) -->
            <div v-if="form.ruolo === 'operatore'" class="sm:col-span-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Servizi che può eseguire</label>
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div v-for="servizio in serviziList" :key="servizio._id" class="flex items-start">
                  <div class="flex items-center h-5">
                    <input
                      :id="`servizio-${servizio._id}`"
                      :value="servizio._id"
                      v-model="form.servizi"
                      type="checkbox"
                      class="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300 rounded"
                    />
                  </div>
                  <div class="ml-3 text-sm">
                    <label :for="`servizio-${servizio._id}`" class="font-medium text-gray-700">
                      {{ servizio.nome }}
                      <span class="text-gray-500 text-xs">({{ servizio.durata }} min - {{ formatPrice(servizio.prezzo) }})</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Orari di lavoro (solo per operatori) -->
            <div v-if="form.ruolo === 'operatore'" class="sm:col-span-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Orari di lavoro</label>
              <div class="space-y-2">
                <div v-for="giorno in giorni" :key="giorno.value" class="grid grid-cols-12 gap-3 items-center">
                  <div class="col-span-3">
                    <div class="flex items-center">
                      <input
                        :id="`attivo-${giorno.value}`"
                        v-model="form.orariLavoro[giorno.value].attivo"
                        type="checkbox"
                        class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <label :for="`attivo-${giorno.value}`" class="ml-2 block text-sm font-medium text-gray-700">
                        {{ giorno.label }}
                      </label>
                    </div>
                  </div>
                  <div class="col-span-4">
                    <input
                      type="time"
                      :id="`orainizio-${giorno.value}`"
                      v-model="form.orariLavoro[giorno.value].oraInizio"
                      :disabled="!form.orariLavoro[giorno.value].attivo"
                      class="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div class="col-span-1 text-center">-</div>
                  <div class="col-span-4">
                    <input
                      type="time"
                      :id="`orafine-${giorno.value}`"
                      v-model="form.orariLavoro[giorno.value].oraFine"
                      :disabled="!form.orariLavoro[giorno.value].attivo"
                      class="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Status -->
            <div class="sm:col-span-6" v-if="operatore">
              <div class="flex items-center">
                <input
                  id="attivo"
                  v-model="form.attivo"
                  type="checkbox"
                  class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label for="attivo" class="ml-2 block text-sm font-medium text-gray-700">
                  Utente attivo
                </label>
              </div>
              <p class="mt-1 text-xs text-gray-500">
                Quando disattivato, l'utente non potrà più accedere al sistema
              </p>
            </div>
          </div>

          <div class="mt-8 flex justify-end">
            <router-link
              to="/utenti"
              class="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Annulla
            </router-link>
            <button
              type="submit"
              :disabled="saving"
              class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              {{ saving ? 'Salvataggio...' : 'Salva' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOperatoriStore } from '@/stores/operatori'
import { useServiziStore } from '@/stores/servizi'
import { useToast } from '@/composables/useToast'

const route = useRoute()
const router = useRouter()
const operatoriStore = useOperatoriStore()
const serviziStore = useServiziStore()
const { showToast } = useToast()

const loading = ref(true)
const saving = ref(false)
const operatore = ref(null)

const giorni = [
  { label: 'Lunedì', value: 'lunedi' },
  { label: 'Martedì', value: 'martedi' },
  { label: 'Mercoledì', value: 'mercoledi' },
  { label: 'Giovedì', value: 'giovedi' },
  { label: 'Venerdì', value: 'venerdi' },
  { label: 'Sabato', value: 'sabato' },
  { label: 'Domenica', value: 'domenica' }
]

// Default orari lavoro for new operators
const defaultOrariLavoro = {
  lunedi: { attivo: true, oraInizio: '09:00', oraFine: '18:00' },
  martedi: { attivo: true, oraInizio: '09:00', oraFine: '18:00' },
  mercoledi: { attivo: true, oraInizio: '09:00', oraFine: '18:00' },
  giovedi: { attivo: true, oraInizio: '09:00', oraFine: '18:00' },
  venerdi: { attivo: true, oraInizio: '09:00', oraFine: '18:00' },
  sabato: { attivo: true, oraInizio: '09:00', oraFine: '13:00' },
  domenica: { attivo: false, oraInizio: '09:00', oraFine: '18:00' }
}

const form = reactive({
  nome: '',
  cognome: '',
  email: '',
  telefono: '',
  password: '',
  ruolo: '',
  attivo: true,
  servizi: [],
  orariLavoro: JSON.parse(JSON.stringify(defaultOrariLavoro))
})

const serviziList = computed(() => {
  return serviziStore.serviziAttivi || []
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

const loadData = async () => {
  try {
    loading.value = true
    
    // Load servizi for dropdown
    await serviziStore.fetchServizi()
    
    // If we have an ID, load the operatore
    const id = route.params.id
    if (id !== 'nuovo') {
      operatore.value = await operatoriStore.fetchOperatoreById(id)
      if (operatore.value) {
        // Fill the form with operatore data
        form.nome = operatore.value.nome || ''
        form.cognome = operatore.value.cognome || ''
        form.email = operatore.value.email || ''
        form.telefono = operatore.value.telefono || ''
        form.ruolo = operatore.value.ruolo || ''
        form.attivo = operatore.value.attivo !== false
        form.servizi = operatore.value.servizi?.map(s => s._id || s) || []
        
        // Handle orari lavoro
        if (operatore.value.orariLavoro) {
          form.orariLavoro = { ...defaultOrariLavoro, ...operatore.value.orariLavoro }
        }
      }
    }
  } catch (error) {
    showToast('Errore durante il caricamento dei dati', 'error')
    console.error('Error loading data:', error)
  } finally {
    loading.value = false
  }
}

const saveUser = async () => {
  try {
    saving.value = true
    
    // Basic validation
    if (!form.nome || !form.cognome || !form.email || !form.ruolo) {
      showToast('Compila tutti i campi obbligatori', 'error')
      return
    }
    
    if (!operatore.value && (!form.password || form.password.length < 6)) {
      showToast('La password deve essere di almeno 6 caratteri', 'error')
      return
    }
    
    const userData = {
      nome: form.nome,
      cognome: form.cognome,
      email: form.email,
      telefono: form.telefono,
      ruolo: form.ruolo,
      attivo: form.attivo
    }
    
    // Add password only for new users
    if (!operatore.value) {
      userData.password = form.password
    }
    
    // Add operatore-specific fields if role is operatore
    if (form.ruolo === 'operatore') {
      userData.servizi = form.servizi
      userData.orariLavoro = form.orariLavoro
    }
    
    let savedUser
    if (operatore.value) {
      // Update existing user
      savedUser = await operatoriStore.updateOperatore(operatore.value._id, userData)
      showToast('Utente aggiornato con successo', 'success')
    } else {
      // Create new user
      savedUser = await operatoriStore.createOperatore(userData)
      showToast('Utente creato con successo', 'success')
    }
    
    // Navigate back to the user list
    router.push('/utenti')
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Si è verificato un errore'
    showToast(errorMessage, 'error')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>
