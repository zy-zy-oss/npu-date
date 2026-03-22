<!--测试账号test@nwpu.edu.cn 123456-->
<template>
  <div class="result-page">
    <!-- 头部 -->
    <div class="header">
      <div class="header-top">
        <button class="back-btn" @click="handleBackHome" title="返回首页">
          <i class="fas fa-arrow-left"></i>
        </button>
        <div class="header-info">
          <h1 class="page-title">我的匹配</h1>
        </div>
        <button class="logout-btn" @click="handleLogout" title="退出登录">
          <i class="fas fa-sign-out-alt"></i>
        </button>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 匹配设置卡片 -->
      <div class="settings-card">
        <h2 class="card-title">匹配设置</h2>

        <!-- 匹配方式 -->
        <div class="setting-item">
          <span class="setting-label">匹配方式</span>
          <div class="mode-buttons">
            <button
              class="mode-btn"
              :class="{ active: matchMode === '1v1' }"
              @click="matchMode = '1v1'"
            >
              1V1
            </button>
            <button
              class="mode-btn"
              :class="{ active: matchMode === 'nvn' }"
              @click="matchMode = 'nvn'"
            >
              NVN
            </button>
          </div>
        </div>

        <!-- 匹配状态 -->
        <div class="setting-item">
          <span class="setting-label">匹配状态</span>
          <div class="status-container">
            <span class="status-text" :class="{ active: isMatching }">
              {{ isMatching ? '正在匹配' : '暂停匹配' }}
            </span>
            <label class="switch">
              <input type="checkbox" v-model="isMatching">
              <span class="slider round"></span>
            </label>
          </div>
        </div>
      </div>

      <!-- 匹配结果卡片 -->
      <div class="result-card">
        <h2 class="card-title">匹配结果</h2>
        <div class="result-content">
          <div v-if="!hasCompletedQuestionnaire" class="empty-state">
            <div class="empty-icon">
              <i class="fas fa-clipboard-list"></i>
            </div>
            <p class="empty-text">请先完成问卷后查看匹配结果</p>
            <button class="action-btn primary" @click="handleRequestionnaire">去填写问卷</button>
          </div>
          <div v-else-if="!hasMatchResult" class="empty-state">
            <div class="empty-icon">
              <i class="fas fa-hourglass-half"></i>
            </div>
            <p class="empty-text">正在匹配中，敬请期待</p>
          </div>
          <div v-else-if="matchCandidates.length === 0" class="empty-state">
            <div class="empty-icon">
              <i class="fas fa-search"></i>
            </div>
            <p class="empty-text">暂未找到，请耐心静候</p>
          </div>
          <div v-else class="candidates-list">
            <div
              v-for="(candidate, index) in matchCandidates"
              :key="index"
              class="candidate-card"
            >
              <div class="candidate-header">
                <span class="candidate-index">候选人 {{ index + 1 }}</span>
              </div>
              <div class="candidate-info">
                <h3 class="candidate-name">{{ candidate.name }}</h3>
                <p class="candidate-basic-info">{{ candidate.school }} | {{ candidate.major }} | {{ candidate.age }}岁</p>
                <div class="info-section">
                  <h4>匹配理由</h4>
                  <p>{{ candidate.matchReason }}</p>
                </div>
                <div class="info-section">
                  <h4>个人简介</h4>
                  <p>{{ candidate.intro }}</p>
                </div>
              </div>
              <div class="candidate-actions">
                <button class="action-btn secondary" @click="handleDislike(index)">
                  <i class="fas fa-times"></i>
                  无感
                </button>
                <button class="action-btn primary" @click="handleLike(index)">
                  <i class="fas fa-heart"></i>
                  好感
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 个人信息卡片 -->
      <div class="info-card-section">
        <h2 class="card-title">个人信息</h2>
        <div class="info-content">
          <div class="info-row">
            <span class="info-label">邮箱</span>
            <span class="info-value">{{ userEmail }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">姓名</span>
            <span class="info-value">{{ userName }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">学校</span>
            <span class="info-value">{{ userSchool }}</span>
          </div>
        </div>
      </div>

      <!-- 底部按钮 -->
      <div class="bottom-buttons">
        <button class="bottom-btn secondary" @click="handleRequestionnaire">
          <i class="fas fa-redo"></i>
          重新填写问卷
        </button>
        <button class="bottom-btn primary" @click="handleBackHome">
          <i class="fas fa-home"></i>
          返回首页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'

const router = useRouter()
const userStore = useUserStore()

// 匹配方式
const matchMode = ref('1v1')

// 匹配状态
const isMatching = ref(true)

// 模拟数据 - 实际应该从API获取
const matchCandidates = ref([
  {
    name: '张三',
    school: '西北工业大学',
    major: '计算机科学与技术',
    age: 20,
    matchReason: '你们都喜欢电影和旅行，有相似的兴趣爱好',
    intro: '喜欢编程，热爱生活，希望能找到志同道合的朋友'
  },
  {
    name: '李四',
    school: '西安交通大学',
    major: '电气工程',
    age: 21,
    matchReason: '你们都对科技和创新有浓厚的兴趣',
    intro: '性格开朗，喜欢运动，擅长打篮球'
  }
])

// 计算属性
const hasCompletedQuestionnaire = computed(() => {
  return !!userStore.questionnaire
})

const hasMatchResult = computed(() => {
  return !!userStore.matchResult
})

const userEmail = computed(() => {
  return userStore.userInfo?.email || '未设置'
})

const userName = computed(() => {
  return userStore.userInfo?.name || '未设置'
})

const userSchool = computed(() => {
  return userStore.userInfo?.school || '未设置'
})

// 方法
const handleLogout = () => {
  userStore.logout()
  router.push('/')
}

const handleRequestionnaire = () => {
  router.push('/questionnaire')
}

const handleBackHome = () => {
  router.push('/')
}

const handleDislike = (index) => {
  // 处理无感操作
  console.log('Dislike candidate', index)
  // 这里可以添加API调用
}

const handleLike = (index) => {
  // 处理好感操作
  console.log('Like candidate', index)
  // 这里可以添加API调用
}

onMounted(() => {
  // 检查用户是否登录
  if (!userStore.isLoggedIn) {
    // 这里应该跳转到登录页面，暂时直接跳转到首页
    router.push('/')
  }
})
</script>

<style lang="scss" scoped>
* {
  user-select: none;
  -webkit-user-select: none;
}

.result-page {
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fafafa;
  position: relative;
  overflow-x: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
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

    .back-btn,
    .logout-btn {
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
      text-align: center;

      .page-title {
        font-size: 18px;
        font-weight: 600;
        color: #1a1a1a;
        margin: 0;
      }
    }
  }
}

/* 主内容区域 */
.main-content {
  flex: 1;
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  padding: 24px 20px 40px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 卡片标题 */
.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

/* 设置卡片 */
.settings-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);

  .setting-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 0;
    border-bottom: 1px solid #f5f5f5;

    &:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    &:first-child {
      padding-top: 0;
    }

    .setting-label {
      font-size: 14px;
      color: #333;
      font-weight: 500;
    }
  }
}

/* 匹配方式按钮 */
.mode-buttons {
  display: flex;
  gap: 8px;

  .mode-btn {
    padding: 8px 20px;
    font-size: 14px;
    font-weight: 500;
    color: #666;
    background: #f5f5f5;
    border: 1px solid transparent;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: #e8e8e8;
      color: #333;
    }

    &.active {
      background: #000;
      color: #fff;
      border-color: #000;
    }
  }
}

/* 匹配状态 */
.status-container {
  display: flex;
  align-items: center;
  gap: 12px;

  .status-text {
    font-size: 14px;
    color: #999;
    font-weight: 500;
    transition: color 0.2s ease;

    &.active {
      color: #000;
    }
  }

  /* 开关样式 */
  .switch {
    position: relative;
    display: inline-block;
    width: 44px;
    height: 24px;

    input {
      opacity: 0;
      width: 0;
      height: 0;

      &:checked + .slider {
        background-color: #000;
      }

      &:checked + .slider:before {
        transform: translateX(20px);
      }
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #d9d9d9;
      transition: .3s;
      border-radius: 24px;

      &:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: .3s;
        border-radius: 50%;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }
    }
  }
}

/* 结果卡片 */
.result-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);

  .result-content {
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px 20px;
      text-align: center;

      .empty-icon {
        width: 64px;
        height: 64px;
        background: #f5f5f5;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 16px;

        i {
          font-size: 24px;
          color: #999;
        }
      }

      .empty-text {
        font-size: 14px;
        color: #666;
        margin: 0 0 20px 0;
      }
    }

    .candidates-list {
      display: flex;
      flex-direction: column;
      gap: 16px;

      .candidate-card {
        background: #fafafa;
        border-radius: 10px;
        padding: 20px;
        border: 1px solid #f0f0f0;
        transition: all 0.2s ease;

        &:hover {
          border-color: #e0e0e0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .candidate-header {
          margin-bottom: 16px;

          .candidate-index {
            font-size: 12px;
            font-weight: 600;
            color: #666;
            background: #f0f0f0;
            padding: 4px 10px;
            border-radius: 4px;
          }
        }

        .candidate-info {
          margin-bottom: 20px;

          .candidate-name {
            font-size: 18px;
            font-weight: 600;
            color: #1a1a1a;
            margin: 0 0 8px 0;
          }

          .candidate-basic-info {
            font-size: 13px;
            color: #888;
            margin: 0 0 16px 0;
          }

          .info-section {
            margin-bottom: 12px;

            &:last-child {
              margin-bottom: 0;
            }

            h4 {
              font-size: 13px;
              font-weight: 600;
              color: #333;
              margin: 0 0 6px 0;
            }

            p {
              font-size: 14px;
              color: #666;
              line-height: 1.5;
              margin: 0;
            }
          }
        }

        .candidate-actions {
          display: flex;
          gap: 12px;
        }
      }
    }
  }
}

/* 个人信息卡片 */
.info-card-section {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);

  .info-content {
    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #f5f5f5;

      &:last-child {
        border-bottom: none;
        padding-bottom: 0;
      }

      &:first-child {
        padding-top: 0;
      }

      .info-label {
        font-size: 14px;
        color: #666;
      }

      .info-value {
        font-size: 14px;
        color: #333;
        font-weight: 500;
      }
    }
  }
}

/* 操作按钮 */
.action-btn {
  flex: 1;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: none;

  i {
    font-size: 14px;
  }

  &.primary {
    color: #fff;
    background: #000;

    &:hover {
      background: #333;
    }

    &:active {
      background: #000;
    }
  }

  &.secondary {
    color: #666;
    background: #f5f5f5;

    &:hover {
      background: #e8e8e8;
      color: #333;
    }

    &:active {
      background: #ddd;
    }
  }
}

/* 底部按钮 */
.bottom-buttons {
  display: flex;
  gap: 12px;
  margin-top: 8px;

  .bottom-btn {
    flex: 1;
    padding: 12px 20px;
    font-size: 14px;
    font-weight: 500;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: none;

    i {
      font-size: 14px;
    }

    &.primary {
      color: #fff;
      background: #000;

      &:hover {
        background: #333;
      }

      &:active {
        background: #000;
      }
    }

    &.secondary {
      color: #333;
      background: #fff;
      border: 1px solid #e0e0e0;

      &:hover {
        border-color: #999;
      }

      &:active {
        background: #f5f5f5;
      }
    }
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    padding: 16px 16px 32px;
    gap: 16px;
  }

  .settings-card,
  .result-card,
  .info-card-section {
    padding: 20px;
  }

  .mode-buttons {
    .mode-btn {
      padding: 6px 16px;
      font-size: 13px;
    }
  }

  .candidate-actions {
    flex-direction: column;
  }

  .bottom-buttons {
    flex-direction: column;
  }
}
</style>
