<template>
  <ImgViewr
    :visible="options.visible"
    :urls="options.urls"
    :initial-index="options.index"
    :z-index="options.zIndex"
    :lock-scroll="options.lockScroll"
    :close-on-clickMask="options.closeOnClickMask"
    @close="close"
    @switch="change" />
</template>
<script lang="ts">
import { reactive } from 'vue'
import ImgViewr from './main.vue'

export default {
  name: 'Wrap',
  components: { ImgViewr },
  setup () {
    const options = reactive({
      visible: false,
      lockScroll: true,
      closeOnClickMask: true,
      urls: [],
      index: 0,
      zIndex: 3000,
      onClose () {},
      onSwitch (i: number) {}
    })

    const close = () => {
      options.visible = false
      setTimeout(() => {
        options.urls = []
        options?.onClose()
      }, 300)
    }
    const change: (i: number) => void = i => {
      options.onSwitch(i)
    }

    return {
      options,
      close,
      change
    }
  }
}
</script>
