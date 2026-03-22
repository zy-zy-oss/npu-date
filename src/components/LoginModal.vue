<template>
  <div class="login-modal-overlay" v-if="visible" @click="handleOverlayClick">
    <div class="login-modal" @click.stop>
      <div class="modal-header">
        <h3>登录</h3>
        <button class="close-btn" @click="handleClose">&times;</button>
      </div>
      <div class="login-tabs">
        <div 
          class="tab-item" 
          :class="{ active: loginType === 'password' }" 
          @click="loginType = 'password'"
        >
          密码登录
        </div>
        <div 
          class="tab-item" 
          :class="{ active: loginType === 'verification' }" 
          @click="loginType = 'verification'"
        >
          验证码登录
        </div>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label for="email">邮箱</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            placeholder="请输入您的邮箱"
            class="form-input"
          >
        </div>
        <div class="form-group" v-if="loginType === 'password'">
          <label for="password">密码</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            placeholder="请输入密码"
            class="form-input"
          >
        </div>
        <div class="form-group" v-if="loginType === 'verification'">
          <label for="verificationCode">验证码</label>
          <div class="verification-input-group">
            <input 
              type="text" 
              id="verificationCode" 
              v-model="verificationCode" 
              placeholder="请输入验证码"
              class="form-input verification-input"
            >
            <button 
              class="get-code-btn" 
              @click="handleGetVerificationCode" 
              :disabled="isGettingCode || countdown > 0"
            >
              {{ countdown > 0 ? `${countdown}秒后重新获取` : '获取验证码' }}
            </button>
          </div>
        </div>
        <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>
      </div>
      <div class="modal-footer">
        <button class="btn cancel" @click="handleClose">取消</button>
        <button class="btn confirm" @click="handleLogin" :disabled="isLoading">
          {{ isLoading ? '登录中...' : '登录' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import { mockUsers, MOCK_VERIFICATION_CODE } from '@/utils/mockData'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'login-success'])

const loginType = ref('password') // 'password' 或 'verification'
const email = ref('')
const password = ref('')
const verificationCode = ref('')
const errorMessage = ref('')
const isLoading = ref(false)
const isGettingCode = ref(false)
const countdown = ref(0)
let countdownTimer = null

const handleClose = () => {
  emit('close')
  resetForm()
}

const handleOverlayClick = () => {
  handleClose()
}

const resetForm = () => {
  email.value = ''
  password.value = ''
  verificationCode.value = ''
  errorMessage.value = ''
  isLoading.value = false
  isGettingCode.value = false
  clearCountdown()
}

const clearCountdown = () => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
  countdown.value = 0
}

const startCountdown = () => {
  countdown.value = 60
  countdownTimer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      clearCountdown()
    }
  }, 1000)
}

const handleGetVerificationCode = async () => {
  if (!email.value) {
    errorMessage.value = '请先输入邮箱'
    return
  }
  
  isGettingCode.value = true
  errorMessage.value = ''
  
  try {
    // 模拟发送验证码请求
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 检查邮箱是否存在
    const user = mockUsers.find(u => u.email === email.value)
    if (user) {
      // 开发环境提示预定义的验证码
      alert(`验证码已发送，开发环境预定义验证码：${MOCK_VERIFICATION_CODE}`)
      startCountdown()
    } else {
      errorMessage.value = '未测试，请先完成测试后登录'
    }
  } catch (error) {
    errorMessage.value = '获取验证码失败，请稍后重试'
  } finally {
    isGettingCode.value = false
  }
}

const handleLogin = async () => {
  // 简单的表单验证
  if (!email.value) {
    errorMessage.value = '请填写邮箱'
    return
  }
  
  if (loginType.value === 'password') {
    if (!password.value) {
      errorMessage.value = '请填写密码'
      return
    }
  } else {
    if (!verificationCode.value) {
      errorMessage.value = '请填写验证码'
      return
    }
  }
  
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    // 模拟登录请求
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 使用mockUsers数据进行登录验证
    const user = mockUsers.find(u => u.email === email.value)
    
    if (user) {
      let loginSuccess = false
      
      if (loginType.value === 'password') {
        // 检查密码是否正确
        loginSuccess = user.password === password.value
      } else {
        // 检查验证码是否正确
        loginSuccess = verificationCode.value === MOCK_VERIFICATION_CODE
      }
      
      if (loginSuccess) {
        // 登录成功
        emit('login-success', { 
          email: user.email,
          name: user.name,
          school: '西北工业大学'
        })
        handleClose()
      } else {
        errorMessage.value = loginType.value === 'password' ? '密码错误' : '验证码错误'
      }
    } else {
      // 邮箱不存在，提示未测试
      errorMessage.value = '未测试，请先完成测试后登录'
    }
  } catch (error) {
    errorMessage.value = '登录失败，请稍后重试'
  } finally {
    isLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
.login-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.login-modal {
  background: #fff;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #e8e8e8;
    
    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }
    
    .close-btn {
      background: none;
      border: none;
      font-size: 24px;
      color: #999;
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      
      &:hover {
        color: #666;
      }
    }
  }
  
  .login-tabs {
    display: flex;
    border-bottom: 1px solid #e8e8e8;
    
    .tab-item {
      flex: 1;
      padding: 12px 0;
      text-align: center;
      font-size: 14px;
      color: #666;
      cursor: pointer;
      transition: all 0.2s ease;
      
      &:hover {
        color: #1890ff;
      }
      
      &.active {
        color: #1890ff;
        border-bottom: 2px solid #1890ff;
        font-weight: 500;
      }
    }
  }
  
  .modal-body {
    padding: 20px;
    
    .form-group {
      margin-bottom: 16px;
      
      label {
        display: block;
        font-size: 14px;
        font-weight: 500;
        color: #333;
        margin-bottom: 8px;
      }
      
      .form-input {
        width: 100%;
        padding: 10px 12px;
        font-size: 14px;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        transition: all 0.2s ease;
        box-sizing: border-box;
        
        &:focus {
          outline: none;
          border-color: #1890ff;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        }
      }
      
      .verification-input-group {
        display: flex;
        gap: 12px;
        
        .verification-input {
          flex: 1;
        }
        
        .get-code-btn {
          padding: 0 16px;
          font-size: 14px;
          color: #1890ff;
          background: none;
          border: 1px solid #1890ff;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          
          &:hover:not(:disabled) {
            color: #40a9ff;
            border-color: #40a9ff;
            background: rgba(24, 144, 255, 0.05);
          }
          
          &:disabled {
            color: #bfbfbf;
            border-color: #d9d9d9;
            cursor: not-allowed;
          }
        }
      }
    }
    
    .error-message {
      color: #ff4d4f;
      font-size: 12px;
      margin-top: 8px;
    }
  }
  
  .modal-footer {
    display: flex;
    gap: 12px;
    padding: 20px;
    border-top: 1px solid #e8e8e8;
    justify-content: flex-end;
    
    .btn {
      padding: 8px 16px;
      font-size: 14px;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s ease;
      
      &.cancel {
        color: #666;
        background: #f0f0f0;
        border: 1px solid #d9d9d9;
        
        &:hover {
          background: #e0e0e0;
          color: #333;
        }
      }
      
      &.confirm {
        color: #fff;
        background: #1890ff;
        border: 1px solid #1890ff;
        
        &:hover {
          background: #40a9ff;
          border-color: #40a9ff;
        }
        
        &:disabled {
          background: #bfbfbf;
          border-color: #bfbfbf;
          cursor: not-allowed;
        }
      }
    }
  }
}
</style>