<template>
  <canvas ref="canvas" class="star-field"></canvas>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const canvas = ref(null)

onMounted(() => {
  const canvasEl = canvas.value
  if (!canvasEl) return

  const ctx = canvasEl.getContext('2d')
  const width = (canvasEl.width = window.innerWidth)
  const height = (canvasEl.height = window.innerHeight)

  // 生成星星
  const stars = []
  const starCount = 300

  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.3,
      opacity: Math.random() * 0.5 + 0.3,
      twinkleSpeed: Math.random() * 0.03 + 0.01,
      color: ['#fff', '#ffb3ff', '#b3e5ff', '#ff99cc'][Math.floor(Math.random() * 4)]
    })
  }

  let animationId
  let time = 0

  const animate = () => {
    // 清空画布
    ctx.fillStyle = 'rgba(0, 0, 5, 0.2)'
    ctx.fillRect(0, 0, width, height)

    // 绘制星星
    stars.forEach(star => {
      const twinkle = Math.sin(time * star.twinkleSpeed) * 0.35 + 0.65

      // 绘制星星主体
      ctx.fillStyle = `${star.color}${Math.round(star.opacity * twinkle * 255).toString(16).padStart(2, '0')}`
      ctx.beginPath()
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
      ctx.fill()

      // 星光光晕
      ctx.strokeStyle = `rgba(255, 200, 150, ${star.opacity * twinkle * 0.15})`
      ctx.lineWidth = 0.5
      ctx.beginPath()
      ctx.arc(star.x, star.y, star.radius + 2, 0, Math.PI * 2)
      ctx.stroke()
    })

    time++
    animationId = requestAnimationFrame(animate)
  }

  animate()

  // 响应式处理
  const handleResize = () => {
    canvasEl.width = window.innerWidth
    canvasEl.height = window.innerHeight
  }

  window.addEventListener('resize', handleResize)

  return () => {
    window.removeEventListener('resize', handleResize)
    cancelAnimationFrame(animationId)
  }
})
</script>

<style lang="scss" scoped>
.star-field {
  position: fixed;
  inset: 0;
  z-index: 0;
}
</style>