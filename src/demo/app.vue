<template>
  <div>
    <h3>通过组件方式</h3>
    <div class="imgs">
      <div v-for="(url, i) in urls" class="img" :key="`c_${i}`" @click="() => showImagesByComponent(i)">
        <img :src="url" />
      </div>
    </div>
    <ImgViewr :visible="visible" :urls="urls" :initialIndex="index" :onClose="() => (visible = false)" />
    <h3>通过js方法调用</h3>
    <div class="imgs">
      <div v-for="(url, i) in urls" class="img" :key="i" @click="() => showImagesByJs(i)">
        <img :src="url" />
      </div>
    </div>
  </div>
</template>
<script>
import ImgViewr from '../index.js'
import '../../styles/index.css'

export default {
  name: 'App',
  components: { ImgViewr },
  data () {
    return {
      urls: [
        'https://s.gravatar.com/avatar/221f86a573320174bad7a62886a6d4b4?size=100&default=retro',
        'https://s.gravatar.com/avatar/221f86a573320174bad7a62886a6d4b4',
        'https://static.npmjs.com/attachments/ck3uwf5d872zb8874c3ayi1pj-icon-pro-wombat-3x.png'
      ],
      index: 0,
      visible: false
    }
  },
  methods: {
    showImagesByComponent (index) {
      this.visible = true
      this.index = index
    },
    showImagesByJs (index) {
      this.$showImages({
        urls: this.urls,
        index
      })
    }
  }
}
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
