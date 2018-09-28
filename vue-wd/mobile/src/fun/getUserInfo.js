// 需要重新改造缓存机制
var axios = require('axios')
module.exports = function (params, store, refresh) {
  // 如果schoolId为空，不更新已有缓存
  if ((params.schoolId === null || params.schoolId === undefined) && store.state.userInfo.schoolId !== null && store.state.userInfo.schoolId !== undefined) {
    return
  }
  // 如果schoolId和缓存id不同，需要重新请求并更新缓存
  if ((parseInt(params.schoolId) === store.state.userInfo.schoolId) && !refresh) {
    return
  }

  var config = {
    baseURL: process.env.API_URL,
    responseType: 'json',
    withCredentials: true, // 跨站点访问
    method: 'post',
    isShowLoad: false,
    headers: { 'Content-Type': 'multipart/form-data' }
  }
  var form = new FormData()
  if (params.schoolId !== null && params.schoolId !== undefined) {
    form.append('schoolId', params.schoolId)
  }
  axios.post('/school/user/info.json', form, config)
    .then(function (response) {
      if (response.data.isTeacher === true || response.data.isMaster === true) {
        // 如果是教师，缓存教师功能列表
        axios.post('/school/teacher/feature.json', form, config)
        .then(function (featureResponse) {
          let feature = {}
          featureResponse.data.forEach(element => {
            if (element.featureCode === 'BANJIGUANLI') {
              feature.classManage = true
            } else if (element.featureCode === 'LAOSHIGUANLI') {
              feature.teacherManage = true
            } else if (element.featureCode === 'KECHENGGUANLI') {
              feature.lessonsManage = true
            } else if (element.featureCode === 'QUANXIANGUANLI') {
              feature.roleManage = true
            } else if (element.featureCode === 'JIELONG_BANJI') {
              feature.classChain = true
            } else if (element.featureCode === 'JIELONG_XUEXIAO') {
              feature.schoolChain = true
            }
          })
          response.data.feature = feature
          store.commit('updateTeacherFeature', featureResponse.data)
          store.commit('updateUserInfo', response.data)
        })
        .catch(function ({featureResponse}) {
          store.commit('updateUserInfo', response.data)
        })
      } else {
        store.commit('updateUserInfo', response.data)
      }
    })
    .catch(function ({ response }) {
    })
}
