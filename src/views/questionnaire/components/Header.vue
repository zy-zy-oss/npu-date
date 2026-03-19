<template>
    <!-- 头部 -->
    <div class="header">
        <div class="header-top">
            <button class="back-btn" @click="$router.back()" title="返回">
                <i class="fas fa-arrow-left"></i>
            </button>
            <div class="header-info">
                <h1 class="page-title">填写您的信息</h1>
                <div class="progress-info">{{ currentIndex + 1 }}/{{ totalCount }}</div>
            </div>
        </div>
        <div class="progress-bar-wrapper">
            <div class="progress-bar">
                <div class="progress-fill" :style="{ width: progress + '%' }"></div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue';
const props = defineProps({
    // 字符串类型，必传
    currentIndex: {
        type: Number,
        required: true
    },
    // 数字类型，非必传，有默认值
    totalCount: {
        type: Number,
        required: true
    }
})
const progress = computed(() => {
  return Math.round(((props.currentIndex + 1) /props.totalCount) * 100)
})
</script>
<style lang="scss" scoped>
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

            .progress-fill {
                height: 100%;
                background: #333;
                border-radius: 1px;
                transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            }
        }
    }
}

</style>