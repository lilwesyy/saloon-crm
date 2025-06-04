<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>{{ isEditing ? 'Modifica' : 'Nuovo' }} Record Fedeltà</h2>
        <button class="close-btn" @click="closeModal">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <form @submit.prevent="submitForm" class="form">
        <div class="form-section">
          <h3>Informazioni Cliente</h3>
          
          <div class="form-group">
            <label for="cliente">Cliente *</label>
            <input
              id="cliente"
              v-model="form.cliente"
              type="text"
              required
              placeholder="ID Cliente"
            >
            <span v-if="errors.cliente" class="error">{{ errors.cliente }}</span>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="livello">Livello *</label>
              <select id="livello" v-model="form.livello" required>
                <option value="bronzo">Bronzo</option>
                <option value="argento">Argento</option>
                <option value="oro">Oro</option>
                <option value="platino">Platino</option>
              </select>
            </div>

            <div class="form-group">
              <label for="punti">Punti *</label>
              <input
                id="punti"
                v-model.number="form.punti"
                type="number"
                min="0"
                required
                placeholder="0"
              >
            </div>
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input
                type="checkbox"
                v-model="form.attivo"
              >
              <span class="checkmark"></span>
              Record attivo
            </label>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-secondary" @click="closeModal">
            Annulla
          </button>
          <button type="submit" class="btn btn-primary" :disabled="submitting">
            <i v-if="submitting" class="fas fa-spinner fa-spin"></i>
            {{ isEditing ? 'Aggiorna' : 'Crea' }} Record
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, PropType } from 'vue'
import { useProgrammaFedeltaStore } from '../../stores/programmaFedelta'
import { useNotificationStore } from '../../stores/notifications'
import type { CreateProgrammaFedeltaData, UpdateProgrammaFedeltaData, ProgrammaFedelta } from '../../services/programmaFedelta.service'

interface ProgrammaForm {
  cliente: string
  livello: 'bronzo' | 'argento' | 'oro' | 'platino'
  punti: number
  attivo: boolean
}

export default defineComponent({
  name: 'ProgrammaFedeltaForm',
  props: {
    programma: {
      type: Object as PropType<ProgrammaFedelta | null>,
      default: null
    }
  },
  emits: ['close', 'saved'],
  setup(props, { emit }) {
    const programmaStore = useProgrammaFedeltaStore()
    const notificationStore = useNotificationStore()

    const submitting = ref(false)
    const errors = ref<Record<string, string>>({})

    const isEditing = computed(() => !!props.programma)

    const form = ref<ProgrammaForm>({
      cliente: '',
      livello: 'bronzo',
      punti: 0,
      attivo: true
    })

    const initializeForm = () => {
      if (props.programma) {
        form.value = {
          cliente: props.programma.cliente._id,
          livello: props.programma.livello,
          punti: props.programma.punti,
          attivo: props.programma.attivo
        }
      } else {
        form.value = {
          cliente: '',
          livello: 'bronzo',
          punti: 0,
          attivo: true
        }
      }
    }

    const validateForm = (): boolean => {
      errors.value = {}

      if (!form.value.cliente.trim()) {
        errors.value.cliente = 'Il cliente è obbligatorio'
      }

      return Object.keys(errors.value).length === 0
    }

    const submitForm = async () => {
      if (!validateForm()) {
        return
      }

      submitting.value = true

      try {
        const programmaData: CreateProgrammaFedeltaData | UpdateProgrammaFedeltaData = {
          cliente: form.value.cliente,
          livello: form.value.livello,
          punti: form.value.punti,
          attivo: form.value.attivo
        }

        if (isEditing.value && props.programma) {
          await programmaStore.updateProgramma(props.programma._id, programmaData as UpdateProgrammaFedeltaData)
          notificationStore.success('Programma fedeltà aggiornato con successo')
        } else {
          await programmaStore.createProgramma(programmaData as CreateProgrammaFedeltaData)
          notificationStore.success('Programma fedeltà creato con successo')
        }

        emit('saved')
      } catch (error: any) {
        notificationStore.error(error.message || 'Errore nel salvataggio del programma')
      } finally {
        submitting.value = false
      }
    }

    const closeModal = () => {
      emit('close')
    }

    onMounted(() => {
      initializeForm()
    })

    return {
      form,
      errors,
      submitting,
      isEditing,
      submitForm,
      closeModal,
      initializeForm
    }
  }
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0 24px;
  border-bottom: 1px solid #eee;
  margin-bottom: 24px;
}

.modal-header h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 20px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  color: #7f8c8d;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f8f9fa;
  color: #2c3e50;
}

.form {
  padding: 0 24px 24px 24px;
}

.form-section {
  margin-bottom: 32px;
}

.form-section h3 {
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 16px;
  font-weight: 600;
}

.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #2c3e50;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
}

.checkbox-label {
  display: flex !important;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  margin-bottom: 0 !important;
}

.checkbox-label input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid #ddd;
  border-radius: 4px;
  margin-right: 8px;
  position: relative;
  transition: all 0.2s;
}

.checkbox-label input[type="checkbox"]:checked + .checkmark {
  background: #667eea;
  border-color: #667eea;
}

.checkbox-label input[type="checkbox"]:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: -2px;
  left: 2px;
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.error {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: #e74c3c;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  margin-top: 32px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #5a6fd8;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .modal-content {
    margin: 10px;
    max-height: 95vh;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
