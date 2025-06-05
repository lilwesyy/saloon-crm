<template>
  <transition name="modal" appear>
    <div v-if="modelValue" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4 transform transition-all duration-300 ease-out">
        <div class="flex items-center mb-4">
          <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">{{ title || 'Conferma Eliminazione' }}</h3>
            <p class="text-sm text-gray-500">{{ subtitle || 'Questa azione non può essere annullata' }}</p>
          </div>
        </div>
        
        <div class="mb-6">
          <p class="text-gray-700" v-if="message">
            {{ message }}
          </p>
          <slot></slot>
          <p class="text-sm text-gray-500 mt-2" v-if="warningText">
            {{ warningText }}
          </p>
        </div>
        
        <div class="flex justify-end gap-3">
          <button 
            @click="cancel" 
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            {{ cancelButtonText || 'Annulla' }}
          </button>
          <button 
            @click="confirm" 
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {{ confirmButtonText || 'Elimina' }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  },
  warningText: {
    type: String,
    default: ''
  },
  confirmButtonText: {
    type: String,
    default: ''
  },
  cancelButtonText: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel']);

const confirm = () => {
  emit('confirm');
};

const cancel = () => {
  emit('cancel');
  emit('update:modelValue', false);
};
</script>

<style scoped>
/* Animazioni per il modal */
.modal-enter-active {
  transition: all 0.3s ease-out;
}

.modal-leave-active {
  transition: all 0.2s ease-in;
}

.modal-enter-from {
  opacity: 0;
}

.modal-enter-to {
  opacity: 1;
}

.modal-leave-from {
  opacity: 1;
}

.modal-leave-to {
  opacity: 0;
}

/* Animazione per il contenuto del modal */
.modal-enter-from .bg-white {
  transform: scale(0.9) translateY(-20px);
  opacity: 0;
}

.modal-enter-to .bg-white {
  transform: scale(1) translateY(0);
  opacity: 1;
}

.modal-leave-from .bg-white {
  transform: scale(1) translateY(0);
  opacity: 1;
}

.modal-leave-to .bg-white {
  transform: scale(0.95) translateY(-10px);
  opacity: 0;
}

/* Effetto backdrop blur quando il modal è aperto */
.modal-enter-active .fixed {
  backdrop-filter: blur(4px);
}
</style>
