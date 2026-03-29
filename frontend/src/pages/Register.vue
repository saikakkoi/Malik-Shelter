<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useDialog } from '@/composables/useDialog'
import { useDarkMode } from '@/composables/useDarkMode'

const { register } = useAuth()
const { error: errorDialog } = useDialog()
const { isDark, toggle: toggleDark } = useDarkMode()
const router = useRouter()

const fullName = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)

async function handleSubmit() {
  loading.value = true
  try {
    await register(email.value, password.value, fullName.value)
    router.push('/profile')
  } catch (e: any) {
    errorDialog(e.message)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex bg-[#F5E6E0] dark:bg-[#1a1814] transition-colors duration-300">
    <!-- Left Panel - Decorative -->
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12">
      <!-- Decorative Background Elements -->
      <div class="absolute top-20 left-20 w-24 h-24 opacity-20">
        <svg viewBox="0 0 100 100" fill="#E8B4A8">
          <ellipse cx="30" cy="25" rx="15" ry="20" />
          <ellipse cx="70" cy="25" rx="15" ry="20" />
          <ellipse cx="30" cy="60" rx="12" ry="15" />
          <ellipse cx="70" cy="60" rx="12" ry="15" />
          <ellipse cx="50" cy="75" rx="25" ry="20" />
        </svg>
      </div>

      <div class="absolute top-40 right-32 w-16 h-16 opacity-15">
        <svg viewBox="0 0 100 100" fill="#C9A896">
          <circle cx="50" cy="50" r="45" />
        </svg>
      </div>

      <div class="absolute bottom-32 left-32 w-20 h-20 opacity-15">
        <svg viewBox="0 0 100 100" fill="#E8B4A8">
          <circle cx="50" cy="50" r="40" stroke="#C9A896" stroke-width="3" fill="none" />
          <line x1="20" y1="50" x2="80" y2="50" stroke="#C9A896" stroke-width="3" />
        </svg>
      </div>

      <!-- Main Content -->
      <div class="relative z-10 max-w-md">
        <!-- Logo Icon -->
        <div class="mb-8 flex justify-start">
          <div class="w-16 h-16 rounded-full bg-[#B8A896] flex items-center justify-center shadow-lg text-3xl">
            🐾
          </div>
        </div>

        <!-- Heading -->
        <h1 class="text-5xl font-bold text-[#2D2D2D] dark:text-white transition-colors mb-6 leading-tight">
          Join our <span class="text-[#E8B4A8]">furry</span> family
        </h1>

        <!-- Description -->
        <p class="text-[#5D5D5D] dark:text-gray-300 transition-colors text-lg leading-relaxed mb-12">
          Start your journey to finding a new best friend and a companion for life.
        </p>

        <!-- Decorative Pet Icons -->
        <div class="flex items-center gap-6 mb-12">
          <div class="w-16 h-16 rounded-full bg-[#E8B4A8]/30 flex items-center justify-center text-3xl">
            🐈
          </div>
          <div class="w-12 h-12 rounded-full border-2 border-[#C9A896]/40 flex items-center justify-center text-2xl">
            🐶
          </div>
          <div class="w-14 h-14 rounded-full bg-[#B8A896]/20 flex items-center justify-center text-2xl">
            😽
          </div>
        </div>

        <!-- Trust Badges -->
        <div class="space-y-3">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-[#A8C9A8]/30 flex items-center justify-center flex-shrink-0">
              <svg class="w-4 h-4 text-[#6B8E6B]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
            </div>
            <span class="text-[#5D5D5D] font-medium">Trusted by 5,000+ Pet Parents</span>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-[#E8B4A8]/30 flex items-center justify-center flex-shrink-0">
              <svg class="w-4 h-4 text-[#C9A896]" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <span class="text-[#5D5D5D] font-medium">Vetted Shelters & Rescues</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Panel - Registration Form -->
    <div class="w-full lg:w-1/2 bg-white dark:bg-[#252320] transition-colors duration-300 flex items-center justify-center p-8 relative">
      <!-- Theme Toggle -->
      <button
        class="absolute top-8 right-8 lg:top-auto lg:bottom-8 w-12 h-12 rounded-full bg-[#F5E6E0] dark:bg-[#1a1814] shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        @click="toggleDark">
        <svg v-if="isDark" class="w-6 h-6 text-[#E8B4A8]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="4"/>
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
        </svg>
        <svg v-else class="w-6 h-6 text-[#E8B4A8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </button>

      <div class="w-full max-w-md space-y-8">
        <!-- Logo Icon (Mobile) -->
        <div class="flex justify-center mb-8 lg:hidden">
          <div class="w-16 h-16 rounded-full bg-[#B8A896] flex items-center justify-center shadow-lg text-3xl">
            🐾
          </div>
        </div>

        <!-- Header -->
        <div class="text-center">
          <h1 class="text-4xl font-bold text-[#2D2D2D] dark:text-[#f0ece4] transition-colors mb-2">Create your account</h1>
          <p class="text-[#B8936D] dark:text-[#a0998e] transition-colors">Please fill in your details to get started.</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Full Name Field -->
          <div>
            <label class="block text-sm font-medium text-[#5D5D5D] dark:text-[#a0998e] transition-colors mb-2">Full Name</label>
            <div class="relative">
              <div class="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8936D] dark:text-[#8a9870]">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input v-model="fullName" type="text" required placeholder="e.g. Jane Doe"
                class="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#F8F8F8] dark:bg-[#1e1c18] border-2 border-transparent focus:border-[#B8C9A8] dark:focus:border-[#8a9870] focus:bg-white dark:focus:bg-[#252320] focus:ring-0 outline-none transition-all text-[#2D2D2D] dark:text-[#f0ece4] placeholder:text-[#B8936D]/50 dark:placeholder:text-[#a0998e]/50" />
            </div>
          </div>

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
                class="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#F8F8F8] dark:bg-[#1e1c18] border-2 border-transparent focus:border-[#B8C9A8] dark:focus:border-[#8a9870] focus:bg-white dark:focus:bg-[#252320] focus:ring-0 outline-none transition-all text-[#2D2D2D] dark:text-[#f0ece4] placeholder:text-[#B8936D]/50 dark:placeholder:text-[#a0998e]/50" />
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
                class="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#F8F8F8] dark:bg-[#1e1c18] border-2 border-transparent focus:border-[#B8C9A8] dark:focus:border-[#8a9870] focus:bg-white dark:focus:bg-[#252320] focus:ring-0 outline-none transition-all text-[#2D2D2D] dark:text-[#f0ece4] placeholder:text-[#B8936D]/50 dark:placeholder:text-[#a0998e]/50" />
            </div>
            <p class="mt-2 text-xs text-[#B8936D] dark:text-[#a0998e]">Must be at least 8 characters long.</p>
          </div>

          <!-- Sign Up Button -->
          <button type="submit" :disabled="loading"
            class="w-full bg-[#B8C9A8] hover:bg-[#A8B998] text-[#2D2D2D] font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-2">
            <span>{{ loading ? 'Creating account...' : 'Sign Up' }}</span>
            <span class="text-lg">🐾</span>
          </button>

          <!-- Terms & Privacy -->
          <p class="text-center text-xs text-[#B8936D] dark:text-[#a0998e] transition-colors">
            By signing up, you agree to our <a href="#" class="text-[#E8B4A8] dark:text-[#a07872] hover:underline">Terms</a> and <a href="#"
              class="text-[#E8B4A8] dark:text-[#a07872] hover:underline">Privacy Policy</a>.
          </p>

          <!-- Login Link -->
          <p class="text-center text-sm text-[#5D5D5D] dark:text-[#a0998e] transition-colors">
            Already have an account?
            <router-link to="/login" class="text-[#E8B4A8] dark:text-[#a07872] font-bold hover:underline">Login</router-link>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>
