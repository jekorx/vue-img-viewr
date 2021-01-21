<template>
  <transition name="img-viewr-fade">
    <div v-show="visible" tabindex="-1" ref="img-viewr__wrapper" class="img-viewr__wrapper" :style="{ 'z-index': zIndex }">
      <div class="img-viewr__mask" @click.self="handleMaskClick"></div>
      <!-- CLOSE -->
      <span class="img-viewr__btn img-viewr__close" @click="hide">
        <i class="img-viewr__icon icon__circle-close"></i>
      </span>
      <!-- ARROW -->
      <template v-if="!isSingle">
        <span
          class="img-viewr__btn img-viewr__prev"
          :class="{ 'is-disabled': !infinite && isFirst }"
          @click="prev">
          <i class="img-viewr__icon icon__arrow-left"/>
        </span>
        <span
          class="img-viewr__btn img-viewr__next"
          :class="{ 'is-disabled': !infinite && isLast }"
          @click="next">
          <i class="img-viewr__icon icon__arrow-right"/>
        </span>
      </template>
      <!-- ACTIONS -->
      <div class="img-viewr__btn img-viewr__actions">
        <div class="img-viewr__actions__inner">
          <i class="img-viewr__icon icon__zoom-out" @click="handleActions('zoomOut')"></i>
          <i class="img-viewr__icon icon__zoom-in" @click="handleActions('zoomIn')"></i>
          <i class="img-viewr__actions__divider"></i>
          <i :class="mode.icon" @click="toggleMode"></i>
          <i class="img-viewr__actions__divider"></i>
          <i class="img-viewr__icon icon__download-image" @click="handleActions('download')"></i>
          <i class="img-viewr__actions__divider"></i>
          <i class="img-viewr__icon icon__refresh-left" @click="handleActions('anticlocelise')"></i>
          <i class="img-viewr__icon icon__refresh-right" @click="handleActions('clocelise')"></i>
        </div>
      </div>
      <!-- CANVAS -->
      <div class="img-viewr__canvas">
        <template v-for="(url, i) in urls">
          <img
            v-if="i === index"
            ref="img"
            class="img-viewr__img"
            :key="url"
            :src="currentImg"
            :style="imgStyle"
            @load="handleImgLoad"
            @error="handleImgError"
            @mousedown="handleMouseDown" />
        </template>
      </div>
    </div>
  </transition>
</template>
<script>
import Vue from 'vue'

// 是否为服务端渲染
const isServer = Vue.prototype.$isServer

// 事件绑定
const on = (() => {
  if (!isServer && document.addEventListener) {
    return (element, event, handler) => {
      if (element && event && handler) {
        element.addEventListener(event, handler, false)
      }
    }
  } else {
    return (element, event, handler) => {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler)
      }
    }
  }
})()

// 事件解绑
const off = (() => {
  if (!isServer && document.removeEventListener) {
    return (element, event, handler) => {
      if (element && event) {
        element.removeEventListener(event, handler, false)
      }
    }
  } else {
    return (element, event, handler) => {
      if (element && event) {
        element.detachEvent('on' + event, handler)
      }
    }
  }
})()

// 节流
const rafThrottle = fn => {
  let locked = false
  return (...args) => {
    if (locked) return
    locked = true
    window.requestAnimationFrame(_ => {
      fn.apply(this, args)
      locked = false
    })
  }
}

// 是否为火狐浏览器
const isFirefox = () => {
  return !Vue.prototype.$isServer && !!window.navigator.userAgent.match(/firefox/i)
}

// 图片模式，填充窗口、原始大小
const Mode = {
  CONTAIN: {
    name: 'contain',
    icon: 'img-viewr__icon icon__full-screen'
  },
  ORIGINAL: {
    name: 'original',
    icon: 'img-viewr__icon icon__scale-to-original'
  }
}

// 鼠标滚动事件名称
const mousewheelEventName = isFirefox() ? 'DOMMouseScroll' : 'mousewheel'

export default {
  name: 'ImgViewr',
  computed: {
    isSingle () {
      return this.urls.length <= 1
    },
    isFirst () {
      return this.index === 0
    },
    isLast () {
      return this.index === this.urls.length - 1
    },
    currentImg () {
      const image = this.urls[this.index]
      return image || this.urls[0]
    },
    imgStyle () {
      const { scale, deg, offsetX, offsetY, enableTransition } = this.transform
      const style = {
        transform: `scale(${scale}) rotate(${deg}deg)`,
        transition: enableTransition ? 'transform .3s' : '',
        'margin-left': `${offsetX}px`,
        'margin-top': `${offsetY}px`
      }
      if (this.mode === Mode.CONTAIN) {
        style.maxWidth = style.maxHeight = '100%'
      }
      return style
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    urls: {
      type: Array,
      default: () => []
    },
    zIndex: {
      type: Number,
      default: 3000
    },
    onSwitch: {
      type: Function,
      default: () => {}
    },
    onClose: {
      type: Function,
      default: () => {}
    },
    initialIndex: {
      type: Number,
      default: 0
    },
    closeOnClickMask: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      index: 0,
      isShow: false,
      infinite: true,
      loading: false,
      mode: Mode.CONTAIN,
      transform: {
        scale: 1,
        deg: 0,
        offsetX: 0,
        offsetY: 0,
        enableTransition: false
      }
    }
  },
  watch: {
    initialIndex (val) {
      if (val !== this.index) {
        this.index = val
      }
    },
    index: {
      handler (val) {
        this.reset()
        this.onSwitch(val)
      }
    },
    currentImg (val) {
      if (!val) return
      this.$nextTick(_ => {
        const $imgs = this.$refs.img
        if ($imgs && $imgs.length > 0) {
          const $img = $imgs[0]
          if (!$img.complete) {
            this.loading = true
          }
        }
      })
    }
  },
  mounted () {
    this.deviceSupportInstall()
    // 鼠标聚焦到wrapper，防止键盘滚动浏览器滚动条
    this.$refs['img-viewr__wrapper'].focus()
  },
  beforeDestroy () {
    this.deviceSupportUninstall()
  },
  methods: {
    handleMaskClick () {
      if (this.closeOnClickMask) {
        this.hide()
      }
    },
    hide () {
      this.onClose()
    },
    deviceSupportInstall () {
      this._keyDownHandler = rafThrottle(e => {
        const keyCode = e.keyCode
        switch (keyCode) {
          // ESC
          case 27:
            this.hide()
            break
          // SPACE
          case 32:
            this.toggleMode()
            break
          // LEFT_ARROW
          case 37:
            this.prev()
            break
          // UP_ARROW
          case 38:
            this.handleActions('zoomIn')
            break
          // RIGHT_ARROW
          case 39:
            this.next()
            break
          // DOWN_ARROW
          case 40:
            this.handleActions('zoomOut')
            break
        }
      })
      this._mouseWheelHandler = rafThrottle(e => {
        const delta = e.wheelDelta ? e.wheelDelta : -e.detail
        if (delta > 0) {
          this.handleActions('zoomIn', {
            zoomRate: 0.05,
            enableTransition: false
          })
        } else {
          this.handleActions('zoomOut', {
            zoomRate: 0.05,
            enableTransition: false
          })
        }
      })
      on(document, 'keydown', this._keyDownHandler)
      on(document, mousewheelEventName, this._mouseWheelHandler)
    },
    deviceSupportUninstall () {
      off(document, 'keydown', this._keyDownHandler)
      off(document, mousewheelEventName, this._mouseWheelHandler)
      this._keyDownHandler = null
      this._mouseWheelHandler = null
    },
    handleImgLoad (e) {
      this.loading = false
    },
    handleImgError (e) {
      this.loading = false
      e.target.alt = '加载失败'
    },
    handleMouseDown (e) {
      if (this.loading || e.button !== 0) return

      const { offsetX, offsetY } = this.transform
      const startX = e.pageX
      const startY = e.pageY
      this._dragHandler = rafThrottle(ev => {
        this.transform.offsetX = offsetX + ev.pageX - startX
        this.transform.offsetY = offsetY + ev.pageY - startY
      })
      on(document, 'mousemove', this._dragHandler)
      on(document, 'mouseup', ev => {
        off(document, 'mousemove', this._dragHandler)
      })

      e.preventDefault()
    },
    reset () {
      this.transform = {
        scale: 1,
        deg: 0,
        offsetX: 0,
        offsetY: 0,
        enableTransition: false
      }
    },
    toggleMode () {
      if (this.loading) return

      const modeNames = Object.keys(Mode)
      const modeValues = Object.values(Mode)
      const index = modeValues.indexOf(this.mode)
      const nextIndex = (index + 1) % modeNames.length
      this.mode = Mode[modeNames[nextIndex]]
      this.reset()
    },
    prev () {
      if (this.isFirst && !this.infinite) return
      const len = this.urls.length
      this.index = (this.index - 1 + len) % len
    },
    next () {
      if (this.isLast && !this.infinite) return
      const len = this.urls.length
      this.index = (this.index + 1) % len
    },
    handleActions (action, options = {}) {
      if (this.loading) return
      const { zoomRate, rotateDeg, enableTransition } = {
        zoomRate: 0.2,
        rotateDeg: 90,
        enableTransition: true,
        ...options
      }
      const { transform } = this
      switch (action) {
        case 'zoomOut':
          if (transform.scale > 0.2) {
            transform.scale = parseFloat((transform.scale - zoomRate).toFixed(3))
          }
          break
        case 'zoomIn':
          transform.scale = parseFloat((transform.scale + zoomRate).toFixed(3))
          break
        case 'clocelise':
          transform.deg += rotateDeg
          break
        case 'anticlocelise':
          transform.deg -= rotateDeg
          break
        case 'download':
          this.downloadImg(this.currentImg, Date.now(), 'png')
          break
      }
      transform.enableTransition = enableTransition
    },
    downloadImg (src, filename, ext) {
      const img = new Image()
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const link = document.createElement('a')
      img.setAttribute('crossOrigin', 'anonymous') // 设置允许跨域访问
      img.src = src
      img.onerror = () => {
        // 图片加载错误时（如存在跨域问题）直接通过浏览器打开
        window.open(src)
      }
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0, img.width, img.height)
        link.setAttribute('href', canvas.toDataURL('image/' + ext))
        link.setAttribute('target', '_blank')
        link.setAttribute('download', filename + '.' + ext)
        link.click()
      }
    }
  }
}
</script>
