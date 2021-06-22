import { App } from 'vue'

declare module 'vue-img-viewr'

export declare type ImgViewrOptions = {
  urls: string[],
  index?: number,
  zIndex?: number,
  lockScroll?: boolean
  closeOnClickMask?: boolean,
  onClose?: Function,
  onSwitch?: Function
}

export declare const showImages: (options: ImgViewrOptions) => void

declare const _default: {
  showImages: (options: ImgViewrOptions) => void
  install: (app: App) => any
}

export default _default
