<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="sm:flex sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Servizi</h1>
        <p class="mt-2 text-sm text-gray-700">Gestisci i servizi offerti dal tuo centro</p>
      </div>
      <div class="mt-4 sm:mt-0 sm:flex-none">
        <router-link 
          to="/servizi/nuovo" 
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Nuovo Servizio
        </router-link>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="bg-white overflow-hidden shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Filtri</h3>
        <div class="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
          <!-- Campo ricerca -->
          <div class="flex-1 min-w-0">
            <label for="searchInput" class="block text-sm font-medium text-gray-700 mb-2">Cerca servizi</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input 
                id="searchInput" 
                type="text" 
                v-model="filtroRicerca" 
                placeholder="Cerca per nome servizio..."
                class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
          
          <!-- Filtri in riga -->
          <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            <!-- Filtro categoria -->
            <div class="min-w-[150px]">
              <label for="categoriaFiltro" class="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
              <select
                id="categoriaFiltro"
                v-model="filtroCategoria"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Tutte</option>
                <option v-for="cat in categorie" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>
            
            <!-- Filtro stato -->
            <div class="min-w-[130px]">
              <label for="statoFiltro" class="block text-sm font-medium text-gray-700 mb-2">Stato</label>
              <select 
                id="statoFiltro"
                v-model="filtroStato"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Tutti</option>
                <option value="attivo">Solo attivi</option>
                <option value="inattivo">Solo inattivi</option>
              </select>
            </div>

            <!-- Filtro prenotabilità online -->
            <div class="min-w-[160px]">
              <label for="prenotabileFiltro" class="block text-sm font-medium text-gray-700 mb-2">Prenotabilità</label>
              <select 
                id="prenotabileFiltro"
                v-model="filtroPrenotabile"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Tutti</option>
                <option value="si">Solo online</option>
                <option value="no">Non online</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Statistiche veloci -->
        <div class="mt-6 border-t border-gray-200 pt-4">
          <div class="grid grid-cols-3 gap-6">
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-600">{{ serviziFiltrati.length }}</div>
              <div class="text-sm text-gray-500">Servizi trovati</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-green-600">{{ serviziAttivi }}</div>
              <div class="text-sm text-gray-500">Attivi</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-purple-600">{{ serviziPrenotabili }}</div>
              <div class="text-sm text-gray-500">Prenotabili online</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Content Section -->
    <div class="bg-white overflow-hidden shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-8">
          <svg class="animate-spin h-8 w-8 mx-auto text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="mt-2 text-gray-600">Caricamento servizi...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="serviziFiltrati.length === 0" class="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Nessun servizio trovato</h3>
          <p class="text-gray-500 mb-6">Non ci sono servizi che corrispondono ai criteri di ricerca.</p>
          <router-link 
            to="/servizi/nuovo"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Crea il primo servizio
          </router-link>
        </div>
        
        <!-- Services Grid -->
        <div v-else class="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <div 
            v-for="servizio in serviziFiltrati" 
            :key="servizio._id"
            class="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
            :class="{'border-l-4 border-l-green-500': servizio.attivo, 'border-l-4 border-l-gray-300': !servizio.attivo}"
          >
            <!-- Card Header -->
            <div class="p-5 pb-3 flex-shrink-0">
              <div class="flex justify-between items-start mb-3">
                <h3 class="font-semibold text-lg leading-tight flex-1 mr-2 text-gray-900">{{ servizio.nome }}</h3>
                <div class="flex items-center flex-shrink-0 ml-2">
                  <span 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="servizio.attivo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                  >
                    {{ servizio.attivo ? 'Attivo' : 'Inattivo' }}
                  </span>
                </div>
              </div>
              
              <!-- Category and Online Badge -->
              <div class="flex items-center justify-between mb-3">
                <span class="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                  {{ servizio.categoria }}
                </span>
                <span 
                  v-if="servizio.prenotabileOnline" 
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                  </svg>
                  Online
                </span>
              </div>
            </div>
            
            <!-- Card Content -->
            <div class="px-5 flex-1 flex flex-col">
              <p class="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
                {{ servizio.descrizione || 'Nessuna descrizione disponibile' }}
              </p>
              
              <!-- Price and Duration -->
              <div class="flex justify-between items-end mb-4">
                <div>
                  <div class="text-2xl font-bold text-green-600">€{{ servizio.prezzo.toFixed(2) }}</div>
                </div>
                <div class="text-right">
                  <div class="flex items-center text-sm text-gray-500 justify-end mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{{ servizio.durata }} min</span>
                  </div>
                  <div v-if="servizio.tempoRecupero > 0" class="text-xs text-orange-500">
                    Recupero: +{{ servizio.tempoRecupero }} min
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Card Footer -->
            <div class="p-5 pt-0 flex-shrink-0 border-t border-gray-100">
              <div class="flex gap-3">
                <router-link 
                  :to="`/servizi/${servizio._id}`"
                  class="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors text-center flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Modifica
                </router-link>
                <button 
                  @click="deleteServizio(servizio._id, servizio.nome)"
                  class="flex-shrink-0 bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center"
                  title="Elimina servizio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmModal
      :modelValue="showDeleteModal"
      title="Conferma Eliminazione"
      :message="`Sei sicuro di voler eliminare il servizio ${servizioToDeleteName}?`"
      warningText="L'eliminazione di un servizio potrebbe impattare sugli appuntamenti esistenti."
      confirmButtonText="Elimina Servizio"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import DeleteConfirmModal from '@/components/common/DeleteConfirmModal.vue'
import serviziService from '@/services/servizi.service'
import { useToast } from '@/composables/useToast'

// Type definition
interface Servizio {
  _id: string
  nome: string
  descrizione?: string
  prezzo: number
  durata: number
  categoria: string
  attivo: boolean
  prenotabileOnline: boolean
  tempoRecupero: number
}

// Reactive data
const toast = useToast()
const loading = ref(true)
const servizi = ref<Servizio[]>([])
const serviziOriginali = ref<Servizio[]>([])
const categorie = ref<string[]>([])

// Filtri
const filtroRicerca = ref('')
const filtroCategoria = ref('')
const filtroStato = ref('')
const filtroPrenotabile = ref('')
const showDeleteModal = ref(false)
const servizioToDelete = ref<string | null>(null)
const servizioToDeleteName = ref<string | null>(null)

// Computed properties
const serviziFiltrati = computed<Servizio[]>(() => {
  let risultato = [...serviziOriginali.value]
  
  // Filtra per testo di ricerca
  if (filtroRicerca.value.trim()) {
    const cerca = filtroRicerca.value.toLowerCase().trim()
    risultato = risultato.filter(s => 
      s.nome.toLowerCase().includes(cerca) || 
      (s.descrizione && s.descrizione.toLowerCase().includes(cerca))
    )
  }
  
  // Filtra per categoria
  if (filtroCategoria.value) {
    risultato = risultato.filter(s => s.categoria === filtroCategoria.value)
  }
  
  // Filtra per stato
  if (filtroStato.value) {
    if (filtroStato.value === 'attivo') {
      risultato = risultato.filter(s => s.attivo)
    } else if (filtroStato.value === 'inattivo') {
      risultato = risultato.filter(s => !s.attivo)
    }
  }
  
  // Filtra per prenotabilità online
  if (filtroPrenotabile.value) {
    if (filtroPrenotabile.value === 'si') {
      risultato = risultato.filter(s => s.prenotabileOnline)
    } else if (filtroPrenotabile.value === 'no') {
      risultato = risultato.filter(s => !s.prenotabileOnline)
    }
  }
  
  return risultato
})

const serviziAttivi = computed(() => {
  return serviziFiltrati.value.filter(s => s.attivo).length
})

const serviziPrenotabili = computed(() => {
  return serviziFiltrati.value.filter(s => s.prenotabileOnline).length
})

// Methods
const fetchServizi = async () => {
  loading.value = true
  try {
    // console.log('Fetching servizi...')
    const data = await serviziService.getAllServizi()
    // console.log('Received data:', data)
    serviziOriginali.value = Array.isArray(data) ? data : []
    servizi.value = [...serviziOriginali.value] // Copia iniziale
  } catch (error) {
    console.error('Errore nel caricamento dei servizi:', error)
    toast.error('Impossibile caricare i servizi')
    serviziOriginali.value = []
    servizi.value = [] // Assicurati che sia sempre un array
  } finally {
    loading.value = false
  }
}

const fetchCategorie = async () => {
  try {
    // console.log('Caricamento categorie...')
    categorie.value = await serviziService.getCategorie()
    // console.log('Categorie caricate:', categorie.value)
  } catch (error) {
    console.error('Errore nel caricamento delle categorie:', error)
    toast.error('Impossibile caricare le categorie dei servizi')
    categorie.value = []
  }
}

const deleteServizio = (id: string, nome: string) => {
  servizioToDelete.value = id
  servizioToDeleteName.value = nome
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (servizioToDelete.value) {
    try {
      await serviziService.deleteServizio(servizioToDelete.value)
      toast.success('Servizio eliminato con successo')
      await fetchServizi() // Ricarica la lista dopo l'eliminazione
    } catch (error: any) {
      console.error('Errore nell\'eliminazione del servizio:', error)
      toast.error('Errore nell\'eliminazione del servizio: ' + (error.response?.data?.message || error.message || 'Errore sconosciuto'))
    } finally {
      showDeleteModal.value = false
    }
  }
}

const cancelDelete = (): void => {
  showDeleteModal.value = false
  servizioToDelete.value = null
  servizioToDeleteName.value = null
}

onMounted(async () => {
  await fetchCategorie()
  await fetchServizi()
})
</script>

<style scoped>
/* Classi CSS per migliorare la responsività */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Miglioramenti per schermi molto piccoli */
@media (max-width: 640px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .grid-cols-1 > div {
    min-width: 0; /* Previene overflow sui dispositivi piccoli */
  }
}

/* Animazioni smooth per hover e focus */
.transition-all {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Stili per card hover più fluidi */
.hover\:shadow-md:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Responsive breakpoints personalizzati per le card */
@media (min-width: 1280px) {
  .xl\:grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (min-width: 1536px) {
  .grid-cols-5-2xl {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}

/* Miglioramenti per focus accessibility */
.focus\:ring-2:focus {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}
</style>
