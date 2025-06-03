import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/css/tailwind.css'
import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const app = createApp(App)

// Pinia store
app.use(createPinia())

// Router
app.use(router)

// Toast notifications
app.use(Vue3Toastify, {
  autoClose: 3000,
  position: 'top-right',
  theme: 'light'
})

app.mount('#app')
