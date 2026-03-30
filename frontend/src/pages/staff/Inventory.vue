<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useDialog } from '@/composables/useDialog'
import InventoryTable from '@/components/staff/InventoryTable.vue'

const { state } = useAuth()
const dialog = useDialog()
const animals = ref([])
const loading = ref(true)
const error = ref<string | null>(null)

const API_BASE = import.meta.env.VITE_API_BASE_URL

async function fetchInventory() {
  loading.value = true
  try {
    const res = await fetch(`${API_BASE}/animals?status=all`, {
      headers: {
        'Authorization': `Bearer ${state.token}`
      }
    })
    if (!res.ok) throw new Error('Failed to fetch inventory')
    const data = await res.json()
    animals.value = data.items
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

const router = useRouter()

async function handleEdit(id: string) {
  router.push(`/staff/inventory/edit/${id}`)
}

async function handleArchive(id: string) {
  if (!confirm('Are you sure you want to archive this pet? It will be hidden from public search.')) return
  
  try {
    const res = await fetch(`${API_BASE}/animals/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${state.token}`
      }
    })
    if (!res.ok) throw new Error('Failed to archive pet')
    dialog.success('Pet archived successfully')
    await fetchInventory()
  } catch (e: any) {
    dialog.error(e.message)
  }
}

async function handleToggleStatus(animal: any) {
  const nextStatus = animal.status === 'AVAILABLE' ? 'PENDING' : 'AVAILABLE'
  
  try {
    const res = await fetch(`${API_BASE}/animals/${animal.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.token}`
      },
      body: JSON.stringify({ status: nextStatus })
    })
    if (!res.ok) throw new Error('Failed to update status')
    dialog.success(`Status updated to ${nextStatus}`)
    await fetchInventory()
  } catch (e: any) {
    dialog.error(e.message)
  }
}

onMounted(fetchInventory)
</script>

<template>
  <div class="max-w-6xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div class="flex-1">
        <h1 class="text-4xl text-accent">Pet Inventory</h1>
        <p class="text-muted text-lg">Manage profiles and adoption statuses</p>
      </div>

      <router-link 
        to="/staff/inventory/new"
        class="bg-accent text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-lg shadow-accent/20"
      >
        <span class="text-2xl">+</span>
        <span>Add Pet</span>
      </router-link>
      
      <div class="bg-primary/10 px-4 py-2 rounded-2xl flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold">
          {{ state.user?.fullName.charAt(0) }}
        </div>
        <div>
          <p class="text-sm font-bold text-dark">{{ state.user?.fullName }}</p>
          <p class="text-xs text-muted">{{ state.user?.role }}</p>
        </div>
      </div>
    </div>

    <div v-if="error" class="bg-red-50 text-red-500 p-6 rounded-3xl border border-red-100 flex items-center justify-between">
      <p>{{ error }}</p>
      <button @click="fetchInventory" class="btn-primary py-2 text-sm">Retry</button>
    </div>

    <div v-else>
      <div class="flex items-center gap-4 mb-6">
         <div class="flex-1 h-[2px] bg-primary/10"></div>
         <p class="text-sm text-muted font-bold">{{ animals.length }} Total Pets</p>
         <div class="flex-1 h-[2px] bg-primary/10"></div>
      </div>

      <InventoryTable 
        :animals="animals" 
        :loading="loading" 
        @archive="handleArchive"
        @toggle-status="handleToggleStatus"
        @edit="handleEdit"
      />
    </div>
  </div>
</template>
