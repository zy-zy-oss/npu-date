<template>
  <div class="button-area">
    <!-- 上一题按钮 -->
    <button
      class="nav-btn prev-btn"
      :disabled="prevDisabled"
      @click="handlePrev"
      title="上一题"
    >
      <i class="fas fa-arrow-left"></i>
      <span>上一题</span>
    </button>

    <!-- 下一题/完成按钮 -->
    <button
      v-if="!isLast"
      class="nav-btn next-btn"
      :disabled="nextDisabled"
      @click="handleNext"
      title="下一题"
    >
      <span>下一题</span>
      <i class="fas fa-arrow-right"></i>
    </button>

    <!-- 完成按钮 -->
    <button
      v-else
      class="nav-btn complete-btn"
      :disabled="nextDisabled"
      @click="handleComplete"
      title="完成问卷"
    >
      完成
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  // 是否是第一题
  isFirst: {
    type: Boolean,
    default: false
  },
  // 是否是最后一题
  isLast: {
    type: Boolean,
    default: false
  },
  // 上一题按钮是否禁用
  prevDisabled: {
    type: Boolean,
    default: false
  },
  // 下一题/完成按钮是否禁用
  nextDisabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['prev', 'next', 'complete'])

const handlePrev = () => {
  emit('prev')
}

const handleNext = () => {
  emit('next')
}

const handleComplete = () => {
  emit('complete')
}
</script>

<style lang="scss" scoped>
/* 按钮区域 */
.button-area {
  width: 100%;
  max-width: 580px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

/* 导航按钮基础样式 */
.nav-btn {
  height: 40px;
  width: auto;
  padding: 0 16px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: #fff;
  color: #666;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 100px;

  &:hover:not(:disabled) {
    background: #f5f5f5;
    color: #333;
  }

  &:active:not(:disabled) {
    background: #e8e8e8;
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  /* 上一题按钮 - 左对齐 */
  &.prev-btn {
    justify-content: flex-start;
  }

  /* 下一题按钮 - 右对齐 */
  &.next-btn {
    justify-content: flex-end;
  }

  /* 完成按钮 - 右对齐，特殊样式 */
  &.complete-btn {
    background: #333;
    color: #fff;
    font-weight: 500;

    &:hover:not(:disabled) {
      background: #1a1a1a;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }

    &:active:not(:disabled) {
      background: #000;
    }
  }
}

/* 响应式适配 */
@media (max-width: 640px) {
  .button-area {
    gap: 8px;

    .nav-btn {
      height: 36px;
      padding: 0 12px;
      font-size: 13px;
      min-width: 80px;
      gap: 6px;

      &.complete-btn {
        padding: 0 16px;
      }
    }
  }
}
</style>
