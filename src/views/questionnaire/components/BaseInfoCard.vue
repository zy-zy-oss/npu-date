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
    
    <!-- 双滑块（范围选择） -->
    <div v-if="question.type === 'range'" class="range-slider-container">
      <div class="range-track">
        <div class="range-fill" :style="rangeFillStyle"></div>
        <input 
          type="range"
          :value="rangeValue.min"
          :min="question.min"
          :max="question.max"
          :step="question.step || 1"
          class="range-input range-min"
          @input="handleRangeMinChange($event.target.value)"
        />
        <input 
          type="range"
          :value="rangeValue.max"
          :min="question.min"
          :max="question.max"
          :step="question.step || 1"
          class="range-input range-max"
          @input="handleRangeMaxChange($event.target.value)"
        />
      </div>
      <div class="range-labels">
        <span class="range-label-min">{{ rangeValue.min }}</span>
        <span class="range-label-unit">{{ question.unit || '' }}</span>
        <span class="range-label-max">{{ rangeValue.max }}</span>
      </div>
    </div>
    
    <!-- 日期选择 -->
    <div v-if="question.type === 'date'" class="date-container">
      <div class="date-selects">
        <select 
          :value="dateValue.year"
          @change="handleDateChange('year', $event.target.value)"
          class="date-select"
        >
          <option value="">年</option>
          <option v-for="year in yearOptions" :key="year" :value="year">{{ year }}</option>
        </select>
        <span class="date-separator">年</span>
        <select 
          :value="dateValue.month"
          @change="handleDateChange('month', $event.target.value)"
          class="date-select"
        >
          <option value="">月</option>
          <option v-for="month in 12" :key="month" :value="month">{{ month }}</option>
        </select>
        <span class="date-separator">月</span>
        <select 
          :value="dateValue.day"
          @change="handleDateChange('day', $event.target.value)"
          class="date-select"
        >
          <option value="">日</option>
          <option v-for="day in dayOptions" :key="day" :value="day">{{ day }}</option>
        </select>
        <span class="date-separator">日</span>
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
      <div v-if="question.showDistrict !== false" class="region-selects">
        <select 
          :value="regionValue.district"
          @change="handleDistrictChange($event.target.value)"
          class="region-select"
          :disabled="!regionValue.city"
        >
          <option value="">请选择区县</option>
          <option v-for="district in districts" :key="district.code" :value="district.code">{{ district.name }}</option>
        </select>
      </div>
      <div v-if="question.showPreview && regionDisplay" class="region-preview">
        {{ regionDisplay }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

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

// ========== 双滑块相关 ==========
const rangeValue = computed(() => {
  const val = props.modelValue || { min: props.question.min, max: props.question.max }
  return {
    min: val.min ?? props.question.min,
    max: val.max ?? props.question.max
  }
})

const rangeFillStyle = computed(() => {
  const min = props.question.min
  const max = props.question.max
  const left = ((rangeValue.value.min - min) / (max - min)) * 100
  const right = ((rangeValue.value.max - min) / (max - min)) * 100
  return {
    left: `${left}%`,
    width: `${right - left}%`
  }
})

const handleRangeMinChange = (value) => {
  const numValue = Number(value)
  const newMax = rangeValue.value.max
  const newValue = {
    min: Math.min(numValue, newMax),
    max: newMax
  }
  emit('update:modelValue', newValue)
}

const handleRangeMaxChange = (value) => {
  const numValue = Number(value)
  const newMin = rangeValue.value.min
  const newValue = {
    min: newMin,
    max: Math.max(numValue, newMin)
  }
  emit('update:modelValue', newValue)
}

// ========== 日期选择相关 ==========
const currentYear = new Date().getFullYear()
const yearOptions = computed(() => {
  const startYear = props.question.startYear || currentYear - 100
  const endYear = props.question.endYear || currentYear
  const years = []
  for (let y = endYear; y >= startYear; y--) {
    years.push(y)
  }
  return years
})

const dateValue = computed(() => {
  if (!props.modelValue) {
    return { year: '', month: '', day: '' }
  }
  const parts = String(props.modelValue).split('-')
  return {
    year: parts[0] || '',
    month: parts[1] ? parseInt(parts[1]) : '',
    day: parts[2] ? parseInt(parts[2]) : ''
  }
})

const dayOptions = computed(() => {
  const month = dateValue.value.month
  const year = dateValue.value.year
  if (!month) return 31
  const daysInMonth = new Date(year || 2000, month, 0).getDate()
  return daysInMonth
})

const handleDateChange = (field, value) => {
  const newDate = { ...dateValue.value, [field]: value ? parseInt(value) : '' }
  if (newDate.year && newDate.month && newDate.day) {
    const formatted = `${newDate.year}-${String(newDate.month).padStart(2, '0')}-${String(newDate.day).padStart(2, '0')}`
    emit('update:modelValue', formatted)
  } else {
    emit('update:modelValue', '')
  }
}

// ========== 地区选择相关 ==========
const provinces = ref([
  { code: '11', name: '北京市' },
  { code: '12', name: '天津市' },
  { code: '13', name: '河北省' },
  { code: '14', name: '山西省' },
  { code: '15', name: '内蒙古自治区' },
  { code: '21', name: '辽宁省' },
  { code: '22', name: '吉林省' },
  { code: '23', name: '黑龙江省' },
  { code: '31', name: '上海市' },
  { code: '32', name: '江苏省' },
  { code: '33', name: '浙江省' },
  { code: '34', name: '安徽省' },
  { code: '35', name: '福建省' },
  { code: '36', name: '江西省' },
  { code: '37', name: '山东省' },
  { code: '41', name: '河南省' },
  { code: '42', name: '湖北省' },
  { code: '43', name: '湖南省' },
  { code: '44', name: '广东省' },
  { code: '45', name: '广西壮族自治区' },
  { code: '46', name: '海南省' },
  { code: '50', name: '重庆市' },
  { code: '51', name: '四川省' },
  { code: '52', name: '贵州省' },
  { code: '53', name: '云南省' },
  { code: '54', name: '西藏自治区' },
  { code: '61', name: '陕西省' },
  { code: '62', name: '甘肃省' },
  { code: '63', name: '青海省' },
  { code: '64', name: '宁夏回族自治区' },
  { code: '65', name: '新疆维吾尔自治区' }
])

const cities = ref([])
const districts = ref([])

const regionValue = computed(() => {
  const val = props.modelValue || {}
  return {
    province: val.province || '',
    city: val.city || '',
    district: val.district || ''
  }
})

const regionDisplay = computed(() => {
  const val = regionValue.value
  if (!val.province) return ''
  const provinceName = provinces.value.find(p => p.code === val.province)?.name || ''
  const cityName = cities.value.find(c => c.code === val.city)?.name || ''
  const districtName = districts.value.find(d => d.code === val.district)?.name || ''
  return [provinceName, cityName, districtName].filter(Boolean).join(' ')
})

const handleProvinceChange = (provinceCode) => {
  cities.value = getCitiesByProvince(provinceCode)
  districts.value = []
  const newValue = {
    province: provinceCode,
    city: '',
    district: ''
  }
  emit('update:modelValue', newValue)
}

const handleCityChange = (cityCode) => {
  districts.value = getDistrictsByCity(cityCode)
  const newValue = {
    ...regionValue.value,
    city: cityCode,
    district: ''
  }
  emit('update:modelValue', newValue)
}

const handleDistrictChange = (districtCode) => {
  const newValue = {
    ...regionValue.value,
    district: districtCode
  }
  emit('update:modelValue', newValue)
}

const getCitiesByProvince = (provinceCode) => {
  const cityData = {
    '61': [
      { code: '6101', name: '西安市' },
      { code: '6102', name: '铜川市' },
      { code: '6103', name: '宝鸡市' },
      { code: '6104', name: '咸阳市' },
      { code: '6105', name: '渭南市' },
      { code: '6106', name: '延安市' },
      { code: '6107', name: '汉中市' },
      { code: '6108', name: '榆林市' },
      { code: '6109', name: '安康市' },
      { code: '6110', name: '商洛市' }
    ],
    '14': [
      { code: '1401', name: '太原市' },
      { code: '1402', name: '大同市' },
      { code: '1403', name: '阳泉市' },
      { code: '1404', name: '长治市' },
      { code: '1405', name: '晋城市' },
      { code: '1406', name: '朔州市' },
      { code: '1407', name: '晋中市' },
      { code: '1408', name: '运城市' },
      { code: '1409', name: '忻州市' },
      { code: '1410', name: '临汾市' },
      { code: '1411', name: '吕梁市' }
    ],
    '41': [
      { code: '4101', name: '郑州市' },
      { code: '4102', name: '开封市' },
      { code: '4103', name: '洛阳市' },
      { code: '4104', name: '平顶山市' },
      { code: '4105', name: '安阳市' },
      { code: '4106', name: '鹤壁市' },
      { code: '4107', name: '新乡市' },
      { code: '4108', name: '焦作市' },
      { code: '4109', name: '濮阳市' },
      { code: '4110', name: '许昌市' },
      { code: '4111', name: '漯河市' },
      { code: '4112', name: '三门峡市' },
      { code: '4113', name: '南阳市' },
      { code: '4114', name: '商丘市' },
      { code: '4115', name: '信阳市' },
      { code: '4116', name: '周口市' },
      { code: '4117', name: '驻马店市' }
    ],
    '42': [
      { code: '4201', name: '武汉市' },
      { code: '4202', name: '黄石市' },
      { code: '4203', name: '十堰市' },
      { code: '4205', name: '宜昌市' },
      { code: '4206', name: '襄阳市' },
      { code: '4207', name: '鄂州市' },
      { code: '4208', name: '荆门市' },
      { code: '4209', name: '孝感市' },
      { code: '4210', name: '荆州市' },
      { code: '4211', name: '黄冈市' },
      { code: '4212', name: '咸宁市' },
      { code: '4213', name: '随州市' }
    ],
    '51': [
      { code: '5101', name: '成都市' },
      { code: '5103', name: '自贡市' },
      { code: '5104', name: '攀枝花市' },
      { code: '5105', name: '泸州市' },
      { code: '5106', name: '德阳市' },
      { code: '5107', name: '绵阳市' },
      { code: '5108', name: '广元市' },
      { code: '5109', name: '遂宁市' },
      { code: '5110', name: '内江市' },
      { code: '5111', name: '乐山市' },
      { code: '5113', name: '南充市' },
      { code: '5114', name: '眉山市' },
      { code: '5115', name: '宜宾市' },
      { code: '5116', name: '广安市' },
      { code: '5117', name: '达州市' },
      { code: '5118', name: '雅安市' },
      { code: '5119', name: '巴中市' },
      { code: '5120', name: '资阳市' }
    ],
    '50': [
      { code: '5001', name: '重庆市' }
    ]
  }
  return cityData[provinceCode] || []
}

const getDistrictsByCity = (cityCode) => {
  const districtData = {
    '6101': [
      { code: '610102', name: '新城区' },
      { code: '610103', name: '碑林区' },
      { code: '610104', name: '莲湖区' },
      { code: '610111', name: '灞桥区' },
      { code: '610112', name: '未央区' },
      { code: '610113', name: '雁塔区' },
      { code: '610114', name: '阎良区' },
      { code: '610115', name: '临潼区' },
      { code: '610116', name: '长安区' },
      { code: '610117', name: '高陵区' },
      { code: '610118', name: '鄠邑区' }
    ],
    '6104': [
      { code: '610402', name: '秦都区' },
      { code: '610403', name: '杨陵区' },
      { code: '610404', name: '渭城区' },
      { code: '610422', name: '三原县' },
      { code: '610423', name: '泾阳县' },
      { code: '610424', name: '乾县' },
      { code: '610425', name: '礼泉县' },
      { code: '610426', name: '永寿县' },
      { code: '610428', name: '长武县' },
      { code: '610429', name: '旬邑县' },
      { code: '610430', name: '淳化县' },
      { code: '610431', name: '武功县' },
      { code: '610481', name: '兴平市' }
    ],
    '1401': [
      { code: '140105', name: '小店区' },
      { code: '140106', name: '迎泽区' },
      { code: '140107', name: '杏花岭区' },
      { code: '140108', name: '尖草坪区' },
      { code: '140109', name: '万柏林区' },
      { code: '140110', name: '晋源区' },
      { code: '140121', name: '清徐县' },
      { code: '140122', name: '阳曲县' },
      { code: '140123', name: '娄烦县' },
      { code: '140181', name: '古交市' }
    ]
  }
  return districtData[cityCode] || []
}

watch(() => regionValue.value.province, (newProvince) => {
  if (newProvince) {
    cities.value = getCitiesByProvince(newProvince)
  }
}, { immediate: true })

watch(() => regionValue.value.city, (newCity) => {
  if (newCity) {
    districts.value = getDistrictsByCity(newCity)
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

/* 双滑块容器 */
.range-slider-container {
  padding: 20px 0;
  
  .range-track {
    position: relative;
    width: 100%;
    height: 6px;
    background: #e8e8e8;
    border-radius: 3px;
  }
  
  .range-fill {
    position: absolute;
    height: 100%;
    background: #555;
    border-radius: 3px;
    pointer-events: none;
  }
  
  .range-input {
    position: absolute;
    width: 100%;
    height: 6px;
    background: transparent;
    pointer-events: none;
    -webkit-appearance: none;
    appearance: none;
    top: 0;
    
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
      pointer-events: auto;
    }
    
    &::-moz-range-thumb {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: #555;
      cursor: pointer;
      border: none;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      pointer-events: auto;
    }
  }
  
  .range-labels {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 16px;
    
    .range-label-min,
    .range-label-max {
      font-size: 20px;
      font-weight: 600;
      color: #333;
    }
    
    .range-label-unit {
      font-size: 14px;
      color: #888;
    }
  }
}

/* 日期选择容器 */
.date-container {
  .date-selects {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  
  .date-select {
    flex: 1;
    min-width: 80px;
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
    
    &:hover {
      border-color: #ccc;
    }
    
    &:focus {
      outline: none;
      border-color: #333;
      box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.08);
    }
  }
  
  .date-separator {
    font-size: 14px;
    color: #888;
    flex-shrink: 0;
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
