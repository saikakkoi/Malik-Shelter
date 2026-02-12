import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import Search from '@/pages/Search.vue'
import PetDetail from '@/pages/PetDetail.vue'
import Login from '@/pages/Login.vue'
import Register from '@/pages/Register.vue'

const routes = [
  {
    path: '/',
    name: 'search',
    component: Search
  },
  {
    path: '/animal/:id',
    name: 'pet-detail',
    component: PetDetail
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/staff/inventory',
    name: 'staff-inventory',
    component: () => import('@/pages/staff/Inventory.vue'),
    meta: { requiresAuth: true, role: 'STAFF' }
  },
  {
    path: '/staff/inventory/new',
    name: 'staff-animal-create',
    component: () => import('@/pages/staff/AnimalForm.vue'),
    meta: { requiresAuth: true, role: 'STAFF' }
  },
  {
    path: '/staff/inventory/edit/:id',
    name: 'staff-animal-edit',
    component: () => import('@/pages/staff/AnimalForm.vue'),
    meta: { requiresAuth: true, role: 'STAFF' },
    props: true
  },
  {
    path: '/staff/adoption-requests',
    name: 'staff-adoption-requests',
    component: () => import('@/pages/staff/AdoptionRequests.vue'),
    meta: { requiresAuth: true, role: 'STAFF' }
  },
  {
    path: '/staff/visit-settings',
    name: 'staff-visit-settings',
    component: () => import('@/pages/staff/VisitSettings.vue'),
    meta: { requiresAuth: true, role: 'STAFF' }
  },
  {
    path: '/profile',
    name: 'profile-dashboard',
    component: () => import('@/pages/profile/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile/wizard',
    name: 'profile-wizard',
    component: () => import('@/pages/profile/Wizard.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, _, next) => {
  const { isAuthenticated, isStaff } = useAuth()

  if (to.meta.requiresAuth) {
    if (!isAuthenticated()) {
      return next('/login')
    }
    if (to.meta.role === 'STAFF' && !isStaff()) {
      return next('/')
    }
  }

  next()
})

export default router
