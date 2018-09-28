import axios from '@/api/axios.base'

export default {
  backLogin (userId, cb, er) {
    console.log('获取群信息 userId:' + userId)
    var config = {userId}
    axios.get('/login/backIndex.json', {params: config})
      .then(function (response) {
        cb(response.data)
      })
      .catch(function (error) {
        er(error.data)
      })
  },
  getSpaceFeatures ({orgId}, cb, er) {
    var config = {orgId}
    axios.get('/feature/getIndexOrgFeatureForOrgId.json', {params: config})
      .then(function (response) {
        cb(response.data)
      })
      .catch(function (error) {
        er(error.data)
      })
  },
  getIndexFeatures ({orgId}, cb, er) {
    var config = {orgId}
    axios.get('/feature/getIndexFeatures.json', {params: config})
      .then(function (response) {
        cb(response.data)
      })
      .catch(function (error) {
        er(error.data)
      })
  },
  getOwnOrJoinOrgFirst (cb, er) {
    var config = {}
    axios.get('/org/getOwnOrJoinOrgFirst.json', {params: config})
      .then(function (response) {
        cb(response.data)
      })
      .catch(function (error) {
        er(error.data)
      })
  },
  // 学校教师、家长申请连接返回
  getApplyTeacherOrParent ({schoolId, type}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    var url
    form.append('schoolId', schoolId)
    if (type === 'teacher') {
      url = '/school/teacher/getApplyTeacher.json'
    } else {
      url = '/school/parent/getApplyParent.json'
    }
    axios.post(url, form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  createQrUrl({QRcode, attach}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    const form = new FormData()
    form.append('QRcode', QRcode)
    if (attach !== null && attach !== undefined) {
      form.append('attach', attach)
    }
    axios.post('/wechat/createQrUrl.json', form, config)
    .then(function (response) {
      cb(response.data)
    })
    .catch(function ({ response }) {
      er(response.data)
    })
  },
  // 模糊查询学校
  querySchoolByName({schoolName}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' },
      isShowLoad: false
    }
    const form = new FormData()
    form.append('schoolName ', schoolName)
    axios.post('/school/queryByName.json', form, config)
    .then(function (response) {
      cb(response.data)
    })
    .catch(function ({ response }) {
      er(response.data)
    })
  },
  getContactFormData({schoolId, type}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' },
      isShowLoad: false
    }
    const form = new FormData()
    form.append('schoolId ', schoolId)
    form.append('type ', type)
    axios.post('/wechat/mini/sessionfrom/get.json', form, config)
    .then(function (response) {
      cb(response.data)
    })
    .catch(function ({ response }) {
      if (response && response.data) {
        er(response.data)
      } else {
        er()
      }
    })
  }
}
