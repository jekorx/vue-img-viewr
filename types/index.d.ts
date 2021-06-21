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

export declare function showImages(options: ImgViewrOptions): void

declare const _default: {
  install: (app: App, ...options: any[]) => any
}

export default _default
