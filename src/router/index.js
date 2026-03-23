import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/user'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { title: 'NPU Date' }
  },
  {
    path: '/questionnaire',
    name: 'Questionnaire',
    component: () => import('@/views/questionnaire/Questionnaire.vue'),
    meta: { title: '基础问卷' }
  },
  {
    path: '/questionnaire/:type',
    name: 'SubQuestionnaire',
    component: () => import('@/views/questionnaire/SubQuestionnaire.vue'),
    meta: { title: '详细问卷' },
    props: true
  },
  {
    path: '/questionnaire-complete',
    name: 'QuestionnaireComplete',
    component: () => import('@/views/QuestionnaireComplete.vue'),
    meta: { title: '问卷完成' }
  },
  {
    path: '/result',
    name: 'Result',
    component: () => import('@/views/Result.vue'),
    meta: { title: '我的匹配' },
    beforeEnter: (to, from, next) => {
      const userStore = useUserStore()
      if (!userStore.isLoggedIn) {
        next('/')
      } else {
        next()
      }
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router