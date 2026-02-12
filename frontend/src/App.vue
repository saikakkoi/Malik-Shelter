<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'
import Toast from '@/components/ui/Toast.vue'
import Dialog from '@/components/ui/Dialog.vue'

const { isAuthenticated, isStaff, logout } = useAuth()
const router = useRouter()

const handleLogout = () => {
  logout()
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen">
    <!-- Header -->
    <header class="bg-card shadow-soft py-4 px-6 relative z-10 flex items-center justify-between">
      <div class="flex flex-col">
        <router-link to="/" class="hover:opacity-80 transition-opacity">
          <h1 class="text-2xl text-accent inline-block">🐾 Malik Shelter</h1>
        </router-link>
        <p class="text-muted text-sm mt-[-4px]">Find your new best friend</p>
      </div>

      <div v-if="isAuthenticated()" class="flex items-center gap-4">
        <router-link v-if="isStaff()" to="/staff/inventory" class="text-sm font-bold text-muted hover:text-accent transition-colors">
          Inventory
        </router-link>
        <router-link v-if="isStaff()" to="/staff/adoption-requests" class="text-sm font-bold text-muted hover:text-accent transition-colors">
          Requests
        </router-link>
        <router-link v-if="isStaff()" to="/staff/visit-settings" class="text-sm font-bold text-muted hover:text-accent transition-colors">
          Settings
        </router-link>
        <router-link to="/profile" class="text-sm font-bold text-muted hover:text-accent transition-colors">
          Profile
        </router-link>
        <button @click="handleLogout" class="text-sm font-bold text-red-400 hover:text-red-500 transition-colors">
          Logout
        </button>
      </div>
      <div v-else class="flex items-center gap-4">
        <router-link to="/login" class="text-sm font-bold text-muted hover:text-accent font-medium px-4 py-2 rounded-xl transition-all">
          Login
        </router-link>
        <router-link to="/register" class="bg-primary text-white hover:bg-secondary px-6 py-2 rounded-xl font-bold transition-all shadow-md">
          Register
        </router-link>
      </div>
    </header>

    <router-view />
    <Toast />
    <Dialog />
  </div>
</template>
