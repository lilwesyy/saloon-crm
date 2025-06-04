<template>
  <div class="container mx-auto px-4 py-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Ricerca Clienti</h1>
      <router-link 
        to="/clienti" 
        class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
      >
        Torna alla Lista
      </router-link>
    </div>

    <RicercaAvanzata @select-cliente="navigateToCliente" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import RicercaAvanzata from '@/components/clienti/RicercaAvanzata.vue';

const router = useRouter();

const navigateToCliente = (clienteId: string) => {
  router.push(`/clienti/${clienteId}`);
};
</script>
