import { reactive, readonly } from 'vue'
import { useAuth } from './useAuth'

const { state: authState } = useAuth()
const BASE_URL = import.meta.env.VITE_API_BASE_URL

interface AdoptionState {
  availableSlots: any[]
  myRequests: any[]
  loading: boolean
}

const state = reactive<AdoptionState>({
  availableSlots: [],
  myRequests: [],
  loading: false
})

export function useAdoption() {
  const getAvailableSlots = async (date: string) => {
    state.loading = true
    try {
      const res = await fetch(`${BASE_URL}/visit-slots/available?date=${date}`)
      if (!res.ok) throw new Error('Failed to fetch slots')
      state.availableSlots = await res.json()
      return state.availableSlots
    } finally {
      state.loading = false
    }
  }

  const createRequest = async (data: { animal_id: string, slot_id: string, date: string }) => {
    state.loading = true
    try {
      const res = await fetch(`${BASE_URL}/adoption-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.token}`
        },
        body: JSON.stringify(data)
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to create request')
      }

      return await res.json()
    } finally {
      state.loading = false
    }
  }

  const getMyRequests = async () => {
    state.loading = true
    try {
      const res = await fetch(`${BASE_URL}/adoption-requests/my`, {
        headers: {
          'Authorization': `Bearer ${authState.token}`
        }
      })
      if (!res.ok) throw new Error('Failed to fetch requests')
      state.myRequests = await res.json()
      return state.myRequests
    } finally {
      state.loading = false
    }
  }

  const listAllRequests = async (params: any = {}) => {
    state.loading = true
    try {
      const query = new URLSearchParams(params).toString()
      const res = await fetch(`${BASE_URL}/adoption-requests?${query}`, {
        headers: {
          'Authorization': `Bearer ${authState.token}`
        }
      })
      if (!res.ok) throw new Error('Failed to fetch requests')
      return await res.json()
    } finally {
      state.loading = false
    }
  }

  const updateRequestStatus = async (id: string, status: string, notes?: string) => {
    const res = await fetch(`${BASE_URL}/adoption-requests/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authState.token}`
      },
      body: JSON.stringify({ status, notes })
    })
    if (!res.ok) throw new Error('Failed to update request status')
    return await res.json()
  }

  const updateBookingStatus = async (bookingId: string, status: string) => {
    const res = await fetch(`${BASE_URL}/adoption-requests/bookings/${bookingId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authState.token}`
      },
      body: JSON.stringify({ status })
    })
    if (!res.ok) throw new Error('Failed to update booking status')
    return await res.json()
  }

  const cancelRequest = async (id: string) => {
    const res = await fetch(`${BASE_URL}/adoption-requests/${id}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authState.token}`
      }
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Failed to cancel request')
    }
    return await res.json()
  }

  const getAdopterProfile = async (id: string) => {
    state.loading = true
    try {
      const res = await fetch(`${BASE_URL}/adopters/${id}`, {
        headers: {
          'Authorization': `Bearer ${authState.token}`
        }
      })
      if (!res.ok) throw new Error('Failed to fetch adopter profile')
      const result = await res.json()
      return result.data
    } finally {
      state.loading = false
    }
  }

  return {
    state: readonly(state),
    getAvailableSlots,
    createRequest,
    getMyRequests,
    listAllRequests,
    updateRequestStatus,
    updateBookingStatus,
    cancelRequest,
    getAdopterProfile
  }
}
