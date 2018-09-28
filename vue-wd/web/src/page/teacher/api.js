import axios from '@/api/axios.base'
export default {
  // 老师导入
  importTeacher ({schoolId, dataList}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    for (let index = 0; index < dataList.length; index++) {
      let element = dataList[index]
      form.append('teachers[' + index + '].teacherName', element.teacherName)
      if (element.teacherSex !== undefined && element.teacherSex !== null && element.teacherSex !== '') {
        form.append('teachers[' + index + '].teacherSex', element.teacherSex)
      }
      if (element.teacherTelephoneNum !== null && element.teacherTelephoneNum !== undefined && element.teacherTelephoneNum !== '') {
        form.append('teachers[' + index + '].teacherTelephoneNum', element.teacherTelephoneNum)
      }
      // form.append('teachers[' + index + '].teacherTelephoneNum', element.teacherTelephoneNum === undefined || element.teacherTelephoneNum === null ? '' : element.teacherTelephoneNum)
    }
    axios.post('school/teacher/import.json', form, config)
    .then(function (response) {
      cb(response.data)
    })
    .catch(function ({ response }) {
      er(response.data)
    })
  },
  getTeacherList ({ schoolId, teacherName, rowStart, rowCount }, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    if (teacherName !== null && teacherName !== undefined) {
      form.append('teacherName', teacherName)
    }
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    axios.post('/school/teacher/teacherList.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  delTeacher ({ schoolId, teacherId }, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('teacherId', teacherId)
    axios.post('/school/teacher/delTeacher.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  getTeacherinfo ({ schoolId, teacherId }, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' },
      isShowLoad: false
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('teacherId', teacherId)
    axios.post('/school/teacher/manage/teacherInfo.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  updateTeacher ({schoolId, teacherId, data}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('teacherId', teacherId)
    for (var key in data) {
      if (data[key] !== null && data[key] !== undefined) {
        form.append(key, data[key])
      }
    }
    axios.post('/school/teacher/manage/updateTeacher.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 学校获取教师列表数量
  teacherListCount ({schoolId, teacherName}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    if (teacherName !== undefined && teacherName !== null) {
      form.append('teacherName', teacherName)
    }
    axios.post('/school/teacher/teacherListCount.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
    // 学校教师保存
  saveTeacher ({ schoolId, data }, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    for (let item in data) {
      if (data[item] !== null && data[item] !== undefined) {
        form.append(item, data[item])
      }
    }
    axios.post('/school/teacher/addTeacher.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
    // 学校教师绑定二维码返回
  getTeacherBindingCode ({schoolId, teacherId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('teacherId', teacherId)
    axios.post('/school/teacher/getTeacherBindingCode.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  }
}
