<template>
  <div class="relative w-full h-full overflow-hidden">
    <canvas ref="canvas" class="absolute inset-0"></canvas>
    <div class="absolute inset-0 pointer-events-none">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Props {
  hue?: number
  saturation?: number
  brightness?: number
  speed?: number
  mouseSensitivity?: number
  damping?: number
  noise?: {
    opacity: number
    scale: number
  }
}

const props = withDefaults(defineProps<Props>(), {
  hue: 220,
  saturation: 100,
  brightness: 50,
  speed: 0.5,
  mouseSensitivity: 0.5,
  damping: 0.95,
  noise: () => ({ opacity: 0.3, scale: 100 })
})

const canvas = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
  const canvasEl = canvas.value
  if (!canvasEl) return

  const ctx = canvasEl.getContext('2d')
  if (!ctx) return

  const width = (canvasEl.width = window.innerWidth)
  const height = (canvasEl.height = window.innerHeight)

  // 雷暴参数
  let time = 0
  let mouseX = width / 2
  let mouseY = height / 2
  let targetX = width / 2
  let targetY = height / 2

  // 鼠标追踪
  const handleMouseMove = (e: MouseEvent) => {
    targetX = e.clientX
    targetY = e.clientY
  }

  window.addEventListener('mousemove', handleMouseMove)

  // 生成 Perlin 噪声
  const generateNoise = (x: number, y: number, scale: number) => {
    const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453
    return n - Math.floor(n)
  }

  // 绘制闪电
  const drawLightning = (
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    branching: number
  ) => {
    if (branching < 0) return

    const dx = toX - fromX
    const dy = toY - fromY
    const distance = Math.sqrt(dx * dx + dy * dy)
    const steps = Math.max(1, Math.floor(distance / 5))

    const vx = dx / steps
    const vy = dy / steps

    for (let i = 0; i < steps; i++) {
      const x = fromX + vx * i
      const y = fromY + vy * i
      const nextX = fromX + vx * (i + 1)
      const nextY = fromY + vy * (i + 1)

      // 闪电主线
      ctx!.strokeStyle = `hsla(${props.hue}, ${props.saturation}%, ${props.brightness}%, 0.8)`
      ctx!.lineWidth = 2 + (2 * (3 - branching)) / 3
      ctx!.beginPath()
      ctx!.moveTo(x, y)
      ctx!.lineTo(nextX, nextY)
      ctx!.stroke()

      // 光晕
      ctx!.strokeStyle = `hsla(${props.hue}, ${props.saturation}%, ${props.brightness}%, 0.3)`
      ctx!.lineWidth = 8 + (8 * (3 - branching)) / 3
      ctx!.beginPath()
      ctx!.moveTo(x, y)
      ctx!.lineTo(nextX, nextY)
      ctx!.stroke()

      // 随机分支
      if (Math.random() < 0.1 && branching > 0) {
        const angle = (Math.random() - 0.5) * Math.PI
        const length = distance * 0.4
        drawLightning(nextX, nextY, nextX + Math.cos(angle) * length, nextY + Math.sin(angle) * length, branching - 1)
      }
    }
  }

  // 绘制乌云
  const drawClouds = () => {
    ctx!.fillStyle = `hsla(${props.hue}, 30%, 20%, 0.4)`
    
    // 多层云彩
    for (let i = 0; i < 5; i++) {
      const offsetX = (time * props.speed * (i + 1)) % width
      const offsetY = 30 + i * 15
      
      // 云彩颗粒
      for (let j = 0; j < 10; j++) {
        const cloudX = (offsetX + j * 100) % width
        const cloudY = offsetY + Math.sin((time + j) * 0.02) * 5
        const size = 40 + i * 10
        
        ctx!.beginPath()
        ctx!.arc(cloudX, cloudY, size, 0, Math.PI * 2)
        ctx!.fill()
      }
    }
  }

  // 绘制大气效果
  const drawAtmosphere = () => {
    const grd = ctx!.createLinearGradient(0, 0, 0, height)
    grd.addColorStop(0, `hsla(${props.hue}, ${props.saturation}%, ${props.brightness + 20}%, 0.3)`)
    grd.addColorStop(0.5, `hsla(${props.hue}, ${props.saturation}%, ${props.brightness}%, 0.1)`)
    grd.addColorStop(1, `hsla(${props.hue}, ${props.saturation}%, ${props.brightness - 20}%, 0.2)`)

    ctx!.fillStyle = grd
    ctx!.fillRect(0, 0, width, height)
  }

  // 绘制闪电光
  const drawFlash = (intensity: number) => {
    ctx!.fillStyle = `hsla(${props.hue}, 100%, 100%, ${intensity * 0.5})`
    ctx!.fillRect(0, 0, width, height)
  }

  // 主动画循环
  let animationId: number
  let lightningIntensity = 0
  let lightningCycle = 0

  const animate = () => {
    // 清空画布
    ctx!.fillStyle = `hsla(${props.hue}, ${props.saturation}%, 5%, 1)`
    ctx!.fillRect(0, 0, width, height)

    // 绘制大气
    drawAtmosphere()

    // 绘制云彩
    drawClouds()

    // 平滑跟踪鼠标
    mouseX += (targetX - mouseX) * props.mouseSensitivity
    mouseY += (targetY - mouseY) * props.mouseSensitivity

    // 闪电逻辑
    lightningCycle++

    if (lightningCycle > 60) {
      if (Math.random() < 0.05) {
        lightningIntensity = 1
        lightningCycle = 0

        // 绘制多条闪电
        for (let i = 0; i < 2 + Math.floor(Math.random() * 2); i++) {
          const startX = Math.random() * width
          const startY = Math.random() * height * 0.3
          const endX = mouseX + (Math.random() - 0.5) * 200
          const endY = height

          drawLightning(startX, startY, endX, endY, 3)
        }
      }
    }

    // 衰减闪电
    lightningIntensity *= props.damping

    // 绘制闪电光
    if (lightningIntensity > 0.01) {
      drawFlash(lightningIntensity)
    }

    // 噪声效果
    if (props.noise && props.noise.opacity > 0) {
      ctx!.fillStyle = `rgba(255, 255, 255, ${props.noise.opacity * 0.1})`
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * width
        const y = Math.random() * height
        const size = Math.random() * props.noise.scale
        ctx!.fillRect(x, y, size, size)
      }
    }

    time++
    animationId = requestAnimationFrame(animate)
  }

  animate()

  // 响应式
  const handleResize = () => {
    canvasEl.width = window.innerWidth
    canvasEl.height = window.innerHeight
  }

  window.addEventListener('resize', handleResize)

  return () => {
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('resize', handleResize)
    cancelAnimationFrame(animationId)
  }
})
</script>

<style scoped>
canvas {
  display: block;
}
</style>