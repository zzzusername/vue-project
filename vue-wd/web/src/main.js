// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from './api/axios.base'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Fun from './fun/index'
import uploadApi from './api/upload'
import store from './vuex/store'
import storage from './fun/localStorage'
import base from './libs/base'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(Fun)
Vue.use(uploadApi)
Vue.use(storage)
Vue.mixin(base)
// 超时时间
axios.defaults.timeout = 20000
// 添加请求拦截器
axios.interceptors.request.use(config => {
  // 在发送请求之前做些什么
  store.commit('updateLoadingStatus', {isLoading: true})
  return config
}, error => {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(data => { // 响应成功关闭loading
  // 对响应数据做点什么
  store.commit('updateLoadingStatus', false)
  return data
}, error => {
  // 对响应错误做点什么
  store.commit('updateLoadingStatus', false)
  if (error.response.data.errCode === '98010101') {
    window.location = '/index.html#/login'
  }
  return Promise.reject(error)
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
