import { ImgViewr, showImages } from './img-viewr'

const install = function (Vue) {
  Vue.component(ImgViewr.name, ImgViewr)
}

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

ImgViewr.showImages = showImages

export {
  showImages
}

export default ImgViewr
