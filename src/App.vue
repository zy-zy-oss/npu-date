<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

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