<template>
  <section>
    <div class="main-container">
      <label class="dp" :class="initClass[0]" v-if="mediaType === 1" for="append-img"></label>
      <label class="dp" :class="initClass[0]" v-if="mediaType === 2 && isAndroid" for="append-img"></label>
      <label class="dp" :class="initClass[1]" v-if="mediaType === 2 && isAndroid" for="append-video"></label>
      <label class="dp" :class="initClass[0]" v-if="mediaType === 2 && !isAndroid" for="append-imgVideo"></label>
      <label class="dp" :class="initClass[0]" v-if="mediaType === 3" for="append-video"></label>
    </div>
    <div class="else-container">
      <input @change="choosePhoto" type="file" id="append-img"
             accept="image/JPG,image/gif,image/JPEG,image/BMP,image/PNG,image/*"/>
      <input @change="choosePhoto" type="file" id="append-video"
             accept="video/mp4,video/x-m4v,video/mov,video/AVI,video/WMV,video/mkv,video/3gp,video/*"/>
      <input @change="choosePhoto" type="file" id="append-imgVideo"
             accept="image/JPG,image/gif,image/JPEG,image/BMP,image/PNG,video/mp4,video/x-m4v,video/mov,video/AVI,video/WMV,video/mkv"/>
    </div>
  </section>
</template>
 
<script>
// mediaType：上传的媒体类型 默认1只支持图片，2支持视频+图片 3只支持视频
// limitImgSize：限制图片大小，默认不限制
// limitVideoSize：限制视频大小，默认不限制
// initClass: 类名用来写样式
import {getImgExif, selectFileImage, base64ToFile} from './utils.js'
export default {
  name: 'photoChoose',
  props: {
    mediaType: {
      type: Number,
      default: 1
    },
    initClass: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      isAndroid: true    //是否是安卓
    }
  },
  methods: {
    choosePhoto(e) {
      let file = e.target.files[0];
        e.target.value = null
        if (file) {
          let size = (file.size / 1024).toFixed(0)
          if (file.type.search(/^image/) === 0) {   //图片
            //上传的是图片
            if (file.type.search(/^image\/tiff/) !== 0) {
              this.dealImgFile(file)
            } else {
              console.log('不支持tiff图片')
            }
          } else if (file.type.search(/^video/) === 0) {    //视频
            let size = this.computeSize(file.size)
            this.$emit('chooseEnd', {file: file, type: 2, size: size})
          }
        }
    },
    //处理图片方向
    dealImgFile(file) {
      let name = file.name.split(".")[0];
      let type = file.name.split(".")[1];
      getImgExif(file).then(exif => {
        if (exif === 3 || exif === 6 || exif === 8) {
          selectFileImage(file).then(data => {
            let results = base64ToFile(data, name, type)
            let size = this.computeSize(file.size)
            this.$emit('chooseEnd', {file: results, type: 1, size: size})
          });
        } else {
          let size = this.computeSize(file.size)
          this.$emit('chooseEnd', {file: file, type: 1, size: size})
        }
      });
    },
    //计算大小
    computeSize(size) {
      let results;
      results = size / 1024 / 1024
      return +results.toFixed(2)
    },
    //判断ios还是安卓
    isAndroid_ios() {
      let u = navigator.userAgent, app = navigator.appVersion;
      let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
      return isAndroid;
    }
  },
  mounted() {
    this.isAndroid = this.isAndroid_ios()
  }
}
</script>
<style  scoped>
  label{
    display: inline-block;
    width: 100px;
    height: 100px;
    background: #CCCCCC;
  }
  .else-container{
    display: none;
  }
</style>>