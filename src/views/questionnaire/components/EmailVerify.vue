<template>
    <!-- 问卷完成后的邮箱输入界面 -->
    <div class="email-verify-card">
    <div class="complete-header">
        <h2>问卷已完成！</h2>
        <p>请输入您的邮箱进行验证</p>
    </div>

    <!-- 邮箱输入步骤 -->
    <div v-if="emailVerifyStep === 'input'" class="email-input-step">
        <div class="email-form">
            <div class="email-input-wrapper">
                <input v-model="emailLocalPart" type="text" placeholder="邮箱名称" class="email-local-input"
                    @keyup.enter="handleSendVerifyCode" />
                <span class="email-at">@</span>
                <select v-model="emailDomain" class="email-domain-select">
                    <option value="nwpu.edu.cn">nwpu.edu.cn</option>
                    <option value="mail.nwpu.edu.cn">mail.nwpu.edu.cn</option>
                </select>
            </div>
            <button class="send-code-btn" @click="handleSendVerifyCode" :disabled="!isValidEmail || emailSending">
                {{ emailSending ? '...' : '发送' }}
            </button>
        </div>
    </div>

    <!-- 验证码输入步骤 -->
    <div v-if="emailVerifyStep === 'verify'" class="code-verify-step">
        <div class="verify-hint">
            已发送至 <span class="email-display">{{ emailInput }}</span>
        </div>
        <div class="verify-code-form">
            <input v-model="emailVerifyCode" type="text" placeholder="验证码" maxlength="6" class="verify-code-input"
                @keyup.enter="confirmEmailVerify" />
            <button class="verify-confirm-btn" @click="confirmEmailVerify" :disabled="submitting">
                {{ submitting ? '提交中...' : '验证' }}
            </button>
        </div>
        <div class="verify-actions">
            <button class="change-email-link" @click="changeEmail" :disabled="emailCountdown > 0">
                换邮箱
            </button>
            <span class="countdown-hint">{{ emailCountdown }}s</span>
        </div>
    </div>
    </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { submitQuestionnaireWithVerify, sendVerifyCode, verifyEmail } from '@/api'

const router = useRouter()
const userStore = useUserStore()

const props = defineProps({
  questionnaireType: {
    type: String,
    required: true
  }
})

const emailLocalPart = ref('')
const emailDomain = ref('nwpu.edu.cn')
const emailVerifyCode = ref('')
const emailVerifyStep = ref('input') // 'input' 或 'verify'
const emailSending = ref(false)
const emailCountdown = ref(60)
const submitting = ref(false)
const sentEmail = ref('') // 保存发送验证码的邮箱
let countdownInterval = null

const emailInput = computed(() => {
  return emailLocalPart.value && emailDomain.value 
    ? `${emailLocalPart.value}@${emailDomain.value}`
    : ''
})

const isValidEmail = computed(() => {
  return emailLocalPart.value.trim() !== '' && emailDomain.value !== ''
})
// 发送验证码
const handleSendVerifyCode = async () => {
  if (!isValidEmail.value) {
    alert('请输入正确的西北工业大学邮箱地址')
    return
  }
  
  emailSending.value = true
  try {
    const response = await sendVerifyCode(emailInput.value)
    if (response.code === 200) {
      sentEmail.value = emailInput.value // 保存发送验证码的邮箱
      emailVerifyStep.value = 'verify'
      emailVerifyCode.value = ''
      emailCountdown.value = 60
      
      // 启动倒计时
      startCountdown()
    } else {
      alert(response.message || '发送验证码失败')
    }
  } catch (error) {
    alert('发送验证码失败，请稍后重试')
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
      emailCountdown.value = 0
    }
  }, 1000)
}

// 确认邮箱验证
const confirmEmailVerify = async () => {
  if (!emailVerifyCode.value || emailVerifyCode.value.length !== 6) {
    alert('请输入6位验证码')
    return
  }
  
  // 检查邮箱是否改变
  if (emailInput.value !== sentEmail.value) {
    alert('邮箱已改变，请重新发送验证码')
    return
  }
  
  // 验证码验证成功
  submitting.value = true
  try {
    // 1. 验证邮箱验证码
    const verifyResponse = await verifyEmail(sentEmail.value, emailVerifyCode.value)
    
    if (verifyResponse.code !== 200) {
      alert(verifyResponse.message || '验证码错误')
      return
    }
    
    // 2. 保存邮箱到localStorage，用于后续问卷提交
    localStorage.setItem('userEmail', sentEmail.value)
    
    // 3. 直接提交问卷数据（使用邮箱标识）
    const questionnaireData = userStore.getSubQuestionnaire(props.questionnaireType)
    if (questionnaireData) {
      await submitQuestionnaireWithVerify({
        type: props.questionnaireType,
        answers: questionnaireData,
        email: sentEmail.value  // 添加邮箱到提交数据中
      })
    }
    
    // 跳转到完成页面
    clearInterval(countdownInterval)
    router.push({
      path: '/questionnaire-complete',
      query: { email: sentEmail.value }
    })
  } catch (error) {
    alert('验证失败，请稍后重试')
    console.error('验证错误', error)
  } finally {
    submitting.value = false
  }
}

// 更换邮箱
const changeEmail = () => {
  emailLocalPart.value = ''
  emailDomain.value = ''
  emailVerifyCode.value = ''
  emailVerifyStep.value = 'input'
  sentEmail.value = '' // 清除发送的邮箱记录
  clearInterval(countdownInterval)
  emailCountdown.value = 60
}
</script>
<style lang="scss" scoped>
/* 邮箱验证卡片 */
.email-verify-card {
  width: 100%;
  max-width: 580px;
  background: #fff;
  border: none;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  animation: slideIn 0.4s ease-out;
  
  .complete-header {
    text-align: center;
    margin-bottom: 32px;
    
    h2 {
      font-size: 24px;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0 0 8px 0;
    }
    
    p {
      font-size: 14px;
      color: #666;
      margin: 0;
    }
  }
  
  // 邮箱输入步骤样式
  .email-input-step {
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
  }
  
  // 验证码输入步骤样式
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
      
      &:hover:not(:disabled) {
        color: #333;
        text-decoration: underline;
      }
      
      &:active:not(:disabled) {
        opacity: 0.8;
      }
      
      &:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }
    }
    
    .countdown-hint {
      color: #999;
      font-weight: 500;
    }
  }
}

</style>