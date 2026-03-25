<template>
  <div class="button-area">
    <!-- 上一题按钮 -->
    <button
      class="nav-btn prev-btn"
      :disabled="prevDisabled"
      @click="handlePrev"
      title="上一题"
    >
      <i class="fas fa-chevron-left"></i>
    </button>

    <!-- 下一题/完成按钮 -->
    <button
      v-if="!isLast"
      class="nav-btn next-btn"
      :disabled="nextDisabled"
      @click="handleNext"
      title="下一题"
    >
      <i class="fas fa-chevron-right"></i>
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
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
}

/* 导航按钮基础样式 */
.nav-btn {
  height: 36px;
  width: 36px;
  padding: 0;
  font-size: 16px;
  font-weight: 400;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  background: #fff;
  color: #666;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  min-width: 36px;

  &:hover:not(:disabled) {
    background: #f5f5f5;
    color: #333;
    border-color: #ccc;
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
    align-self: flex-start;
  }

  /* 下一题按钮 - 右对齐 */
  &.next-btn {
    margin-left: auto;
  }

  /* 完成按钮 - 右对齐，特殊样式 */
  &.complete-btn {
    margin-left: auto;
    width: auto;
    padding: 0 20px;
    background: #333;
    color: #fff;
    font-weight: 500;
    min-width: auto;
    border-color: #333;

    &:hover:not(:disabled) {
      background: #1a1a1a;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      border-color: #1a1a1a;
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
      width: 36px;
      height: 36px;
      min-width: 36px;

      &.complete-btn {
        width: auto;
        padding: 0 16px;
      }
    }
  }
}
</style>
