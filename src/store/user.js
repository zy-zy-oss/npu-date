import { defineStore } from 'pinia'
import { ref, computed, shallowRef } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 问卷数据存储
  const questionnaire = shallowRef(JSON.parse(localStorage.getItem('questionnaire') || 'null'))
  const subQuestionnaire_date = shallowRef(JSON.parse(localStorage.getItem('subQuestionnaire_date') || 'null'))
  const subQuestionnaire_buddy = shallowRef(JSON.parse(localStorage.getItem('subQuestionnaire_buddy') || 'null'))
  const crushList = shallowRef(JSON.parse(localStorage.getItem('crushList') || '[]'))
  const matchResult = shallowRef(JSON.parse(localStorage.getItem('matchResult') || 'null'))

  const isMatched = computed(() => !!matchResult.value)

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

  function setSubQuestionnaire(type, data) {
    if (type === 'date') {
      subQuestionnaire_date.value = data
      if (data) {
        localStorage.setItem('subQuestionnaire_date', JSON.stringify(data))
      } else {
        localStorage.removeItem('subQuestionnaire_date')
      }
    } else if (type === 'buddy') {
      subQuestionnaire_buddy.value = data
      if (data) {
        localStorage.setItem('subQuestionnaire_buddy', JSON.stringify(data))
      } else {
        localStorage.removeItem('subQuestionnaire_buddy')
      }
    }
  }

  function getSubQuestionnaire(type) {
    if (type === 'date') {
      return subQuestionnaire_date.value
    } else if (type === 'buddy') {
      return subQuestionnaire_buddy.value
    }
    return null
  }

  function clearAllData() {
    questionnaire.value = null
    subQuestionnaire_date.value = null
    subQuestionnaire_buddy.value = null
    crushList.value = []
    matchResult.value = null
    localStorage.clear()
  }

  return {
    questionnaire,
    subQuestionnaire_date,
    subQuestionnaire_buddy,
    crushList,
    matchResult,
    isMatched,
    setQuestionnaire,
    setSubQuestionnaire,
    getSubQuestionnaire,
    setCrushList,
    setMatchResult,
    clearAllData
  }
})
