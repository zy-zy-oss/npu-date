import axios from 'axios'

// 创建axios实例 - 根据环境自动选择baseURL
const service = axios.create({
  baseURL: import.meta.env.VUE_APP_API_BASE_URL || 'http://localhost:5001/api',
  timeout: 10000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

// 发送验证码
export const sendVerifyCode = async (email) => {
  return service.post('/auth/send-code', { email })
}

// 验证邮箱验证码
export const verifyEmail = async (email, code) => {
  return service.post('/auth/verify-code', { email, code })
}

// 提交问卷（带邮箱验证）
export const submitQuestionnaireWithVerify = async (data) => {
  return service.post('/questionnaire/submit', data)
}

// 获取问卷题目
export const getQuestionnaire = async () => {
  return service.get('/questionnaire')
}

// 获取子问卷题目（date/buddy）
export const getSubQuestionnaire = async (type) => {
  return service.get(`/questionnaire/type/${type}`)
}

// 提交问卷
export const submitQuestionnaire = async (data) => {
  // data 可能是 { answers: {...}, email: '...' } 或直接是 {...}
  const answers = data.answers || data
  const submitData = { answers }
  
  // 如果有email，添加到提交数据中
  if (data.email) {
    submitData.email = data.email
  }
  
  return service.post('/questionnaire/submit', submitData)
}

export default service