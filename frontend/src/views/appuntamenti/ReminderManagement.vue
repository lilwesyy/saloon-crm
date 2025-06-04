<template>
  <div class="container mx-auto p-6 bg-white rounded-lg shadow-lg">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">
        <i class="fas fa-bell mr-2"></i>
        Gestione Reminder Automatici
      </h2>
      <div class="flex space-x-2">
        <button
          @click="refreshStatus"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          :disabled="loading"
        >
          <i class="fas fa-sync-alt mr-1" :class="{ 'animate-spin': loading }"></i>
          Aggiorna
        </button>
        <button
          @click="testReminders"
          class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          :disabled="loading"
        >
          <i class="fas fa-play mr-1"></i>
          Test Reminder
        </button>
      </div>
    </div>

    <!-- Status Scheduler -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm opacity-80">Stato Scheduler</p>
            <p class="text-xl font-bold">
              {{ schedulerStatus.isRunning ? 'Attivo' : 'Inattivo' }}
            </p>
          </div>
          <i class="fas fa-clock text-2xl opacity-60"></i>
        </div>
      </div>

      <div class="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm opacity-80">Task Attivi</p>
            <p class="text-xl font-bold">{{ schedulerStatus.tasksCount || 0 }}</p>
          </div>
          <i class="fas fa-tasks text-2xl opacity-60"></i>
        </div>
      </div>

      <div class="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-lg text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm opacity-80">Ultimo Test</p>
            <p class="text-sm font-medium">
              {{ lastTestResult ? formatDateTime(lastTestResult.timestamp) : 'Mai eseguito' }}
            </p>
          </div>
          <i class="fas fa-test-tube text-2xl opacity-60"></i>
        </div>
      </div>

      <div class="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-lg text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm opacity-80">Reminder Inviati</p>
            <p class="text-xl font-bold">{{ lastTestResult?.totalSent || 0 }}</p>
          </div>
          <i class="fas fa-paper-plane text-2xl opacity-60"></i>
        </div>
      </div>
    </div>

    <!-- Controlli Scheduler -->
    <div class="bg-gray-50 p-4 rounded-lg mb-6">
      <h3 class="text-lg font-semibold mb-4">Controllo Scheduler</h3>
      <div class="flex space-x-3">
        <button
          @click="startScheduler"
          :disabled="schedulerStatus.isRunning || loading"
          class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <i class="fas fa-play mr-1"></i>
          Avvia Scheduler
        </button>
        <button
          @click="stopScheduler"
          :disabled="!schedulerStatus.isRunning || loading"
          class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <i class="fas fa-stop mr-1"></i>
          Ferma Scheduler
        </button>
      </div>
    </div>

    <!-- Configurazione Reminder -->
    <div class="bg-white border rounded-lg p-4 mb-6">
      <h3 class="text-lg font-semibold mb-4">Configurazione Reminder</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Reminder 24h -->
        <div class="border rounded-lg p-4">
          <div class="flex items-center justify-between mb-2">
            <h4 class="font-medium">24 Ore Prima</h4>
            <span class="text-sm text-gray-500">Attivo</span>
          </div>
          <p class="text-sm text-gray-600 mb-3">
            Inviato 24 ore prima dell'appuntamento per conferma
          </p>
          <div class="flex space-x-2">
            <button
              @click="executeReminder('24h')"
              class="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
              :disabled="loading"
            >
              Esegui Ora
            </button>
          </div>
        </div>

        <!-- Reminder 2h -->
        <div class="border rounded-lg p-4">
          <div class="flex items-center justify-between mb-2">
            <h4 class="font-medium">2 Ore Prima</h4>
            <span class="text-sm text-gray-500">Attivo</span>
          </div>
          <p class="text-sm text-gray-600 mb-3">
            Promemoria inviato 2 ore prima dell'appuntamento
          </p>
          <div class="flex space-x-2">
            <button
              @click="executeReminder('2h')"
              class="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
              :disabled="loading"
            >
              Esegui Ora
            </button>
          </div>
        </div>

        <!-- Reminder 30m -->
        <div class="border rounded-lg p-4">
          <div class="flex items-center justify-between mb-2">
            <h4 class="font-medium">30 Minuti Prima</h4>
            <span class="text-sm text-gray-500">Attivo</span>
          </div>
          <p class="text-sm text-gray-600 mb-3">
            Ultimo promemoria 30 minuti prima dell'appuntamento
          </p>
          <div class="flex space-x-2">
            <button
              @click="executeReminder('30m')"
              class="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
              :disabled="loading"
            >
              Esegui Ora
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Log Attività -->
    <div class="bg-white border rounded-lg p-4">
      <h3 class="text-lg font-semibold mb-4">Log Attività</h3>
      <div class="space-y-2 max-h-60 overflow-y-auto">
        <div
          v-for="(log, index) in activityLogs"
          :key="index"
          class="flex items-center justify-between p-2 bg-gray-50 rounded"
        >
          <div class="flex items-center">
            <i 
              :class="getLogIcon(log.type)"
              class="mr-2"
            ></i>
            <span class="text-sm">{{ log.message }}</span>
          </div>
          <span class="text-xs text-gray-500">{{ formatDateTime(log.timestamp) }}</span>
        </div>
        <div v-if="activityLogs.length === 0" class="text-center text-gray-500 py-4">
          Nessuna attività registrata
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="loading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg">
        <div class="flex items-center">
          <i class="fas fa-spinner animate-spin mr-3 text-blue-500"></i>
          <span>{{ loadingMessage }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ReminderManagement',
  data() {
    return {
      loading: false,
      loadingMessage: '',
      schedulerStatus: {
        isRunning: false,
        tasksCount: 0,
        tasks: {}
      },
      lastTestResult: null,
      activityLogs: []
    }
  },
  mounted() {
    this.refreshStatus()
  },
  methods: {
    async refreshStatus() {
      this.loading = true
      this.loadingMessage = 'Caricamento stato scheduler...'
      
      try {
        const response = await axios.get('/api/reminder/scheduler/status')
        this.schedulerStatus = response.data.scheduler
        this.addLog('info', 'Status scheduler aggiornato')
      } catch (error) {
        console.error('Errore caricamento status:', error)
        this.addLog('error', 'Errore nel caricamento dello status')
      } finally {
        this.loading = false
      }
    },

    async startScheduler() {
      this.loading = true
      this.loadingMessage = 'Avvio scheduler...'
      
      try {
        await axios.post('/api/reminder/scheduler/start')
        this.addLog('success', 'Scheduler avviato con successo')
        await this.refreshStatus()
      } catch (error) {
        console.error('Errore avvio scheduler:', error)
        this.addLog('error', 'Errore nell\'avvio dello scheduler')
      } finally {
        this.loading = false
      }
    },

    async stopScheduler() {
      this.loading = true
      this.loadingMessage = 'Fermata scheduler...'
      
      try {
        await axios.post('/api/reminder/scheduler/stop')
        this.addLog('warning', 'Scheduler fermato')
        await this.refreshStatus()
      } catch (error) {
        console.error('Errore fermata scheduler:', error)
        this.addLog('error', 'Errore nella fermata dello scheduler')
      } finally {
        this.loading = false
      }
    },

    async testReminders() {
      this.loading = true
      this.loadingMessage = 'Esecuzione test reminder...'
      
      try {
        const response = await axios.post('/api/reminder/scheduler/test')
        this.lastTestResult = response.data.result
        this.addLog('info', `Test completato: ${this.lastTestResult.totalSent} reminder inviati`)
      } catch (error) {
        console.error('Errore test reminder:', error)
        this.addLog('error', 'Errore durante il test dei reminder')
      } finally {
        this.loading = false
      }
    },

    async executeReminder(tipo) {
      this.loading = true
      this.loadingMessage = `Esecuzione reminder ${tipo}...`
      
      try {
        const response = await axios.post('/api/reminder/esegui', { tipo })
        const result = response.data
        this.addLog('success', `Reminder ${tipo}: ${result.inviati} inviati, ${result.errori} errori`)
      } catch (error) {
        console.error('Errore esecuzione reminder:', error)
        this.addLog('error', `Errore nell'esecuzione reminder ${tipo}`)
      } finally {
        this.loading = false
      }
    },

    addLog(type, message) {
      this.activityLogs.unshift({
        type,
        message,
        timestamp: new Date()
      })
      
      // Mantieni solo gli ultimi 50 log
      if (this.activityLogs.length > 50) {
        this.activityLogs = this.activityLogs.slice(0, 50)
      }
    },

    getLogIcon(type) {
      switch (type) {
        case 'success':
          return 'fas fa-check-circle text-green-500'
        case 'error':
          return 'fas fa-exclamation-circle text-red-500'
        case 'warning':
          return 'fas fa-exclamation-triangle text-yellow-500'
        case 'info':
        default:
          return 'fas fa-info-circle text-blue-500'
      }
    },

    formatDateTime(date) {
      if (!date) return ''
      return new Intl.DateTimeFormat('it-IT', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date(date))
    }
  }
}
</script>

<style scoped>
/* Animazioni personalizzate */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
