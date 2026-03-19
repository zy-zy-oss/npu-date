<template>
  <div class="questionnaire-page">
    <!-- 头部 -->
    <div class="header">
      <div class="header-top">
        <button class="back-btn" @click="$router.back()" title="返回">
          <i class="fas fa-arrow-left"></i>
        </button>
        <div class="header-info">
          <h1 class="page-title">填写您的信息</h1>
          <div class="progress-info">{{ currentIndex + 1 }}/{{ questions.length }}</div>
        </div>
      </div>
      <div class="progress-bar-wrapper">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
      </div>
    </div>
    
    <!-- 问卷内容 -->
    <div class="content-wrapper">
      <div v-if="currentQuestion" class="question-card">
        <div class="question-meta">
          <span class="question-number">Q{{ currentQuestion.id }}</span>
          <span class="required-badge" v-if="currentQuestion.required">必填</span>
        </div>
        
        <h2 class="question-title">{{ currentQuestion.title }}</h2>
        
        <!-- 单选 -->
        <div v-if="currentQuestion.type === 'radio'" class="options-container">
          <label v-for="option in currentQuestion.options" :key="option.value" class="option">
            <input 
              type="radio" 
              :value="option.value" 
              v-model="answers[currentQuestion.key]"
              class="radio-input"
              @change="autoNextOnSingleChoice"
            />
            <span class="option-label">{{ option.label }}</span>
          </label>
        </div>
        
        <!-- 多选 -->
        <div v-if="currentQuestion.type === 'checkbox'" class="options-container">
          <label v-for="option in currentQuestion.options" :key="option.value" class="option">
            <input 
              type="checkbox" 
              :value="option.value"
              :checked="answers[currentQuestion.key]?.includes(option.value)"
              @change="handleCheckboxChange(currentQuestion.key, option.value)"
              class="checkbox-input"
            />
            <span class="option-label">{{ option.label }}</span>
          </label>
        </div>
        
        <!-- 文本输入 -->
        <textarea 
          v-if="currentQuestion.type === 'textarea'"
          v-model="answers[currentQuestion.key]"
          :placeholder="currentQuestion.placeholder"
          :maxlength="currentQuestion.maxLength"
          class="textarea-input"
        ></textarea>
        
        <!-- 滑块 -->
        <div v-if="currentQuestion.type === 'slider'" class="slider-container">
          <input 
            type="range"
            v-model.number="answers[currentQuestion.key]"
            :min="currentQuestion.min"
            :max="currentQuestion.max"
            :step="currentQuestion.step"
            class="range-slider"
          />
          <div class="slider-value">{{ answers[currentQuestion.key] }}</div>
        </div>

        <!-- 邮箱验证 -->
        <div v-if="currentQuestion.type === 'email-verify'" class="email-verify-container">
          <!-- 第一步：输入邮箱 -->
          <div v-if="emailVerifyStep === 'input'" class="email-input-step">
            <div class="email-form">
              <div class="email-input-wrapper">
                <input 
                  v-model="emailLocalPart"
                  type="text"
                  placeholder="邮箱名称"
                  class="email-local-input"
                  @keyup.enter="sendVerifyCode"
                />
                <span class="email-at">@</span>
                <select 
                  v-model="emailDomain"
                  class="email-domain-select"
                >
                  <option value="nwpu.edu.cn">nwpu.edu.cn</option>
                  <option value="mail.nwpu.edu.cn">mail.nwpu.edu.cn</option>
                </select>
              </div>
              <button 
                class="send-code-btn"
                @click="sendVerifyCode"
                :disabled="!isValidEmail || emailSending"
              >
                {{ emailSending ? '...' : '发送' }}
              </button>
            </div>
          </div>

          <!-- 第二步：输入验证码 -->
          <div v-if="emailVerifyStep === 'verify'" class="code-verify-step">
            <div class="verify-hint">
              已发送至 <span class="email-display">{{ emailInput }}</span>
            </div>
            <div class="verify-code-form">
              <input 
                v-model="answers[currentQuestion.key]"
                type="text"
                placeholder="验证码"
                maxlength="6"
                class="verify-code-input"
                @keyup.enter="confirmEmailVerify"
              />
              <button 
                class="verify-confirm-btn"
                @click="confirmEmailVerify"
              >
                验证
              </button>
            </div>
            <div class="verify-actions">
              <button 
                class="change-email-link"
                @click="changeEmail"
              >
                换邮箱
              </button>
              <span class="countdown-hint">{{ emailCountdown }}s</span>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="loading" class="loading-state">加载中...</div>
    </div>
    
    <!-- 按钮区域 -->
    <div class="button-area">
      <button 
        v-if="currentIndex > 0"
        class="nav-btn prev-btn"
        @click="prevQuestion"
        title="上一题"
      >
        <i class="fas fa-chevron-left"></i>
      </button>
      <button 
        v-if="currentIndex < questions.length - 1"
        class="nav-btn next-btn"
        @click="nextQuestion"
        :disabled="!canNext"
        title="下一题"
      >
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { getQuestionnaire, submitQuestionnaire as submitApi } from '@/api'

const router = useRouter()
const userStore = useUserStore()

const loading = ref(true)
const submitting = ref(false)
const questions = ref([])
const currentIndex = ref(0)
const answers = ref({})

// 邮箱验证相关
const emailLocalPart = ref('')
const emailDomain = ref('')
const emailVerifyStep = ref('input') // 'input' 或 'verify'
const emailSending = ref(false)
const emailCountdown = ref(60)
let countdownInterval = null

const emailInput = computed(() => {
  return emailLocalPart.value && emailDomain.value 
    ? `${emailLocalPart.value}@${emailDomain.value}`
    : ''
})

const isValidEmail = computed(() => {
  return emailLocalPart.value.trim() !== '' && emailDomain.value !== ''
})

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

const progress = computed(() => {
  return Math.round(((currentIndex.value + 1) / questions.value.length) * 100)
})

const canNext = computed(() => {
  const q = currentQuestion.value
  if (!q.required) return true
  
  const answer = answers.value[q.key]
  if (q.type === 'checkbox') {
    return answer && answer.length > 0
  } else if (q.type === 'email-verify') {
    // 邮箱验证类型检查验证码是否已填
    return answer && answer.length === 6
  }
  return !!answer
})

const canSubmit = computed(() => {
  // 检查所有必填项
  return questions.value
    .filter(q => q.required)
    .every(q => {
      const answer = answers.value[q.key]
      if (q.type === 'checkbox') {
        return answer && answer.length > 0
      } else if (q.type === 'email-verify') {
        return answer && answer.length === 6
      }
      return !!answer
    })
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

const handleCheckboxChange = (key, value) => {
  if (!answers.value[key]) {
    answers.value[key] = []
  }
  const index = answers.value[key].indexOf(value)
  if (index > -1) {
    answers.value[key].splice(index, 1)
  } else {
    answers.value[key].push(value)
  }
}

// 单选自动跳转到下一题
const autoNextOnSingleChoice = () => {
  // 延迟100ms后跳转，提供用户反馈
  setTimeout(() => {
    nextQuestion()
  }, 100)
}

// 发送验证码
const sendVerifyCode = async () => {
  if (!isValidEmail.value) {
    alert('请输入正确的西北工业大学邮箱地址')
    return
  }
  
  emailSending.value = true
  try {
    // 模拟发送验证码
    await new Promise(resolve => setTimeout(resolve, 500))
    emailVerifyStep.value = 'verify'
    emailCountdown.value = 60
    
    // 启动倒计时
    startCountdown()
  } catch (error) {
    alert('发送验证码失败')
    console.error(error)
  } finally {
    emailSending.value = false
  }
}

// 启动倒计时
const startCountdown = () => {
  if (countdownInterval) clearInterval(countdownInterval)
  
  countdownInterval = setInterval(() => {
    emailCountdown.value--
    if (emailCountdown.value <= 0) {
      clearInterval(countdownInterval)
      emailCountdown.value = 60
    }
  }, 1000)
}

// 确认邮箱验证
const confirmEmailVerify = async () => {
  if (!answers.value[currentQuestion.value.key] || answers.value[currentQuestion.value.key].length !== 6) {
    alert('请输入6位验证码')
    return
  }
  
  // 验证码验证成功，自动提交问卷
  submitting.value = true
  try {
    const res = await submitApi(answers.value)
    if (res.code === 200) {
      userStore.setQuestionnaire(answers.value)
       clearInterval(countdownInterval)
       // 跳转到完成页面
       router.push({
         path: '/questionnaire-complete',
         query: { email: emailInput.value }
       })
    } else {
      alert(res.message || '提交失败')
    }
  } catch (error) {
    alert('提交失败，请稍后重试')
    console.error('提交问卷错误', error)
  } finally {
    submitting.value = false
  }
}

// 更换邮箱
const changeEmail = () => {
  emailLocalPart.value = ''
  emailDomain.value = ''
  emailVerifyStep.value = 'input'
  answers.value[currentQuestion.value.key] = ''
  clearInterval(countdownInterval)
  emailCountdown.value = 60
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

/* 头部 */
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  
  .header-top {
    padding: 16px 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    
    .back-btn {
      width: 36px;
      height: 36px;
      padding: 0;
      background: #f5f5f5;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      color: #333;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      flex-shrink: 0;
      
      &:hover {
        background: #e8e8e8;
        color: #000;
      }
      
      &:active {
        background: #ddd;
      }
    }
    
    .header-info {
      flex: 1;
      
      .page-title {
        font-size: 18px;
        font-weight: 600;
        color: #1a1a1a;
        margin: 0;
        line-height: 1.2;
      }
      
      .progress-info {
        font-size: 12px;
        color: #999;
        margin-top: 4px;
      }
    }
  }
  
  .progress-bar-wrapper {
    padding: 0 20px 12px;
    
    .progress-bar {
      width: 100%;
      height: 2px;
      background: #e8e8e8;
      border-radius: 1px;
      overflow: hidden;
      
       .progress-fill {
         height: 100%;
         background: #333;
         border-radius: 1px;
         transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
       }
    }
  }
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
   background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
 }

/* 问卷卡片 */
.question-card {
  width: 100%;
  max-width: 580px;
  background: #fff;
  border: none;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  animation: slideIn 0.4s ease-out;
  
  .question-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    
    .question-number {
      font-size: 11px;
      font-weight: 600;
      color: #555;
      background: transparent;
      padding: 0;
    }
    
    .required-badge {
      font-size: 10px;
      font-weight: 600;
      color: #ff6b6b;
      background: transparent;
      padding: 0;
      margin-left: auto;
    }
  }
  
  .question-title {
    font-size: 20px;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0 0 24px 0;
    line-height: 1.4;
  }
}

/* 选项容器 */
.options-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  
    .option {
      display: flex;
      align-items: center;
      padding: 14px 16px;
      background: #f8f8f8;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
      
      &:hover {
        background: #f0f0f0;
      }
      
      &:active {
        transform: scale(0.98);
      }
      
      input[type="radio"],
      input[type="checkbox"] {
        width: 20px;
        height: 20px;
        margin-right: 12px;
        cursor: pointer;
        accent-color: #555;
        flex-shrink: 0;
      }
    
    .option-label {
      font-size: 15px;
      color: #333;
      font-weight: 500;
      flex: 1;
    }
  }
}

/* 文本输入 */
.textarea-input {
  width: 100%;
  padding: 14px 16px;
  font-size: 15px;
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  font-family: inherit;
  resize: vertical;
  min-height: 140px;
  transition: all 0.2s ease;
  background: #f8f9fb;
  color: #333;
  
  &::placeholder {
    color: #bbb;
  }
  
  &:hover {
    border-color: #d0d0d0;
  }
  
   &:focus {
     outline: none;
     border-color: #333;
     background: #fff;
     box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
   }
}

/* 滑块容器 */
.slider-container {
  padding: 20px 0;
  
  .range-slider {
    width: 100%;
    height: 6px;
    border-radius: 3px;
    background: #e8e8e8;
    outline: none;
    -webkit-appearance: none;
    appearance: none;
    cursor: pointer;
    
      &::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: #555;
        cursor: pointer;
        border: none;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        transition: all 0.2s ease;
      }
      
      &::-moz-range-thumb {
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: #555;
        cursor: pointer;
        border: none;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      }
  }
  
    .slider-value {
       text-align: center;
       font-size: 32px;
       color: #333;
       font-weight: 700;
       margin-top: 16px;
     }
}

/* 邮箱验证容器 */
.email-verify-container {
  .email-form {
    display: flex;
    gap: 8px;
    align-items: flex-start;
  }
  
  .email-input-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    transition: all 0.2s ease;
    overflow: hidden;
    
     &:focus-within {
       border-color: #333;
       box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
     }
  }
  
  .email-local-input {
    flex: 1;
    min-width: 0;
    padding: 10px 12px;
    font-size: 14px;
    border: none;
    background: transparent;
    font-family: inherit;
    outline: none;
    color: #333;
    
    &::placeholder {
      color: #bbb;
    }
  }
  
  .email-at {
    font-size: 13px;
    color: #999;
    font-weight: 400;
    padding: 0 0.2px;
    flex-shrink: 0;
  }
  
  .email-domain-select {
    width: 130px;
    flex-shrink: 0;
    padding: 2px;
    font-size: 14px;
    border: none;
    background: transparent;
    font-family: inherit;
    outline: none;
    color: #333;
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'%3E%3Cpath fill='%23999' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 6px center;
    padding-right: 20px;
    
    option {
      color: #333;
      background: #fff;
      padding: 8px;
    }
  }
  
   .send-code-btn {
     height: 40px;
     padding: 0 14px;
     font-size: 13px;
     font-weight: 600;
     border: 1px solid #ccc;
     border-radius: 8px;
     background: #333;
     color: #fff;
     cursor: pointer;
     transition: all 0.2s ease;
     white-space: nowrap;
     flex-shrink: 0;
     
     &:hover:not(:disabled) {
       box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
       transform: translateY(-1px);
     }
     
     &:active:not(:disabled) {
       transform: translateY(0);
       box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
     }
     
     &:disabled {
       opacity: 0.5;
       cursor: not-allowed;
     }
   }
  
  // 第二步：验证码输入
  .code-verify-step {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .verify-hint {
    font-size: 13px;
    color: #666;
    padding: 10px 12px;
    background: #f9f9f9;
    border-radius: 6px;
    border: 1px solid #e8e8e8;
    
     .email-display {
       font-weight: 600;
       color: #333;
     }
  }
  
  .verify-code-form {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  
  .verify-code-input {
    flex: 1;
    padding: 10px 12px;
    font-size: 14px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-family: inherit;
    transition: all 0.2s ease;
    background: #fff;
    color: #333;
    
    &::placeholder {
      color: #bbb;
    }
    
    &:focus {
      outline: none;
      border-color: #333;
      box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
    }
  }
  
   .verify-confirm-btn {
     height: 40px;
     padding: 0 16px;
     font-size: 13px;
     font-weight: 600;
     border: 1px solid #ccc;
     border-radius: 8px;
     background: #333;
     color: #fff;
     cursor: pointer;
     transition: all 0.2s ease;
     flex-shrink: 0;
     
     &:hover:not(:disabled) {
       box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
       transform: translateY(-1px);
     }
     
     &:active:not(:disabled) {
       transform: translateY(0);
       box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
     }
     
     &:disabled {
       opacity: 0.5;
       cursor: not-allowed;
     }
   }
  
  .verify-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    
     .change-email-link {
       padding: 0;
       border: none;
       background: transparent;
       color: #555;
       cursor: pointer;
       font-size: 13px;
       font-weight: 500;
       transition: all 0.2s ease;
       
       &:hover {
         color: #333;
         text-decoration: underline;
       }
       
       &:active {
         opacity: 0.8;
       }
     }
    
    .countdown-hint {
      color: #999;
      font-weight: 500;
    }
  }
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
   padding: 14px 20px;
   display: flex;
   gap: 12px;
   justify-content: center;
   box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.04);
   
   .nav-btn {
     height: 40px;
     padding: 0 16px;
     font-size: 14px;
     font-weight: 500;
     border: none;
     border-radius: 8px;
     cursor: pointer;
     background: #f5f5f5;
     color: #666;
     transition: all 0.2s ease;
     display: flex;
     align-items: center;
     justify-content: center;
     gap: 6px;
     min-width: 44px;
     
      &:hover:not(:disabled) {
        background: #e8e8e8;
        color: #333;
      }
      
      &:active:not(:disabled) {
        background: #ddd;
      }
      
       &:disabled {
         opacity: 0.4;
         cursor: not-allowed;
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
  
  .question-card {
    padding: 24px;
    border-width: 3px;
  }
  
  .button-area {
    flex-direction: column;
    
    .nav-btn {
      width: 100%;
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
  
  .question-card {
    padding: 16px;
    border-width: 2px;
    border-radius: 12px;
  }
  
  .question-title {
    font-size: 18px;
  }
  
  .options-container .option {
    padding: 10px 12px;
    font-size: 15px;
  }
  
  .textarea-input {
    min-height: 100px;
    font-size: 15px;
  }
  
  .button-area {
    padding: 12px 16px;
    gap: 8px;
    
    .nav-btn {
      min-width: 100px;
      padding: 12px 16px;
      font-size: 14px;
    }
  }
}
</style>