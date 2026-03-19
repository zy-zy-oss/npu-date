<template>
  <div class="meteors-container">
    <div 
      v-for="meteor in meteors" 
      :key="meteor.id"
      class="meteor"
      :style="{
        left: meteor.x + '%',
        top: meteor.y + '%',
        '--meteor-duration': meteor.duration + 's',
        '--meteor-delay': meteor.delay + 's'
      }"
    ></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const meteors = ref([
  { id: 1, x: 10, y: 5, delay: 0, duration: 2.5 },
  { id: 2, x: 80, y: 10, delay: 1.5, duration: 3 },
  { id: 3, x: 35, y: 8, delay: 3, duration: 2.8 },
  { id: 4, x: 65, y: 12, delay: 4.5, duration: 3.2 },
  { id: 5, x: 20, y: 15, delay: 6, duration: 2.6 },
  { id: 6, x: 75, y: 6, delay: 7.5, duration: 3 }
])
</script>

<style lang="scss" scoped>
.meteors-container {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  overflow: hidden;
}

.meteor {
  position: absolute;
  width: 2px;
  height: 60px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.8), transparent);
  box-shadow: 0 0 15px 2px rgba(255, 200, 150, 0.6);
  filter: blur(1px);
  animation: meteor-fall var(--meteor-duration, 2.5s) linear infinite;
  animation-delay: var(--meteor-delay, 0s);
  transform: rotate(45deg);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(255, 150, 100, 0.8), transparent);
    filter: blur(2px);
  }
}

@keyframes meteor-fall {
  0% {
    transform: rotate(45deg) translateY(-500px);
    opacity: 1;
  }
  100% {
    transform: rotate(45deg) translateY(calc(100vh + 500px));
    opacity: 0;
  }
}
</style>