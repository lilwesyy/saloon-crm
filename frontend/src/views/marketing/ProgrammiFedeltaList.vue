<!-- filepath: /home/mirco/Documents/Dev/saloon-crm/frontend/src/views/marketing/ProgrammiFedeltaList.vue -->
<template>
  <div class="programmi-fedelta-list">
    <!-- Header -->
    <div class="page-header">
      <div class="header-left">
        <h1>Programmi Fedeltà</h1>
        <p class="subtitle">Gestisci i programmi di fidelizzazione dei clienti</p>
      </div>
      <div class="header-actions">
        <button 
          class="btn btn-primary"
          @click="showProgrammaForm = true"
        >
          <i class="fas fa-plus"></i>
          Nuovo Programma
        </button>
      </div>
    </div>

    <!-- Statistiche generali -->
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-star"></i>
        </div>
        <div class="stat-content">
          <h3>{{ statistics?.totalPrograms || 0 }}</h3>
          <p>Programmi Attivi</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-users"></i>
        </div>
        <div class="stat-content">
          <h3>{{ statistics?.totalMembers || 0 }}</h3>
          <p>Membri Totali</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-gift"></i>
        </div>
        <div class="stat-content">
          <h3>{{ statistics?.totalRewards || 0 }}</h3>
          <p>Premi Riscattati</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-coins"></i>
        </div>
        <div class="stat-content">
          <h3>{{ statistics?.totalPointsIssued || 0 }}</h3>
          <p>Punti Distribuiti</p>
        </div>
      </div>
    </div>

    <!-- Filtri -->
    <div class="filters-section">
      <div class="filters">
        <div class="filter-group">
          <label>Stato</label>
          <select v-model="filters.attivo" @change="loadProgrammi">
            <option value="">Tutti</option>
            <option value="true">Attivi</option>
            <option value="false">Inattivi</option>
          </select>
        </div>
        <div class="filter-group">
          <label>Tipo</label>
          <select v-model="filters.tipoPunti" @change="loadProgrammi">
            <option value="">Tutti i tipi</option>
            <option value="spesa">Per Spesa</option>
            <option value="visite">Per Visite</option>
            <option value="servizi">Per Servizi</option>
          </select>
        </div>
        <div class="filter-group">
          <input 
            type="text" 
            v-model="filters.search" 
            placeholder="Cerca programmi..."
            @input="debouncedSearch"
          >
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading">
      <i class="fas fa-spinner fa-spin"></i>
      Caricamento programmi...
    </div>

    <!-- Lista programmi -->
    <div v-else class="programmi-grid">
      <div 
        v-for="programma in programmi" 
        :key="programma._id"
        class="programma-card"
        :class="{ 'inactive': !programma.attivo }"
      >
        <div class="card-header">
          <div class="program-info">
            <h3>{{ programma.nome }}</h3>
            <p class="description">{{ programma.descrizione }}</p>
          </div>
          <div class="status-badge" :class="programma.attivo ? 'active' : 'inactive'">
            {{ programma.attivo ? 'Attivo' : 'Inattivo' }}
          </div>
        </div>

        <div class="card-content">
          <div class="program-details">
            <div class="detail-row">
              <span class="label">Tipo:</span>
              <span class="value">{{ getTipoLabel(programma.tipoPunti) }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Punti per Euro:</span>
              <span class="value">{{ programma.puntiPerEuro }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Membri:</span>
              <span class="value">{{ programma.statistiche?.membriAttivi || 0 }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Punti Distribuiti:</span>
              <span class="value">{{ programma.statistiche?.puntiDistribuiti || 0 }}</span>
            </div>
          </div>

          <div class="livelli-preview">
            <h4>Livelli ({{ programma.livelli.length }})</h4>
            <div class="livelli-badges">
              <span 
                v-for="livello in programma.livelli.slice(0, 3)" 
                :key="livello.nome"
                class="livello-badge"
              >
                {{ livello.nome }}
              </span>
              <span v-if="programma.livelli.length > 3" class="more-badge">
                +{{ programma.livelli.length - 3 }}
              </span>
            </div>
          </div>
        </div>

        <div class="card-actions">
          <button 
            class="btn btn-outline"
            @click="viewProgramma(programma)"
          >
            <i class="fas fa-eye"></i>
            Dettagli
          </button>
          <button 
            class="btn btn-outline"
            @click="editProgramma(programma)"
          >
            <i class="fas fa-edit"></i>
            Modifica
          </button>
          <button 
            class="btn btn-outline"
            @click="toggleProgramma(programma)"
          >
            <i :class="programma.attivo ? 'fas fa-pause' : 'fas fa-play'"></i>
            {{ programma.attivo ? 'Disattiva' : 'Attiva' }}
          </button>
          <button 
            class="btn btn-danger"
            @click="deleteProgramma(programma)"
          >
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="programmi.length === 0" class="empty-state">
        <i class="fas fa-star fa-3x"></i>
        <h3>Nessun programma fedeltà</h3>
        <p>Crea il tuo primo programma di fidelizzazione</p>
        <button 
          class="btn btn-primary"
          @click="showProgrammaForm = true"
        >
          Crea Programma
        </button>
      </div>
    </div>

    <!-- Modal Form -->
    <ProgrammaFedeltaForm
      v-if="showProgrammaForm"
      :programma="selectedProgramma"
      @close="closeProgrammaForm"
      @saved="onProgrammaSaved"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useProgrammaFedeltaStore } from '@/stores/programmaFedelta'
import { useNotificationStore } from '@/stores/notifications'
import ProgrammaFedeltaForm from './ProgrammaFedeltaForm.vue'
import type { ProgrammaFedelta } from '@/types/programmaFedelta'

// Simple debounce function
function debounce(func: (...args: any[]) => void, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout>
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(this, args), delay)
  }
}

export default defineComponent({
  name: 'ProgrammiFedeltaList',
  components: {
    ProgrammaFedeltaForm
  },
  setup() {
    const programmaStore = useProgrammaFedeltaStore()
    const notificationStore = useNotificationStore()

    const loading = ref(false)
    const showProgrammaForm = ref(false)
    const selectedProgramma = ref<ProgrammaFedelta | null>(null)

    const filters = ref({
      page: 1,
      limit: 10,
      cliente: '',
      livello: '',
      stato: ''
    })

    const programmi = computed(() => programmaStore.programmi)
    const statistics = computed(() => programmaStore.statistics)

    const debouncedSearch = debounce(() => {
      loadProgrammi()
    }, 500)

    const loadProgrammi = async () => {
      loading.value = true
      try {
        await programmaStore.fetchProgrammi(filters.value)
        await programmaStore.fetchStatistics()
      } catch (error) {
        notificationStore.error('Errore nel caricamento dei programmi fedeltà')
      } finally {
        loading.value = false
      }
    }

    const getTipoLabel = (tipo: string) => {
      const labels = {
        spesa: 'Per Spesa',
        visite: 'Per Visite',
        servizi: 'Per Servizi'
      }
      return labels[tipo as keyof typeof labels] || tipo
    }

    const viewProgramma = (programma: ProgrammaFedelta) => {
      // Navigate to detail view
      // router.push({ name: 'DettaglioProgrammaFedelta', params: { id: programma._id } })
    }

    const editProgramma = (programma: ProgrammaFedelta) => {
      selectedProgramma.value = programma
      showProgrammaForm.value = true
    }

    const toggleProgramma = async (programma: ProgrammaFedelta) => {
      try {
        if (programma.attivo) {
          await programmaStore.disattivaProgramma(programma._id)
          notificationStore.success('Programma disattivato con successo')
        } else {
          await programmaStore.attivaProgramma(programma._id)
          notificationStore.success('Programma attivato con successo')
        }
        await loadProgrammi()
      } catch (error) {
        notificationStore.error('Errore nell\'aggiornamento del programma')
      }
    }

    const deleteProgramma = async (programma: ProgrammaFedelta) => {
      if (!confirm(`Sei sicuro di voler eliminare il programma "${programma.nome}"?`)) {
        return
      }

      try {
        await programmaStore.deleteProgramma(programma._id)
        notificationStore.success('Programma eliminato con successo')
        await loadProgrammi()
      } catch (error) {
        notificationStore.error('Errore nell\'eliminazione del programma')
      }
    }

    const closeProgrammaForm = () => {
      showProgrammaForm.value = false
      selectedProgramma.value = null
    }

    const onProgrammaSaved = () => {
      closeProgrammaForm()
      loadProgrammi()
    }

    onMounted(() => {
      loadProgrammi()
    })

    return {
      loading,
      showProgrammaForm,
      selectedProgramma,
      filters,
      programmi,
      statistics,
      debouncedSearch,
      loadProgrammi,
      getTipoLabel,
      viewProgramma,
      editProgramma,
      toggleProgramma,
      deleteProgramma,
      closeProgrammaForm,
      onProgrammaSaved
    }
  }
})
</script>

<style scoped>
.programmi-fedelta-list {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
}

.header-left h1 {
  margin: 0 0 5px 0;
  color: #2c3e50;
  font-size: 28px;
  font-weight: 600;
}

.subtitle {
  color: #7f8c8d;
  margin: 0;
  font-size: 14px;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}

.stat-icon i {
  font-size: 24px;
  color: white;
}

.stat-content h3 {
  margin: 0 0 4px 0;
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
}

.stat-content p {
  margin: 0;
  font-size: 14px;
  color: #7f8c8d;
}

.filters-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.filters {
  display: flex;
  gap: 20px;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-group label {
  font-size: 14px;
  font-weight: 500;
  color: #2c3e50;
}

.filter-group select,
.filter-group input {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  min-width: 150px;
}

.loading {
  text-align: center;
  padding: 60px 20px;
  color: #7f8c8d;
}

.loading i {
  font-size: 24px;
  margin-bottom: 10px;
}

.programmi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 24px;
}

.programma-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.programma-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}

.programma-card.inactive {
  opacity: 0.7;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.program-info h3 {
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 18px;
  font-weight: 600;
}

.description {
  color: #7f8c8d;
  font-size: 14px;
  margin: 0;
  line-height: 1.4;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

.status-badge.active {
  background: #d4edda;
  color: #155724;
}

.status-badge.inactive {
  background: #f8d7da;
  color: #721c24;
}

.card-content {
  margin-bottom: 20px;
}

.program-details {
  margin-bottom: 20px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f8f9fa;
}

.detail-row:last-child {
  border-bottom: none;
}

.label {
  font-size: 14px;
  color: #7f8c8d;
}

.value {
  font-size: 14px;
  font-weight: 500;
  color: #2c3e50;
}

.livelli-preview h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #2c3e50;
}

.livelli-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.livello-badge,
.more-badge {
  padding: 4px 8px;
  background: #e3f2fd;
  color: #1976d2;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.more-badge {
  background: #f5f5f5;
  color: #666;
}

.card-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5a6fd8;
}

.btn-outline {
  background: transparent;
  color: #667eea;
  border: 1px solid #667eea;
}

.btn-outline:hover {
  background: #667eea;
  color: white;
}

.btn-danger {
  background: #e74c3c;
  color: white;
}

.btn-danger:hover {
  background: #c0392b;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
}

.empty-state i {
  color: #bdc3c7;
  margin-bottom: 20px;
}

.empty-state h3 {
  margin: 0 0 10px 0;
  color: #7f8c8d;
  font-size: 20px;
}

.empty-state p {
  margin: 0 0 20px 0;
  color: #95a5a6;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 20px;
  }

  .stats-cards {
    grid-template-columns: 1fr;
  }

  .filters {
    flex-direction: column;
    align-items: stretch;
  }

  .programmi-grid {
    grid-template-columns: 1fr;
  }

  .card-actions {
    justify-content: center;
  }
}
</style>
