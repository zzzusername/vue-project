import axios from '@/api/axios.base'

export default {
  // post请求调用
  doPostRequest(url, form, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    axios.post(url, form, config)
    .then(function (response) {
      cb(response.data)
    })
    .catch(function ({ response }) {
      er(response.data)
    })
  },
  // get请求调用
  doGetRequest(params, url, cb, er) {
    var config = { params: params }
    axios.get(url, config)
    .then(function (response) {
      cb(response.data)
    })
    .catch(function ({response}) {
      er(response.data)
    })
  },
  // 通过学生id 查找他得教师
  queryClassesTeacherList ({schoolId, studentId, featureCode}, cb, er) {
    var form = new FormData()
    if (schoolId !== null && schoolId !== undefined) {
      form.append('schoolId', schoolId)
    }
    if (studentId !== null && studentId !== undefined) {
      form.append('studentId', studentId)
    }
    form.append('featureCode', featureCode)
    var url = '/school/message/queryClassesTeacherList.json'
    this.doPostRequest(url, form, cb, er)
  },
  // 创建留言
  addMessage ({schoolId, message, messageImg, data}, cb, er) {
    var form = new FormData()
    if (schoolId !== null && schoolId !== undefined) {
      form.append('schoolId', schoolId)
    }
    if (message !== null && message !== undefined) {
      form.append('message', message)
    }
    if (messageImg !== null && messageImg !== undefined && messageImg !== '') {
      form.append('messageImg', messageImg)
    }
    for (let key in data) {
      if (data[key] !== undefined && data[key] !== null) {
        if (data[key] instanceof Array) {
          for (let index = 0; index < data[key].length; index++) {
            const element = data[key][index]
            form.append(key, element)
          }
        } else {
          form.append(key, data[key])
        }
      }
    }
    var url = '/school/message/addMessage.json'
    this.doPostRequest(url, form, cb, er)
  },
  // 查询留言列表
  queryMessageList ({schoolId, identityState, studentId, rowStart, rowCount}, cb, er) {
    var form = new FormData()
    form.append('schoolId', schoolId)
    if (studentId !== null && studentId !== undefined) {
      form.append('studentId', studentId)
    }
    if (identityState > 0) {
      form.append('identityState', identityState)
    }
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    var url = '/school/message/queryMessageList.json'
    this.doPostRequest(url, form, cb, er)
  },
  // 修改留言主题
  updateMessage ({schoolId, messageId, message, messageImg, pushState, studentId}, cb, er) {
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('messageId', messageId)
    form.append('message', message)
    if (messageImg !== null && messageImg !== undefined && messageImg !== '') {
      form.append('messageImg', messageImg)
    }
    form.append('pushState', pushState)
    if (studentId !== null && studentId !== undefined) {
      form.append('studentId', studentId)
    }
    var url = '/school/message/updateMessage.json'
    this.doPostRequest(url, form, cb, er)
  },
  // 修改留言主题
  getMessageInfo ({schoolId, messageId}, cb, er) {
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('messageId', messageId)
    var url = '/school/message/messageInfo.json'
    this.doPostRequest(url, form, cb, er)
  },
  // 查询留言详情会话列表
  queryConversationList({schoolId, messageId, studentId, rowStart, rowCount}, cb, er) {
    let form = new FormData()
    form.append('schoolId', schoolId)
    form.append('messageId', messageId)
    if (studentId !== null && studentId !== undefined) {
      form.append('studentId', studentId)
    }
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    this.doPostRequest('/school/message/queryMessageInfoList.json', form, cb, er)
  },
  // 留言回复
  addLeaveMessage ({schoolId, memberId, replyBody}, cb, er) {
    let form = new FormData()
    form.append('schoolId', schoolId)
    form.append('memberId', memberId)
    form.append('replyBody', replyBody)
    this.doPostRequest('/school/message/addLeaveMessage.json', form, cb, er)
  },
  // 留言会话详情
  messageMemberInfo ({schoolId, memberId}, cb, er) {
    let form = new FormData()
    form.append('schoolId', schoolId)
    form.append('memberId', memberId)
    this.doPostRequest('/school/message/messageMemberInfo.json', form, cb, er)
  },
  // 消息撤回
  messageReplyRevocation ({schoolId, replyId}, cb, er) {
    let form = new FormData()
    form.append('schoolId', schoolId)
    form.append('replyId', replyId)
    this.doPostRequest('/school/message/messageReplyRevocation.json', form, cb, er)
  },
  // 留言回执
  addReceiptMessage ({schoolId, memberId, replyBody}, cb, er) {
    let form = new FormData()
    form.append('schoolId', schoolId)
    form.append('memberId', memberId)
    form.append('replyBody', replyBody)
    this.doPostRequest('/school/message/addReceiptMessage.json', form, cb, er)
  },
  // 留言回执
  pushLeaveMessage ({schoolId, messageId}, cb, er) {
    let form = new FormData()
    form.append('schoolId', schoolId)
    form.append('messageId', messageId)
    this.doPostRequest('/school/message/pushLeaveMessage.json', form, cb, er)
  }
}
