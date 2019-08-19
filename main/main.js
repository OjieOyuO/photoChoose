//这是用来本地开发调试用的
import Vue from 'vue'
import App from './App.vue'
import './assets/scss/base.scss'

new Vue({
    el: '#app',
    components: { App },
    template: '<App/>'
})