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
        <p class="subtitle">别让好天气和好心情，在等待中过期。
</p>
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
  background: #fafafa;
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
    font-size: 48px;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0;
    text-shadow: none;
    letter-spacing: 0.5px;
    line-height: 1.2;
  }
  
  .subtitle {
    font-size: 16px;
    color: #666;
    margin: 12px 0 0 0;
    font-weight: 400;
    text-shadow: none;
    letter-spacing: 0.3px;
  }
}

/* 开始按钮 */
.button-container {
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeInUp 0.8s ease-out 0.2s both;
  
  .start-btn {
    padding: 12px 48px;
    font-size: 16px;
    font-weight: 500;
    color: #1a1a1a;
    background: #fff;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    letter-spacing: 0;
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
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      transform: none;
      border-color: #d0d0d0;
      
      &::before {
        left: 100%;
      }
    }
    
    &:active {
      transform: none;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
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
      padding: 12px 40px;
      font-size: 16px;
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
      padding: 11px 36px;
      font-size: 14px;
    }
  }
  
  .background-blob {
    height: 45%;
  }
}
</style>