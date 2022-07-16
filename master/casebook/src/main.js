import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/styles/index.less'
import loadingComponent from '@/plugins/element-plus'
import autoLoadingSvg from '@/icons/index'

const app = createApp(App)
loadingComponent(app)
autoLoadingSvg(app)
app.use(store).use(router).mount('#app')
