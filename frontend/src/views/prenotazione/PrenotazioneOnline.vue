<!-- 
  PrenotazioneOnline.vue - Componente principale per la prenotazione online pubblica
  
  Questo componente gestisce l'intero flow di prenotazione online per i clienti:
  - Selezione servizio
  - Scelta data e orario 
  - Inserimento dati cliente
  - Consensi privacy
  - Conferma prenotazione
-->
<template>
  <PublicLayout>
    <!-- Loading impostazioni -->
    <div v-if="loadingSettings" class="max-w-4xl mx-auto px-4 py-8">
      <div class="text-center py-16">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Verifica disponibilità prenotazioni online...</p>
      </div>
    </div>

    <!-- Banner prenotazioni disabilitate -->
    <div v-else-if="prenotazioniDisabilitate" class="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
      <!-- Banner superiore -->
      <div class="bg-gradient-to-r from-red-500 to-red-600 text-white py-3">
        <div class="max-w-4xl mx-auto px-4">
          <div class="flex items-center justify-center">
            <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span class="text-sm font-medium">Servizio temporaneamente non disponibile</span>
          </div>
        </div>
      </div>

      <!-- Contenuto principale -->
      <div class="max-w-4xl mx-auto px-4 py-16">
        <div class="bg-white rounded-2xl shadow-xl border border-red-200 overflow-hidden">
          <!-- Header con icona -->
          <div class="bg-gradient-to-r from-red-500 to-red-600 text-white p-8 text-center">
            <div class="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-white bg-opacity-20 mb-6">
              <svg class="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 9l6-6m0 0l6 6m-6-6H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2h-6z" />
              </svg>
            </div>
            <h1 class="text-3xl font-bold mb-2">Prenotazioni Online Sospese</h1>
            <p class="text-red-100 text-lg">Il servizio è temporaneamente non disponibile</p>
          </div>

          <!-- Contenuto -->
          <div class="p-8">
            <div class="text-center mb-8">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">Ci dispiace per l'inconveniente</h2>
              <p class="text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Le prenotazioni online di <span class="font-semibold text-purple-700">{{ settingsStore.businessName || 'Centro Estetico' }}</span> sono attualmente sospese per manutenzione del sistema. 
                Ti preghiamo di contattarci direttamente per prenotare il tuo appuntamento. 
                Il nostro staff sarà felice di aiutarti a trovare l'orario perfetto per te.
              </p>
            </div>

            <!-- Informazioni di contatto -->
            <div class="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 text-center">
                📞 Contattaci per prenotare
              </h3>
              <div class="grid md:grid-cols-2 gap-4">
                <div class="text-center p-4 bg-white rounded-lg border">
                  <div class="text-purple-600 mb-2">
                    <svg class="h-8 w-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h4 class="font-medium text-gray-900">Telefono</h4>
                  <a :href="`tel:${settingsStore.businessPhone || '+39123456789'}`" class="text-purple-600 hover:underline font-medium">
                    {{ settingsStore.businessPhone || '+39 123 456 789' }}
                  </a>
                  <p class="text-sm text-gray-500 mt-1">{{ settingsStore.openingHours?.split('\n')[0] || 'Lun-Ven: 9:00-19:00' }}</p>
                </div>
                
                <div class="text-center p-4 bg-white rounded-lg border">
                  <div class="text-purple-600 mb-2">
                    <svg class="h-8 w-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h4 class="font-medium text-gray-900">Email</h4>
                  <a :href="`mailto:${settingsStore.businessEmail || 'info@centroestetico.it'}`" class="text-purple-600 hover:underline font-medium">
                    {{ settingsStore.businessEmail || 'info@centroestetico.it' }}
                  </a>
                  <p class="text-sm text-gray-500 mt-1">Risposta entro 24h</p>
                </div>
              </div>
              
              <!-- Indirizzo se disponibile -->
              <div v-if="settingsStore.businessAddress" class="mt-4 p-4 bg-white rounded-lg border text-center">
                <div class="text-purple-600 mb-2">
                  <svg class="h-6 w-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h4 class="font-medium text-gray-900 mb-1">Dove trovarci</h4>
                <p class="text-sm text-gray-600">{{ settingsStore.businessAddress }}</p>
              </div>
              
              <!-- Orari completi se disponibili -->
              <div v-if="settingsStore.openingHours" class="mt-4 p-4 bg-white rounded-lg border text-center">
                <div class="text-purple-600 mb-2">
                  <svg class="h-6 w-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 class="font-medium text-gray-900 mb-2">Orari di apertura</h4>
                <div class="text-sm text-gray-600 whitespace-pre-line">{{ settingsStore.openingHours }}</div>
              </div>
            </div>

            <!-- Pulsanti di azione -->
            <div class="text-center space-y-4">
              <a :href="`tel:${settingsStore.businessPhone || '+39123456789'}`" 
                 class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl">
                <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Chiama ora per prenotare
              </a>
              
              <div class="flex justify-center space-x-4">
                <a v-if="settingsStore.businessEmail" 
                   :href="`mailto:${settingsStore.businessEmail}`"
                   class="inline-flex items-center px-4 py-2 bg-white border border-purple-300 text-purple-700 font-medium rounded-lg hover:bg-purple-50 transition-colors">
                  <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Scrivi email
                </a>
                
                <button @click="verificaImpostazioniPrenotazioni" 
                        class="inline-flex items-center px-4 py-2 text-purple-600 border border-purple-300 hover:bg-purple-50 font-medium rounded-lg transition-colors">
                  <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Riprova connessione
                </button>
              </div>
            </div>

            <!-- Informazioni aggiuntive -->
            <div class="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div class="flex items-start">
                <svg class="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 class="text-sm font-medium text-blue-900">Informazione</h4>
                  <p class="text-sm text-blue-800 mt-1">
                    Il sistema di prenotazioni online di <span class="font-semibold">{{ settingsStore.businessName || 'Centro Estetico' }}</span> tornerà disponibile al più presto. 
                    Ci scusiamo per il disagio e ti ringraziamo per la comprensione.
                  </p>
                  <p class="text-sm text-blue-800 mt-2">
                    Nel frattempo, puoi contattarci direttamente usando i recapiti sopra indicati. 
                    Saremo felici di assisterti nella prenotazione del tuo trattamento preferito.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content (quando le prenotazioni sono abilitate) -->
    <div v-else class="max-w-4xl mx-auto px-4 py-8">
      <div class="flex items-center justify-between mb-4">
        <div v-for="(step, index) in steps" :key="index" class="flex items-center">
          <div 
            class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors"
            :class="currentStep > index ? 'bg-green-500 text-white' : 
                    currentStep === index ? 'bg-blue-500 text-white' : 
                    'bg-gray-200 text-gray-600'"
          >
            <i v-if="currentStep > index" class="fas fa-check"></i>
            <span v-else>{{ index + 1 }}</span>
          </div>
          <div v-if="index < steps.length - 1" class="w-12 h-1 mx-2" 
               :class="currentStep > index ? 'bg-green-500' : 'bg-gray-200'"></div>
        </div>
      </div>
      <div class="text-center">
        <h2 class="text-xl font-semibold text-gray-900">{{ steps[currentStep].title }}</h2>
        <p class="text-gray-600 mt-1">{{ steps[currentStep].description }}</p>
      </div>

      <!-- Main Content Card -->
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        
        <!-- Step 1: Selezione Servizio -->
        <div v-if="currentStep === 0" class="p-6">
          <h2 class="text-2xl font-bold mb-6">Scegli il tuo servizio</h2>
          
          <div v-if="loadingServizi" class="text-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p class="mt-4 text-gray-600">Caricamento servizi...</p>
          </div>

          <div v-else class="space-y-6">
            <div v-for="(servizi, categoria) in serviziRaggruppati" :key="categoria">
              <h3 class="text-lg font-semibold text-gray-900 mb-3 capitalize">{{ categoria }}</h3>
              <div class="grid gap-4 md:grid-cols-2">
                <div v-for="servizio in servizi" :key="servizio._id"
                     @click="selezionaServizio(servizio)"
                     class="p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md"
                     :class="[
                       prenotazione.servizio?._id === servizio._id 
                         ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200' 
                         : 'border-gray-200 hover:border-purple-300'
                     ]">
                  <div class="flex justify-between items-start">
                    <div>
                      <h4 class="font-medium text-gray-900">{{ servizio.nome }}</h4>
                      <p class="text-sm text-gray-600 mt-1">{{ servizio.descrizione }}</p>
                      <div class="flex items-center mt-2 text-sm text-gray-500">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        {{ servizio.durata }} min
                      </div>
                    </div>
                    <div class="text-right">
                      <span class="text-lg font-bold text-purple-600">€{{ servizio.prezzo }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-8 flex justify-end">
            <button @click="prossimoStep"
                    :disabled="!prenotazione.servizio"
                    class="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              Continua
            </button>
          </div>
        </div>

        <!-- Step 2: Selezione Data e Orario -->
        <div v-if="currentStep === 1" class="p-6">
          <h2 class="text-2xl font-bold mb-6">Scegli data e orario</h2>
          
          <!-- Calendar -->
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-lg font-medium mb-4">Seleziona una data</h3>
              <div class="border rounded-lg p-4">
                <input type="date" 
                       v-model="prenotazione.data"
                       :min="minDate"
                       :max="maxDate"
                       @change="caricaDisponibilita"
                       class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              </div>
            </div>
            
            <div>
              <h3 class="text-lg font-medium mb-4">Orari disponibili</h3>
              
              <div v-if="loadingDisponibilita" class="text-center py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                <p class="mt-2 text-sm text-gray-600">Caricamento orari...</p>
              </div>

              <div v-else-if="!prenotazione.data" class="text-center py-8 text-gray-500">
                Seleziona prima una data
              </div>

              <div v-else-if="slotsDisponibili.length === 0" class="text-center py-8 text-gray-500">
                Nessun orario disponibile per questa data
              </div>

              <div v-else class="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                <button v-for="slot in slotsDisponibili" :key="slot.inizio"
                        @click="selezionaSlot(slot)"
                        class="p-3 text-sm border rounded-lg transition-all"
                        :class="[
                          prenotazione.slot === slot 
                            ? 'border-purple-500 bg-purple-50 text-purple-700' 
                            : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                        ]">
                  {{ formatOrario(slot.inizio) }}
                  <div class="text-xs text-gray-500 mt-1">
                    {{ slot.operatore.nome }}
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div class="mt-8 flex justify-between">
            <button @click="stepPrecedente"
                    class="px-6 py-3 bg-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-400 transition-colors">
              Indietro
            </button>
            <button @click="prossimoStep"
                    :disabled="!prenotazione.slot"
                    class="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              Continua
            </button>
          </div>
        </div>

        <!-- Step 3: Dati Cliente -->
        <div v-if="currentStep === 2" class="p-6">
          <h2 class="text-2xl font-bold mb-6">I tuoi dati</h2>
          
          <form @submit.prevent="prossimoStep" class="space-y-4">
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nome *</label>
                <input type="text" 
                       v-model="prenotazione.cliente.nome"
                       required
                       class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Cognome *</label>
                <input type="text" 
                       v-model="prenotazione.cliente.cognome"
                       required
                       class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input type="email" 
                     v-model="prenotazione.cliente.email"
                     required
                     class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Telefono *</label>
              <input type="tel" 
                     v-model="prenotazione.cliente.telefono"
                     required
                     class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Note (opzionale)</label>
              <textarea v-model="prenotazione.note"
                        rows="3"
                        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Eventuali richieste particolari..."></textarea>
            </div>

            <!-- Consensi -->
            <div class="space-y-3 pt-4 border-t">
              <div class="flex items-start">
                <input type="checkbox" 
                       id="consenso-privacy"
                       v-model="prenotazione.consensoPrivacy"
                       required
                       class="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded">
                <label for="consenso-privacy" class="ml-3 text-sm text-gray-700">
                  Accetto il trattamento dei dati personali secondo la 
                  <a href="#" class="text-purple-600 hover:underline">Privacy Policy</a> *
                </label>
              </div>
              
              <div class="flex items-start">
                <input type="checkbox" 
                       id="consenso-marketing"
                       v-model="prenotazione.consensoMarketing"
                       class="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded">
                <label for="consenso-marketing" class="ml-3 text-sm text-gray-700">
                  Accetto di ricevere comunicazioni promozionali via email
                </label>
              </div>
            </div>

            <div class="mt-8 flex justify-between">
              <button type="button" 
                      @click="stepPrecedente"
                      class="px-6 py-3 bg-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-400 transition-colors">
                Indietro
              </button>
              <button type="submit"
                      :disabled="!formValido"
                      class="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                Continua
              </button>
            </div>
          </form>
        </div>

        <!-- Step 4: Riepilogo e Conferma -->
        <div v-if="currentStep === 3" class="p-6">
          <h2 class="text-2xl font-bold mb-6">Riepilogo prenotazione</h2>
          
          <div class="bg-gray-50 rounded-lg p-6 space-y-4">
            <div class="flex justify-between">
              <span class="font-medium">Servizio:</span>
              <span>{{ prenotazione.servizio?.nome }}</span>
            </div>
            
            <div class="flex justify-between">
              <span class="font-medium">Data:</span>
              <span>{{ formatData(prenotazione.data) }}</span>
            </div>
            
            <div class="flex justify-between">
              <span class="font-medium">Orario:</span>
              <span>{{ formatOrario(prenotazione.slot?.inizio) }}</span>
            </div>
            
            <div class="flex justify-between">
              <span class="font-medium">Operatore:</span>
              <span>{{ prenotazione.slot?.operatore.nome }}</span>
            </div>
            
            <div class="flex justify-between">
              <span class="font-medium">Durata:</span>
              <span>{{ prenotazione.servizio?.durata }} minuti</span>
            </div>
            
            <div class="flex justify-between text-lg font-bold text-purple-600 pt-4 border-t">
              <span>Totale:</span>
              <span>€{{ prenotazione.servizio?.prezzo }}</span>
            </div>
          </div>

          <div class="mt-6 bg-blue-50 rounded-lg p-4">
            <div class="flex">
              <svg class="w-5 h-5 text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div class="ml-3">
                <h4 class="text-sm font-medium text-blue-800">Importante</h4>
                <p class="text-sm text-blue-700 mt-1">
                  Riceverai una email di conferma con i dettagli della prenotazione e le istruzioni per eventuali modifiche.
                </p>
              </div>
            </div>
          </div>

          <div class="mt-8 flex justify-between">
            <button @click="stepPrecedente"
                    class="px-6 py-3 bg-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-400 transition-colors">
              Indietro
            </button>
            <button @click="confermaPrenotazione"
                    :disabled="loading"
                    class="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              <span v-if="loading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Conferma in corso...
              </span>
              <span v-else>Conferma Prenotazione</span>
            </button>
          </div>
        </div>

        <!-- Step 5: Successo -->
        <div v-if="currentStep === 4" class="p-6 text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-6">
            <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Prenotazione confermata!</h2>
          
          <p class="text-gray-600 mb-6">
            La tua prenotazione è stata registrata con successo.<br>
            Numero prenotazione: <strong>{{ numeroPrenotazione }}</strong>
          </p>
          
          <div class="bg-gray-50 rounded-lg p-6 text-left max-w-md mx-auto">
            <h3 class="font-medium mb-3">Dettagli prenotazione:</h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span>Servizio:</span>
                <span>{{ prenotazione.servizio?.nome }}</span>
              </div>
              <div class="flex justify-between">
                <span>Data:</span>
                <span>{{ formatData(prenotazione.data) }}</span>
              </div>
              <div class="flex justify-between">
                <span>Orario:</span>
                <span>{{ formatOrario(prenotazione.slot?.inizio) }}</span>
              </div>
            </div>
          </div>

          <div class="mt-8">
            <button @click="nuovaPrenotazione"
                    class="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors">
              Prenota un altro servizio
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Dialog errore -->
    <div v-if="errorMessage" 
         class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
         @click="errorMessage = ''">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3 text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mt-4">Errore</h3>
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-500">{{ errorMessage }}</p>
          </div>
          <div class="items-center px-4 py-3">
            <button @click="errorMessage = ''"
                    class="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-600">
              Chiudi
            </button>
          </div>
        </div>
      </div>
    </div>
  </PublicLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import PublicLayout from '@/layouts/PublicLayout.vue'
import prenotazioneOnlineService from '@/services/prenotazioneOnline.service'
import { useSettingsStore } from '@/stores/settings'

const settingsStore = useSettingsStore()

// Types
interface Servizio {
  _id: string
  nome: string
  descrizione: string
  durata: number
  prezzo: number
  categoria: string
}

interface Slot {
  inizio: string
  fine: string
  operatore: {
    id: string
    nome: string
  }
}

interface Cliente {
  nome: string
  cognome: string
  email: string
  telefono: string
}

// State
const currentStep = ref(0)
const loading = ref(false)
const loadingServizi = ref(false)
const loadingDisponibilita = ref(false)
const loadingSettings = ref(true)
const errorMessage = ref('')
const numeroPrenotazione = ref('')
const prenotazioniDisabilitate = ref(false)

// Gestione errore prenotazioni disabilitate nella funzione caricaServizi
// Steps configuration
const steps = [
  { title: 'Servizio', description: 'Scegli il trattamento desiderato' },
  { title: 'Data e Ora', description: 'Seleziona quando vuoi venire' },
  { title: 'Dati', description: 'Inserisci le tue informazioni' },
  { title: 'Conferma', description: 'Verifica e conferma la prenotazione' },
  { title: 'Completato', description: 'Prenotazione confermata!' }
]

// Form data
const prenotazione = ref({
  servizio: null as Servizio | null,
  data: '',
  slot: null as Slot | null,
  cliente: {
    nome: '',
    cognome: '',
    email: '',
    telefono: ''
  } as Cliente,
  note: '',
  consensoPrivacy: false,
  consensoMarketing: false
})

// Services data
const servizi = ref<Servizio[]>([])
const slotsDisponibili = ref<Slot[]>([])

// Computed properties
const serviziRaggruppati = computed(() => {
  return servizi.value.reduce((acc, servizio) => {
    const categoria = servizio.categoria || 'Altri'
    if (!acc[categoria]) {
      acc[categoria] = []
    }
    acc[categoria].push(servizio)
    return acc
  }, {} as Record<string, Servizio[]>)
})

const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const maxDate = computed(() => {
  const maxDate = new Date()
  maxDate.setDate(maxDate.getDate() + 30) // Prenotazioni fino a 30 giorni
  return maxDate.toISOString().split('T')[0]
})

const formValido = computed(() => {
  const c = prenotazione.value.cliente
  return c.nome && c.cognome && c.email && c.telefono && prenotazione.value.consensoPrivacy
})

// Methods
const verificaImpostazioniPrenotazioni = async () => {
  try {
    loadingSettings.value = true
    await settingsStore.fetchSystemSettings()
    
    // Verifica se le prenotazioni online sono abilitate
    if (!settingsStore.prenotazioniOnlineAbilitate) {
      prenotazioniDisabilitate.value = true
      return false
    }
    
    return true
  } catch (error: any) {
    console.error('Errore verifica impostazioni:', error)
    // In caso di errore, permetti le prenotazioni (comportamento predefinito)
    return true
  } finally {
    loadingSettings.value = false
  }
}

const caricaServizi = async () => {
  try {
    loadingServizi.value = true
    const response = await prenotazioneOnlineService.getServiziDisponibili()
    servizi.value = response.servizi ? Object.values(response.servizi).flat() : []
  } catch (error: any) {
    console.error('Errore caricamento servizi:', error)
    
    // Verifica se le prenotazioni online sono disabilitate
    if (error.response?.status === 503 && error.response?.data?.error === 'PRENOTAZIONI_ONLINE_DISABILITATE') {
      prenotazioniDisabilitate.value = true
    } else {
      errorMessage.value = error.message
    }
  } finally {
    loadingServizi.value = false
  }
}

const caricaDisponibilita = async () => {
  if (!prenotazione.value.data || !prenotazione.value.servizio) return
  
  try {
    loadingDisponibilita.value = true
    const response = await prenotazioneOnlineService.getDisponibilita(
      prenotazione.value.data,
      prenotazione.value.servizio._id
    )
    slotsDisponibili.value = response.slotsDisponibili || []
  } catch (error: any) {
    console.error('Errore caricamento disponibilità:', error)
    
    // Verifica se le prenotazioni online sono disabilitate
    if (error.response?.status === 503 && error.response?.data?.error === 'PRENOTAZIONI_ONLINE_DISABILITATE') {
      prenotazioniDisabilitate.value = true
    } else {
      errorMessage.value = error.message
    }
  } finally {
    loadingDisponibilita.value = false
  }
}

const selezionaServizio = (servizio: Servizio) => {
  prenotazione.value.servizio = servizio
  // Reset slot quando cambia servizio
  prenotazione.value.slot = null
  prenotazione.value.data = ''
  slotsDisponibili.value = []
}

const selezionaSlot = (slot: Slot) => {
  prenotazione.value.slot = slot
}

const prossimoStep = () => {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  }
}

const stepPrecedente = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const confermaPrenotazione = async () => {
  try {
    loading.value = true
    
    const payload = {
      cliente: prenotazione.value.cliente,
      servizioId: prenotazione.value.servizio?._id,
      operatoreId: prenotazione.value.slot?.operatore.id,
      dataOraInizio: prenotazione.value.slot?.inizio,
      note: prenotazione.value.note,
      consensoPrivacy: prenotazione.value.consensoPrivacy,
      consensoMarketing: prenotazione.value.consensoMarketing
    }
    
    const response = await prenotazioneOnlineService.creaPrenotazione(payload)
    
    numeroPrenotazione.value = response.numeroPrenotazione
    currentStep.value = 4 // Vai al step di successo
    
  } catch (error: any) {
    console.error('Errore conferma prenotazione:', error)
    
    // Verifica se le prenotazioni online sono disabilitate
    if (error.response?.status === 503 && error.response?.data?.error === 'PRENOTAZIONI_ONLINE_DISABILITATE') {
      prenotazioniDisabilitate.value = true
    } else {
      errorMessage.value = error.message
    }
  } finally {
    loading.value = false
  }
}

const nuovaPrenotazione = () => {
  // Reset form
  currentStep.value = 0
  prenotazione.value = {
    servizio: null,
    data: '',
    slot: null,
    cliente: {
      nome: '',
      cognome: '',
      email: '',
      telefono: ''
    },
    note: '',
    consensoPrivacy: false,
    consensoMarketing: false
  }
  slotsDisponibili.value = []
  numeroPrenotazione.value = ''
}

// Utility functions
const formatData = (data: string) => {
  if (!data) return ''
  return new Date(data).toLocaleDateString('it-IT', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatOrario = (dateTime: string) => {
  if (!dateTime) return ''
  return new Date(dateTime).toLocaleTimeString('it-IT', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Lifecycle
onMounted(async () => {
  // Prima verifica se le prenotazioni online sono abilitate
  const prenotazioniAbilitate = await verificaImpostazioniPrenotazioni()
  
  // Solo se sono abilitate, carica i servizi
  if (prenotazioniAbilitate) {
    caricaServizi()
  }
})
</script>

<style scoped>
/* Custom animations */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Scrollbar styling for slots */
.max-h-64::-webkit-scrollbar {
  width: 6px;
}

.max-h-64::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.max-h-64::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.max-h-64::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
