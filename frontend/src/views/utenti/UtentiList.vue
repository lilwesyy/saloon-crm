<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="sm:flex sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Gestione Utenti</h1>
        <p class="mt-2 text-sm text-gray-700">Visualizza e gestisci tutti gli operatori del centro estetico</p>
      </div>
      <div class="mt-4 sm:mt-0">
        <router-link
          to="/utenti/nuovo"
          class="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
        >
          <svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Nuovo Utente
        </router-link>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label for="ruolo" class="block text-sm font-medium text-gray-700">Ruolo</label>
          <select
            id="ruolo"
            v-model="filters.ruolo"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
          >
            <option value="">Tutti i ruoli</option>
            <option value="admin">Amministratore</option>
            <option value="manager">Manager</option>
            <option value="operatore">Operatore</option>
            <option value="receptionist">Receptionist</option>
          </select>
        </div>
        
        <div>
          <label for="stato" class="block text-sm font-medium text-gray-700">Stato</label>
          <select
            id="stato"
            v-model="filters.attivo"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
          >
            <option value="">Tutti</option>
            <option value="true">Attivi</option>
            <option value="false">Disattivati</option>
          </select>
        </div>
        
        <div>
          <label for="search" class="block text-sm font-medium text-gray-700">Ricerca</label>
          <div class="mt-1 relative rounded-md shadow-sm">
            <input
              type="text"
              id="search"
              v-model="filters.search"
              @input="debouncedSearch"
              class="focus:ring-purple-500 focus:border-purple-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="Cerca per nome, email..."
            />
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Users List -->
    <div v-if="loading" class="flex justify-center py-12">
      <svg class="animate-spin h-8 w-8 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
    
    <div v-else-if="operatori.length === 0" class="bg-white shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6 text-center">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Nessun utente trovato</h3>
        <p class="mt-2 text-sm text-gray-500">
          Non sono presenti utenti con i filtri selezionati o devi prima creare degli utenti.
        </p>
      </div>
    </div>
    
    <div v-else class="bg-white shadow overflow-hidden sm:rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Utente
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ruolo
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Stato
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ultimo accesso
            </th>
            <th scope="col" class="relative px-6 py-3">
              <span class="sr-only">Azioni</span>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="operatore in operatori" :key="operatore._id" class="hover:bg-gray-50 cursor-pointer" @click="$router.push(`/utenti/${operatore._id}`)">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <span class="text-sm font-medium text-purple-800">
                    {{ getInitials(operatore.nome, operatore.cognome) }}
                  </span>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">
                    {{ operatore.nome }} {{ operatore.cognome }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ operatore.telefono || 'Nessun telefono' }}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ operatore.email }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="{
                  'bg-red-100 text-red-800': operatore.ruolo === 'admin',
                  'bg-yellow-100 text-yellow-800': operatore.ruolo === 'manager',
                  'bg-green-100 text-green-800': operatore.ruolo === 'operatore',
                  'bg-blue-100 text-blue-800': operatore.ruolo === 'receptionist'
                }"
              >
                {{ getRuoloLabel(operatore.ruolo) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="{
                  'bg-green-100 text-green-800': operatore.attivo,
                  'bg-gray-100 text-gray-800': !operatore.attivo
                }"
              >
                {{ operatore.attivo ? 'Attivo' : 'Disattivato' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ operatore.ultimoAccesso ? formatDate(operatore.ultimoAccesso) : 'Mai' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex space-x-2 justify-end">
                <button 
                  @click.stop="toggleAttivo(operatore)"
                  class="text-gray-500 hover:text-gray-700"
                >
                  <svg v-if="operatore.attivo" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Confirmation modal -->
    <div v-if="showConfirmation" class="fixed z-10 inset-0 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" @click="showConfirmation = false">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
        <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div>
            <div class="mt-3 text-center sm:mt-0 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                {{ selectedOperatore?.attivo ? 'Disattiva' : 'Attiva' }} utente
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  Sei sicuro di voler {{ selectedOperatore?.attivo ? 'disattivare' : 'attivare' }} l'utente 
                  <strong>{{ selectedOperatore?.nome }} {{ selectedOperatore?.cognome }}</strong>?
                  <br><br>
                  {{ selectedOperatore?.attivo 
                    ? 'L\'utente non potrà più accedere al sistema fino a quando non verrà riattivato.' 
                    : 'L\'utente potrà nuovamente accedere al sistema.' }}
                </p>
              </div>
            </div>
          </div>
          <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button 
              @click="confirmToggleAttivo"
              type="button" 
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              {{ selectedOperatore?.attivo ? 'Disattiva' : 'Attiva' }}
            </button>
            <button 
              @click="showConfirmation = false"
              type="button" 
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:w-auto sm:text-sm"
            >
              Annulla
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useOperatoriStore } from '@/stores/operatori'
import { useToast } from '@/composables/useToast'

const operatoriStore = useOperatoriStore()
const { success, error } = useToast()

const loading = ref(true)
const filters = reactive({
  ruolo: '',
  attivo: '',
  search: ''
})
const showConfirmation = ref(false)
const selectedOperatore = ref(null)

const operatori = computed(() => {
  let results = operatoriStore.operatoriOrdinati

  // Apply ruolo filter
  if (filters.ruolo) {
    results = results.filter(o => o.ruolo === filters.ruolo)
  }
  
  // Apply attivo filter
  if (filters.attivo === 'true') {
    results = results.filter(o => o.attivo === true)
  } else if (filters.attivo === 'false') {
    results = results.filter(o => o.attivo === false)
  }
  
  // Apply search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    results = results.filter(o => {
      return o.nome.toLowerCase().includes(searchLower) ||
             o.cognome.toLowerCase().includes(searchLower) ||
             o.email.toLowerCase().includes(searchLower)
    })
  }
  
  return results
})

const getInitials = (nome, cognome) => {
  return (nome?.[0] || '') + (cognome?.[0] || '')
}

const getRuoloLabel = (ruolo) => {
  switch(ruolo) {
    case 'admin': return 'Amministratore'
    case 'manager': return 'Manager'
    case 'operatore': return 'Operatore'
    case 'receptionist': return 'Receptionist'
    default: return ruolo
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  return date.toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Debounced search
let searchTimeout = null
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    // Just let reactive filters update
  }, 300)
}

const toggleAttivo = (operatore) => {
  selectedOperatore.value = operatore
  showConfirmation.value = true
}

const confirmToggleAttivo = async () => {
  if (!selectedOperatore.value) return
  
  try {
    const newStatus = !selectedOperatore.value.attivo
    await operatoriStore.toggleOperatoreAttivo(
      selectedOperatore.value._id, 
      newStatus
    )
    
    const statusText = newStatus ? 'attivato' : 'disattivato'
    success(`Utente ${statusText} con successo`)
    
    showConfirmation.value = false
    selectedOperatore.value = null
  } catch (err) {
    console.error('Errore durante la modifica dello stato:', err)
    error('Si è verificato un errore durante la modifica dello stato dell\'utente')
  }
}

onMounted(async () => {
  try {
    await operatoriStore.fetchOperatori()
  } finally {
    loading.value = false
  }
})
</script>
