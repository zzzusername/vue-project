import axios from '@/api/axios.base'
export default {
  // 退出
  homeLogout (cb, er) {
    axios.get('/logout/index.json')
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  getUserList (cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' },
      isShowLoad: false
    }
    var form = new FormData()
    axios.post('/user/queryAll.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 切换测试用户
  switchUser ({userId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' },
      isShowLoad: false
    }
    var form = new FormData()
    form.append('userId', userId)
    axios.post('/login/backIndex.json', form, config)
    .then(function (response) {
      cb(response.data)
    })
    .catch(function ({ response }) {
      er(response.data)
    })
  },
  // 获取老师权限
  getTeacherFeatures ({schoolId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' },
      isShowLoad: false
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    axios.post('/school/teacher/feature.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  queryRelationOrg ({schoolId, orgType, rowStart, rowCount}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    if (orgType !== null && orgType !== undefined) {
      form.append('orgType', orgType)
    }
    axios.post('/school/org.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 获取课程管理列表
  getClassList ({schoolId, classType, rowStart, rowCount, gradeId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    form.append('isGraduate', false)
    if (classType !== null && classType !== undefined) {
      form.append('classType', classType)
    }
    if (gradeId !== null && gradeId !== undefined) {
      form.append('gradeId', gradeId)
    }
    axios.post('/school/class/list.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  queryTeacherClassList ({schoolId, featureCode}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    if (featureCode !== undefined && featureCode !== null) {
      form.append('featureCode', featureCode)
    }
    axios.post('/school/teacher/queryTeacherClassList.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 学校管理学生列表
  getStudentList ({ schoolId, excludeClassId, studentName, classId, rowStart, rowCount }, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    if (studentName != null) {
      form.append('studentName', studentName)
    }
    if (classId != null) {
      form.append('classId', classId)
    }
    if (excludeClassId !== undefined && excludeClassId !== null) {
      form.append('excludeClassId', excludeClassId)
    }
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    axios.post('/school/student/studentList.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  getLessonsList ({schoolId, rowStart, rowCount}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    axios.post('/school/lesson/list.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 家长功能
  getSchoolParentFeature ({schoolId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    axios.post('/school/parent/feature.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 学生功能
  getSchoolStudentFeature ({schoolId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    axios.post('/school/student/feature.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 获取家长信息
  getParentInfoSelf ({schoolId}, cb, er) {
    var config = {
      params: {
        schoolId
      }
    }
    axios.get('/school/parent/parentInfo.json', config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  }
}
