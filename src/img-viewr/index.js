import Vue from 'vue'
import ImgViewr from './main.vue'

const _typeof = typeof Symbol === 'function' &&
  typeof Symbol.iterator === 'symbol'
  ? obj => typeof obj
  : obj => (obj &&
    typeof Symbol === 'function' &&
    obj.constructor === Symbol &&
    obj !== Symbol.prototype
    ? 'symbol'
    : typeof obj)

const ImgViewrConstructor = Vue.extend(ImgViewr)

let instance

const initInstance = () => {
  instance = new ImgViewrConstructor({
    el: document.createElement('div')
  })

  document.body.appendChild(instance.$el)

  Vue.nextTick(() => {
    instance.visible = true
  })
}

const showImages = options => {
  if (Vue.prototype.$isServer) return

  if (_typeof(options) !== 'object') {
    throw new Error('Argument must be an Object!')
  }

  if (!(options.urls && options.urls.length > 0)) {
    throw new Error('At least one picture in urls array!')
  }

  options = Object.assign({
    urls: [],
    zIndex: 2000,
    onSwitch: () => { },
    onClose: () => true,
    index: 0
  }, options)

  if (!instance) {
    initInstance()
  }
  if (!instance.visible) {
    for (const prop in options) {
      if (prop === 'onClose') continue
      instance[prop] = options[prop]
    }
  }

  instance.onClose = () => {
    const visible = !options.onClose()
    if (!visible) {
      instance.visible = visible
      // wait for modal close
      setTimeout(() => {
        instance.urlList = []
        instance.initialIndex = -1
      }, 300)
    }
  }

  instance.visible = true
}

export {
  showImages,
  ImgViewr
}

