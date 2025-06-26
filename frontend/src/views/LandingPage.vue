<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Hero Section with Navigation -->
    <div class="relative overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-5">
        <div class="absolute top-0 left-0 w-full h-full bg-dots-pattern"></div>
      </div>

      <!-- Navigation -->
      <nav class="relative z-10 bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gradient-to-r from-purple-600 to-rose-600 rounded-lg flex items-center justify-center">
                <svg class="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                </svg>
              </div>
              <span class="text-gray-900 text-xl font-semibold">BeautyHub CRM</span>
            </div>
            <div class="hidden md:flex items-center space-x-8">
              <a href="#features" class="text-gray-700 hover:text-purple-600 transition font-medium">Funzionalità</a>
              <a href="#ai" class="text-gray-700 hover:text-purple-600 transition font-medium">Tecnologia</a>
              <a href="#pricing" class="text-gray-700 hover:text-purple-600 transition font-medium">Prezzi</a>
              <button class="bg-gradient-to-r from-purple-600 to-rose-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-rose-700 transition shadow-sm">
                Inizia Gratis
              </button>
            </div>
            
            <!-- Mobile menu button -->
            <div class="md:hidden">
              <button @click="toggleMobileMenu" class="text-gray-700 hover:text-purple-600 transition">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Mobile menu -->
        <div v-if="showMobileMenu" class="md:hidden bg-white border-t border-gray-200">
          <div class="px-4 py-6 space-y-4">
            <a href="#features" @click="closeMobileMenu" class="block text-gray-700 hover:text-purple-600 transition font-medium">Funzionalità</a>
            <a href="#ai" @click="closeMobileMenu" class="block text-gray-700 hover:text-purple-600 transition font-medium">Tecnologia</a>
            <a href="#pricing" @click="closeMobileMenu" class="block text-gray-700 hover:text-purple-600 transition font-medium">Prezzi</a>
            <button class="w-full bg-gradient-to-r from-purple-600 to-rose-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-rose-700 transition shadow-sm">
              Inizia Gratis
            </button>
          </div>
        </div>
      </nav>

      <!-- Hero Content -->
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div class="text-center">
          <div class="inline-flex items-center bg-purple-50 border border-purple-200 rounded-full px-4 py-2 mb-8">
            <svg class="w-4 h-4 text-purple-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            <span class="text-purple-700 text-sm font-medium">Gestione Completa per Centri Estetici</span>
          </div>
          
          <h1 class="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Il CRM Perfetto per il Tuo
            <span class="bg-gradient-to-r from-purple-600 to-rose-600 bg-clip-text text-transparent">
              Centro Estetico
            </span>
          </h1>
          
          <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Gestisci clienti, appuntamenti, pagamenti e molto altro con la piattaforma più completa 
            per centri estetici. Aumenta l'efficienza e migliora l'esperienza dei tuoi clienti.
          </p>

          <div class="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button class="bg-gradient-to-r from-purple-600 to-rose-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-purple-700 hover:to-rose-700 transition transform hover:scale-105 shadow-lg">
              Prova Demo Gratuita
            </button>
            <button class="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition bg-white shadow-sm">
              Guarda Video Demo
            </button>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div class="text-3xl font-bold text-purple-600 mb-2">500+</div>
              <div class="text-gray-600 font-medium">Centri Attivi</div>
            </div>
            <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div class="text-3xl font-bold text-rose-600 mb-2">50K+</div>
              <div class="text-gray-600 font-medium">Clienti Gestiti</div>
            </div>
            <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div class="text-3xl font-bold text-green-600 mb-2">+35%</div>
              <div class="text-gray-600 font-medium">Efficienza</div>
            </div>
            <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div class="text-3xl font-bold text-blue-600 mb-2">24/7</div>
              <div class="text-gray-600 font-medium">Supporto</div>
            </div>
          </div>
        </div>

        <!-- Dashboard Preview -->
        <div class="mt-16 relative">
          <div class="bg-white rounded-xl p-8 max-w-5xl mx-auto border border-gray-200 shadow-lg">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-gray-900 font-semibold">Gestione Clienti</h3>
                  <div class="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                    </svg>
                  </div>
                </div>
                <div class="text-2xl font-bold text-gray-900 mb-1">1,247</div>
                <div class="text-purple-600 text-sm font-medium">Clienti Attivi</div>
              </div>
              
              <div class="bg-gradient-to-br from-rose-50 to-rose-100 rounded-lg p-6 border border-rose-200">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-gray-900 font-semibold">Appuntamenti</h3>
                  <div class="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zM4 7h12v9H4V7z"/>
                    </svg>
                  </div>
                </div>
                <div class="text-2xl font-bold text-gray-900 mb-1">348</div>
                <div class="text-rose-600 text-sm font-medium">Questo Mese</div>
              </div>
              
              <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-gray-900 font-semibold">Fatturato</h3>
                  <div class="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                </div>
                <div class="text-2xl font-bold text-gray-900 mb-1">€24,580</div>
                <div class="text-green-600 text-sm font-medium">Ultimo Mese</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <section id="features" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Tutto Quello di Cui Hai Bisogno
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Una piattaforma completa progettata specificamente per centri estetici moderni
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="group bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition">
            <div class="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition">
              <svg class="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Gestione Clienti</h3>
            <p class="text-gray-600 leading-relaxed">Schede clienti complete con storico trattamenti, preferenze e note personalizzate per offrire un servizio su misura.</p>
          </div>

          <div class="group bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition">
            <div class="w-12 h-12 bg-gradient-to-r from-rose-600 to-rose-700 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition">
              <svg class="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zM4 7h12v9H4V7z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Prenotazioni Online</h3>
            <p class="text-gray-600 leading-relaxed">Sistema di prenotazione 24/7 con calendario intelligente, promemoria automatici e gestione delle cancellazioni.</p>
          </div>

          <div class="group bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition">
            <div class="w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition">
              <svg class="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zM14 6a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h6zM4 14a2 2 0 002 2h8a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Pagamenti Integrati</h3>
            <p class="text-gray-600 leading-relaxed">Accetta pagamenti con carta, contanti o bonifico. Fatturazione automatica e gestione delle scadenze.</p>
          </div>

          <div class="group bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition">
            <div class="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition">
              <svg class="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Analisi e Report</h3>
            <p class="text-gray-600 leading-relaxed">Dashboard completa con statistiche dettagliate, trend di crescita e report personalizzabili per il tuo business.</p>
          </div>

          <div class="group bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition">
            <div class="w-12 h-12 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition">
              <svg class="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Marketing Automatico</h3>
            <p class="text-gray-600 leading-relaxed">Campagne email e SMS automatizzate per fidelizzare i clienti e promuovere i tuoi servizi più efficacemente.</p>
          </div>

          <div class="group bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition">
            <div class="w-12 h-12 bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition">
              <svg class="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489a.75.75 0 01-.26.851l-2.5 2a.75.75 0 01-.962 0l-2.5-2a.75.75 0 01-.26-.851L7.22 15H5a2 2 0 01-2-2V5z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Supporto Prioritario</h3>
            <p class="text-gray-600 leading-relaxed">Assistenza dedicata via chat, email e telefono. Il nostro team ti aiuta a massimizzare l'uso della piattaforma.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- AI Technology Section -->
    <section id="ai" class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
          <div>
            <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Tecnologia Intelligente per
              <span class="bg-gradient-to-r from-purple-600 to-rose-600 bg-clip-text text-transparent">
                Risultati Straordinari
              </span>
            </h2>
            <p class="text-xl text-gray-600 mb-8 leading-relaxed">
              La nostra piattaforma utilizza algoritmi avanzati per ottimizzare automaticamente 
              la gestione del tuo centro estetico e migliorare l'esperienza dei clienti.
            </p>
            
            <div class="space-y-6">
              <div class="flex">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-semibold text-gray-900">Schedulazione Intelligente</h3>
                  <p class="text-gray-600">Ottimizza automaticamente gli appuntamenti per massimizzare l'efficienza del tuo centro.</p>
                </div>
              </div>
              
              <div class="flex">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-semibold text-gray-900">Raccomandazioni Personalizzate</h3>
                  <p class="text-gray-600">Suggerisce trattamenti e prodotti basati sulla storia e le preferenze di ogni cliente.</p>
                </div>
              </div>
              
              <div class="flex">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-semibold text-gray-900">Analisi Predittiva</h3>
                  <p class="text-gray-600">Prevede trend e comportamenti per aiutarti a prendere decisioni strategiche informate.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="mt-12 lg:mt-0">
            <div class="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-lg font-semibold text-gray-900">Dashboard AI Insights</h3>
                <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              
              <div class="space-y-4">
                <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div class="flex items-center">
                    <div class="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
                    <span class="text-sm text-purple-800 font-medium">Suggerimento: Ottimizza slot 14:00-16:00 per +15% efficienza</span>
                  </div>
                </div>
                
                <div class="bg-rose-50 p-4 rounded-lg border border-rose-200">
                  <div class="flex items-center">
                    <div class="w-2 h-2 bg-rose-600 rounded-full mr-3"></div>
                    <span class="text-sm text-rose-800 font-medium">Alert: 3 clienti pronti per trattamenti premium</span>
                  </div>
                </div>
                
                <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div class="flex items-center">
                    <div class="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                    <span class="text-sm text-green-800 font-medium">Trend: +28% interesse per trattamenti viso questo mese</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Scegli il Piano Perfetto per Te
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Piani flessibili che crescono con il tuo business. Inizia gratis e passa a un piano superiore quando sei pronto.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <!-- Starter Plan -->
          <div class="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
            <div class="mb-8">
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Starter</h3>
              <p class="text-gray-600 mb-4">Perfetto per centri estetici in crescita</p>
              <div class="flex items-baseline">
                <span class="text-4xl font-bold text-gray-900">€29</span>
                <span class="text-gray-600 ml-2">/mese</span>
              </div>
            </div>
            
            <ul class="space-y-4 mb-8">
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                <span class="text-gray-700">Fino a 100 clienti</span>
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                <span class="text-gray-700">Prenotazioni online</span>
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                <span class="text-gray-700">Gestione pagamenti</span>
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                <span class="text-gray-700">Report base</span>
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                <span class="text-gray-700">Supporto email</span>
              </li>
            </ul>
            
            <button class="w-full bg-gray-900 text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition font-semibold">
              Inizia Prova Gratuita
            </button>
          </div>

          <!-- Professional Plan -->
          <div class="bg-white rounded-xl p-8 border-2 border-purple-600 shadow-lg relative">
            <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span class="bg-gradient-to-r from-purple-600 to-rose-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                Più Popolare
              </span>
            </div>
            
            <div class="mb-8">
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Professional</h3>
              <p class="text-gray-600 mb-4">Per centri estetici in espansione</p>
              <div class="flex items-baseline">
                <span class="text-4xl font-bold text-gray-900">€79</span>
                <span class="text-gray-600 ml-2">/mese</span>
              </div>
            </div>
            
            <ul class="space-y-4 mb-8">
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                <span class="text-gray-700">Clienti illimitati</span>
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                <span class="text-gray-700">Tutto del piano Starter</span>
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                <span class="text-gray-700">Marketing automatico</span>
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                <span class="text-gray-700">Analisi avanzate</span>
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                <span class="text-gray-700">Supporto prioritario</span>
              </li>
            </ul>
            
            <button class="w-full bg-gradient-to-r from-purple-600 to-rose-600 text-white py-3 px-6 rounded-lg hover:from-purple-700 hover:to-rose-700 transition font-semibold">
              Inizia Prova Gratuita
            </button>
          </div>

          <!-- Enterprise Plan -->
          <div class="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
            <div class="mb-8">
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Enterprise</h3>
              <p class="text-gray-600 mb-4">Per catene e grandi centri</p>
              <div class="flex items-baseline">
                <span class="text-4xl font-bold text-gray-900">€199</span>
                <span class="text-gray-600 ml-2">/mese</span>
              </div>
            </div>
            
            <ul class="space-y-4 mb-8">
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                <span class="text-gray-700">Tutto del piano Pro</span>
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                <span class="text-gray-700">Multi-location</span>
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                <span class="text-gray-700">API personalizzate</span>
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                <span class="text-gray-700">Account manager dedicato</span>
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                <span class="text-gray-700">Supporto 24/7</span>
              </li>
            </ul>
            
            <button class="w-full bg-gray-900 text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition font-semibold">
              Contattaci
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-r from-purple-600 to-rose-600">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl lg:text-4xl font-bold text-white mb-6">
          Pronto a Trasformare il Tuo Centro Estetico?
        </h2>
        <p class="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
          Unisciti a centinaia di centri estetici che hanno già scelto la nostra piattaforma per crescere e ottimizzare il loro business.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button class="bg-white text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition shadow-lg">
            Inizia Prova Gratuita di 14 Giorni
          </button>
          <button class="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-purple-600 transition">
            Richiedi Demo Personalizzata
          </button>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="md:col-span-2">
            <div class="flex items-center space-x-3 mb-6">
              <div class="w-10 h-10 bg-gradient-to-r from-purple-600 to-rose-600 rounded-lg flex items-center justify-center">
                <svg class="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                </svg>
              </div>
              <span class="text-white text-xl font-semibold">BeautyHub CRM</span>
            </div>
            <p class="text-gray-400 mb-6 max-w-md">
              La piattaforma completa per la gestione di centri estetici moderni. 
              Semplifica il tuo lavoro e fai crescere il tuo business.
            </p>
            <div class="flex space-x-4">
              <a href="#" class="text-gray-400 hover:text-white transition">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-white transition">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-white transition">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 class="text-lg font-semibold mb-6">Prodotto</h3>
            <ul class="space-y-4 text-gray-400">
              <li><a href="#" class="hover:text-white transition">Funzionalità</a></li>
              <li><a href="#" class="hover:text-white transition">Prezzi</a></li>
              <li><a href="#" class="hover:text-white transition">Integrazioni</a></li>
              <li><a href="#" class="hover:text-white transition">API</a></li>
            </ul>
          </div>
          
          <div>
            <h3 class="text-lg font-semibold mb-6">Supporto</h3>
            <ul class="space-y-4 text-gray-400">
              <li><a href="#" class="hover:text-white transition">Centro Assistenza</a></li>
              <li><a href="#" class="hover:text-white transition">Contatti</a></li>
              <li><a href="#" class="hover:text-white transition">Formazione</a></li>
              <li><a href="#" class="hover:text-white transition">Community</a></li>
            </ul>
          </div>
        </div>
        
        <div class="border-t border-gray-800 mt-12 pt-8">
          <div class="flex flex-col md:flex-row justify-between items-center">
            <p class="text-gray-400 mb-4 md:mb-0">
              &copy; 2025 BeautyHub CRM. Tutti i diritti riservati.
            </p>
            <div class="flex space-x-6 text-gray-400">
              <a href="#" class="hover:text-white transition">Privacy Policy</a>
              <a href="#" class="hover:text-white transition">Termini di Servizio</a>
              <a href="#" class="hover:text-white transition">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Mobile menu state
const showMobileMenu = ref(false)

// Mobile menu methods
const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
}

onMounted(() => {
  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll('a[href^="#"]')
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault()
      const targetId = link.getAttribute('href').substring(1)
      const targetElement = document.getElementById(targetId)
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }
    })
  })
})
</script>

<style scoped>
/* Background pattern */
.bg-dots-pattern {
  background-image: radial-gradient(circle, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
  background-size: 30px 30px;
}

/* Custom animations */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Gradient text */
.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}

/* Hover effects */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

/* Smooth transitions */
* {
  transition-duration: 300ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>