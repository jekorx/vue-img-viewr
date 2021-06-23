<template>
  <div>
    <h3>通过组件方式</h3>
    <div class="imgs">
      <div v-for="(url, i) in urls" class="img" :key="`c_${i}`" @click="() => showImagesByComponent(i)">
        <img :src="url" />
      </div>
    </div>
    <ImgViewr :visible="visible" :urls="urls" :initial-index="index" @close="closeHandle" @switch="changeHandle" />
    <h3>通过js方法调用</h3>
    <div class="imgs">
      <div v-for="(url, i) in urls" class="img" :key="i" @click="() => showImagesByJs(i)">
        <img :src="url" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import /* ImgViewr,  */{ showImages } from './img-viewr/index'
import '../styles/index.css'

const images = [
  'https://s.gravatar.com/avatar/221f86a573320174bad7a62886a6d4b4?size=100&default=retro',
  'https://s.gravatar.com/avatar/221f86a573320174bad7a62886a6d4b4',
  'https://static.npmjs.com/attachments/ck3uwf5d872zb8874c3ayi1pj-icon-pro-wombat-3x.png'
]
export default defineComponent({
  name: 'App',
  // components: { ImgViewr },
  setup () {
    const urls = ref(images)
    const index = ref(0)
    const visible = ref(false)
    const showImagesByComponent: (i: number) => void = i => {
      visible.value = true
      index.value = i
    }
    const showImagesByJs: (i: number) => void = i => {
      showImages({
        urls: images,
        index: i,
        onSwitch: changeHandle,
        onClose: () => {
          console.log('close with js')
        }
      })
    }
    const changeHandle: (i: number) => void = i => {
      console.log(`current image index: ${i}`)
    }
    const closeHandle = () => {
      console.log('close component')
      visible.value = false
    }
    return {
      urls,
      index,
      visible,
      showImagesByComponent,
      showImagesByJs,
      closeHandle,
      changeHandle
    }
  }
})
</script>
<style scoped>
.imgs {
  display: flex;
}
.img {
  width: 150px;
  height: 100px;
  border: 1px solid #EEE;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px;
}
.img img {
  max-width: 100%;
  max-height: 100%;
  cursor: pointer;
}
</style>
