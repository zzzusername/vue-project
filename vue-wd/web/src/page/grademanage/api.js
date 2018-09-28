import axios from '@/api/axios.base'
export default {
  // 学校年级列表
  getGradeList ({schoolId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('isFinish', false)
    axios.post('/school/grade/list.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({ response }) {
          er(response.data)
        })
  },
  // 添加年级
  addGrade ({schoolId, gradeName}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('gradeName', gradeName)
    axios.post('/school/grade/add.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 删除年级
  delGrade ({schoolId, gradeId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('gradeId', gradeId)
    axios.post('/school/grade/del.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 修改年级
  editGrade ({schoolId, gradeId, gradeName}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('gradeId', gradeId)
    form.append('gradeName', gradeName)
    axios.post('/school/grade/save.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 单个添加班级
  onlyAddclass ({schoolId, gradeId, classType, className}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    if (gradeId !== null && gradeId !== undefined) {
      form.append('gradeId', gradeId)
    }
    form.append('classType', classType)
    form.append('className', className)
    form.append('isTeacherCreateOrg', true)
    axios.post('/school/class/add.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 批量添加班级
  batchAddclass ({schoolId, infoListJson}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    // for (let index = 0; index < infoList.length; index++) {
    //   const element = infoList[index]
    //   form.append('infoList[' + index + '].className', element.className)
    //   form.append('infoList[' + index + '].classType', element.classType)
    //   form.append('infoList[' + index + '].gradeId', element.gradeId)
    // }
    form.append('infoListJson', infoListJson)
    axios.post('/school/class/addList.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 删除班级
  deleteClass ({schoolId, classId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('classId', classId)
    axios.post('/school/class/delete.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 修改班级
  editClass ({schoolId, classId, className, classTeacherId, info}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('classId', classId)
    if (className !== null && className !== undefined) {
      form.append('className', className)
    }
    if (classTeacherId !== null && classTeacherId !== undefined) {
      form.append('classTeacherId', classTeacherId)
    }
    for (let i in info) {
      if (info[i] !== null && info[i] !== undefined) {
        form.append(i, info[i])
      }
    }
    axios.post('/school/class/edit.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 学校获取教师列表
  getTeacherList ({schoolId, teacherName, rowStart, rowCount}, cb, er) {
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
  // 年级毕业、年级毕业
  gradeEdit ({schoolId, gradeId, gradeName}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    let url
    form.append('schoolId', schoolId)
    form.append('gradeId', gradeId)
    url = '/school/grade/finish.json' // 毕业
    if (gradeName !== null && gradeName !== undefined && gradeName !== '') {
      form.append('gradeName', gradeName)
      url = '/school/grade/upGrade.json'  // 升级
    }
    axios.post(url, form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 搜索
  searchStudnt ({schoolId, name, rowStart, rowCount}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('name', name)
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    axios.post('/school/student/queryStudentByNameOrClassName.json', form, config)
    .then(function (response) {
      cb(response.data)
    })
    .catch(function ({ response }) {
      er(response.data)
    })
  },
  // 修改学生班级功能（批量)
  updateStudentClassList ({schoolId, list}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    for (let i = 0; i < list.length; i++) {
      form.append('list[' + i + '].studentId', list[i].studentId)
      form.append('list[' + i + '].oldClassId', list[i].oldClassId)
      form.append('list[' + i + '].newClassId', list[i].newClassId)
    }
    axios.post('/school/student/updateStudentClassList.json', form, config)
    .then(function (response) {
      cb(response.data)
    })
    .catch(function ({ response }) {
      er(response.data)
    })
  },
  // 年级组长管理列表
  gradeTeacherList ({schoolId, gradeId, teacherName, isExist}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('gradeId', gradeId)
    if (teacherName !== null && teacherName !== undefined && teacherName !== '') {
      form.append('teacherName', teacherName)
    }
    form.append('isExist', isExist)
    form.append('rowStart', 0)
    form.append('rowCount', 99999)
    axios.post('/school/grade/teacher/list.json', form, config)
    .then(function (response) {
      cb(response.data)
    })
    .catch(function ({ response }) {
      er(response.data)
    })
  },
  // 功能列表
  getFeatureList ({schoolId, gradeId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('gradeId', gradeId)
    axios.post('/school/grade/feature/list.json', form, config)
    .then(function (response) {
      cb(response.data)
    })
    .catch(function ({ response }) {
      er(response.data)
    })
  },
  // 年级组添加、删除老师
  gradeEditTeacher ({schoolId, gradeId, teacherId, isExist}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('gradeId', gradeId)
    form.append('teacherId', teacherId)
    form.append('isExist', isExist)
    axios.post('/school/grade/teacher/save.json', form, config)
    .then(function (response) {
      cb(response.data)
    })
    .catch(function ({ response }) {
      er(response.data)
    })
  },
  // 年级信息
  getGradeInfo ({schoolId, gradeId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('gradeId', gradeId)
    axios.post('/school/grade/info.json', form, config)
    .then(function (response) {
      cb(response.data)
    })
    .catch(function ({ response }) {
      er(response.data)
    })
  },
  // 学生转班
  updateStudentClassByName ({schoolId, gradeId, list}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('gradeId', gradeId)
    for (let i = 0; i < list.length; i++) {
      form.append('list[' + i + '].studentName', list[i].studentName)
      form.append('list[' + i + '].oldClassName', list[i].oldClassName)
      form.append('list[' + i + '].newClassName', list[i].newClassName)
    }
    axios.post('/school/student/updateStudentClassByName.json', form, config)
    .then(function (response) {
      cb(response.data)
    })
    .catch(function ({ response }) {
      er(response.data)
    })
  }
}
