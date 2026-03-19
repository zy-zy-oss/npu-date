import axios from 'axios'
import { mockUsers, mockQuestionnaire, mockNotices, mockLogs, mockMatchResult, MOCK_DELAY } from '@/utils/mockData'

// 创建axios实例
const service = axios.create({
  baseURL: '/api',
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

// 模拟登录
export const login = async (email, password) => {
  await delay(MOCK_DELAY)
  const user = mockUsers.find(u => u.email === email)
  if (user && password === '123456') {
    return {
      code: 200,
      message: '登录成功',
      data: {
        token: 'mock_token_' + Date.now(),
        userInfo: user
      }
    }
  }
  return {
    code: 401,
    message: '邮箱或密码错误'
  }
}

// 模拟注册
export const register = async (email, password, code) => {
  await delay(MOCK_DELAY)
  const exists = mockUsers.find(u => u.email === email)
  if (exists) {
    return {
      code: 400,
      message: '该邮箱已注册，请直接登录'
    }
  }
  // 验证验证码
  if (code !== '123456') {
    return {
      code: 400,
      message: '验证码错误'
    }
  }
  // 验证西工大邮箱
  if (!email.endsWith('@nwpu.edu.cn')) {
    return {
      code: 400,
      message: '请使用西北工业大学邮箱注册'
    }
  }
  return {
    code: 200,
    message: '注册成功'
  }
}

// 模拟发送验证码
export const sendVerifyCode = async (email) => {
  await delay(MOCK_DELAY)
  if (!email.endsWith('@nwpu.edu.cn')) {
    return {
      code: 400,
      message: '请使用西北工业大学邮箱'
    }
  }
  return {
    code: 200,
    message: '验证码已发送',
    data: { code: '123456' }
  }
}

// 获取问卷题目
export const getQuestionnaire = async () => {
  await delay(MOCK_DELAY)
  return {
    code: 200,
    data: mockQuestionnaire
  }
}

// 提交问卷
export const submitQuestionnaire = async (data) => {
  await delay(MOCK_DELAY)
  return {
    code: 200,
    message: '问卷提交成功'
  }
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