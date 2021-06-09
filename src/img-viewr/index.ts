import { createVNode, render, VNode, App } from 'vue'
import Wrap from './wrap.vue'
import ImgViewr from './main.vue'

// 是否为服务端渲染
const isServer = typeof window === 'undefined'

let instance: VNode

const initInstance = () => {
  const container = document.createElement('div')

  const vm = createVNode(Wrap, {})

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
  visible?: Boolean,
  urls: string[],
  zIndex?: number,
  initialIndex?: number,
  lockScroll?: boolean
  closeOnClickMask?: boolean
}) => void = options => {
  if (isServer) return

  if (!(options.urls && options.urls.length > 0)) {
    throw new Error('At least one picture in urls array!')
  }

  if (!instance) {
    initInstance()
  }

  for (const k in options) {
    instance.component.proxy.options[k] = options[k]
  }

  instance.component.proxy.options.visible = true
}

export type WithInstall<T> = T & {
  install(app: App): void
}

// using any here because tsc will generate some weird results when using generics
export function withInstall<T> (options: any): WithInstall<T> {
  (options as Record<string, unknown>).install = (app: App) => {
    const { name } = options as any
    app.component(name, options)
  }

  return options
}

export {
  showImages,
  ImgViewr
}
