import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Lazy load delle views
const Dashboard = () => import('@/views/Dashboard.vue')
const Login = () => import('@/views/auth/Login.vue')
const Clienti = () => import('@/views/clienti/ClientiList.vue')
const ClienteDetail = () => import('@/views/clienti/ClienteDetail.vue')
const ClienteForm = () => import('@/views/clienti/ClienteForm.vue')
const ClientiRicerca = () => import('@/views/clienti/ClientiRicerca.vue')
const Appuntamenti = () => import('@/views/appuntamenti/AppuntamentiCalendar.vue')
const AppuntamentoForm = () => import('@/views/appuntamenti/AppuntamentoForm.vue')
const Servizi = () => import('@/views/servizi/ServiziList.vue')
const ServizioForm = () => import('@/views/servizi/ServizioForm.vue')
const Pagamenti = () => import('@/views/pagamenti/PagamentiList.vue')
const PagamentoForm = () => import('@/views/pagamenti/PagamentoForm.vue')
const PagamentoDetail = () => import('@/views/pagamenti/PagamentoDetail.vue')
const Reports = () => import('@/views/reports/Reports.vue')
const NotFound = () => import('@/views/NotFound.vue')

// Sale e Reminder views
const SalaManagement = () => import('@/views/appuntamenti/SalaManagement.vue')
const ReminderManagement = () => import('@/views/appuntamenti/ReminderManagement.vue')

// Marketing views
const CampagneList = () => import('@/views/marketing/CampagneList.vue')
const CampagnaForm = () => import('@/views/marketing/CampagnaForm.vue')
const CampagnaDetail = () => import('@/views/marketing/CampagnaDetail.vue')
const ProgrammiFedeltaList = () => import('@/views/marketing/ProgrammiFedeltaList.vue')
const ProgrammaFedeltaDetail = () => import('@/views/marketing/ProgrammaFedeltaDetail.vue')
const ProgrammaFedeltaForm = () => import('@/views/marketing/ProgrammaFedeltaForm.vue')
const FedeltaList = () => import('@/views/marketing/FedeltaList.vue')
const FedeltaDetail = () => import('@/views/marketing/FedeltaDetail.vue')

// Users management views
const UtentiList = () => import('@/views/utenti/UtentiList.vue')
const UtenteDetail = () => import('@/views/utenti/UtenteDetail.vue')
const Impostazioni = () => import('@/views/utenti/Impostazioni.vue')

// Prenotazione online views (pubbliche)
const PrenotazioneOnline = () => import('@/views/prenotazione/PrenotazioneOnline.vue')
const ConfermaPrenotazione = () => import('@/views/prenotazione/ConfermaPrenotazione.vue')
const CancellaPrenotazione = () => import('@/views/prenotazione/CancellaPrenotazione.vue')
const LandingPage = () => import('@/views/LandingPage.vue')

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home', 
    component: LandingPage,
    meta: { public: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { guest: true }
  },
  {
    path: '/clienti',
    name: 'Clienti',
    component: Clienti,
    meta: { requiresAuth: true }
  },
  {
    path: '/clienti/ricerca',
    name: 'RicercaClienti',
    component: ClientiRicerca,
    meta: { requiresAuth: true }
  },
  {
    path: '/clienti/nuovo',
    name: 'NuovoCliente',
    component: ClienteForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/clienti/:id',
    name: 'DettaglioCliente',
    component: ClienteDetail,
    meta: { requiresAuth: true }
  },
  {
    path: '/clienti/:id/modifica',
    name: 'ModificaCliente',
    component: ClienteForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/appuntamenti',
    name: 'Appuntamenti',
    component: Appuntamenti,
    meta: { requiresAuth: true }
  },
  {
    path: '/appuntamenti/nuovo',
    name: 'NuovoAppuntamento',
    component: AppuntamentoForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/appuntamenti/:id',
    name: 'ModificaAppuntamento',
    component: AppuntamentoForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/sale',
    name: 'GestioneSale',
    component: SalaManagement,
    meta: { requiresAuth: true }
  },
  {
    path: '/reminder',
    name: 'GestioneReminder',
    component: ReminderManagement,
    meta: { requiresAuth: true }
  },
  {
    path: '/servizi',
    name: 'Servizi',
    component: Servizi,
    meta: { requiresAuth: true }
  },
  {
    path: '/servizi/nuovo',
    name: 'NuovoServizio',
    component: ServizioForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/servizi/:id',
    name: 'ModificaServizio',
    component: ServizioForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/pagamenti',
    name: 'Pagamenti',
    component: Pagamenti,
    meta: { requiresAuth: true }
  },
  {
    path: '/pagamenti/nuovo',
    name: 'NuovoPagamento',
    component: PagamentoForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/pagamenti/:id',
    name: 'DettaglioPagamento',
    component: PagamentoDetail,
    meta: { requiresAuth: true }
  },
  {
    path: '/pagamenti/:id/modifica',
    name: 'ModificaPagamento',
    component: PagamentoForm,
    meta: { requiresAuth: true }
  },
  // Marketing routes
  {
    path: '/marketing/campagne',
    name: 'Campagne',
    component: CampagneList,
    meta: { requiresAuth: true }
  },
  {
    path: '/marketing/campagne/nuova',
    name: 'NuovaCampagna',
    component: CampagnaForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/marketing/campagne/create',
    redirect: '/marketing/campagne/nuova'
  },
  {
    path: '/marketing/campagne/:id',
    name: 'DettaglioCampagna',
    component: CampagnaDetail,
    meta: { requiresAuth: true }
  },
  {
    path: '/marketing/campagne/:id/modifica',
    name: 'ModificaCampagna',
    component: CampagnaForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/marketing/campagne/:id/edit',
    redirect: to => `/marketing/campagne/${to.params.id}/modifica`
  },
  {
    path: '/marketing/programmi-fedelta',
    name: 'ProgrammiFedelta',
    component: ProgrammiFedeltaList,
    meta: { requiresAuth: true }
  },
  {
    path: '/marketing/programmi-fedelta/nuovo',
    name: 'NuovoProgrammaFedelta',
    component: ProgrammaFedeltaForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/marketing/programmi-fedelta/:id',
    name: 'DettaglioProgrammaFedelta',
    component: ProgrammaFedeltaDetail,
    meta: { requiresAuth: true }
  },
  {
    path: '/marketing/programmi-fedelta/:id/modifica',
    name: 'ModificaProgrammaFedelta',
    component: ProgrammaFedeltaForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/marketing/fedelta',
    name: 'FedeltaList',
    component: FedeltaList,
    meta: { requiresAuth: true }
  },
  {
    path: '/marketing/fedelta/:id',
    name: 'FedeltaDetail',
    component: FedeltaDetail,
    meta: { requiresAuth: true }
  },
  {
    path: '/marketing/fedelta/create',
    redirect: '/marketing/programmi-fedelta/nuovo'
  },
  {
    path: '/marketing/fedelta/:id/edit',
    redirect: to => `/marketing/programmi-fedelta/${to.params.id}/modifica`
  },
  {
    path: '/reports',
    name: 'Reports',
    component: Reports,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  // User and operator management routes
  {
    path: '/utenti',
    name: 'Utenti',
    component: UtentiList,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/utenti/nuovo',
    name: 'NuovoUtente',
    component: UtenteDetail,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/utenti/:id',
    name: 'DettaglioUtente',
    component: UtenteDetail,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/impostazioni',
    name: 'Impostazioni',
    component: Impostazioni,
    meta: { requiresAuth: true }
  },
  // Routes pubbliche
  {
    path: '/home',
    name: 'HomeRoute',
    component: LandingPage,
    meta: { public: true }
  },
  {
    path: '/prenotazione-online',
    name: 'PrenotazioneOnline',
    component: PrenotazioneOnline,
    meta: { public: true }
  },
  {
    path: '/prenotazione/:id/conferma/:token',
    name: 'ConfermaPrenotazione',
    component: ConfermaPrenotazione,
    meta: { public: true }
  },
  {
    path: '/prenotazione/:id/cancella/:token',
    name: 'CancellaPrenotazione',
    component: CancellaPrenotazione,
    meta: { public: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Route pubbliche - sempre permesse
  if (to.meta?.public) {
    next()
    return
  }
  
  // Route che non richiedono autenticazione
  if (!to.meta?.requiresAuth) {
    next()
    return
  }
  
  // Route protette - controlla autenticazione
  if (!authStore.isInitialized) {
    await authStore.checkAuth()
  }
  
  if (!authStore.isLoggedIn) {
    next({ name: 'Home', query: { redirect: to.fullPath } })
    return
  }
  
  // Controlla permessi admin
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next({ name: 'Dashboard' })
    return
  }
  
  // Redirect route guest se già loggato
  if (to.meta.guest && authStore.isLoggedIn) {
    next({ name: 'Dashboard' })
    return
  }
  
  next()
})

export default router
