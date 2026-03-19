<template>
  <div class="complete-page">
    <!-- 头部 -->
    <div class="header">
      <button class="back-btn" @click="$router.back()" title="返回">
        <i class="fas fa-arrow-left"></i>
      </button>
      <h1 class="title">问卷完成</h1>
      <div class="placeholder"></div>
    </div>

    <!-- 内容 -->
    <div class="content">
      <div class="icon-wrapper">
        <i class="fas fa-check-circle"></i>
      </div>

      <div class="message-box">
        <h2 class="main-text">您已完成问卷</h2>
        <p class="sub-text">感谢您的填写，我们会通过邮箱与您联系</p>
        <p class="email-text">{{ email }}</p>
      </div>

      <div class="info-box">
        <p class="info-title">接下来会发生什么？</p>
        <ul class="info-list">
          <li>我们会审核您的信息</li>
          <li>审核通过后将以邮件形式通知您</li>
          <li>您可以开始浏览和匹配</li>
        </ul>
      </div>

      <button class="action-btn" @click="goHome">
        返回首页
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const email = ref('')

onMounted(() => {
  // 从路由查询参数获取邮箱
  email.value = route.query.email || '您的邮箱'
})

const goHome = () => {
  router.push('/')
}
</script>

<style lang="scss" scoped>
* {
  user-select: none;
  -webkit-user-select: none;
}

.complete-page {
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fafafa;
  position: relative;
  overflow-x: hidden;
}

/* 头部 */
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
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
  
  .title {
    font-size: 18px;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0;
    flex: 1;
    text-align: center;
  }
  
  .placeholder {
    width: 36px;
    flex-shrink: 0;
  }
}

/* 内容 */
.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  
  .icon-wrapper {
    font-size: 80px;
    color: #333;
    margin-bottom: 24px;
    animation: scaleIn 0.5s ease-out;
  }
  
  .message-box {
    text-align: center;
    margin-bottom: 40px;
    
    .main-text {
      font-size: 28px;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0 0 12px 0;
    }
    
    .sub-text {
      font-size: 15px;
      color: #666;
      margin: 0 0 16px 0;
    }
    
    .email-text {
      font-size: 14px;
      color: #333;
      background: #f5f5f5;
      padding: 8px 16px;
      border-radius: 6px;
      display: inline-block;
      margin: 0;
      font-weight: 500;
    }
  }
  
  .info-box {
    background: #fff;
    border: 1px solid #e8e8e8;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 40px;
    max-width: 520px;
    width: 100%;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    
    .info-title {
      font-size: 14px;
      font-weight: 600;
      color: #333;
      margin: 0 0 16px 0;
    }
    
    .info-list {
      list-style: none;
      padding: 0;
      margin: 0;
      
      li {
        font-size: 14px;
        color: #666;
        padding: 8px 0;
        padding-left: 24px;
        position: relative;
        
        &:before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #333;
          font-weight: 600;
        }
      }
    }
  }
  
  .action-btn {
    height: 44px;
    padding: 0 32px;
    font-size: 15px;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    background: #333;
    color: #fff;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
      transform: translateY(-1px);
    }
    
    &:active {
      transform: translateY(0);
    }
  }
}

/* 动画 */
@keyframes scaleIn {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* 响应式 */
@media (max-width: 480px) {
  .content {
    padding: 30px 16px;
    
    .icon-wrapper {
      font-size: 60px;
      margin-bottom: 20px;
    }
    
    .message-box {
      margin-bottom: 30px;
      
      .main-text {
        font-size: 24px;
      }
    }
    
    .info-box {
      margin-bottom: 30px;
      padding: 16px;
    }
    
    .action-btn {
      width: 100%;
    }
  }
}
</style>