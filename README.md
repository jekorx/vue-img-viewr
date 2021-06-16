# vue-img-viewr

[![npm package](https://img.shields.io/npm/v/vue-img-viewr.svg)](https://www.npmjs.com/package/vue-img-viewr)

> ❗ vue图片查看组件（vue image viewer component），```2.x```版本为**vue@3.x**组件  

> ❗ 如需在**vue@2.x**中使用，请使用 [vue-img-viewr@1.0.3](https://www.npmjs.com/package/vue-img-viewr/v/1.0.3)， Github v1.x地址 [请点击](https://github.com/jekorx/vue-img-viewr/tree/1.x)  
> ```yarn add vue-img-viewr@^1.0.3```
> ```npm i vue-img-viewr@^1.0.3 -S```  

### 示例

> [demo展示](https://jekorx.github.io/vue-img-viewr)  

![vue-img-viewr](screenshot/pic0.png)

### 用法

```bash
# 安装依赖
yarn add vue-img-viewr
# or
npm i vue-img-viewr -S
```

> 使用，SPA，非SSR  

```javascript
/**
 * 一、推荐🔥全局js方式引入
 */
import Vue from 'vue'
import { showImages } from 'vue-img-viewr'
import 'vue-img-viewr/styles/index.css'

const app = createApp(App)
app.config.globalProperties.$showImages = showImages
app.mount('#app')

/** 使用 **/
const appContext = getCurrentInstance()?.appContext as AppContext
const showImagesByJs: (i: number) => void = i => {
  appContext.config.globalProperties.$showImages({
    urls: images,
    index: i,
    onSwitch: (i: number) => void = i => {
      console.log(`current image index: ${i}`)
    },
    onClose: () => {
      console.log('closed')
    }
  })
}

/** 
 * 注册全局组件
 */
import ImgViewr from 'vue-img-viewr'
import 'vue-img-viewr/styles/index.css'

const app = createApp(App)
app.component('ImgViewr', ImgViewr)
app.mount('#app')

/**
 * 二、按需引入使用
 */
// lang="ts"
import { ref } from 'vue'
import ImgViewr, { showImages } from 'vue-img-viewr'
import 'vue-img-viewr/styles/index.css'

const images = [
  'https://s.gravatar.com/avatar/221f86a573320174bad7a62886a6d4b4?size=100&default=retro',
  'https://s.gravatar.com/avatar/221f86a573320174bad7a62886a6d4b4',
  'https://static.npmjs.com/attachments/ck3uwf5d872zb8874c3ayi1pj-icon-pro-wombat-3x.png'
]
export default {
  name: 'App',
  components: { ImgViewr },
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
          console.log('closed js')
        }
      })
    }
    const changeHandle: (i: number) => void = i => {
      console.log(`current image index: ${i}`)
    }
    const closeHandle = () => {
      console.log('closed component')
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
}
```

> 服务端渲染（SSR）中使用，以Nuxtjs为例  

```javascript
// TODO
// 后期测试后再进行补充
```

> 示例组件使用

```html
<!-- 使用组件 -->
<div class="demo">
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
```

> 示例样式  

```css
/* 示例样式 */
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
```

### 参数

##### Attributes

| 参数             | 说明                                       | 类型           | 可选值          | 默认值 |
| :--------------- | :----------------------------------------- | :------------- | :------------- | :----- |
| urls             | 需要展示的图片url数组（必须参数）           | array&#60;string&#62; | —       | []      |
| visible          | 是否显示组件（仅限于通过组件方式参数）      | boolean         | true / false  | —      |
| initialIndex     | 初始显示的图片索引（仅限于通过组件方式参数）| number          | —             | 0      |
| index            | 显示的图片索引（仅限于通过js方法调用参数）  | number          | —             | 0      |
| onSwitch         | 图片切换回调函数 Function (index)          | function        | —             | —      |
| onClose          | 关闭回调函数                               | function        | —             | —      |
| zIndex           | 层级                                       | number          | —             | 3000    |
| lockScroll       | 是否在查看图片时将 body 滚动锁定            | boolean         | true / false   | true    |
| closeOnClickMask | 点击蒙层关闭                               | boolean         | true / false   | true    |

##### Events

> 仅用于组件方式  

| 参数   | 说明                                    | 参数  |
| :----- | :-------------------------------------- | :--- |
| close  | 关闭事件，将 visible 设为 false 关闭窗口 | -    |
| switch | 图片切换事件                            | index |
