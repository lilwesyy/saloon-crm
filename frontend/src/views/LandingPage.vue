<!-- 
  LandingPage.vue - Pagina principale pubblica di presentazione del CRM
  
  Questa pagina mostra le principali funzionalità del sistema Saloon CRM:
  - Hero section con call-to-action
  - Funzionalità principali
  - Testimonianze clienti
  - Sezione contatti
-->
<template>
  <LandingLayout>
    <!-- Hero Section - L'Intelligenza Artificiale per la bellezza (100vh) -->
    <section class="min-h-screen bg-gradient-to-br from-cyan-900 via-purple-900 to-blue-900 text-white relative overflow-hidden flex items-center">
      <!-- AI Animated Background -->
      <div class="absolute inset-0 opacity-20">
        <div class="absolute top-10 left-10 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
        <div class="absolute top-20 right-20 w-1 h-1 bg-purple-400 rounded-full animate-ping"></div>
        <div class="absolute bottom-20 left-20 w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
        <div class="absolute bottom-10 right-10 w-2 h-2 bg-cyan-300 rounded-full animate-pulse"></div>
        <div class="absolute top-1/2 left-1/4 w-1 h-1 bg-purple-300 rounded-full animate-ping"></div>
        <div class="absolute top-1/3 right-1/3 w-2 h-2 bg-blue-300 rounded-full animate-bounce"></div>
        <!-- Additional animated particles for more immersion -->
        <div class="absolute top-1/4 left-1/2 w-1 h-1 bg-cyan-300 rounded-full animate-pulse" style="animation-delay: 0.5s;"></div>
        <div class="absolute bottom-1/4 right-1/4 w-2 h-2 bg-purple-400 rounded-full animate-ping" style="animation-delay: 1s;"></div>
        <div class="absolute top-3/4 left-1/3 w-1 h-1 bg-blue-300 rounded-full animate-bounce" style="animation-delay: 1.5s;"></div>
      </div>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 w-full">
        <div class="flex flex-col md:flex-row items-center justify-center min-h-[80vh]">
          <div class="md:w-1/2 mb-12 md:mb-0 md:pr-12">
            <!-- AI Badge -->
            <div class="inline-flex items-center bg-cyan-500/20 backdrop-blur-sm border border-cyan-400/30 rounded-full px-6 py-3 mb-8">
              <i class="fas fa-brain text-cyan-400 mr-3 text-lg"></i>
              <span class="text-cyan-300 font-medium">Powered by Advanced AI</span>
            </div>
            
            <h1 class="text-5xl md:text-7xl font-bold leading-tight mb-8">
              L'<span class="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Intelligenza Artificiale</span> 
              <br>per la bellezza
            </h1>
            <p class="text-xl md:text-2xl mb-10 text-gray-200 leading-relaxed">
              BeautyHub AI rivoluziona i centri estetici con algoritmi avanzati di machine learning. 
              <strong class="text-cyan-300">Ottimizzazione predittiva</strong>, 
              <strong class="text-purple-300">personalizzazione intelligente</strong> e 
              <strong class="text-blue-300">automazione completa</strong> in un'unica piattaforma.
            </p>
            
            <!-- AI Features Quick List -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-cyan-400 rounded-full mr-4 animate-pulse"></div>
                <span class="text-gray-300">Previsioni appuntamenti AI</span>
              </div>
              <div class="flex items-center">
                <div class="w-3 h-3 bg-purple-400 rounded-full mr-4 animate-pulse"></div>
                <span class="text-gray-300">Pricing dinamico intelligente</span>
              </div>
              <div class="flex items-center">
                <div class="w-3 h-3 bg-blue-400 rounded-full mr-4 animate-pulse"></div>
                <span class="text-gray-300">Chatbot conversazionale</span>
              </div>
              <div class="flex items-center">
                <div class="w-3 h-3 bg-cyan-400 rounded-full mr-4 animate-pulse"></div>
                <span class="text-gray-300">Analytics predittivi</span>
              </div>
            </div>
            
            <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
              <router-link 
                to="/prenotazione-online" 
                class="bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold py-3 px-8 rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-center flex items-center justify-center text-base"
              >
                <i class="fas fa-rocket mr-2"></i>
                Prova l'AI Gratuitamente
              </router-link>
              <a 
                href="#ai-features" 
                class="border-2 border-cyan-400/50 text-cyan-300 font-bold py-3 px-8 rounded-xl hover:bg-cyan-400/10 hover:border-cyan-400 transition-all duration-300 text-center flex items-center justify-center backdrop-blur-sm text-base"
              >
                <i class="fas fa-brain mr-2"></i>
                Scopri l'AI
              </a>
            </div>
          </div>
          
          <div class="md:w-1/2">
            <!-- AI Dashboard Mockup Enhanced -->
            <div class="relative">
              <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div class="flex items-center justify-between mb-6">
                  <h3 class="text-xl font-bold text-white">BeautyHub AI Dashboard</h3>
                  <div class="flex space-x-2">
                    <div class="w-4 h-4 bg-red-400 rounded-full"></div>
                    <div class="w-4 h-4 bg-yellow-400 rounded-full"></div>
                    <div class="w-4 h-4 bg-green-400 rounded-full"></div>
                  </div>
                </div>
                
                <!-- AI Metrics Enhanced -->
                <div class="grid grid-cols-2 gap-6 mb-6">
                  <div class="bg-cyan-500/20 p-6 rounded-xl border border-cyan-400/30">
                    <div class="text-cyan-300 text-sm font-medium">AI Predizioni</div>
                    <div class="text-3xl font-bold text-white">95%</div>
                    <div class="text-xs text-cyan-400">Accuratezza</div>
                  </div>
                  <div class="bg-purple-500/20 p-6 rounded-xl border border-purple-400/30">
                    <div class="text-purple-300 text-sm font-medium">Efficienza</div>
                    <div class="text-3xl font-bold text-white">+40%</div>
                    <div class="text-xs text-purple-400">vs Tradizionale</div>
                  </div>
                </div>
                
                <!-- AI Chart Simulation Enhanced -->
                <div class="bg-gray-800/50 rounded-xl p-6 h-40 flex items-end justify-between">
                  <div class="w-10 bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t" style="height: 60%"></div>
                  <div class="w-10 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t" style="height: 80%"></div>
                  <div class="w-10 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t" style="height: 95%"></div>
                  <div class="w-10 bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t" style="height: 70%"></div>
                  <div class="w-10 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t" style="height: 85%"></div>
                </div>
                
                <div class="text-center mt-6">
                  <span class="text-gray-300 font-medium">Real-time AI Analytics</span>
                </div>
              </div>
              
              <!-- Floating AI Icons Enhanced -->
              <div class="absolute -top-6 -right-6 w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center animate-bounce">
                <i class="fas fa-brain text-white text-lg"></i>
              </div>
              <div class="absolute -bottom-6 -left-6 w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center animate-pulse">
                <i class="fas fa-robot text-white"></i>
              </div>
              <div class="absolute top-1/2 -right-4 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center animate-ping">
                <i class="fas fa-microchip text-white text-sm"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- AI Features Preview -->
    <section id="ai-features" class="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-20">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Funzionalità AI <span class="bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">All'Avanguardia</span>
          </h2>
          <p class="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Scopri come l'intelligenza artificiale di BeautyHub trasforma ogni aspetto del tuo centro estetico
          </p>
        </div>

        <div class="grid lg:grid-cols-3 gap-10 mb-20">
          <!-- Ottimizzazione Operativa -->
          <div class="bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-300 border-l-4 border-cyan-500 transform hover:scale-105">
            <div class="w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mb-8">
              <i class="fas fa-calendar-alt text-white text-3xl"></i>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-6">Ottimizzazione Operativa</h3>
            <ul class="space-y-4 text-gray-600">
              <li class="flex items-start">
                <i class="fas fa-check text-cyan-500 mr-4 mt-1 text-lg"></i>
                <span><strong>Previsione Appuntamenti:</strong> AI analizza pattern storici per ottimizzare l'agenda</span>
              </li>
              <li class="flex items-start">
                <i class="fas fa-check text-cyan-500 mr-4 mt-1 text-lg"></i>
                <span><strong>Inventario Predittivo:</strong> Previsione automatica fabbisogno prodotti</span>
              </li>
              <li class="flex items-start">
                <i class="fas fa-check text-cyan-500 mr-4 mt-1 text-lg"></i>
                <span><strong>Pricing Dinamico:</strong> Adattamento intelligente prezzi in tempo reale</span>
              </li>
            </ul>
          </div>

          <!-- Customer Experience -->
          <div class="bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-300 border-l-4 border-purple-500 transform hover:scale-105">
            <div class="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-8">
              <i class="fas fa-user-heart text-white text-3xl"></i>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-6">Customer Experience</h3>
            <ul class="space-y-4 text-gray-600">
              <li class="flex items-start">
                <i class="fas fa-check text-purple-500 mr-4 mt-1 text-lg"></i>
                <span><strong>Raccomandazioni Personalizzate:</strong> Servizi suggeriti basati sullo storico</span>
              </li>
              <li class="flex items-start">
                <i class="fas fa-check text-purple-500 mr-4 mt-1 text-lg"></i>
                <span><strong>Clienti a Rischio:</strong> Identificazione predittiva abbandoni</span>
              </li>
              <li class="flex items-start">
                <i class="fas fa-check text-purple-500 mr-4 mt-1 text-lg"></i>
                <span><strong>Analisi Sentiment:</strong> Elaborazione automatica feedback clienti</span>
              </li>
            </ul>
          </div>

          <!-- Business Intelligence -->
          <div class="bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-300 border-l-4 border-blue-500 transform hover:scale-105">
            <div class="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-8">
              <i class="fas fa-chart-line text-white text-3xl"></i>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-6">Business Intelligence</h3>
            <ul class="space-y-4 text-gray-600">
              <li class="flex items-start">
                <i class="fas fa-check text-blue-500 mr-4 mt-1 text-lg"></i>
                <span><strong>Dashboard Predittiva:</strong> Previsioni fatturato e trend basate su ML</span>
              </li>
              <li class="flex items-start">
                <i class="fas fa-check text-blue-500 mr-4 mt-1 text-lg"></i>
                <span><strong>Analisi Comparative:</strong> Benchmark automatici di performance</span>
              </li>
              <li class="flex items-start">
                <i class="fas fa-check text-blue-500 mr-4 mt-1 text-lg"></i>
                <span><strong>Ottimizzazione Revenue:</strong> Suggerimenti data-driven per il fatturato</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Automazione Marketing -->
        <div class="bg-gradient-to-r from-gray-900 to-purple-900 rounded-3xl p-12 text-white">
          <div class="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 class="text-4xl md:text-5xl font-bold mb-8">Automazione Marketing AI</h3>
              <div class="space-y-6">
                <div class="flex items-start">
                  <div class="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center mr-6 mt-1">
                    <i class="fas fa-robot text-white text-lg"></i>
                  </div>
                  <div>
                    <h4 class="font-bold text-cyan-300 mb-2 text-lg">Chatbot Prenotazioni</h4>
                    <p class="text-gray-300">Assistente virtuale per gestione prenotazioni automatiche 24/7</p>
                  </div>
                </div>
                <div class="flex items-start">
                  <div class="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mr-6 mt-1">
                    <i class="fas fa-users text-white text-lg"></i>
                  </div>
                  <div>
                    <h4 class="font-bold text-purple-300 mb-2 text-lg">Segmentazione AI-Driven</h4>
                    <p class="text-gray-300">Categorizzazione avanzata clientela per campagne mirate</p>
                  </div>
                </div>
                <div class="flex items-start">
                  <div class="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mr-6 mt-1">
                    <i class="fas fa-clock text-white text-lg"></i>
                  </div>
                  <div>
                    <h4 class="font-bold text-blue-300 mb-2 text-lg">Timing Intelligente</h4>
                    <p class="text-gray-300">Ottimizzazione automatica momenti migliori per comunicazioni</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="text-center">
              <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
                <div class="text-5xl font-bold text-cyan-400 mb-3">85%</div>
                <div class="text-gray-300 mb-6 text-lg">Automatizzazione Processi</div>
                <div class="flex justify-center space-x-3">
                  <div class="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
                  <div class="w-3 h-3 bg-purple-400 rounded-full animate-pulse" style="animation-delay: 0.2s;"></div>
                  <div class="w-3 h-3 bg-blue-400 rounded-full animate-pulse" style="animation-delay: 0.4s;"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Funzionalità AI -->
    <section id="caratteristiche" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-20">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">L'Intelligenza Artificiale al servizio della bellezza</h2>
          <p class="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Scopri le potenti funzionalità AI che trasformeranno il tuo centro estetico in un hub di innovazione e eccellenza.
          </p>
        </div>
        
        <!-- Slider Container -->
        <div 
          class="relative overflow-hidden"
          @mouseenter="stopAutoSlide"
          @mouseleave="startAutoSlide"
        >
          <!-- Slider Track -->
          <div 
            class="flex transition-transform duration-500 ease-in-out"
            :style="sliderTransform"
          >            <!-- Slide 1 - Ottimizzazione Operativa AI -->
            <div class="w-full flex-shrink-0">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mr-16">
                <!-- Previsione Appuntamenti -->
                <div class="bg-gradient-to-br from-blue-50 to-cyan-50 p-10 rounded-2xl border border-blue-200 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                  <div class="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center mb-8">
                    <i class="fas fa-brain text-white text-2xl"></i>
                  </div>
                  <h3 class="text-2xl font-bold text-gray-900 mb-4">Previsione Appuntamenti AI</h3>
                  <p class="text-gray-600 text-lg leading-relaxed">
                    Algoritmi predittivi analizzano pattern storici per ottimizzare l'agenda e ridurre i tempi morti del 40%.
                  </p>
                </div>

                <!-- Inventario Predittivo -->
                <div class="bg-gradient-to-br from-purple-50 to-pink-50 p-10 rounded-2xl border border-purple-200 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                  <div class="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center mb-8">
                    <i class="fas fa-boxes text-white text-2xl"></i>
                  </div>
                  <h3 class="text-2xl font-bold text-gray-900 mb-4">Inventario Predittivo</h3>
                  <p class="text-gray-600 text-lg leading-relaxed">
                    AI prevede il fabbisogno prodotti basandosi su appuntamenti futuri, eliminando sprechi e carenze.
                  </p>
                </div>
            
                <!-- Pricing Dinamico -->
                <div class="bg-gradient-to-br from-green-50 to-emerald-50 p-10 rounded-2xl border border-green-200 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                  <div class="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-500 rounded-2xl flex items-center justify-center mb-8">
                    <i class="fas fa-chart-line text-white text-2xl"></i>
                  </div>
                  <h3 class="text-2xl font-bold text-gray-900 mb-4">Pricing Dinamico AI</h3>
                  <p class="text-gray-600 text-lg leading-relaxed">
                    Adattamento intelligente dei prezzi in base a domanda, orari e stagionalità per massimizzare i ricavi.
                  </p>
                </div>
            
                <!-- Ottimizzazione Operazioni -->
                <div class="bg-gradient-to-br from-orange-50 to-yellow-50 p-10 rounded-2xl border border-orange-200 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                  <div class="w-16 h-16 bg-gradient-to-r from-orange-600 to-yellow-500 rounded-2xl flex items-center justify-center mb-8">
                    <i class="fas fa-cogs text-white text-2xl"></i>
                  </div>
                  <h3 class="text-2xl font-bold text-gray-900 mb-4">Ottimizzazione Operazioni</h3>
                  <p class="text-gray-600 text-lg leading-relaxed">
                    Algoritmi di machine learning ottimizzano flussi di lavoro e allocazione risorse in tempo reale.
                  </p>
                </div>
              </div>
            </div>
          
          <!-- Slide 2 - Customer Experience AI -->
          <div class="w-full flex-shrink-0">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mr-16">
              <!-- Raccomandazioni Personalizzate -->
              <div class="bg-gradient-to-br from-indigo-50 to-blue-50 p-10 rounded-2xl border border-indigo-200 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                <div class="w-16 h-16 bg-gradient-to-r from-indigo-600 to-blue-500 rounded-2xl flex items-center justify-center mb-8">
                  <i class="fas fa-user-check text-white text-2xl"></i>
                </div>
                <h3 class="text-2xl font-bold text-gray-900 mb-4">Raccomandazioni AI</h3>
                <p class="text-gray-600 text-lg leading-relaxed">
                  Sistema intelligente che suggerisce trattamenti personalizzati basandosi sullo storico e preferenze dei clienti.
                </p>
              </div>
            
              <!-- Rilevamento Clienti a Rischio -->
              <div class="bg-gradient-to-br from-red-50 to-pink-50 p-10 rounded-2xl border border-red-200 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                <div class="w-16 h-16 bg-gradient-to-r from-red-600 to-pink-500 rounded-2xl flex items-center justify-center mb-8">
                  <i class="fas fa-exclamation-triangle text-white text-2xl"></i>
                </div>
                <h3 class="text-2xl font-bold text-gray-900 mb-4">Prevenzione Abbandono</h3>
                <p class="text-gray-600 text-lg leading-relaxed">
                  AI identifica clienti con alta probabilità di abbandono e suggerisce azioni di retention mirate.
                </p>
              </div>
            
              <!-- Analisi Sentiment -->
              <div class="bg-gradient-to-br from-teal-50 to-cyan-50 p-10 rounded-2xl border border-teal-200 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                <div class="w-16 h-16 bg-gradient-to-r from-teal-600 to-cyan-500 rounded-2xl flex items-center justify-center mb-8">
                  <i class="fas fa-heart text-white text-2xl"></i>
                </div>
                <h3 class="text-2xl font-bold text-gray-900 mb-4">Analisi Sentiment</h3>
                <p class="text-gray-600 text-lg leading-relaxed">
                  Elaborazione automatica del feedback e delle note per misurare la soddisfazione in tempo reale.
                </p>
              </div>
              
              <!-- Chatbot Intelligente -->
              <div class="bg-gradient-to-br from-violet-50 to-purple-50 p-10 rounded-2xl border border-violet-200 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                <div class="w-16 h-16 bg-gradient-to-r from-violet-600 to-purple-500 rounded-2xl flex items-center justify-center mb-8">
                  <i class="fas fa-robot text-white text-2xl"></i>
                </div>
                <h3 class="text-2xl font-bold text-gray-900 mb-4">Assistente Virtuale</h3>
                <p class="text-gray-600 text-lg leading-relaxed">
                  Chatbot conversazionale 24/7 per prenotazioni, informazioni e supporto clienti automatizzato.
                </p>
              </div>
            </div>
          </div>
          
          <!-- Slide 3 - Business Intelligence & Marketing AI -->
          <div class="w-full flex-shrink-0">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mr-16">
              <!-- Dashboard Predittiva -->
              <div class="bg-gradient-to-br from-emerald-50 to-green-50 p-10 rounded-2xl border border-emerald-200 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                <div class="w-16 h-16 bg-gradient-to-r from-emerald-600 to-green-500 rounded-2xl flex items-center justify-center mb-8">
                  <i class="fas fa-chart-pie text-white text-2xl"></i>
                </div>
                <h3 class="text-2xl font-bold text-gray-900 mb-4">Dashboard Predittiva</h3>
                <p class="text-gray-600 text-lg leading-relaxed">
                  Previsioni su fatturato, affluenza e trend basate su modelli di machine learning avanzati.
                </p>
              </div>
              
              <!-- Segmentazione Clienti AI -->
              <div class="bg-gradient-to-br from-amber-50 to-orange-50 p-10 rounded-2xl border border-amber-200 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                <div class="w-16 h-16 bg-gradient-to-r from-amber-600 to-orange-500 rounded-2xl flex items-center justify-center mb-8">
                  <i class="fas fa-users-cog text-white text-2xl"></i>
                </div>
                <h3 class="text-2xl font-bold text-gray-900 mb-4">Segmentazione AI</h3>
                <p class="text-gray-600 text-lg leading-relaxed">
                  Categorizzazione avanzata della clientela per campagne marketing mirate e personalizzate.
                </p>
              </div>
              
              <!-- Timing Intelligente -->
              <div class="bg-gradient-to-br from-rose-50 to-pink-50 p-10 rounded-2xl border border-rose-200 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                <div class="w-16 h-16 bg-gradient-to-r from-rose-600 to-pink-500 rounded-2xl flex items-center justify-center mb-8">
                  <i class="fas fa-clock text-white text-2xl"></i>
                </div>
                <h3 class="text-2xl font-bold text-gray-900 mb-4">Timing Intelligente</h3>
                <p class="text-gray-600 text-lg leading-relaxed">
                  Ottimizzazione automatica dei momenti migliori per comunicazioni marketing e engagement.
                </p>
              </div>

              <!-- Ottimizzazione Revenue -->
              <div class="bg-gradient-to-br from-slate-50 to-gray-50 p-10 rounded-2xl border border-slate-200 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                <div class="w-16 h-16 bg-gradient-to-r from-slate-600 to-gray-500 rounded-2xl flex items-center justify-center mb-8">
                  <i class="fas fa-coins text-white text-2xl"></i>
                </div>
                <h3 class="text-2xl font-bold text-gray-900 mb-4">Ottimizzazione Revenue</h3>
                <p class="text-gray-600 text-lg leading-relaxed">
                  Suggerimenti data-driven per massimizzare il fatturato attraverso analisi predittive avanzate.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Indicatori Slider -->
        <div class="flex justify-center space-x-3 mt-12">
          <button 
            v-for="(slide, index) in totalSlides" 
            :key="index"
            @click="goToSlide(index)"
            :class="[
              'w-4 h-4 rounded-full transition-all duration-300',
              currentSlide === index ? 'bg-purple-600 scale-125' : 'bg-gray-300 hover:bg-gray-400'
            ]"
          ></button>
        </div>
        
        <!-- Controlli Slider -->
        <div class="flex justify-center space-x-6 mt-8">
          <button 
            @click="previousSlide"
            class="flex items-center px-6 py-3 text-purple-600 hover:text-purple-700 transition-colors bg-white rounded-xl shadow-md hover:shadow-lg"
          >
            <i class="fas fa-chevron-left mr-2"></i>
            Precedente
          </button>
          <button 
            @click="nextSlide"
            class="flex items-center px-6 py-3 text-purple-600 hover:text-purple-700 transition-colors bg-white rounded-xl shadow-md hover:shadow-lg"
          >
            Successivo
            <i class="fas fa-chevron-right ml-2"></i>
          </button>
        </div>
        </div>
      </div>
    </section>
    
    <!-- Sezione Vantaggi dell'AI -->
    <section class="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-20">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Perché scegliere l'AI per il tuo centro</h2>
          <p class="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Scopri i vantaggi esclusivi dell'intelligenza artificiale applicata alla bellezza
          </p>
        </div>
        
        <div class="grid lg:grid-cols-2 gap-16 items-center">
          <!-- Lista vantaggi AI -->
          <div class="space-y-8">
            <div class="flex items-start space-x-6">
              <div class="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1">
                <i class="fas fa-chart-line text-white text-xl"></i>
              </div>
              <div>
                <h3 class="text-2xl font-bold text-gray-900 mb-3">Aumento del fatturato del 35%</h3>
                <p class="text-gray-600 text-lg leading-relaxed">
                  L'AI ottimizza pricing, suggerisce upselling e identifica opportunità nascoste per incrementare significativamente i ricavi.
                </p>
              </div>
            </div>
            
            <div class="flex items-start space-x-6">
              <div class="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1">
                <i class="fas fa-clock text-white text-xl"></i>
              </div>
              <div>
                <h3 class="text-2xl font-bold text-gray-900 mb-3">Riduzione tempi morti del 40%</h3>
                <p class="text-gray-600 text-lg leading-relaxed">
                  Algoritmi predittivi ottimizzano l'agenda eliminando buchi e sovrapposizioni, massimizzando l'efficienza operativa.
                </p>
              </div>
            </div>
            
            <div class="flex items-start space-x-6">
              <div class="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1">
                <i class="fas fa-heart text-white text-xl"></i>
              </div>
              <div>
                <h3 class="text-2xl font-bold text-gray-900 mb-3">Soddisfazione clienti al 98%</h3>
                <p class="text-gray-600 text-lg leading-relaxed">
                  Raccomandazioni personalizzate e servizio predittivo creano esperienze uniche che fidelizzano i clienti.
                </p>
              </div>
            </div>
            
            <div class="flex items-start space-x-6">
              <div class="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1">
                <i class="fas fa-robot text-white text-xl"></i>
              </div>
              <div>
                <h3 class="text-2xl font-bold text-gray-900 mb-3">Automazione del 85%</h3>
                <p class="text-gray-600 text-lg leading-relaxed">
                  Processi automatizzati da chatbot, prenotazioni intelligenti e gestione predittiva dell'inventario.
                </p>
              </div>
            </div>
          </div>
          
          <!-- Dashboard AI Mockup -->
          <div class="bg-white p-12 rounded-3xl shadow-2xl">
            <div class="text-center">
              <div class="w-40 h-40 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-8 relative overflow-hidden">
                <i class="fas fa-brain text-white text-5xl animate-pulse"></i>
                <div class="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 animate-pulse"></div>
              </div>
              <h3 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">AI Engine Avanzato</h3>
              <p class="text-gray-600 mb-8 text-lg leading-relaxed">
                Motore di intelligenza artificiale che apprende continuamente dai tuoi dati per ottimizzare ogni aspetto
              </p>
              <div class="grid grid-cols-3 gap-6 text-center">
                <div>
                  <p class="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">+35%</p>
                  <p class="text-gray-500 text-lg">Fatturato</p>
                </div>
                <div>
                  <p class="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">-40%</p>
                  <p class="text-gray-500 text-lg">Tempi Morti</p>
                </div>
                <div>
                  <p class="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">98%</p>
                  <p class="text-gray-500 text-lg">Soddisfazione</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Sezione Capacità AI Avanzate -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Capacità AI Esclusive</h2>
          <p class="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Funzionalità avanzate che solo l'intelligenza artificiale può offrire
          </p>
        </div>
        
        <div class="grid lg:grid-cols-3 gap-8">
          <!-- Algoritmi Predittivi -->
          <div class="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
              <i class="fas fa-chart-line text-white text-2xl"></i>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">Algoritmi Predittivi</h3>
            <p class="text-gray-600 mb-6">
              L'AI analizza dati storici e pattern comportamentali per prevedere tendenze future e ottimizzare le decisioni.
            </p>
            <ul class="space-y-2 text-gray-600">
              <li class="flex items-center">
                <i class="fas fa-check text-green-500 mr-2"></i>
                Previsione affluenza settimanale
              </li>
              <li class="flex items-center">
                <i class="fas fa-check text-green-500 mr-2"></i>
                Trend stagionali automatici
              </li>
              <li class="flex items-center">
                <i class="fas fa-check text-green-500 mr-2"></i>
                Ottimizzazione risorse dinamica
              </li>
            </ul>
          </div>
          
          <!-- Machine Learning Continuo -->
          <div class="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div class="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl flex items-center justify-center mb-6">
              <i class="fas fa-brain text-white text-2xl"></i>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">Machine Learning Continuo</h3>
            <p class="text-gray-600 mb-6">
              Il sistema apprende continuamente dalle tue operazioni per migliorare le performance giorno dopo giorno.
            </p>
            <ul class="space-y-2 text-gray-600">
              <li class="flex items-center">
                <i class="fas fa-check text-green-500 mr-2"></i>
                Apprendimento automatico
              </li>
              <li class="flex items-center">
                <i class="fas fa-check text-green-500 mr-2"></i>
                Miglioramento continuo AI
              </li>
              <li class="flex items-center">
                <i class="fas fa-check text-green-500 mr-2"></i>
                Adattamento comportamentale
              </li>
            </ul>
          </div>
          
          <!-- Neural Networks Avanzate -->
          <div class="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div class="w-16 h-16 bg-gradient-to-r from-green-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6">
              <i class="fas fa-network-wired text-white text-2xl"></i>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">Neural Networks Avanzate</h3>
            <p class="text-gray-600 mb-6">
              Reti neurali profonde analizzano complessi pattern di dati per insights impossibili da ottenere manualmente.
            </p>
            <ul class="space-y-2 text-gray-600">
              <li class="flex items-center">
                <i class="fas fa-check text-green-500 mr-2"></i>
                Deep Learning analysis
              </li>
              <li class="flex items-center">
                <i class="fas fa-check text-green-500 mr-2"></i>
                Pattern recognition avanzato
              </li>
              <li class="flex items-center">
                <i class="fas fa-check text-green-500 mr-2"></i>
                Insights predittivi complessi
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Piani AI-Powered -->
    <section id="pricing" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-20">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Piani AI-Powered per ogni esigenza</h2>
          <p class="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Scegli il livello di intelligenza artificiale perfetto per il tuo centro estetico
          </p>
        </div>
        
        <div class="grid lg:grid-cols-3 gap-10">
          <!-- Piano AI Essential -->
          <div class="bg-white border-2 border-gray-200 rounded-3xl p-10 hover:border-purple-300 transition-all duration-300 transform hover:scale-105">
            <div class="text-center">
              <div class="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <i class="fas fa-robot text-white text-3xl"></i>
              </div>
              <h3 class="text-4xl md:text-5xl font-bold text-gray-900 mb-3">AI Essential</h3>
              <p class="text-gray-600 mb-8 text-lg">Intelligenza artificiale di base</p>
              <div class="mb-10">
                <span class="text-5xl font-bold text-gray-900">€149</span>
                <span class="text-gray-600 text-xl">/mese</span>
              </div>
            </div>
            
            <ul class="space-y-5 mb-10">
              <li class="flex items-center">
                <i class="fas fa-check text-green-500 mr-4 text-lg"></i>
                <span class="text-lg">Chatbot prenotazioni AI</span>
              </li>
              <li class="flex items-center">
                <i class="fas fa-check text-green-500 mr-4 text-lg"></i>
                <span class="text-lg">Raccomandazioni servizi di base</span>
              </li>
              <li class="flex items-center">
                <i class="fas fa-check text-green-500 mr-4 text-lg"></i>
                <span class="text-lg">Analisi sentiment clienti</span>
              </li>
              <li class="flex items-center">
                <i class="fas fa-check text-green-500 mr-4 text-lg"></i>
                <span class="text-lg">Dashboard predittiva essenziale</span>
              </li>
              <li class="flex items-center">
                <i class="fas fa-check text-green-500 mr-4 text-lg"></i>
                <span class="text-lg">Supporto AI via chat</span>
              </li>
              <li class="flex items-center">
                <i class="fas fa-check text-green-500 mr-4 text-lg"></i>
                <span class="text-lg">Fino a 3 operatori</span>
              </li>
            </ul>
            
            <button class="w-full bg-gray-100 text-gray-800 font-medium py-4 px-8 rounded-xl hover:bg-gray-200 transition-colors text-lg">
              Prova l'AI gratuitamente
            </button>
          </div>
          
          <!-- Piano AI Professional (Più Popolare) -->
          <div class="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-500 rounded-3xl p-10 relative transform scale-105">
            <div class="absolute -top-6 left-1/2 transform -translate-x-1/2">
              <span class="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-3 rounded-full font-medium text-lg">
                Più Intelligente
              </span>
            </div>
            
            <div class="text-center">
              <div class="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <i class="fas fa-brain text-white text-3xl"></i>
              </div>
              <h3 class="text-4xl md:text-5xl font-bold text-gray-900 mb-3">AI Professional</h3>
              <p class="text-gray-600 mb-8 text-lg">AI avanzata per crescita intelligente</p>
              <div class="mb-10">
                <span class="text-5xl font-bold text-gray-900">€299</span>
                <span class="text-gray-600 text-xl">/mese</span>
              </div>
            </div>
            
            <ul class="space-y-5 mb-10">
              <li class="flex items-center">
                <i class="fas fa-check text-green-500 mr-4 text-lg"></i>
                <span class="text-lg">Tutto del piano AI Essential</span>
              </li>
              <li class="flex items-center">
                <i class="fas fa-check text-green-500 mr-4 text-lg"></i>
                <span class="text-lg">Previsione appuntamenti avanzata</span>
              </li>
              <li class="flex items-center">
                <i class="fas fa-check text-green-500 mr-4 text-lg"></i>
                <span class="text-lg">Pricing dinamico intelligente</span>
              </li>
              <li class="flex items-center">
                <i class="fas fa-check text-green-500 mr-4 text-lg"></i>
                <span class="text-lg">Segmentazione clienti AI-driven</span>
              </li>
              <li class="flex items-center">
                <i class="fas fa-check text-green-500 mr-4 text-lg"></i>
                <span class="text-lg">Inventario predittivo</span>
              </li>
              <li class="flex items-center">
                <i class="fas fa-check text-green-500 mr-4 text-lg"></i>
                <span class="text-lg">Machine Learning continuo</span>
              </li>
              <li class="flex items-center">
                <i class="fas fa-check text-green-500 mr-4 text-lg"></i>
                <span class="text-lg">Fino a 8 operatori</span>
              </li>
            </ul>
            
            <button class="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium py-4 px-8 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-lg">
              Scopri l'AI Avanzata
            </button>
          </div>
          
          <!-- Piano AI Enterprise -->
          <div class="bg-white border-2 border-gray-200 rounded-3xl p-10 hover:border-purple-300 transition-all duration-300 transform hover:scale-105">
            <div class="text-center">
              <div class="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <i class="fas fa-microchip text-white text-3xl"></i>
              </div>
              <h3 class="text-4xl md:text-5xl font-bold text-gray-900 mb-3">AI Enterprise</h3>
              <p class="text-gray-600 mb-8 text-lg">Intelligenza artificiale completa</p>
              <div class="mb-10">
                <span class="text-5xl font-bold text-gray-900">€499</span>
                <span class="text-gray-600 text-xl">/mese</span>
              </div>
            </div>
            
            <ul class="space-y-5 mb-10">
              <li class="flex items-center">
                <i class="fas fa-check text-green-500 mr-4 text-lg"></i>
                <span class="text-lg">Tutto del piano AI Professional</span>
              </li>
              <li class="flex items-center">
                <i class="fas fa-check text-green-500 mr-4 text-lg"></i>
                <span class="text-lg">Neural Networks personalizzate</span>
              </li>
              <li class="flex items-center">
                <i class="fas fa-check text-green-500 mr-4 text-lg"></i>
                <span class="text-lg">Deep Learning analytics</span>
              </li>
              <li class="flex items-center">
                <i class="fas fa-check text-green-500 mr-4 text-lg"></i>
                <span class="text-lg">AI Assistant personale dedicato</span>
              </li>
              <li class="flex items-center">
                <i class="fas fa-check text-green-500 mr-4 text-lg"></i>
                <span class="text-lg">Ottimizzazione revenue automatica</span>
              </li>
              <li class="flex items-center">
                <i class="fas fa-check text-green-500 mr-4 text-lg"></i>
                <span class="text-lg">API AI personalizzate</span>
              </li>
              <li class="flex items-center">
                <i class="fas fa-check text-green-500 mr-4 text-lg"></i>
                <span class="text-lg">Operatori illimitati</span>
              </li>
            </ul>
            
            <button class="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-medium py-4 px-8 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-lg">
              Contatta gli AI Specialists
            </button>
          </div>
        </div>
        
        <div class="mt-16 text-center">
          <p class="text-gray-600 mb-6 text-lg">Tutti i piani includono 30 giorni di AI gratuita • Nessun impegno a lungo termine • Setup AI assistito</p>
          <div class="flex justify-center items-center space-x-8 text-gray-500">
            <div class="flex items-center">
              <i class="fas fa-shield-alt text-green-500 mr-3 text-lg"></i>
              <span class="text-lg">AI Sicura e Certificata</span>
            </div>
            <div class="flex items-center">
              <i class="fas fa-headset text-green-500 mr-3 text-lg"></i>
              <span class="text-lg">Supporto AI 24/7</span>
            </div>
            <div class="flex items-center">
              <i class="fas fa-brain text-green-500 mr-3 text-lg"></i>
              <span class="text-lg">Apprendimento Continuo</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Processo di Implementazione AI -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-20">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Come implementare l'AI nel tuo centro</h2>
          <p class="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Un processo guidato per trasformare il tuo centro con l'intelligenza artificiale
          </p>
        </div>
        
        <div class="grid md:grid-cols-4 gap-8">
          <!-- Step 1 -->
          <div class="text-center relative">
            <div class="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
              <span class="text-white font-bold text-xl">1</span>
            </div>
            <div class="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gray-300 -z-10"></div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Analisi AI</h3>
            <p class="text-gray-600">
              I nostri AI Specialists analizzano il tuo centro per identificare le migliori opportunità di automazione
            </p>
          </div>
          
          <!-- Step 2 -->
          <div class="text-center relative">
            <div class="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
              <span class="text-white font-bold text-xl">2</span>
            </div>
            <div class="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gray-300 -z-10"></div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Setup Personalizzato</h3>
            <p class="text-gray-600">
              Configurazione degli algoritmi AI specifici per le esigenze del tuo centro e training dei modelli
            </p>
          </div>
          
          <!-- Step 3 -->
          <div class="text-center relative">
            <div class="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
              <span class="text-white font-bold text-xl">3</span>
            </div>
            <div class="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gray-300 -z-10"></div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Training Team</h3>
            <p class="text-gray-600">
              Formazione del tuo team sull'utilizzo dell'AI e integrazione nei processi quotidiani
            </p>
          </div>
          
          <!-- Step 4 -->
          <div class="text-center">
            <div class="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="text-white font-bold text-xl">4</span>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Go Live AI</h3>
            <p class="text-gray-600">
              Attivazione completa dell'AI con monitoraggio continuo e ottimizzazione delle performance
            </p>
          </div>
        </div>
        
        <div class="mt-12 text-center">
          <router-link 
            to="/login" 
            class="inline-flex items-center bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium py-4 px-8 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-lg"
          >
            <i class="fas fa-brain mr-3"></i>
            Inizia la trasformazione AI
          </router-link>
          <p class="text-gray-500 text-sm mt-3">Setup AI gratuito • Risultati garantiti in 30 giorni • Supporto dedicato</p>
        </div>
      </div>
    </section>
    
    <!-- Tecnologie AI Avanzate -->
    <section class="py-16 bg-gradient-to-br from-gray-900 to-purple-900 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-20">
          <h2 class="text-4xl md:text-5xl font-bold text-white mb-6">L'AI più avanzata per il settore beauty</h2>
          <p class="text-xl md:text-2xl text-purple-200 max-w-4xl mx-auto leading-relaxed">
            Algoritmi proprietari di intelligenza artificiale progettati specificamente per rivoluzionare i centri estetici e massimizzare risultati e soddisfazione
          </p>
        </div>
        
        <div class="grid lg:grid-cols-2 gap-12 mb-16">
          <!-- AI Features Left Column -->
          <div class="space-y-8">
            <!-- AI Predictive Scheduling -->
            <div class="bg-white bg-opacity-10 backdrop-blur-lg p-8 rounded-xl border border-white border-opacity-20">
              <div class="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center mb-6">
                <i class="fas fa-brain text-white text-2xl"></i>
              </div>
              <h3 class="text-2xl font-bold mb-4">AI Predictive Scheduling</h3>
              <p class="text-purple-200 mb-6">
                Neural networks avanzate analizzano migliaia di variabili per prevedere la domanda futura e ottimizzare automaticamente l'agenda, riducendo tempi morti e massimizzando l'efficienza.
              </p>
              <div class="space-y-3">
                <div class="flex items-center text-sm">
                  <i class="fas fa-check text-green-400 mr-3"></i>
                  <span>Previsioni accurate al 98% con machine learning</span>
                </div>
                <div class="flex items-center text-sm">
                  <i class="fas fa-check text-green-400 mr-3"></i>
                  <span>Ottimizzazione automatica slot temporali</span>
                </div>
                <div class="flex items-center text-sm">
                  <i class="fas fa-check text-green-400 mr-3"></i>
                  <span>Gestione intelligente cancellazioni e no-show</span>
                </div>
              </div>
            </div>
            
            <!-- AI Deep Personalization -->
            <div class="bg-white bg-opacity-10 backdrop-blur-lg p-8 rounded-xl border border-white border-opacity-20">
              <div class="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mb-6">
                <i class="fas fa-user-cog text-white text-2xl"></i>
              </div>
              <h3 class="text-2xl font-bold mb-4">Deep Learning Personalization</h3>
              <p class="text-purple-200 mb-6">
                Algoritmi di deep learning analizzano pattern comportamentali, preferenze e risultati storici per creare esperienze iper-personalizzate per ogni cliente.
              </p>
              <div class="space-y-3">
                <div class="flex items-center text-sm">
                  <i class="fas fa-check text-green-400 mr-3"></i>
                  <span>Raccomandazioni AI con 95% di accuratezza</span>
                </div>
                <div class="flex items-center text-sm">
                  <i class="fas fa-check text-green-400 mr-3"></i>
                  <span>Predizione tendenze e preferenze future</span>
                </div>
                <div class="flex items-center text-sm">
                  <i class="fas fa-check text-green-400 mr-3"></i>
                  <span>Upselling intelligente automatizzato</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- AI Features Right Column -->
          <div class="space-y-8">
            <!-- AI Business Intelligence -->
            <div class="bg-white bg-opacity-10 backdrop-blur-lg p-8 rounded-xl border border-white border-opacity-20">
              <div class="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6">
                <i class="fas fa-chart-pie text-white text-2xl"></i>
              </div>
              <h3 class="text-2xl font-bold mb-4">AI Business Intelligence</h3>
              <p class="text-purple-200 mb-6">
                Modelli predittivi avanzati elaborano big data per fornire insights strategici, previsioni di fatturato e identificazione di opportunità di crescita nascoste.
              </p>
              <div class="space-y-3">
                <div class="flex items-center text-sm">
                  <i class="fas fa-check text-green-400 mr-3"></i>
                  <span>Previsioni fatturato con AI al 97% precisione</span>
                </div>
                <div class="flex items-center text-sm">
                  <i class="fas fa-check text-green-400 mr-3"></i>
                  <span>Analisi sentiment real-time su feedback</span>
                </div>
                <div class="flex items-center text-sm">
                  <i class="fas fa-check text-green-400 mr-3"></i>
                  <span>Identificazione pattern e anomalie automatica</span>
                </div>
              </div>
            </div>
            
            <!-- AI Conversational Assistant -->
            <div class="bg-white bg-opacity-10 backdrop-blur-lg p-8 rounded-xl border border-white border-opacity-20">
              <div class="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center mb-6">
                <i class="fas fa-robot text-white text-2xl"></i>
              </div>
              <h3 class="text-2xl font-bold mb-4">AI Conversational Assistant</h3>
              <p class="text-purple-200 mb-6">
                Chatbot conversazionale avanzato con NLP (Natural Language Processing) per supporto clienti 24/7, gestione prenotazioni automatiche e assistenza personalizzata multi-canale.
              </p>
              <div class="space-y-3">
                <div class="flex items-center text-sm">
                  <i class="fas fa-check text-green-400 mr-3"></i>
                  <span>Comprensione linguaggio naturale avanzata</span>
                </div>
                <div class="flex items-center text-sm">
                  <i class="fas fa-check text-green-400 mr-3"></i>
                  <span>Risoluzione automatica 90% delle richieste</span>
                </div>
                <div class="flex items-center text-sm">
                  <i class="fas fa-check text-green-400 mr-3"></i>
                  <span>Integrazione multicanale (web, app, social)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- AI Performance Stats -->
        <div class="bg-white bg-opacity-5 rounded-2xl p-8 mb-16">
          <div class="text-center mb-12">
            <h3 class="text-2xl md:text-3xl font-bold mb-8">Performance AI in tempo reale</h3>
            <p class="text-purple-200 max-w-2xl mx-auto text-lg leading-relaxed">
              I nostri modelli di intelligenza artificiale elaborano continuamente milioni di dati per ottimizzare le performance
            </p>
          </div>
          
          <div class="grid md:grid-cols-4 gap-8">
            <div class="text-center">
              <div class="text-3xl font-bold text-cyan-400 mb-2 animate-pulse">100M+</div>
              <div class="text-sm text-purple-200">Decisioni AI al giorno</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-green-400 mb-2 animate-pulse">98.7%</div>
              <div class="text-sm text-purple-200">Accuratezza predizioni</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-pink-400 mb-2 animate-pulse">+47%</div>
              <div class="text-sm text-purple-200">Incremento efficienza</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-yellow-400 mb-2 animate-pulse">&lt;50ms</div>
              <div class="text-sm text-purple-200">Tempo risposta AI</div>
            </div>
          </div>
        </div>
        
        <!-- AI Future Features -->          <div class="text-center">
            <h3 class="text-2xl md:text-3xl font-bold mb-8">Prossime innovazioni AI</h3>
            <div class="grid md:grid-cols-3 gap-6">
            <div class="bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-xl border border-white border-opacity-20">
              <div class="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-eye text-white"></i>
              </div>
              <h4 class="font-bold mb-2">Computer Vision</h4>
              <p class="text-sm text-purple-200">Analisi automatica della pelle per raccomandazioni trattamenti personalizzati</p>
            </div>
            
            <div class="bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-xl border border-white border-opacity-20">
              <div class="w-12 h-12 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-microphone text-white"></i>
              </div>
              <h4 class="font-bold mb-2">Voice AI</h4>
              <p class="text-sm text-purple-200">Assistente vocale per gestione appuntamenti hands-free durante i trattamenti</p>
            </div>
            
            <div class="bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-xl border border-white border-opacity-20">
              <div class="w-12 h-12 bg-gradient-to-r from-teal-400 to-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-magic text-white"></i>
              </div>
              <h4 class="font-bold mb-2">AI Generativa</h4>
              <p class="text-sm text-purple-200">Creazione automatica di contenuti marketing personalizzati per ogni centro</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    


    
    <!-- FAQ AI -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-20">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Domande frequenti sull'AI</h2>
          <p class="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Risposte alle domande più comuni sull'intelligenza artificiale di BeautyHub
          </p>
        </div>
        
        <div class="space-y-6">
          <!-- FAQ 1 -->
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="p-6 border-l-4 border-purple-500">
              <h3 class="text-lg font-bold text-gray-900 mb-3">
                <i class="fas fa-brain text-purple-500 mr-2"></i>
                Come funziona l'intelligenza artificiale di BeautyHub?
              </h3>
              <p class="text-gray-600">
                La nostra AI utilizza algoritmi di machine learning e deep learning per analizzare dati storici, pattern comportamentali e tendenze di mercato. Elabora milioni di decisioni al giorno per ottimizzare automaticamente agenda, pricing, inventario e customer experience.
              </p>
            </div>
          </div>
          
          <!-- FAQ 2 -->
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="p-6 border-l-4 border-blue-500">
              <h3 class="text-lg font-bold text-gray-900 mb-3">
                <i class="fas fa-robot text-blue-500 mr-2"></i>
                L'AI può davvero aumentare il fatturato del mio centro?
              </h3>
              <p class="text-gray-600">
                Assolutamente sì. I nostri centri vedono in media un aumento del 35% del fatturato grazie all'ottimizzazione AI dei prezzi, raccomandazioni personalizzate, riduzione tempi morti del 40% e miglioramento della retention clienti. L'AI identifica opportunità nascoste che sfuggono all'analisi manuale.
              </p>
            </div>
          </div>
          
          <!-- FAQ 3 -->
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="p-6 border-l-4 border-green-500">
              <h3 class="text-lg font-bold text-gray-900 mb-3">
                <i class="fas fa-shield-alt text-green-500 mr-2"></i>
                I dati dei miei clienti sono sicuri con l'AI?
              </h3>
              <p class="text-gray-600">
                La sicurezza è la nostra priorità assoluta. L'AI di BeautyHub è certificata per privacy-by-design, utilizza crittografia end-to-end e rispetta tutti i protocolli GDPR. I dati vengono elaborati in modo anonimizzato e mai condivisi con terze parti.
              </p>
            </div>
          </div>
          
          <!-- FAQ 4 -->
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="p-6 border-l-4 border-yellow-500">
              <h3 class="text-lg font-bold text-gray-900 mb-3">
                <i class="fas fa-clock text-yellow-500 mr-2"></i>
                Quanto tempo serve per vedere i primi risultati AI?
              </h3>
              <p class="text-gray-600">
                I primi miglioramenti sono visibili entro 7-14 giorni dall'attivazione. L'AI inizia subito a ottimizzare agenda e raccomandazioni. I risultati significativi (aumento fatturato, riduzione tempi morti) sono evidenti dopo 30 giorni, quando l'AI ha acquisito sufficienti dati per le predizioni avanzate.
              </p>
            </div>
          </div>
          
          <!-- FAQ 5 -->
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="p-6 border-l-4 border-red-500">
              <h3 class="text-lg font-bold text-gray-900 mb-3">
                <i class="fas fa-graduation-cap text-red-500 mr-2"></i>
                Il mio team deve imparare a usare l'AI?
              </h3>
              <p class="text-gray-600">
                No, l'AI di BeautyHub funziona completamente in background. Il tuo team continua a usare l'interfaccia familiare mentre l'AI ottimizza automaticamente tutto. Offriamo comunque formazione gratuita per sfruttare al massimo le insights AI e interpretare i report predittivi.
              </p>
            </div>
          </div>
          
          <!-- FAQ 6 -->
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="p-6 border-l-4 border-indigo-500">
              <h3 class="text-lg font-bold text-gray-900 mb-3">
                <i class="fas fa-cogs text-indigo-500 mr-2"></i>
                L'AI si adatta alle specificità del mio centro?
              </h3>
              <p class="text-gray-600">
                Esatto! L'AI di BeautyHub utilizza machine learning continuo per adattarsi alle caratteristiche uniche del tuo centro: clientela, orari, servizi, stagionalità locale. Più la usi, più diventa precisa nelle predizioni e raccomandazioni specifiche per il tuo business.
              </p>
            </div>
          </div>
        </div>
        
        <div class="mt-12 text-center">
          <p class="text-gray-600 mb-6">Vuoi saperne di più sull'AI di BeautyHub?</p>
          <router-link 
            to="#contatti" 
            class="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
          >
            <i class="fas fa-brain mr-2"></i>
            Parla con un AI Specialist
          </router-link>
        </div>
      </div>
    </section>
    
    <!-- Testimonianze AI -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-20">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Successi AI reali</h2>
          <p class="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Scopri come l'intelligenza artificiale di BeautyHub ha trasformato concretamente i centri estetici.
          </p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-gradient-to-br from-purple-50 to-blue-50 p-8 rounded-lg border border-purple-200">
            <div class="flex items-center mb-6">
              <div class="text-yellow-400 flex">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
              </div>
              <span class="ml-2 text-sm font-medium text-purple-600">+45% Fatturato</span>
            </div>
            <p class="text-gray-600 mb-6">
              "L'AI di BeautyHub ha rivoluzionato il nostro centro! Il pricing dinamico e le raccomandazioni personalizzate hanno aumentato il fatturato del 45% in soli 3 mesi. I clienti adorano i suggerimenti AI!"
            </p>
            <div class="flex items-center">
              <div class="w-12 h-12 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full mr-4 flex items-center justify-center">
                <i class="fas fa-brain text-white"></i>
              </div>
              <div>
                <p class="font-medium text-gray-900">Laura Bianchi</p>
                <p class="text-sm text-gray-500">Titolare, Beauty Space AI - Milano</p>
              </div>
            </div>
          </div>
          
          <div class="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-lg border border-green-200">
            <div class="flex items-center mb-6">
              <div class="text-yellow-400 flex">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
              </div>
              <span class="ml-2 text-sm font-medium text-green-600">-60% Tempi Morti</span>
            </div>
            <p class="text-gray-600 mb-6">
              "L'agenda predittiva AI ha eliminato quasi completamente i tempi morti. L'efficienza è aumentata del 60% e i clienti non aspettano mai! Il chatbot gestisce l'80% delle prenotazioni automaticamente."
            </p>
            <div class="flex items-center">
              <div class="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full mr-4 flex items-center justify-center">
                <i class="fas fa-robot text-white"></i>
              </div>
              <div>
                <p class="font-medium text-gray-900">Marco Rossi</p>
                <p class="text-sm text-gray-500">Manager, Estetica AI Moderna - Roma</p>
              </div>
            </div>
          </div>
          
          <div class="bg-gradient-to-br from-cyan-50 to-blue-50 p-8 rounded-lg border border-cyan-200">
            <div class="flex items-center mb-6">
              <div class="text-yellow-400 flex">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
              </div>
              <span class="ml-2 text-sm font-medium text-cyan-600">99% Soddisfazione</span>
            </div>
            <p class="text-gray-600 mb-6">
              "Gli analytics predittivi AI ci hanno aperto gli occhi su opportunità nascoste. L'analisi sentiment ci aiuta a migliorare continuamente. I clienti hanno il 99% di soddisfazione grazie all'esperienza personalizzata!"
            </p>
            <div class="flex items-center">
              <div class="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full mr-4 flex items-center justify-center">
                <i class="fas fa-chart-line text-white"></i>
              </div>
              <div>
                <p class="font-medium text-gray-900">Giulia Verdi</p>
                <p class="text-sm text-gray-500">Proprietaria, Oasi AI Benessere - Firenze</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- AI Stats Banner -->
        <div class="mt-12 bg-gradient-to-r from-gray-900 to-purple-900 rounded-2xl p-8 text-white text-center">
          <h3 class="text-2xl font-bold mb-4">Risultati AI Certificati</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div class="text-3xl font-bold text-cyan-400 mb-1">+35%</div>
              <div class="text-sm text-gray-300">Fatturato Medio</div>
            </div>
            <div>
              <div class="text-3xl font-bold text-green-400 mb-1">-40%</div>
              <div class="text-sm text-gray-300">Tempi Morti</div>
            </div>
            <div>
              <div class="text-3xl font-bold text-pink-400 mb-1">98%</div>
              <div class="text-sm text-gray-300">Soddisfazione</div>
            </div>
            <div>
              <div class="text-3xl font-bold text-yellow-400 mb-1">85%</div>
              <div class="text-sm text-gray-300">Automazione</div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- CTA AI -->
    <section class="py-16 bg-gradient-to-r from-purple-600 to-blue-500 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="text-center mb-20">
          <h2 class="text-4xl md:text-5xl font-bold text-white mb-6">Trasforma il tuo centro con l'AI</h2>
          <p class="text-xl md:text-2xl mb-10 max-w-4xl mx-auto leading-relaxed">
            Unisciti a migliaia di centri estetici che hanno scelto l'intelligenza artificiale di BeautyHub per rivoluzionare il loro business.
          </p>
        </div>
        <div class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <router-link 
            to="/prenotazione-online" 
            class="bg-white text-purple-600 font-medium py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center"
          >
            <i class="fas fa-robot mr-2"></i>
            Prenota con AI
          </router-link>
          <router-link
            v-if="authStore.isLoggedIn"
            to="/dashboard" 
            class="border border-white text-white font-medium py-3 px-8 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors duration-300 flex items-center justify-center"
          >
            <i class="fas fa-brain mr-2"></i>
            Dashboard AI
          </router-link>
          <router-link 
            v-else
            to="/login" 
            class="border border-white text-white font-medium py-3 px-8 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors duration-300 flex items-center justify-center"
          >
            <i class="fas fa-brain mr-2"></i>
            Accedi all'AI
          </router-link>
        </div>
      </div>
    </section>
    
    <!-- Contatti -->
    <section id="contatti" class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-20">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Contatta BeautyHub</h2>
          <p class="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Hai domande sulla nostra piattaforma o vuoi entrare nella rete? Contattaci!
          </p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i class="fas fa-phone text-purple-600"></i>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Telefono</h3>
            <p class="text-gray-600">{{ telefono }}</p>
          </div>
          
          <div class="text-center">
            <div class="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i class="fas fa-envelope text-purple-600"></i>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Email</h3>
            <p class="text-gray-600">{{ email }}</p>
          </div>
          
          <div class="text-center">
            <div class="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i class="fas fa-map-marker-alt text-purple-600"></i>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Indirizzo</h3>
            <p class="text-gray-600">{{ indirizzo }}</p>
          </div>
        </div>
      </div>
    </section>
  </LandingLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import LandingLayout from '@/layouts/LandingLayout.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Dati statici dell'applicazione BeautyHub
const telefono = ref('+39 800 123 456')
const email = ref('info@beautyhub.it')
const indirizzo = ref('Via Roma 123, 20121 Milano')

// Slider funzionalità
const currentSlide = ref(0)
const totalSlides = ref(3)
let autoSlideInterval: number | null = null

// Computed per il transform del slider
const sliderTransform = computed(() => ({
  transform: `translateX(-${currentSlide.value * 100}%)`
}))

// Funzioni slider
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % totalSlides.value
}

const previousSlide = () => {
  currentSlide.value = currentSlide.value === 0 ? totalSlides.value - 1 : currentSlide.value - 1
}

const goToSlide = (index: number) => {
  currentSlide.value = index
}

// Auto-slide
const startAutoSlide = () => {
  autoSlideInterval = setInterval(nextSlide, 5000) // Cambia slide ogni 5 secondi
}

const stopAutoSlide = () => {
  if (autoSlideInterval) {
    clearInterval(autoSlideInterval)
    autoSlideInterval = null
  }
}

onMounted(() => {
  startAutoSlide()
})

onUnmounted(() => {
  stopAutoSlide()
})
</script>

<style scoped>
/* Stili aggiuntivi opzionali */
</style>
