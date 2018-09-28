import axios from '@/api/axios.base'

export const uploadApi = {
  getToken ({type, args}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('type', type)
    if (args instanceof Array) {
      args.forEach((element) => {
        form.append('args', element)
      }, this)
    } else {
      form.append('args', args)
    }
    axios.post('/image/getToken.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  uploadImage ({token, file, key}, cb, er) {
    var config = {
      baseURL: 'https://up-z2.qbox.me',
      responseType: 'json',
      withCredentials: false,
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('token', token)
    form.append('file', file)
    form.append('key', key)
    axios.post('', form, config)
      .then((response) => {
        cb(response.data)
      })
      .catch(() => {
        er()
      })
  }
}
export default {
  install: function (Vue) {
    Vue.prototype.uploadApi = uploadApi
  }
}
