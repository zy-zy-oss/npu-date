<template>
  <div class="questionnaire-page">
    <!-- 头部 -->
    <div class="header">
      <div class="header-top">
        <button class="back-btn" @click="handleBack" title="返回">
          <i class="fas fa-arrow-left"></i>
        </button>
        <div class="header-info">
          <h1 class="page-title">{{ pageTitle }}</h1>
          <div class="progress-info">{{ currentIndex + 1 }}/{{ questions.length }}</div>
        </div>
      </div>
      <div class="progress-bar-wrapper">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
      </div>
    </div>
    
    <!-- 问卷内容 -->
    <div class="content-wrapper">
      <!-- 问卷完成后的邮箱输入界面 -->
      <div v-if="questionnaireDone" class="email-verify-card">
        <div class="complete-header">
          <h2>问卷已完成！</h2>
          <p>请输入您的邮箱进行验证</p>
        </div>

        <!-- 邮箱输入步骤 -->
        <div v-if="emailVerifyStep === 'input'" class="email-input-step">
          <div class="email-form">
            <div class="email-input-wrapper">
              <input 
                v-model="emailLocalPart"
                type="text"
                placeholder="邮箱名称"
                class="email-local-input"
                @keyup.enter="sendVerifyCode"
              />
              <span class="email-at">@</span>
              <select 
                v-model="emailDomain"
                class="email-domain-select"
              >
                <option value="nwpu.edu.cn">nwpu.edu.cn</option>
                <option value="mail.nwpu.edu.cn">mail.nwpu.edu.cn</option>
              </select>
            </div>
            <button 
              class="send-code-btn"
              @click="sendVerifyCode"
              :disabled="!isValidEmail || emailSending"
            >
              {{ emailSending ? '...' : '发送' }}
            </button>
          </div>
        </div>

        <!-- 验证码输入步骤 -->
        <div v-if="emailVerifyStep === 'verify'" class="code-verify-step">
          <div class="verify-hint">
            已发送至 <span class="email-display">{{ emailInput }}</span>
          </div>
          <div class="verify-code-form">
            <input 
              v-model="emailVerifyCode"
              type="text"
              placeholder="验证码"
              maxlength="6"
              class="verify-code-input"
              @keyup.enter="confirmEmailVerify"
            />
            <button 
              class="verify-confirm-btn"
              @click="confirmEmailVerify"
              :disabled="submitting"
            >
              {{ submitting ? '提交中...' : '验证' }}
            </button>
          </div>
          <div class="verify-actions">
            <button 
              class="change-email-link"
              @click="changeEmail"
              :disabled="emailCountdown > 0"
            >
              换邮箱
            </button>
            <span class="countdown-hint">{{ emailCountdown }}s</span>
          </div>
        </div>
      </div>

      <!-- 问卷问题卡片 -->
      <div v-else-if="currentQuestion" class="question-card">
        <div class="question-meta">
          <span class="question-number">Q{{ currentQuestion.id }}</span>
        </div>
        
        <h2 class="question-title">{{ currentQuestion.title }}</h2>
        
        <!-- 单选 -->
        <div v-if="currentQuestion.type === 'radio'" class="options-container">
          <label v-for="option in currentQuestion.options" :key="option.value" class="option">
            <input 
              type="radio" 
              :value="option.value" 
              v-model="answers[currentQuestion.key]"
              class="radio-input"
              @change="autoNextOnSingleChoice"
            />
            <span class="option-label">{{ option.label }}</span>
          </label>
        </div>
        
        <!-- 多选 -->
        <div v-if="currentQuestion.type === 'checkbox'" class="options-container">
          <label v-for="option in currentQuestion.options" :key="option.value" class="option">
            <input 
              type="checkbox" 
              :value="option.value"
              :checked="answers[currentQuestion.key]?.includes(option.value)"
              @change="handleCheckboxChange(currentQuestion.key, option.value)"
              class="checkbox-input"
            />
            <span class="option-label">{{ option.label }}</span>
          </label>
        </div>
        
        <!-- 文本输入 -->
        <textarea 
          v-if="currentQuestion.type === 'textarea'"
          v-model="answers[currentQuestion.key]"
          :placeholder="currentQuestion.placeholder"
          :maxlength="currentQuestion.maxLength"
          class="textarea-input"
        ></textarea>
        
        <!-- 滑块 -->
        <div v-if="currentQuestion.type === 'slider'" class="slider-container">
          <input 
            type="range"
            v-model.number="answers[currentQuestion.key]"
            :min="currentQuestion.min"
            :max="currentQuestion.max"
            :step="currentQuestion.step"
            class="range-slider"
          />
          <div class="slider-value">{{ answers[currentQuestion.key] }}</div>
        </div>
        
        <!-- 双滑块 -->
        <div v-if="currentQuestion.type === 'range'" class="range-slider-container">
          <div class="range-track">
            <div class="range-fill" :style="rangeFillStyle(currentQuestion)"></div>
            <input 
              type="range"
              :value="answers[currentQuestion.key]?.min || currentQuestion.min"
              @input="handleRangeMinChange(currentQuestion.key, $event.target.value, currentQuestion)"
              :min="currentQuestion.min"
              :max="currentQuestion.max"
              :step="currentQuestion.step || 1"
              class="range-input range-min"
            />
            <input 
              type="range"
              :value="answers[currentQuestion.key]?.max || currentQuestion.max"
              @input="handleRangeMaxChange(currentQuestion.key, $event.target.value, currentQuestion)"
              :min="currentQuestion.min"
              :max="currentQuestion.max"
              :step="currentQuestion.step || 1"
              class="range-input range-max"
            />
          </div>
          <div class="range-labels">
            <span class="range-label-min">{{ answers[currentQuestion.key]?.min || currentQuestion.min }}</span>
            <span class="range-label-unit">{{ currentQuestion.unit || '' }}</span>
            <span class="range-label-max">{{ answers[currentQuestion.key]?.max || currentQuestion.max }}</span>
          </div>
        </div>
        
        <!-- 时间选择（年月日时） -->
        <div v-if="currentQuestion.type === 'datetime'" class="datetime-container">
          <div class="datetime-selects">
            <select 
              v-model="datetimeValues[currentQuestion.key].year"
              class="datetime-select"
              @change="updateDatetimeAnswer(currentQuestion.key)"
            >
              <option value="">年</option>
              <option v-for="year in getYearOptions(currentQuestion)" :key="year" :value="year">{{ year }}</option>
            </select>
            <span class="datetime-separator">年</span>
            <select 
              v-model="datetimeValues[currentQuestion.key].month"
              class="datetime-select"
              @change="updateDatetimeAnswer(currentQuestion.key)"
            >
              <option value="">月</option>
              <option v-for="month in 12" :key="month" :value="month">{{ month }}</option>
            </select>
            <span class="datetime-separator">月</span>
            <select 
              v-model="datetimeValues[currentQuestion.key].day"
              class="datetime-select"
              @change="updateDatetimeAnswer(currentQuestion.key)"
            >
              <option value="">日</option>
              <option v-for="day in getDayOptions(currentQuestion.key)" :key="day" :value="day">{{ day }}</option>
            </select>
            <span class="datetime-separator">日</span>
            <select 
              v-model="datetimeValues[currentQuestion.key].hour"
              class="datetime-select"
              @change="updateDatetimeAnswer(currentQuestion.key)"
            >
              <option value="">时</option>
              <option v-for="hour in 24" :key="hour - 1" :value="hour - 1">{{ String(hour - 1).padStart(2, '0') }}</option>
            </select>
            <span class="datetime-separator">时</span>
          </div>
          <div v-if="currentQuestion.showPreview && answers[currentQuestion.key]" class="datetime-preview">
            {{ formatDatetime(answers[currentQuestion.key]) }}
          </div>
        </div>
        
        <!-- 地区选择（中国境内） -->
        <div v-if="currentQuestion.type === 'region'" class="region-container">
          <div class="region-selects">
            <select 
              v-model="regionValues[currentQuestion.key].province"
              class="region-select"
              @change="handleProvinceChange(currentQuestion.key)"
            >
              <option value="">请选择省份</option>
              <option v-for="province in provinces" :key="province.code" :value="province.code">{{ province.name }}</option>
            </select>
            <select 
              v-model="regionValues[currentQuestion.key].city"
              class="region-select"
              :disabled="!regionValues[currentQuestion.key].province"
              @change="handleCityChange(currentQuestion.key)"
            >
              <option value="">请选择城市</option>
              <option v-for="city in getCitiesByProvince(currentQuestion.key)" :key="city.code" :value="city.code">{{ city.name }}</option>
            </select>
            <select 
              v-model="regionValues[currentQuestion.key].district"
              class="region-select"
              :disabled="!regionValues[currentQuestion.key].city"
              @change="updateRegionAnswer(currentQuestion.key)"
            >
              <option value="">请选择区县</option>
              <option v-for="district in getDistrictsByCity(currentQuestion.key)" :key="district.code" :value="district.code">{{ district.name }}</option>
            </select>
          </div>
          <div v-if="currentQuestion.showPreview && answers[currentQuestion.key]" class="region-preview">
            {{ formatRegion(answers[currentQuestion.key]) }}
          </div>
        </div>
      </div>
      
      <div v-if="loading" class="loading-state">加载中...</div>
      
      <!-- 按钮区域 -->
      <div class="button-area" v-if="!questionnaireDone && !loading">
        <button 
          v-if="currentIndex > 0 || questionnairePhase !== 'base'"
          class="nav-btn prev-btn"
          @click="handlePrevOrBack"
          title="上一题"
        >
          <i class="fas fa-arrow-left"></i>
        </button>
        <div v-else></div>
        <button 
          v-if="currentIndex < questions.length - 1"
          class="nav-btn next-btn"
          @click="nextQuestion"
          :disabled="!canNext"
          title="下一题"
        >
          <i class="fas fa-arrow-right"></i>
        </button>
        <button 
          v-if="currentIndex === questions.length - 1 && questionnairePhase === 'base'"
          class="nav-btn next-btn"
          @click="completeQuestionnaire"
          :disabled="!canNext"
          title="继续"
        >
          <i class="fas fa-arrow-right"></i>
        </button>
        <button 
          v-if="currentIndex === questions.length - 1 && questionnairePhase !== 'base'"
          class="nav-btn complete-btn"
          @click="completeQuestionnaire"
          :disabled="!canNext"
          title="完成问卷"
        >
          完成
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { getQuestionnaire, submitQuestionnaire as submitApi } from '@/api'

const router = useRouter()
const userStore = useUserStore()

const loading = ref(true)
const submitting = ref(false)
const questions = ref([])
const currentIndex = ref(0)
const answers = ref({})

// 问卷阶段管理
const questionnairePhase = ref('base') // 'base' | 'date' | 'buddy'
const baseAnswers = ref({}) // 保存基础问卷答案

// 邮箱验证相关
const emailLocalPart = ref('')
const emailDomain = ref('')
const emailVerifyCode = ref('')
const emailVerifyStep = ref('input') // 'input' 或 'verify'
const emailSending = ref(false)
const emailCountdown = ref(60)
const questionnaireDone = ref(false) // 问卷是否已完成
let countdownInterval = null

// 时间选择相关
const datetimeValues = ref({})

// 地区选择相关
const regionValues = ref({})
const provinces = ref([])
const cities = ref([])
const districts = ref([])

// 中国省市区数据
const chinaRegions = {
  provinces: [
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
    { code: '65', name: '新疆维吾尔自治区' },
  ],
  cities: {
    '11': [{ code: '1101', name: '北京市' }],
    '12': [{ code: '1201', name: '天津市' }],
    '13': [
      { code: '1301', name: '石家庄市' },
      { code: '1302', name: '唐山市' },
      { code: '1303', name: '秦皇岛市' },
      { code: '1304', name: '邯郸市' },
      { code: '1305', name: '邢台市' },
      { code: '1306', name: '保定市' },
      { code: '1307', name: '张家口市' },
      { code: '1308', name: '承德市' },
      { code: '1309', name: '沧州市' },
      { code: '1310', name: '廊坊市' },
      { code: '1311', name: '衡水市' },
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
      { code: '1411', name: '吕梁市' },
    ],
    '15': [
      { code: '1501', name: '呼和浩特市' },
      { code: '1502', name: '包头市' },
      { code: '1503', name: '乌海市' },
      { code: '1504', name: '赤峰市' },
      { code: '1505', name: '通辽市' },
      { code: '1506', name: '鄂尔多斯市' },
      { code: '1507', name: '呼伦贝尔市' },
      { code: '1508', name: '巴彦淖尔市' },
      { code: '1509', name: '乌兰察布市' },
    ],
    '21': [
      { code: '2101', name: '沈阳市' },
      { code: '2102', name: '大连市' },
      { code: '2103', name: '鞍山市' },
      { code: '2104', name: '抚顺市' },
      { code: '2105', name: '本溪市' },
      { code: '2106', name: '丹东市' },
      { code: '2107', name: '锦州市' },
      { code: '2108', name: '营口市' },
      { code: '2109', name: '阜新市' },
      { code: '2110', name: '辽阳市' },
      { code: '2111', name: '盘锦市' },
      { code: '2112', name: '铁岭市' },
      { code: '2113', name: '朝阳市' },
      { code: '2114', name: '葫芦岛市' },
    ],
    '22': [
      { code: '2201', name: '长春市' },
      { code: '2202', name: '吉林市' },
      { code: '2203', name: '四平市' },
      { code: '2204', name: '辽源市' },
      { code: '2205', name: '通化市' },
      { code: '2206', name: '白山市' },
      { code: '2207', name: '松原市' },
      { code: '2208', name: '白城市' },
      { code: '2224', name: '延边朝鲜族自治州' },
    ],
    '23': [
      { code: '2301', name: '哈尔滨市' },
      { code: '2302', name: '齐齐哈尔市' },
      { code: '2303', name: '鸡西市' },
      { code: '2304', name: '鹤岗市' },
      { code: '2305', name: '双鸭山市' },
      { code: '2306', name: '大庆市' },
      { code: '2307', name: '伊春市' },
      { code: '2308', name: '佳木斯市' },
      { code: '2309', name: '七台河市' },
      { code: '2310', name: '牡丹江市' },
      { code: '2311', name: '黑河市' },
      { code: '2312', name: '绥化市' },
      { code: '2327', name: '大兴安岭地区' },
    ],
    '31': [{ code: '3101', name: '上海市' }],
    '32': [
      { code: '3201', name: '南京市' },
      { code: '3202', name: '无锡市' },
      { code: '3203', name: '徐州市' },
      { code: '3204', name: '常州市' },
      { code: '3205', name: '苏州市' },
      { code: '3206', name: '南通市' },
      { code: '3207', name: '连云港市' },
      { code: '3208', name: '淮安市' },
      { code: '3209', name: '盐城市' },
      { code: '3210', name: '扬州市' },
      { code: '3211', name: '镇江市' },
      { code: '3212', name: '泰州市' },
      { code: '3213', name: '宿迁市' },
    ],
    '33': [
      { code: '3301', name: '杭州市' },
      { code: '3302', name: '宁波市' },
      { code: '3303', name: '温州市' },
      { code: '3304', name: '嘉兴市' },
      { code: '3305', name: '湖州市' },
      { code: '3306', name: '绍兴市' },
      { code: '3307', name: '金华市' },
      { code: '3308', name: '衢州市' },
      { code: '3309', name: '舟山市' },
      { code: '3310', name: '台州市' },
      { code: '3311', name: '丽水市' },
    ],
    '34': [
      { code: '3401', name: '合肥市' },
      { code: '3402', name: '芜湖市' },
      { code: '3403', name: '蚌埠市' },
      { code: '3404', name: '淮南市' },
      { code: '3405', name: '马鞍山市' },
      { code: '3406', name: '淮北市' },
      { code: '3407', name: '铜陵市' },
      { code: '3408', name: '安庆市' },
      { code: '3410', name: '黄山市' },
      { code: '3411', name: '滁州市' },
      { code: '3412', name: '阜阳市' },
      { code: '3413', name: '宿州市' },
      { code: '3415', name: '六安市' },
      { code: '3416', name: '亳州市' },
      { code: '3417', name: '池州市' },
      { code: '3418', name: '宣城市' },
    ],
    '35': [
      { code: '3501', name: '福州市' },
      { code: '3502', name: '厦门市' },
      { code: '3503', name: '莆田市' },
      { code: '3504', name: '三明市' },
      { code: '3505', name: '泉州市' },
      { code: '3506', name: '漳州市' },
      { code: '3507', name: '南平市' },
      { code: '3508', name: '龙岩市' },
      { code: '3509', name: '宁德市' },
    ],
    '36': [
      { code: '3601', name: '南昌市' },
      { code: '3602', name: '景德镇市' },
      { code: '3603', name: '萍乡市' },
      { code: '3604', name: '九江市' },
      { code: '3605', name: '新余市' },
      { code: '3606', name: '鹰潭市' },
      { code: '3607', name: '赣州市' },
      { code: '3608', name: '吉安市' },
      { code: '3609', name: '宜春市' },
      { code: '3610', name: '抚州市' },
      { code: '3611', name: '上饶市' },
    ],
    '37': [
      { code: '3701', name: '济南市' },
      { code: '3702', name: '青岛市' },
      { code: '3703', name: '淄博市' },
      { code: '3704', name: '枣庄市' },
      { code: '3705', name: '东营市' },
      { code: '3706', name: '烟台市' },
      { code: '3707', name: '潍坊市' },
      { code: '3708', name: '济宁市' },
      { code: '3709', name: '泰安市' },
      { code: '3710', name: '威海市' },
      { code: '3711', name: '日照市' },
      { code: '3713', name: '临沂市' },
      { code: '3714', name: '德州市' },
      { code: '3715', name: '聊城市' },
      { code: '3716', name: '滨州市' },
      { code: '3717', name: '菏泽市' },
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
      { code: '4117', name: '驻马店市' },
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
      { code: '4213', name: '随州市' },
      { code: '4228', name: '恩施土家族苗族自治州' },
    ],
    '43': [
      { code: '4301', name: '长沙市' },
      { code: '4302', name: '株洲市' },
      { code: '4303', name: '湘潭市' },
      { code: '4304', name: '衡阳市' },
      { code: '4305', name: '邵阳市' },
      { code: '4306', name: '岳阳市' },
      { code: '4307', name: '常德市' },
      { code: '4308', name: '张家界市' },
      { code: '4309', name: '益阳市' },
      { code: '4310', name: '郴州市' },
      { code: '4311', name: '永州市' },
      { code: '4312', name: '怀化市' },
      { code: '4313', name: '娄底市' },
      { code: '4331', name: '湘西土家族苗族自治州' },
    ],
    '44': [
      { code: '4401', name: '广州市' },
      { code: '4402', name: '韶关市' },
      { code: '4403', name: '深圳市' },
      { code: '4404', name: '珠海市' },
      { code: '4405', name: '汕头市' },
      { code: '4406', name: '佛山市' },
      { code: '4407', name: '江门市' },
      { code: '4408', name: '湛江市' },
      { code: '4409', name: '茂名市' },
      { code: '4412', name: '肇庆市' },
      { code: '4413', name: '惠州市' },
      { code: '4414', name: '梅州市' },
      { code: '4415', name: '汕尾市' },
      { code: '4416', name: '河源市' },
      { code: '4417', name: '阳江市' },
      { code: '4418', name: '清远市' },
      { code: '4419', name: '东莞市' },
      { code: '4420', name: '中山市' },
      { code: '4451', name: '潮州市' },
      { code: '4452', name: '揭阳市' },
      { code: '4453', name: '云浮市' },
    ],
    '45': [
      { code: '4501', name: '南宁市' },
      { code: '4502', name: '柳州市' },
      { code: '4503', name: '桂林市' },
      { code: '4504', name: '梧州市' },
      { code: '4505', name: '北海市' },
      { code: '4506', name: '防城港市' },
      { code: '4507', name: '钦州市' },
      { code: '4508', name: '贵港市' },
      { code: '4509', name: '玉林市' },
      { code: '4510', name: '百色市' },
      { code: '4511', name: '贺州市' },
      { code: '4512', name: '河池市' },
      { code: '4513', name: '来宾市' },
      { code: '4514', name: '崇左市' },
    ],
    '46': [
      { code: '4601', name: '海口市' },
      { code: '4602', name: '三亚市' },
      { code: '4603', name: '三沙市' },
      { code: '4604', name: '儋州市' },
    ],
    '50': [{ code: '5001', name: '重庆市' }],
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
      { code: '5120', name: '资阳市' },
    ],
    '52': [
      { code: '5201', name: '贵阳市' },
      { code: '5202', name: '六盘水市' },
      { code: '5203', name: '遵义市' },
      { code: '5204', name: '安顺市' },
      { code: '5205', name: '毕节市' },
      { code: '5206', name: '铜仁市' },
    ],
    '53': [
      { code: '5301', name: '昆明市' },
      { code: '5303', name: '曲靖市' },
      { code: '5304', name: '玉溪市' },
      { code: '5305', name: '保山市' },
      { code: '5306', name: '昭通市' },
      { code: '5307', name: '丽江市' },
      { code: '5308', name: '普洱市' },
      { code: '5309', name: '临沧市' },
    ],
    '54': [
      { code: '5401', name: '拉萨市' },
      { code: '5402', name: '日喀则市' },
      { code: '5403', name: '昌都市' },
      { code: '5404', name: '林芝市' },
      { code: '5405', name: '山南市' },
      { code: '5406', name: '那曲市' },
    ],
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
      { code: '6110', name: '商洛市' },
    ],
    '62': [
      { code: '6201', name: '兰州市' },
      { code: '6202', name: '嘉峪关市' },
      { code: '6203', name: '金昌市' },
      { code: '6204', name: '白银市' },
      { code: '6205', name: '天水市' },
      { code: '6206', name: '武威市' },
      { code: '6207', name: '张掖市' },
      { code: '6208', name: '平凉市' },
      { code: '6209', name: '酒泉市' },
      { code: '6210', name: '庆阳市' },
      { code: '6211', name: '定西市' },
      { code: '6212', name: '陇南市' },
    ],
    '63': [
      { code: '6301', name: '西宁市' },
      { code: '6302', name: '海东市' },
    ],
    '64': [
      { code: '6401', name: '银川市' },
      { code: '6402', name: '石嘴山市' },
      { code: '6403', name: '吴忠市' },
      { code: '6404', name: '固原市' },
      { code: '6405', name: '中卫市' },
    ],
    '65': [
      { code: '6501', name: '乌鲁木齐市' },
      { code: '6502', name: '克拉玛依市' },
    ],
  },
  districts: {
    '1101': [
      { code: '110101', name: '东城区' },
      { code: '110102', name: '西城区' },
      { code: '110105', name: '朝阳区' },
      { code: '110106', name: '丰台区' },
      { code: '110107', name: '石景山区' },
      { code: '110108', name: '海淀区' },
      { code: '110109', name: '门头沟区' },
      { code: '110111', name: '房山区' },
      { code: '110112', name: '通州区' },
      { code: '110113', name: '顺义区' },
      { code: '110114', name: '昌平区' },
      { code: '110115', name: '大兴区' },
      { code: '110116', name: '怀柔区' },
      { code: '110117', name: '平谷区' },
      { code: '110118', name: '密云区' },
      { code: '110119', name: '延庆区' },
    ],
    '1201': [
      { code: '120101', name: '和平区' },
      { code: '120102', name: '河东区' },
      { code: '120103', name: '河西区' },
      { code: '120104', name: '南开区' },
      { code: '120105', name: '河北区' },
      { code: '120106', name: '红桥区' },
      { code: '120110', name: '东丽区' },
      { code: '120111', name: '西青区' },
      { code: '120112', name: '津南区' },
      { code: '120113', name: '北辰区' },
      { code: '120114', name: '武清区' },
      { code: '120115', name: '宝坻区' },
      { code: '120116', name: '滨海新区' },
    ],
    '3101': [
      { code: '310101', name: '黄浦区' },
      { code: '310104', name: '徐汇区' },
      { code: '310105', name: '长宁区' },
      { code: '310106', name: '静安区' },
      { code: '310107', name: '普陀区' },
      { code: '310109', name: '虹口区' },
      { code: '310110', name: '杨浦区' },
      { code: '310112', name: '闵行区' },
      { code: '310113', name: '宝山区' },
      { code: '310114', name: '嘉定区' },
      { code: '310115', name: '浦东新区' },
      { code: '310116', name: '金山区' },
      { code: '310117', name: '松江区' },
      { code: '310118', name: '青浦区' },
      { code: '310120', name: '奉贤区' },
      { code: '310151', name: '崇明区' },
    ],
    '5001': [
      { code: '500101', name: '万州区' },
      { code: '500102', name: '涪陵区' },
      { code: '500103', name: '渝中区' },
      { code: '500104', name: '大渡口区' },
      { code: '500105', name: '江北区' },
      { code: '500106', name: '沙坪坝区' },
      { code: '500107', name: '九龙坡区' },
      { code: '500108', name: '南岸区' },
      { code: '500109', name: '北碚区' },
      { code: '500110', name: '綦江区' },
      { code: '500111', name: '大足区' },
      { code: '500112', name: '渝北区' },
      { code: '500113', name: '巴南区' },
      { code: '500114', name: '黔江区' },
      { code: '500115', name: '长寿区' },
      { code: '500116', name: '江津区' },
      { code: '500117', name: '合川区' },
      { code: '500118', name: '永川区' },
      { code: '500119', name: '南川区' },
    ],
  },
}

const emailInput = computed(() => {
  return emailLocalPart.value && emailDomain.value 
    ? `${emailLocalPart.value}@${emailDomain.value}`
    : ''
})

const isValidEmail = computed(() => {
  return emailLocalPart.value.trim() !== '' && emailDomain.value !== ''
})

onMounted(async () => {
  try {
    const res = await getQuestionnaire()
    questions.value = res.data.questions
    
    // 初始化省份列表
    provinces.value = chinaRegions.provinces
    
    initQuestionAnswers(questions.value)
    
    // 如果之前有保存的问卷，加载它
    if (userStore.questionnaire) {
      answers.value = { ...answers.value, ...userStore.questionnaire }
    }
  } catch (error) {
    console.error('加载问卷失败', error)
  } finally {
    loading.value = false
  }
})

const initQuestionAnswers = (questionList) => {
  questionList.forEach(q => {
    if (q.type === 'checkbox') {
      answers.value[q.key] = []
    } else if (q.type === 'slider') {
      answers.value[q.key] = q.defaultValue || q.min
    } else if (q.type === 'range') {
      answers.value[q.key] = {
        min: q.defaultMin || q.min,
        max: q.defaultMax || q.max
      }
    } else if (q.type === 'datetime') {
      datetimeValues.value[q.key] = {
        year: '',
        month: '',
        day: '',
        hour: ''
      }
      answers.value[q.key] = null
    } else if (q.type === 'region') {
      regionValues.value[q.key] = {
        province: '',
        city: '',
        district: ''
      }
      answers.value[q.key] = null
    } else {
      answers.value[q.key] = ''
    }
  })
}

const currentQuestion = computed(() => {
  return questions.value[currentIndex.value]
})

const progress = computed(() => {
  return Math.round(((currentIndex.value + 1) / questions.value.length) * 100)
})

const pageTitle = computed(() => {
  switch (questionnairePhase.value) {
    case 'date':
      return '约会偏好'
    case 'buddy':
      return '搭子偏好'
    default:
      return '填写您的信息'
  }
})

const canNext = computed(() => {
  const q = currentQuestion.value
  if (!q.required) return true
  
  const answer = answers.value[q.key]
  if (q.type === 'checkbox') {
    return answer && answer.length > 0
  }
  if (q.type === 'datetime') {
    return answer && answer.year && answer.month && answer.day && answer.hour !== undefined
  }
  if (q.type === 'region') {
    return answer && answer.province && answer.city && answer.district
  }
  if (q.type === 'range') {
    return answer && answer.min !== undefined && answer.max !== undefined
  }
  return !!answer
})


const nextQuestion = () => {
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++
  }
}

const prevQuestion = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

// 上一题或返回基础问卷
const handlePrevOrBack = () => {
  if (currentIndex.value > 0) {
    prevQuestion()
  } else if (questionnairePhase.value !== 'base') {
    handleBack()
  }
}

// 返回按钮处理
const handleBack = async () => {
  // 如果在子问卷阶段，返回基础问卷
  if (questionnairePhase.value !== 'base') {
    questionnairePhase.value = 'base'
    loading.value = true
    try {
      const res = await getQuestionnaire('base')
      questions.value = res.data.questions
      answers.value = { ...baseAnswers.value }
      currentIndex.value = questions.value.length - 1 // 返回到最后一题
    } catch (error) {
      console.error('返回基础问卷失败', error)
    } finally {
      loading.value = false
    }
  } else {
    // 在基础问卷阶段，返回上一页
    router.back()
  }
}

const handleCheckboxChange = (key, value) => {
  if (!answers.value[key]) {
    answers.value[key] = []
  }
  const index = answers.value[key].indexOf(value)
  if (index > -1) {
    answers.value[key].splice(index, 1)
  } else {
    answers.value[key].push(value)
  }
}

// 单选自动跳转到下一题
const autoNextOnSingleChoice = () => {
  // 延迟100ms后跳转，提供用户反馈
  setTimeout(() => {
    nextQuestion()
  }, 100)
}

// 双滑块相关方法
const rangeFillStyle = (question) => {
  const min = answers.value[question.key]?.min || question.min
  const max = answers.value[question.key]?.max || question.max
  const range = question.max - question.min
  const left = ((min - question.min) / range) * 100
  const right = ((max - question.min) / range) * 100
  return {
    left: `${left}%`,
    width: `${right - left}%`
  }
}

const handleRangeMinChange = (key, value, question) => {
  const numValue = Number(value)
  const currentMax = answers.value[key]?.max || question.max
  if (numValue <= currentMax - (question.minGap || 0)) {
    answers.value[key] = { ...answers.value[key], min: numValue }
  } else {
    answers.value[key] = { ...answers.value[key], min: currentMax - (question.minGap || 0) }
  }
}

const handleRangeMaxChange = (key, value, question) => {
  const numValue = Number(value)
  const currentMin = answers.value[key]?.min || question.min
  if (numValue >= currentMin + (question.minGap || 0)) {
    answers.value[key] = { ...answers.value[key], max: numValue }
  } else {
    answers.value[key] = { ...answers.value[key], max: currentMin + (question.minGap || 0) }
  }
}

// 时间选择相关方法
const getYearOptions = (question) => {
  const currentYear = new Date().getFullYear()
  const startYear = question.startYear || currentYear - 100
  const endYear = question.endYear || currentYear
  const years = []
  for (let y = endYear; y >= startYear; y--) {
    years.push(y)
  }
  return years
}

const getDayOptions = (key) => {
  const year = datetimeValues.value[key]?.year
  const month = datetimeValues.value[key]?.month
  if (!year || !month) return 31
  const daysInMonth = new Date(year, month, 0).getDate()
  return daysInMonth
}

const updateDatetimeAnswer = (key) => {
  const { year, month, day, hour } = datetimeValues.value[key]
  if (year && month && day && hour !== '') {
    answers.value[key] = {
      year: Number(year),
      month: Number(month),
      day: Number(day),
      hour: Number(hour)
    }
  } else {
    answers.value[key] = null
  }
}

const formatDatetime = (datetime) => {
  if (!datetime) return ''
  const { year, month, day, hour } = datetime
  return `${year}年${month}月${day}日 ${String(hour).padStart(2, '0')}时`
}

// 地区选择相关方法
const getCitiesByProvince = (key) => {
  const provinceCode = regionValues.value[key]?.province
  if (!provinceCode) return []
  return chinaRegions.cities[provinceCode] || []
}

const getDistrictsByCity = (key) => {
  const cityCode = regionValues.value[key]?.city
  if (!cityCode) return []
  return chinaRegions.districts[cityCode] || []
}

const handleProvinceChange = (key) => {
  regionValues.value[key].city = ''
  regionValues.value[key].district = ''
  updateRegionAnswer(key)
}

const handleCityChange = (key) => {
  regionValues.value[key].district = ''
  updateRegionAnswer(key)
}

const updateRegionAnswer = (key) => {
  const { province, city, district } = regionValues.value[key]
  if (province && city && district) {
    const provinceName = chinaRegions.provinces.find(p => p.code === province)?.name || ''
    const cityName = chinaRegions.cities[province]?.find(c => c.code === city)?.name || ''
    const districtName = chinaRegions.districts[city]?.find(d => d.code === district)?.name || ''
    answers.value[key] = {
      province: { code: province, name: provinceName },
      city: { code: city, name: cityName },
      district: { code: district, name: districtName }
    }
  } else {
    answers.value[key] = null
  }
}

const formatRegion = (region) => {
  if (!region) return ''
  return `${region.province.name} ${region.city.name} ${region.district.name}`
}

// 完成问卷，进入邮箱验证阶段
const completeQuestionnaire = async () => {
  // 校验所有必填项
  const allAnswered = questions.value
    .filter(q => q.required)
    .every(q => {
      const answer = answers.value[q.key]
      if (q.type === 'checkbox') {
        return answer && answer.length > 0
      }
      return !!answer
    })
  
  if (!allAnswered) {
    alert('请先完成所有必填项')
    return
  }
  
  // 基础问卷完成，检查是否需要跳转子问卷
  if (questionnairePhase.value === 'base') {
    const lookingFor = answers.value['lookingFor']
    
    // 保存基础问卷答案
    baseAnswers.value = { ...answers.value }
    
    // 根据选择加载子问卷
    if (lookingFor === 'date') {
      questionnairePhase.value = 'date'
      loading.value = true
      try {
        const res = await getQuestionnaire('date')
        questions.value = res.data.questions
        answers.value = {}
        initQuestionAnswers(questions.value)
        currentIndex.value = 0
      } catch (error) {
        console.error('加载约会问卷失败', error)
      } finally {
        loading.value = false
      }
    } else if (lookingFor === 'buddy') {
      questionnairePhase.value = 'buddy'
      loading.value = true
      try {
        const res = await getQuestionnaire('buddy')
        questions.value = res.data.questions
        answers.value = {}
        initQuestionAnswers(questions.value)
        currentIndex.value = 0
      } catch (error) {
        console.error('加载搭子问卷失败', error)
      } finally {
        loading.value = false
      }
    }
    return
  }
  
  // 子问卷完成，进入邮箱验证
  questionnaireDone.value = true
}

// 发送验证码
const sendVerifyCode = async () => {
  if (!isValidEmail.value) {
    alert('请输入正确的西北工业大学邮箱地址')
    return
  }
  
  emailSending.value = true
  try {
    // 模拟发送验证码
    await new Promise(resolve => setTimeout(resolve, 500))
    emailVerifyStep.value = 'verify'
    emailVerifyCode.value = ''
    emailCountdown.value = 60
    
    // 启动倒计时
    startCountdown()
  } catch (error) {
    alert('发送验证码失败')
    console.error(error)
  } finally {
    emailSending.value = false
  }
}

// 启动倒计时
const startCountdown = () => {
  if (countdownInterval) clearInterval(countdownInterval)
  
  countdownInterval = setInterval(() => {
    emailCountdown.value--
    if (emailCountdown.value <= 0) {
      clearInterval(countdownInterval)
      emailCountdown.value = 0
    }
  }, 1000)
}

// 确认邮箱验证
const confirmEmailVerify = async () => {
  if (!emailVerifyCode.value || emailVerifyCode.value.length !== 6) {
    alert('请输入6位验证码')
    return
  }
  
  // 验证码验证成功，提交问卷
  submitting.value = true
  try {
    // 合并基础问卷和子问卷的答案
    const allAnswers = {
      ...baseAnswers.value,
      ...answers.value,
      questionnaireType: questionnairePhase.value // 记录问卷类型
    }
    const res = await submitApi(allAnswers)
    if (res.code === 200) {
      userStore.setQuestionnaire(allAnswers)
      clearInterval(countdownInterval)
      // 跳转到完成页面
      router.push({
        path: '/questionnaire-complete',
        query: { email: emailInput.value }
      })
    } else {
      alert(res.message || '提交失败')
    }
  } catch (error) {
    alert('提交失败，请稍后重试')
    console.error('提交问卷错误', error)
  } finally {
    submitting.value = false
  }
}

// 更换邮箱
const changeEmail = () => {
  emailLocalPart.value = ''
  emailDomain.value = ''
  emailVerifyCode.value = ''
  emailVerifyStep.value = 'input'
  clearInterval(countdownInterval)
  emailCountdown.value = 60
}

</script>

<style lang="scss" scoped>
* {
  user-select: none;
  -webkit-user-select: none;
}

.questionnaire-page {
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fafafa;
  position: relative;
  overflow-x: hidden;
}

/* 背景 */
.page-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: inherit;
  z-index: 0;
  pointer-events: none;
}

/* 头部 */
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  
  .header-top {
    padding: 16px 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    
    .back-btn {
      width: 36px;
      height: 36px;
      padding: 0;
      background: #f5f5f5;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      color: #333;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      flex-shrink: 0;
      
      &:hover {
        background: #e8e8e8;
        color: #000;
      }
      
      &:active {
        background: #ddd;
      }
    }
    
    .header-info {
      flex: 1;
      
      .page-title {
        font-size: 18px;
        font-weight: 600;
        color: #1a1a1a;
        margin: 0;
        line-height: 1.2;
      }
      
      .progress-info {
        font-size: 12px;
        color: #999;
        margin-top: 4px;
      }
    }
  }
  
  .progress-bar-wrapper {
    padding: 0 20px 12px;
    
    .progress-bar {
      width: 100%;
      height: 2px;
      background: #e8e8e8;
      border-radius: 1px;
      overflow: hidden;
      
       .progress-fill {
         height: 100%;
         background: #333;
         border-radius: 1px;
         transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
       }
    }
  }
}

 /* 内容容器 */
 .content-wrapper {
   position: relative;
   z-index: 10;
   flex: 1;
   padding: 32px 20px 100px;
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: flex-start;
   overflow-y: auto;
   background: #fff;
 }

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
    
    .range-fill {
      position: absolute;
      height: 100%;
      background: #555;
      border-radius: 3px;
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
        pointer-events: auto;
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
        pointer-events: auto;
        border: none;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      }
    }
  }
  
  .range-labels {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 16px;
    
    .range-label-min,
    .range-label-max {
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }
    
    .range-label-unit {
      font-size: 14px;
      color: #666;
    }
  }
}

/* 时间选择容器 */
.datetime-container {
  .datetime-selects {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  
  .datetime-select {
    flex: 1;
    min-width: 70px;
    padding: 10px 8px;
    font-size: 14px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background: #fff;
    font-family: inherit;
    color: #333;
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'%3E%3Cpath fill='%23999' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 8px center;
    padding-right: 24px;
    text-align: center;
    
    &:focus {
      outline: none;
      border-color: #333;
      box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
    }
    
    option {
      color: #333;
      background: #fff;
    }
  }
  
  .datetime-separator {
    font-size: 14px;
    color: #666;
    font-weight: 500;
  }
  
  .datetime-preview {
    margin-top: 12px;
    padding: 10px 12px;
    background: #f9f9f9;
    border-radius: 6px;
    font-size: 14px;
    color: #333;
    text-align: center;
  }
}

/* 地区选择容器 */
.region-container {
  .region-selects {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .region-select {
    width: 100%;
    padding: 12px 14px;
    font-size: 14px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background: #fff;
    font-family: inherit;
    color: #333;
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'%3E%3Cpath fill='%23999' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 32px;
    
    &:focus {
      outline: none;
      border-color: #333;
      box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
    }
    
    &:disabled {
      background: #f5f5f5;
      cursor: not-allowed;
      color: #999;
    }
    
    option {
      color: #333;
      background: #fff;
    }
  }
  
  .region-preview {
    margin-top: 12px;
    padding: 10px 12px;
    background: #f9f9f9;
    border-radius: 6px;
    font-size: 14px;
    color: #333;
    text-align: center;
  }
}

/* 邮箱验证卡片 */
.email-verify-card {
  width: 100%;
  max-width: 580px;
  background: #fff;
  border: none;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  animation: slideIn 0.4s ease-out;
  
  .complete-header {
    text-align: center;
    margin-bottom: 32px;
    
    h2 {
      font-size: 24px;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0 0 8px 0;
    }
    
    p {
      font-size: 14px;
      color: #666;
      margin: 0;
    }
  }
  
  // 邮箱输入步骤样式
  .email-input-step {
    .email-form {
      display: flex;
      gap: 8px;
      align-items: flex-start;
    }
    
    .email-input-wrapper {
      flex: 1;
      display: flex;
      align-items: center;
      background: #fff;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      transition: all 0.2s ease;
      overflow: hidden;
      
      &:focus-within {
        border-color: #333;
        box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
      }
    }
    
    .email-local-input {
      flex: 1;
      min-width: 0;
      padding: 10px 12px;
      font-size: 14px;
      border: none;
      background: transparent;
      font-family: inherit;
      outline: none;
      color: #333;
      
      &::placeholder {
        color: #bbb;
      }
    }
    
    .email-at {
      font-size: 13px;
      color: #999;
      font-weight: 400;
      padding: 0 0.2px;
      flex-shrink: 0;
    }
    
    .email-domain-select {
      width: 130px;
      flex-shrink: 0;
      padding: 2px;
      font-size: 14px;
      border: none;
      background: transparent;
      font-family: inherit;
      outline: none;
      color: #333;
      cursor: pointer;
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'%3E%3Cpath fill='%23999' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 6px center;
      padding-right: 20px;
      
      option {
        color: #333;
        background: #fff;
        padding: 8px;
      }
    }
    
    .send-code-btn {
      height: 40px;
      padding: 0 14px;
      font-size: 13px;
      font-weight: 600;
      border: 1px solid #ccc;
      border-radius: 8px;
      background: #333;
      color: #fff;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
      flex-shrink: 0;
      
      &:hover:not(:disabled) {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        transform: translateY(-1px);
      }
      
      &:active:not(:disabled) {
        transform: translateY(0);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
      }
      
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }
  
  // 验证码输入步骤样式
  .code-verify-step {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .verify-hint {
    font-size: 13px;
    color: #666;
    padding: 10px 12px;
    background: #f9f9f9;
    border-radius: 6px;
    border: 1px solid #e8e8e8;
    
    .email-display {
      font-weight: 600;
      color: #333;
    }
  }
  
  .verify-code-form {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  
  .verify-code-input {
    flex: 1;
    padding: 10px 12px;
    font-size: 14px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-family: inherit;
    transition: all 0.2s ease;
    background: #fff;
    color: #333;
    
    &::placeholder {
      color: #bbb;
    }
    
    &:focus {
      outline: none;
      border-color: #333;
      box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
    }
  }
  
  .verify-confirm-btn {
    height: 40px;
    padding: 0 16px;
    font-size: 13px;
    font-weight: 600;
    border: 1px solid #ccc;
    border-radius: 8px;
    background: #333;
    color: #fff;
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;
    
    &:hover:not(:disabled) {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      transform: translateY(-1px);
    }
    
    &:active:not(:disabled) {
      transform: translateY(0);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
  
  .verify-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    
    .change-email-link {
      padding: 0;
      border: none;
      background: transparent;
      color: #555;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      transition: all 0.2s ease;
      
      &:hover:not(:disabled) {
        color: #333;
        text-decoration: underline;
      }
      
      &:active:not(:disabled) {
        opacity: 0.8;
      }
      
      &:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }
    }
    
    .countdown-hint {
      color: #999;
      font-weight: 500;
    }
  }
}

/* 邮箱验证容器 */
.email-verify-container {
  .email-form {
    display: flex;
    gap: 8px;
    align-items: flex-start;
  }
  
  .email-input-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    transition: all 0.2s ease;
    overflow: hidden;
    
     &:focus-within {
       border-color: #333;
       box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
     }
  }
  
  .email-local-input {
    flex: 1;
    min-width: 0;
    padding: 10px 12px;
    font-size: 14px;
    border: none;
    background: transparent;
    font-family: inherit;
    outline: none;
    color: #333;
    
    &::placeholder {
      color: #bbb;
    }
  }
  
  .email-at {
    font-size: 13px;
    color: #999;
    font-weight: 400;
    padding: 0 0.2px;
    flex-shrink: 0;
  }
  
  .email-domain-select {
    width: 130px;
    flex-shrink: 0;
    padding: 2px;
    font-size: 14px;
    border: none;
    background: transparent;
    font-family: inherit;
    outline: none;
    color: #333;
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'%3E%3Cpath fill='%23999' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 6px center;
    padding-right: 20px;
    
    option {
      color: #333;
      background: #fff;
      padding: 8px;
    }
  }
  
   .send-code-btn {
     height: 40px;
     padding: 0 14px;
     font-size: 13px;
     font-weight: 600;
     border: 1px solid #ccc;
     border-radius: 8px;
     background: #333;
     color: #fff;
     cursor: pointer;
     transition: all 0.2s ease;
     white-space: nowrap;
     flex-shrink: 0;
     
     &:hover:not(:disabled) {
       box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
       transform: translateY(-1px);
     }
     
     &:active:not(:disabled) {
       transform: translateY(0);
       box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
     }
     
     &:disabled {
       opacity: 0.5;
       cursor: not-allowed;
     }
   }
  
  // 第二步：验证码输入
  .code-verify-step {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .verify-hint {
    font-size: 13px;
    color: #666;
    padding: 10px 12px;
    background: #f9f9f9;
    border-radius: 6px;
    border: 1px solid #e8e8e8;
    
     .email-display {
       font-weight: 600;
       color: #333;
     }
  }
  
  .verify-code-form {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  
  .verify-code-input {
    flex: 1;
    padding: 10px 12px;
    font-size: 14px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-family: inherit;
    transition: all 0.2s ease;
    background: #fff;
    color: #333;
    
    &::placeholder {
      color: #bbb;
    }
    
    &:focus {
      outline: none;
      border-color: #333;
      box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
    }
  }
  
   .verify-confirm-btn {
     height: 40px;
     padding: 0 16px;
     font-size: 13px;
     font-weight: 600;
     border: 1px solid #ccc;
     border-radius: 8px;
     background: #333;
     color: #fff;
     cursor: pointer;
     transition: all 0.2s ease;
     flex-shrink: 0;
     
     &:hover:not(:disabled) {
       box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
       transform: translateY(-1px);
     }
     
     &:active:not(:disabled) {
       transform: translateY(0);
       box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
     }
     
     &:disabled {
       opacity: 0.5;
       cursor: not-allowed;
     }
   }
  
  .verify-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    
     .change-email-link {
       padding: 0;
       border: none;
       background: transparent;
       color: #555;
       cursor: pointer;
       font-size: 13px;
       font-weight: 500;
       transition: all 0.2s ease;
       
       &:hover {
         color: #333;
         text-decoration: underline;
       }
       
       &:active {
         opacity: 0.8;
       }
     }
    
    .countdown-hint {
      color: #999;
      font-weight: 500;
    }
  }
}

/* 加载状态 */
.loading-state {
  font-size: 20px;
  color: white;
  font-weight: 700;
  text-align: center;
  padding: 40px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

 /* 按钮区域 */
 .button-area {
   width: 100%;
   max-width: 580px;
   padding: 16px 0 0;
   display: flex;
   gap: 10px;
   justify-content: space-between;
   
   .nav-btn {
     height: 40px;
     width: auto;
     padding: 0 20px;
     font-size: 16px;
     font-weight: 400;
     border: 1px solid #e0e0e0;
     border-radius: 20px;
     cursor: pointer;
     background: #fff;
     color: #666;
     transition: all 0.2s ease;
     display: flex;
     align-items: center;
     justify-content: center;
     gap: 0;
     min-width: 60px;
     
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
       
       &.complete-btn {
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
@media (max-width: 768px) {
  .header-bar {
    gap: 12px;
    
    .back-btn {
      flex-shrink: 0;
    }
    
    .page-title {
      font-size: 20px;
      flex: 1;
    }
    
    .progress-text {
      font-size: 12px;
      min-width: 50px;
      text-align: right;
    }
  }
  
  .content-wrapper {
    padding: 16px;
  }
  
  .question-card,
  .email-verify-card {
    padding: 20px;
  }
  
  .button-area {
    flex-direction: row;
    gap: 8px;
    
    .nav-btn {
      height: 40px;
      min-width: 60px;
      
      &.complete-btn {
        width: auto;
        padding: 0 16px;
      }
    }
  }
}

@media (max-width: 480px) {
  .header-bar {
    padding: 12px 16px;
    
    .page-title {
      font-size: 18px;
    }
  }
  
  .question-card,
  .email-verify-card {
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
  
  .email-verify-card {
    .complete-header {
      margin-bottom: 24px;
      
      h2 {
        font-size: 20px;
        margin-bottom: 4px;
      }
      
      p {
        font-size: 12px;
      }
    }
  }
  
  .button-area {
    padding: 10px 12px;
    gap: 8px;
    
    .nav-btn {
      width: 36px;
      height: 36px;
      padding: 0;
      min-width: 36px;
      font-size: 14px;
      
      &.complete-btn {
        width: auto;
        padding: 0 16px;
      }
    }
  }
}
</style>