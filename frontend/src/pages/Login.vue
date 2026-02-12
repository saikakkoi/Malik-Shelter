<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useDialog } from '@/composables/useDialog'

const { login, state: authState } = useAuth()
const { error: errorDialog } = useDialog()
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
  <div class="min-h-[80vh] flex items-center justify-center p-6">
    <div class="bg-white p-8 rounded-[30px] shadow-soft w-full max-w-md space-y-8">
      <div class="text-center">
        <h1 class="text-3xl text-accent mb-2">Welcome Back</h1>
        <p class="text-muted">Sign in to your Malik Shelter account</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-muted mb-1 ml-1">Email Address</label>
            <input 
              v-model="email" 
              type="email" 
              required
              placeholder="staff@malikshelter.com"
              class="w-full px-4 py-3 rounded-xl border border-primary/20 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-muted mb-1 ml-1">Password</label>
            <input 
              v-model="password" 
              type="password" 
              required
              placeholder="••••••••"
              class="w-full px-4 py-3 rounded-xl border border-primary/20 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
            />
          </div>
        </div>

        <button 
          type="submit" 
          :disabled="loading"
          class="btn-primary w-full py-4 text-lg shadow-lg hover:-translate-y-1 transition-transform disabled:opacity-50 disabled:translate-y-0"
        >
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>

        <p class="text-center text-sm text-muted">
          Don't have an account? 
          <router-link to="/register" class="text-accent font-bold hover:underline">Register</router-link>
        </p>
      </form>
    </div>
  </div>
</template>
