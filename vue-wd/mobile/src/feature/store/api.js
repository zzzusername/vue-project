import axios from '@/api/axios.base'

export default {
  // 添加地址
  addAddress ({saName, saProvince, saCity, saArea, saDetail, saPhone, saDefault}, cb, er) {
    var config = {
      method: 'post',
      headers: {'Content-Type': 'multipart/form-data'}
    }
    var form = new FormData()
    form.append('saName', saName)
    form.append('saProvince', saProvince)
    form.append('saCity', saCity)
    form.append('saArea', saArea)
    form.append('saDetail', saDetail)
    form.append('saPhone', saPhone)
    form.append('saDefault', saDefault)
    axios.post('/address/add.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 删除地址
  delAddress ({saId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('saId', saId)
    axios.post('/address/delete.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 修改保存地址
  saveAddress ({saId, saName, saProvince, saCity, saArea, saDetail, saPhone, saDefault}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('saId', saId)
    form.append('saName', saName)
    form.append('saProvince', saProvince)
    form.append('saCity', saCity)
    form.append('saArea', saArea)
    form.append('saDetail', saDetail)
    form.append('saPhone', saPhone)
    form.append('saDefault', saDefault)
    axios.post('/address/save.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 获取地址列表
  getAddresses (cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    axios.post('/address/list.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  addProducts ({orgId, leagueId, formList, detailImgs}, cb, er) {
    var config = {
      method: 'post',
      headers: {'Content-Type': 'multipart/form-data'}
    }
    var form = new FormData()
    var url = ''
    if (orgId !== undefined) {
      form.append('orgId', orgId)
      url = '/points/shop/goods/org/add.json'
    } else if (leagueId !== undefined) {
      form.append('leagueId', leagueId)
      url = '/points/shop/goods/lea/add.json'
    }
    for (var i = 0; i < formList.length; i++) {
      if (i !== formList.length - 1) {
        if (formList[i].code === 'psgStatus') {
          form.append('psgStatus', formList[i].value ? 1 : 0)
        } else {
          form.append(formList[i].code, formList[i].value)
        }
      } else {
        for (var j = 0; j < detailImgs.length; j++) {
          form.append(formList[i].code, detailImgs[j].binaryData)
        }
      }
    }
    axios.post(url, form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  getManageProductsList({orgId, leagueId, psgStatus, rowStart, rowCount}, cb, er) {
    var config = {
      method: 'post',
      headers: {'Content-Type': 'multipart/form-data'}
    }
    var url = ''
    var form = new FormData()
    if (orgId !== undefined) {
      form.append('orgId', orgId)
      url = '/points/shop/goods/org/list.json'
    } else {
      form.append('leagueId', leagueId)
      url = '/points/shop/goods/lea/list.json'
    }
    form.append('psgStatus', psgStatus) // 1上架状态，0未上架状态，-1删除状态
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    axios.post(url, form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  setManageProductsStatus({orgId, leagueId, psgId, psgStatus}, cb, er) {
    var config = {
      method: 'post',
      headers: {'Content-Type': 'multipart/form-data'}
    }
    var form = new FormData()
    var url = ''
    if (orgId !== undefined) {
      form.append('orgId', orgId)
      url = '/points/shop/goods/org/status.json'
    } else {
      form.append('leagueId', leagueId)
      url = '/points/shop/goods/lea/status.json'
    }
    form.append('psgId', psgId)
    form.append('psgStatus', psgStatus) // 1上架状态，0未上架状态，-1删除状态
    axios.post(url, form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  setManageProductsCate({orgId, leagueId, psgId, type}, cb, er) {
    var config = {
      method: 'post',
      headers: {'Content-Type': 'multipart/form-data'}
    }
    var form = new FormData()
    var url = ''
    if (orgId !== undefined) {
      form.append('orgId', orgId)
      url = '/points/shop/goods/cate/org/add.json'
    } else {
      form.append('leagueId', leagueId)
      url = '/points/shop/goods/cate/lea/add.json'
    }
    form.append('psgId', psgId)
    form.append('type', type)
    axios.post(url, form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  delManageProductsCate({orgId, leagueId, psgcId}, cb, er) {
    var config = {
      method: 'post',
      headers: {'Content-Type': 'multipart/form-data'}
    }
    var form = new FormData()
    var url = ''
    if (orgId !== undefined) {
      form.append('orgId', orgId)
      url = '/points/shop/goods/cate/org/delete.json'
    } else {
      form.append('leagueId', leagueId)
      url = '/points/shop/goods/cate/lea/delete.json'
    }
    form.append('psgcId', psgcId)
    axios.post(url, form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  getProducts ({orgId, leagueId, rowStart, rowCount}, cb, er) {
    var config = {
      method: 'post',
      headers: {'Content-Type': 'multipart/form-data'}
    }
    var form = new FormData()
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    var url = ''
    if (orgId !== undefined) {
      form.append('orgId', orgId)
      url = '/points/shop/goods/org/index.json'
    } else if (leagueId !== undefined) {
      form.append('leagueId', leagueId)
      url = '/points/shop/goods/lea/index.json'
    }
    axios.post(url, form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  getProductInfo ({psgId}, cb, er) {
    var config = {
      method: 'post',
      headers: {'Content-Type': 'multipart/form-data'}
    }
    var form = new FormData()
    form.append('psgId', psgId)
    axios.post('/points/shop/goods/detail.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  getUserInfo ({orgId}, cb, er) {
    var config = {orgId}
    axios.get('/org/user/my.json', {params: config})
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  getManageOrders ({orgId, leagueId, psoStatus, rowStart, rowCount}, cb, er) {
    var config = {
      method: 'post',
      headers: {'Content-Type': 'multipart/form-data'}
    }
    var form = new FormData()
    var url = ''
    if (orgId !== undefined) {
      form.append('orgId', orgId)
      url = '/points/shop/order/org/man/list.json'
    } else if (leagueId !== undefined) {
      form.append('leagueId', leagueId)
      url = '/points/shop/order/lea/man/list.json'
    }
    form.append('psoStatus', psoStatus)
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    axios.post(url, form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  submitOrder ({orgId, psoNum, psgId, saId}, cb, er) {
    var config = {
      method: 'post',
      headers: {'Content-Type': 'multipart/form-data'}
    }
    var form = new FormData()
    form.append('orgId', orgId)
    form.append('psoNum', psoNum)
    form.append('psgId', psgId)
    form.append('saId', saId)
    axios.post('/points/shop/order/org/add.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  getDefaultAddress (cb, er) {
    var config = {
      method: 'post',
      headers: {'Content-Type': 'multipart/form-data'}
    }
    var form = new FormData()
    axios.post('/address/default.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  getOrderList ({orgId, psoStatus, rowStart, rowCount}, cb, er) {
    var config = {
      method: 'post',
      headers: {'Content-Type': 'multipart/form-data'}
    }
    var form = new FormData()
    form.append('orgId', orgId)
    form.append('psoStatus', psoStatus)
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    axios.post('/points/shop/order/org/list.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  orderPay ({orgId, psoSn}, cb, er) {
    var config = {
      method: 'post',
      headers: {'Content-Type': 'multipart/form-data'}
    }
    var form = new FormData()
    form.append('orgId', orgId)
    form.append('psoSn', psoSn)
    axios.post('/points/shop/order/pay.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  getOrderInfo ({orgId, psoSn}, cb, er) {
    var config = {
      method: 'post',
      headers: {'Content-Type': 'multipart/form-data'}
    }
    var form = new FormData()
    form.append('orgId', orgId)
    form.append('psoSn', psoSn)
    axios.post('/points/shop/order/org/detail.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // getSenderAddress ({saId}, cb, er) {
  //   var config = {
  //     method: 'post',
  //     headers: {'Content-Type': 'multipart/form-data'}
  //   }
  //   var form = new FormData()
  //   form.append('saId', saId)
  //   axios.post('/address/detail.json', form, config)
  //     .then(function (response) {
  //       cb(response.data)
  //     })
  //     .catch(function ({response}) {
  //       er(response.data)
  //     })
  // },
  cancelOrder ({orgId, psoSn}, cb, er) {
    var config = {
      method: 'post',
      headers: {'Content-Type': 'multipart/form-data'}
    }
    var form = new FormData()
    form.append('orgId', orgId)
    form.append('psoSn', psoSn)
    axios.post('/points/shop/order/org/cancel.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 申请退货
  orderRefunds ({orgId, psoSn, psoReturnCourierSn, psoReturnCourierName}, cb, er) {
    var config = {
      method: 'post',
      headers: {'Content-Type': 'multipart/form-data'}
    }
    var form = new FormData()
    form.append('orgId', orgId)
    form.append('psoSn', psoSn)
    form.append('psoReturnCourierSn', psoReturnCourierSn)
    form.append('psoReturnCourierName', psoReturnCourierName)
    axios.post('/points/shop/order/org/return.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  getManageDetail ({orgId, leagueId, psoSn}, cb, er) {
    var config = {
      method: 'post',
      headers: {'Content-Type': 'multipart/form-data'}
    }
    var form = new FormData()
    var url = ''
    if (orgId !== undefined) {
      form.append('orgId', orgId)
      url = '/points/shop/order/org/man/detail.json'
    } else {
      form.append('leagueId', leagueId)
      url = '/points/shop/order/lea/man/detail.json'
    }
    form.append('psoSn', psoSn)
    axios.post(url, form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 发货
  sendProduct ({orgId, leagueId, psoSn, psoCourierName, psoCourierSn}, cb, er) {
    var config = {
      method: 'post',
      headers: {'Content-Type': 'multipart/form-data'}
    }
    var form = new FormData()
    var url = ''
    if (orgId !== undefined) {
      form.append('orgId', orgId)
      url = '/points/shop/order/org/send.json'
    } else {
      form.append('leagueId', leagueId)
      url = '/points/shop/order/lea/send.json'
    }
    form.append('psoSn', psoSn)
    form.append('psoCourierSn', psoCourierSn)
    form.append('psoCourierName', psoCourierName)
    axios.post(url, form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 快递公司列表
  getCourierList (cb, er) {
    var config = {
      method: 'post',
      headers: {'Content-Type': 'multipart/form-data'}
    }
    var form = new FormData()
    axios.post('/points/shop/courier/list.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  moneyReturn ({orgId, psoSn}, cb, er) {
    var config = {
      method: 'post',
      headers: {'Content-Type': 'multipart/form-data'}
    }
    var form = new FormData()
    form.append('orgId', orgId)
    form.append('psoSn', psoSn)
    axios.post('/points/shop/order/org/return/money.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 处理退款退货
  checkReturn ({orgId, leagueId, psoSn, psoStatus}, cb, er) {
    var config = {
      method: 'post',
      headers: {'Content-Type': 'multipart/form-data'}
    }
    var form = new FormData()
    var url = ''
    if (orgId !== undefined) {
      form.append('orgId', orgId)
      url = '/points/shop/order/org/check/return.json'
    } else {
      form.append('leagueId', leagueId)
      url = '/points/shop/order/lea/check/return.json'
    }
    form.append('psoSn', psoSn)
    form.append('psoStatus', psoStatus)
    axios.post(url, form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  confirmProduct ({orgId, psoSn}, cb, er) {
    var config = {
      method: 'post',
      headers: {'Content-Type': 'multipart/form-data'}
    }
    var form = new FormData()
    form.append('orgId', orgId)
    form.append('psoSn', psoSn)
    axios.post('/points/shop/order/org/confirm.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  modifyProduct ({psgId, orgId, leagueId, formList, detailImgs}, cb, er) {
    var config = {
      method: 'post',
      headers: {'Content-Type': 'multipart/form-data'}
    }
    var form = new FormData()
    form.append('psgId', psgId)
    var url = ''
    if (orgId !== undefined) {
      form.append('orgId', orgId)
      url = '/points/shop/goods/org/save.json'
    } else if (leagueId !== undefined) {
      form.append('leagueId', leagueId)
      url = '/points/shop/goods/lea/save.json'
    }
    for (var i = 0; i < formList.length; i++) {
      if (formList[i].code === 'psgStatus') {
        form.append('psgStatus', formList[i].value ? 1 : 0)
      } else if (formList[i].code === 'psgDetailImg') {
        if (detailImgs !== null && detailImgs.length > 0) {
          for (var j = 0; j < detailImgs.length; j++) {
            if (detailImgs[j].binaryData !== undefined && detailImgs[j].binaryData !== null && detailImgs[j].binaryData !== '') {
              form.append(formList[i].code, detailImgs[j].binaryData)
            }
          }
        }
      } else {
        if (formList[i].value !== null && formList[i].value !== '') {
          form.append(formList[i].code, formList[i].value)
        }
      }
    }
    axios.post(url, form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  }
}
