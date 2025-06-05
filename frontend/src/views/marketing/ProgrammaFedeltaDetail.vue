<!-- filepath: /home/mirco/Documents/Dev/saloon-crm/frontend/src/views/marketing/ProgrammaFedeltaDetail.vue -->
<template>
  <div class="programma-detail">
    <!-- Loading -->
    <div v-if="loading" class="loading">
      <i class="fas fa-spinner fa-spin"></i>
      Caricamento programma...
    </div>

    <!-- Content -->
    <div v-else-if="programma" class="content">
      <!-- Header -->
      <div class="page-header">
        <div class="header-left">
          <button class="back-btn" @click="$router.go(-1)">
            <i class="fas fa-arrow-left"></i>
          </button>
          <div class="title-section">
            <h1>{{ programma.cliente.nome }} {{ programma.cliente.cognome }}</h1>
            <div class="status-info">
              <span class="status-badge" :class="programma.attivo ? 'active' : 'inactive'">
                {{ programma.attivo ? 'Attivo' : 'Inattivo' }}
              </span>
              <span class="tipo-badge">{{ programma.livello }}</span>
            </div>
          </div>
        </div>
        <div class="header-actions">
          <button 
            class="btn btn-outline"
            @click="editProgramma"
          >
            <i class="fas fa-edit"></i>
            Modifica
          </button>
          <button 
            class="btn btn-outline"
            @click="toggleProgramma"
          >
            <i :class="programma.attivo ? 'fas fa-pause' : 'fas fa-play'"></i>
            {{ programma.attivo ? 'Disattiva' : 'Attiva' }}
          </button>
          <button 
            class="btn btn-danger"
            @click="openDeleteConfirm"
          >
            <i class="fas fa-trash"></i>
            Elimina
          </button>
        </div>
      </div>

      <!-- Statistiche -->
      <div class="stats-section">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon members">
              <i class="fas fa-users"></i>
            </div>
            <div class="stat-content">
              <h3>{{ statistiche.membriAttivi || 0 }}</h3>
              <p>Membri Attivi</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon points">
              <i class="fas fa-coins"></i>
            </div>
            <div class="stat-content">
              <h3>{{ statistiche.puntiDistribuiti || 0 }}</h3>
              <p>Punti Distribuiti</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon rewards">
              <i class="fas fa-gift"></i>
            </div>
            <div class="stat-content">
              <h3>{{ statistiche.premiRiscattati || 0 }}</h3>
              <p>Premi Riscattati</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon revenue">
              <i class="fas fa-euro-sign"></i>
            </div>
            <div class="stat-content">
              <h3>€{{ (statistiche.fatturatoGenerato || 0).toFixed(2) }}</h3>
              <p>Fatturato Generato</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="main-content">
        <div class="content-grid">
          <!-- Informazioni Programma -->
          <div class="info-card">
            <h2>Informazioni Programma</h2>
            <div class="info-content">
              <div class="info-row">
                <span class="label">Descrizione:</span>
                <span class="value">{{ programma.descrizione || 'Nessuna descrizione' }}</span>
              </div>
              <div class="info-row">
                <span class="label">Tipo Punti:</span>
                <span class="value">{{ getTipoLabel(programma.tipoPunti) }}</span>
              </div>
              <div class="info-row">
                <span class="label">Punti per Euro:</span>
                <span class="value">{{ programma.puntiPerEuro }}</span>
              </div>
              <div class="info-row">
                <span class="label">Data Creazione:</span>
                <span class="value">{{ formatDate(programma.dataCreazione) }}</span>
              </div>
              <div class="info-row">
                <span class="label">Ultimo Aggiornamento:</span>
                <span class="value">{{ formatDate(programma.dataAggiornamento) }}</span>
              </div>
            </div>
          </div>

          <!-- Regole -->
          <div class="info-card">
            <h2>Regole e Configurazioni</h2>
            <div class="info-content">
              <div class="info-row">
                <span class="label">Scadenza Punti:</span>
                <span class="value">
                  {{ programma.regole.scadenzaPunti === 0 ? 'Mai' : `${programma.regole.scadenzaPunti} giorni` }}
                </span>
              </div>
              <div class="info-row">
                <span class="label">Punti Minimi Riscatto:</span>
                <span class="value">{{ programma.regole.puntiMinimiRiscatto }}</span>
              </div>
              <div class="info-row">
                <span class="label">Max Punti al Giorno:</span>
                <span class="value">
                  {{ programma.regole.maxPuntiPerGiorno === 0 ? 'Illimitati' : programma.regole.maxPuntiPerGiorno }}
                </span>
              </div>
              <div class="info-row">
                <span class="label">Max Sconto per Ordine:</span>
                <span class="value">{{ programma.regole.maxScontoPerOrdine }}%</span>
              </div>
              <div class="info-row">
                <span class="label">Cumulabile con Promozioni:</span>
                <span class="value">{{ programma.regole.cumulabileConPromozioni ? 'Sì' : 'No' }}</span>
              </div>
              <div class="info-row">
                <span class="label">Assegnazione Automatica:</span>
                <span class="value">{{ programma.regole.automatico ? 'Sì' : 'No' }}</span>
              </div>
            </div>
          </div>

          <!-- Livelli -->
          <div class="info-card full-width">
            <h2>Livelli del Programma</h2>
            <div class="livelli-grid">
              <div 
                v-for="(livello, index) in programma.livelli"
                :key="index"
                class="livello-card"
              >
                <div class="livello-header">
                  <h3>{{ livello.nome }}</h3>
                  <span class="livello-index">{{ index + 1 }}</span>
                </div>
                <div class="livello-content">
                  <div class="livello-stat">
                    <i class="fas fa-star"></i>
                    <span>{{ livello.puntiRichiesti }} punti</span>
                  </div>
                  <div class="livello-stat">
                    <i class="fas fa-percentage"></i>
                    <span>{{ livello.scontoPercentuale }}% sconto</span>
                  </div>
                  <div class="livello-stat">
                    <i class="fas fa-times"></i>
                    <span>{{ livello.moltiplicatorePunti }}x punti</span>
                  </div>
                  <p class="livello-description">
                    {{ livello.descrizione || 'Nessuna descrizione' }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Membri del Programma -->
          <div class="info-card full-width">
            <div class="card-header-with-action">
              <h2>Membri del Programma</h2>
              <button class="btn btn-outline" @click="loadMembri">
                <i class="fas fa-sync"></i>
                Aggiorna
              </button>
            </div>
            <div class="membri-table">
              <div v-if="loadingMembri" class="loading-small">
                <i class="fas fa-spinner fa-spin"></i>
                Caricamento membri...
              </div>
              <div v-else-if="membri.length === 0" class="empty-state-small">
                <i class="fas fa-users"></i>
                <p>Nessun membro nel programma</p>
              </div>
              <table v-else>
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Livello</th>
                    <th>Punti</th>
                    <th>Data Iscrizione</th>
                    <th>Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="membro in membri.slice(0, 10)" :key="membro._id">
                    <td>
                      <div class="cliente-info">
                        <strong>{{ membro.cliente.nome }} {{ membro.cliente.cognome }}</strong>
                        <small>{{ membro.cliente.email }}</small>
                      </div>
                    </td>
                    <td>
                      <span class="livello-badge">{{ membro.livelloAttuale }}</span>
                    </td>
                    <td>
                      <strong>{{ membro.puntiAttuali }}</strong>
                    </td>
                    <td>{{ formatDate(membro.dataIscrizione) }}</td>
                    <td>
                      <button class="btn-small" @click="viewCliente(membro.cliente._id)">
                        <i class="fas fa-eye"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div v-if="membri.length > 10" class="table-footer">
                <p>Visualizzati 10 di {{ membri.length }} membri</p>
                <button class="btn btn-outline" @click="viewAllMembri">
                  Vedi tutti
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else class="not-found">
      <i class="fas fa-exclamation-triangle"></i>
      <h2>Programma non trovato</h2>
      <p>Il programma fedeltà richiesto non esiste.</p>
      <button class="btn btn-primary" @click="$router.push({ name: 'ProgrammiFedelta' })">
        Torna alla lista
      </button>
    </div>

    <!-- Edit Modal -->
    <ProgrammaFedeltaForm
      v-if="showEditForm"
      :programma="programma"
      @close="showEditForm = false"
      @saved="onProgrammaUpdated"
    />

    <!-- Delete Confirm Modal -->
    <DeleteConfirmModal
      v-model="showDeleteConfirm"
      :title="'Conferma Eliminazione'"
      :message="`Sei sicuro di voler eliminare questo programma fedeltà?`"
      :warning-text="'Questa operazione eliminerà definitivamente il programma e tutti i dati associati.'"
      @confirm="deleteProgramma"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProgrammaFedeltaStore } from '../../stores/programmaFedelta'
import { useNotificationStore } from '../../stores/notifications'
import ProgrammaFedeltaForm from './ProgrammaFedeltaForm.vue'
import DeleteConfirmModal from '@/components/common/DeleteConfirmModal.vue'
import type { ProgrammaFedelta } from '../../services/programmaFedelta.service'

export default defineComponent({
  name: 'ProgrammaFedeltaDetail',
  components: {
    ProgrammaFedeltaForm,
    DeleteConfirmModal
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const programmaStore = useProgrammaFedeltaStore()
    const notificationStore = useNotificationStore()

    const loading = ref(true)
    const loadingMembri = ref(false)
    const showEditForm = ref(false)
    const showDeleteConfirm = ref(false)
    const programma = ref<ProgrammaFedelta | null>(null)
    const statistiche = ref<any>({})
    const membri = ref<any[]>([])

    const programmaId = computed(() => route.params.id as string)

    const loadProgramma = async () => {
      try {
        loading.value = true
        programma.value = await programmaStore.getProgramma(programmaId.value)
        if (programma.value) {
          // Carica statistiche
          statistiche.value = await programmaStore.getStatisticheProgramma(programmaId.value)
          // Carica membri
          await loadMembri()
        }
      } catch (error) {
        notificationStore.error('Errore nel caricamento del programma')
      } finally {
        loading.value = false
      }
    }

    const loadMembri = async () => {
      try {
        loadingMembri.value = true
        membri.value = await programmaStore.getMembriProgramma(programmaId.value)
      } catch (error) {
        console.error('Errore nel caricamento dei membri:', error)
      } finally {
        loadingMembri.value = false
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

    const formatDate = (date: Date | string) => {
      return new Date(date).toLocaleDateString('it-IT', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const editProgramma = () => {
      showEditForm.value = true
    }

    const toggleProgramma = async () => {
      if (!programma.value) return

      try {
        if (programma.value.attivo) {
          await programmaStore.disattivaProgramma(programma.value._id)
        } else {
          await programmaStore.attivaProgramma(programma.value._id)
        }
        await loadProgramma()
        notificationStore.success(`Programma ${programma.value.attivo ? 'disattivato' : 'attivato'} con successo`)
      } catch (error) {
        notificationStore.error('Errore nell\'aggiornamento del programma')
      }
    }

    const openDeleteConfirm = () => {
      showDeleteConfirm.value = true
    }

    const deleteProgramma = async () => {
      if (!programma.value) return

      try {
        await programmaStore.deleteProgramma(programma.value._id)
        notificationStore.success('Programma eliminato con successo')
        router.push({ name: 'ProgrammiFedelta' })
      } catch (error) {
        notificationStore.error('Errore nell\'eliminazione del programma')
      } finally {
        showDeleteConfirm.value = false
      }
    }

    const viewCliente = (clienteId: string) => {
      router.push({ name: 'DettaglioCliente', params: { id: clienteId } })
    }

    const viewAllMembri = () => {
      // Navigate to members list with filter
      router.push({ 
        name: 'Clienti', 
        query: { programmaFedelta: programmaId.value } 
      })
    }

    const onProgrammaUpdated = () => {
      showEditForm.value = false
      loadProgramma()
    }

    onMounted(() => {
      loadProgramma()
    })

    return {
      loading,
      loadingMembri,
      showEditForm,
      showDeleteConfirm,
      programma,
      statistiche,
      membri,
      loadProgramma,
      loadMembri,
      getTipoLabel,
      formatDate,
      editProgramma,
      toggleProgramma,
      openDeleteConfirm,
      deleteProgramma,
      viewCliente,
      viewAllMembri,
      onProgrammaUpdated
    }
  }
})
</script>

<style scoped>
.programma-detail {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
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

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
}

.header-left {
  display: flex;
  align-items: flex-start;
  gap: 15px;
}

.back-btn {
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 8px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn:hover {
  background: #e9ecef;
}

.title-section h1 {
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 28px;
  font-weight: 600;
}

.status-info {
  display: flex;
  gap: 8px;
  align-items: center;
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

.tipo-badge {
  padding: 4px 12px;
  background: #e3f2fd;
  color: #1976d2;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.stats-section {
  margin-bottom: 30px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
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
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}

.stat-icon.members {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.points {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-icon.rewards {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-icon.revenue {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-icon i {
  font-size: 20px;
  color: white;
}

.stat-content h3 {
  margin: 0 0 4px 0;
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
}

.stat-content p {
  margin: 0;
  font-size: 12px;
  color: #7f8c8d;
}

.main-content {
  margin-bottom: 30px;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.info-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.info-card.full-width {
  grid-column: 1 / -1;
}

.info-card h2 {
  margin: 0 0 20px 0;
  color: #2c3e50;
  font-size: 18px;
  font-weight: 600;
}

.card-header-with-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-header-with-action h2 {
  margin: 0;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f8f9fa;
}

.info-row:last-child {
  border-bottom: none;
}

.label {
  font-size: 14px;
  color: #7f8c8d;
  font-weight: 500;
}

.value {
  font-size: 14px;
  color: #2c3e50;
  font-weight: 500;
}

.livelli-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.livello-card {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 16px;
}

.livello-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.livello-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 16px;
  font-weight: 600;
}

.livello-index {
  background: #667eea;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
}

.livello-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.livello-stat {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #2c3e50;
}

.livello-stat i {
  color: #667eea;
  width: 16px;
}

.livello-description {
  margin: 8px 0 0 0;
  font-size: 12px;
  color: #7f8c8d;
  font-style: italic;
}

.membri-table table {
  width: 100%;
  border-collapse: collapse;
}

.membri-table th,
.membri-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.membri-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
  font-size: 14px;
}

.cliente-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.cliente-info small {
  color: #7f8c8d;
  font-size: 12px;
}

.livello-badge {
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.btn-small {
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 6px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 12px;
}

.btn-small:hover {
  background: #e9ecef;
}

.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0 0 0;
  border-top: 1px solid #eee;
  margin-top: 16px;
}

.table-footer p {
  margin: 0;
  font-size: 14px;
  color: #7f8c8d;
}

.loading-small {
  text-align: center;
  padding: 20px;
  color: #7f8c8d;
  font-size: 14px;
}

.empty-state-small {
  text-align: center;
  padding: 40px 20px;
  color: #7f8c8d;
}

.empty-state-small i {
  font-size: 24px;
  margin-bottom: 10px;
}

.empty-state-small p {
  margin: 0;
  font-size: 14px;
}

.not-found {
  text-align: center;
  padding: 60px 20px;
}

.not-found i {
  font-size: 48px;
  color: #e74c3c;
  margin-bottom: 20px;
}

.not-found h2 {
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 24px;
}

.not-found p {
  margin: 0 0 20px 0;
  color: #7f8c8d;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
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

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 20px;
  }

  .header-actions {
    width: 100%;
    justify-content: stretch;
  }

  .header-actions .btn {
    flex: 1;
    justify-content: center;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .content-grid {
    grid-template-columns: 1fr;
  }

  .livelli-grid {
    grid-template-columns: 1fr;
  }

  .membri-table {
    overflow-x: auto;
  }

  .table-footer {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
  }

  .table-footer .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
