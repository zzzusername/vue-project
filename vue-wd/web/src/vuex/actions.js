import axios from '@/api/axios.base'
export default {
  getSchoolList (context) {
    axios.post('/school/my/list.json')
    .then(response => {
      context.commit('getSchoolList', response.data)
    })
    .catch(response => {})
  },
  getInfo (context, data) {  // 获取用户信息
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', data)
    axios.post('/school/user/info.json', form, config)
    .then(response => {
      context.commit('getInfo', response.data)
    })
    .catch(response => {})
  },
  getUserInfo (context, schoolId) {
    return new Promise((resolve, reject) => {
      var config = {
        method: 'post',
        headers: { 'Content-Type': 'multipart/form-data' }
      }
      var form = new FormData()
      form.append('schoolId', schoolId)
      axios.post('/school/user/info.json', form, config)
      .then(response => {
        context.commit('getInfo', response.data)
        resolve()
      })
      .catch(response => {})
    })
  }
}
