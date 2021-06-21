import { createVNode, render, VNode, ComponentPublicInstance, App } from 'vue'
import ImgViewr from './main.vue'

// 是否为服务端渲染
const isServer = typeof window === 'undefined'

let instance: VNode

const initInstance = () => {
  const container = document.createElement('div')

  const vm = createVNode(ImgViewr, {})

  if (vm && vm.props) {
    vm.props.onDestroy = () => {
      render(null, container)
    }
  }

  render(vm, container)

  instance = vm

  if (container.firstElementChild) {
    document.body.appendChild(container.firstElementChild)
  }
}

const showImages: (options: {
  urls: string[],
  index?: number,
  zIndex?: number,
  lockScroll?: boolean
  closeOnClickMask?: boolean,
  onClose?: Function,
  onSwitch?: Function
}) => void = options => {
  if (isServer) return

  if (!(options.urls && options.urls.length > 0)) {
    throw new Error('At least one picture in urls array!')
  }

  // single instance
  if (!instance) {
    initInstance()
  }

  const component = (instance?.component?.proxy as ComponentPublicInstance<{
    images: string[],
    isShow: boolean,
    initIndex: number,
    zIndexNum?: number,
    isLockScroll?: boolean,
    isCloseOnClickMask?: boolean,
    closeHandle?: Function,
    switchHandle?: (index: number) => void
  }>)

  // initial parameters
  component.images = options.urls
  component.initIndex = options.index ?? 0
  component.zIndexNum = options.zIndex ?? 3000
  component.isLockScroll = options.lockScroll ?? true
  component.isCloseOnClickMask = options.closeOnClickMask ?? true
  component.closeHandle = () => {
    component.isShow = false
    options.onClose?.()
  }
  component.switchHandle = index => {
    options.onSwitch?.(index)
  }

  // show the modal
  setTimeout(() => {
    component.isShow = true
  }, 0)
}

ImgViewr.install = (app: App): void => {
  app.config.globalProperties.$showImages = showImages
  app.component(ImgViewr.name, ImgViewr)
}

export {
  showImages,
  ImgViewr
}

export default ImgViewr
