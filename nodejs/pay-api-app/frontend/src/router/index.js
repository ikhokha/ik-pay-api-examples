import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/payment/success',
      name: 'success',
      component: () => import('../views/SuccessView.vue')
    },
    {
      path: '/payment/failure',
      name: 'failure',
      component: () => import('../views/DeclineView.vue')
    },
    {
      path: '/payment/history',
      name: 'history',
      component: () => import('../views/HistoryView.vue')
    }
  ]
})

export default router
