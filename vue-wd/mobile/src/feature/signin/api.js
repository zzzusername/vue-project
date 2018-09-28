import axios from '@/api/axios.base'

export default {
  getLevelList ({orgId}, cb, er) {
    axios.get('/orgLevel/list.json', {params: {orgId}})
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  getVipLevelList ({orgId}, cb, er) {
    axios.get('/vip/list.json', {params: {orgId}})
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  getSignInManageSetting ({orgId}, cb, er) {
    var config = {
      method: 'post',
      headers: {'Content-Type': 'multipart/form-data'}
    }
    var form = new FormData()
    form.append('orgId', orgId)
    axios.post('/org/sign/set/info.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  setSignInManageSetting ({orgId, signSetting}, cb, er) {
    var config = {
      method: 'post',
      headers: {'Content-Type': 'multipart/form-data'}
    }
    var form = new FormData()
    form.append('orgId', orgId)
    for (var i = 0; i < signSetting.length; i++) {
      if (signSetting[i].value !== null && signSetting[i].value !== undefined) {
        console.log('signSetting[i].name', signSetting[i].name + ':' + signSetting[i].value)
        form.append(signSetting[i].name, signSetting[i].value)
      }
    }
    axios.post('/org/sign/set/save.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  getUserSignInfo ({orgId}, cb, er) {
    var config = {
      method: 'post',
      headers: {'Content-Type': 'multipart/form-data'}
    }
    var form = new FormData()
    form.append('orgId', orgId)
    axios.post('/org/user/sign/info.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  getSignInRanking ({orgId, order, rowStart, rowCount}, cb, er) {
    var config = {
      method: 'post',
      headers: {'Content-Type': 'multipart/form-data'}
    }
    var form = new FormData()
    form.append('orgId', orgId)
    form.append('order', order)
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    axios.post('/org/user/sign/query.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  userSignIn ({orgId}, cb, er) {
    var config = {
      method: 'post',
      headers: {'Content-Type': 'multipart/form-data'}
    }
    var form = new FormData()
    form.append('orgId', orgId)
    axios.post('/org/user/sign/checkin.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  getSignSetInfo ({orgId}, cb, er) {
    var config = {
      method: 'post',
      headers: {'Content-Type': 'multipart/form-data'}
    }
    var form = new FormData()
    form.append('orgId', orgId)
    axios.post('/org/sign/set/info.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  }
}
