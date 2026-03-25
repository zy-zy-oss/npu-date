<template>
  <div class="questionnaire-page">
    <!-- 头部 -->
    <Header :currentIndex="currentIndex" :totalCount="filteredQuestions.length" :title="pageTitle" />

    <!-- 问卷内容 -->
    <div class="content-wrapper">
      <!-- 问卷完成后的邮箱输入界面 -->
      <EmailVerify v-if="questionnaireDone" :questionnaireType="props.type" />

      <!-- 问卷问题卡片 -->
      <div v-if="!questionnaireDone && currentQuestion" class="question-card-container">
        <BaseInfoCard :question="currentQuestion" :modelValue="answers[currentQuestion.key]"
          @update:modelValue="handleAnswerUpdate" @answer="autoNextOnSingleChoice" />
        
        <!-- 按钮区域 -->
        <NavButtons
          :is-first="currentIndex === 0"
          :is-last="currentIndex === filteredQuestions.length - 1"
          :prev-disabled="false"
          :next-disabled="!canNext"
          @prev="prevQuestion"
          @next="nextQuestion"
          @complete="completeQuestionnaire"
        />
      </div>

      <div v-if="loading" class="loading-state">加载中...</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { getSubQuestionnaire, submitQuestionnaire } from '@/api'
import Header from './components/Header.vue'
import EmailVerify from './components/EmailVerify.vue'
import BaseInfoCard from './components/BaseInfoCard.vue'
import NavButtons from './components/NavButtons.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const props = defineProps({
  type: {
    type: String,
    required: true
  }
})

const loading = ref(true)
const questions = ref([])
const currentIndex = ref(0)
const answers = ref({})
const questionnaireDone = ref(false)

const pageTitle = computed(() => {
  return props.type === 'date' ? '约会问卷' : '搭子问卷'
})

onMounted(async () => {
  // 验证类型是否有效
  if (!['date', 'buddy'].includes(props.type)) {
    router.replace('/questionnaire')
    return
  }

  try {
    const res = await getSubQuestionnaire(props.type)
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

    // 恢复已保存的答案
    const savedAnswers = props.type === 'date' ? userStore.subQuestionnaire_date : userStore.subQuestionnaire_buddy
    if (savedAnswers) {
      answers.value = { ...answers.value, ...savedAnswers }
    }
  } catch (error) {
    console.error('加载问卷失败', error)
  } finally {
    loading.value = false
  }

  window.addEventListener('keydown', handleKeyDown)
})

const handleKeyDown = (event) => {
  if (questionnaireDone.value || loading.value || !currentQuestion.value) {
    return
  }

  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    prevQuestion()
  } else if (event.key === 'ArrowRight') {
    event.preventDefault()
    if (canNext.value) {
      if (currentIndex.value === questions.value.length - 1) {
        completeQuestionnaire()
      } else {
        nextQuestion()
      }
    }
  }
}

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

const currentQuestion = computed(() => {
  return filteredQuestions.value[currentIndex.value]
})

const filteredQuestions = computed(() => {
  return questions.value.filter(q => {
    // 检查是否有依赖关系
    if (!q.dependencies) {
      return true
    }
    
    // 检查所有依赖条件
    for (const [key, values] of Object.entries(q.dependencies)) {
      const answer = answers.value[key]
      if (!answer) {
        return false
      }
      
      // 如果是数组类型的答案（如checkbox），检查是否包含任一依赖值
      if (Array.isArray(answer)) {
        if (!answer.some(a => values.includes(a))) {
          return false
        }
      } 
      // 如果是单个值（如radio、select），检查是否等于依赖值
      else {
        if (!values.includes(answer)) {
          return false
        }
      }
    }
    
    return true
  })
})

const canNext = computed(() => {
  const q = currentQuestion.value
  if (!q || !q.required) return true

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
  if (currentIndex.value < filteredQuestions.value.length - 1) {
    currentIndex.value++
  }
}

const prevQuestion = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  } else {
    // 第一题时返回基础问卷
    router.push('/questionnaire')
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
  const allAnswered = filteredQuestions.value
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

  // 保存答案到store
  userStore.setSubQuestionnaire(props.type, { ...answers.value })

  // 提交问卷
  try {
    await submitQuestionnaire({
      type: props.type,
      answers: answers.value
    })
    // 显示邮箱验证界面
    questionnaireDone.value = true
  } catch (error) {
    console.error('提交问卷失败', error)
    alert('提交失败，请重试')
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

/* 内容容器 */
.content-wrapper {
  position: relative;
  z-index: 10;
  flex: 1;
  padding: 32px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 问题卡片容器 */
.question-card-container {
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 加载状态 */
.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #666;
  font-size: 16px;
}

/* 响应式适配 */
@media (max-width: 640px) {
  .content-wrapper {
    padding: 24px 16px;
  }
}
</style>
