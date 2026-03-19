<template>
  <div class="aurora-container">
    <div class="aurora-bg">
      <div class="aurora" style="--aurora-index: 1"></div>
      <div class="aurora" style="--aurora-index: 2"></div>
      <div class="aurora" style="--aurora-index: 3"></div>
    </div>
    <div class="aurora-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
// Aurora Background 组件
</script>

<style lang="scss" scoped>
.aurora-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  background: radial-gradient(ellipse at 50% 0%, #1a0033 0%, #0a0015 50%, #000000 100%);

  .aurora-bg {
    position: fixed;
    inset: 0;
    z-index: 0;
    overflow: hidden;

    .aurora {
      position: absolute;
      will-change: transform;
      filter: blur(50px);
      opacity: 0.5;

      &[style*="--aurora-index: 1"] {
        top: -50%;
        left: -50%;
        width: 150%;
        height: 150%;
        background: linear-gradient(
          90deg,
          rgba(255, 0, 255, 0.2) 0%,
          rgba(255, 0, 100, 0.1) 25%,
          transparent 50%,
          rgba(100, 255, 200, 0.1) 75%,
          transparent 100%
        );
        animation: aurora-flow 8s ease-in-out infinite;
      }

      &[style*="--aurora-index: 2"] {
        top: 50%;
        right: -50%;
        width: 120%;
        height: 120%;
        background: linear-gradient(
          180deg,
          rgba(100, 200, 255, 0.15) 0%,
          rgba(150, 100, 255, 0.1) 50%,
          transparent 100%
        );
        animation: aurora-flow 10s ease-in-out infinite reverse;
        animation-delay: 1s;
      }

      &[style*="--aurora-index: 3"] {
        top: 25%;
        left: 25%;
        width: 130%;
        height: 130%;
        background: linear-gradient(
          45deg,
          rgba(255, 100, 150, 0.1) 0%,
          rgba(200, 100, 255, 0.15) 50%,
          transparent 100%
        );
        animation: aurora-flow 12s ease-in-out infinite;
        animation-delay: 2s;
      }
    }
  }

  .aurora-content {
    position: relative;
    z-index: 1;
  }
}

@keyframes aurora-flow {
  0% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(20px, -20px) scale(1.1);
  }
  100% {
    transform: translate(0, 0) scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .aurora-bg .aurora {
    animation: none;
  }
}
</style>