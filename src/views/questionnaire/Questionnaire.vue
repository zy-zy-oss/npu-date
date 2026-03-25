<template>
  <div class="questionnaire-page">
    <!-- 头部 -->
    <Header :currentIndex="currentIndex" :totalCount="questions.length" />

    <!-- 问卷内容 -->
    <div class="content-wrapper">
      <!-- 问卷完成后的邮箱输入界面 -->
      <EmailVerify v-if="questionnaireDone" :questionnaireType="'base'" />

      <!-- 问卷问题卡片 -->
      <div v-if="!questionnaireDone && currentQuestion" class="question-card-container">
        <BaseInfoCard :question="currentQuestion" :modelValue="answers[currentQuestion.key]"
          @update:modelValue="handleAnswerUpdate" @answer="autoNextOnSingleChoice" />
        
        <!-- 按钮区域 -->
        <NavButtons
          :is-first="currentIndex === 0"
          :is-last="false"
          :prev-disabled="currentIndex === 0"
          :next-disabled="!canNext"
          @prev="prevQuestion"
          @next="handleNextOrComplete"
          @complete="completeQuestionnaire"
        />
      </div>

      <div v-if="loading" class="loading-state">加载中...</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { getQuestionnaire, submitQuestionnaire } from '@/api'

const router = useRouter()
import Header from './components/Header.vue'
import EmailVerify from './components/EmailVerify.vue'
import BaseInfoCard from './components/BaseInfoCard.vue'
import NavButtons from './components/NavButtons.vue'
const userStore = useUserStore()
const loading = ref(true)
const questions = ref([])
const currentIndex = ref(0)
const answers = ref({})
const questionnaireDone = ref(false)

onMounted(async () => {
  try {
    const res = await getQuestionnaire()
    questions.value = res.data.questions

    questions.value.forEach(q => {
      if (q.type === 'checkbox') {
        answers.value[q.key] = []
      } else if (q.type === 'slider') {
        answers.value[q.key] = q.defaultValue || q.min
      } else if (q.type === 'range') {
        answers.value[q.key] = q.defaultValue || null
      } else if (q.type === 'region') {
        answers.value[q.key] = { province: '', city: '' }
      } else if (q.type === 'date' || q.type === 'datetime') {
        answers.value[q.key] = ''
      } else {
        answers.value[q.key] = ''
      }
    })

    if (userStore.questionnaire) {
      answers.value = { ...answers.value, ...userStore.questionnaire }
    }
  } catch (error) {
    console.error('加载问卷失败', error)
  } finally {
    loading.value = false
  }
})

// 清理事件监听
onUnmounted(() => {
  // 组件卸载时清理资源
  questions.value = []
  answers.value = {}
})

const currentQuestion = computed(() => {
  return questions.value[currentIndex.value]
})

const canNext = computed(() => {
  const q = currentQuestion.value
  if (!q.required) return true

  const answer = answers.value[q.key]
  if (q.type === 'checkbox') {
    return answer && answer.length > 0
  }
  if (q.type === 'range') {
    return true
  }
  if (q.type === 'region') {
    return answer && answer.province && answer.city
  }
  if (q.type === 'date' || q.type === 'datetime') {
    return answer && answer !== ''
  }
  return !!answer
})


const nextQuestion = () => {
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++
  }
}

const handleNextOrComplete = () => {
  if (currentIndex.value < questions.value.length - 1) {
    nextQuestion()
  } else {
    completeQuestionnaire()
  }
}

const prevQuestion = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

const handleAnswerUpdate = (value) => {
  answers.value[currentQuestion.value.key] = value
}

const autoNextOnSingleChoice = () => {
  setTimeout(() => {
    nextQuestion()
  }, 100)
}

const completeQuestionnaire = async () => {
  const allAnswered = questions.value
    .filter(q => q.required)
    .every(q => {
      const answer = answers.value[q.key]
      if (q.type === 'checkbox') {
        return answer && answer.length > 0
      }
      if (q.type === 'range') {
        return true
      }
      if (q.type === 'region') {
        return answer && answer.province && answer.city
      }
      if (q.type === 'date' || q.type === 'datetime') {
        return answer && answer !== ''
      }
      return !!answer
    })

  if (!allAnswered) {
    alert('请先完成所有必填项')
    return
  }

  // 保存基础问卷答案
  userStore.questionnaire = { ...answers.value }

  // 根据用户选择的寻找目的跳转到对应子问卷
  const lookingFor = answers.value.lookingFor
  if (lookingFor === 'date' || lookingFor === 'buddy') {
    // 先提交基础问卷
    try {
      // 检查是否有已保存的邮箱
      const savedEmail = localStorage.getItem('userEmail')
      const submitData = {
        type: 'base',
        answers: answers.value
      }
      
      // 如果有保存的邮箱，添加到提交数据中
      if (savedEmail) {
        submitData.email = savedEmail
      }
      
      await submitQuestionnaire(submitData)
      // 跳转到对应的子问卷
      router.push(`/questionnaire/${lookingFor}`)
    } catch (error) {
      console.error('提交基础问卷失败', error)
      alert('提交失败，请重试')
    }
  } else {
    // 如果没有选择或选择无效，显示完成页面
    questionnaireDone.value = true
  }
}

</script>

<style lang="scss" scoped>
* {
  user-select: none;
  -webkit-user-select: none;
}

.questionnaire-page {
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fafafa;
  position: relative;
  overflow-x: hidden;
}

/* 背景 */
.page-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: inherit;
  z-index: 0;
  pointer-events: none;
}

/* 内容容器 */
.content-wrapper {
  position: relative;
  z-index: 10;
  flex: 1;
  padding: 32px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  overflow-y: auto;
  background: #fff;
}

/* 问卷卡片容器 */
.question-card-container {
  width: 100%;
  max-width: 580px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 加载状态 */
.loading-state {
  font-size: 20px;
  color: white;
  font-weight: 700;
  text-align: center;
  padding: 40px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

/* 动画 */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-bar {
    gap: 12px;

    .back-btn {
      flex-shrink: 0;
    }

    .page-title {
      font-size: 20px;
      flex: 1;
    }

    .progress-text {
      font-size: 12px;
      min-width: 50px;
      text-align: right;
    }
  }

  .content-wrapper {
    padding: 16px;
  }

  .question-card-container {
    gap: 16px;
  }

  .email-verify-card {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .header-bar {
    padding: 12px 16px;

    .page-title {
      font-size: 18px;
    }
  }

  .question-card,
  .email-verify-card {
    padding: 16px;
    border-radius: 12px;
  }

  .question-card-container {
    gap: 12px;
  }

  .email-verify-card {
    .complete-header {
      margin-bottom: 24px;

      h2 {
        font-size: 20px;
        margin-bottom: 4px;
      }

      p {
        font-size: 12px;
      }
    }
  }
}
</style>