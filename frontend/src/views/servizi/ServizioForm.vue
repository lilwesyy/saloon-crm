<template>
  <div class="container mx-auto px-4 py-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">
        {{ isEditing ? 'Modifica Servizio' : 'Nuovo Servizio' }}
      </h1>
      <router-link 
        to="/servizi" 
        class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
      >
        Torna alla Lista
      </router-link>
    </div>
    
    <div class="bg-white shadow-md rounded-lg p-6">
      <form @submit.prevent="handleSubmit">
        <div class="grid gap-6 md:grid-cols-2">
          <div>
            <label for="nome" class="block text-sm font-medium text-gray-700 mb-2">Nome Servizio *</label>
            <input 
              id="nome"
              v-model="servizio.nome" 
              type="text" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          
          <div>
            <label for="prezzo" class="block text-sm font-medium text-gray-700 mb-2">Prezzo (€) *</label>
            <input 
              id="prezzo"
              v-model="servizio.prezzo" 
              type="number" 
              step="0.01"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          
          <div>
            <label for="durata" class="block text-sm font-medium text-gray-700 mb-2">Durata (minuti) *</label>
            <input 
              id="durata"
              v-model="servizio.durata" 
              type="number" 
              min="15" 
              step="15"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          
          <div>
            <label for="categoria" class="block text-sm font-medium text-gray-700 mb-2">Categoria *</label>
            <div class="flex gap-2">
              <select 
                id="categoria"
                v-model="servizio.categoria"
                required
                class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleziona categoria</option>
                <option v-for="cat in categorie" :key="cat" :value="cat">{{ cat }}</option>
              </select>
              <button
                type="button"
                @click="showNewCategoryInput = !showNewCategoryInput"
                class="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                title="Aggiungi nuova categoria"
              >
                +
              </button>
            </div>
            <div v-if="showNewCategoryInput" class="mt-2 flex gap-2">
              <input
                v-model="nuovaCategoria"
                type="text"
                placeholder="Nome nuova categoria"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
              <button
                type="button"
                @click="aggiungiNuovaCategoria"
                class="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Aggiungi
              </button>
              <button
                type="button"
                @click="showNewCategoryInput = false; nuovaCategoria = ''"
                class="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Annulla
              </button>
            </div>
          </div>
        </div>
        
        <div class="mt-6">
          <label for="descrizione" class="block text-sm font-medium text-gray-700 mb-2">Descrizione</label>
          <textarea 
            id="descrizione"
            v-model="servizio.descrizione" 
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div class="mt-6">
          <label for="tempoRecupero" class="block text-sm font-medium text-gray-700 mb-2">Tempo di Recupero (minuti)</label>
          <input 
            id="tempoRecupero"
            v-model="servizio.tempoRecupero" 
            type="number" 
            min="0" 
            step="5"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
          <p class="text-xs text-gray-500 mt-1">Tempo di pausa necessario dopo il servizio</p>
        </div>
        
        <div class="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <label class="flex items-center">
              <input 
                v-model="servizio.attivo" 
                type="checkbox" 
                class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              >
              <span class="ml-2 text-sm text-gray-700">Servizio attivo</span>
            </label>
          </div>
          
          <div>
            <label class="flex items-center">
              <input 
                v-model="servizio.prenotabileOnline" 
                type="checkbox" 
                class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              >
              <span class="ml-2 text-sm text-gray-700">Prenotabile online</span>
            </label>
          </div>
        </div>
        
        <div class="mt-8 flex gap-4">
          <button 
            type="submit" 
            :disabled="loading"
            class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {{ loading ? 'Salvando...' : (isEditing ? 'Aggiorna' : 'Crea') }}
          </button>
          <router-link 
            to="/servizi" 
            class="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Annulla
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import serviziService, { type Servizio } from '@/services/servizi.service'
import { useToast } from '@/composables/useToast'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const loading = ref(false)
const categorie = ref<string[]>([])
const showNewCategoryInput = ref(false)
const nuovaCategoria = ref('')
const isEditing = computed(() => !!route.params.id)

const servizio = ref({
  nome: '',
  descrizione: '',
  prezzo: 0,
  durata: 60,
  categoria: '',
  attivo: true,
  prenotabileOnline: true,
  tempoRecupero: 0
})

const aggiungiNuovaCategoria = () => {
  if (nuovaCategoria.value.trim()) {
    if (!categorie.value.includes(nuovaCategoria.value.trim())) {
      categorie.value.push(nuovaCategoria.value.trim())
      toast.info(`Categoria '${nuovaCategoria.value.trim()}' aggiunta`)
    }
    servizio.value.categoria = nuovaCategoria.value.trim()
    nuovaCategoria.value = ''
    showNewCategoryInput.value = false
  }
}

const handleSubmit = async () => {
  loading.value = true
  try {
    if (isEditing.value) {
      await serviziService.updateServizio(route.params.id as string, servizio.value)
      toast.success('Servizio aggiornato con successo')
    } else {
      await serviziService.createServizio(servizio.value)
      toast.success('Servizio creato con successo')
    }
    router.push('/servizi')
  } catch (error) {
    console.error('Errore nel salvare il servizio:', error)
    toast.error('Errore nel salvare il servizio: ' + (error.response?.data?.message || error.message || 'Errore sconosciuto'))
  } finally {
    loading.value = false
  }
}

const loadCategorie = async () => {
  try {
    categorie.value = await serviziService.getCategorie()
  } catch (error) {
    console.error('Errore nel caricamento delle categorie:', error)
    toast.error('Errore nel caricamento delle categorie')
  }
}

onMounted(async () => {
  await loadCategorie()
  
  if (isEditing.value) {
    try {
      const servizioData = await serviziService.getServizioById(route.params.id as string)
      console.log('Servizio caricato:', servizioData)
      
      if (servizioData) {
        servizio.value = {
          nome: servizioData.nome || '',
          descrizione: servizioData.descrizione || '',
          prezzo: servizioData.prezzo || 0,
          durata: servizioData.durata || 60,
          categoria: servizioData.categoria || '',
          attivo: servizioData.attivo !== false,
          prenotabileOnline: servizioData.prenotabileOnline !== false,
          tempoRecupero: servizioData.tempoRecupero || 0
        }
      } else {
        console.error('Servizio non trovato')
        toast.error('Servizio non trovato')
        router.push('/servizi')
      }
    } catch (error) {
      console.error('Errore nel caricamento del servizio:', error)
      toast.error('Errore nel caricamento del servizio')
      router.push('/servizi')
    }
  }
})
</script>
