import axios from '@/api/axios.base'
export default {
  // 导入学生
  importStudent ({schoolId, classId, dataList}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('classId', classId)
    for (let index = 0; index < dataList.length; index++) {
      let element = dataList[index]
      form.append('students[' + index + '].studentName', element.studentName)
      if (element.studentTelephone_num !== undefined && element.studentTelephone_num !== null && element.studentTelephone_num !== '') {
        form.append('students[' + index + '].studentTelephone_num', element.studentTelephone_num)
      }
      if (element.studentSex !== undefined && element.studentSex !== null && element.studentSex !== '') {
        form.append('students[' + index + '].studentSex', element.studentSex)
      }
      if (element.studentNumber !== undefined && element.studentNumber !== null && element.studentNumber !== '') {
        form.append('students[' + index + '].studentNumber', element.studentNumber)
      }
      // if (element.isLodging !== undefined && element.isLodging !== null && element.isLodging !== '') {
      //   form.append('isLodging[' + index + '].isLodging', element.isLodging)
      // }
    }
    axios.post('school/student/import.json', form, config)
    .then(function (response) {
      cb(response.data)
    })
    .catch(function ({ response }) {
      er(response.data)
    })
  },
  // 删除学生
  delStudent ({schoolId, studentId, classId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('studentId', studentId)
    if (classId !== undefined && classId !== null) {
      form.append('classId', classId)
    }
    axios.post('/school/student/delStudent.json', form, config)
    .then(function (response) {
      cb(response.data)
    })
    .catch(function ({ response }) {
      er(response.data)
    })
  },
  // 添加学生
  addStudent ({schoolId, info, classId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('classId', classId)
    Object.keys(info).forEach((key) => {
      if (info[key] !== null && info[key] !== undefined) {
        form.append(key, info[key])
      }
    })
    axios.post('/school/student/addStudent.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 获取学生信息
  getStudentInfo ({schoolId, studentId, bindingCode}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('studentId', studentId)
    axios.post('/school/student/studentInfo.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 管理员编辑学生资料
  adminEditStudentInfo ({schoolId, info, studentId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('studentId', studentId)
    Object.keys(info).forEach((key) => {
      if (info[key] !== null && info[key] !== undefined) {
        form.append(key, info[key])
      }
    })
    axios.post('/school/student/updateStudent.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  }
}
