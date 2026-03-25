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
      <div class="slider-track-wrapper">
        <div class="slider-track">
          <div class="slider-fill" :style="sliderFillStyle"></div>
          <div 
            v-for="n in 11" 
            :key="n-1"
            class="slider-node"
            :class="{ 'slider-node-active': modelValue === n - 1, 'slider-node-selected': modelValue >= n - 1 }"
            :style="{ left: `${(n - 1) * 10}%` }"
            @click="selectSliderValue(n - 1)"
          >
            <span v-if="modelValue === n - 1" class="slider-node-value">{{ n - 1 }}</span>
          </div>
        </div>
        <div class="slider-labels">
          <span class="slider-label">0分</span>
          <span class="slider-label">10分</span>
        </div>
      </div>
      <div class="slider-value">{{ modelValue }}</div>
    </div>
    
    <!-- 双列选择器（范围选择） -->
    <div v-if="question.type === 'range'" class="range-picker-container">
      <div class="wheel-picker">
        <!-- 下限列 -->
        <div class="wheel-column">
          <div class="wheel-column-label">下限</div>
          <div 
            class="wheel-display"
            @wheel="handleRangeWheel('min', $event)"
            @touchstart="handleRangeTouchStart('min', $event)"
            @touchmove="handleRangeTouchMove('min', $event)"
            @touchend="handleRangeTouchEnd('min', $event)"
          >
            <div 
              v-for="(val, index) in getRangeWheelDisplayItems('min')" 
              :key="index"
              :class="['wheel-display-item', { 'wheel-display-item-selected': val === rangeValue.min }]"
              @click="selectRangeWheelItem('min', val)"
            >
              {{ val }}
            </div>
          </div>
        </div>

        <!-- 上限列 -->
        <div class="wheel-column">
          <div class="wheel-column-label">上限</div>
          <div 
            class="wheel-display"
            @wheel="handleRangeWheel('max', $event)"
            @touchstart="handleRangeTouchStart('max', $event)"
            @touchmove="handleRangeTouchMove('max', $event)"
            @touchend="handleRangeTouchEnd('max', $event)"
          >
            <div 
              v-for="(val, index) in getRangeWheelDisplayItems('max')" 
              :key="index"
              :class="['wheel-display-item', { 'wheel-display-item-selected': val === rangeValue.max }]"
              @click="selectRangeWheelItem('max', val)"
            >
              {{ val }}
            </div>
          </div>
        </div>
      </div>
      <div v-if="rangeDisplay" class="range-preview">
        {{ rangeDisplay }}
      </div>
    </div>
    
    <!-- 时间选择器 -->
    <div v-if="question.type === 'datetime'" class="time-picker-container">
      <div class="wheel-picker">
        <!-- 年 -->
        <div class="wheel-column">
          <div class="wheel-column-label">年</div>
          <div 
            class="wheel-display"
            @wheel="handleTimeWheel('year', $event)"
            @touchstart="handleTimeTouchStart('year', $event)"
            @touchmove="handleTimeTouchMove('year', $event)"
            @touchend="handleTimeTouchEnd('year', $event)"
          >
            <div 
              v-for="(year, index) in getTimeWheelDisplayItems('year')" 
              :key="index"
              :class="['wheel-display-item', { 'wheel-display-item-selected': year === timeValue.year }]"
              @click="selectTimeWheelItem('year', year)"
            >
              {{ year }}
            </div>
          </div>
        </div>
        
        <!-- 月 -->
        <div class="wheel-column">
          <div class="wheel-column-label">月</div>
          <div 
            class="wheel-display"
            @wheel="handleTimeWheel('month', $event)"
            @touchstart="handleTimeTouchStart('month', $event)"
            @touchmove="handleTimeTouchMove('month', $event)"
            @touchend="handleTimeTouchEnd('month', $event)"
          >
            <div 
              v-for="(month, index) in getTimeWheelDisplayItems('month')" 
              :key="index"
              :class="['wheel-display-item', { 'wheel-display-item-selected': month === timeValue.month }]"
              @click="selectTimeWheelItem('month', month)"
            >
              {{ month }}
            </div>
          </div>
        </div>
        
        <!-- 日 -->
        <div class="wheel-column">
          <div class="wheel-column-label">日</div>
          <div 
            class="wheel-display"
            @wheel="handleTimeWheel('day', $event)"
            @touchstart="handleTimeTouchStart('day', $event)"
            @touchmove="handleTimeTouchMove('day', $event)"
            @touchend="handleTimeTouchEnd('day', $event)"
          >
            <div 
              v-for="(day, index) in getTimeWheelDisplayItems('day')" 
              :key="index"
              :class="['wheel-display-item', { 'wheel-display-item-selected': day === timeValue.day }]"
              @click="selectTimeWheelItem('day', day)"
            >
              {{ day }}
            </div>
          </div>
        </div>
        
        <!-- 时 -->
        <div class="wheel-column">
          <div class="wheel-column-label">时</div>
          <div 
            class="wheel-display"
            @wheel="handleTimeWheel('hour', $event)"
            @touchstart="handleTimeTouchStart('hour', $event)"
            @touchmove="handleTimeTouchMove('hour', $event)"
            @touchend="handleTimeTouchEnd('hour', $event)"
          >
            <div 
              v-for="(hour, index) in getTimeWheelDisplayItems('hour')" 
              :key="index"
              :class="['wheel-display-item', { 'wheel-display-item-selected': hour === timeValue.hour }]"
              @click="selectTimeWheelItem('hour', hour)"
            >
              {{ hour }}
            </div>
          </div>
        </div>
      </div>
      <div v-if="question.showPreview && timeDisplay" class="time-preview">
        {{ timeDisplay }}
      </div>
    </div>
    
    <!-- 地区选择 -->
    <div v-if="question.type === 'region'" class="region-container">
      <div class="region-selects">
        <select 
          :value="regionValue.province"
          @change="handleProvinceChange($event.target.value)"
          class="region-select"
        >
          <option value="">请选择省份</option>
          <option v-for="province in provinces" :key="province.code" :value="province.code">{{ province.name }}</option>
        </select>
        <select 
          :value="regionValue.city"
          @change="handleCityChange($event.target.value)"
          class="region-select"
          :disabled="!regionValue.province"
        >
          <option value="">请选择城市</option>
          <option v-for="city in cities" :key="city.code" :value="city.code">{{ city.name }}</option>
        </select>
      </div>
      <div v-if="question.showPreview && regionDisplay" class="region-preview">
        {{ regionDisplay }}
      </div>
    </div>
    
    <!-- 单行输入框 -->
    <input 
      v-if="question.type === 'input'"
      :value="modelValue"
      :placeholder="question.placeholder"
      :maxlength="question.maxLength"
      class="input-field"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    
    <!-- 下拉选择框 -->
    <select 
      v-if="question.type === 'select'"
      :value="modelValue"
      class="select-field"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option value="">请选择</option>
      <option v-for="option in question.options" :key="option.value" :value="option.value">{{ option.label }}</option>
    </select>
    
    <!-- 日期选择器 -->
    <div v-if="question.type === 'date'" class="date-picker-container">
      <div class="wheel-picker">
        <!-- 年 -->
        <div class="wheel-column">
          <div class="wheel-column-label">年</div>
          <div 
            class="wheel-display"
            @wheel="handleDateWheel('year', $event)"
            @touchstart="handleDateTouchStart('year', $event)"
            @touchmove="handleDateTouchMove('year', $event)"
            @touchend="handleDateTouchEnd('year', $event)"
          >
            <div 
              v-for="(year, index) in getDateWheelDisplayItems('year')" 
              :key="index"
              :class="['wheel-display-item', { 'wheel-display-item-selected': year === dateValue.year }]"
              @click="selectDateWheelItem('year', year)"
            >
              {{ year }}
            </div>
          </div>
        </div>
        
        <!-- 月 -->
        <div class="wheel-column">
          <div class="wheel-column-label">月</div>
          <div 
            class="wheel-display"
            @wheel="handleDateWheel('month', $event)"
            @touchstart="handleDateTouchStart('month', $event)"
            @touchmove="handleDateTouchMove('month', $event)"
            @touchend="handleDateTouchEnd('month', $event)"
          >
            <div 
              v-for="(month, index) in getDateWheelDisplayItems('month')" 
              :key="index"
              :class="['wheel-display-item', { 'wheel-display-item-selected': month === dateValue.month }]"
              @click="selectDateWheelItem('month', month)"
            >
              {{ month }}
            </div>
          </div>
        </div>
        
        <!-- 日 -->
        <div class="wheel-column">
          <div class="wheel-column-label">日</div>
          <div 
            class="wheel-display"
            @wheel="handleDateWheel('day', $event)"
            @touchstart="handleDateTouchStart('day', $event)"
            @touchmove="handleDateTouchMove('day', $event)"
            @touchend="handleDateTouchEnd('day', $event)"
          >
            <div 
              v-for="(day, index) in getDateWheelDisplayItems('day')" 
              :key="index"
              :class="['wheel-display-item', { 'wheel-display-item-selected': day === dateValue.day }]"
              @click="selectDateWheelItem('day', day)"
            >
              {{ day }}
            </div>
          </div>
        </div>
      </div>
      <div v-if="question.showPreview && dateDisplay" class="date-preview">
        {{ dateDisplay }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, nextTick, onMounted } from 'vue'

const props = defineProps({
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
  const current = props.modelValue || []
  const newValue = [...current]
  const index = newValue.indexOf(value)
  if (index > -1) {
    newValue.splice(index, 1)
  } else {
    newValue.push(value)
  }
  emit('update:modelValue', newValue)
}

// ========== 双列选择器相关 ==========

const minScrollRef = ref(null)
const maxScrollRef = ref(null)
const ITEM_HEIGHT = 40
const VISIBLE_ITEMS = 5

const rangeOptions = computed(() => {
  const min = props.question.min ?? 18
  const center = props.question.center ?? 25
  const options = []
  for (let i = min; i <= center; i++) {
    options.push(i)
  }
  return options
})

const rangeValue = computed(() => {
  const val = props.modelValue
  const defaultMin = props.question.min ?? 18
  const defaultMax = props.question.max ?? 35
  if (val && (val.min !== undefined || val.max !== undefined)) {
    return {
      min: val.min ?? defaultMin,
      max: val.max ?? defaultMax
    }
  }
  return {
    min: defaultMin,
    max: defaultMax
  }
})

const rangeDisplay = computed(() => {
  const val = rangeValue.value
  return `年龄范围：${val.min} - ${val.max}`
})

const getRangeWheelDisplayItems = (type) => {
  const options = rangeOptions.value
  const currentValue = type === 'min' ? rangeValue.value.min : rangeValue.value.max
  const displayItems = []
  
  for (let i = -2; i <= 2; i++) {
    let value = currentValue + i
    
    if (options.includes(value)) {
      displayItems.push(value)
    }
  }
  
  if (displayItems.length < 5) {
    while (displayItems.length < 5) {
      const first = displayItems[0]
      const last = displayItems[displayItems.length - 1]
      const idx = options.indexOf(first)
      if (idx > 0) {
        displayItems.unshift(options[idx - 1])
      } else if (last !== undefined) {
        const lastIdx = options.indexOf(last)
        if (lastIdx < options.length - 1) {
          displayItems.push(options[lastIdx + 1])
        }
      } else {
        break
      }
    }
  }
  
  return displayItems
}

const scrollToValue = (type, value) => {
  nextTick(() => {
    const options = rangeOptions.value
    const index = options.indexOf(value)
    if (index === -1) return

    const scrollContainer = type === 'min' ? minScrollRef.value : maxScrollRef.value
    if (!scrollContainer) return

    const scrollTop = index * ITEM_HEIGHT
    scrollContainer.scrollTo({
      top: scrollTop,
      behavior: 'instant'
    })
  })
}

const handleRangeWheel = (type, event) => {
  event.preventDefault()
  const delta = event.deltaY
  if (Math.abs(delta) < 10) return

  const direction = delta > 0 ? 1 : -1
  const options = rangeOptions.value
  const currentValue = type === 'min' ? rangeValue.value.min : rangeValue.value.max
  const currentIndex = options.indexOf(currentValue)
  const newIndex = Math.max(0, Math.min(options.length - 1, currentIndex + direction))

  if (newIndex !== currentIndex) {
    selectRangeWheelItem(type, options[newIndex])
  }
}

const rangeTouchState = {
  startY: 0,
  startValue: 0,
  lastY: 0,
  velocity: 0
}

const handleRangeTouchStart = (type, event) => {
  event.preventDefault()
  const touch = event.touches[0]
  rangeTouchState.startY = touch.clientY
  rangeTouchState.lastY = touch.clientY
  rangeTouchState.startValue = type === 'min' ? rangeValue.value.min : rangeValue.value.max
  rangeTouchState.velocity = 0
}

const handleRangeTouchMove = (type, event) => {
  event.preventDefault()
  const touch = event.touches[0]
  const deltaY = touch.clientY - rangeTouchState.lastY
  rangeTouchState.velocity = deltaY
  rangeTouchState.lastY = touch.clientY
}

const handleRangeTouchEnd = (type, event) => {
  const options = rangeOptions.value
  const currentValue = rangeTouchState.startValue
  const currentIndex = options.indexOf(currentValue)

  const velocity = rangeTouchState.velocity
  let direction = 0
  if (Math.abs(velocity) > 5) {
    direction = velocity > 0 ? 1 : -1
  }

  const newIndex = Math.max(0, Math.min(options.length - 1, currentIndex + direction))

  if (newIndex !== currentIndex) {
    selectRangeWheelItem(type, options[newIndex])
  }
}

const selectRangeWheelItem = (type, value) => {
  const currentMin = rangeValue.value.min
  const currentMax = rangeValue.value.max

  if (type === 'min') {
    if (value <= currentMax) {
      emit('update:modelValue', { min: value, max: currentMax })
      scrollToValue('min', value)
    }
  } else {
    if (value >= currentMin) {
      emit('update:modelValue', { min: currentMin, max: value })
      scrollToValue('max', value)
    }
  }
}

watch(() => rangeValue.value.min, (newVal) => {
  scrollToValue('min', newVal)
})

watch(() => rangeValue.value.max, (newVal) => {
  scrollToValue('max', newVal)
})

onMounted(() => {
  nextTick(() => {
    scrollToValue('min', rangeValue.value.min)
    scrollToValue('max', rangeValue.value.max)
  })
})

// ========== 滑块选择器相关 ==========
const sliderFillStyle = computed(() => {
  return {
    width: `${(modelValue / 10) * 100}%`
  }
})

const selectSliderValue = (value) => {
  emit('update:modelValue', value)
}

// ========== 时间选择器相关 ==========
const defaultTime = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  day: new Date().getDate(),
  hour: new Date().getHours()
}

// 计算每年的天数
const daysInMonth = (year, month) => {
  return new Date(year, month, 0).getDate()
}

// 时间值
const timeValue = computed(() => {
  if (!props.modelValue) {
    return defaultTime
  }
  const dateTimeParts = String(props.modelValue).split(' ')
  const dateParts = dateTimeParts[0] ? dateTimeParts[0].split('-') : []
  const timeParts = dateTimeParts[1] ? dateTimeParts[1].split(':') : []
  
  if (dateParts.length < 3 || timeParts.length < 1) {
    return defaultTime
  }
  
  return {
    year: parseInt(dateParts[0]),
    month: parseInt(dateParts[1]),
    day: parseInt(dateParts[2]),
    hour: parseInt(timeParts[0])
  }
})

// 获取显示的5个候选数字（固定框，数字变化）
const getTimeWheelDisplayItems = (type) => {
  const currentValue = timeValue.value[type]
  const displayItems = []
  
  // 获取前后各2个值，总共5个
  for (let i = -2; i <= 2; i++) {
    let value = currentValue + i
    
    // 针对不同类型进行边界处理
    switch (type) {
      case 'year':
        // 年份没有边界限制，直接返回
        break
      case 'month':
        // 月份范围1-12
        while (value < 1) value += 12
        while (value > 12) value -= 12
        break
      case 'day':
        // 日期范围根据月份和年份变化
        const year = timeValue.value.year
        const month = timeValue.value.month
        const maxDay = daysInMonth(year, month)
        while (value < 1) value += maxDay
        while (value > maxDay) value -= maxDay
        break
      case 'hour':
        // 小时范围0-23
        while (value < 0) value += 24
        while (value > 23) value -= 24
        break
    }
    
    displayItems.push(value)
  }
  
  return displayItems
}

// 处理鼠标滚轮事件
const handleTimeWheel = (type, event) => {
  event.preventDefault()
  
  const currentValue = timeValue.value[type]
  
  // 向上滚动（deltaY > 0）：值加1
  // 向下滚动（deltaY < 0）：值减1
  const direction = event.deltaY > 0 ? 1 : -1
  let newValue = currentValue + direction
  
  // 针对不同类型进行边界处理
  switch (type) {
    case 'year':
      // 年份没有边界限制
      break
    case 'month':
      // 月份范围1-12
      if (newValue < 1) newValue = 12
      if (newValue > 12) newValue = 1
      break
    case 'day':
      // 日期范围根据月份和年份变化
      const year = timeValue.value.year
      const month = timeValue.value.month
      const maxDay = daysInMonth(year, month)
      if (newValue < 1) newValue = maxDay
      if (newValue > maxDay) newValue = 1
      break
    case 'hour':
      // 小时范围0-23
      if (newValue < 0) newValue = 23
      if (newValue > 23) newValue = 0
      break
  }
  
  // 选择新值
  selectTimeWheelItem(type, newValue)
}

// 触摸事件状态管理 - 时间选择器
const timeTouchState = {
  startY: 0,
  startValue: 0
}

const handleTimeTouchStart = (type, event) => {
  event.preventDefault()
  const touch = event.touches[0]
  timeTouchState.startY = touch.clientY
  timeTouchState.startValue = timeValue.value[type]
}

const handleTimeTouchMove = (type, event) => {
  event.preventDefault()
}

const handleTimeTouchEnd = (type, event) => {
  const touch = event.changedTouches[0]
  const deltaY = touch.clientY - timeTouchState.startY
  const sensitivity = 50
  if (Math.abs(deltaY) < sensitivity) return

  const direction = deltaY > 0 ? -1 : 1
  let newValue = timeTouchState.startValue + direction

  switch (type) {
    case 'year':
      break
    case 'month':
      if (newValue < 1) newValue = 12
      if (newValue > 12) newValue = 1
      break
    case 'day':
      const year = timeValue.value.year
      const month = timeValue.value.month
      const maxDay = daysInMonth(year, month)
      if (newValue < 1) newValue = maxDay
      if (newValue > maxDay) newValue = 1
      break
    case 'hour':
      if (newValue < 0) newValue = 23
      if (newValue > 23) newValue = 0
      break
  }

  selectTimeWheelItem(type, newValue)
}

// 选择时间选择器滚轮项
const selectTimeWheelItem = (type, value) => {
  const newTime = { ...timeValue.value }
  newTime[type] = value
  
  // 如果月份变化，可能需要调整日期
  if (type === 'month' || type === 'year') {
    const maxDay = daysInMonth(newTime.year, newTime.month)
    if (newTime.day > maxDay) {
      newTime.day = maxDay
    }
  }
  
  // 格式化输出
  const dateStr = `${newTime.year}-${String(newTime.month).padStart(2, '0')}-${String(newTime.day).padStart(2, '0')}`
  const timeStr = `${String(newTime.hour).padStart(2, '0')}:00`
  emit('update:modelValue', `${dateStr} ${timeStr}`)
}

// 时间显示
const timeDisplay = computed(() => {
  const val = timeValue.value
  return `${val.year}年${val.month}月${val.day}日 ${String(val.hour).padStart(2, '0')}:00`
})

// ========== 日期选择器相关 ==========
const defaultDate = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  day: new Date().getDate()
}

// 日期值
const dateValue = computed(() => {
  if (!props.modelValue) {
    return defaultDate
  }
  const dateParts = String(props.modelValue).split('-')
  
  if (dateParts.length < 3) {
    return defaultDate
  }
  
  return {
    year: parseInt(dateParts[0]),
    month: parseInt(dateParts[1]),
    day: parseInt(dateParts[2])
  }
})

// 获取显示的5个候选数字（固定框，数字变化）
const getDateWheelDisplayItems = (type) => {
  const currentValue = dateValue.value[type]
  const displayItems = []
  
  // 获取前后各2个值，总共5个
  for (let i = -2; i <= 2; i++) {
    let value = currentValue + i
    
    // 针对不同类型进行边界处理
    switch (type) {
      case 'year':
        // 年份没有边界限制，直接返回
        break
      case 'month':
        // 月份范围1-12
        while (value < 1) value += 12
        while (value > 12) value -= 12
        break
      case 'day':
        // 日期范围根据月份和年份变化
        const year = dateValue.value.year
        const month = dateValue.value.month
        const maxDay = daysInMonth(year, month)
        while (value < 1) value += maxDay
        while (value > maxDay) value -= maxDay
        break
    }
    
    displayItems.push(value)
  }
  
  return displayItems
}

// 处理鼠标滚轮事件
const handleDateWheel = (type, event) => {
  event.preventDefault()
  
  const currentValue = dateValue.value[type]
  
  // 向上滚动（deltaY > 0）：值加1
  // 向下滚动（deltaY < 0）：值减1
  const direction = event.deltaY > 0 ? 1 : -1
  let newValue = currentValue + direction
  
  // 针对不同类型进行边界处理
  switch (type) {
    case 'year':
      // 年份没有边界限制
      break
    case 'month':
      // 月份范围1-12
      if (newValue < 1) newValue = 12
      if (newValue > 12) newValue = 1
      break
    case 'day':
      // 日期范围根据月份和年份变化
      const year = dateValue.value.year
      const month = dateValue.value.month
      const maxDay = daysInMonth(year, month)
      if (newValue < 1) newValue = maxDay
      if (newValue > maxDay) newValue = 1
      break
  }
  
  // 选择新值
  selectDateWheelItem(type, newValue)
}

// 触摸事件状态管理 - 日期选择器
const dateTouchState = {
  startY: 0,
  startValue: 0
}

const handleDateTouchStart = (type, event) => {
  event.preventDefault()
  const touch = event.touches[0]
  dateTouchState.startY = touch.clientY
  dateTouchState.startValue = dateValue.value[type]
}

const handleDateTouchMove = (type, event) => {
  event.preventDefault()
}

const handleDateTouchEnd = (type, event) => {
  const touch = event.changedTouches[0]
  const deltaY = touch.clientY - dateTouchState.startY
  const sensitivity = 50
  if (Math.abs(deltaY) < sensitivity) return

  const direction = deltaY > 0 ? -1 : 1
  let newValue = dateTouchState.startValue + direction

  switch (type) {
    case 'year':
      break
    case 'month':
      if (newValue < 1) newValue = 12
      if (newValue > 12) newValue = 1
      break
    case 'day':
      const year = dateValue.value.year
      const month = dateValue.value.month
      const maxDay = daysInMonth(year, month)
      if (newValue < 1) newValue = maxDay
      if (newValue > maxDay) newValue = 1
      break
  }

  selectDateWheelItem(type, newValue)
}

// 选择日期选择器滚轮项
const selectDateWheelItem = (type, value) => {
  const newDate = { ...dateValue.value }
  newDate[type] = value
  
  // 如果月份变化，可能需要调整日期
  if (type === 'month' || type === 'year') {
    const maxDay = daysInMonth(newDate.year, newDate.month)
    if (newDate.day > maxDay) {
      newDate.day = maxDay
    }
  }
  
  // 格式化输出
  const dateStr = `${newDate.year}-${String(newDate.month).padStart(2, '0')}-${String(newDate.day).padStart(2, '0')}`
  emit('update:modelValue', dateStr)
}

// 日期显示
const dateDisplay = computed(() => {
  const val = dateValue.value
  return `${val.year}年${val.month}月${val.day}日`
})

// ========== 地区选择相关 ==========
import { provinces as provincesData, getCitiesByProvince } from '../../../utils/regionData'

const provinces = ref(provincesData)
const cities = ref([])

const regionValue = computed(() => {
  const val = props.modelValue || {}
  return {
    province: val.province || '',
    city: val.city || ''
  }
})

const regionDisplay = computed(() => {
  const val = regionValue.value
  if (!val.province) return ''
  const provinceName = provinces.value.find(p => p.code === val.province)?.name || ''
  const cityName = cities.value.find(c => c.code === val.city)?.name || ''
  return [provinceName, cityName].filter(Boolean).join(' ')
})

const handleProvinceChange = (provinceCode) => {
  cities.value = getCitiesByProvince(provinceCode)
  const newValue = {
    province: provinceCode,
    city: ''
  }
  emit('update:modelValue', newValue)
}

const handleCityChange = (cityCode) => {
  const newValue = {
    ...regionValue.value,
    city: cityCode
  }
  emit('update:modelValue', newValue)
}

watch(() => regionValue.value.province, (newProvince) => {
  if (newProvince) {
    cities.value = getCitiesByProvince(newProvince)
  }
}, { immediate: true })
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
  padding: 30px 20px 20px;

  .slider-track-wrapper {
    position: relative;
  }

  .slider-track {
    position: relative;
    height: 6px;
    background: #e8e8e8;
    border-radius: 3px;
    margin: 40px 0 30px;
  }

  .slider-fill {
    position: absolute;
    height: 100%;
    background: #555;
    border-radius: 3px;
    left: 0;
    top: 0;
    pointer-events: none;
  }

  .slider-node {
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #e8e8e8;
    border: 2px solid #ccc;
    top: 50%;
    transform: translate(-50%, -50%);
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: #ddd;
      border-color: #aaa;
    }
  }

  .slider-node-selected {
    background: #888;
    border-color: #666;
  }

  .slider-node-active {
    background: #333;
    border-color: #333;
    transform: translate(-50%, -50%) scale(1.2);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  .slider-node-value {
    position: absolute;
    top: -28px;
    font-size: 14px;
    font-weight: 600;
    color: #333;
    white-space: nowrap;
  }

  .slider-labels {
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
  }

  .slider-label {
    font-size: 12px;
    color: #888;
  }

  .slider-value {
    text-align: center;
    font-size: 32px;
    color: #333;
    font-weight: 700;
    margin-top: 20px;
  }
}

/* 双列选择器容器 */
.range-picker-container {
  .wheel-picker {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
  }

  .wheel-column {
    flex: 1;
    min-width: 60px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
    background: #fff;
    position: relative;
  }

  .wheel-column::before,
  .wheel-column::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 80px;
    pointer-events: none;
    z-index: 1;
  }

  .wheel-column::before {
    top: 0;
    background: linear-gradient(to bottom, #fff 0%, rgba(255,255,255,0) 100%);
  }

  .wheel-column::after {
    bottom: 0;
    background: linear-gradient(to top, #fff 0%, rgba(255,255,255,0) 100%);
  }

  .wheel-column-label {
    text-align: center;
    font-size: 12px;
    font-weight: 600;
    color: #888;
    padding: 8px 0;
    border-bottom: 1px solid #e8e8e8;
    background: #fafafa;
    position: relative;
    z-index: 2;
  }

  .wheel-display {
    height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0;
    overflow: hidden;
    touch-action: none;
    user-select: none;
  }
  
  .wheel-display-item {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    color: #666;
    transition: all 0.2s ease;
    user-select: none;
    cursor: pointer;
  }
  
  .wheel-display-item-selected {
    color: #333;
    font-weight: 600;
    font-size: 16px;
    background-color: #f0f0f0;
  }

  .wheel-scroll-container {
    height: 200px;
    overflow-y: scroll;
    scrollbar-width: none;
    -ms-overflow-style: none;
    position: relative;
    z-index: 0;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .wheel-scroll-item {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    color: #666;
    user-select: none;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .wheel-scroll-item-selected {
    color: #333;
    font-weight: 600;
    font-size: 16px;
    background-color: #f0f0f0;
  }

  .wheel-scroll-spacer {
    height: 80px;
  }

  .range-preview {
    padding: 12px;
    background: #f8f8f8;
    border-radius: 6px;
    font-size: 14px;
    color: #666;
    margin-top: 12px;
  }
}

/* 时间选择器容器 */
.time-picker-container {
  .wheel-picker {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
  }
  
  .wheel-column {
    flex: 1;
    min-width: 60px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
    background: #fff;
  }
  
  .wheel-column-label {
    text-align: center;
    font-size: 12px;
    font-weight: 600;
    color: #888;
    padding: 8px 0;
    border-bottom: 1px solid #e8e8e8;
    background: #fafafa;
  }
  
  .wheel-display {
    height: 200px; /* 5个可见项 * 40px */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0;
    overflow: hidden;
    touch-action: none;
    user-select: none;
  }
  
  .wheel-display-item {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    color: #666;
    transition: all 0.2s ease;
    user-select: none;
    cursor: pointer;
  }
  
  .wheel-display-item-selected {
    color: #333;
    font-weight: 600;
    font-size: 16px;
    background-color: #f0f0f0;
  }
  
  .time-preview {
    padding: 12px;
    background: #f8f8f8;
    border-radius: 6px;
    font-size: 14px;
    color: #666;
    margin-top: 12px;
  }
}

/* 地区选择容器 */
.region-container {
  .region-selects {
    display: flex;
    gap: 12px;
    margin-bottom: 12px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  .region-select {
    flex: 1;
    padding: 10px 12px;
    font-size: 15px;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    background: #fff;
    color: #333;
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 32px;
    
    &:hover:not(:disabled) {
      border-color: #ccc;
    }
    
    &:focus {
      outline: none;
      border-color: #333;
      box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.08);
    }
    
    &:disabled {
      background-color: #f5f5f5;
      color: #aaa;
      cursor: not-allowed;
    }
  }
  
  .region-preview {
    padding: 12px;
    background: #f8f8f8;
    border-radius: 6px;
    font-size: 14px;
    color: #666;
    margin-top: 12px;
  }
}

/* 单行输入框 */
.input-field {
  width: 100%;
  padding: 12px 14px;
  font-size: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-family: inherit;
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

/* 下拉选择框 */
.select-field {
  width: 100%;
  padding: 12px 14px;
  font-size: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-family: inherit;
  transition: all 0.2s ease;
  background: #fff;
  color: #333;
  line-height: 1.5;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 32px;
  
  &:hover {
    border-color: #ccc;
  }
  
  &:focus {
    outline: none;
    border-color: #333;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.08);
  }
}

/* 日期选择器容器 */
.date-picker-container {
  .wheel-picker {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
  }
  
  .wheel-column {
    flex: 1;
    min-width: 60px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
    background: #fff;
  }
  
  .wheel-column-label {
    text-align: center;
    font-size: 12px;
    font-weight: 600;
    color: #888;
    padding: 8px 0;
    border-bottom: 1px solid #e8e8e8;
    background: #fafafa;
  }
  
  .wheel-display {
    height: 200px; /* 5个可见项 * 40px */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0;
    overflow: hidden;
  }
  
  .wheel-display-item {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    color: #666;
    transition: all 0.2s ease;
    user-select: none;
    cursor: pointer;
  }
  
  .wheel-display-item-selected {
    color: #333;
    font-weight: 600;
    font-size: 16px;
    background-color: #f0f0f0;
  }
  
  .date-preview {
    padding: 12px;
    background: #f8f8f8;
    border-radius: 6px;
    font-size: 14px;
    color: #666;
    margin-top: 12px;
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
