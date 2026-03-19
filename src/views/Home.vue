<template>
  <div class="home-page">
    <!-- 背景图片 -->
    <div class="background-blob">
      <img src="@/assets/blob-characters.svg" alt="background"/>
    </div>
    
    <!-- 主容器 -->
    <div class="container">
      <!-- 标题 -->
      <div class="header">
        <h1 class="title">NPU Date</h1>
        <p class="subtitle">遇见你的浪漫</p>
      </div>
      
      <!-- 开始按钮 -->
      <div class="button-container">
        <button class="start-btn" @click="handleStart">开始</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'

const router = useRouter()
const userStore = useUserStore()

const handleStart = () => {
  router.push('/questionnaire')
}
</script>

<style lang="scss" scoped>
* {
  user-select: none;
  -webkit-user-select: none;
}

.home-page {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* 背景 Blob 图片 */
.background-blob {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 40%;
  opacity: 0.9;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

/* 主容器 */
.container {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 80px;
  height: 100vh;
  width: 100%;
  pointer-events: all;
}

/* 标题 */
.header {
  text-align: center;
  animation: fadeInDown 0.8s ease-out;
  
  .title {
    font-size: 60px;
    font-weight: 900;
    color: white;
    margin: 0;
    text-shadow: 3px 3px 0 rgba(0, 0, 0, 0.3), 6px 6px 0 rgba(0, 0, 0, 0.1);
    letter-spacing: 2px;
  }
  
  .subtitle {
    font-size: 24px;
    color: rgba(255, 255, 255, 0.95);
    margin: 16px 0 0 0;
    font-weight: 600;
    text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.2);
  }
}

/* 开始按钮 */
.button-container {
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeInUp 0.8s ease-out 0.2s both;
  
  .start-btn {
    padding: 20px 60px;
    font-size: 28px;
    font-weight: 900;
    color: #333;
    background: white;
    border: 4px solid #000;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 8px 8px 0 rgba(0, 0, 0, 0.2), inset 0 -4px 0 rgba(0, 0, 0, 0.1);
    letter-spacing: 2px;
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      transition: left 0.5s ease;
    }
    
    &:hover {
      background: #fff;
      box-shadow: 12px 12px 0 rgba(0, 0, 0, 0.25), inset 0 -4px 0 rgba(0, 0, 0, 0.15);
      transform: translate(-2px, -2px);
      
      &::before {
        left: 100%;
      }
    }
    
    &:active {
      box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.2), inset 0 -2px 0 rgba(0, 0, 0, 0.1);
      transform: translate(2px, 2px);
    }
  }
}

/* 动画 */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .home-page {
    justify-content: flex-start;
    padding-top: 80px;
  }
  
  .container {
    height: auto;
    gap: 60px;
  }
  
  .header {
    .title {
      font-size: 42px;
    }
    
    .subtitle {
      font-size: 18px;
    }
  }
  
  .button-container {
    .start-btn {
      padding: 16px 48px;
      font-size: 22px;
      border-width: 3px;
      box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.2), inset 0 -3px 0 rgba(0, 0, 0, 0.1);
    }
  }
  
  .background-blob {
    height: 50%;
  }
}

@media (max-width: 480px) {
  .home-page {
    padding-top: 60px;
  }
  
  .container {
    gap: 40px;
  }
  
  .header {
    .title {
      font-size: 32px;
    }
    
    .subtitle {
      font-size: 16px;
    }
  }
  
  .button-container {
    .start-btn {
      padding: 14px 40px;
      font-size: 18px;
      border-width: 3px;
      box-shadow: 5px 5px 0 rgba(0, 0, 0, 0.2), inset 0 -2px 0 rgba(0, 0, 0, 0.1);
    }
  }
  
  .background-blob {
    height: 45%;
  }
}
</style>