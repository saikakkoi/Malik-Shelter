import { reactive, readonly } from 'vue'
import { useAuth } from './useAuth'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

interface VisitTemplate {
  id: string
  day_of_week: string
  start_time: string
  end_time: string
  capacity_per_slot: number
  is_active: boolean
}

interface VisitSlotsState {
  templates: VisitTemplate[]
  loading: boolean
  error: string | null
}

const state = reactive<VisitSlotsState>({
  templates: [],
  loading: false,
  error: null
})

export const useVisitSlots = () => {
  const { state: authState } = useAuth()

  const listTemplates = async () => {
    state.loading = true
    state.error = null
    try {
      const res = await fetch(`${BASE_URL}/visit-slots/templates`, {
        headers: {
          'Authorization': `Bearer ${authState.token}`
        }
      })
      if (!res.ok) throw new Error('Failed to fetch templates')
      state.templates = await res.json()
    } catch (e: any) {
      state.error = e.message
    } finally {
      state.loading = false
    }
  }

  const createTemplate = async (data: Partial<VisitTemplate>) => {
    state.loading = true
    try {
      const res = await fetch(`${BASE_URL}/visit-slots/templates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.token}`
        },
        body: JSON.stringify(data)
      })
      if (!res.ok) throw new Error('Failed to create template')
      await listTemplates()
    } finally {
      state.loading = false
    }
  }

  const deleteTemplate = async (id: string) => {
    state.loading = true
    try {
      const res = await fetch(`${BASE_URL}/visit-slots/templates/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authState.token}`
        }
      })
      if (!res.ok) throw new Error('Failed to delete template')
      await listTemplates()
    } finally {
      state.loading = false
    }
  }

  const generateSlots = async (days: number = 7) => {
    state.loading = true
    try {
      const res = await fetch(`${BASE_URL}/visit-slots/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.token}`
        },
        body: JSON.stringify({ days })
      })
      if (!res.ok) throw new Error('Failed to generate slots')
      return await res.json()
    } finally {
      state.loading = false
    }
  }

  return {
    state: readonly(state),
    listTemplates,
    createTemplate,
    deleteTemplate,
    generateSlots
  }
}
