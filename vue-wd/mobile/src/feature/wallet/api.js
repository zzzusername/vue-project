import axios from '@/api/axios.base'

export default {
  // 查询钱包信息
  getWalletInfo (cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    axios.post('/wallet/info.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({response}) {
          er(response.data)
        })
  },
  // 流水
  getBillFlow ({rowStart, rowCount, date}, cb, er) {
    axios.get('/wallet/billFlow.json', {params: {rowStart, rowCount, date}})
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  withdrawal ({amount}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('amount', amount)
    axios.post('/transfers/set.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({response}) {
          er(response.data)
        })
  }

}
