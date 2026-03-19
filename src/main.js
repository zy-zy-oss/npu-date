import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './assets/styles/index.scss'
import 'vant/lib/index.css'
import '@fortawesome/fontawesome-free/css/all.css'
import { Button, Field, CellGroup, Cell, Toast, NavBar, Tabbar, TabbarItem, Tab, Tabs, Card, Image as VanImage, Tag, Empty, Loading, Dialog, Popup, Picker, RadioGroup, Radio, Checkbox, CheckboxGroup, Slider, Uploader, Divider, Progress, Notify, ActionSheet, ShareSheet } from 'vant'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(Button)
app.use(Field)
app.use(CellGroup)
app.use(Cell)
app.use(Toast)
app.use(NavBar)
app.use(Tabbar)
app.use(TabbarItem)
app.use(Tab)
app.use(Tabs)
app.use(Card)
app.use(VanImage)
app.use(Tag)
app.use(Empty)
app.use(Loading)
app.use(Dialog)
app.use(Popup)
app.use(Picker)
app.use(RadioGroup)
app.use(Radio)
app.use(Checkbox)
app.use(CheckboxGroup)
app.use(Slider)
app.use(Uploader)
app.use(Divider)
app.use(Progress)
app.use(Notify)
app.use(ActionSheet)
app.use(ShareSheet)

app.mount('#app')