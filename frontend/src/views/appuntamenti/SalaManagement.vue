<template>
  <div class="sala-management">
    <div class="page-header">
      <h1 class="page-title">
        <i class="fas fa-door-open"></i>
        Gestione Sale
      </h1>
      <p class="page-subtitle">
        Monitora e gestisci l'utilizzo delle sale del centro estetico
      </p>
    </div>

    <!-- Dashboard Overview -->
    <div class="dashboard-cards">
      <div class="card overview-card">
        <div class="card-icon">
          <i class="fas fa-chart-pie"></i>
        </div>
        <div class="card-content">
          <h3>Utilizzo Oggi</h3>
          <p class="metric">{{ utilizzoOggi }}%</p>
        </div>
      </div>
      
      <div class="card overview-card">
        <div class="card-icon">
          <i class="fas fa-clock"></i>
        </div>
        <div class="card-content">
          <h3>Sale Occupate</h3>
          <p class="metric">{{ saleOccupate }}/{{ totaleSale }}</p>
        </div>
      </div>
      
      <div class="card overview-card">
        <div class="card-icon">
          <i class="fas fa-calendar-day"></i>
        </div>
        <div class="card-content">
          <h3>Appuntamenti Oggi</h3>
          <p class="metric">{{ appuntamentiOggi }}</p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Sale Grid -->
      <div class="section">
        <div class="section-header">
          <h2>
            <i class="fas fa-list"></i>
            Sale Disponibili
          </h2>
          <div class="controls">
            <button 
              @click="aggiornaStatistiche" 
              class="btn btn-primary"
              :disabled="loading"
            >
              <i class="fas fa-sync-alt" :class="{ 'fa-spin': loading }"></i>
              Aggiorna
            </button>
          </div>
        </div>
        
        <div class="sale-grid">
          <div 
            v-for="sala in sale" 
            :key="sala.id"
            class="sala-card"
            :class="{ 
              'occupata': sala.occupata,
              'disponibile': !sala.occupata 
            }"
          >
            <div class="sala-header">
              <h3>{{ sala.nome }}</h3>
              <span 
                class="status-badge"
                :class="{ 
                  'disponibile': !sala.occupata,
                  'occupata': sala.occupata 
                }"
              >
                {{ sala.occupata ? 'Occupata' : 'Disponibile' }}
              </span>
            </div>
            
            <div class="sala-details">
              <p class="description">{{ sala.descrizione }}</p>
              <div class="sala-specs">
                <span class="spec">
                  <i class="fas fa-users"></i>
                  {{ sala.capacita }} persone
                </span>
                <span class="spec">
                  <i class="fas fa-tools"></i>
                  {{ sala.attrezzature.length }} attrezzature
                </span>
              </div>
              
              <div class="servizi-supportati">
                <h4>Servizi Supportati:</h4>
                <div class="servizi-tags">
                  <span 
                    v-for="servizio in sala.serviziSupportati" 
                    :key="servizio"
                    class="servizio-tag"
                  >
                    {{ servizio }}
                  </span>
                </div>
              </div>
            </div>
            
            <div class="sala-actions">
              <button 
                @click="visualizzaPianificazione(sala.id)"
                class="btn btn-outline"
              >
                <i class="fas fa-calendar"></i>
                Pianificazione
              </button>
              <button 
                @click="visualizzaStatistiche(sala.id)"
                class="btn btn-outline"
              >
                <i class="fas fa-chart-bar"></i>
                Statistiche
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Strumenti di Gestione -->
      <div class="section">
        <div class="section-header">
          <h2>
            <i class="fas fa-tools"></i>
            Strumenti di Gestione
          </h2>
        </div>
        
        <div class="tools-grid">
          <!-- Verifica Disponibilità -->
          <div class="tool-card">
            <h3>
              <i class="fas fa-search"></i>
              Verifica Disponibilità
            </h3>
            <div class="form-group">
              <label>Data e Ora:</label>
              <input 
                v-model="verificaForm.dataOra" 
                type="datetime-local" 
                class="form-control"
              >
            </div>
            <div class="form-group">
              <label>Durata (minuti):</label>
              <input 
                v-model="verificaForm.durata" 
                type="number" 
                class="form-control"
                min="15"
                step="15"
              >
            </div>
            <button 
              @click="verificaDisponibilita" 
              class="btn btn-primary"
              :disabled="!verificaForm.dataOra || !verificaForm.durata"
            >
              Verifica
            </button>
          </div>

          <!-- Suggerimenti Sale -->
          <div class="tool-card">
            <h3>
              <i class="fas fa-lightbulb"></i>
              Suggerimenti Sale
            </h3>
            <div class="form-group">
              <label>Tipo Servizio:</label>
              <select v-model="suggerimentiForm.tipoServizio" class="form-control">
                <option value="">Seleziona servizio</option>
                <option value="massaggio">Massaggio</option>
                <option value="trattamento_viso">Trattamento Viso</option>
                <option value="manicure">Manicure</option>
                <option value="pedicure">Pedicure</option>
                <option value="depilazione">Depilazione</option>
                <option value="trucco">Trucco</option>
              </select>
            </div>
            <div class="form-group">
              <label>Cliente Premium:</label>
              <input 
                v-model="suggerimentiForm.clientePremium" 
                type="checkbox" 
                class="form-checkbox"
              >
            </div>
            <button 
              @click="ottieniSuggerimenti" 
              class="btn btn-primary"
              :disabled="!suggerimentiForm.tipoServizio"
            >
              Ottieni Suggerimenti
            </button>
          </div>

          <!-- Ottimizzazione -->
          <div class="tool-card">
            <h3>
              <i class="fas fa-chart-line"></i>
              Ottimizzazione
            </h3>
            <p>Analizza l'utilizzo delle sale e ottieni suggerimenti per migliorare l'efficienza.</p>
            <button 
              @click="ottieniOttimizzazione" 
              class="btn btn-primary"
            >
              Analizza Ottimizzazione
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Risultati -->
    <div v-if="risultati.length > 0" class="section">
      <div class="section-header">
        <h2>
          <i class="fas fa-list-ul"></i>
          Risultati
        </h2>
        <button @click="risultati = []" class="btn btn-outline">
          <i class="fas fa-times"></i>
          Pulisci
        </button>
      </div>
      
      <div class="risultati-container">
        <div 
          v-for="(risultato, index) in risultati" 
          :key="index"
          class="risultato-card"
        >
          <div class="risultato-header">
            <h4>{{ risultato.titolo }}</h4>
            <span class="timestamp">{{ formatDate(risultato.timestamp) }}</span>
          </div>
          <div class="risultato-content">
            <pre>{{ JSON.stringify(risultato.data, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Caricamento...</p>
      </div>
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

<style scoped>
.sala-management {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 30px;
  text-align: center;
}

.page-title {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.page-subtitle {
  color: #7f8c8d;
  font-size: 1.1rem;
}

.dashboard-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.overview-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 25px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.card-icon {
  font-size: 2.5rem;
  opacity: 0.8;
}

.card-content h3 {
  margin: 0 0 10px 0;
  font-size: 1rem;
  opacity: 0.9;
}

.metric {
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
}

.section {
  margin-bottom: 40px;
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #ecf0f1;
}

.section-header h2 {
  color: #2c3e50;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.controls {
  display: flex;
  gap: 10px;
}

.sale-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
}

.sala-card {
  border: 2px solid #ecf0f1;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
  background: white;
}

.sala-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
}

.sala-card.disponibile {
  border-color: #27ae60;
}

.sala-card.occupata {
  border-color: #e74c3c;
  background: #fdf2f2;
}

.sala-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.sala-header h3 {
  margin: 0;
  color: #2c3e50;
}

.status-badge {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: bold;
}

.status-badge.disponibile {
  background: #d5f4e6;
  color: #27ae60;
}

.status-badge.occupata {
  background: #ffeaea;
  color: #e74c3c;
}

.sala-details {
  margin-bottom: 20px;
}

.description {
  color: #7f8c8d;
  margin-bottom: 15px;
  font-style: italic;
}

.sala-specs {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.spec {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #34495e;
  font-size: 0.9rem;
}

.servizi-supportati h4 {
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 0.9rem;
}

.servizi-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.servizio-tag {
  background: #3498db;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
}

.sala-actions {
  display: flex;
  gap: 10px;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
}

.tool-card {
  border: 1px solid #ecf0f1;
  border-radius: 12px;
  padding: 25px;
  background: #f8f9fa;
}

.tool-card h3 {
  margin: 0 0 20px 0;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 10px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #34495e;
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.form-checkbox {
  width: auto;
  margin-left: 0;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #3498db;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2980b9;
  transform: translateY(-2px);
}

.btn-outline {
  background: transparent;
  color: #3498db;
  border: 1px solid #3498db;
}

.btn-outline:hover {
  background: #3498db;
  color: white;
}

.risultati-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.risultato-card {
  border: 1px solid #ecf0f1;
  border-radius: 12px;
  padding: 20px;
  background: #f8f9fa;
}

.risultato-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #dee2e6;
}

.risultato-header h4 {
  margin: 0;
  color: #2c3e50;
}

.timestamp {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.risultato-content pre {
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 15px;
  margin: 0;
  overflow-x: auto;
  max-height: 300px;
  font-size: 0.9rem;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-spinner {
  background: white;
  padding: 30px;
  border-radius: 15px;
  text-align: center;
}

.loading-spinner i {
  font-size: 2rem;
  color: #3498db;
  margin-bottom: 15px;
}

.loading-spinner p {
  margin: 0;
  color: #2c3e50;
}

@media (max-width: 768px) {
  .sala-management {
    padding: 15px;
  }
  
  .page-title {
    font-size: 2rem;
    flex-direction: column;
    gap: 10px;
  }
  
  .dashboard-cards {
    grid-template-columns: 1fr;
  }
  
  .sale-grid {
    grid-template-columns: 1fr;
  }
  
  .tools-grid {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .controls {
    width: 100%;
  }
}
</style>
