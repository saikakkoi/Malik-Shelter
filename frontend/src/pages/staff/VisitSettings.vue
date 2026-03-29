<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Calendar, Clock, Plus, Trash2, Zap, ArrowLeft, Loader2, Users } from 'lucide-vue-next'
import { useVisitSlots } from '@/composables/useVisitSlots'
import { useDialog } from '@/composables/useDialog'
import VisitTemplateModal from '@/components/staff/VisitTemplateModal.vue'

const { state, listTemplates, createTemplate, deleteTemplate, generateSlots } = useVisitSlots()
const dialog = useDialog()

const showModal = ref(false)

onMounted(() => {
  listTemplates()
})

const handleCreate = async (data: any) => {
  try {
    await createTemplate(data)
    dialog.success('Template created successfully!')
  } catch (e: any) {
    dialog.error(e.message)
  }
}

const handleDelete = (id: string) => {
  dialog.show({
    title: 'Delete Template?',
    message: 'Are you sure you want to delete this visit template? This will not affect already generated slots.',
    type: 'error',
    onConfirm: async () => {
      try {
        await deleteTemplate(id)
        dialog.success('Template deleted successfully.')
      } catch (e: any) {
        dialog.error(e.message)
      }
    }
  })
}

const handleGenerate = async () => {
  dialog.show({
    title: 'Generate Slots?',
    message: 'This will generate visit slots for the next 7 days based on your active templates. Adopters will be able to start booking immediately.',
    type: 'info',
    confirmText: 'Generate Now 🚀',
    lottie: '/black-cat.lottie',
    onConfirm: async () => {
      try {
        const result = await generateSlots(7)
        dialog.success(`Generation complete! Created: ${result.created}, Skipped: ${result.skipped}`)
      } catch (e: any) {
        dialog.error(e.message)
      }
    }
  })
}

const formatTime = (time: string) => {
  return time.split(':').slice(0, 2).join(':')
}
</script>

<template>
  <div class="min-h-screen bg-background pb-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <router-link to="/staff/adoption-requests" class="inline-flex items-center gap-2 text-muted hover:text-primary transition-colors mb-4 font-bold">
            <ArrowLeft class="w-4 h-4" /> Back to Requests
          </router-link>
          <h1 class="text-5xl font-black text-dark tracking-tight">Visit Settings</h1>
          <p class="text-muted text-lg mt-2 font-medium">Manage recurring visit slots and generate daily schedules.</p>
        </div>
        
        <div class="flex items-center gap-4">
          <button 
            @click="handleGenerate"
            :disabled="state.loading"
            class="bg-accent/10 text-accent font-black px-6 py-4 rounded-2xl hover:bg-accent hover:text-white transition-all flex items-center gap-2"
          >
            <Zap class="w-5 h-5" /> Generate Slots
          </button>
          <button 
            @click="showModal = true"
            class="bg-primary text-white font-black px-6 py-4 rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-1 active:translate-y-0 transition-all flex items-center gap-2"
          >
            <Plus class="w-5 h-5" /> Add Template
          </button>
        </div>
      </div>

      <!-- Content -->
      <div v-if="state.loading && !state.templates.length" class="flex justify-center py-20">
        <Loader2 class="w-12 h-12 text-primary animate-spin" />
      </div>

      <div v-else-if="!state.templates.length" class="bg-[var(--color-surface,white)] rounded-[40px] p-20 text-center shadow-soft border border-primary/5">
        <div class="bg-primary/5 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
          <Calendar class="w-12 h-12 text-muted" />
        </div>
        <h3 class="text-3xl font-black text-dark mb-4">No templates yet</h3>
        <p class="text-muted text-lg max-w-md mx-auto mb-10">Add recurring slot templates to start generating visit schedules for adopters.</p>
        <button 
          @click="showModal = true"
          class="bg-primary text-white font-black px-10 py-5 rounded-[24px] shadow-lg shadow-primary/20 hover:shadow-xl transition-all"
        >
          Create First Template
        </button>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="template in state.templates" 
          :key="template.id"
          class="bg-[var(--color-surface,white)] p-8 rounded-[40px] shadow-soft border border-primary/10 hover:shadow-lg transition-all relative group"
        >
          <div class="flex justify-between items-start mb-6">
            <div class="bg-accent/10 p-4 rounded-3xl">
              <Clock class="w-8 h-8 text-accent" />
            </div>
            <button 
              @click="handleDelete(template.id)"
              class="p-3 text-muted/40 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
            >
              <Trash2 class="w-5 h-5" />
            </button>
          </div>

          <div class="space-y-4">
            <h3 class="text-2xl font-black text-dark tracking-tight">
              {{ template.day_of_week === 'ALL' ? 'Daily Visit' : template.day_of_week }}
            </h3>
            
            <div class="flex items-center gap-3 text-muted font-bold">
              <Clock class="w-5 h-5 text-primary" />
              <span>{{ formatTime(template.start_time) }} - {{ formatTime(template.end_time) }}</span>
            </div>

            <div class="flex items-center gap-3 text-muted font-bold">
              <Users class="w-5 h-5 text-primary" />
              <span>Max Capacity: {{ template.capacity_per_slot }}</span>
            </div>

            <div class="pt-4 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span class="text-sm font-bold text-emerald-600 uppercase tracking-wider">Active Template</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <VisitTemplateModal 
      :show="showModal" 
      @close="showModal = false"
      @submit="handleCreate"
    />
  </div>
</template>
