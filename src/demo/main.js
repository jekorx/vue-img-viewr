import Vue from 'vue'
import App from './app'
import { showImages } from '../img-viewr'

Vue.prototype.$showImages = showImages

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
