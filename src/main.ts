import { createApp } from 'vue'
import App from './app.vue'
import { showImages } from './img-viewr'

const app = createApp(App)

app.config.globalProperties.$showImages = showImages

app.mount('#app')
