import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import { siteConfig } from './config/siteConfig'
import './assets/styles/index.scss'
import '@fortawesome/fontawesome-free/css/all.css'
import Vant from 'vant'
import 'vant/lib/index.css'

// 设置网站标题
document.title = siteConfig.title

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(Vant)

app.mount('#app')