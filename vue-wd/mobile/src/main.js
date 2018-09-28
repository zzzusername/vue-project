// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import Fun from './fun/index'
import storage from './fun/localStorage'

import axios from './api/axios.base'
import uploadApi from './api/upload'
// import indexApi from './feature/index/api'
import { WechatPlugin, TransferDom } from 'vux'
import VueScroller from 'vue-scroller'
// import VueClipboard from 'vue-clipboard2'
// import wechatApi from './api/wechat.api'

Vue.directive('transfer-dom', TransferDom)
// Vue.use(VueClipboard)
Vue.use(VueScroller)

// import MintUI from 'mint-ui'
// import 'mint-ui/lib/style.css'

Vue.config.productionTip = false

Vue.use(WechatPlugin)
// Vue.use(MintUI)
Vue.use(Fun)
Vue.use(uploadApi)
Vue.use(storage)

// 网络请求拦截
axios.defaults.withCredentials = true
axios.interceptors.request.use(function (config) {
  console.log('网络请求 config--' + config.isShowLoad, config)
  if (config.isShowLoad) {
    store.commit('updateDataLoadingStatus', {isLoading: true})
  }
  // debugger
  // config.params.orgId = store.getters.orgId
  // store.getters.ORG_INFO.orgId
  // debugger
  return config
}, function (error) {
  // 请求错误时做些事
  return Promise.reject(error)
})

// 拦截器
axios.interceptors.response.use(function (response) {
  if (response.config.isShowLoad) {
    store.commit('updateDataLoadingStatus', {isLoading: false})
  }
  // 对响应数据做些事
  return response
}, function (error) {
  if (error.config.isShowLoad) {
    store.commit('updateDataLoadingStatus', {isLoading: false})
  }
  // 请求错误时做些事
  console.error(error)
  if (error.response.data.errCode === '99010106') {
    // 非群成员
    var qrcode = window.vue.tools.cdn(error.response.data.ext.orgMasterQrcode)
    store.commit('updateOrgQrcode', {isShowOrgQrcode: true, orgQrcode: qrcode, orgName: error.response.data.ext.orgName})
  } else if (error.response.data.errCode === '98010101') {
    store.commit('updateLogoutStatus', {logoutStatus: true})
  } else if (error.response.data.errCode === '99010107' || error.response.data.errCode === '99010108') {
    // 无管理权限
    window.vue.tools.warnToast('您无权访问管理页面', '170px')
    router.replace({name: 'index'})
  }
  // console.log('router', router)
  // router.push({name: 'orgJoinorglist'})
  return Promise.reject(error)
})
// 如果测试环境，已用户ID1登录下
// if (process.env.NODE_ENV === 'development') {
//   indexApi.backLogin(1, () => {}, () => {})
// }

if (process.env.NODE_ENV === 'development') {
  if (/debug/.test(window.location) || localStorage.getItem('active-eruda') === 'true') {
    var eruda = require('eruda/eruda.min.js')
    eruda.init()
  }
}

Vue.directive('title', {
  inserted: function (el, binding) {
    document.title = binding.value
  }
})

/* eslint-disable no-new */
window.vue = new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
window.vue.$mount('#app')

// const FastClick = require('fastclick')
// FastClick.attach(document.body)
