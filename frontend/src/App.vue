<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'
import { useDarkMode } from '@/composables/useDarkMode'
import Toast from '@/components/ui/Toast.vue'
import Dialog from '@/components/ui/Dialog.vue'

const { isDark, toggle: toggleDark } = useDarkMode()

const { isAuthenticated, isStaff, logout, state } = useAuth()
const router = useRouter()
const userProfile = ref<any>(null)

const fetchUserProfile = async () => {
  if (!isAuthenticated()) return
  try {
    const res = await fetch(import.meta.env.VITE_API_BASE_URL + '/me/profile', {
      headers: {
        'Authorization': `Bearer ${state.token}`
      }
    })
    if (res.ok) {
      userProfile.value = await res.json()
    }
  } catch (err) {
    console.error('Failed to fetch user profile:', err)
  }
}

onMounted(() => {
  fetchUserProfile()
})

const userName = computed(() => {
  return userProfile.value?.full_name || state.user?.fullName || 'Profile'
})

watch(() => state.token, (newToken) => {
  if (newToken) {
    fetchUserProfile()
  } else {
    userProfile.value = null
  }
})

const handleLogout = () => {
  logout()
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen">
    <!-- Header (hidden on login/register pages) -->
    <header v-if="$route.path !== '/login' && $route.path !== '/register'"
      :class="isDark ? 'bg-[#1e1c18] border-b border-[#3a3730]' : 'bg-[#f5f0ea]'"
      class="py-4 px-8 relative z-10 flex items-center justify-between transition-colors duration-300">
      <router-link to="/" class="hover:opacity-80 transition-opacity">
        <span :class="isDark ? 'text-[#f0ece4]' : 'text-[#2d2a1e]'" class="text-2xl font-bold transition-colors duration-300">Pawfriends Shelter</span>
      </router-link>

      <div v-if="isAuthenticated()" class="flex items-center gap-4">
        <router-link v-if="isStaff()" to="/staff/dashboard"
          :class="isDark ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'"
          class="text-sm font-[family-name:var(--font-form)] transition-colors">
          Dashboard
        </router-link>
        <router-link v-if="isStaff()" to="/staff/inventory"
          :class="isDark ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'"
          class="text-sm font-[family-name:var(--font-form)] transition-colors">
          Inventory
        </router-link>
        <router-link v-if="isStaff()" to="/staff/adoption-requests"
          :class="isDark ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'"
          class="text-sm font-[family-name:var(--font-form)] transition-colors">
          Requests
        </router-link>
        <router-link v-if="isStaff()" to="/staff/visit-settings"
          :class="isDark ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'"
          class="text-sm font-[family-name:var(--font-form)] transition-colors">
          Settings
        </router-link>
        <router-link to="/profile"
          :class="isDark ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'"
          class="text-sm font-[family-name:var(--font-form)] transition-colors">
          {{ userName }}
        </router-link>
        <!-- Dark mode toggle -->
        <button @click="toggleDark"
          :class="isDark ? 'bg-[#3a3730] text-[#f0ece4] hover:bg-[#4a4740]' : 'bg-[#e8e2d9] text-[#2d2a1e] hover:bg-[#d8d2c9]'"
          class="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300"
          :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
          <!-- Sun icon (shown in dark mode) -->
          <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="4"/>
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
          </svg>
          <!-- Moon icon (shown in light mode) -->
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>
        <button @click="handleLogout"
          class="text-sm font-[family-name:var(--font-form)] text-red-400 hover:text-red-500 transition-colors">
          Logout
        </button>
      </div>
      <div v-else class="flex items-center gap-3">
        <!-- Dark mode toggle (unauthenticated) -->
        <button @click="toggleDark"
          :class="isDark ? 'bg-[#3a3730] text-[#f0ece4] hover:bg-[#4a4740]' : 'bg-[#e8e2d9] text-[#2d2a1e] hover:bg-[#d8d2c9]'"
          class="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300"
          :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
          <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="4"/>
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>
        <router-link to="/login"
          :class="isDark ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'"
          class="text-sm font-[family-name:var(--font-form)] px-4 py-2 transition-all">
          Login
        </router-link>
        <router-link to="/register"
          :class="isDark ? 'bg-[#f0ece4] text-[#1a1814]' : 'bg-[#2d2a1e] text-white'"
          class="text-sm font-[family-name:var(--font-form)] px-5 py-2 rounded-full hover:opacity-90 transition-all font-semibold">
          Register
        </router-link>
      </div>
    </header>

    <router-view />
    <Toast />
    <Dialog />
  </div>
</template>
