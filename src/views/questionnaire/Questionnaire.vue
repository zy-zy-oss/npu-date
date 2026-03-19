<template>
  <div class="questionnaire-page">
    <!-- 头部 -->
    <Header :currentIndex="currentIndex" :totalCount="questions.length" />

    <!-- 问卷内容 -->
    <div class="content-wrapper">
      <!-- 问卷完成后的邮箱输入界面 -->
      <EmailVerify v-if="questionnaireDone" />

      <!-- 问卷问题卡片 -->
      <BaseInfoCard v-if="currentQuestion" :question="currentQuestion" :modelValue="answers[currentQuestion.key]"
        @update:modelValue="handleAnswerUpdate" @answer="autoNextOnSingleChoice" />

      <div v-if="loading" class="loading-state">加载中...</div>
    </div>

    <!-- 按钮区域 -->
    <div class="button-area" v-if="!questionnaireDone">
      <button v-if="currentIndex > 0" class="nav-btn prev-btn" @click="prevQuestion" title="上一题">
        <i class="fas fa-chevron-left"></i>
      </button>
      <button v-if="currentIndex < questions.length - 1" class="nav-btn next-btn" @click="nextQuestion"
        :disabled="!canNext" title="下一题">
        <i class="fas fa-chevron-right"></i>
      </button>
      <button v-if="currentIndex === questions.length - 1" class="nav-btn complete-btn" @click="completeQuestionnaire"
        :disabled="!canNext" title="完成问卷">
        完成
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/store/user'
import { getQuestionnaire } from '@/api'
import Header from './components/Header.vue'
import EmailVerify from './components/EmailVerify.vue'
import BaseInfoCard from './components/BaseInfoCard.vue'
const userStore = useUserStore()
const loading = ref(true)
const questions = ref([])
const currentIndex = ref(0)
const answers = ref({})
const questionnaireDone = ref(false) // 问卷是否已完成
onMounted(async () => {
  try {
    const res = await getQuestionnaire()
    questions.value = res.data.questions

    // 初始化答案
    questions.value.forEach(q => {
      if (q.type === 'checkbox') {
        answers.value[q.key] = []
      } else if (q.type === 'slider') {
        answers.value[q.key] = q.defaultValue || q.min
      } else {
        answers.value[q.key] = ''
      }
    })

    // 如果之前有保存的问卷，加载它
    if (userStore.questionnaire) {
      answers.value = { ...answers.value, ...userStore.questionnaire }
    }
  } catch (error) {
    console.error('加载问卷失败', error)
  } finally {
    loading.value = false
  }
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
  return !!answer
})


const nextQuestion = () => {
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++
  }
}

const prevQuestion = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

// 处理答案更新
const handleAnswerUpdate = (value) => {
  answers.value[currentQuestion.value.key] = value
}

// 单选自动跳转到下一题
const autoNextOnSingleChoice = () => {
  // 延迟100ms后跳转，提供用户反馈
  setTimeout(() => {
    nextQuestion()
  }, 100)
}

// 完成问卷，进入邮箱验证阶段
const completeQuestionnaire = () => {
  // 校验所有必填项
  const allAnswered = questions.value
    .filter(q => q.required)
    .every(q => {
      const answer = answers.value[q.key]
      if (q.type === 'checkbox') {
        return answer && answer.length > 0
      }
      return !!answer
    })

  if (!allAnswered) {
    alert('请先完成所有必填项')
    return
  }

  // 问卷校验通过，切换到邮箱输入界面
  questionnaireDone.value = true
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
  padding: 32px 20px 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  overflow-y: auto;
  background: #fff;
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

/* 按钮区域 */
.button-area {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background: #fff;
  border-top: 1px solid #e8e8e8;
  padding: 12px 16px;
  display: flex;
  gap: 10px;
  justify-content: center;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.04);

  .nav-btn {
    height: 36px;
    width: 36px;
    padding: 0;
    font-size: 16px;
    font-weight: 400;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    cursor: pointer;
    background: #fff;
    color: #666;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0;
    min-width: 36px;

    &:hover:not(:disabled) {
      background: #f5f5f5;
      color: #333;
      border-color: #ccc;
    }

    &:active:not(:disabled) {
      background: #e8e8e8;
    }

    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    &.complete-btn {
      width: auto;
      padding: 0 20px;
      background: #333;
      color: #fff;
      font-weight: 500;
      min-width: auto;
      border-color: #333;

      &:hover:not(:disabled) {
        background: #1a1a1a;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        border-color: #1a1a1a;
      }

      &:active:not(:disabled) {
        background: #000;
      }
    }
  }
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

  .email-verify-card {
    padding: 20px;
  }

  .button-area {
    flex-direction: row;
    gap: 8px;

    .nav-btn {
      width: 36px;
      height: 36px;
      min-width: 36px;

      &.complete-btn {
        width: auto;
        padding: 0 16px;
      }
    }
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

  .button-area {
    padding: 10px 12px;
    gap: 8px;

    .nav-btn {
      width: 36px;
      height: 36px;
      padding: 0;
      min-width: 36px;
      font-size: 14px;

      &.complete-btn {
        width: auto;
        padding: 0 16px;
      }
    }
  }
}
</style>