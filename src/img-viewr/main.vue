<template>
  <transition name="img-viewr-fade">
    <div v-show="isShow" tabindex="-1" ref="imgViewrWrapper" class="img-viewr__wrapper" :style="`z-index: ${zIndexNum}`">
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
        <template v-for="(img, i) in images">
          <img
            v-if="i === index"
            class="img-viewr__img"
            ref="imageRef"
            :key="img"
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
<script lang="ts">
import { ref, reactive, watch, computed, nextTick, onMounted, onBeforeUnmount, defineComponent, PropType, watchEffect } from 'vue'

// types
type AnyFunction<T> = (...args: any[]) => T
type EventHandlerFunction = (evt: Event) => void | {
  handleEvent(evt: Event): void
}
type EventBindFunction = (
  element: HTMLElement | Document | Window,
  event: string,
  handler: EventHandlerFunction,
  useCapture?: boolean
) => void
type ImgViewrAction = 'zoomIn' | 'zoomOut' | 'clocelise' | 'anticlocelise' | 'download'
type ModeTypes = ('CONTAIN' | 'ORIGINAL')[]
interface ImgViewr {
  visible: boolean
  urls: string[]
  zIndex: number
  initialIndex: number
  lockScroll: boolean
  closeOnClickMask: boolean
}

// 是否为服务端渲染
const isServer = typeof window === 'undefined'

// 事件绑定
const on: EventBindFunction = (element, event, handler, useCapture = false) => {
  if (!isServer && element && event && handler) {
    element.addEventListener(event, handler, useCapture)
  }
}

// 事件解绑
const off: EventBindFunction = (element, event, handler, useCapture = false) => {
  if (!isServer && element && event && handler) {
    element.removeEventListener(event, handler, useCapture)
  }
}

// 节流
function rafThrottle<T extends AnyFunction<any>> (fn: T): AnyFunction<void> {
  let locked = false
  return function (this: any, ...args: any[]) { // this为any的时候报错，需指定this为any或unknown
    if (locked) return
    locked = true
    window.requestAnimationFrame(() => {
      fn.apply(this, args)
      locked = false
    })
  }
}

// 是否为火狐浏览器
const isFirefox = () => !isServer && !!window.navigator.userAgent.match(/firefox/i)

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

// 下载图片
const downloadImage = (src: string, filename: string, ext: string) => {
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
    ctx?.drawImage(img, 0, 0, img.width, img.height)
    link.setAttribute('href', canvas.toDataURL(`image/${ext}`))
    link.setAttribute('target', '_blank')
    link.setAttribute('download', `${filename}.${ext}`)
    link.click()
  }
}

const CLOSE_EVENT = 'close'
const SWITCH_EVENT = 'switch'
const EVENT_CODE = {
  esc: 'Escape',
  left: 'ArrowLeft', // 37
  up: 'ArrowUp', // 38
  right: 'ArrowRight', // 39
  down: 'ArrowDown', // 40
  space: 'Space'
}

export default defineComponent({
  name: 'ImgViewr',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    urls: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    zIndex: {
      type: Number,
      default: 3000
    },
    initialIndex: {
      type: Number,
      default: 0
    },
    lockScroll: {
      type: Boolean,
      default: true
    },
    closeOnClickMask: {
      type: Boolean,
      default: true
    }
  },
  emits: [CLOSE_EVENT, SWITCH_EVENT],
  setup (props: ImgViewr, { emit }) {
    // 为同时兼容vue组件方式和js方式调用的变量
    const initIndex = ref(0)
    const zIndexNum = ref(3000)
    const isLockScroll = ref(true)
    const isCloseOnClickMask = ref(true)
    const isShow = ref(false)
    const images = ref<string[]>([])
    const closeHandle = ref<null | Function>(null)
    const switchHandle = ref<null | Function>(null)

    const index = ref(0)
    const infinite = ref(true)
    const loading = ref(false)
    const mode = reactive({ ...Mode.CONTAIN })
    const transform = reactive({
      scale: 1,
      deg: 0,
      offsetX: 0,
      offsetY: 0,
      enableTransition: false
    })
    const imgViewrWrapper = ref<null | HTMLElement>(null)
    const imageRef = ref<null | HTMLImageElement>(null)

    const isSingle = computed(() => images.value.length <= 1)
    const isFirst = computed(() => index.value === 0)
    const isLast = computed(() => index.value === images.value.length - 1)
    const currentImg = computed(() => {
      const image = images.value[index.value]
      return image || images.value[0]
    })
    const imgStyle = computed(() => {
      const { scale, deg, offsetX, offsetY, enableTransition } = transform
      const style: {
        [key: string]: string
      } = {
        transform: `scale(${scale}) rotate(${deg}deg)`,
        transition: enableTransition ? 'transform .3s' : '',
        'margin-left': `${offsetX}px`,
        'margin-top': `${offsetY}px`
      }

      if (mode.name === Mode.CONTAIN.name) {
        style.maxWidth = style.maxHeight = '100%'
      }
      return style
    })

    watchEffect(() => {
      if (props.urls.length) {
        images.value = props.urls
        initIndex.value = props.initialIndex
        zIndexNum.value = props.zIndex
        isLockScroll.value = props.lockScroll
        isCloseOnClickMask.value = props.closeOnClickMask
      }
    })

    watch(() => props.visible, val => {
      isShow.value = val
    })
    watch(initIndex, val => {
      if (val !== index.value) {
        index.value = val
      }
    })
    watch(isShow, val => {
      if (!isLockScroll.value) return

      const clazz = document.body.classList
      if (val) {
        reset()
        if (!clazz.contains('img-viewr__body-lock')) {
          clazz.add('img-viewr__body-lock')
        }
      } else {
        if (clazz.contains('img-viewr__body-lock')) {
          clazz.remove('img-viewr__body-lock')
        }
      }
    })
    watch(index, val => {
      reset()
      switchHandle.value?.(val)
      emit(SWITCH_EVENT, val)
    })
    watch(currentImg, () => {
      nextTick(() => {
        const $img = imageRef.value
        if ($img) {
          if (!$img.complete) {
            loading.value = true
          }
        } else {
          loading.value = true
        }
      })
    })

    const handleMaskClick = () => {
      if (isCloseOnClickMask.value) {
        hide()
      }
    }
    const hide = () => {
      closeHandle.value?.()
      emit(CLOSE_EVENT)
    }
    let _keyDownHandler: EventHandlerFunction | null
    let _mouseWheelHandler: EventHandlerFunction | null
    let _dragHandler: EventHandlerFunction | null
    const deviceSupportInstall = () => {
      _keyDownHandler = rafThrottle(e => {
        switch (e.code) {
          // ESC
          case EVENT_CODE.esc:
            hide()
            break
          // SPACE
          case EVENT_CODE.space:
            toggleMode()
            break
          // LEFT_ARROW
          case EVENT_CODE.left:
            prev()
            break
          // UP_ARROW
          case EVENT_CODE.up:
            handleActions('zoomIn')
            break
          // RIGHT_ARROW
          case EVENT_CODE.right:
            next()
            break
          // DOWN_ARROW
          case EVENT_CODE.down:
            handleActions('zoomOut')
            break
        }
      })
      _mouseWheelHandler = rafThrottle(e => {
        const delta = e.wheelDelta ? e.wheelDelta : -e.detail
        if (delta > 0) {
          handleActions('zoomIn', {
            zoomRate: 0.05,
            enableTransition: false
          })
        } else {
          handleActions('zoomOut', {
            zoomRate: 0.05,
            enableTransition: false
          })
        }
      })
      on(document, 'keydown', _keyDownHandler)
      on(document, mousewheelEventName, _mouseWheelHandler)
    }
    const deviceSupportUninstall = () => {
      if (_keyDownHandler) {
        off(document, 'keydown', _keyDownHandler)
      }
      if (_mouseWheelHandler) {
        off(document, mousewheelEventName, _mouseWheelHandler)
      }
      _keyDownHandler = null
      _mouseWheelHandler = null
    }
    const handleImgLoad = () => {
      loading.value = false
    }
    const handleImgError = () => {
      loading.value = false
      const $img = imageRef.value
      if ($img) {
        $img.alt = '加载失败'
      }
    }
    const handleMouseDown: (e: MouseEvent) => void = e => {
      if (loading.value || e.button !== 0) return

      const { offsetX, offsetY } = transform
      const startX = e.pageX
      const startY = e.pageY
      _dragHandler = rafThrottle(ev => {
        transform.offsetX = offsetX + ev.pageX - startX
        transform.offsetY = offsetY + ev.pageY - startY
      })
      on(document, 'mousemove', _dragHandler)
      on(document, 'mouseup', () => {
        if (_dragHandler) {
          off(document, 'mousemove', _dragHandler)
        }
      })

      e.preventDefault()
    }
    const reset = () => {
      transform.scale = 1
      transform.deg = 0
      transform.offsetX = 0
      transform.offsetY = 0
      transform.enableTransition = false
    }
    const toggleMode = () => {
      if (loading.value) return

      const modeNames = Object.keys(Mode) as ModeTypes
      const modeValues = Object.values(Mode)
      const index = modeValues.findIndex(({ name }) => name === mode.name)
      const nextIndex = (index + 1) % modeNames.length
      const { name, icon } = Mode[modeNames[nextIndex]]
      mode.name = name
      mode.icon = icon
      reset()
    }
    const prev = () => {
      if (isFirst.value && !infinite.value) return
      const len = images.value.length
      index.value = (index.value - 1 + len) % len
    }
    const next = () => {
      if (isLast.value && !infinite.value) return
      const len = images.value.length
      index.value = (index.value + 1) % len
    }
    const handleActions = (action: ImgViewrAction, options = {}) => {
      if (loading.value) return
      const { zoomRate, rotateDeg, enableTransition } = {
        zoomRate: 0.2,
        rotateDeg: 90,
        enableTransition: true,
        ...options
      }
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
          downloadImage(currentImg.value, Date.now().toString(), 'png')
          break
      }
      transform.enableTransition = enableTransition
    }

    onMounted(() => {
      deviceSupportInstall()
      imgViewrWrapper?.value?.focus?.()
    })

    onBeforeUnmount(() => {
      deviceSupportUninstall()
    })

    return {
      images,
      isShow,
      initIndex,
      zIndexNum,
      isLockScroll,
      isCloseOnClickMask,
      imgViewrWrapper,
      imageRef,
      index,
      isSingle,
      infinite,
      isFirst,
      isLast,
      mode,
      currentImg,
      imgStyle,
      closeHandle,
      switchHandle,
      hide,
      prev,
      next,
      toggleMode,
      handleActions,
      handleMaskClick,
      handleImgLoad,
      handleImgError,
      handleMouseDown
    }
  }
})
</script>
