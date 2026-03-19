<template>
  <div class="home-page">
    <!-- 倒计时 -->
    <div class="countdown-display">
      <div class="countdown-label">距离下次匹配</div>
      <div class="countdown-value">{{ countdownDisplay }}</div>
    </div>
    
    <!-- 第一屏：首页 + 背景 -->
    <div class="home-section">
      <!-- 校徽背景 -->
      <div class="background-logos">
        <div class="logos-container">
          <div 
            v-for="(school, index) in logosList" 
            :key="index"
            class="logo-item"
            :class="{ 'enrolled': enrolledSchools.includes(school.name) }"
          >
            <span class="logo-text">{{ school.name }}</span>
          </div>
        </div>
      </div>
      
      <!-- 主容器 -->
      <div class="container">
        <!-- 标题 -->
        <div class="header">
          <h1 class="title">
            <span class="title-line">西联计划</span>
            <span class="title-line">已入驻<span class="highlight">{{ schoolCount }}</span>所高校</span>
          </h1>
          <p class="subtitle">别让好天气和好心情，在等待中过期。</p>
        </div>
        
        <!-- 开始按钮 -->
        <div class="button-container">
          <button class="start-btn" @click="handleStart">开始</button>
        </div>
      </div>
    </div>
    
    <!-- 了解更多箭头 - 放在第一屏下方 -->
    <button class="scroll-indicator" @click="handleLearnMore" aria-label="了解更多">
      <span class="arrow">↓</span>
    </button>
    
    <!-- 返回首页箭头 - 在第二屏顶部 -->
    <button class="back-to-top" @click="handleBackToHome" aria-label="返回首页">
      <span class="arrow">↑</span>
    </button>
    
    <!-- 第二屏：介绍 -->
    <div class="intro-section" id="intro">
      <div class="intro-content">
        <h2 class="intro-title">关于西联计划</h2>
        
        <div class="info-grid">
          <div class="info-card">
            <h3>心理学匹配</h3>
            <p>基于九型人格理论和性格测评，精准匹配志同道合的伙伴</p>
          </div>
          
          <div class="info-card">
            <h3>多省高校参与</h3>
            <p>涵盖陕西及周边省份 22 所高校：山西、河南、湖北、四川、重庆等</p>
          </div>
          
          <div class="info-card">
            <h3>科学严谨</h3>
            <p>基于心理学研究，每周五进行匹配，确保用户体验</p>
          </div>
          
          <div class="info-card">
            <h3>真实连接</h3>
            <p>帮助大学生找到有共同兴趣和价值观的朋友</p>
          </div>
        </div>
        
        <div class="provinces-section">
          <h3>参与高校所在省份</h3>
          <div class="provinces-list">
            <span class="province-tag">陕西</span>
            <span class="province-tag">山西</span>
            <span class="province-tag">河南</span>
            <span class="province-tag">湖北</span>
            <span class="province-tag">四川</span>
            <span class="province-tag">重庆</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'

const router = useRouter()
const userStore = useUserStore()

// 动态学校数量
const schoolCount = ref(1)

// 入驻的学校列表
const enrolledSchools = ref(['西北工业大学'])

// 陕西邻省的大学列表
const logosList = ref([
  { name: '西北工业大学', province: '陕西' },
  { name: '西安交通大学', province: '陕西' },
  { name: '西安电子科技大学', province: '陕西' },
  { name: '长安大学', province: '陕西' },
  { name: '山西大学', province: '山西' },
  { name: '太原理工大学', province: '山西' },
  { name: '中北大学', province: '山西' },
  { name: '华北电力大学', province: '山西' },
  { name: '郑州大学', province: '河南' },
  { name: '河南工业大学', province: '河南' },
  { name: '河南理工大学', province: '河南' },
  { name: '武汉大学', province: '湖北' },
  { name: '华中科技大学', province: '湖北' },
  { name: '武汉理工大学', province: '湖北' },
  { name: '中国地质大学', province: '湖北' },
  { name: '四川大学', province: '四川' },
  { name: '西南交通大学', province: '四川' },
  { name: '西南石油大学', province: '四川' },
  { name: '电子科技大学', province: '四川' },
  { name: '重庆大学', province: '重庆' },
  { name: '西南大学', province: '重庆' },
  { name: '重庆邮电大学', province: '重庆' }
])

// 倒计时相关
const countdownDisplay = ref('计算中...')
let countdownInterval = null

// 计算到下一个周五的倒计时
const calculateCountdown = () => {
  const now = new Date()
  const currentDay = now.getDay() // 0 = 周日, 1 = 周一, ..., 5 = 周五
  
  let daysUntilFriday
  if (currentDay === 5) {
    // 今天是周五，下一个周五是7天后
    daysUntilFriday = 7
  } else if (currentDay < 5) {
    // 本周内还没到周五
    daysUntilFriday = 5 - currentDay
  } else {
    // 周五已经过去，下一个周五是下周
    daysUntilFriday = 5 + (7 - currentDay)
  }
  
  // 计算时间差
  const nextFriday = new Date(now)
  nextFriday.setDate(nextFriday.getDate() + daysUntilFriday)
  nextFriday.setHours(0, 0, 0, 0) // 设置为当天00:00
  
  const diff = nextFriday - now
  
  if (diff <= 0) {
    countdownDisplay.value = '匹配中...'
    return
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  
  countdownDisplay.value = `${days}天 ${hours}小时 ${minutes}分 ${seconds}秒`
}

// 启动倒计时
const startCountdown = () => {
  calculateCountdown()
  countdownInterval = setInterval(calculateCountdown, 1000)
}

onMounted(() => {
  // 这里可以从API获取实际的学校数量
  // const data = await fetchSchoolCount()
  // schoolCount.value = data.count
  
  // 启动倒计时
  startCountdown()
})

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
})

const handleStart = () => {
  router.push('/questionnaire')
}

// 滚动状态控制
let scrollLocked = true

// 了解更多 - 平滑滚动到第二屏
const handleLearnMore = () => {
  scrollLocked = false
  const introSection = document.getElementById('intro')
  if (introSection) {
    introSection.scrollIntoView({ behavior: 'smooth' })
  }
}

// 返回首页 - 平滑滚动到第一屏
const handleBackToHome = () => {
  scrollLocked = true
  const homeSection = document.querySelector('.home-section')
  if (homeSection) {
    homeSection.scrollIntoView({ behavior: 'smooth' })
  }
}

// 监听滚动事件
const handleScroll = (e) => {
  const scrollTop = e.target.scrollTop || window.scrollY
  
  // 如果还在第一屏（scrollTop < 100vh 的像素值），保持禁用
  const firstScreenHeight = window.innerHeight
  if (scrollTop < firstScreenHeight) {
    scrollLocked = true
  } else {
    // 一旦进入第二屏，允许滚动
    scrollLocked = false
  }
}

// 禁止滚动的事件处理
const preventScroll = (e) => {
  if (scrollLocked) {
    e.preventDefault()
  }
}

onMounted(() => {
  // 这里可以从API获取实际的学校数量
  // const data = await fetchSchoolCount()
  // schoolCount.value = data.count
  
  // 启动倒计时
  startCountdown()
  
  // 添加滚动监听
  const homePage = document.querySelector('.home-page')
  if (homePage) {
    homePage.addEventListener('scroll', handleScroll)
    homePage.addEventListener('wheel', preventScroll, { passive: false })
    homePage.addEventListener('touchmove', preventScroll, { passive: false })
  }
})

onUnmounted(() => {
  const homePage = document.querySelector('.home-page')
  if (homePage) {
    homePage.removeEventListener('scroll', handleScroll)
    homePage.removeEventListener('wheel', preventScroll)
    homePage.removeEventListener('touchmove', preventScroll)
  }
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
})
</script>

<style lang="scss" scoped>
* {
  user-select: none;
  -webkit-user-select: none;
}

.home-page {
  width: 100%;
  height: 200vh;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  overflow-y: scroll;
  position: relative;
  background: #fafafa;
}

/* 第一屏容器 */
.home-section {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 倒计时显示 - 透明无背景 */
.countdown-display {
  position: fixed;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
  
  .countdown-label {
    font-size: 14px;
    color: #666;
    font-weight: 400;
    letter-spacing: 1px;
  }
  
  .countdown-value {
    font-size: 48px;
    color: #333;
    font-weight: 300;
    letter-spacing: 2px;
    white-space: nowrap;
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
  }
}

/* 校徽背景 */
.background-logos {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 66.666%;
  overflow: hidden;
  background: linear-gradient(180deg, transparent 0%, rgba(250, 250, 250, 0.3) 100%);
  z-index: 5;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    background: radial-gradient(ellipse at center, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.3) 100%);
  }
  
  .logos-container {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 20px 40px;
    padding: 40px;
    height: 100%;
    width: 100%;
    overflow: hidden;
    position: relative;
    z-index: 1;
  }
  
  .logo-item {
    font-size: 16px;
    font-weight: 600;
    color: #ddd;
    white-space: nowrap;
    letter-spacing: 1px;
    transition: all 0.3s ease;
    filter: blur(0.8px);
    
    .logo-text {
      display: inline-block;
    }
    
    &.enrolled {
      color: #666;
      font-weight: 700;
      font-size: 17px;
      filter: blur(1px);
      
      .logo-text {
        position: relative;
      }
    }
  }
}

/* 主容器 */
.container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
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
    line-height: 1.4;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    
    .title-line {
      display: block;
      
      &:first-child {
        font-weight: 700;
      }
      
      &:last-child {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
      }
    }
    
    .highlight {
      color: #000;
      font-weight: 800;
      font-size: 52px;
      margin: 0;
      display: inline-block;
      animation: countUp 0.6s ease-out 0.3s backwards;
    }
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

/* 向下滚动箭头 */
.scroll-indicator {
  position: absolute;
  top: 65vh;
  left: 50%;
  transform: translateX(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 30;
  pointer-events: auto;
  
  .arrow {
    font-size: 24px;
    color: #999;
    font-weight: 300;
    display: block;
    animation: bounce 2s infinite;
    transition: color 0.3s ease;
  }
  
  &:hover .arrow {
    color: #333;
    animation: bounce 1s infinite;
  }
}

/* 返回首页箭头 */
.back-to-top {
  position: absolute;
  top: calc(100vh + 20px);
  right: 20px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  pointer-events: auto;
  
  .arrow {
    font-size: 24px;
    color: #000000;
    font-weight: 400;
    display: block;
    animation: bounce 2s infinite;
    transition: color 0.3s ease;
  }
  
  &:hover .arrow {
    color: #333;
    animation: bounce 1s infinite;
  }
}

/* 介绍区域 */
.intro-section {
  position: absolute;
  top: 100vh;
  left: 0;
  width: 100%;
  height: 100vh;
  background: #fff;
  padding: 40px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  z-index: 10;
}

.intro-content {
  max-width: 1000px;
  width: 100%;
  max-height: 100%;
  overflow-y: auto;
  padding: 20px 0;
  
  /* 隐藏滚动条 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 和 Edge */
  
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari 和 Opera */
  }
  
  .intro-title {
    font-size: 32px;
    font-weight: 500;
    color: #333;
    text-align: center;
    margin-top: 60px;
    animation: fadeInUp 0.8s ease-out;
    letter-spacing: 0.5px;
  }
}

/* 信息卡片网格 */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
}

.info-card {
  background: transparent;
  padding: 30px 20px;
  border-radius: 0;
  box-shadow: none;
  border-bottom: 1px solid #e8e8e8;
  text-align: center;
  transition: all 0.3s ease;
  animation: fadeInUp 0.8s ease-out;
  
  &:hover {
    transform: none;
    box-shadow: none;
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  .card-icon {
    font-size: 36px;
    margin-bottom: 12px;
  }
  
  h3 {
    font-size: 16px;
    font-weight: 500;
    color: #333;
    margin-bottom: 8px;
  }
  
  p {
    font-size: 13px;
    color: #888;
    line-height: 1.6;
    margin: 0;
  }
}

/* 省份区域 */
.provinces-section {
  background: transparent;
  padding: 30px 20px;
  border-radius: 0;
  border-top: 1px solid #e8e8e8;
  box-shadow: none;
  animation: fadeInUp 0.8s ease-out;
  
  h3 {
    font-size: 16px;
    font-weight: 500;
    color: #333;
    text-align: center;
    margin-bottom: 20px;
  }
}

.provinces-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

.province-tag {
  background: #f0f0f0;
  color: #666;
  padding: 6px 14px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 400;
  transition: all 0.3s ease;
  cursor: default;
  
  &:hover {
    transform: none;
    background: #e8e8e8;
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

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* 数字计数动画 */
@keyframes countUp {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .countdown-display {
    top: 30px;
    
    .countdown-label {
      font-size: 12px;
    }
    
    .countdown-value {
      font-size: 28px;
    }
  }
  
  .container {
    gap: 60px;
  }
  
  .header {
    .title {
      font-size: 42px;
      gap: 6px;
      
      .title-line {
        &:last-child {
          gap: 2px;
        }
      }
      
      .highlight {
        font-size: 46px;
      }
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
  
  .background-logos {
    height: 66.666%;
    
    .logos-container {
      gap: 16px 32px;
      padding: 32px;
    }
    
    .logo-item {
      font-size: 14px;
      
      &.enrolled {
        font-size: 15px;
      }
    }
  }
  
  .intro-content {
    padding: 20px;
    
    .intro-title {
      font-size: 36px;
      margin-bottom: 40px;
    }
  }
  
  .info-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .provinces-section {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .countdown-display {
    top: 20px;
    
    .countdown-label {
      font-size: 10px;
    }
    
    .countdown-value {
      font-size: 20px;
    }
  }
  
  .container {
    gap: 40px;
  }
  
  .header {
    .title {
      font-size: 32px;
      gap: 4px;
      
      .title-line {
        &:last-child {
          gap: 1px;
        }
      }
      
      .highlight {
        font-size: 36px;
      }
    }
    
    .subtitle {
      font-size: 14px;
    }
  }
  
  .button-container {
    .start-btn {
      padding: 11px 36px;
      font-size: 14px;
    }
  }
  
  .background-logos {
    height: 60%;
    
    .logos-container {
      gap: 12px 24px;
      padding: 24px 16px;
    }
    
    .logo-item {
      font-size: 12px;
      letter-spacing: 0.5px;
      
      &.enrolled {
        font-size: 13px;
      }
    }
  }
  
  .intro-content {
    padding: 16px;
    
    .intro-title {
      font-size: 28px;
      margin-bottom: 30px;
    }
  }
  
  .info-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .info-card {
    padding: 24px 16px;
  }
  
  .provinces-section {
    padding: 16px;
    
    h3 {
      font-size: 16px;
      margin-bottom: 20px;
    }
  }
  
  .province-tag {
    padding: 6px 12px;
    font-size: 12px;
  }
}
</style>