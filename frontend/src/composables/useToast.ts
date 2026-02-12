import { reactive, readonly } from 'vue'

interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
  duration?: number
}

const state = reactive<{ toasts: Toast[] }>({
  toasts: []
})

let nextId = 0

export function useToast() {
  const show = (message: string, type: Toast['type'] = 'info', duration = 5000) => {
    const id = nextId++
    state.toasts.push({ id, message, type, duration })

    if (duration > 0) {
      setTimeout(() => {
        remove(id)
      }, duration)
    }
  }

  const remove = (id: number) => {
    const index = state.toasts.findIndex(t => t.id === id)
    if (index !== -1) {
      state.toasts.splice(index, 1)
    }
  }

  const success = (message: string) => show(message, 'success')
  const error = (message: string) => show(message, 'error')
  const info = (message: string) => show(message, 'info')

  return {
    toasts: readonly(state.toasts),
    show,
    remove,
    success,
    error,
    info
  }
}
