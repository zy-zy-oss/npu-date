<template>
  <div class="register-page">
    <div class="header">
      <van-nav-bar
        left-arrow
        @click-left="$router.back()"
      />
    </div>
    
    <div class="register-content">
      <h1 class="title">创建账号</h1>
      <p class="subtitle">加入NPU Date，遇见对的TA</p>
      
      <van-form @submit="handleRegister">
        <van-cell-group inset>
          <van-field
            v-model="form.email"
            name="email"
            label="邮箱"
            placeholder="请输入西北工业大学邮箱"
            :rules="[
              { required: true, message: '请输入邮箱' },
              { validator: validateEmail, message: '请输入西工大邮箱' }
            ]"
          />
          <van-field
            v-model="form.code"
            name="code"
            label="验证码"
            placeholder="请输入验证码"
            :rules="[{ required: true, message: '请输入验证码' }]"
          >
            <template #button>
              <van-button
                size="small"
                type="primary"
                :disabled="countdown > 0"
                @click="sendCode"
                native-type="button"
              >
                {{ countdown > 0 ? `${countdown}s` : '发送验证码' }}
              </van-button>
            </template>
          </van-field>
          <van-field
            v-model="form.password"
            type="password"
            name="password"
            label="密码"
            placeholder="请设置密码"
            :rules="[
              { required: true, message: '请设置密码' },
              { validator: validatePassword, message: '密码至少6位' }
            ]"
          />
          <van-field
            v-model="form.confirmPassword"
            type="password"
            name="confirmPassword"
            label="确认密码"
            placeholder="请再次输入密码"
            :rules="[
              { required: true, message: '请再次输入密码' },
              { validator: validateConfirmPassword, message: '两次密码不一致' }
            ]"
          />
        </van-cell-group>
        
        <div class="register-btn">
          <van-button
            type="primary"
            size="large"
            round
            native-type="submit"
            :loading="loading"
          >
            注册
          </van-button>
        </div>
      </van-form>
      
      <div class="tips">
        <p>⚠️ 仅支持西北工业大学邮箱注册</p>
        <p>测试验证码: 123456</p>
      </div>
      
      <div class="login-link">
        <span>已有账号？</span>
        <span class="link" @click="$router.push('/login')">立即登录</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { register, sendVerifyCode } from '@/api'
import { Toast } from 'vant'

const router = useRouter()

const loading = ref(false)
const countdown = ref(0)
const form = ref({
  email: '',
  code: '',
  password: '',
  confirmPassword: ''
})

const validateEmail = (val) => {
  return val.endsWith('@nwpu.edu.cn')
}

const validatePassword = (val) => {
  return val.length >= 6
}

const validateConfirmPassword = (val) => {
  return val === form.value.password
}

let timer = null
const sendCode = async () => {
  if (!form.value.email) {
    Toast.fail('请先输入邮箱')
    return
  }
  if (!validateEmail(form.value.email)) {
    Toast.fail('请输入西工大邮箱')
    return
  }
  
  try {
    const res = await sendVerifyCode(form.value.email)
    if (res.code === 200) {
      Toast.success('验证码已发送')
      countdown.value = 60
      timer = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) {
          clearInterval(timer)
        }
      }, 1000)
    } else {
      Toast.fail(res.message)
    }
  } catch (error) {
    Toast.fail('发送失败，请稍后重试')
  }
}

const handleRegister = async () => {
  loading.value = true
  try {
    const res = await register(form.value.email, form.value.password, form.value.code)
    if (res.code === 200) {
      Toast.success('注册成功')
      setTimeout(() => {
        router.push('/login')
      }, 1000)
    } else {
      Toast.fail(res.message)
    }
  } catch (error) {
    Toast.fail('注册失败，请稍后重试')
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.register-page {
  min-height: 100vh;
  background: #fff;
}

.header {
  :deep(.van-nav-bar) {
    background: transparent;
  }
}

.register-content {
  padding: 40px 24px;
  
  .title {
    font-size: 28px;
    font-weight: 700;
    color: #333;
    margin-bottom: 8px;
  }
  
  .subtitle {
    font-size: 14px;
    color: #999;
    margin-bottom: 40px;
  }
}

.register-btn {
  margin: 32px 16px;
  
  :deep(.van-button--primary) {
    background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
    border: none;
  }
}

.tips {
  text-align: center;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
  margin: 20px 16px;
  
  p {
    font-size: 13px;
    color: #666;
    margin: 4px 0;
  }
}

.login-link {
  text-align: center;
  margin-top: 30px;
  font-size: 14px;
  color: #999;
  
  .link {
    color: #ff6b6b;
    margin-left: 4px;
    cursor: pointer;
  }
}
</style>