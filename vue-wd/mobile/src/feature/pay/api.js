import axios from '@/api/axios.base'
export default {
  // 获取订单信息
  getOrderInfo ({orderId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('orderId', orderId)
    axios.post('/order/info.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({response}) {
          er(response.data)
        })
  },
  // 获取微信支付信息
  getWxPay ({orderId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('orderId', orderId)
    axios.post('/order/getWxPay.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({response}) {
          er(response.data)
        })
  },
  // 获取微信支付信息
  testPay (cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    axios.post('/order/test/pay.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({response}) {
          er(response.data)
        })
  }

}
