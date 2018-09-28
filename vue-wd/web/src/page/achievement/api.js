import axios from '@/api/axios.base'
export default {
  // 获取班级
  queryTeacherClassList ({schoolId, featureCode}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('featureCode', featureCode)
    axios.post('/school/teacher/queryTeacherClassList.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 导入成绩单
  importAchievement ({schoolId, students}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'application/json' }
    }
    students.schoolId = schoolId
    axios.post('/school/achievement/teacher/import.json', students, config)
    .then(function (response) {
      cb(response.data)
    })
    .catch(function ({ response }) {
      er(response.data)
    })
  },
  // 获取学生列表
  getStudentList ({schoolId, classId, featureCode, rowStart, rowCount}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('classId', classId)
    form.append('featureCode', featureCode)
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    axios.post('/school/student/feature/studentList.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 获取成绩单列表
  getAchievementListForTeacher ({schoolId, classId, lessonId, searchTime, rowStart, rowCount}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    if (classId !== null && classId !== undefined) {
      form.append('classId', classId)
    }
    if (lessonId !== null && lessonId !== undefined) {
      form.append('lessonId', lessonId)
    }
    if (searchTime !== null && searchTime !== undefined) {
      form.append('searchTime', searchTime)
    }
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    axios.post('/school/achievement/teacher/list.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 获取成绩单详情
  getAchievementInfo ({schoolId, achievementsId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('achievementsId', achievementsId)
    axios.post('/school/achievement/teacher/info.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 修改成绩单
  editAchievement ({schoolId, students}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'application/json' }
    }
    students.schoolId = schoolId
    axios.post('/school/achievement/teacher/edit.json', students, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 删除成绩单
  deleteAchievement ({schoolId, classId, achievementsId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('achievementsId', achievementsId)
    form.append('classId', classId)
    axios.post('/school/achievement/teacher/delete.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 成绩班级汇总查询
  queryAchievement ({schoolId, classIds, data}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    if (classIds !== null && classIds.length > 0) {
      form.append('classIds', classIds)
    }
    for (let item in data) {
      if (data[item] !== null && data[item] !== undefined) {
        form.append(item, data[item])
      }
    }
    axios.post('/school/achievement/cLass/summary.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 摘要
  queryDescribe ({schoolId, classIds, info}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    if (classIds !== null && classIds.length > 0) {
      form.append('classIds', classIds)
    }
    for (let item in info) {
      if (info[item] !== null && info[item] !== undefined) {
        form.append(item, info[item])
      }
    }
    axios.post('/school/achievement/describe.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  }
}
