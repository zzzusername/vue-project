import axios from '@/api/axios.base'

export default {
  // 获取列表
  getComment ({ schoolId, bsId, type, skip }, cb) {
    var config = {
      params: {
        schoolId: schoolId,
        bsId: bsId,
        type: type,
        skip: skip
      }
    }
    axios.get('/comment/list.json', config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        console.log(response)
      })
  },
  // 添加点赞
  addVote ({ schoolId, bsId, type }, cb, error) {
    var config = {
      params: { schoolId, bsId, type }
    }
    axios.get('/comment/addVote.json', config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        console.log(response)
        error(response.data)
      })
  },
  // 给评论点赞
  addSubVote ({ schoolId, bsId, type, replyId }, cb, error) {
    var config = {
      params: { schoolId, bsId, type, replyId }
    }
    axios.get('/comment/addSubVote.json', config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        console.log(response)
        error(response.data)
      })
  },
  // 添加评论
  addReply ({schoolId, bsId, type, content}, cb, error) {
    var config = {
      method: 'post',
      headers: {'Content-Type': 'multipart/form-data'}
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('bsId', bsId)
    form.append('type', type)
    form.append('content', content)
    axios.post('/comment/addReply.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        error(response.data)
      })
  },
  // 添加回复
  addSubReply ({schoolId, bsId, type, content, replyId}, cb, error) {
    var config = {
      method: 'post',
      headers: {'Content-Type': 'multipart/form-data'}
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('bsId', bsId)
    form.append('type', type)
    form.append('content', content)
    form.append('replyId', replyId)
    axios.post('/comment/addSubReply.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        error(response.data)
      })
  },
  // 添加浏览数
  addViewNum ({ schoolId, bsId, type }, cb, error) {
    var config = {
      params: { schoolId, bsId, type }
    }
    axios.get('/comment/addViewNum.json', config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        console.log(response)
        error(response.data)
      })
  },
  addReader ({schoolId, bsId, type}, cb, error) {
    var config = {
      method: 'post',
      headers: {'Content-Type': 'multipart/form-data'}
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('bsId', bsId)
    form.append('type', type)
    axios.post('/comment/addReader.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        error(response.data)
      })
  },
  isReader ({schoolId, bsId, type}, cb, error) {
    var config = {
      method: 'post',
      headers: {'Content-Type': 'multipart/form-data'}
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('bsId', bsId)
    form.append('type', type)
    axios.post('/comment/isReader.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        error(response.data)
      })
  },
  getReaderList ({schoolId, bsId, type, skip, limit}, cb, error) {
    var config = {
      method: 'post',
      headers: {'Content-Type': 'multipart/form-data'}
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('bsId', bsId)
    form.append('type', type)
    form.append('skip', skip)
    form.append('limit', limit)
    axios.post('/comment/reader/list.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        error(response.data)
      })
  }
}
