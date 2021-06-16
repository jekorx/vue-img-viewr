import { createApp } from 'vue'
import App from './app.vue'
import ImgViewr, { showImages } from './img-viewr'

const app = createApp(App)

app.config.globalProperties.$showImages = showImages

app.component('ImgViewr', ImgViewr)

app.mount('#app')
