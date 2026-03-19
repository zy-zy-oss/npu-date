<template>
  <div class="question-card">
    <div class="question-meta">
      <span class="question-number">Q{{ question.id }}</span>
    </div>
    
    <h2 class="question-title">{{ question.title }}</h2>
    
    <!-- 单选 -->
    <div v-if="question.type === 'radio'" class="options-container">
      <label v-for="option in question.options" :key="option.value" class="option">
        <input 
          type="radio" 
          :value="option.value" 
          :checked="modelValue === option.value"
          class="radio-input"
          @change="$emit('update:modelValue', option.value); $emit('answer', option.value)"
        />
        <span class="option-label">{{ option.label }}</span>
      </label>
    </div>
    
    <!-- 多选 -->
    <div v-if="question.type === 'checkbox'" class="options-container">
      <label v-for="option in question.options" :key="option.value" class="option">
        <input 
          type="checkbox" 
          :value="option.value"
          :checked="modelValue?.includes(option.value)"
          @change="handleCheckboxChange(option.value)"
          class="checkbox-input"
        />
        <span class="option-label">{{ option.label }}</span>
      </label>
    </div>
    
    <!-- 文本输入 -->
    <textarea 
      v-if="question.type === 'textarea'"
      :value="modelValue"
      :placeholder="question.placeholder"
      :maxlength="question.maxLength"
      class="textarea-input"
      @input="$emit('update:modelValue', $event.target.value)"
    ></textarea>
    
    <!-- 滑块 -->
    <div v-if="question.type === 'slider'" class="slider-container">
      <input 
        type="range"
        :value="modelValue"
        :min="question.min"
        :max="question.max"
        :step="question.step"
        class="range-slider"
        @input="$emit('update:modelValue', Number($event.target.value))"
      />
      <div class="slider-value">{{ modelValue }}</div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  question: {
    type: Object,
    required: true
  },
  modelValue: {
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'answer'])

const handleCheckboxChange = (value) => {
  const newValue = Array.isArray(emit.modelValue) ? [...modelValue.value] : []
  const index = newValue.indexOf(value)
  if (index > -1) {
    newValue.splice(index, 1)
  } else {
    newValue.push(value)
  }
  emit('update:modelValue', newValue)
}
</script>

<style lang="scss" scoped>
/* 问卷卡片 */
.question-card {
  width: 100%;
  max-width: 580px;
  background: #fff;
  border: none;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  animation: slideIn 0.4s ease-out;
  
  .question-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    
    .question-number {
      font-size: 11px;
      font-weight: 600;
      color: #555;
      background: transparent;
      padding: 0;
    }
    
    .required-badge {
      font-size: 10px;
      font-weight: 600;
      color: #ff6b6b;
      background: transparent;
      padding: 0;
      margin-left: auto;
    }
  }
  
  .question-title {
    font-size: 20px;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0 0 24px 0;
    line-height: 1.4;
  }
}

/* 选项容器 */
.options-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  
  .option {
    display: flex;
    align-items: center;
    padding: 12px 0;
    background: transparent;
    border: none;
    border-bottom: 1px solid #e8e8e8;
    border-radius: 0;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    
    &:last-child {
      border-bottom: none;
    }
    
    &:hover {
      background: transparent;
    }
    
    &:active {
      transform: none;
    }
    
    input[type="radio"],
    input[type="checkbox"] {
      width: 18px;
      height: 18px;
      margin-right: 12px;
      cursor: pointer;
      accent-color: #333;
      flex-shrink: 0;
    }
    
    .option-label {
      font-size: 15px;
      color: #333;
      font-weight: 400;
      flex: 1;
    }
  }
}

/* 文本输入 */
.textarea-input {
  width: 100%;
  padding: 12px 14px;
  font-size: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-family: inherit;
  resize: none;
  min-height: 100px;
  max-height: 120px;
  transition: all 0.2s ease;
  background: #fff;
  color: #333;
  line-height: 1.5;
  
  &::placeholder {
    color: #ccc;
  }
  
  &:hover {
    border-color: #ccc;
  }
  
  &:focus {
    outline: none;
    border-color: #333;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.08);
  }
}

/* 滑块容器 */
.slider-container {
  padding: 20px 0;
  
  .range-slider {
    width: 100%;
    height: 6px;
    border-radius: 3px;
    background: #e8e8e8;
    outline: none;
    -webkit-appearance: none;
    appearance: none;
    cursor: pointer;
    
    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: #555;
      cursor: pointer;
      border: none;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      transition: all 0.2s ease;
    }
    
    &::-moz-range-thumb {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: #555;
      cursor: pointer;
      border: none;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }
  }
  
  .slider-value {
    text-align: center;
    font-size: 32px;
    color: #333;
    font-weight: 700;
    margin-top: 16px;
  }
}

/* 动画 */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 480px) {
  .question-card {
    padding: 16px;
    border-radius: 12px;
  }
  
  .question-title {
    font-size: 18px;
  }
  
  .options-container .option {
    padding: 10px 0;
    font-size: 15px;
  }
  
  .textarea-input {
    min-height: 100px;
    font-size: 15px;
  }
}
</style>
