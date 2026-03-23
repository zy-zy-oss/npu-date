<template>
  <div id="app">
    <RouterView v-slot="{ Component }">
      <KeepAlive :max="5" :include="['Home', 'Questionnaire', 'SubQuestionnaire', 'QuestionnaireComplete']">
        <component :is="Component" :key="$route.fullPath" />
      </KeepAlive>
    </RouterView>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'

onMounted(() => {
  // 初始化一些全局配置
})
</script>

<style lang="scss">
#app {
  min-height: 100vh;
  background-color: #f5f5f5;
}
</style>