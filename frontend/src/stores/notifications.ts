import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  title?: string
  duration?: number
  persistent?: boolean
  action?: {
    text: string
    callback: () => void
  }
}

export const useNotificationStore = defineStore('notifications', () => {
  // State
  const notifications = ref<Notification[]>([])

  // Actions
  const add = (notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    const newNotification: Notification = {
      id,
      duration: 5000,
      persistent: false,
      ...notification
    }
    
    notifications.value.push(newNotification)
    
    // Auto remove notification after duration (if not persistent)
    if (!newNotification.persistent && newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        remove(id)
      }, newNotification.duration)
    }
    
    return id
  }

  const remove = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const clear = () => {
    notifications.value = []
  }

  const success = (message: string, options?: Partial<Omit<Notification, 'id' | 'type' | 'message'>>) => {
    return add({ type: 'success', message, ...options })
  }

  const error = (message: string, options?: Partial<Omit<Notification, 'id' | 'type' | 'message'>>) => {
    return add({ type: 'error', message, duration: 0, persistent: true, ...options })
  }

  const warning = (message: string, options?: Partial<Omit<Notification, 'id' | 'type' | 'message'>>) => {
    return add({ type: 'warning', message, ...options })
  }

  const info = (message: string, options?: Partial<Omit<Notification, 'id' | 'type' | 'message'>>) => {
    return add({ type: 'info', message, ...options })
  }

  return {
    // State
    notifications,
    
    // Actions
    add,
    remove,
    clear,
    success,
    error,
    warning,
    info
  }
})
