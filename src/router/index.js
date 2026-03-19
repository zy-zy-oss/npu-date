import { createRouter, createWebHistory } from 'vue-router'

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
    component: () => import('@/views/Questionnaire.vue'),
    meta: { title: '匹配问卷' }
  },
  {
    path: '/crush',
    name: 'Crush',
    component: () => import('@/views/Crush.vue'),
    meta: { title: '心动标记' }
  },
  {
    path: '/questionnaire-complete',
    name: 'QuestionnaireComplete',
    component: () => import('@/views/QuestionnaireComplete.vue'),
    meta: { title: '问卷完成' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router