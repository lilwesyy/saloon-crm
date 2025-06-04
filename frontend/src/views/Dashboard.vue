<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="sm:flex sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p class="mt-2 text-sm text-gray-700">Benvenuto nel sistema di gestione del centro estetico</p>
      </div>
      <div class="mt-4 sm:mt-0 flex space-x-3">
        <router-link
          to="/servizi/nuovo"
          class="flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Nuovo Servizio
        </router-link>
        
        <router-link
          to="/sale"
          class="flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Gestione Sale
        </router-link>
        
        <router-link
          to="/reminder"
          class="flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-3 3V7.5a4.5 4.5 0 00-9 0V15a1 1 0 001 1h6z" />
          </svg>
          Reminder
        </router-link>
      </div>
    </div>

    <!-- Welcome Text -->
    <div class="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
      <h2 class="text-xl font-semibold mb-2">
        Benvenuto nel tuo centro estetico CRM, {{ authStore.userName }}
      </h2>
      <p class="text-purple-100">
        Gestisci il tuo centro estetico in modo efficiente con tutti gli strumenti a tua disposizione.
      </p>
      <div class="mt-4">
        <span class="text-sm text-purple-100">
          Oggi è {{ formattedDate }}
        </span>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Total Clients -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Clienti Totali
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  <span v-if="isLoading">...</span>
                  <span v-else>{{ stats.totalClients }}</span>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-5 py-3">
          <div class="text-sm">
            <router-link to="/clienti" class="font-medium text-purple-700 hover:text-purple-900">
              Vedi tutti i clienti
            </router-link>
          </div>
        </div>
      </div>

      <!-- Today's Appointments -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Appuntamenti Oggi
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ todayAppointmentsCount }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-5 py-3">
          <div class="text-sm">
            <router-link to="/appuntamenti" class="font-medium text-blue-700 hover:text-blue-900">
              Vedi calendario
            </router-link>
          </div>
        </div>
      </div>

      <!-- Monthly Revenue -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Incassi Mese
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  €{{ stats.monthlyRevenue.toLocaleString() }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-5 py-3">
          <div class="text-sm">
            <router-link to="/pagamenti" class="font-medium text-green-700 hover:text-green-900">
              Vedi pagamenti
            </router-link>
          </div>
        </div>
      </div>

      <!-- Pending Payments -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 13.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Pagamenti Pendenti
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ stats.pendingPayments }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-5 py-3">
          <div class="text-sm">
            <router-link to="/pagamenti?status=pending" class="font-medium text-orange-700 hover:text-orange-900">
              Gestisci pagamenti
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activities -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">      
      <!-- Recent Appointments -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
            Prossimi Appuntamenti
          </h3>
          <div class="space-y-3">
            <div v-if="recentAppointments.length === 0" class="text-center py-4 text-gray-500">
              Nessun appuntamento in programma
            </div>
            <div
              v-for="appointment in recentAppointments"
              :key="appointment.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div class="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <span class="text-sm font-medium text-purple-700">
                      {{ getClientInitials(appointment.cliente) }}
                    </span>
                  </div>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ appointment.cliente }}</p>
                  <p class="text-sm text-gray-500">{{ appointment.servizio }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-gray-900">{{ appointment.ora }}</p>
                <p class="text-sm text-gray-500">{{ appointment.data }}</p>
              </div>
            </div>
          </div>
          <div class="mt-4">
            <router-link
              to="/appuntamenti"
              class="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200"
            >
              Vedi tutti gli appuntamenti
            </router-link>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
            Azioni Rapide
          </h3>
          <div class="grid grid-cols-1 gap-3">
            <router-link
              to="/clienti/nuovo"
              class="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
            >
              <svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nuovo Cliente
            </router-link>
            
            <router-link
              to="/appuntamenti/nuovo"
              class="flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Nuovo Appuntamento
            </router-link>
            
            <router-link
              to="/servizi/nuovo"
              class="flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14-7H5m14 14H5" />
              </svg>
              Nuovo Servizio
            </router-link>
            
            <router-link
              to="/reports"
              class="flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Visualizza Report
            </router-link>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Client Stats (moved to bottom) -->
    <div class="mt-6">
      <ClientiStats />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useAppuntamentiStore } from '@/stores/appuntamenti'
import ClientiStats from '@/components/dashboard/ClientiStats.vue'
import ClientiService from '@/services/clienti.service'

const authStore = useAuthStore()
const appuntamentiStore = useAppuntamentiStore()

// Loading state
const isLoading = ref(true)

// Dashboard stats
const stats = ref({
  totalClients: 0, // Will be updated from API
  monthlyRevenue: 12450, // This would come from a payments store
  pendingPayments: 3 // This would come from a payments store
})

// FORCED DIRECT VALUE FOR TESTING - Remove this once working
stats.value.totalClients = 150

// Use real appointment data from the store
const todayAppointments = computed(() => appuntamentiStore.appuntamentiOggi)
const todayAppointmentsCount = computed(() => appuntamentiStore.appuntamentiOggi.length)

// Get recent appointments (next 5 appointments starting from today)
const recentAppointments = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  return appuntamentiStore.appuntamenti
    .filter(app => {
      const appDate = new Date(app.dataOraInizio)
      return appDate >= today && app.stato !== 'cancellato'
    })
    .sort((a, b) => new Date(a.dataOraInizio).getTime() - new Date(b.dataOraInizio).getTime())
    .slice(0, 5)
    .map(app => ({
      id: app._id,
      cliente: app.cliente ? `${app.cliente.nome} ${app.cliente.cognome}` : 'Cliente non specificato',
      servizio: app.servizi && app.servizi.length > 0 
        ? app.servizi.map(s => s.servizio?.nome || 'Servizio sconosciuto').join(', ')
        : 'Nessun servizio',
      data: formatDate(app.dataOraInizio),
      ora: new Date(app.dataOraInizio).toLocaleTimeString('it-IT', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }))
})

const formattedDate = computed(() => {
  return new Date().toLocaleDateString('it-IT', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const formatDate = (dateTime: string | Date) => {
  const date = new Date(dateTime)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  const appDate = new Date(date)
  appDate.setHours(0, 0, 0, 0)
  
  if (appDate.getTime() === today.getTime()) {
    return 'Oggi'
  } else if (appDate.getTime() === tomorrow.getTime()) {
    return 'Domani'
  } else {
    return date.toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'short'
    })
  }
}

const getClientInitials = (clientName: string) => {
  return clientName.split(' ').map(name => name.charAt(0)).join('').toUpperCase()
}

// Load dashboard data
const loadDashboardData = async () => {
  try {
    isLoading.value = true
    
    // Load appointments data
    await appuntamentiStore.fetchAppuntamenti()
    
    // Get real client stats from API
    console.log('Dashboard: Caricamento statistiche clienti...')
    console.log('Dashboard: Token nel localStorage:', localStorage.getItem('token') ? 'presente' : 'assente')
    
    const clienteStatistiche = await ClientiService.getStatistiche()
    console.log('Dashboard: Statistiche ricevute:', clienteStatistiche)
    console.log('Dashboard: Tipo di clienteStatistiche:', typeof clienteStatistiche)
    console.log('Dashboard: clienteStatistiche.totale:', clienteStatistiche?.totale)
    console.log('Dashboard: Tipo di totale:', typeof clienteStatistiche?.totale)
    
    // Ensure we have valid data
    if (clienteStatistiche && typeof clienteStatistiche.totale === 'number') {
      // Update stats with real data
      stats.value.totalClients = clienteStatistiche.totale // Real count from API
      console.log('Dashboard: Stats aggiornate - totalClients:', stats.value.totalClients)
      console.log('Dashboard: stats.value dopo aggiornamento:', stats.value)
    } else {
      console.warn('Dashboard: Dati statistiche non validi:', clienteStatistiche)
      console.log('Dashboard: Condizione fallita - clienteStatistiche:', !!clienteStatistiche, 'typeof totale:', typeof clienteStatistiche?.totale)
    }
    
  } catch (error) {
    console.error('Errore nel caricamento dei dati dashboard:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  console.log('Dashboard: Component mounted, starting loadDashboardData...')
  await loadDashboardData()
  console.log('Dashboard: loadDashboardData completed, final stats:', stats.value)
})
</script>
