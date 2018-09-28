import axios from '@/api/axios.base'

export default {
  configWechat ({jsApiList, wx}, cb, er) {
    // const debug = process.env.NODE_ENV === 'development'
    const debug = false
    var config = {debug: debug, isShowLoad: false}
    axios.get('/wechat/getJsConfig.json', {params: config})
      .then(function (response) {
        config = response.data
        config.jsApiList = jsApiList
        wx.config(config)
        wx.ready(() => {
          console.log('wx.ready')
          cb(response.data)
        })
        wx.error((res) => {
          console.log('wx.error', res)
        })
      })
      .catch(function (error) {
        console.log('configWechat.catch', error)
        er(error.data)
      })
  }
}
