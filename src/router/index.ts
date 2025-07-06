import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
		// Eagar loaded routes (exist in initial JS bundle)
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
		// Lazy loaded routes 
    {
      path: '/canvas-demo',
      name: 'canvas-demo',
      component: () => import('@/views/CanvasDemoView.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue')
    }
  ]
})

export default router 