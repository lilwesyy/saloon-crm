<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="sm:flex sm:items-center sm:justify-between">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-bold text-gray-900">Gestione Sale</h1>
        <p class="mt-2 text-sm text-gray-700">Monitora e gestisci l'utilizzo delle sale del centro estetico</p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <button 
          @click="aggiornaStatistiche" 
          class="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          :disabled="loading"
        >
          <i class="fas fa-sync-alt mr-2" :class="{ 'fa-spin': loading }"></i>
          Aggiorna
        </button>
      </div>
    </div>

    <!-- Statistiche rapide -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="p-3 rounded-full bg-blue-100">
                <i class="fas fa-chart-pie text-blue-600 w-6 h-6"></i>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Utilizzo Oggi
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ utilizzoOggi }}%
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
      
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="p-3 rounded-full bg-green-100">
                <i class="fas fa-clock text-green-600 w-6 h-6"></i>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Sale Occupate
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ saleOccupate }}/{{ totaleSale }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
      
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="p-3 rounded-full bg-purple-100">
                <i class="fas fa-calendar-day text-purple-600 w-6 h-6"></i>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Appuntamenti Oggi
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ appuntamentiOggi }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lista sale -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-6">Sale Disponibili</h3>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div 
            v-for="sala in sale" 
            :key="sala.id"
            class="bg-white border-2 rounded-lg p-4 transition-all duration-200 hover:shadow-md"
            :class="{ 
              'border-red-200 bg-red-50': sala.occupata,
              'border-green-200 bg-green-50': !sala.occupata 
            }"
          >
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-lg font-medium text-gray-900">{{ sala.nome }}</h3>
              <span 
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="{ 
                  'bg-green-100 text-green-800': !sala.occupata,
                  'bg-red-100 text-red-800': sala.occupata 
                }"
              >
                {{ sala.occupata ? 'Occupata' : 'Disponibile' }}
              </span>
            </div>
            
            <div class="space-y-3">
              <p class="text-sm text-gray-600">{{ sala.descrizione }}</p>
              
              <div class="space-y-2">
                <div class="flex items-center text-sm text-gray-500">
                  <i class="fas fa-users text-gray-600 w-4 mr-2"></i>
                  {{ sala.capacita }} persone
                </div>
                <div class="flex items-center text-sm text-gray-500">
                  <i class="fas fa-tools text-gray-600 w-4 mr-2"></i>
                  {{ sala.attrezzature.length }} attrezzature
                </div>
              </div>
              
              <div>
                <h4 class="text-sm font-medium text-gray-900 mb-2">Servizi Supportati:</h4>
                <div class="flex flex-wrap gap-1">
                  <span 
                    v-for="servizio in sala.serviziSupportati" 
                    :key="servizio"
                    class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {{ servizio }}
                  </span>
                </div>
              </div>
            </div>
            
            <div class="flex space-x-2 mt-4 pt-4 border-t border-gray-200">
              <button 
                @click="visualizzaPianificazione(sala.id)"
                class="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <i class="fas fa-calendar mr-2"></i>
                Pianificazione
              </button>
              <button 
                @click="visualizzaStatistiche(sala.id)"
                class="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <i class="fas fa-chart-bar mr-2"></i>
                Statistiche
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Strumenti di Gestione -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-6">Strumenti di Gestione</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Verifica Disponibilità -->
          <div class="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h4 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <i class="fas fa-search text-blue-600 mr-2"></i>
              Verifica Disponibilità
            </h4>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Data e Ora:</label>
                <input 
                  v-model="verificaForm.dataOra" 
                  type="datetime-local" 
                  class="w-full border border-gray-300 rounded-md px-3 py-2"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Durata (minuti):</label>
                <input 
                  v-model="verificaForm.durata" 
                  type="number" 
                  class="w-full border border-gray-300 rounded-md px-3 py-2"
                  min="15"
                  step="15"
                >
              </div>
              <button 
                @click="verificaDisponibilita" 
                class="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                :disabled="!verificaForm.dataOra || !verificaForm.durata"
              >
                Verifica
              </button>
            </div>
          </div>

          <!-- Suggerimenti Sale -->
          <div class="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h4 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <i class="fas fa-lightbulb text-yellow-600 mr-2"></i>
              Suggerimenti Sale
            </h4>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tipo Servizio:</label>
                <select v-model="suggerimentiForm.tipoServizio" class="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="">Seleziona servizio</option>
                  <option value="massaggio">Massaggio</option>
                  <option value="trattamento_viso">Trattamento Viso</option>
                  <option value="manicure">Manicure</option>
                  <option value="pedicure">Pedicure</option>
                  <option value="depilazione">Depilazione</option>
                  <option value="trucco">Trucco</option>
                </select>
              </div>
              <div class="flex items-center">
                <input 
                  v-model="suggerimentiForm.clientePremium" 
                  type="checkbox" 
                  class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                >
                <label class="ml-2 block text-sm text-gray-700">Cliente Premium</label>
              </div>
              <button 
                @click="ottieniSuggerimenti" 
                class="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                :disabled="!suggerimentiForm.tipoServizio"
              >
                Ottieni Suggerimenti
              </button>
            </div>
          </div>

          <!-- Ottimizzazione -->
          <div class="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h4 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <i class="fas fa-chart-line text-green-600 mr-2"></i>
              Ottimizzazione
            </h4>
            <div class="space-y-4">
              <p class="text-sm text-gray-600">Analizza l'utilizzo delle sale e ottieni suggerimenti per migliorare l'efficienza.</p>
              <button 
                @click="ottieniOttimizzazione" 
                class="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Analizza Ottimizzazione
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Risultati -->
    <div v-if="risultati.length > 0" class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Risultati</h3>
          <button 
            @click="risultati = []" 
            class="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Pulisci
          </button>
        </div>
        <div class="space-y-4">
          <div 
            v-for="(risultato, index) in risultati" 
            :key="index"
            class="bg-gray-50 border border-gray-200 rounded-lg p-4"
          >
            <div class="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
              <h4 class="text-lg font-medium text-gray-900">{{ risultato.titolo }}</h4>
              <span class="text-sm text-gray-500">{{ formatDate(risultato.timestamp) }}</span>
            </div>
            <div class="bg-white border border-gray-200 rounded-md p-4">
              <pre class="text-sm text-gray-800 overflow-x-auto max-h-80 whitespace-pre-wrap">{{ JSON.stringify(risultato.data, null, 2) }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'SalaManagement',
  data() {
    return {
      loading: false,
      sale: [],
      utilizzoOggi: 0,
      saleOccupate: 0,
      totaleSale: 0,
      appuntamentiOggi: 0,
      
      verificaForm: {
        dataOra: '',
        durata: 60
      },
      
      suggerimentiForm: {
        tipoServizio: '',
        clientePremium: false
      },
      
      risultati: []
    }
  },
  
  mounted() {
    this.caricaSale()
    this.aggiornaStatistiche()
  },
  
  methods: {
    async caricaSale() {
      try {
        this.loading = true
        const response = await axios.get('/api/sale')
        this.sale = response.data.sale || []
        this.totaleSale = this.sale.length
        this.saleOccupate = this.sale.filter(sala => sala.occupata).length
      } catch (error) {
        console.error('Errore nel caricamento delle sale:', error)
        this.aggiungiMessaggio('Errore nel caricamento delle sale', 'error')
      } finally {
        this.loading = false
      }
    },
    
    async aggiornaStatistiche() {
      try {
        this.loading = true
        const response = await axios.get('/api/sale/statistiche/utilizzo')
        const statistiche = response.data
        
        this.utilizzoOggi = Math.round(statistiche.utilizzoMedioOggi || 0)
        this.appuntamentiOggi = statistiche.appuntamentiOggi || 0
        
        this.aggiungiRisultato('Statistiche Aggiornate', statistiche)
      } catch (error) {
        console.error('Errore nell\'aggiornamento delle statistiche:', error)
        this.aggiungiMessaggio('Errore nell\'aggiornamento delle statistiche', 'error')
      } finally {
        this.loading = false
      }
    },
    
    async verificaDisponibilita() {
      try {
        this.loading = true
        const response = await axios.post('/api/sale/1/disponibilita', {
          dataInizio: this.verificaForm.dataOra,
          durata: parseInt(this.verificaForm.durata)
        })
        
        this.aggiungiRisultato('Verifica Disponibilità', response.data)
      } catch (error) {
        console.error('Errore nella verifica disponibilità:', error)
        this.aggiungiMessaggio('Errore nella verifica disponibilità', 'error')
      } finally {
        this.loading = false
      }
    },
    
    async ottieniSuggerimenti() {
      try {
        this.loading = true
        const response = await axios.post('/api/sale/suggerimenti', {
          tipoServizio: this.suggerimentiForm.tipoServizio,
          clientePremium: this.suggerimentiForm.clientePremium,
          dataOra: new Date().toISOString()
        })
        
        this.aggiungiRisultato('Suggerimenti Sale', response.data)
      } catch (error) {
        console.error('Errore nell\'ottenere suggerimenti:', error)
        this.aggiungiMessaggio('Errore nell\'ottenere suggerimenti', 'error')
      } finally {
        this.loading = false
      }
    },
    
    async ottieniOttimizzazione() {
      try {
        this.loading = true
        const response = await axios.get('/api/sale/ottimizzazione/suggerimenti')
        
        this.aggiungiRisultato('Analisi Ottimizzazione', response.data)
      } catch (error) {
        console.error('Errore nell\'analisi ottimizzazione:', error)
        this.aggiungiMessaggio('Errore nell\'analisi ottimizzazione', 'error')
      } finally {
        this.loading = false
      }
    },
    
    async visualizzaPianificazione(salaId) {
      try {
        this.loading = true
        const response = await axios.get(`/api/sale/${salaId}/pianificazione-settimanale`)
        
        this.aggiungiRisultato(`Pianificazione Sala ${salaId}`, response.data)
      } catch (error) {
        console.error('Errore nel caricamento pianificazione:', error)
        this.aggiungiMessaggio('Errore nel caricamento pianificazione', 'error')
      } finally {
        this.loading = false
      }
    },
    
    async visualizzaStatistiche(salaId) {
      try {
        this.loading = true
        const response = await axios.get(`/api/sale/${salaId}/appuntamenti`)
        
        this.aggiungiRisultato(`Statistiche Sala ${salaId}`, response.data)
      } catch (error) {
        console.error('Errore nel caricamento statistiche sala:', error)
        this.aggiungiMessaggio('Errore nel caricamento statistiche sala', 'error')
      } finally {
        this.loading = false
      }
    },
    
    aggiungiRisultato(titolo, data) {
      this.risultati.unshift({
        titolo,
        data,
        timestamp: new Date()
      })
      
      // Mantieni solo gli ultimi 10 risultati
      if (this.risultati.length > 10) {
        this.risultati = this.risultati.slice(0, 10)
      }
    },
    
    aggiungiMessaggio(messaggio, tipo) {
      // Placeholder per sistema di notifiche
      console.log(`${tipo.toUpperCase()}: ${messaggio}`)
    },
    
    formatDate(date) {
      return new Intl.DateTimeFormat('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date(date))
    }
  }
}
</script>