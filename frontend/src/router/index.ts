import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Lazy load delle views
const Dashboard = () => import('@/views/Dashboard.vue')
const Login = () => import('@/views/auth/Login.vue')
const Clienti = () => import('@/views/clienti/ClientiList.vue')
const ClienteDetail = () => import('@/views/clienti/ClienteDetail.vue')
const ClienteForm = () => import('@/views/clienti/ClienteForm.vue')
const Appuntamenti = () => import('@/views/appuntamenti/AppuntamentiCalendar.vue')
const AppuntamentoForm = () => import('@/views/appuntamenti/AppuntamentoForm.vue')
const Servizi = () => import('@/views/servizi/ServiziList.vue')
const ServizioForm = () => import('@/views/servizi/ServizioForm.vue')
const Pagamenti = () => import('@/views/pagamenti/PagamentiList.vue')
const Reports = () => import('@/views/reports/Reports.vue')
const NotFound = () => import('@/views/NotFound.vue')

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
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
    path: '/reports',
    name: 'Reports',
    component: Reports,
    meta: { requiresAuth: true, requiresAdmin: true }
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
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Verifica se l'utente è autenticato
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } 
  // Verifica se la rotta è riservata agli amministratori
  else if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next({ name: 'Dashboard' })
  }
  // Redirect alla dashboard se un utente già autenticato prova ad accedere alla login
  else if (to.meta.guest && authStore.isLoggedIn) {
    next({ name: 'Dashboard' })
  }
  else {
    next()
  }
})

export default router
