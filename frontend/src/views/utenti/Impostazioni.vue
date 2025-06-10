<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="sm:flex sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Impostazioni</h1>
        <p class="mt-2 text-sm text-gray-700">Configura le impostazioni del sistema</p>
      </div>
    </div>

    <!-- Settings Sections -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Account Settings -->
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 class="text-lg leading-6 font-medium text-gray-900">Account</h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">Impostazioni del tuo account utente</p>
          </div>
          <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div class="border-t border-gray-200">
          <dl>
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Nome</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ currentUser.nome }} {{ currentUser.cognome }}</dd>
            </div>
            <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Email</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ currentUser.email }}</dd>
            </div>
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Ruolo</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span 
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="{
                    'bg-red-100 text-red-800': currentUser.ruolo === 'admin',
                    'bg-yellow-100 text-yellow-800': currentUser.ruolo === 'manager',
                    'bg-green-100 text-green-800': currentUser.ruolo === 'operatore',
                    'bg-blue-100 text-blue-800': currentUser.ruolo === 'receptionist'
                  }"
                >
                  {{ getRuoloLabel(currentUser.ruolo) }}
                </span>
              </dd>
            </div>
            <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Password</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <button 
                  @click="showPasswordModal = true" 
                  type="button" 
                  class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cambia password
                </button>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <!-- Notification Settings -->
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 class="text-lg leading-6 font-medium text-gray-900">Notifiche</h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">Configura come ricevere avvisi e notifiche</p>
          </div>
          <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <div class="border-t border-gray-200">
          <dl>
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Email</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div class="relative inline-block w-10 mr-2 align-middle select-none">
                  <input 
                    type="checkbox" 
                    v-model="notificationSettings.email" 
                    @change="saveNotificationSettings"
                    id="toggle-email" 
                    class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  />
                  <label for="toggle-email" class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                </div>
                <span class="text-sm text-gray-700">{{ notificationSettings.email ? 'Attivo' : 'Disattivo' }}</span>
              </dd>
            </div>
            <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Desktop</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div class="relative inline-block w-10 mr-2 align-middle select-none">
                  <input 
                    type="checkbox" 
                    v-model="notificationSettings.desktop" 
                    @change="saveNotificationSettings"
                    id="toggle-desktop" 
                    class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  />
                  <label for="toggle-desktop" class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                </div>
                <span class="text-sm text-gray-700">{{ notificationSettings.desktop ? 'Attivo' : 'Disattivo' }}</span>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <!-- System Settings -->
      <div v-if="isAdmin" class="bg-white shadow overflow-hidden sm:rounded-lg lg:col-span-2">
        <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 class="text-lg leading-6 font-medium text-gray-900">Impostazioni sistema</h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">Configurazioni generali del sistema (solo amministratori)</p>
          </div>
          <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        
        <div class="border-t border-gray-200 px-4 py-5">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label for="businessName" class="block text-sm font-medium text-gray-700">Nome centro estetico</label>
              <div class="mt-1">
                <input
                  type="text"
                  id="businessName"
                  v-model="systemSettings.businessName"
                  class="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
            
            <div>
              <label for="businessPhone" class="block text-sm font-medium text-gray-700">Telefono</label>
              <div class="mt-1">
                <input
                  type="text"
                  id="businessPhone"
                  v-model="systemSettings.businessPhone"
                  class="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
            
            <div>
              <label for="businessEmail" class="block text-sm font-medium text-gray-700">Email</label>
              <div class="mt-1">
                <input
                  type="email"
                  id="businessEmail"
                  v-model="systemSettings.businessEmail"
                  class="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
            
            <div>
              <label for="businessAddress" class="block text-sm font-medium text-gray-700">Indirizzo</label>
              <div class="mt-1">
                <input
                  type="text"
                  id="businessAddress"
                  v-model="systemSettings.businessAddress"
                  class="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
            
            <div class="sm:col-span-2">
              <label for="openingHours" class="block text-sm font-medium text-gray-700">Orari di apertura</label>
              <div class="mt-1">
                <textarea
                  id="openingHours"
                  v-model="systemSettings.openingHours"
                  rows="3"
                  class="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                ></textarea>
              </div>
            </div>
            
            <div class="sm:col-span-2">
              <div class="flex items-center justify-between">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Prenotazioni online</label>
                  <p class="text-sm text-gray-500">Abilita o disabilita le prenotazioni online per i clienti</p>
                </div>
                <div class="relative inline-block w-10 mr-2 align-middle select-none">
                  <input 
                    type="checkbox" 
                    v-model="systemSettings.onlineBookingEnabled" 
                    id="toggle-prenotazioni-online" 
                    class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  />
                  <label for="toggle-prenotazioni-online" class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                </div>
              </div>
              <div class="mt-2">
                <span class="text-sm" :class="systemSettings.onlineBookingEnabled ? 'text-green-600' : 'text-red-600'">
                  {{ systemSettings.onlineBookingEnabled ? 'Le prenotazioni online sono attive' : 'Le prenotazioni online sono sospese' }}
                </span>
              </div>
            </div>
          </div>
          
          <div class="mt-4 flex justify-end">
            <button
              type="button"
              @click="saveSystemSettings"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              :disabled="saving"
            >
              <span v-if="saving">Salvataggio...</span>
              <span v-else>Salva impostazioni</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Change Password Modal -->
    <div v-if="showPasswordModal" class="fixed z-10 inset-0 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" @click="showPasswordModal = false">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
        <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div>
            <div class="mt-3 text-center sm:mt-0 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                Cambia password
              </h3>
              <div class="mt-4">
                <div class="space-y-4">
                  <div>
                    <label for="currentPassword" class="block text-sm font-medium text-gray-700">Password attuale</label>
                    <input 
                      type="password" 
                      id="currentPassword"
                      v-model="passwordForm.oldPassword"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label for="newPassword" class="block text-sm font-medium text-gray-700">Nuova password</label>
                    <input 
                      type="password" 
                      id="newPassword"
                      v-model="passwordForm.newPassword"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Conferma nuova password</label>
                    <input 
                      type="password" 
                      id="confirmPassword"
                      v-model="passwordForm.confirmPassword"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    />
                  </div>
                  <div v-if="passwordError" class="text-sm text-red-600">
                    {{ passwordError }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button 
              @click="changePassword"
              type="button" 
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm"
              :disabled="changingPassword"
            >
              {{ changingPassword ? 'Salvataggio...' : 'Salva' }}
            </button>
            <button 
              @click="showPasswordModal = false"
              type="button" 
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:w-auto sm:text-sm"
            >
              Annulla
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useSettingsStore } from '@/stores/settings'
import { useToast } from '@/composables/useToast'
import settingsService from '@/services/settings.service'

const authStore = useAuthStore()
const settingsStore = useSettingsStore()
const toast = useToast()

const showPasswordModal = ref(false)
const passwordError = ref('')
const changingPassword = ref(false)
const saving = ref(false)

const currentUser = computed(() => authStore.currentUser || {})
const isAdmin = computed(() => currentUser.value?.ruolo === 'admin')

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const notificationSettings = reactive({
  email: true,
  desktop: false
})

// Utilizziamo i valori dallo store anziché definirli qui
const systemSettings = reactive({
  businessName: settingsStore.businessName,
  businessPhone: settingsStore.businessPhone,
  businessEmail: settingsStore.businessEmail,
  businessAddress: settingsStore.businessAddress, 
  openingHours: settingsStore.openingHours,
  onlineBookingEnabled: settingsStore.prenotazioniOnlineAbilitate
})

const getRuoloLabel = (ruolo) => {
  switch(ruolo) {
    case 'admin': return 'Amministratore'
    case 'manager': return 'Manager'
    case 'operatore': return 'Operatore'
    case 'receptionist': return 'Receptionist'
    default: return ruolo
  }
}

const changePassword = async () => {
  passwordError.value = ''
  
  // Validate passwords
  if (!passwordForm.oldPassword) {
    passwordError.value = 'Inserisci la password attuale'
    return
  }
  if (!passwordForm.newPassword) {
    passwordError.value = 'Inserisci la nuova password'
    return
  }
  if (passwordForm.newPassword.length < 6) {
    passwordError.value = 'La password deve essere di almeno 6 caratteri'
    return
  }
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordError.value = 'Le password non corrispondono'
    return
  }
  
  try {
    changingPassword.value = true
    await authStore.updatePassword(passwordForm.oldPassword, passwordForm.newPassword)
    toast.success('Password aggiornata con successo')
    showPasswordModal.value = false
    
    // Reset form
    passwordForm.oldPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
  } catch (error) {
    passwordError.value = error.message || 'Errore durante il cambio password'
  } finally {
    changingPassword.value = false
  }
}

const saveNotificationSettings = async () => {
  try {
    await settingsService.updateUserSettings({
      notifications: {
        email: notificationSettings.email,
        desktop: notificationSettings.desktop
      }
    })
    toast.success('Impostazioni di notifica salvate')
  } catch (error) {
    toast.error('Errore durante il salvataggio delle impostazioni di notifica')
  }
}

const saveSystemSettings = async () => {
  try {
    saving.value = true
    await settingsStore.updateSystemSettings({
      businessName: systemSettings.businessName,
      businessPhone: systemSettings.businessPhone,
      businessEmail: systemSettings.businessEmail,
      businessAddress: systemSettings.businessAddress,
      openingHours: systemSettings.openingHours,
      onlineBookingEnabled: systemSettings.onlineBookingEnabled
    })
    toast.success('Impostazioni di sistema aggiornate')
  } catch (error) {
    toast.error('Errore durante il salvataggio delle impostazioni')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  try {
    // Carica le impostazioni utente
    const userSettingsData = await settingsService.getUserSettings()
    if (userSettingsData && userSettingsData.notifications) {
      notificationSettings.email = userSettingsData.notifications.email
      notificationSettings.desktop = userSettingsData.notifications.desktop
    }
    
    // Carica le impostazioni di sistema (solo per gli admin)
    if (isAdmin.value) {
      // Utilizza lo store per caricare le impostazioni di sistema
      await settingsStore.fetchSystemSettings()
      
      // Aggiorna il form con i valori dallo store
      systemSettings.businessName = settingsStore.businessName
      systemSettings.businessPhone = settingsStore.businessPhone
      systemSettings.businessEmail = settingsStore.businessEmail
      systemSettings.businessAddress = settingsStore.businessAddress
      systemSettings.openingHours = settingsStore.openingHours
      systemSettings.onlineBookingEnabled = settingsStore.prenotazioniOnlineAbilitate
    }
  } catch (error) {
    console.error('Errore durante il caricamento delle impostazioni:', error)
    toast.error('Errore durante il caricamento delle impostazioni')
  }
})
</script>

<style scoped>
.toggle-checkbox:checked {
  right: 0;
  border-color: #68D391;
}
.toggle-checkbox:checked + .toggle-label {
  background-color: #68D391;
}
.toggle-checkbox {
  right: 0;
  z-index: 1;
  border-color: #D1D5DB;
}
.toggle-label {
  display: block;
  overflow: hidden;
  cursor: pointer;
  border-radius: 9999px;
}
</style>
