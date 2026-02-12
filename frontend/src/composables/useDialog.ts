import { reactive, readonly } from 'vue'

interface DialogState {
  isOpen: boolean
  title: string
  message: string
  type: 'success' | 'error' | 'info'
  confirmText: string
  lottie?: string
  onConfirm?: () => void
}

const state = reactive<DialogState>({
  isOpen: false,
  title: '',
  message: '',
  type: 'info',
  confirmText: 'Got it',
  lottie: undefined
})

export function useDialog() {
  const show = (options: {
    title?: string,
    message: string,
    type?: DialogState['type'],
    confirmText?: string,
    lottie?: string,
    onConfirm?: () => void
  }) => {
    state.title = options.title || (options.type === 'success' ? 'Great News!' : options.type === 'error' ? 'Oops!' : 'Notice')
    state.message = options.message
    state.type = options.type || 'info'
    state.confirmText = options.confirmText || (options.type === 'success' ? 'Beautiful! 🐾' : 'Got it')
    state.lottie = options.lottie
    state.onConfirm = options.onConfirm
    state.isOpen = true
  }

  const close = () => {
    state.isOpen = false
  }

  const success = (message: string, onConfirm?: () => void) => show({ message, type: 'success', onConfirm })
  const error = (message: string) => show({ message, type: 'error' })
  const info = (message: string) => show({ message, type: 'info' })

  return {
    state: readonly(state),
    show,
    close,
    success,
    error,
    info
  }
}
