<template>
  <div class="crush-page">
    <van-nav-bar title="心动标记" left-arrow @click-left="$router.back()" />
    <div class="tips-card"><p>标记你心动的TA</p></div>
    <van-loading v-if="loading" class="loading" />
    <div v-else class="user-list">
      <van-cell v-for="user in userList" :key="user.id" :title="user.name" :label="user.grade + '级 ' + user.major" is-link />
    </div>
    <van-empty v-if="!loading && userList.length === 0" description="暂无用户" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getCrushList } from '@/api'
import { Toast } from 'vant'

const loading = ref(true)
const userList = ref([])

onMounted(async () => {
  try {
    const res = await getCrushList()
    userList.value = res.data
  } catch (error) {
    Toast.fail('获取用户列表失败')
  } finally {
    loading.value = false
  }
})
</script>

<style lang="scss" scoped>
.crush-page { min-height: 100vh; background: #f5f5f5; }
.tips-card { background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%); padding: 16px; text-align: center; p { color: #fff; margin: 0; } }
.loading { display: flex; justify-content: center; padding: 60px; }
.user-list { padding: 12px; }
</style>
