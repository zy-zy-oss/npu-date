<template>
  <div class="login-page">
    <div class="header">
      <van-nav-bar
        left-arrow
        @click-left="goBack"
      />
    </div>
    
    <div class="login-content">
      <h1 class="title">欢迎回来</h1>
      <p class="subtitle">登录你的NPU Date账号</p>
      
      <van-form @submit="handleLogin">
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
            v-model="form.password"
            type="password"
            name="password"
            label="密码"
            placeholder="请输入密码"
            :rules="[{ required: true, message: '请输入密码' }]"
          />
        </van-cell-group>
        
        <div class="login-btn">
          <van-button
            type="primary"
            size="large"
            round
            @click="handleLogin"
          >
            登录
          </van-button>
        </div>
      </van-form>
      
      <div class="tips">
        <p>测试账号: test@nwpu.edu.cn</p>
        <p>测试密码: 123456</p>
      </div>
      
      <div class="register-link">
        <span>还没有账号？</span>
        <span class="link" @click="$router.push('/register')">立即注册</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/store/user'
import { login } from '@/api'
import { showToast } from 'vant'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const loading = ref(false)
const form = ref({
  email: '',
  password: ''
})

const validateEmail = (val) => {
  return val.endsWith('@nwpu.edu.cn')
}

const goBack = () => router.back()

const handleLogin = async () => {
  console.log('登录 form:', form.value)
  loading.value = true
  try {
    const res = await login(form.value.email, form.value.password)
    console.log('登录结果:', res)
    if (res.code === 200) {
      userStore.setToken(res.data.token)
      userStore.setUserInfo(res.data.userInfo)
      showToast({ message: '登录成功', position: 'top' })
      
      const redirect = route.query.redirect || '/'
      router.replace(redirect)
    } else {
      showToast({ message: res.message, position: 'top' })
    }
  } catch (error) {
    showToast({ message: '登录失败，请稍后重试', position: 'top' })
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  background: #fff;
}

.header {
  :deep(.van-nav-bar) {
    background: transparent;
  }
}

.login-content {
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

.login-btn {
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

.register-link {
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