# 🚀 NPU Date - 快速启动指南

## 📋 项目概览

NPU Date 是西北工业大学专属校园交友匹配平台的 Vue 3 前端应用。

- **框架**: Vue 3 (Composition API)
- **构建工具**: Vite 5
- **UI 框架**: Vant 4.8.3
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **样式**: SCSS

## 🎨 首页设计亮点

首页采用 **浩瀚星辰主题**，参考 Inspira UI 设计风格：

✨ **视觉元素**
- 极光背景动画（3 层渐变）
- 星空 Canvas 效果（250 颗闪烁星星）
- 流星划过效果（6 颗循环流星）
- 聚光灯卡片设计

🎬 **动画效果**
- 极光脉冲 (8-12s 循环)
- 页面元素入场动画
- Logo 聚光脉冲
- 卡片 Hover 上浮
- 流星下坠轨迹

## 🛠️ 安装与运行

### 1. 安装依赖
```bash
cd npu-date-web
npm install
```

### 2. 启动开发服务器
```bash
npm run dev
```

访问: http://localhost:3000

### 3. 构建生产版本
```bash
npm run build
```

输出: `dist/` 目录

### 4. 预览生产构建
```bash
npm run preview
```

## 📁 项目结构

```
npu-date-web/
├── src/
│   ├── components/          # 可复用组件
│   │   ├── StarField.vue    # 星空 Canvas 组件
│   │   ├── Meteors.vue      # 流星效果组件
│   │   └── AuroraBackground.vue
│   ├── views/               # 页面组件
│   │   ├── Home.vue         # 首页 ✨ 新设计
│   │   ├── Login.vue
│   │   ├── Register.vue
│   │   ├── Questionnaire.vue
│   │   ├── MatchResult.vue
│   │   ├── Crush.vue
│   │   ├── Profile.vue
│   │   └── Admin.vue
│   ├── api/
│   │   └── index.js         # Mock API 接口
│   ├── store/
│   │   └── user.js          # Pinia 用户状态
│   ├── router/
│   │   └── index.js         # 路由配置
│   ├── utils/
│   │   └── mockData.js      # Mock 数据
│   ├── assets/
│   │   └── styles/
│   │       └── index.scss   # 全局样式
│   ├── App.vue              # 根组件
│   └── main.js              # 入口文件
├── package.json
├── vite.config.js
├── index.html
└── HOMEPAGE_DESIGN.md       # 首页设计文档
```

## 🔑 主要页面

| 页面 | 路由 | 功能 |
|------|------|------|
| 首页 | `/` | 展示平台介绍和功能入口 ⭐ |
| 登录 | `/login` | 使用西工大邮箱登录 |
| 注册 | `/register` | 新用户注册 |
| 问卷 | `/questionnaire` | 填写 12 题匹配问卷 |
| 匹配结果 | `/match-result` | 查看每周匹配结果 |
| 心动列表 | `/crush` | 浏览心动列表 |
| 个人中心 | `/profile` | 用户信息和设置 |
| 后台管理 | `/admin` | 管理员功能 |

## 📝 核心功能

### 1. 登录系统
- 西工大邮箱校验
- Mock 数据支持
- 自动重定向

### 2. 问卷匹配
- 12 道精心设计的题目
- 记录用户偏好
- Mock 匹配算法

### 3. 双向匹配
- 互相心动才成功
- 每周五进行匹配
- 实时结果更新

### 4. 用户认证
- 西工大邮箱实名制
- 用户信息验证
- 安全隐私保护

## 🎯 新首页使用

### 首页组件
```vue
<template>
  <Home />
</template>

<script setup>
import Home from '@/views/Home.vue'
</script>
```

### 自定义首页

编辑 `src/views/Home.vue` 以自定义：

**修改颜色主题**:
```scss
// 颜色变量 (第一行处)
$aurora-pink: #ff1493;    // 主色
$aurora-blue: #00bfff;    // 次色
$text-light: #e0e7ff;     // 文字色
```

**修改星星数量**:
```javascript
// StarField.vue, 第 15 行
const starCount = 300  // 增加/减少数量
```

**修改流星数量**:
```javascript
// Meteors.vue, 第 12 行
const meteors = ref([
  // 添加/移除流星对象
])
```

## 🚀 部署

### 构建静态文件
```bash
npm run build
```

生成的 `dist/` 目录包含所有静态文件，可部署到任何静态服务器。

### Vercel 部署
```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel
```

### Docker 部署
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
CMD ["npm", "run", "preview"]
```

## 🔧 开发调试

### 控制台日志
所有页面都包含调试日志，打开浏览器控制台查看。

### Mock API 测试
修改 `src/utils/mockData.js` 以改变 Mock 数据。

### 状态管理调试
使用 Vue DevTools 浏览器扩展查看 Pinia 状态。

## 🎨 CSS 自定义

所有主要样式变量都在 `Home.vue` 的 `<style>` 块中定义：

```scss
$dark-bg: #050515;
$aurora-pink: #ff1493;
$aurora-blue: #00bfff;
$text-light: #e0e7ff;
```

## ⚡ 性能提示

1. **Canvas 星空**：固定 250 颗星，平衡美观和性能
2. **动画**：使用 RequestAnimationFrame，避免卡顿
3. **响应式**：移动端自动调整布局
4. **缓存**：浏览器自动缓存静态资源

## 📱 浏览器支持

| 浏览器 | 支持 |
|------|------|
| Chrome | ✅ 完全 |
| Firefox | ✅ 完全 |
| Safari | ✅ 完全 |
| Edge | ✅ 完全 |
| IE 11 | ❌ 不支持 |

## 🆘 常见问题

**Q: 首页加载很慢？**
A: Canvas 星空会在首次渲染时生成，这是正常的。后续加载会很快。

**Q: 流星效果不动？**
A: 检查浏览器是否启用了 JavaScript。查看控制台是否有错误。

**Q: 如何禁用动画？**
A: 用户系统设置 `prefers-reduced-motion: reduce` 时会自动禁用。

**Q: 手机上显示不正常？**
A: 首页是响应式设计，应该在所有设备上正常显示。清除缓存并重新加载。

## 🔗 相关资源

- [Vue 3 文档](https://vuejs.org/)
- [Vite 文档](https://vitejs.dev/)
- [Vant UI](https://vant-ui.github.io/vant/)
- [Pinia 文档](https://pinia.vuejs.org/)

## 📄 许可证

MIT License

## 💬 反馈与支持

发现问题或有建议？欢迎提出 Issue 或 Pull Request！

---

**祝你开发愉快！🚀✨**