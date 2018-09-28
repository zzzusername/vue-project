import axios from '@/api/axios.base'
export default {
  // post请求调用
  doPostRequest(url, form, cb, er, isShowLoad) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' },
      isShowLoad: isShowLoad !== false ? true : isShowLoad
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
  doGetRequest(config, url, cb, er) {
    axios.get(url, config)
    .then(function (response) {
      cb(response.data)
    })
    .catch(function ({response}) {
      er(response.data)
    })
  },
  getMoralTeacherInfo({schoolId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    this.doPostRequest('/school/moral/teacher/info.json', form, cb, er)
  },
  getMoralGradeManagerInfo({schoolId, gradeId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('isGraduate', false)
    if (gradeId) {
      form.append('gradeId', gradeId)
    }
    this.doPostRequest('/school/moral/manager/list.json', form, cb, er)
  },
  addMoralGradeManager({schoolId, gradeId, teacherId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('gradeId', gradeId)
    form.append('teacherId', teacherId)
    this.doPostRequest('/school/moral/manager/add.json', form, cb, er)
  },
  delMoralGradeManager({schoolId, gradeId, teacherId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('gradeId', gradeId)
    form.append('teacherId', teacherId)
    this.doPostRequest('/school/moral/manager/del.json', form, cb, er)
  },
  // 获取老师能管理的班级
  moralTeacherClass({schoolId, isHaveLessonClass}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('isHaveLessonClass', isHaveLessonClass)
    this.doPostRequest('/school/moral/teacher/class/list.json', form, cb, er)
  },
  moralTeacherGrade({schoolId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    this.doPostRequest('/school/moral/teacher/grade/list.json', form, cb, er)
  },
  // 班级评比项
  classMoralTreeList({schoolId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    this.doPostRequest('/school/moral/class/tree/list.json', form, cb, er)
  },
  // 学生评比项
  studentMoralTreeList({schoolId, projectType}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('projectType', projectType)
    this.doPostRequest('/school/moral/student/tree/list.json', form, cb, er)
  },
  // 评定班级
  evaluateClass({schoolId, classId, itemId, evaluateDesc, evaluateImg, stuItemId, studentIds}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('classId', classId)
    form.append('itemId', itemId)
    if (evaluateDesc !== null && evaluateDesc !== undefined) {
      form.append('evaluateDesc', evaluateDesc)
    }
    if (evaluateImg !== null && evaluateImg.length > 0) {
      form.append('evaluateImg', evaluateImg)
    }
    if (stuItemId !== null && stuItemId !== undefined) {
      form.append('stuItemId', stuItemId)
    }
    for (let index = 0; index < studentIds.length; index++) {
      form.append('studentIds[' + index + ']', studentIds[index])
    }
    this.doPostRequest('/school/moral/class/evaluate.json', form, cb, er)
  },
  // 设置是否只允许班主任批假
  classTeacherVacation({schoolId, bo}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('bo', bo)
    this.doPostRequest('/school/vacation/classTeacherVacation.json', form, cb, er)
  },
  // 设置请假有效时间
  timeSettingVacation({schoolId, info}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    for (const key in info) {
      if (info.hasOwnProperty(key)) {
        const element = info[key]
        if (element) {
          form.append(key, element)
        }
      }
    }
    this.doPostRequest('/school/vacation/timeSettingVacation.json', form, cb, er)
  },
  // 查询请假配置
  settingVacationInfo({schoolId, info}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    for (const key in info) {
      if (info.hasOwnProperty(key)) {
        const element = info[key]
        if (element) {
          form.append(key, element)
        }
      }
    }
    this.doPostRequest('/school/vacation/SettingVacationInfo.json', form, cb, er)
  },
  // 评定学生
  evaluateStudent({schoolId, studentIds, itemId, evaluateDesc, evaluateImg, type}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('itemId', itemId)
    for (let index = 0; index < studentIds.length; index++) {
      form.append('studentIds[' + index + ']', studentIds[index])
    }
    if (evaluateDesc !== null && evaluateDesc !== undefined) {
      form.append('evaluateDesc', evaluateDesc)
    }
    if (evaluateImg !== null && evaluateImg.length > 0) {
      form.append('evaluateImg', evaluateImg)
    }
    // /school/moral/student/evaluate.json
    let url
    if (type === 'teacher') {
      url = '/school/moral/student/teacher/evaluate.json'
    } else if (type === 'student') {
      url = '/school/moral/student/student/evaluate.json'
    }
    this.doPostRequest(url, form, cb, er)
  },
  getStudentMoralBaseAndSysScore({schoolId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    this.doPostRequest('/school/moral/student/setting/info.json', form, cb, er)
  },
  // 学生操行评定加/减分列表
  getStudentAddAndMinusScoreList({schoolId, filter, rowStart, rowCount}, cb, er) {
    let f = Object.assign({}, filter)
    if (f.startDate && f.endDate) {
      f.startDate = f.startDate + ' 00:00'
      f.endDate = f.endDate + ' 23:59'
    }
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    if (f) {
      for (const key in f) {
        if (f.hasOwnProperty(key)) {
          const element = f[key]
          if (element) {
            form.append(key, element)
          }
        }
      }
    }
    this.doPostRequest('/school/moral/student/evaluate/list.json', form, cb, er)
  },
  // 查询评定排名
  previewClassReport({schoolId, gradeId, startDate, endDate}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('gradeId', gradeId)
    form.append('startDate', startDate)
    form.append('endDate', endDate)
    this.doPostRequest('/school/moral/class/report/preview.json', form, cb, er)
  },
  // 生成评定报告
  addClassReport({schoolId, gradeId, startDate, endDate, reportType, reportCycle, reportYear}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('gradeId', gradeId)
    form.append('startDate', startDate)
    form.append('endDate', endDate)
    form.append('reportType', reportType)
    form.append('reportCycle', reportCycle)
    form.append('reportYear', reportYear)
    this.doPostRequest('/school/moral/class/report/add.json', form, cb, er)
  },
  // 点名扣分设置详情
  addCheckSettingInfo({schoolId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    this.doPostRequest('/school/check/addCheckSettingInfo.json', form, cb, er)
  },
  // 点名扣分设置
  addCheckSetting({schoolId, code, store}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('code', code)
    form.append('store', store)
    this.doPostRequest('/school/check/addCheckSetting.json', form, cb, er)
  },
  // 查询班级德育报告
  queryClassReportList({schoolId, gradeId, reportType, reportYear, rowStart, rowCount}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    if (gradeId) {
      form.append('gradeId', gradeId)
    }
    if (reportType) {
      form.append('reportType', reportType)
    }
    if (reportYear) {
      form.append('reportYear', reportYear)
    }
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    this.doPostRequest('/school/moral/class/report/query.json', form, cb, er)
  },
  // 查询报告详情
  queryClassReportInfo({schoolId, reportId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('reportId', reportId)
    this.doPostRequest('/school/moral/class/report/info.json', form, cb, er)
  },
  // 为学生消分
  clearStudentMorlScore({schoolId, evaluateId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('evaluateId', evaluateId)
    this.doPostRequest('/school/moral/student/evaluate/remove.json', form, cb, er)
  },
  getClassMinusMoralScoreList({schoolId, filter, rowStart, rowCount}, cb, er) {
    let f = Object.assign({}, filter)
    if (f.startDate && f.endDate) {
      f.startDate = f.startDate + ' 00:00'
      f.endDate = f.endDate + ' 23:59'
    }
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    if (f) {
      for (const key in f) {
        if (f.hasOwnProperty(key)) {
          const element = f[key]
          if (element) {
            form.append(key, element)
          }
        }
      }
    }
    this.doPostRequest('/school/moral/class/evaluate/list.json', form, cb, er)
  },
  // 为班级消分
  clearClassMorlScore({schoolId, evaluateId, isRemoveStu}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('evaluateId', evaluateId)
    if (isRemoveStu) {
      form.append('isRemoveStu', isRemoveStu)
    }
    this.doPostRequest('/school/moral/class/evaluate/remove.json', form, cb, er)
  },
  // 查询学生评定排名
  previewStudentReport({schoolId, classId, startDate, endDate}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('classId', classId)
    form.append('startDate', startDate)
    form.append('endDate', endDate)
    this.doPostRequest('/school/moral/student/report/preview.json', form, cb, er)
  },
  // 生成评定报告
  addStudentReport({schoolId, classId, startDate, endDate, reportType, reportCycle, reportYear}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('classId', classId)
    form.append('startDate', startDate)
    form.append('endDate', endDate)
    form.append('reportType', reportType)
    form.append('reportCycle', reportCycle)
    form.append('reportYear', reportYear)
    this.doPostRequest('/school/moral/student/report/add.json', form, cb, er)
  },
  // 查询学生德育报告
  queryStudentReportList({schoolId, classId, reportType, reportYear, rowStart, rowCount}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    if (classId) {
      form.append('classId', classId)
    }
    if (reportType) {
      form.append('reportType', reportType)
    }
    if (reportYear) {
      form.append('reportYear', reportYear)
    }
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    this.doPostRequest('/school/moral/student/report/query.json', form, cb, er)
  },
  // 查询学生报告详情
  queryStudentReportInfo({schoolId, reportId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('reportId', reportId)
    this.doPostRequest('/school/moral/student/report/info.json', form, cb, er)
  },
  // 查询学生报告详情
  queryClassRecordIdInfo({schoolId, recordId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('recordId', recordId)
    this.doPostRequest('/school/moral/class/report/record/info.json', form, cb, er)
  },
  // 查询班主任所任课的班级的排名信息
  queryClassReportForTeacher({schoolId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    this.doPostRequest('/school/moral/class/report/queryByClass.json', form, cb, er)
  },
  // 核查请假列表
  evaluateVacation({schoolId, vacationStatus, startDate, endDate, rowStart, rowCount}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    if (vacationStatus !== null && vacationStatus !== undefined) {
      form.append('vacationStatus', vacationStatus)
    }
    if (startDate !== null && startDate !== undefined) {
      form.append('startDate', startDate)
    }
    if (endDate !== null && endDate !== undefined) {
      form.append('endDate', endDate)
    }
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    this.doPostRequest('/school/moral/student/evaluate/vacation.json', form, cb, er)
  },
  getStudentMinusScoreList({schoolId, studentId, startDate, endDate, rowStart, rowCount}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    let url = '/school/moral/student/stu/evaluate/list.json'
    if (studentId) {
      form.append('studentId', studentId)
      url = '/school/moral/student/parent/evaluate/list.json'
    }
    if (startDate && endDate) {
      let sTime = startDate + ' 00:00'
      let eTime = endDate + ' 23:59'
      form.append('startDate', sTime)
      form.append('endDate', eTime)
    }
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    this.doPostRequest(url, form, cb, er)
  },
  getReportList({schoolId, studentId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    let url = '/school/moral/student/report/student/query.json'
    if (studentId) {
      form.append('studentId', studentId)
      url = '/school/moral/student/report/parent/queryByStudentId.json'
    }

    this.doPostRequest(url, form, cb, er)
  },
  getStudentScoreDetail({schoolId, studentId, evaluateId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('evaluateId', evaluateId)
    let url = '/school/moral/student/stu/evaluate/info.json'
    if (studentId) {
      form.append('studentId', studentId)
      url = '/school/moral/student/parent/evaluate/info.json'
    }
    this.doPostRequest(url, form, cb, er)
  },
  getStudentRecordInfo({schoolId, recordId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('recordId', recordId)
    this.doPostRequest('/school/moral/student/report/record/info.json', form, cb, er)
  },
  getScoreStudentDetail({schoolId, classId, evaluateId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('classId', classId)
    form.append('evaluateId', evaluateId)
    this.doPostRequest('/school/moral/student/evaluate/info.json', form, cb, er)
  },
  getScoreClassDetail({schoolId, classId, evaluateId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('classId', classId)
    form.append('evaluateId', evaluateId)
    this.doPostRequest('/school/moral/class/evaluate/info.json', form, cb, er)
  },
  // 查询学生评定员
  queryMoralStudentManager({schoolId, classId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('classId', classId)
    this.doPostRequest('/school/moral/student/manager/query.json', form, cb, er)
  },
  // 删除学生评定员
  delMoralStudentManager({schoolId, classId, studentId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('classId', classId)
    form.append('studentId', studentId)
    this.doPostRequest('/school/moral/student/manager/del.json', form, cb, er)
  },
  // 删除学生评定员
  addMoralStudentManager({schoolId, classId, studentId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('classId', classId)
    form.append('studentId', studentId)
    this.doPostRequest('/school/moral/student/manager/add.json', form, cb, er)
  },
  // 查询学生是否有操行评定权限
  getMoralStudentManagerInfo({schoolId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    this.doPostRequest('/school/moral/student/manager/info.json', form, cb, er)
  },
  // 学生操行评定记录查询
  queryStudentEvaluateHistory({schoolId, filter, rowStart, rowCount}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    let f = Object.assign({}, filter)
    if (f.startDate && f.endDate) {
      f.startDate = f.startDate + ' 00:00'
      f.endDate = f.endDate + ' 23:59'
    }
    if (f) {
      for (const key in f) {
        if (f.hasOwnProperty(key)) {
          const element = f[key]
          if (element) {
            form.append(key, element)
          }
        }
      }
    }
    this.doPostRequest('/school/moral/student/evaluate/studentManager/list.json', form, cb, er)
  },
  // 学生获取自己管理的班级
  studentManageClassList({schoolId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    this.doPostRequest('/school/moral/student/manager/class/list.json', form, cb, er)
  },
  // 学生查询学生
  studentQueryStudent({schoolId, classId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('classId', classId)
    form.append('rowStart', 0)
    form.append('rowCount', 999)
    this.doPostRequest('/school/student/moral/manager/student/query.json', form, cb, er)
  },
  // 学生管理员查看评定学生详情
  studentManagerEvaluateInfo({schoolId, evaluateId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('evaluateId', evaluateId)
    this.doPostRequest('/school/moral/student/evaluate/studentManager/info.json', form, cb, er)
  },
  // 查看学生初始密码
  getStudentPasswordInfo({schoolId, classId, studentId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    if (classId !== null && classId !== undefined) {
      form.append('classId', classId)
    }
    form.append('studentId', studentId)
    this.doPostRequest('/school/moral/student/manager/passWordInfo.json', form, cb, er)
  },
  // 重置学生的初始密码
  renewalStudentPassword({schoolId, classId, studentId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    if (classId !== null && classId !== undefined) {
      form.append('classId', classId)
    }
    form.append('studentId', studentId)
    this.doPostRequest('/school/moral/student/manager/renewal.json', form, cb, er)
  },
  // 学生管理员查看评定学生详情
  studentAddTemplate({schoolId, type}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('type', type)
    this.doPostRequest('/school/moral/student/addTemplate.json', form, cb, er)
  },
  // 学校班级模板增加
  classAddTemplate({schoolId, type}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    this.doPostRequest('/school/moral/class/addTemplate.json', form, cb, er)
  },
  //  年级组成员(学生)
  studentManage({schoolId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    this.doPostRequest('/school/moral/manager/student/list.json', form, cb, er)
  },
  // 添加班级评定员（学生）
  addStudentmanager({schoolId, gradeId, studentId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    for (let i = 0; i < gradeId.length; i++) {
      form.append('gradeId', gradeId[i])
    }
    if (studentId !== undefined && studentId !== null) {
      form.append('studentId', studentId)
    }
    this.doPostRequest('/school/moral/manager/student/add.json', form, cb, er)
  },
  // 删除班级评定员
  delClassManager({schoolId, studentId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('studentId', studentId)
    this.doPostRequest('/school/moral/manager/student/del.json', form, cb, er)
  },
  // 修改班级评定员（学生）
  editClassManager({schoolId, gradeId, studentId, isExist}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('gradeId', gradeId)
    form.append('studentId', studentId)
    form.append('isExist', isExist)
    this.doPostRequest('/school/moral/manager/student/save.json', form, cb, er)
  }
}
