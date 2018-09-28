import axios from '@/api/axios.base'

export default {
  getOpenorg ({randomId}, cb, er) {
    console.log('randomId', randomId)
    var config = { randomId: randomId }
    console.log('config', config)
    axios.get('/non/nonpay/getOpenorg.json', {params: config})
      .then(function (response) {
        console.log('正常')
        cb(response.data)
      })
      .catch(function (error) {
        console.log('异常')
        er(error.response.data)
      })
  },
  checkUser ({randomId}, cb, er) {
    var config = {randomId: randomId}
    axios.get('/org/init/pay/none/checkUser.json', {params: config})
      .then(function (response) {
        console.log('正常')
        cb(response.data)
      })
      .catch(function (error) {
        console.log('异常')
        er(error.response.data)
      })
  },
  openChatRoom ({randomId, monthValue, yearValue, isRequireFeatureList, ckeckFeatureList}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'application/json' }
    }
    axios.post('/org/init/pay/orgPayFeatures.json', {randomId, monthValue, yearValue, isRequireFeatureList, ckeckFeatureList}, config)
      .then(function (response) {
        console.log('正常')
        cb(response.data)
      })
      .catch(function (error) {
        console.log('异常')
        er(error.response.data)
      })
  },
  getFeatureList (cb, er) {
    axios.get('/org/init/pay/none/features.json')
      .then(function (response) {
        console.log('正常')
        cb(response.data)
      })
      .catch(function (error) {
        console.log('异常')
        er(error.data)
      })
  },
  getPackageListByFeatureId ({orgId, featureId}, cb, er) {
    console.log(orgId)
    console.log(featureId)
    var config = { orgId: orgId, featureId: featureId }
    axios.get('/org/init/pay/features/packages.json', {params: config})
      .then(function (response) {
        console.log('正常')
        cb(response.data)
      })
      .catch(function (error) {
        console.log('异常')
        er(error.data)
      })
  },
  openFeature ({orgId, packageId, yearValue, monthValue}, cb, er) {
    var config = { orgId, packageId, yearValue, monthValue }
    axios.get('/org/init/pay/features/order.json', {params: config})
      .then(function (response) {
        console.log('正常')
        cb(response.data)
      })
      .catch(function (error) {
        console.log('异常')
        er(error.response.data)
      })
  },
  getExpansionResPackageList ({type}, cb, er) {
    var config = { type }
    axios.get('/expansion/resource/package.json', {params: config})
      .then(function (response) {
        console.log('正常')
        cb(response.data)
      })
      .catch(function (error) {
        console.log('异常')
        er(error.data)
      })
  },
  payExpansion ({packageId}, cb, er) {
    var config = {packageId}
    axios.get('/expansion/resource/order.json', {params: config})
      .then(function (response) {
        console.log('正常')
        cb(response.data)
      })
      .catch(function (error) {
        console.log('异常')
        er(error.response.data)
      })
  },
  getSchoolRemainOrgNum (cb, er) {
    var config = {}
    axios.get('/school/remain/orgnum.json', {params: config})
      .then(function (response) {
        console.log('正常')
        cb(response.data)
      })
      .catch(function (error) {
        console.log('异常')
        er(error.response.data)
      })
  },
  openBySchool ({randomId}, cb, er) {
    var config = {randomId}
    axios.get('/school/create/org.json', {params: config})
      .then(function (response) {
        cb(response.data)
      })
      .catch(function (error) {
        er(error.response.data)
      })
  }
}
