import { reactive, readonly } from 'vue'

interface User {
  id: string
  email: string
  role: string
  fullName: string
}

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
}

const state = reactive<AuthState>({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token'),
  loading: false
})

export function useAuth() {
  const login = async (email: string, password: string) => {
    state.loading = true
    try {
      const res = await fetch(import.meta.env.VITE_API_BASE_URL + '/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Login failed')
      }

      const data = await res.json()
      state.user = data.user
      state.token = data.token

      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('token', data.token)

      return data.user
    } finally {
      state.loading = false
    }
  }

  const register = async (email: string, password: string, fullName: string) => {
    state.loading = true
    try {
      const res = await fetch(import.meta.env.VITE_API_BASE_URL + '/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName })
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Registration failed')
      }

      const data = await res.json()
      state.user = data.user
      state.token = data.token

      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('token', data.token)

      return data.user
    } finally {
      state.loading = false
    }
  }

  const logout = () => {
    state.user = null
    state.token = null
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  const isAuthenticated = () => !!state.token
  const isStaff = () => state.user?.role === 'STAFF' || state.user?.role === 'ADMIN'

  return {
    state: readonly(state),
    login,
    register,
    logout,
    isAuthenticated,
    isStaff
  }
}
