<template>
  <div class="questionnaire-page">
    <!-- 背景 -->
    <div class="page-bg"></div>
    
    <!-- 返回按钮 -->
    <div class="header-bar">
      <button class="back-btn" @click="$router.back()">
        <span class="arrow">←</span> 返回
      </button>
      <h1 class="page-title">问卷调查</h1>
      <div class="progress-text">{{ currentIndex + 1 }} / {{ questions.length }}</div>
    </div>
    
    <!-- 进度条 -->
    <div class="progress-container">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progress + '%' }"></div>
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
            <div class="email-input-group">
              <input 
                v-model="emailInput"
                type="email"
                :placeholder="currentQuestion.placeholder"
                class="email-input"
                @keyup.enter="sendVerifyCode"
              />
              <button 
                class="send-btn"
                @click="sendVerifyCode"
                :disabled="!isValidEmail || emailSending"
              >
                {{ emailSending ? '发送中...' : '发送验证码' }}
              </button>
            </div>
            <div class="email-tips">
              💡 请输入你的西北工业大学邮箱 (xxx@nwpu.edu.cn)
            </div>
          </div>

          <!-- 第二步：输入验证码 -->
          <div v-if="emailVerifyStep === 'verify'" class="code-input-step">
            <div class="countdown-text">
              验证码已发送到 <strong>{{ emailInput }}</strong>，请输入验证码
              <br />
              <span class="countdown">{{ emailCountdown }}s 后重新发送</span>
            </div>
            <div class="code-input-group">
              <input 
                v-model="answers[currentQuestion.key]"
                type="text"
                placeholder="请输入6位验证码"
                maxlength="6"
                class="code-input"
                @keyup.enter="emailVerifyStep = 'input'"
              />
              <button 
                class="verify-btn"
                @click="confirmEmailVerify"
              >
                确认
              </button>
            </div>
            <button 
              class="change-email-btn"
              @click="changeEmail"
            >
              更换邮箱
            </button>
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
      >
        ← 上一题
      </button>
      <button 
        v-if="currentIndex < questions.length - 1"
        class="nav-btn next-btn"
        @click="nextQuestion"
        :disabled="!canNext"
      >
        下一题 →
      </button>
      <button 
        v-if="currentIndex === questions.length - 1"
        class="nav-btn submit-btn"
        @click="submitQuestionnaire"
        :disabled="!canSubmit || submitting"
      >
        {{ submitting ? '提交中...' : '完成提交' }}
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
const emailInput = ref('')
const emailVerifyStep = ref('input') // 'input' 或 'verify'
const emailSending = ref(false)
const emailCountdown = ref(60)
let countdownInterval = null

const isValidEmail = computed(() => {
  return emailInput.value.endsWith('@nwpu.edu.cn')
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
const confirmEmailVerify = () => {
  if (!answers.value[currentQuestion.value.key] || answers.value[currentQuestion.value.key].length !== 6) {
    alert('请输入6位验证码')
    return
  }
  
  // 验证码验证成功，返回邮箱输入界面
  alert('验证成功！')
  emailVerifyStep.value = 'input'
  clearInterval(countdownInterval)
  
  // 移动到下一题
  nextQuestion()
}

// 更换邮箱
const changeEmail = () => {
  emailInput.value = ''
  emailVerifyStep.value = 'input'
  answers.value[currentQuestion.value.key] = ''
  clearInterval(countdownInterval)
  emailCountdown.value = 60
}

const submitQuestionnaire = async () => {
  submitting.value = true
  try {
    const res = await submitApi(answers.value)
    if (res.code === 200) {
      userStore.setQuestionnaire(answers.value)
      alert('问卷提交成功！')
      router.push('/crush')
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

/* 头部栏 */
.header-bar {
  position: relative;
  z-index: 10;
  background: rgba(255, 255, 255, 0.95);
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-bottom: 3px solid #000;
  margin-bottom: 12px;
  
  .back-btn {
    background: white;
    border: 2px solid #000;
    border-radius: 6px;
    padding: 8px 16px;
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
    color: #333;
    transition: all 0.3s ease;
    
    .arrow {
      margin-right: 4px;
      font-weight: 900;
    }
    
    &:hover {
      background: #f0f0f0;
      transform: scale(1.05);
    }
    
    &:active {
      transform: scale(0.95);
    }
  }
  
  .page-title {
    font-size: 24px;
    font-weight: 900;
    color: #333;
    margin: 0;
    flex: 1;
    text-align: center;
    text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.1);
  }
  
  .progress-text {
    font-size: 16px;
    font-weight: 700;
    color: #667eea;
    min-width: 80px;
    text-align: right;
  }
}

/* 进度条容器 */
.progress-container {
  position: relative;
  z-index: 10;
  padding: 0 20px 20px;
  
  .progress-bar {
    width: 100%;
    height: 8px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 10px;
    border: 2px solid #000;
    overflow: hidden;
    
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      border-radius: 8px;
      transition: width 0.3s ease;
      box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
    }
  }
}

/* 内容容器 */
.content-wrapper {
  position: relative;
  z-index: 10;
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: calc(100vh - 280px);
  overflow-y: auto;
}

/* 问卷卡片 */
.question-card {
  width: 100%;
  max-width: 600px;
  background: white;
  border: 4px solid #000;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 8px 8px 0 rgba(0, 0, 0, 0.15), 12px 12px 0 rgba(0, 0, 0, 0.1);
  animation: slideIn 0.4s ease-out;
  
  .question-meta {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    
    .question-number {
      font-size: 18px;
      font-weight: 900;
      color: #667eea;
      background: rgba(102, 126, 234, 0.1);
      padding: 4px 12px;
      border-radius: 8px;
      border: 2px solid #667eea;
    }
    
    .required-badge {
      font-size: 12px;
      font-weight: 700;
      color: white;
      background: #ff6b6b;
      padding: 4px 12px;
      border-radius: 6px;
      border: 2px solid #d32f2f;
    }
  }
  
  .question-title {
    font-size: 20px;
    font-weight: 900;
    color: #333;
    margin: 0 0 28px 0;
    line-height: 1.4;
    text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.05);
  }
}

/* 选项容器 */
.options-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  
  .option {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    background: #f9f9f9;
    border: 2px solid #ddd;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    
    &:hover {
      background: #f0f0f0;
      border-color: #667eea;
      transform: translateX(4px);
    }
    
    input[type="radio"],
    input[type="checkbox"] {
      width: 20px;
      height: 20px;
      margin-right: 12px;
      cursor: pointer;
      accent-color: #667eea;
    }
    
    .option-label {
      font-size: 16px;
      color: #333;
      font-weight: 500;
      flex: 1;
    }
  }
}

/* 文本输入 */
.textarea-input {
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-family: inherit;
  resize: vertical;
  min-height: 120px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
}

/* 滑块容器 */
.slider-container {
  padding: 20px 0;
  
  .range-slider {
    width: 100%;
    height: 6px;
    border-radius: 3px;
    background: #ddd;
    outline: none;
    -webkit-appearance: none;
    appearance: none;
    
    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      cursor: pointer;
      border: 2px solid #000;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
    
    &::-moz-range-thumb {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      cursor: pointer;
      border: 2px solid #000;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
  }
  
  .slider-value {
    text-align: center;
    font-size: 28px;
    color: #667eea;
    font-weight: 900;
    margin-top: 20px;
    text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.1);
  }
}

/* 邮箱验证容器 */
.email-verify-container {
  .email-input-step,
  .code-input-step {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .email-input-group,
  .code-input-group {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  
  .email-input,
  .code-input {
    flex: 1;
    padding: 12px 16px;
    font-size: 16px;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-family: inherit;
    transition: all 0.3s ease;
    
    &:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    
    &:disabled {
      background: #f5f5f5;
      cursor: not-allowed;
    }
  }
  
  .send-btn,
  .verify-btn {
    padding: 12px 20px;
    font-size: 14px;
    font-weight: 700;
    border: 2px solid #000;
    border-radius: 8px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
    text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.1);
    
    &:hover:not(:disabled) {
      transform: translate(-2px, -2px);
      box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.2);
    }
    
    &:active:not(:disabled) {
      transform: translate(2px, 2px);
      box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.2);
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
  
  .email-tips {
    font-size: 13px;
    color: #666;
    padding: 10px 12px;
    background: #f0f4ff;
    border-left: 3px solid #667eea;
    border-radius: 4px;
    margin-top: 8px;
    font-weight: 500;
  }
  
  .countdown-text {
    font-size: 14px;
    color: #333;
    line-height: 1.6;
    padding: 12px 16px;
    background: #f9f9f9;
    border-radius: 8px;
    border: 2px solid #ddd;
    
    strong {
      color: #667eea;
      font-weight: 700;
    }
    
    .countdown {
      display: block;
      margin-top: 8px;
      color: #666;
      font-size: 13px;
    }
  }
  
  .change-email-btn {
    padding: 10px 16px;
    font-size: 13px;
    font-weight: 600;
    border: 2px solid #ddd;
    border-radius: 6px;
    background: white;
    color: #333;
    cursor: pointer;
    transition: all 0.3s ease;
    align-self: center;
    
    &:hover {
      background: #f0f0f0;
      border-color: #667eea;
      color: #667eea;
    }
    
    &:active {
      transform: scale(0.95);
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
  position: relative;
  z-index: 10;
  background: rgba(255, 255, 255, 0.95);
  padding: 16px 20px;
  display: flex;
  gap: 12px;
  border-top: 3px solid #000;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
  flex-wrap: wrap;
  
  .nav-btn {
    flex: 1;
    min-width: 120px;
    padding: 14px 20px;
    font-size: 16px;
    font-weight: 900;
    border: 3px solid #000;
    border-radius: 10px;
    cursor: pointer;
    background: white;
    color: #333;
    transition: all 0.3s ease;
    text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.1);
    
    &:hover:not(:disabled) {
      background: #f0f0f0;
      transform: translate(-2px, -2px);
      box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.2);
    }
    
    &:active:not(:disabled) {
      transform: translate(2px, 2px);
      box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.2);
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    &.submit-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-color: #000;
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
    flex-direction: column;
    gap: 12px;
    
    .back-btn {
      width: 100%;
    }
    
    .page-title {
      font-size: 20px;
    }
    
    .progress-text {
      width: 100%;
      text-align: center;
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