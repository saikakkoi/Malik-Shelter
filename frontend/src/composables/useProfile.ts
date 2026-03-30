import { ref } from 'vue'
import { useAuth } from './useAuth'

export function useProfile() {
  const { state } = useAuth()
  const profile = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchProfile = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(import.meta.env.VITE_API_BASE_URL + '/me/profile', {
        headers: {
          'Authorization': `Bearer ${state.token}`
        }
      })
      if (!res.ok) {
        if (res.status === 404) {
          profile.value = null
          return
        }
        throw new Error('Failed to fetch profile')
      }
      const data = await res.json()
      profile.value = data.data
      return data.data
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  const updateProfile = async (data: any) => {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(import.meta.env.VITE_API_BASE_URL + '/me/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`
        },
        body: JSON.stringify(data)
      })
      if (!res.ok) throw new Error('Failed to update profile')
      const result = await res.json()
      profile.value = result.data
      return result.data
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  const uploadPhoto = async (file: File, description?: string) => {
    loading.value = true
    error.value = null
    try {
      const formData = new FormData()
      formData.append('photo', file)
      if (description) formData.append('description', description)

      const res = await fetch(import.meta.env.VITE_API_BASE_URL + '/me/profile/photos', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${state.token}`
        },
        body: formData
      })
      if (!res.ok) throw new Error('Failed to upload photo')
      const result = await res.json()
      // Refresh profile to get updated photos and meta
      await fetchProfile()
      return result.data
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  const deletePhoto = async (photoId: string) => {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(import.meta.env.VITE_API_BASE_URL + `/me/profile/photos/${photoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${state.token}`
        }
      })
      if (!res.ok) throw new Error('Failed to delete photo')
      // Refresh profile
      await fetchProfile()
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    uploadPhoto,
    deletePhoto
  }
}
