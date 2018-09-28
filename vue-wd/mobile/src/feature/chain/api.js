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
  // 发表接龙
  addChain({schoolId, chainId, chainType, chainTitle, chainImage, chainDesc, endDate, teacherIds, classes, isEdit}, cb, er) {
    var form = new FormData()
    form.append('schoolId', schoolId)
    if (chainId !== undefined && chainId !== null) {
      form.append('chainId', chainId)
    }
    form.append('chainType', chainType)
    form.append('chainTitle', chainTitle)
    if (chainImage !== undefined && chainImage !== null) {
      form.append('chainImage', chainImage)
    }
    if (chainDesc !== undefined && chainDesc !== null) {
      form.append('chainDesc', chainDesc)
    }
    form.append('endDate', endDate)
    if (parseInt(chainType) === 3) {
      for (let index = 0; index < classes.length; index++) {
        const element = classes[index]
        form.append('classes[' + index + '].classId', element.classId)
        if (element.isAll) {
          form.append('classes[' + index + '].isAll', true)
        } else {
          form.append('classes[' + index + '].isAll', false)
          for (let i = 0; i < element.student.length; i++) {
            const student = element.student[i]
            form.append('classes[' + index + '].student[' + i + '].studentId', student.studentId)
          }
        }
      }
    } else if (parseInt(chainType) === 2) {
      if (teacherIds !== undefined && teacherIds.length > 0) {
        form.append('teacherIds', teacherIds)
      }
    }
    let url
    if (isEdit) {
      url = '/school/chain/save.json'
    } else {
      url = '/school/chain/add.json'
    }
    this.doPostRequest(url, form, cb, er)
  },
  // 学生家长接龙列表
  queryChainStudent({schoolId, studentId, rowStart, rowCount}, cb, er) {
    var form = new FormData()
    form.append('schoolId', schoolId)
    if (studentId !== undefined && studentId !== null) {
      form.append('studentId', studentId)
    }
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    this.doPostRequest('/school/chain/student/query.json', form, cb, er)
  },
  // 老师接龙列表
  queryChainTeacher({schoolId, type, rowStart, rowCount}, cb, er) {
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('type', type)
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    this.doPostRequest('/school/chain/teacher/query.json', form, cb, er)
  },
  // 删除接龙
  deleteChain({schoolId, chainId}, cb, er) {
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('chainId', chainId)
    this.doPostRequest('/school/chain/delete.json', form, cb, er)
  },
  getInfo({schoolId, chainId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('chainId', chainId)
    this.doPostRequest('/school/chain/info.json', form, cb, er)
  },
  getStatus({type, schoolId, chainId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('chainId', chainId)
    let url = ''
    if (type === 1) {
      url = '/school/chain/teacher/queryChainMember.json'
    } else if (type === 2) {
      url = '/school/chain/student/queryChainMember.json'
    } else {
      url = '/school/chain/parent/queryChainMember.json'
    }
    this.doPostRequest(url, form, cb, er)
  },
  save({schoolId, chainId, studentId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('chainId', chainId)
    if (studentId) {
      studentId.forEach(id => {
        form.append('studentId', id)
      })
    }
    this.doPostRequest('/school/chain/proceedChain.json', form, cb, er)
  },
  remindUser({schoolId, chainId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('chainId', chainId)
    this.doPostRequest('/school/chain/pushNoChain.json', form, cb, er)
  }
}
