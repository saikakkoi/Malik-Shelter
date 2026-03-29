<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useDialog } from '@/composables/useDialog'
import { useDarkMode } from '@/composables/useDarkMode'

const { login, state: authState } = useAuth()
const { error: errorDialog } = useDialog()
const { isDark, toggle: toggleDark } = useDarkMode()
const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)

async function handleSubmit() {
  loading.value = true
  try {
    await login(email.value, password.value)
    if (authState.user?.role === 'STAFF' || authState.user?.role === 'ADMIN') {
      router.push('/staff/inventory')
    } else {
      router.push('/profile')
    }
  } catch (e: any) {
    errorDialog(e.message)
  } finally {
    loading.value = false
  }
}


</script>

<template>
  <div class="min-h-screen flex">
    <!-- Left Panel - Background Image -->
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center"
      style="background-image: url('/login-illustration.png'); background-size: cover; background-position: center;">
      <!-- Optional: Add overlay for better text readability -->
      <div class="absolute inset-0 bg-gradient-to-br from-[#E8DDD0]/30 to-[#D4C4B0]/30"></div>

      <div class="relative z-10 max-w-md text-center">
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 bg-[#8B7355]/30 backdrop-blur-sm px-4 py-2 rounded-full mb-8">
          <span class="text-white">🐾</span>
          <span class="text-white text-sm font-medium">PETADOPT COMMUNITY</span>
        </div>

        <!-- Heading -->
        <h1 class="text-5xl font-bold text-[#2D2D2D] mb-6 leading-tight">
          Find your new<br>
          <span class="text-[#CF9963]">best friend</span> today.
        </h1>

        <!-- Description -->
        <p class="text-[#5D5D5D] text-lg leading-relaxed">
          Every pet deserves a loving home. Join our community of over 50,000 successful adoptions and find your perfect
          companion.
        </p>
      </div>
    </div>

    <!-- Right Panel - Login Form -->
    <div class="w-full lg:w-1/2 bg-[#FDF8E8] dark:bg-[#1a1814] flex items-center justify-center p-8 relative transition-colors duration-300">
      <!-- Theme Toggle -->
      <button
        class="absolute top-8 right-8 lg:top-auto lg:bottom-8 w-12 h-12 rounded-full bg-white dark:bg-[#252320] shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        @click="toggleDark">
        <svg v-if="isDark" class="w-6 h-6 text-[#CF9963]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="4"/>
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
        </svg>
        <svg v-else class="w-6 h-6 text-[#CF9963]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      </button>

      <div class="w-full max-w-md space-y-8">
        <!-- Logo/Icon -->
        <div class="flex justify-center mb-8">
          <div
            class="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#CF9963] to-[#B8824F] flex items-center justify-center shadow-lg text-3xl">
            🐾
          </div>
        </div>

        <!-- Header -->
        <div class="text-center">
          <h1 class="text-4xl font-bold text-[#2D2D2D] dark:text-[#f0ece4] transition-colors mb-2">Welcome Back! Pawfriends!</h1>
          <p class="text-[#B8936D] dark:text-[#a0998e] transition-colors">Log in to manage your adoptions</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Email Field -->
          <div>
            <label class="block text-sm font-medium text-[#5D5D5D] dark:text-[#a0998e] transition-colors mb-2">Email Address</label>
            <div class="relative">
              <div class="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8936D] dark:text-[#8a9870]">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input v-model="email" type="email" required placeholder="name@example.com"
                class="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-[#252320] border-2 border-transparent focus:border-[#CF9963] dark:focus:border-[#8a9870] focus:ring-0 outline-none transition-all text-[#2D2D2D] dark:text-[#f0ece4] placeholder:text-[#B8936D]/50 dark:placeholder:text-[#a0998e]/50" />
            </div>
          </div>

          <!-- Password Field -->
          <div>
            <label class="block text-sm font-medium text-[#5D5D5D] dark:text-[#a0998e] transition-colors mb-2">Password</label>
            <div class="relative">
              <div class="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8936D] dark:text-[#8a9870]">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input v-model="password" type="password" required placeholder="••••••••"
                class="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-[#252320] border-2 border-transparent focus:border-[#CF9963] dark:focus:border-[#8a9870] focus:ring-0 outline-none transition-all text-[#2D2D2D] dark:text-[#f0ece4] placeholder:text-[#B8936D]/50 dark:placeholder:text-[#a0998e]/50" />
            </div>
          </div>

          <!-- Login Button -->
          <button type="submit" :disabled="loading"
            class="w-full bg-gradient-to-r from-[#CF9963] to-[#B8824F] text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-2">
            <span>{{ loading ? 'Signing in...' : 'Login to Account' }}</span>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>

          <!-- Register Link -->
          <p class="text-center text-sm text-[#5D5D5D] dark:text-[#a0998e] transition-colors">
            Don't have an account?
            <router-link to="/register" class="text-[#CF9963] dark:text-[#c47d40] font-bold hover:underline">Create an account</router-link>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>
