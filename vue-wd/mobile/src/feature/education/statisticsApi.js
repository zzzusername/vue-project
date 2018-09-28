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
  // 获取教师管理班级列表信息
  queryTeacherClassList({schoolId, featureCode}, cb, er) {
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('featureCode', featureCode)
    var url = '/school/teacher/queryTeacherClassList.json'
    this.doPostRequest(url, form, cb, er)
  },
  // 获取课程列表(带老师)根据班级id
  // queryLessonListByClassId({schoolId, classId, featureCode}, cb, er) {
  //   var form = new FormData()
  //   form.append('schoolId', schoolId)
  //   form.append('classId', classId)
  //   form.append('featureCode', featureCode)
  //   var url = '/school/lesson/queryLessonListByClassId.json'
  //   this.doPostRequest(url, form, cb, er)
  // },
  // 获取班级查询可操作老师列表(根据权限编码查询)
  queryClassTeacherList({schoolId, classId, featureCode}, cb, er) {
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('classId', classId)
    form.append('featureCode', featureCode)
    var url = '/school/teacher/queryClassTeacherList.json'
    this.doPostRequest(url, form, cb, er)
  },
  // 统计--老师--列表／详情
  queryWorkStatisticsTeacherList({schoolId, data, startDate, endDate, studentId}, cb, er) {
    var form = new FormData()
    var url
    form.append('schoolId', schoolId)
    form.append('startDate', startDate += ' 00:00:00')
    form.append('endDate', endDate += ' 23:59:59')
    for (var key in data) {
      if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
        form.append(key, data[key])
      }
    }
    if (studentId !== null && studentId !== undefined) {
      form.append('studentId', studentId)
      url = '/school/work/queryStatisticsTeacherInfo.json'
    } else {
      url = '/school/work/queryStatisticsTeacherList.json'
    }
    this.doPostRequest(url, form, cb, er)
  },
  // 获取学校所有课程列表
  getSchoolLessons({schoolId}, cb, er) {
    var form = new FormData()
    form.append('schoolId', schoolId)
    var url = '/school/lesson/base/list.json'
    this.doPostRequest(url, form, cb, er)
  },
  // 教师查看考勤统计
  queryCheckStatisticsTeacherList({schoolId, filters}, cb, er) {
    var form = new FormData()
    form.append('schoolId', schoolId)
    var tmpFilters = JSON.parse(JSON.stringify(filters))
    for (var item in tmpFilters) {
      if (tmpFilters[item] === null) {
        continue
      }
      if (item === 'startDate') {
        tmpFilters[item] += ' 00:00:00'
      } else if (item === 'endDate') {
        tmpFilters[item] += ' 23:59:59'
      }
      form.append(item, tmpFilters[item])
    }
    var url = '/school/check/queryStatisticsTeacherList.json'
    this.doPostRequest(url, form, cb, er)
  },
  // 查询成绩单筛选条件
  getAchievementBaseList({schoolId, classId, lessonId, startDate, endDate, studentId}, cb, er) {
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('startDate', startDate)
    form.append('endDate', endDate)
    if (classId !== undefined && classId !== null) {
      form.append('classId', classId)
    }
    if (lessonId !== undefined && lessonId !== null) {
      form.append('lessonId', lessonId)
    }
    if (studentId !== undefined && studentId !== null) {
      form.append('studentId', studentId)
    }
    // lessonId.forEach(function(element) {
    //   form.append('lessonId', element)
    // }, this)
    var url = '/school/achievement/base/list.json'
    this.doPostRequest(url, form, cb, er)
  },
  // 查询成绩统计
  queryStatisticsStudentListByClassInfo({schoolId, classId, lessonId, startDate, endDate, achievementsId}, cb, er) {
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('classId', classId)
    form.append('startDate', startDate)
    form.append('endDate', endDate)
    if (lessonId !== null) {
      form.append('lessonId', lessonId)
      // lessonId.forEach(function(element) {
      //   form.append('lessonId', element)
      // }, this)
    }
    if (achievementsId !== null) {
      achievementsId.forEach(function(element) {
        form.append('achievementsId', element)
      }, this)
    }
    var url = '/school/achievement/queryStatisticsStudentListByClassInfo.json'
    this.doPostRequest(url, form, cb, er)
  },
  // 老师查看考勤学生详情
  queryCheckStatisticsStudentInfo({schoolId, filters, studentId}, cb, er) {
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('studentId', studentId)
    var tmpFilters = JSON.parse(JSON.stringify(filters))
    for (var item in tmpFilters) {
      if (tmpFilters[item] === null) {
        continue
      }
      if (item === 'startDate') {
        tmpFilters[item] += ' 00:00:00'
      } else if (item === 'endDate') {
        tmpFilters[item] += ' 23:59:59'
      }
      form.append(item, tmpFilters[item])
    }
    var url = '/school/check/queryStatisticsTeacherInfo.json'
    this.doPostRequest(url, form, cb, er)
  },
  // 查询列表中学生成绩统计
  queryStatisticsStudentInfoByClassInfo({schoolId, classId, lessonId, studentId, startDate, endDate, achievementsId}, cb, er) {
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('classId', classId)
    form.append('startDate', startDate)
    form.append('endDate', endDate)
    if (studentId !== null && studentId !== undefined) {
      form.append('studentId', studentId)
    }
    if (lessonId !== null) {
      form.append('lessonId', lessonId)
      // lessonId.forEach(function(element) {
      //   form.append('lessonId', element)
      // }, this)
    }
    if (achievementsId !== null) {
      achievementsId.forEach(function(element) {
        form.append('achievementsId', element)
      }, this)
    }
    var url = '/school/achievement/queryStatisticsTeacherInfo.json'
    this.doPostRequest(url, form, cb, er)
  },
  // 统计--校长--作业班级列表
  getHomeWorkListAlway({schoolId, startDate, endDate, lessonId, type}, cb, er) {
    var form = new FormData()
    var url
    if (type === 'class') {
      url = '/school/work/class/getSchoolWorkCountManagerList.json'
    } else {
      url = '/school/work/teacher/getSchoolWorkCountManagerTeacherList.json'
    }
    form.append('schoolId', schoolId)
    form.append('startDate', startDate += ' 00:00:00')
    form.append('endDate', endDate += ' 23:59:59')
    if (lessonId !== null && lessonId !== undefined && lessonId !== '') {
      form.append('lessonId', lessonId)
    }
    this.doPostRequest(url, form, cb, er)
  },
  // 统计--校长--作业班级详情
  getSchoolWorkCountClass({schoolId, startDate, endDate, classId, lessonId, teacherId, type}, cb, er) {
    var form = new FormData()
    var url
    form.append('schoolId', schoolId)
    form.append('startDate', startDate += ' 00:00:00')
    form.append('endDate', endDate += ' 23:59:59')
    if (classId !== null && classId !== undefined && classId !== '') {
      form.append('classId', classId)
    }
    if (lessonId !== null && lessonId !== undefined && lessonId !== '') {
      form.append('lessonId', lessonId)
    }
    if (teacherId !== null && teacherId !== undefined && teacherId !== '') {
      form.append('teacherId', teacherId)
    }
    if (type === 'class') {
      url = '/school/work/class/getSchoolWorkCountManagerInfo.json'
    } else {
      url = '/school/work/teacher/getSchoolWorkCountManagerTeacherInfo.json'
    }
    this.doPostRequest(url, form, cb, er)
  },
  // 校长查看班级考勤统计
  queryCheckClassStatistics({schoolId, filters}, cb, er) {
    var form = new FormData()
    form.append('schoolId', schoolId)
    var tmpFilters = JSON.parse(JSON.stringify(filters))
    for (var item in tmpFilters) {
      if (tmpFilters[item] === null) {
        continue
      }
      if (item === 'startDate') {
        tmpFilters[item] += ' 00:00:00'
      } else if (item === 'endDate') {
        tmpFilters[item] += ' 23:59:59'
      }
      form.append(item, tmpFilters[item])
    }
    var url = '/school/check/queryStatisticsManageClassList.json'
    this.doPostRequest(url, form, cb, er)
  },
  // 校长查看任课老师考勤统计
  queryCheckStatisticsTeachers({schoolId, filters}, cb, er) {
    var form = new FormData()
    form.append('schoolId', schoolId)
    var tmpFilters = JSON.parse(JSON.stringify(filters))
    for (var item in tmpFilters) {
      if (tmpFilters[item] === null) {
        continue
      }
      if (item === 'startDate') {
        tmpFilters[item] += ' 00:00:00'
      } else if (item === 'endDate') {
        tmpFilters[item] += ' 23:59:59'
      }
      form.append(item, tmpFilters[item])
    }
    var url = '/school/check/queryStatisticsManageTeacherList.json'
    this.doPostRequest(url, form, cb, er)
  },
  // 校长查看点名老师考勤统计
  queryCheckTeacherStatistics({schoolId, filters}, cb, er) {
    var form = new FormData()
    form.append('schoolId', schoolId)
    var tmpFilters = JSON.parse(JSON.stringify(filters))
    for (var item in tmpFilters) {
      if (tmpFilters[item] === null) {
        continue
      }
      if (item === 'startDate') {
        tmpFilters[item] += ' 00:00:00'
      } else if (item === 'endDate') {
        tmpFilters[item] += ' 23:59:59'
      }
      form.append(item, tmpFilters[item])
    }
    var url = '/school/check/queryStatisticsManageCheckTeacherList.json'
    this.doPostRequest(url, form, cb, er)
  },
  // 校长查看班级考勤统计详情
  queryStatisticsClassInfo({schoolId, filters, classId}, cb, er) {
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('classId', classId)
    var tmpFilters = JSON.parse(JSON.stringify(filters))
    for (var item in tmpFilters) {
      if (tmpFilters[item] === null) {
        continue
      }
      if (item === 'startDate') {
        tmpFilters[item] += ' 00:00:00'
      } else if (item === 'endDate') {
        tmpFilters[item] += ' 23:59:59'
      }
      form.append(item, tmpFilters[item])
    }
    var url = '/school/check/queryStatisticsManageClassInfo.json'
    this.doPostRequest(url, form, cb, er)
  },
  // 校长查看任课老师考勤统计详情
  queryCheckStatisticsTeacherInfo({schoolId, filters, teacherId}, cb, er) {
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('teacherId', teacherId)
    var tmpFilters = JSON.parse(JSON.stringify(filters))
    for (var item in tmpFilters) {
      if (tmpFilters[item] === null) {
        continue
      }
      if (item === 'startDate') {
        tmpFilters[item] += ' 00:00:00'
      } else if (item === 'endDate') {
        tmpFilters[item] += ' 23:59:59'
      }
      form.append(item, tmpFilters[item])
    }
    var url = '/school/check/queryStatisticsManageTeacherInfo.json'
    this.doPostRequest(url, form, cb, er)
  },
  // 校长查看任课老师考勤统计详情
  queryStatisticsCheckTeacherInfo({schoolId, filters, teacherId}, cb, er) {
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('teacherId', teacherId)
    var tmpFilters = JSON.parse(JSON.stringify(filters))
    for (var item in tmpFilters) {
      if (tmpFilters[item] === null) {
        continue
      }
      if (item === 'startDate') {
        tmpFilters[item] += ' 00:00:00'
      } else if (item === 'endDate') {
        tmpFilters[item] += ' 23:59:59'
      }
      form.append(item, tmpFilters[item])
    }
    var url = '/school/check/queryStatisticsManageCheckTeacherInfo.json'
    this.doPostRequest(url, form, cb, er)
  },
  // 查询学生成绩统计信息
  queryStatisticsTeacherInfoForAchievement({schoolId, studentId, classId, startDate, endDate, isParents}, cb, er) {
    var form = new FormData()
    form.append('schoolId', schoolId)
    if (studentId !== null && studentId !== undefined) {
      form.append('studentId', studentId)
    }
    form.append('startDate', startDate)
    form.append('endDate', endDate)
    var url = ''
    if (studentId === null || studentId === undefined) {
      url = '/school/achievement/stu/queryStatisticsTeacherInfo.json'
    } else if (parseInt(isParents) === 1) {
      url = '/school/achievement/parent/queryStatisticsTeacherInfo.json'
    } else {
      form.append('classId', classId)
      url = '/school/achievement/teacher/queryStatisticsTeacherInfo.json'
    }
    this.doPostRequest(url, form, cb, er)
  },
  // 查询学生作业统计信息
  queryStatisticsTeacherInfoForWork({schoolId, studentId, classId, startDate, endDate, isParents}, cb, er) {
    var form = new FormData()
    form.append('schoolId', schoolId)
    if (studentId !== null && studentId !== undefined) {
      form.append('studentId', studentId)
    }
    form.append('startDate', startDate)
    form.append('endDate', endDate)
    var url = ''
    if (studentId === null || studentId === undefined) {
      url = '/school/work/stu/queryStatisticsTeacherInfo.json'
    } else if (parseInt(isParents) === 1) {
      url = '/school/work/parent/queryStatisticsTeacherInfo.json'
    } else {
      form.append('classId', classId)
      url = '/school/work/teacher/queryStatisticsTeacherInfo.json'
    }
    this.doPostRequest(url, form, cb, er)
  },
  // 查询学生考勤统计信息
  queryStatisticsTeacherInfoForCheck({schoolId, studentId, classId, startDate, endDate, isParents}, cb, er) {
    var form = new FormData()
    form.append('schoolId', schoolId)
    if (studentId !== null && studentId !== undefined) {
      form.append('studentId', studentId)
    }
    form.append('startDate', startDate)
    form.append('endDate', endDate)
    var url = ''
    if (studentId === null || studentId === undefined) {
      url = '/school/check/stu/queryStatisticsTeacherInfo.json'
    } else if (parseInt(isParents) === 1) {
      url = '/school/check/parent/queryStatisticsTeacherInfo.json'
    } else {
      form.append('classId', classId)
      url = '/school/check/teacher/queryStatisticsTeacherInfo.json'
    }
    this.doPostRequest(url, form, cb, er)
  },
  // 查询学生评语统计信息
  queryStatisticsTeacherInfoForComment({schoolId, studentId, classId, startDate, endDate, isParents}, cb, er) {
    var form = new FormData()
    form.append('schoolId', schoolId)
    if (studentId !== null && studentId !== undefined) {
      form.append('studentId', studentId)
    }
    form.append('startDate', startDate)
    form.append('endDate', endDate)
    var url = ''
    if (studentId === null || studentId === undefined) {
      url = '/school/comment/stu/count.json'
    } else if (parseInt(isParents) === 1) {
      url = '/school/comment/parent/count.json'
    } else {
      form.append('classId', classId)
      url = '/school/comment/teacher/count.json'
    }
    this.doPostRequest(url, form, cb, er)
  },
  // 考勤统计二维表格
  queryCheckStudentCycleReport({schoolId, filters}, cb, er) {
    var form = new FormData()
    form.append('schoolId', schoolId)
    var tmpFilters = JSON.parse(JSON.stringify(filters))
    for (var item in tmpFilters) {
      if (tmpFilters[item] === null) {
        continue
      }
      if (item === 'startDate') {
        tmpFilters[item] += ' 00:00:00'
      } else if (item === 'endDate') {
        tmpFilters[item] += ' 23:59:59'
      }
      form.append(item, tmpFilters[item])
    }
    var url = '/school/check/queryCheckStudentCycleReport.json'
    this.doPostRequest(url, form, cb, er)
  },
  // 是否已经订阅周报推送
  isSubscribe({type}, cb, er) {
    var form = new FormData()
    form.append('type', type)
    var url = '/subscribe/isSubscribe.json'
    this.doPostRequest(url, form, cb, er)
  },
  // 取消订阅
  deleteSubscribe({type}, cb, er) {
    var form = new FormData()
    form.append('type', type)
    var url = '/subscribe/delete.json'
    this.doPostRequest(url, form, cb, er)
  },
  // 订阅
  addSubscribe({type}, cb, er) {
    var form = new FormData()
    form.append('type', type)
    var url = '/subscribe/add.json'
    this.doPostRequest(url, form, cb, er)
  },
  // 查询成绩统计
  queryAchievementStudentCycleReport({schoolId, classId, lessonId, startDate, endDate, achievementsId}, cb, er) {
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('classId', classId)
    form.append('startDate', startDate)
    form.append('endDate', endDate)
    if (lessonId !== null) {
      form.append('lessonId', lessonId)
      // lessonId.forEach(function(element) {
      //   form.append('lessonId', element)
      // }, this)
    }
    if (achievementsId !== null) {
      achievementsId.forEach(function(element) {
        form.append('achievementsId', element)
      }, this)
    }
    var url = '/school/achievement/queryAchievementStudentCycleReport.json'
    this.doPostRequest(url, form, cb, er)
  },
  // 统计--老师--作业二维表格
  queryWorkStudentCycleReport({schoolId, data, startDate, endDate}, cb, er) {
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('startDate', startDate += ' 00:00:00')
    form.append('endDate', endDate += ' 23:59:59')
    for (var key in data) {
      if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
        form.append(key, data[key])
      }
    }
    this.doPostRequest('/school/work/queryWorkStudentCycleReport.json', form, cb, er)
  },
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
  // 查询成绩单列表加各种身份
  geiAchievementListByIdentity ({schoolId, classId, studentId, startDate, endDate, rowStart, rowCount, type}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    if (classId !== undefined && classId !== null) {
      form.append('classId', classId)
    }
    if (studentId !== undefined && studentId !== null) {
      form.append('studentId', studentId)
    }
    form.append('startDate', startDate)
    form.append('endDate', endDate)
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    let url
    if (type === 'student') {
      url = '/school/achievement/student/list.json'
    } else if (type === 'parent') {
      url = '/school/achievement/parent/list.json'
    } else if (type === 'teacher') {
      url = '/school/achievement/base/list.json'
    }
    axios.post(url, form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 根据成绩单id查询课程名称和排名名称
  getlessonNameByAchievementIds ({schoolId, achievementsId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('achievementsId', achievementsId)
    axios.post('/school/achievement/getlessonNameByAchievementIds.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 查看成绩走势老师、家长、学生
  queryAchievementTrend ({schoolId, classId, achievementsId, lessonId, studentId, type}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    if (classId !== undefined && classId !== null) {
      form.append('classId', classId)
    }
    form.append('achievementsId', achievementsId)
    if (lessonId !== null && lessonId !== undefined) {
      form.append('lessonId', lessonId)
    }
    if (studentId !== undefined && studentId !== null) {
      form.append('studentId', studentId)
    }
    let url
    if (type === 'student') {
      url = '/school/achievement/stu/tendency.json'
    } else if (type === 'parent') {
      url = '/school/achievement/parent/tendency.json'
    } else if (type === 'teacher') {
      url = '/school/achievement/tendency.json'
    }
    axios.post(url, form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 查看排名走势老师、家长、学生
  queryRankTrend ({schoolId, classId, achievementsId, rankName, studentId, type}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    if (classId !== undefined && classId !== null) {
      form.append('classId', classId)
    }
    form.append('achievementsId', achievementsId)
    form.append('rankName', rankName)
    if (studentId !== undefined && studentId !== null) {
      form.append('studentId', studentId)
    }
    let url
    if (type === 'student') {
      url = '/school/achievement/stu/rank/tendency.json'
    } else if (type === 'parent') {
      url = '/school/achievement/parent/rank/tendency.json'
    } else if (type === 'teacher') {
      url = '/school/achievement/rank/tendency.json'
    }
    axios.post(url, form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  getCountList({data}, cb, er) {
    const form = new FormData()
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const element = data[key]
        if (key === 'classIds') {
          element.forEach(classId => {
            form.append(key, classId)
          })
        } else {
          if (element) {
            form.append(key, element)
          }
        }
      }
    }
    this.doPostRequest('/school/achievement/cLass/summary.json', form, cb, er)
  },
  getCountDesc({data}, cb, er) {
    const form = new FormData()
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const element = data[key]
        if (key === 'classIds') {
          element.forEach(classId => {
            form.append(key, classId)
          })
        } else {
          if (key === 'sortField' || key === 'sortType' || key === 'passNum' || key === 'goodNum') {
            continue
          }
          if (element) {
            form.append(key, element)
          }
        }
      }
    }
    this.doPostRequest('/school/achievement/describe.json', form, cb, er)
  }
}
