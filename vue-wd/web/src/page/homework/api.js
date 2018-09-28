import axios from '@/api/axios.base'
export default {
  queryTeacherLessonList ({schoolId, featureCode}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('featureCode', featureCode)
    axios.post('/school/teacher/queryLessonList.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 老师-添加作业
  teacherAddWork ({schoolId, classes, lessonId, workDate, endDate, workContent, workImg, workFile, workVideo}, cb, er) {  // workImg, workVoice
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
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
          form.append('classes[' + index + '].student[' + i + '].isRequire', student.isRequire)
        }
      }
    }
    if (lessonId !== null && lessonId !== undefined) {
      form.append('lessonId', lessonId)
    }
    if (workImg !== null && workImg !== undefined) {
      form.append('workImg', workImg)
    }
    form.append('workDate', workDate)
    if (endDate !== null && endDate !== undefined) {
      form.append('endDate', endDate)
    }
    if (workFile !== null && workFile !== undefined && workFile !== '') {
      form.append('workFile', workFile)
    }
    if (workVideo !== null && workVideo !== undefined && workVideo !== '') {
      form.append('workVideo', workVideo)
    }
    if (workContent !== undefined && workContent !== null && workContent !== '') {
      form.append('workContent', workContent)
    }
    axios.post('/school/work/add.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 老师作业列表（带查询条件)
  teacherQueryWork ({schoolId, classId, startDate, endDate, status, rowStart, rowCount}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    if (classId !== null && classId !== undefined) {
      form.append('classId', classId)
    }
    if (status !== null) {
      form.append('status', status)
    }
    if (startDate !== null) {
      form.append('startDate', startDate)
    }
    if (endDate !== null) {
      form.append('endDate', endDate)
    }
    axios.post('/school/work/teacher/query.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
    // 老师作业详情查看
  queryTeacherWorkInfo ({schoolId, workId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('workId', workId)
    axios.post('/school/work/teacher/info.json', form, config)
    .then(function (response) {
      cb(response.data)
    })
    .catch(function ({ response }) {
      er(response.data)
    })
  },
  // 老师-编辑作业
  teacherEditHomework ({schoolId, classes, workId, endDate, workContent, workImg, workFile}, cb, er) { // workImg, workVoice
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
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
          form.append('classes[' + index + '].student[' + i + '].isRequire', student.isRequire)
        }
      }
    }
    if (workFile !== null && workFile !== undefined && workFile !== '') {
      form.append('workFile', workFile)
    }
    form.append('schoolId', schoolId)
    form.append('workId', workId)
    form.append('endDate', endDate)
    if (workContent !== undefined && workContent !== null && workContent !== '') {
      form.append('workContent', workContent)
    }
    if (workImg !== undefined && workImg !== null && workImg.length > 0) {
      form.append('workImg', workImg)
    }
    axios.post('/school/work/save.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
   // 推送作业
  pushWork ({schoolId, workId, classId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('workId', workId)
    form.append('classId', classId)
    axios.post('/school/work/teacher/push.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 学生作业详情（通用）
  studentWorkInfo ({studentWorkId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('studentWorkId', studentWorkId)
    axios.post('/school/work/student/info.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 老师批阅接口
  teacherRemarks ({schoolId, classId, studentWorkId, workRemark, wordGrade, workLevel}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('classId', classId)
    form.append('studentWorkId', studentWorkId)
    if (workRemark !== null && workRemark !== undefined) {
      form.append('workRemark', workRemark)
    }
    if (wordGrade !== null && wordGrade !== undefined) {
      form.append('wordGrade', wordGrade)
    }
    if (workLevel !== null && workLevel !== undefined) {
      form.append('workLevel', workLevel)
    }
    axios.post('/school/work/teacher/remarks.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 教师身份按照班级查询学生
  queryStudentList ({schoolId, classId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('classId', classId)
    form.append('rowStart', 0)
    form.append('rowCount', 9999)
    axios.post('/school/student/teacher/studentList.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 按照班级查询学生
  teacherStudentListorderName ({schoolId, classId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('classId', classId)
    form.append('rowStart', 0)
    form.append('rowCount', 9999)
    axios.post('/school/student/teacher/studentList/orderName.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 推送作业
  remindWork ({schoolId, workId, classId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('workId', workId)
    form.append('classId', classId)
    axios.post('/school/work/pushWork.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({ response }) {
          er(response.data)
        })
  },
  // 删除作业
  deleteWork ({schoolId, workId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('workId', workId)
    axios.post('/school/work/deleteWork.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  }
}
