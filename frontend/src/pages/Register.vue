<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const { register } = useAuth()
const router = useRouter()

const fullName = ref('')
const email = ref('')
const password = ref('')
const error = ref<string | null>(null)
const loading = ref(false)

async function handleSubmit() {
  loading.value = true
  error.value = null
  try {
    await register(email.value, password.value, fullName.value)
    router.push('/profile')
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center p-6">
    <div class="bg-white p-8 rounded-[30px] shadow-soft w-full max-w-md space-y-8">
      <div class="text-center">
        <h1 class="text-3xl text-accent mb-2">Create Account</h1>
        <p class="text-muted">Join Malik Shelter to start your adoption journey</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div v-if="error" class="bg-red-50 text-red-500 p-4 rounded-xl text-sm border border-red-100 animate-in fade-in slide-in-from-top-2">
          {{ error }}
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-muted mb-1 ml-1">Full Name</label>
            <input 
              v-model="fullName" 
              type="text" 
              required
              placeholder="John Doe"
              class="w-full px-4 py-3 rounded-xl border border-primary/20 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-muted mb-1 ml-1">Email Address</label>
            <input 
              v-model="email" 
              type="email" 
              required
              placeholder="john@example.com"
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
          {{ loading ? 'Creating account...' : 'Create Account' }}
        </button>

        <p class="text-center text-sm text-muted">
          Already have an account? 
          <router-link to="/login" class="text-accent font-bold hover:underline">Sign In</router-link>
        </p>
      </form>
    </div>
  </div>
</template>
