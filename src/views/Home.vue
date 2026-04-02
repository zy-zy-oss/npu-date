<template>
  <div class="home-page">
    <!-- 动态背景 -->
    <canvas ref="bubbleCanvas" class="bubble-background"></canvas>
    <!-- 首页 -->
    <div class="intro-section" id="intro">
      <div class="intro-content">
        <!-- 主容器 -->
        <div class="container">
          <!-- 标题 -->
          <div class="header">
            <h1 class="title">

              <span class="title-line">{{ siteConfig.name }}</span>

            </h1>
            <p class="subtitle">{{ siteConfig.slogan.zh }}</p>
            <p class="subtitle">{{ siteConfig.slogan.en }}</p>

          </div>
          
          <!-- 开始按钮 -->
          <div class="button-container">
            <button class="start-btn" @click="handleStart">开始测试</button>
          </div>
          
          <!-- 倒计时 -->
          <div class="countdown-display">
            <div class="countdown-label">距离下次匹配</div>
            <div class="countdown-value">{{ countdownDisplay }}</div>
          </div>
        </div>
        <h2 class="intro-title">关于{{ siteConfig.name }}</h2>
        
        <div class="info-grid">
          <div 
            v-for="(feature, index) in siteConfig.features" 
            :key="index" 
            class="info-card"
          >
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>
        
        <!-- <div class="provinces-section">
          <h3>参与高校所在省份</h3>
          <div class="provinces-list">
            <span 
              v-for="(province, index) in siteConfig.provinces" 
              :key="index" 
              class="province-tag"
              :class="{ 'highlight': province === '陕西省' }"
            >
              {{ province }}
            </span>
          </div>
        </div>       -->
        
        <div class="contact-section">
          <h3>联系我们</h3>
          <p>如有任何问题或建议，欢迎通过以下方式联系我们：</p>
          <div class="contact-info">
            <a :href="`mailto:${siteConfig.contact.email}`" class="contact-item">
              <i class="fas fa-envelope"></i>
              <span>{{ siteConfig.contact.email }}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { getQuestionnaire } from '@/api'
import { siteConfig } from '@/config/siteConfig'

const router = useRouter()

// 动态背景相关
const bubbleCanvas = ref(null)
let canvasContext = null
let bubbles = []
let animationFrameId = null
let canvasWidth = 0
let canvasHeight = 0
let performanceLevel = 2 // 默认性能等级 (0-2，0最低，2最高)
let bubbleCount = 50 // 默认气泡数量

// 泡泡类
class Bubble {
  // 预设候选颜色（十六进制）
  static colors = [
    '#FF0000',  // 红色
    '#00FF00',  // 绿色
    '#0000FF',  // 蓝色
    '#FFFF00',  // 黄色
    '#FF00FF',  // 紫色
    '#00FFFF',  // 青色
    '#FFA500',  // 橙色
    '#4B0082',  // 深蓝色
    '#FF69B4',  // 粉色
    '#FF4500',  // 橙红色
    '#9400D3',  // 暗紫色
    '#00CED1',  // 深青色
    '#FF1493',  // 深粉色
    '#32CD32',  // 酸橙绿
    '#FF6347',  // 番茄红
    '#FF0066',  // 鲜艳粉红
    '#FF3399',  // 亮玫红
    '#CC00FF',  // 亮紫色
    '#6600FF',  // 靛蓝色
    '#0066FF',  // 亮蓝色
    '#00CCFF',  // 亮青色
    '#00FFCC',  // 薄荷蓝
    '#66FF33',  // 亮绿色
    '#CCFF00',  // 亮黄绿色
    '#FFCC00',  // 亮橙色
    '#FF6600',  // 深橙色
    '#FF0033',  // 深红色
    '#990033',  // 深玫红
    '#660066',  // 深紫色
    '#003366',  // 深蓝色
    '#006666',  // 深青色
    '#006633',  // 深绿色
    '#FF3300',  // 鲜红色
    '#FF6633',  // 橙红色
    '#FFCC33',  // 金黄色
    '#CCFF33',  // 黄绿色
    '#33FF33',  // 鲜绿色
    '#33FFCC',  // 青绿色
    '#33CCFF',  // 天蓝色
    '#3366FF',  // 中蓝色
    '#6633FF',  // 中紫色
    '#CC33FF',  // 粉紫色
    '#FF33CC'   // 粉玫瑰色
  ]
  
  constructor(canvasWidth, canvasHeight) {
    // 随机大小
    this.baseRadius = Math.random() * 50 + 20
    this.radius = this.baseRadius
    this.radiusChange = (Math.random() - 0.5) * 0.2 // 半径变化速度
    // 随机位置
    this.x = Math.random() * (canvasWidth - this.radius * 2) + this.radius
    this.y = Math.random() * (canvasHeight - this.radius * 2) + this.radius
    // 随机速度
    this.vx = (Math.random() - 0.5) * 2
    this.vy = (Math.random() - 0.5) * 2
    // 从候选颜色中随机选择
    this.color = Bubble.colors[Math.floor(Math.random() * Bubble.colors.length)]
    // 透明度
    this.baseAlpha = Math.random() * 0.3 + 0.7 // 基础透明度 0.3-0.8
    this.alpha = this.baseAlpha
    this.alphaChange = (Math.random() - 0.5) * 0.005 // 透明度变化速度
  }

  // 更新位置和属性
  update(canvasWidth, canvasHeight) {
    this.x += this.vx
    this.y += this.vy
    
    // 边界检测和反弹
    if (this.x - this.radius < 0) {
      this.x = this.radius
      this.vx = -this.vx
    } else if (this.x + this.radius > canvasWidth) {
      this.x = canvasWidth - this.radius
      this.vx = -this.vx
    }
    
    if (this.y - this.radius < 0) {
      this.y = this.radius
      this.vy = -this.vy
    } else if (this.y + this.radius > canvasHeight) {
      this.y = canvasHeight - this.radius
      this.vy = -this.vy
    }
    
    // 更新大小
    this.radius += this.radiusChange
    if (this.radius > this.baseRadius * 1.2 || this.radius < this.baseRadius * 0.8) {
      this.radiusChange = -this.radiusChange
    }
    
    // 更新透明度
    this.alpha += this.alphaChange
    if (this.alpha > this.baseAlpha + 0.2 || this.alpha < this.baseAlpha - 0.2) {
      this.alphaChange = -this.alphaChange
    }
  }

  // 渲染泡泡
  draw(ctx) {
    // 将十六进制颜色转换为RGB
    const hex = this.color.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    
    // 绘制气泡内部填充（50%透明度）
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.alpha * 0.2})`
    ctx.fill()
    ctx.closePath()
    
    // 绘制气泡轮廓
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.strokeStyle = this.color
    ctx.lineWidth = 2
    ctx.globalAlpha = this.alpha
    ctx.stroke()
    ctx.closePath()
    
    // 绘制白色高光点（长条弧状）
    ctx.beginPath()
    const outerRadius = this.radius * 0.8 // 外弧半径
    const innerRadius = this.radius * 0.6 // 内弧半径
    const startAngle = -Math.PI+0.4 // 起始角度（左侧）
    const endAngle = -Math.PI * 0.5 // 结束角度（上方）
    
    // 绘制外弧ab
    ctx.arc(this.x, this.y, outerRadius, startAngle, endAngle)
    
    // 绘制连接b和d的半圆弧
    ctx.arc(this.x + Math.cos(endAngle) * (outerRadius + innerRadius) / 2, this.y + Math.sin(endAngle) * (outerRadius + innerRadius) / 2, (outerRadius - innerRadius) / 2, startAngle + Math.PI, endAngle + Math.PI)
    
    // 绘制内弧cd（反向）
    ctx.arc(this.x, this.y, innerRadius, endAngle, startAngle, true)
    
    // 绘制连接a和c的半圆弧
    ctx.arc(this.x + Math.cos(startAngle) * (outerRadius + innerRadius) / 2, this.y + Math.sin(startAngle) * (outerRadius + innerRadius) / 2, (outerRadius - innerRadius) / 2, endAngle, startAngle)
    
    ctx.fillStyle = 'rgba(255, 255, 255, 1)'
    ctx.fill()
    ctx.closePath()
    
    // 重置透明度
    ctx.globalAlpha = 1
  }
}

// 检测设备性能
const detectPerformance = () => {
  // 使用 navigator.hardwareConcurrency 检测 CPU 核心数
  const cpuCores = navigator.hardwareConcurrency || 4
  
  // 使用 window.devicePixelRatio 检测屏幕分辨率
  const pixelRatio = window.devicePixelRatio || 1
  
  // 使用 localStorage 存储性能等级，避免每次刷新都检测
  const storedPerformance = localStorage.getItem('bubblePerformanceLevel')
  if (storedPerformance) {
    performanceLevel = parseInt(storedPerformance)
  } else {
    // 根据 CPU 核心数和屏幕分辨率判断性能等级
    if (cpuCores >= 8 && pixelRatio <= 1.5) {
      performanceLevel = 2 // 高性能
    } else if (cpuCores >= 4) {
      performanceLevel = 1 // 中等性能
    } else {
      performanceLevel = 0 // 低性能
    }
    // 存储性能等级
    localStorage.setItem('bubblePerformanceLevel', performanceLevel.toString())
  }
  
  // 根据性能等级设置气泡数量
  switch (performanceLevel) {
    case 0:
      bubbleCount = 20 // 低性能设备
      break
    case 1:
      bubbleCount = 35 // 中等性能设备
      break
    case 2:
      bubbleCount = 50 // 高性能设备
      break
  }
}

// 计算两个颜色的差异程度（0-1，值越大差异越大）
const calculateColorDifference = (color1, color2) => {
  // 将十六进制颜色转换为RGB
  const hex1 = color1.replace('#', '')
  const r1 = parseInt(hex1.substring(0, 2), 16)
  const g1 = parseInt(hex1.substring(2, 4), 16)
  const b1 = parseInt(hex1.substring(4, 6), 16)
  
  const hex2 = color2.replace('#', '')
  const r2 = parseInt(hex2.substring(0, 2), 16)
  const g2 = parseInt(hex2.substring(2, 4), 16)
  const b2 = parseInt(hex2.substring(4, 6), 16)
  
  // 计算RGB分量的差异
  const dr = Math.abs(r1 - r2) / 255
  const dg = Math.abs(g1 - g2) / 255
  const db = Math.abs(b1 - b2) / 255
  
  // 返回平均差异
  return (dr + dg + db) / 3
}

// 初始化泡泡
const initBubbles = (count) => {
  bubbles = []
  let attempts = 0
  const maxAttempts = count * 100
  const minColorDifference = 0.00001 // 最小颜色差异阈值
  
  while (bubbles.length < count && attempts < maxAttempts) {
    const newBubble = new Bubble(canvasWidth, canvasHeight)
    let overlapping = false
    let colorTooSimilar = false
    
    // 检查是否与已有泡泡重叠或颜色太相似
    for (const existingBubble of bubbles) {
      const dx = newBubble.x - existingBubble.x
      const dy = newBubble.y - existingBubble.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      const minDistance = newBubble.radius + existingBubble.radius + 5 // 额外5px间距
      
      if (distance < minDistance) {
        overlapping = true
        break
      }
      
      // 检查颜色差异
      const colorDiff = calculateColorDifference(newBubble.color, existingBubble.color)
      if (colorDiff < minColorDifference) {
        colorTooSimilar = true
        break
      }
    }
    
    if (!overlapping && !colorTooSimilar) {
      bubbles.push(newBubble)
    }
    attempts++
  }
}

// 调整 canvas 大小
const resizeCanvas = () => {
  if (!bubbleCanvas.value) return
  
  canvasWidth = window.innerWidth
  canvasHeight = window.innerHeight
  
  bubbleCanvas.value.width = canvasWidth
  bubbleCanvas.value.height = canvasHeight
  
  // 重新初始化泡泡
  initBubbles(bubbleCount)
}

// 处理泡泡碰撞
const handleCollision = (bubble1, bubble2) => {
  const dx = bubble2.x - bubble1.x
  const dy = bubble2.y - bubble1.y
  const distance = Math.sqrt(dx * dx + dy * dy)
  const minDistance = bubble1.radius + bubble2.radius + 2 // 额外2px间距
  
  if (distance < minDistance) {
    // 计算碰撞后的速度
    const angle = Math.atan2(dy, dx)
    const sin = Math.sin(angle)
    const cos = Math.cos(angle)
    
    // 旋转速度向量
    const v1x = bubble1.vx * cos + bubble1.vy * sin
    const v1y = bubble1.vy * cos - bubble1.vx * sin
    const v2x = bubble2.vx * cos + bubble2.vy * sin
    const v2y = bubble2.vy * cos - bubble2.vx * sin
    
    // 碰撞后的速度（一维弹性碰撞）
    const v1xAfter = ((bubble1.radius - bubble2.radius) * v1x + 2 * bubble2.radius * v2x) / (bubble1.radius + bubble2.radius)
    const v2xAfter = ((bubble2.radius - bubble1.radius) * v2x + 2 * bubble1.radius * v1x) / (bubble1.radius + bubble2.radius)
    
    // 旋转速度向量回原坐标系
    bubble1.vx = v1xAfter * cos - v1y * sin
    bubble1.vy = v1y * cos + v1xAfter * sin
    bubble2.vx = v2xAfter * cos - v2y * sin
    bubble2.vy = v2y * cos + v2xAfter * sin
    
    // 分离泡泡，避免重叠（增加额外间距）
    const overlap = minDistance - distance
    const separationX = (overlap / 2 + 1) * cos
    const separationY = (overlap / 2 + 1) * sin
    bubble1.x -= separationX
    bubble1.y -= separationY
    bubble2.x += separationX
    bubble2.y += separationY
  }
}

// 空间分区优化碰撞检测
const spatialPartition = (bubbles, cellSize) => {
  const grid = new Map()
  
  // 将泡泡分配到网格中
  bubbles.forEach(bubble => {
    const cellX = Math.floor(bubble.x / cellSize)
    const cellY = Math.floor(bubble.y / cellSize)
    const key = `${cellX},${cellY}`
    
    if (!grid.has(key)) {
      grid.set(key, [])
    }
    grid.get(key).push(bubble)
  })
  
  // 检测每个网格及其相邻网格中的碰撞
  for (const [key, cellBubbles] of grid) {
    const [cellX, cellY] = key.split(',').map(Number)
    
    // 检测当前网格内部的碰撞
    for (let i = 0; i < cellBubbles.length; i++) {
      for (let j = i + 1; j < cellBubbles.length; j++) {
        handleCollision(cellBubbles[i], cellBubbles[j])
      }
    }
    
    // 检测当前网格与右侧、右下、下方的网格，避免重复检测
    const neighbors = [
      [1, 0],   // 右侧
      [1, 1],   // 右下
      [0, 1]    // 下方
    ]
    
    for (const [dx, dy] of neighbors) {
      const neighborKey = `${cellX + dx},${cellY + dy}`
      const neighborBubbles = grid.get(neighborKey)
      
      if (neighborBubbles) {
        // 检测当前网格与相邻网格中泡泡的碰撞
        for (const bubble1 of cellBubbles) {
          for (const bubble2 of neighborBubbles) {
            handleCollision(bubble1, bubble2)
          }
        }
      }
    }
  }
}

// 动画循环
const animate = () => {
  if (!canvasContext) return
  
  // 清空画布
  canvasContext.clearRect(0, 0, canvasWidth, canvasHeight)
  
  // 更新和渲染所有泡泡
  bubbles.forEach(bubble => {
    bubble.update(canvasWidth, canvasHeight)
    bubble.draw(canvasContext)
  })
  
  // 使用空间分区优化碰撞检测
  spatialPartition(bubbles, 100)
  
  animationFrameId = requestAnimationFrame(animate)
}

// 倒计时相关
const countdownDisplay = ref('计算中...')
let countdownInterval = null

// 计算到下一个周五17:00的倒计时
const calculateCountdown = () => {
  const now = new Date()
  const currentDay = now.getDay() // 0 = 周日, 1 = 周一, ..., 5 = 周五
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()
  const currentSecond = now.getSeconds()
  const currentMs = now.getMilliseconds()
  
  // 计算到下一个周五17:00的毫秒数
  let daysUntilFriday
  
  if (currentDay === 5) {
    // 今天是周五
    const currentTimeValue = currentHour * 3600 + currentMinute * 60 + currentSecond
    const targetTimeValue = 17 * 3600 // 17:00:00
    
    if (currentTimeValue < targetTimeValue) {
      // 还没到17:00，今天就是匹配时间
      daysUntilFriday = 0
    } else {
      // 已经过了17:00，下一个周五是7天后
      daysUntilFriday = 7
    }
  } else if (currentDay < 5) {
    // 本周内还没到周五
    daysUntilFriday = 5 - currentDay
  } else {
    // 周五已经过去（周六或周日），下一个周五
    daysUntilFriday = 5 + (7 - currentDay)
  }
  
  // 计算目标时间
  const nextFriday = new Date(now)
  nextFriday.setDate(nextFriday.getDate() + daysUntilFriday)
  nextFriday.setHours(17, 0, 0, 0) // 设置为当天17:00:00.000
  
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

// 预加载问卷数据
const preloadQuestionnaire = async () => {
  try {
    await getQuestionnaire()
    console.log('✓ 问卷数据预加载完成')
  } catch (error) {
    console.error('✗ 问卷预加载失败:', error)
  }
}

onMounted(() => {
  // 这里可以从API获取实际的学校数量
  // const data = await fetchSchoolCount()
  // schoolCount.value = data.count
  
  // 启动倒计时
  startCountdown()
  
  // 预加载问卷数据
  preloadQuestionnaire()
  
  // 检测设备性能
  detectPerformance()
  
  // 初始化动态背景
  if (bubbleCanvas.value) {
    canvasContext = bubbleCanvas.value.getContext('2d')
    resizeCanvas()
    animate()
    
    // 监听窗口大小变化
    window.addEventListener('resize', resizeCanvas)
  }
})

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
  
  // 清理动态背景
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  window.removeEventListener('resize', resizeCanvas)
})

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
  width: 100%;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  position: relative;
  background-color: white;
}


/* 动态背景 */
.bubble-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
}

/* 倒计时显示 */
.countdown-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
  margin-top: 20px;
  
  .countdown-label {
    font-size: 14px;
    color: #666;
    font-weight: 400;
    letter-spacing: 1px;
  }
  
  .countdown-value {
    font-size: 32px;
    color: #333;
    font-weight: 600;
    letter-spacing: 2px;
    white-space: nowrap;
  }
}



/* 主容器 */
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
  width: 100%;
  pointer-events: all;
  margin-bottom: 60px;
}

/* 标题 */
.header {
  text-align: center;
  animation: fadeInDown 0.8s ease-out;
  
  .title {
    font-size: 48px;
    font-weight: 700;
    color: #000000;
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
      margin-top: 80px;
      margin-bottom: 80px;
      
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
  gap: 16px;
  animation: fadeInUp 0.8s ease-out 0.2s both;
  
  .start-btn {
    padding: 12px 48px;
    font-size: 16px;
    font-weight: 500;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    letter-spacing: 0;
    position: relative;
    overflow: hidden;
    width: 160px;
    white-space: nowrap;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    
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
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      transform: none;
      
      &::before {
        left: 100%;
      }
    }
    
    &:active {
      transform: none;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
    }
  }
  
  .start-btn {
    color: #fff;
    background: #000;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    border: 1px solid #000;

    &:hover {
      background: #333;
      border-color: #333;
    }
  }
}

/* 介绍区域 */
.intro-section {
  width: 100%;
  background: rgba(255, 255, 255, 0);
  padding: 40px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  position: relative;
  z-index: 1;
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
  
  &.highlight {
    background: #000000;
    color: #fff;
    
    &:hover {
      background: #000;
    }
  }
}

/* 联系我们 */
.contact-section {
  background: transparent;
  padding: 30px 20px;
  border-radius: 0;
  border-top: 1px solid #e8e8e8;
  box-shadow: none;
  animation: fadeInUp 0.8s ease-out;
  text-align: center;
  
  h3 {
    font-size: 16px;
    font-weight: 500;
    color: #333;
    margin-bottom: 12px;
  }
  
  p {
    font-size: 13px;
    color: #888;
    margin-bottom: 16px;
  }
}

.contact-info {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
  
  i {
    font-size: 16px;
  }
  
  &:hover {
    color: #333;
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
    margin-top: 16px;
    
    .countdown-label {
      font-size: 12px;
    }
    
    .countdown-value {
      font-size: 24px;
    }
  }
  
  .container {
    gap: 40px;
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
    flex-direction: column;
    gap: 12px;
    
    .start-btn {
      padding: 12px 40px;
      font-size: 16px;
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
    margin-top: 12px;
    
    .countdown-label {
      font-size: 10px;
    }
    
    .countdown-value {
      font-size: 18px;
    }
  }
  
  .container {
    gap: 32px;
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
    flex-direction: column;
    gap: 10px;
    
    .start-btn {
      padding: 11px 36px;
      font-size: 14px;
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