<template>
  <div>
    <div class="container mx-auto px-4 py-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 class="text-3xl font-bold text-gray-900">
          Gestione Reminder Automatici
        </h1>
        <div class="flex gap-2">
          <button
            @click="refreshStatus"
            class="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium shadow-md"
            :disabled="loading"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :class="{ 'animate-spin': loading }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Aggiorna
          </button>
          <button
            @click="testReminders"
            class="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium shadow-md"
            :disabled="loading"
          >
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5" />
</svg>

            Test Reminder
          </button>
        </div>
      </div>

      <!-- Status Scheduler -->
      <div class="bg-white shadow-lg rounded-lg p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm opacity-80">Stato Scheduler</p>
                <p class="text-xl font-bold">
                  {{ schedulerStatus.isRunning ? 'Attivo' : 'Inattivo' }}
                </p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <div class="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm opacity-80">Task Attivi</p>
                <p class="text-xl font-bold">{{ schedulerStatus.tasksCount || 0 }}</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h5.586a1 1 0 00.707-.293l5.414-5.414a1 1 0 00.293-.707V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
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
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
          </div>

          <div class="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-lg text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm opacity-80">Reminder Inviati</p>
                <p class="text-xl font-bold">{{ lastTestResult?.totalSent || 0 }}</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Controlli Scheduler -->
      <div class="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Controllo Scheduler</h2>
        <div class="flex flex-col sm:flex-row gap-3">
          <button
            @click="startScheduler"
            :disabled="schedulerStatus.isRunning || loading"
            class="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium shadow-md"
          >
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  <path stroke-linecap="round" stroke-linejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
</svg>

            Avvia Scheduler
          </button>
          <button
            @click="stopScheduler"
            :disabled="!schedulerStatus.isRunning || loading"
            class="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors font-medium shadow-md"
          >
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>

            Ferma Scheduler
          </button>
        </div>
      </div>

      <!-- Configurazione Reminder -->
      <div class="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-6">Configurazione Reminder</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Reminder 24h -->
          <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-semibold text-gray-900">24 Ore Prima</h3>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Attivo
              </span>
            </div>
            <p class="text-sm text-gray-600 mb-4">
              Inviato 24 ore prima dell'appuntamento per conferma
            </p>
            <button
              @click="executeReminder('24h')"
              class="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-md"
              :disabled="loading"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Esegui Ora
            </button>
          </div>

          <!-- Reminder 2h -->
          <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-semibold text-gray-900">2 Ore Prima</h3>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Attivo
              </span>
            </div>
            <p class="text-sm text-gray-600 mb-4">
              Promemoria inviato 2 ore prima dell'appuntamento
            </p>
            <button
              @click="executeReminder('2h')"
              class="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-md"
              :disabled="loading"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Esegui Ora
            </button>
          </div>

          <!-- Reminder 30m -->
          <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-semibold text-gray-900">30 Minuti Prima</h3>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Attivo
              </span>
            </div>
            <p class="text-sm text-gray-600 mb-4">
              Ultimo promemoria 30 minuti prima dell'appuntamento
            </p>
            <button
              @click="executeReminder('30m')"
              class="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-md"
              :disabled="loading"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Esegui Ora
            </button>
          </div>
        </div>
      </div>

      <!-- Log Attività -->
      <div class="bg-white shadow-lg rounded-lg p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Log Attività</h2>
        <div class="space-y-3 max-h-80 overflow-y-auto">
          <div
            v-for="(log, index) in activityLogs"
            :key="index"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div class="flex items-center">
              <div class="flex-shrink-0 mr-3">
                <svg v-if="log.type === 'success'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <svg v-else-if="log.type === 'error'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <svg v-else-if="log.type === 'warning'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span class="text-sm text-gray-900">{{ log.message }}</span>
            </div>
            <span class="text-xs text-gray-500 whitespace-nowrap ml-4">{{ formatDateTime(log.timestamp) }}</span>
          </div>
          <div v-if="activityLogs.length === 0" class="text-center text-gray-500 py-8">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>Nessuna attività registrata</p>
          </div>
        </div>
      </div>

      <!-- Loading Overlay -->
      <div v-if="loading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-lg shadow-lg">
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="animate-spin h-6 w-6 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span class="text-gray-900">{{ loadingMessage }}</span>
          </div>
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
/* Animazioni personalizzate per coerenza con il design system */
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

/* Miglioramenti per il layout responsive */
@media (max-width: 640px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

/* Transizioni smooth per hover e focus */
.transition-all {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.transition-colors {
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
}

.transition-shadow {
  transition: box-shadow 0.15s ease-in-out;
}

/* Stili per disabled buttons per coerenza */
.disabled\:bg-gray-400:disabled {
  background-color: #9CA3AF;
}

.disabled\:cursor-not-allowed:disabled {
  cursor: not-allowed;
}

/* Hover effects consistenti */
.hover\:shadow-md:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.hover\:bg-gray-100:hover {
  background-color: #F3F4F6;
}

/* Focus ring per accessibilità */
.focus\:ring-2:focus {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

/* Scrollbar styling per la sezione log */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #F3F4F6;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #D1D5DB;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #9CA3AF;
}
</style>
