import photoChoose from './src/photoChoose'

photoChoose.install = (Vue) => {
  Vue.component(photoChoose.name, photoChoose)
}

export default photoChoose