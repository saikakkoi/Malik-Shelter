import { ref, watch, onMounted } from 'vue'

const isDark = ref(false)

export function useDarkMode() {
  const initDarkMode = () => {
    const saved = localStorage.getItem('darkMode')
    if (saved !== null) {
      isDark.value = saved === 'true'
    } else {
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    applyDark(isDark.value)
  }

  const applyDark = (value: boolean) => {
    if (value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const toggle = () => {
    isDark.value = !isDark.value
    localStorage.setItem('darkMode', String(isDark.value))
    applyDark(isDark.value)
  }

  onMounted(() => {
    initDarkMode()
  })

  watch(isDark, applyDark)

  return { isDark, toggle }
}
