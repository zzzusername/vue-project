import axios from '@/api/axios.base'
export default {
// post请求调用
  doPostRequest (url, form, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    axios.post(url, form, config)
    .then(function (response) {
      cb(response.data)
    })
    .catch(function ({ response }) {
      if (response && response.data) {
        er(response.data)
      } else {
        er()
      }
    })
  },
// get请求调用
  doGetRequest (params, url, cb, er) {
    var config = { params: params }
    axios.get(url, config)
    .then(function (response) {
      cb(response.data)
    })
    .catch(function ({response}) {
      er(response.data)
    })
  },
  uploadStudentBaseInfoExcel ({schoolId, classId, file}, cb, er) {
    let form = new FormData()
    for (const key in arguments[0]) {
      if (arguments[0].hasOwnProperty(key)) {
        const element = arguments[0][key]
        form.append(key, element)
      }
    }
    this.doPostRequest('/school/evaluate/import/base.json', form, data => {
      cb(data)
    }, e => {
      er(e)
    })
  },
  uploadEvaluationExcel ({schoolId, classId, gradeReportId, file}, cb, er) {
    let form = new FormData()
    for (const key in arguments[0]) {
      if (arguments[0].hasOwnProperty(key)) {
        const element = arguments[0][key]
        form.append(key, element)
      }
    }
    this.doPostRequest('/school/evaluate/import/info.json', form, data => {
      cb(data)
    }, e => {
      er(e)
    })
  },
  // 查询艺术活动项目(教师\学生、家长)
  queryArtActivityList ({schoolId, studentId, classId, reportId, identity}, cb, er) {
    let form = new FormData()
    let url
    form.append('schoolId', schoolId)
    form.append('reportId', reportId)
    if (identity === 'TEACHER') {
      url = '/school/evaluate/art/teacher/artActivityList.json'
    } else {
      url = '/school/evaluate/art/artActivityList.json'
    }
    if (classId !== null && classId !== undefined) {
      form.append('classId', classId)
    }
    if (identity === 'TEACHER' || identity === 'PARENT') {
      form.append('studentId', studentId)
    }
    this.doPostRequest(url, form, cb, er)
  },
  // 增加艺术活动项目(教师)
  addArtActivity ({schoolId, classId, studentId, reportId, approvalStatus, activityData}, cb, er) {
    let form = new FormData()
    let url = '/school/evaluate/art/teacher/addArtActivity.json'
    form.append('schoolId', schoolId)
    form.append('classId', classId)
    form.append('studentId', studentId)
    form.append('reportId', reportId)
    form.append('approvalStatus', approvalStatus)
    for (let key in activityData) {
      if (activityData[key] !== null && activityData[key] !== undefined) {
        form.append(key, activityData[key])
      }
    }
    this.doPostRequest(url, form, cb, er)
  },
  // 编辑艺术活动项目(教师)
  editArtActivity ({schoolId, classId, studentId, reportId, approvalStatus, artActivityId, activityData}, cb, er) {
    let form = new FormData()
    let url = '/school/evaluate/art/teacher/editArtActivity.json'
    form.append('schoolId', schoolId)
    form.append('classId', classId)
    form.append('studentId', studentId)
    form.append('reportId', reportId)
    form.append('approvalStatus', approvalStatus)
    form.append('artActivityId', artActivityId)
    for (let key in activityData) {
      if (activityData[key] !== null && activityData[key] !== undefined) {
        form.append(key, activityData[key])
      }
    }
    this.doPostRequest(url, form, cb, er)
  },
  // 学校学生编辑、保存艺术活动项目(学生和家长)
  studentParentEditArtActivity ({schoolId, studentId, reportId, artActivityId, approvalStatus, activityData, identity}, cb, er) {
    let form = new FormData()
    let url
    form.append('schoolId', schoolId)
    form.append('reportId', reportId)
    form.append('approvalStatus', approvalStatus)
    if (artActivityId !== null && artActivityId !== undefined) {
      form.append('artActivityId', artActivityId)
      url = '/school/evaluate/art/student/editArtActivity.json'
    } else {
      url = '/school/evaluate/art/student/addArtActivity.json'
    }
    for (let key in activityData) {
      if (activityData[key] !== null && activityData[key] !== undefined) {
        form.append(key, activityData[key])
      }
    }
    if (identity === 'PARENT') {
      form.append('studentId', studentId)
    }
    this.doPostRequest(url, form, cb, er)
  },
  // 增加学生艺术团体活动项目(教师)
  addArtGroupActivity ({schoolId, classId, studentId, reportId, approvalStatus, groupActivity}, cb, er) {
    let form = new FormData()
    let url = '/school/evaluate/art/teacher/addArtGroupActivity.json'
    form.append('schoolId', schoolId)
    form.append('classId', classId)
    form.append('studentId', studentId)
    form.append('reportId', reportId)
    form.append('approvalStatus', approvalStatus)
    for (let key in groupActivity) {
      if (groupActivity[key] !== null && groupActivity[key] !== undefined) {
        form.append(key, groupActivity[key])
      }
    }
    this.doPostRequest(url, form, cb, er)
  },
  // 编辑学生艺术团体活动项目(教师)
  editArtGroupActivity ({schoolId, classId, studentId, reportId, approvalStatus, artActivityId, groupActivity}, cb, er) {
    let form = new FormData()
    let url = '/school/evaluate/art/teacher/editArtGroupActivity.json'
    form.append('schoolId', schoolId)
    form.append('classId', classId)
    form.append('studentId', studentId)
    form.append('reportId', reportId)
    form.append('approvalStatus', approvalStatus)
    form.append('artActivityId', artActivityId)
    for (let key in groupActivity) {
      if (groupActivity[key] !== null && groupActivity[key] !== undefined) {
        form.append(key, groupActivity[key])
      }
    }
    this.doPostRequest(url, form, cb, er)
  },
  // 家长\学生、保存或编辑艺术团体
  studentParentGroup ({schoolId, studentId, reportId, approvalStatus, artActivityId, groupActivity, identity}, cb, er) {
    let form = new FormData()
    let url
    form.append('schoolId', schoolId)
    form.append('reportId', reportId)
    form.append('approvalStatus', approvalStatus)
    if (artActivityId !== null && artActivityId !== undefined) {
      form.append('artActivityId', artActivityId)
      url = '/school/evaluate/art/student/editArtGroupActivity.json'
    } else {
      url = '/school/evaluate/art/student/addArtGroupActivity.json'
    }
    for (let key in groupActivity) {
      if (groupActivity[key] !== null && groupActivity[key] !== undefined) {
        form.append(key, groupActivity[key])
      }
    }
    if (identity === 'PARENT') {
      form.append('studentId', studentId)
    }
    this.doPostRequest(url, form, cb, er)
  },
  // 查询艺术活动项目(教师\学生、家长)
  queryArtGroupActivityList ({schoolId, studentId, classId, reportId, identity}, cb, er) {
    let form = new FormData()
    let url
    form.append('schoolId', schoolId)
    form.append('reportId', reportId)
    if (identity === 'TEACHER') {
      url = '/school/evaluate/art/teacher/artGroupActivityList.json'
    } else {
      url = '/school/evaluate/art/artGroupActivityList.json'
    }
    if (classId !== null && classId !== undefined) {
      form.append('classId', classId)
    }
    if (identity === 'TEACHER' || identity === 'PARENT') {
      form.append('studentId', studentId)
    }
    this.doPostRequest(url, form, cb, er)
  },
  // 学生素质评价列表
  queryStudentReport ({schoolId, gradeId, classId, gradeCode, semesterCode}, cb, er) {
    let form = new FormData()
    let url = '/school/evaluate/report/queryStudentReport.json'
    form.append('schoolId', schoolId)
    form.append('gradeId', gradeId)
    form.append('classId', classId)
    form.append('gradeCode', gradeCode)
    form.append('semesterCode', semesterCode)
    this.doPostRequest(url, form, cb, er)
  },
  // 获取基本信息列表
  queryStudentBaseList ({schoolId, classId}, cb, er) {
    let form = new FormData()
    form.append('schoolId', schoolId)
    form.append('classId', classId)
    this.doPostRequest('/school/evaluate/base/teacher/queryStudentBaseList.json', form, cb, er)
  },
  // 创建学期评价表(编辑)
  addReport ({schoolId, gradeId, gradeCode, semesterCode}, cb, er) {
    let form = new FormData()
    form.append('schoolId', schoolId)
    form.append('gradeId', gradeId)
    form.append('gradeCode', gradeCode)
    form.append('semesterCode', semesterCode)
    form.append('reportState', 'EDIT')
    let url = '/school/evaluate/report/addReport.json'
    this.doPostRequest(url, form, cb, er)
  },
  // 编辑基本信息
  saveBaseInfo (data, cb, er) {
    let form = new FormData()
    let f = JSON.parse(JSON.stringify(arguments[0]))
    // f.studentBirthday = FormateTime(f.studentBirthday, 'YYYY-MM-DD')
    let str = ''
    for (const key in f) {
      if (f.hasOwnProperty(key)) {
        const element = f[key]
        if (!element) {
          continue
        }
        if (key === 'interest0') {
          str += element
          continue
        }
        if (key === 'interest1' || key === 'interest2') {
          str += '|' + element
          continue
        }
        form.append(key, element)
      }
    }
    form.append('interest', str)
    this.doPostRequest('/school/evaluate/base/teacher/saveBaseInfo.json', form, cb, er)
  },
  // 获取学业水平课程设置
  getAchievementSetList ({schoolId}, cb, er) {
    let form = new FormData()
    let url = '/school/evaluate/achievement/set/list.json'
    form.append('schoolId', schoolId)
    this.doPostRequest(url, form, cb, er)
  },
  // 设置学业水平课程设置
  saveAchievementSetting ({schoolId, lessons}, cb, er) {
    let form = new FormData()
    let url = '/school/evaluate/achievement/set/save.json'
    form.append('schoolId', schoolId)
    lessons.forEach(element => {
      form.append('lessonId', element.lessonId)
    })
    this.doPostRequest(url, form, cb, er)
  },
  // 查询年级报表
  queryEvaluateGradeReportList ({schoolId, gradeId}, cb, er) {
    let form = new FormData()
    let url = '/school/evaluate/report/queryEvaluateGradeReportList.json'
    form.append('schoolId', schoolId)
    form.append('gradeId', gradeId)
    this.doPostRequest(url, form, cb, er)
  },
  // 获取犯罪记录列表
  getCrimeList ({schoolId, studentId, classId, reportId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('studentId', studentId)
    form.append('classId', classId)
    form.append('reportId', reportId)
    this.doPostRequest('/school/moral/crime/teacher/crimeList.json', form, cb, er)
  },
  // 新增/编辑犯罪记录
  saveCrime (data, cb, er) {
    const form = new FormData()
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const element = data[key]
        if (element) {
          form.append(key, element)
        }
      }
    }
    this.doPostRequest('/school/moral/crime/teacher/saveCrime.json', form, cb, er)
  },
  // 删除犯罪记录
  delCrime ({schoolId, classId, studentId, crimeId, reportId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('classId', classId)
    form.append('studentId', studentId)
    form.append('crimeId', crimeId)
    form.append('reportId', reportId)
    this.doPostRequest('/school/moral/crime/teacher/delCrime.json', form, cb, er)
  },
  // 思想品德活动项目保存(编辑)(家长、学生、教师)
  saveMoralActivity ({schoolId, classId, studentId, reportId, approvalStatus, moralActivityData, moralActivityId, moralActivityType, identity}, cb, er) {
    let form = new FormData()
    let url
    form.append('schoolId', schoolId)
    form.append('reportId', reportId)
    form.append('approvalStatus', approvalStatus)
    form.append('moralActivityType', moralActivityType)
    if (classId !== null && classId !== undefined) {
      form.append('classId', classId)
    }
    if (studentId !== null && studentId !== undefined) {
      form.append('studentId', studentId)
    }
    if (moralActivityId !== null && moralActivityId !== undefined) {
      form.append('moralActivityId', moralActivityId)
    }
    for (let key in moralActivityData) {
      if (moralActivityData[key] !== null && moralActivityData[key] !== undefined) {
        form.append(key, moralActivityData[key])
      }
    }
    if (identity === 'TEACHER') {
      url = '/school/moral/activity/teacher/saveActivity.json'
    } else {
      url = '/school/moral/activity/student/saveActivity.json'
    }
    this.doPostRequest(url, form, cb, er)
  },
  // 思想品德活动项目列表(教师、家长、学生)
  moralTeacherActivityList ({schoolId, studentId, classId, reportId, activityType, identity}, cb, er) {
    let form = new FormData()
    let url
    form.append('schoolId', schoolId)
    if (classId !== null && classId !== undefined) {
      form.append('classId', classId)
    }
    form.append('reportId', reportId)
    form.append('activityType', activityType)
    if (identity === 'TEACHER') {
      url = '/school/moral/activity/teacher/activityList.json'
    } else {
      url = '/school/moral/activity/student/activityList.json'
    }
    if (identity === 'TEACHER' || identity === 'PARENT') {
      form.append('studentId', studentId)
    }
    this.doPostRequest(url, form, cb, er)
  },
  // 修改体育达标信息
  saveHealthStandard ({schoolId, studentId, classId, reportId, standardScore, isExercise, healthStandardId}, cb, er) {
    let form = new FormData()
    let url = '/school/health/standard/teacher/saveStandard.json'
    form.append('schoolId', schoolId)
    form.append('studentId', studentId)
    form.append('classId', classId)
    form.append('reportId', reportId)
    form.append('standardScore', standardScore)
    if (isExercise !== null) {
      form.append('isExercise', isExercise)
    }
    if (healthStandardId !== null) {
      form.append('healthStandardId', healthStandardId)
    }
    this.doPostRequest(url, form, cb, er)
  },
  // 查看体育达标信息
  getStandardInfo ({schoolId, studentId, classId, reportId, standardId}, cb, er) {
    let form = new FormData()
    let url = '/school/health/standard/teacher/standardInfo.json'
    form.append('schoolId', schoolId)
    form.append('studentId', studentId)
    form.append('classId', classId)
    form.append('reportId', reportId)
    form.append('standardId', standardId)
    this.doPostRequest(url, form, cb, er)
  },
  // 查看体育达标信息列表
  getStandardList ({schoolId, studentId, classId, reportId}, cb, er) {
    let form = new FormData()
    let url = '/school/health/standard/teacher/standardList.json'
    form.append('schoolId', schoolId)
    form.append('studentId', studentId)
    form.append('classId', classId)
    form.append('reportId', reportId)
    this.doPostRequest(url, form, cb, er)
  },
  //  思想品德荣誉保存(编辑)
  saveMoralHonor ({schoolId, classId, studentId, reportId, approvalStatus, honorId, honorData, identity}, cb, er) {
    let form = new FormData()
    let url
    form.append('schoolId', schoolId)
    if (classId !== null && classId !== undefined) {
      form.append('classId', classId)
    }
    form.append('reportId', reportId)
    form.append('approvalStatus', approvalStatus)
    for (let key in honorData) {
      if (honorData[key] !== null && honorData[key] !== undefined) {
        form.append(key, honorData[key])
      }
    }
    if (honorId !== null && honorId !== undefined) {
      form.append('honorId', honorId)
    }
    if (identity === 'TEACHER') {
      url = '/school/moral/honor/teacher/saveHonor.json'
    } else {
      url = '/school/moral/honor/student/saveHonor.json'
    }
    if (identity === 'TEACHER' || identity === 'PARENT') {
      form.append('studentId', studentId)
    }
    this.doPostRequest(url, form, cb, er)
  },
  // 思想品德荣誉列表(教师)
  getMoralHonorList ({schoolId, studentId, classId, reportId, identity}, cb, er) {
    let form = new FormData()
    let url
    form.append('schoolId', schoolId)
    form.append('reportId', reportId)
    if (identity === 'TEACHER') {
      url = '/school/moral/honor/teacher/honorList.json'
      form.append('classId', classId)
      form.append('studentId', studentId)
    } else {
      url = '/school/moral/honor/student/honorList.json'
      if (identity === 'PARENT') {
        form.append('studentId', studentId)
      }
    }
    this.doPostRequest(url, form, cb, er)
  },
  // 切换评价表
  getEvaluateReportInfo ({schoolId, studentId, gradeCode, semesterCode}, cb, er) {
    let form = new FormData()
    let url = '/school/evaluate/report/getEvaluateReportInfo.json'
    form.append('schoolId', schoolId)
    form.append('studentId', studentId)
    form.append('gradeCode', gradeCode)
    form.append('semesterCode', semesterCode)
    this.doPostRequest(url, form, cb, er)
  },
  // 获取违纪违规项目列表
  getViolationList ({schoolId, studentId, classId, reportId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('studentId', studentId)
    form.append('classId', classId)
    form.append('reportId', reportId)
    this.doPostRequest('/school/moral/violation/teacher/violationList.json', form, cb, er)
  },
  // 新增/修改违规违纪项目
  saveViolation (data, cb, er) {
    const form = new FormData()
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const element = data[key]
        if (element) {
          form.append(key, element)
        }
      }
    }
    this.doPostRequest('/school/moral/violation/teacher/saveViolation.json', form, cb, er)
  },
  // 删除违纪违规项目
  delViolation ({schoolId, classId, studentId, violationId, reportId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('studentId', studentId)
    form.append('classId', classId)
    form.append('violationId', violationId)
    form.append('reportId', reportId)
    this.doPostRequest('/school/moral/violation/teacher/delviolation.json', form, cb, er)
  },
  // 修改体育比赛项目
  saveHealthProject ({schoolId, studentId, classId, reportId, data}, cb, er) {
    let form = new FormData()
    let url = '/school/health/project/teacher/saveProject.json'
    form.append('schoolId', schoolId)
    form.append('studentId', studentId)
    form.append('classId', classId)
    form.append('reportId', reportId)
    for (let key in data) {
      if (data[key] !== null && data[key] !== undefined) {
        form.append(key, data[key])
      }
    }
    this.doPostRequest(url, form, cb, er)
  },
  // 查看体育比赛项目列表
  getHealthProjectList ({schoolId, studentId, classId, reportId}, cb, er) {
    let form = new FormData()
    let url = '/school/health/project/teacher/projectList.json'
    form.append('schoolId', schoolId)
    form.append('studentId', studentId)
    form.append('classId', classId)
    form.append('reportId', reportId)
    this.doPostRequest(url, form, cb, er)
  },
  // 查看体育比赛项目详情
  getHealthProjectInfo ({schoolId, studentId, classId, reportId, projectId}, cb, er) {
    let form = new FormData()
    let url = '/school/health/project/teacher/projectInfo.json'
    form.append('schoolId', schoolId)
    form.append('studentId', studentId)
    form.append('classId', classId)
    form.append('reportId', reportId)
    form.append('projectId', projectId)
    this.doPostRequest(url, form, cb, er)
  },
  // 实践项目保存
  saveProject ({schoolId, classId, studentId, reportId, approvalStatus, practiceProjectId, practiceProjectType, practiceProjectData, identity}, cb, er) {
    let form = new FormData()
    let url
    form.append('schoolId', schoolId)
    if (classId !== null && classId !== undefined) {
      form.append('classId', classId)
    }
    form.append('reportId', reportId)
    form.append('approvalStatus', approvalStatus)
    form.append('practiceProjectType', practiceProjectType)
    for (let key in practiceProjectData) {
      if (practiceProjectData[key] !== null && practiceProjectData[key] !== undefined) {
        form.append(key, practiceProjectData[key])
      }
    }
    if (practiceProjectId !== undefined && practiceProjectId !== null) {
      form.append('practiceProjectId', practiceProjectId)
    }
    if (identity === 'TEACHER' || identity === 'PARENT') {
      form.append('studentId', studentId)
    }
    if (identity === 'TEACHER') {
      url = '/school/practice/project/teacher/saveProject.json'
    } else {
      url = '/school/practice/project/student/saveProject.json'
    }
    this.doPostRequest(url, form, cb, er)
  },
  // 实践项目列表（家长、学生、教师）
  getProjectList ({schoolId, studentId, classId, reportId, practiceProjectType, identity}, cb, er) {
    const form = new FormData()
    let url
    form.append('schoolId', schoolId)
    if (classId !== null && classId !== undefined) {
      form.append('classId', classId)
    }
    form.append('reportId', reportId)
    form.append('practiceProjectType', practiceProjectType)
    if (identity === 'TEACHER') {
      url = '/school/practice/project/teacher/projectList.json'
    } else {
      url = '/school/practice/project/student/projectList.json'
    }
    if (identity === 'TEACHER' || identity === 'PARENT') {
      form.append('studentId', studentId)
    }
    this.doPostRequest(url, form, cb, er)
  },
  // 修改运动员国家技术等级
  saveHealthAward ({schoolId, studentId, classId, reportId, data}, cb, er) {
    let form = new FormData()
    let url = '/school/health/award/teacher/saveAward.json'
    form.append('schoolId', schoolId)
    form.append('studentId', studentId)
    form.append('classId', classId)
    form.append('reportId', reportId)
    for (let key in data) {
      if (data[key] !== null && data[key] !== undefined) {
        form.append(key, data[key])
      }
    }
    this.doPostRequest(url, form, cb, er)
  },
  // 获取运动员国家技术等级详情
  getHealthAwardInfo ({schoolId, studentId, classId, reportId, awardId}, cb, er) {
    let form = new FormData()
    let url = '/school/health/award/teacher/awardInfo.json'
    form.append('schoolId', schoolId)
    form.append('studentId', studentId)
    form.append('classId', classId)
    form.append('reportId', reportId)
    if (awardId) {
      form.append('awardId', awardId)
    }
    this.doPostRequest(url, form, cb, er)
  },
  // 获取运动员国家技术等级列表
  getHealthAwardList ({schoolId, studentId, classId, reportId}, cb, er) {
    let form = new FormData()
    let url = '/school/health/award/teacher/awardList.json'
    form.append('schoolId', schoolId)
    form.append('studentId', studentId)
    form.append('classId', classId)
    form.append('reportId', reportId)
    this.doPostRequest(url, form, cb, er)
  },
  // 创造发明保存（编辑）
  saveInvent ({schoolId, classId, studentId, reportId, approvalStatus, practiceInventId, practiceInventData}, cb, er) {
    let form = new FormData()
    let url = '/school/practice/invent/teacher/saveInvent.json'
    form.append('schoolId', schoolId)
    form.append('classId', classId)
    form.append('studentId', studentId)
    form.append('reportId', reportId)
    form.append('approvalStatus', approvalStatus)
    for (let key in practiceInventData) {
      if (practiceInventData[key] !== null && practiceInventData[key] !== undefined) {
        form.append(key, practiceInventData[key])
      }
    }
    if (practiceInventId !== null && practiceInventId !== undefined) {
      form.append('practiceInventId', practiceInventId)
    }
    this.doPostRequest(url, form, cb, er)
  },
  // 创造发明列表
  getInventList ({schoolId, studentId, classId, reportId, identity}, cb, er) {
    const form = new FormData()
    let url
    form.append('schoolId', schoolId)
    if (classId !== null && classId !== undefined) {
      form.append('classId', classId)
    }
    form.append('reportId', reportId)
    if (identity === 'PARENT' || identity === 'TEACHER') {
      form.append('studentId', studentId)
    }
    if (identity === 'TEACHER') {
      url = '/school/practice/invent/teacher/inventList.json'
    } else {
      url = '/school/practice/invent/student/inventList.json'
    }
    this.doPostRequest(url, form, cb, er)
  },
  // 研究学习成果保存（编辑）
  saveResearch ({schoolId, classId, studentId, reportId, approvalStatus, practiceResearchId, practiceResearchData}, cb, er) {
    let form = new FormData()
    let url = '/school/practice/research/teacher/saveResearch.json'
    form.append('schoolId', schoolId)
    form.append('classId', classId)
    form.append('studentId', studentId)
    form.append('reportId', reportId)
    form.append('approvalStatus', approvalStatus)
    for (let key in practiceResearchData) {
      if (practiceResearchData[key] !== null && practiceResearchData[key] !== undefined) {
        form.append(key, practiceResearchData[key])
      }
    }
    if (practiceResearchId !== null && practiceResearchId !== undefined) {
      form.append('practiceResearchId', practiceResearchId)
    }
    this.doPostRequest(url, form, cb, er)
  },
  // 研究学习成果列表
  getResearchList ({schoolId, studentId, classId, reportId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('studentId', studentId)
    form.append('classId', classId)
    form.append('reportId', reportId)
    this.doPostRequest('/school/practice/research/teacher/researchList.json', form, cb, er)
  },
  // 修改选修1
  saveElectiveOne ({schoolId, studentId, classId, reportId, data}, cb, er) {
    let form = new FormData()
    let url = '/school/learn/electiveOne/teacher/saveElectiveOne.json'
    form.append('schoolId', schoolId)
    form.append('studentId', studentId)
    form.append('classId', classId)
    form.append('reportId', reportId)
    for (let key in data) {
      if (data[key] !== null && data[key] !== undefined) {
        form.append(key, data[key])
      }
    }
    this.doPostRequest(url, form, cb, er)
  },
  // 获取选修1详情
  getElectiveOneInfo ({schoolId, studentId, classId, reportId, electiveId}, cb, er) {
    let form = new FormData()
    let url = '/school/learn/electiveOne/teacher/electiveOneInfo.json'
    form.append('schoolId', schoolId)
    form.append('studentId', studentId)
    form.append('classId', classId)
    form.append('reportId', reportId)
    if (electiveId) {
      form.append('electiveId', electiveId)
    }
    this.doPostRequest(url, form, cb, er)
  },
  // 获取选修1列表
  getElectiveOneList ({schoolId, studentId, classId, reportId}, cb, er) {
    let form = new FormData()
    let url = '/school/learn/electiveOne/teacher/electiveOneList.json'
    form.append('schoolId', schoolId)
    form.append('studentId', studentId)
    form.append('classId', classId)
    form.append('reportId', reportId)
    this.doPostRequest(url, form, cb, er)
  },
  // 修改选修2
  saveElectiveTWO ({schoolId, studentId, classId, reportId, data}, cb, er) {
    let form = new FormData()
    let url = '/school/learn/electiveTWO/teacher/saveElectiveTWO.json'
    form.append('schoolId', schoolId)
    form.append('studentId', studentId)
    form.append('classId', classId)
    form.append('reportId', reportId)
    for (let key in data) {
      if (data[key] !== null && data[key] !== undefined) {
        form.append(key, data[key])
      }
    }
    this.doPostRequest(url, form, cb, er)
  },
  // 获取选修2详情
  getElectiveTWOInfo ({schoolId, studentId, classId, reportId, electiveId}, cb, er) {
    let form = new FormData()
    let url = '/school/learn/electiveTWO/teacher/electiveTWOInfo.json'
    form.append('schoolId', schoolId)
    form.append('studentId', studentId)
    form.append('classId', classId)
    form.append('reportId', reportId)
    if (electiveId) {
      form.append('electiveId', electiveId)
    }
    this.doPostRequest(url, form, cb, er)
  },
  // 获取选修2列表
  getElectiveTWOList ({schoolId, studentId, classId, reportId}, cb, er) {
    let form = new FormData()
    let url = '/school/learn/electiveTWO/teacher/electiveTWOList.json'
    form.append('schoolId', schoolId)
    form.append('studentId', studentId)
    form.append('classId', classId)
    form.append('reportId', reportId)
    this.doPostRequest(url, form, cb, er)
  },
  // 修改学科竞赛
  saveCompetition ({schoolId, studentId, classId, reportId, data}, cb, er) {
    let form = new FormData()
    let url = '/school/learn/competition/teacher/saveCompetition.json'
    form.append('schoolId', schoolId)
    form.append('studentId', studentId)
    form.append('classId', classId)
    form.append('reportId', reportId)
    for (let key in data) {
      if (data[key] !== null && data[key] !== undefined) {
        form.append(key, data[key])
      }
    }
    this.doPostRequest(url, form, cb, er)
  },
  // 获取学科竞赛详情
  getCompetitionInfo ({schoolId, studentId, classId, reportId, competitionId}, cb, er) {
    let form = new FormData()
    let url = '/school/learn/competition/teacher/competitionInfo.json'
    form.append('schoolId', schoolId)
    form.append('studentId', studentId)
    form.append('classId', classId)
    form.append('reportId', reportId)
    if (competitionId) {
      form.append('competitionId', competitionId)
    }
    this.doPostRequest(url, form, cb, er)
  },
  // 获取学科竞赛列表
  getCompetitionList ({schoolId, studentId, classId, reportId}, cb, er) {
    let form = new FormData()
    let url = '/school/learn/competition/teacher/competitionList.json'
    form.append('schoolId', schoolId)
    form.append('studentId', studentId)
    form.append('classId', classId)
    form.append('reportId', reportId)
    this.doPostRequest(url, form, cb, er)
  },
  // 学生自我陈述报告保存（教师）
  saveStatement ({statementContent, teacherComment, schoolId, studentId, reportId, graduateReportId, classId, statementId, approvalStatus}, cb, er) {
    let form = new FormData()
    let url = '/school/evaluate/statement/teacher/saveStatement.json'
    if (statementContent !== null && statementContent !== undefined) {
      form.append('statementContent', statementContent)
    }
    if (teacherComment !== null && teacherComment !== undefined) {
      form.append('teacherComment', teacherComment)
    }
    form.append('schoolId', schoolId)
    form.append('studentId', studentId)
    form.append('classId', classId)
    if (reportId !== null && reportId !== undefined) {
      form.append('reportId', reportId)
    }
    if (graduateReportId !== null && graduateReportId !== undefined) {
      form.append('graduateReportId', graduateReportId)
    }
    if (statementId !== null && statementId !== undefined) {
      form.append('statementId', statementId)
    }
    form.append('approvalStatus', approvalStatus)
    this.doPostRequest(url, form, cb, er)
  },
  // 学生自我陈述报告详情（教师）
  queryStatementInfo ({schoolId, classId, studentId, reportId}, cb, er) {
    let form = new FormData()
    let url = '/school/evaluate/statement/teacher/queryStatementInfo.json'
    form.append('schoolId', schoolId)
    form.append('studentId', studentId)
    form.append('classId', classId)
    form.append('reportId', reportId)
    this.doPostRequest(url, form, cb, er)
  },
  // 增加毕业素质评价
  addGraduateReport ({gradeId, schoolId}, cb, er) {
    let form = new FormData()
    let url = '/school/evaluate/report/addGraduateReport.json'
    form.append('schoolId', schoolId)
    form.append('gradeId', gradeId)
    this.doPostRequest(url, form, cb, er)
  },
  // 学校学生毕业素质评价列表
  queryStudentGraduateReport ({schoolId, gradeId, classId}, cb, er) {
    let form = new FormData()
    let url = '/school/evaluate/report/queryStudentGraduateReport.json'
    form.append('schoolId', schoolId)
    form.append('gradeId', gradeId)
    form.append('classId', classId)
    this.doPostRequest(url, form, cb, er)
  },
  // 学校学生毕业素质评价详情
  getStudentGraduateReportInfo ({schoolId, gradeId}, cb, er) {
    let form = new FormData()
    let url = '/school/evaluate/report/getStudentGraduateReportInfo.json'
    form.append('schoolId', schoolId)
    form.append('gradeId', gradeId)
    this.doPostRequest(url, form, cb, er)
  },
  //  学生毕业自我陈述报告详情（教师)
  queryStatementInfoById ({schoolId, classId, studentId, graduateReportId}, cb, er) {
    let form = new FormData()
    let url = '/school/evaluate/statement/teacher/queryStatementInfoById.json'
    form.append('schoolId', schoolId)
    form.append('studentId', studentId)
    form.append('classId', classId)
    form.append('graduateReportId', graduateReportId)
    this.doPostRequest(url, form, cb, er)
  },
  // 典型案例材料保存（教师）(或编辑)
  saveMaterials ({schoolId, studentId, reportId, graduateReportId, materialsId, caseData}, cb, er) {
    let form = new FormData()
    let url = '/school/evaluate/materials/teacher/saveMaterials.json'
    form.append('schoolId', schoolId)
    form.append('studentId', studentId)
    if (materialsId !== null && materialsId !== undefined) {
      form.append('materialsId', materialsId)
    }
    if (reportId !== null && reportId !== undefined) {
      form.append('reportId', reportId)
    }
    if (graduateReportId !== null && graduateReportId !== undefined) {
      form.append('graduateReportId', graduateReportId)
    }
    for (let key in caseData) {
      if (caseData[key] !== null && caseData[key] !== undefined) {
        form.append(key, caseData[key])
      }
    }
    this.doPostRequest(url, form, cb, er)
  },
  // 典型案例材料详情（教师)
  queryMaterialsInfo ({schoolId, classId, studentId, materialsId}, cb, er) {
    let form = new FormData()
    let url = '/school/evaluate/materials/teacher/queryMaterialsInfo.json'
    form.append('schoolId', schoolId)
    form.append('studentId', studentId)
    form.append('classId', classId)
    form.append('materialsId', materialsId)
    this.doPostRequest(url, form, cb, er)
  },
  // 典型案例材料列表（教师）
  queryMaterialsList ({schoolId, classId, studentId, reportId, graduateReportId}, cb, er) {
    let form = new FormData()
    let url = '/school/evaluate/materials/teacher/queryMaterialsList.json'
    form.append('schoolId', schoolId)
    form.append('studentId', studentId)
    form.append('classId', classId)
    if (reportId !== null && reportId !== undefined) {
      form.append('reportId', reportId)
    }
    if (graduateReportId !== null && graduateReportId !== undefined) {
      form.append('graduateReportId', graduateReportId)
    }
    this.doPostRequest(url, form, cb, er)
  },
  // 根据报表id查询成绩详情
  getAcademicObligatoryReportInfo ({schoolId, reportId}, cb, er) {
    let form = new FormData()
    let url = '/school/learn/report/info.json'
    form.append('schoolId', schoolId)
    form.append('reportId', reportId)
    this.doPostRequest(url, form, cb, er)
  },
  // 报表导入成绩
  importAcademicObligatory ({schoolId, classId, gradeCode, semesterCode, achIds}, cb, er) {
    let form = new FormData()
    let url = '/school/learn/ach/import.json'
    form.append('schoolId', schoolId)
    form.append('classId', classId)
    form.append('gradeCode', gradeCode)
    form.append('semesterCode', semesterCode)
    achIds.forEach(element => {
      form.append('achId', element)
    })
    this.doPostRequest(url, form, cb, er)
  },
  // 根据年份和上下学期查询期末考试成绩列表
  getAchievementFinalExamList ({schoolId, classId, typeParam, typeYear}, cb, er) {
    let form = new FormData()
    let url = '/school/achievement/finalExam/list.json'
    form.append('schoolId', schoolId)
    form.append('classId', classId)
    form.append('typeParam', typeParam)
    form.append('typeYear', typeYear)
    this.doPostRequest(url, form, cb, er)
  },
  // 修改综合素质评价
  editReport ({schoolId, gradeId, gradeCode, semesterCode, reportState}, cb, er) {
    let form = new FormData()
    let url = '/school/evaluate/report/editReport.json'
    form.append('schoolId', schoolId)
    form.append('gradeId', gradeId)
    form.append('gradeCode', gradeCode)
    form.append('semesterCode', semesterCode)
    if (reportState) {
      form.append('reportState', 'END')
    } else {
      form.append('reportState', 'EDIT')
    }
    this.doPostRequest(url, form, cb, er)
  },
  // 修改学生毕业综合素质评价
  editGradeGraduateRepor ({schoolId, gradeId, graduateReportId, reportState}, cb, er) {
    let form = new FormData()
    let url = '/school/evaluate/report/editGradeGraduateRepor.json'
    form.append('schoolId', schoolId)
    form.append('gradeId', gradeId)
    form.append('graduateReportId', graduateReportId)
    if (reportState) {
      form.append('reportState', 'END')
    } else {
      form.append('reportState', 'EDIT')
    }
    this.doPostRequest(url, form, cb, er)
  },
  // 根据权限获取年级、班级（仅限于素质评级）
  getNewGradeList ({schoolId}, cb, er) {
    let form = new FormData()
    form.append('schoolId', schoolId)
    let url = '/school/grade/class/list.json'
    this.doPostRequest(url, form, cb, er)
  },
  // 学校学生素质评价列表(学生与家长)
  queryStudentSelfReport ({schoolId, studentId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    if (studentId !== null && studentId !== undefined) {
      form.append('studentId', studentId)
    }
    axios.post('/school/evaluate/report/student/queryStudentReport.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 学校学生毕业素质评价列表(学生与家长)
  queryStudentSelfGraduateReport ({schoolId, studentId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    if (studentId !== null && studentId !== undefined) {
      form.append('studentId', studentId)
    }
    axios.post('/school/evaluate/report/student/queryStudentGraduateReport.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  }
}
