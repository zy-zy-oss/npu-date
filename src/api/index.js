import axios from 'axios'
import { mockUsers, mockQuestionnaire, mockQuestionnaire_1, mockQuestionnaire_2, mockNotices, mockLogs, mockMatchResult, MOCK_DELAY } from '@/utils/mockData'

// 创建axios实例 - 指向真实后端
const service = axios.create({
  baseURL: 'http://localhost:5001/api',
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

// 模拟API延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))


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
  await delay(MOCK_DELAY)
  if (type === 'date') {
    return {
      code: 200,
      data: mockQuestionnaire_1
    }
  } else if (type === 'buddy') {
    return {
      code: 200,
      data: mockQuestionnaire_2
    }
  }
  return {
    code: 400,
    message: '问卷类型错误'
  }
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

// 获取心动列表
export const getCrushList = async () => {
  await delay(MOCK_DELAY)
  // 过滤掉已经匹配的用户
  const crushList = mockUsers.filter(u => u.gender !== mockUsers[0].gender && u.status === 'active')
  return {
    code: 200,
    data: crushList
  }
}

// 标记心动
export const addCrush = async (userId) => {
  await delay(MOCK_DELAY)
  return {
    code: 200,
    message: '心动标记成功'
  }
}

// 取消心动
export const removeCrush = async (userId) => {
  await delay(MOCK_DELAY)
  return {
    code: 200,
    message: '已取消心动'
  }
}

// 获取匹配结果
export const getMatchResult = async () => {
  await delay(MOCK_DELAY)
  return {
    code: 200,
    data: mockMatchResult
  }
}

// 获取用户列表（管理端）
export const getUserList = async (params) => {
  await delay(MOCK_DELAY)
  let users = [...mockUsers]
  
  if (params.status) {
    users = users.filter(u => u.status === params.status)
  }
  if (params.keyword) {
    users = users.filter(u => u.name.includes(params.keyword) || u.email.includes(params.keyword))
  }
  
  return {
    code: 200,
    data: {
      list: users,
      total: users.length,
      page: params.page || 1,
      pageSize: params.pageSize || 10
    }
  }
}

// 封禁/解封用户
export const toggleUserStatus = async (userId) => {
  await delay(MOCK_DELAY)
  return {
    code: 200,
    message: '操作成功'
  }
}

// 获取公告列表
export const getNotices = async () => {
  await delay(MOCK_DELAY)
  return {
    code: 200,
    data: mockNotices
  }
}

// 创建公告
export const createNotice = async (data) => {
  await delay(MOCK_DELAY)
  return {
    code: 200,
    message: '公告创建成功'
  }
}

// 更新公告
export const updateNotice = async (id, data) => {
  await delay(MOCK_DELAY)
  return {
    code: 200,
    message: '公告更新成功'
  }
}

// 删除公告
export const deleteNotice = async (id) => {
  await delay(MOCK_DELAY)
  return {
    code: 200,
    message: '公告删除成功'
  }
}

// 获取操作日志
export const getLogs = async (params) => {
  await delay(MOCK_DELAY)
  let logs = [...mockLogs]
  
  if (params.action) {
    logs = logs.filter(l => l.action === params.action)
  }
  
  return {
    code: 200,
    data: {
      list: logs,
      total: logs.length,
      page: params.page || 1,
      pageSize: params.pageSize || 10
    }
  }
}

// 获取个人信息
export const getUserProfile = async () => {
  await delay(MOCK_DELAY)
  const user = mockUsers[0]
  return {
    code: 200,
    data: user
  }
}

// 更新个人信息
export const updateUserProfile = async (data) => {
  await delay(MOCK_DELAY)
  return {
    code: 200,
    message: '信息更新成功'
  }
}

export default service