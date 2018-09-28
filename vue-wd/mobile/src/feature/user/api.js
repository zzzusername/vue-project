import axios from '@/api/axios.base'

export default {
  getUserList (cb, er) {
    axios.get('/user/queryAll.json')
        .then(function (response) {
          cb(response.data)
        })
        .catch(function (error) {
          er(error.data)
        })
  },
  switchUser ({userId}, cb, er) {
    var config = {userId}
    axios.get('/login/backIndex.json', {params: config})
        .then(function (response) {
          cb(response.data)
        })
        .catch(function (error) {
          er(error.data)
        })
  },
  getUserInfo (cb, er) {
    axios.get('/user/userInfo.json')
        .then(function (response) {
          cb(response.data)
        })
        .catch(function (error) {
          er(error.data)
        })
  },
  getBindKey (cb, er) {
    axios.get('/user/bindKey.json')
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({response}) {
          er(response.data)
        })
  },
  invalidBindKey ({key}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    if (key !== null && key !== undefined) {
      form.append('key', key)
    }
    axios.post('/user/invalidBindKey.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({response}) {
          er(response.data)
        })
  },
  getIndustryList ({salesmanId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    if (salesmanId !== null && salesmanId !== undefined) {
      form.append('salesmanId', salesmanId)
    }
    axios.post('/profession/list.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({ response }) {
          er(response.data)
        })
  },
  getIndustryInfo ({code}, cb, er) {
    var config = {
      params: { code }
    }
    axios.get('/profession/info.json', config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 获取我的学校
  getMySchoolList (cb, er) {
    var config = {
      isShowLoad: false
    }
    axios.get('/school/my/list.json', config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  }
}
