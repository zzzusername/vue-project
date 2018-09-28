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
  // 开通个人版学校/~~/编辑个人版信息
  addPersonal ({schoolId, inviteUserId, data, type}, cb, er) {
    var form = new FormData()
    var url
    if (schoolId !== null && schoolId !== undefined) {
      form.append('schoolId', schoolId)
    }
    if (inviteUserId !== null && inviteUserId !== undefined) {
      form.append('inviteUserId', inviteUserId)
    }
    if (type === 'add') {
      url = '/school/personal/add.json'
    } else {
      url = '/school/personal/edit.json'
    }
    for (let key in data) {
      if (data[key] !== undefined && data[key] !== null) {
        form.append(key, data[key])
      }
    }
    this.doPostRequest(url, form, cb, er)
  },
  // 获取未开通的个人版学校
  personalNotopen(cb, er) {
    var config = {}
    var url = '/school/my/personal/notOpen.json'
    this.doGetRequest(config, url, cb, er)
  },
  // 获取个人版学校信息
  personalInfo({schoolId}, cb, er) {
    var form = new FormData()
    form.append('schoolId', schoolId)
    var url = '/school/personal/info.json'
    this.doPostRequest(url, form, cb, er)
  },
  addTeacher({schoolId, info}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    for (const key in info) {
      if (info.hasOwnProperty(key)) {
        const element = info[key]
        if (element !== undefined && element !== null) {
          if (key === 'lessonId') {
            form.append(key, element[0])
          } else {
            form.append(key, element)
          }
        }
      }
    }
    this.doPostRequest('/school/teacher/personage/addTeacher.json', form, cb, er)
  },
  addStudent({schoolId, info}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    for (const key in info) {
      if (info.hasOwnProperty(key)) {
        const element = info[key]
        if (element !== undefined && element !== null) {
          form.append(key, element)
        }
      }
    }
    this.doPostRequest('/school/student/personage/addStudent.json', form, cb, er)
  },
  updateTeacher({schoolId, info}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    for (const key in info) {
      if (info.hasOwnProperty(key)) {
        const element = info[key]
        if (element !== undefined && element !== null) {
          form.append(key, element)
        }
      }
    }
    this.doPostRequest('/school/teacher/personage/updateTeacher.json', form, cb, er)
  },
  inviteRedPackets({rowStart, rowCount}, cb, er) {
    const form = new FormData()
    for (const key in arguments[0]) {
      if (arguments[0].hasOwnProperty(key)) {
        const element = arguments[0][key]
        form.append(key, element)
      }
    }
    this.doPostRequest('/school/invite/inviteList.json', form, cb, er)
  },
  taskRedPackets(cb, er) {
    const form = new FormData()
    this.doPostRequest('/school/invite/inviteInfo.json', form, cb, er)
  },
  // 领取自己的红包
  getTaskRedPacket({type}, cb, er) {
    const form = new FormData()
    form.append('type', type)
    this.doPostRequest('/school/invite/getRedPacketToOneself.json', form, cb, er)
  },
  // 领取邀请奖励红包
  getInviteRedPacket({userId}, cb, er) {
    const form = new FormData()
    form.append('userId', userId)
    this.doPostRequest('/school/invite/getRedPacket.json', form, cb, er)
  },
  getPersonalQr({inviteUserId}, cb, er) {
    const form = new FormData()
    if (inviteUserId !== undefined && inviteUserId !== null) {
      form.append('inviteUserId', inviteUserId)
    }
    this.doPostRequest('/school/get/personalQr.json', form, cb, er)
  },
  getPersonalQrInfo({qrType}, cb, er) {
    const form = new FormData()
    form.append('qrType', qrType)
    this.doPostRequest('/school/qrimg/last.json', form, cb, er)
  },
  addStudentToOneself({schoolId, studentName, isContinue}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('studentName', studentName)
    if (isContinue === undefined || isContinue === null) {
      form.append('isContinue', false)
    } else {
      form.append('isContinue', isContinue)
    }
    this.doPostRequest('/school/student/personage/addStudentToOneself.json', form, cb, er)
  },
  addParentToOneself({schoolId, studentName, parentName, relationship, isContinue}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('studentName', studentName)
    form.append('parentName', parentName)
    form.append('relationship', relationship)
    if (isContinue === undefined || isContinue === null) {
      form.append('isContinue', false)
    } else {
      form.append('isContinue', isContinue)
    }
    this.doPostRequest('/school/parent/personage/addParentToOneself.json', form, cb, er)
  },
  addTeacherToOneself({schoolId, teacherName}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('teacherName', teacherName)
    this.doPostRequest('/school/teacher/apply/add.json', form, cb, er)
  },
  approveTeacher({schoolId, applyId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('applyId', applyId)
    this.doPostRequest('/school/teacher/apply/approve.json', form, cb, er)
  },
  applyTeacherInfo({schoolId, applyId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('applyId', applyId)
    this.doPostRequest('/school/teacher/apply/info.json', form, cb, er)
  }
}
