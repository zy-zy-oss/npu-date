import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref(JSON.parse(localStorage.getItem('userInfo') || 'null'))
  const token = ref(localStorage.getItem('token') || '')
  const questionnaire = ref(JSON.parse(localStorage.getItem('questionnaire') || 'null'))
  const crushList = ref(JSON.parse(localStorage.getItem('crushList') || '[]'))
  const matchResult = ref(JSON.parse(localStorage.getItem('matchResult') || 'null'))

  const isLoggedIn = computed(() => !!token.value)
  const isAdmin = computed(() => userInfo.value?.role === 'admin')
  const isMatched = computed(() => !!matchResult.value)

  function setUserInfo(info) {
    userInfo.value = info
    if (info) {
      localStorage.setItem('userInfo', JSON.stringify(info))
    } else {
      localStorage.removeItem('userInfo')
    }
  }

  function setToken(newToken) {
    token.value = newToken
    if (newToken) {
      localStorage.setItem('token', newToken)
    } else {
      localStorage.removeItem('token')
    }
  }

  function setQuestionnaire(data) {
    questionnaire.value = data
    if (data) {
      localStorage.setItem('questionnaire', JSON.stringify(data))
    } else {
      localStorage.removeItem('questionnaire')
    }
  }

  function setCrushList(list) {
    crushList.value = list
    localStorage.setItem('crushList', JSON.stringify(list))
  }

  function setMatchResult(result) {
    matchResult.value = result
    if (result) {
      localStorage.setItem('matchResult', JSON.stringify(result))
    } else {
      localStorage.removeItem('matchResult')
    }
  }

  function logout() {
    userInfo.value = null
    token.value = null
    questionnaire.value = null
    crushList.value = []
    matchResult.value = null
    localStorage.clear()
  }

  return {
    userInfo,
    token,
    questionnaire,
    crushList,
    matchResult,
    isLoggedIn,
    isAdmin,
    isMatched,
    setUserInfo,
    setToken,
    setQuestionnaire,
    setCrushList,
    setMatchResult,
    logout
  }
})