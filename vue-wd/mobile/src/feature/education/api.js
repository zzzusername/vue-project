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
  getTeacherFeatures({schoolId}, cb, er) {
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
  getTeacherList({ schoolId, teacherName, rowStart, rowCount }, cb, er) {
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
  // 学校教师保存
  saveTeacher({ schoolId, teacherName, teacherSex, teacherType, teacherBirthday, teacherTelephoneNum }, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    if (teacherSex !== null && teacherSex !== undefined) {
      form.append('teacherSex', teacherSex)
    }
    if (teacherBirthday !== null && teacherBirthday !== undefined) {
      form.append('teacherBirthday', teacherBirthday)
    }
    if (teacherTelephoneNum !== null && teacherTelephoneNum !== undefined) {
      form.append('teacherTelephoneNum', teacherTelephoneNum)
    }
    form.append('schoolId', schoolId)
    form.append('teacherName', teacherName)
    form.append('teacherType', teacherType)
    axios.post('/school/teacher/addTeacher.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 获取教师信息
  getTeacherinfo({ schoolId, teacherId, bindingCode }, cb, er) {
    var url
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' },
      isShowLoad: false
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    if (teacherId !== undefined && teacherId !== null) {
      form.append('teacherId', teacherId)
      if (bindingCode !== undefined && bindingCode !== null) {
        url = '/school/teacher/bindingTeacherInfo.json'
        form.append('bindingCode', bindingCode)
      } else {
        url = '/school/teacher/manage/teacherInfo.json'
      }
    } else {
      url = '/school/teacher/teacherInfo.json'
    }
    axios.post(url, form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 解绑教师微信
  delTeacherBinding({ schoolId, teacherId, userId }, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('teacherId', teacherId)
    form.append('userId', userId)
    axios.post('/school/teacher/delTeacherBinding.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 删除老师
  delTeacher({ schoolId, teacherId }, cb, er) {
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
  // 编辑老师
  updateTeacher ({schoolId, teacherId, data, tag}, cb, er) {
    var url
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
    if (tag !== null && tag !== undefined) {  //  绑定或自己编辑资料
      url = '/school/teacher/updateTeacher.json'
    } else {
      url = '/school/teacher/manage/updateTeacher.json'
    }
    axios.post(url, form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 查询该学校的角色
  queryRole({ schoolId }, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('isGraduate', false)
    axios.post('/school/role/query.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  queryRoleByid ({schoolId, roleId}, cb, er) {
    var config = {
      params: { schoolId, roleId }
    }
    axios.get('/school/role/queryById.json', config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 查询角色下老师
  queryRoleTeacher({ schoolId, roleId, isExist, teacherName, userName, rowStart, rowCount }, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('roleId', roleId)
    form.append('isExist', isExist)
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    if (teacherName !== null) {
      form.append('teacherName', teacherName)
    }
    if (userName !== null) {
      form.append('userName', userName)
    }
    axios.post('/school/role/teacher/query.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 修改老师是否属于该角色
  changeRoleTeahcer({ schoolId, roleId, teacherId, isExist }, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('roleId', roleId)
    form.append('teacherId', teacherId)
    form.append('isExist', isExist)
    axios.post('/school/role/teacher/save.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 学校管理学生列表
  getStudentList({ schoolId, excludeClassId, studentName, classId, rowStart, rowCount }, cb, er) {
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
  // 添加学生
  addStudent ({schoolId, info}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    for (var i = 0; i < info.length; i++) {
      if (Object.prototype.toString.call(info[i].value) === '[object Array]') {
        if (info[i].value.length > 0) {
          form.append(info[i].code, info[i].value[0])
        }
      } else {
        form.append(info[i].code, info[i].value)
      }
    }
    axios.post('/school/student/addStudent.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 查询角色功能列表
  getRoleFeature({schoolId, roleId, roleType}, cb, er) {
    var config = {
      params: { schoolId, roleId }
    }
    if (roleType !== null && roleType !== undefined) {
      config.params.roleType = roleType
    }
    axios.get('/school/role/feature/list.json', config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 修改角色对应的功能
  changeRoleFeature({schoolId, roleId, featureId, isExist}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('roleId', roleId)
    form.append('featureId', featureId)
    form.append('isExist', isExist)
    axios.post('/school/role/feature/save.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 保存角色
  saveRole({schoolId, roleId, roleName, roleDes, roleClass, roleType}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    if (roleId !== undefined) {
      form.append('roleId', roleId)
    }
    form.append('schoolId', schoolId)
    form.append('roleName', roleName)
    form.append('roleDes', roleDes)
    if (roleType !== null && roleType !== undefined) {
      form.append('roleType', roleType)
    }
    roleClass.forEach((element) => {
      form.append('classId', element)
    }, this)
    axios.post('/school/role/save.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 删除角色
  deleteRole({schoolId, roleId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('roleId', roleId)
    axios.post('/school/role/delete.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 获取学生信息
  getStudentInfo({schoolId, studentId, bindingCode}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    var url = ''
    if (studentId !== undefined && studentId !== null) {
      form.append('studentId', studentId)
      if (bindingCode !== undefined && bindingCode !== null) {
        form.append('bindingCode', bindingCode)
        url = '/school/student/bindingToStudentInfo.json'
      } else {
        url = '/school/student/studentInfo.json'
      }
    } else {
      url = '/school/student/myStudentInfo.json'
    }
    axios.post(url, form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 管理员编辑学生资料
  adminEditStudentInfo ({schoolId, studentId, info, studentInfo}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('studentId', studentId)
    if (info !== null && info !== undefined) {
      for (var key in info) {
        if (info[key] !== null && info[key] !== undefined) {
          form.append(key, info[key])
        }
      }
    } else if (studentInfo !== null && studentInfo !== undefined) {
      for (var i = 0; i < studentInfo.length; i++) {
        if (Object.prototype.toString.call(studentInfo[i].value) === '[object Array]') {
          if (studentInfo[i].value[0] !== null && studentInfo[i].value[0] !== undefined) {
            form.append(studentInfo[i].code, studentInfo[i].value[0])
          }
        } else {
          if (studentInfo[i].value !== null && studentInfo[i].value !== undefined) {
            form.append(studentInfo[i].code, studentInfo[i].value)
          }
        }
      }
    }

    axios.post('/school/student/updateStudent.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 管理员删除学生
  adminDeleteStudent ({schoolId, studentId, classId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('studentId', studentId)
    if (classId) {
      form.append('classId', classId)
    }
    axios.post('/school/student/delStudent.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 查询可购买的学校套餐
  queryPackage ({isRenew}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    if (isRenew === 'isRenew') {
      var form = new FormData()
      form.append('isRenew', true)
    }
    axios.post('/school/pay/package.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 添加机构
  addSchool ({schoolInfo}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    for (var key in schoolInfo) {
      if (schoolInfo[key] !== null && schoolInfo[key] !== undefined) {
        form.append(key, schoolInfo[key])
      }
    }
    axios.post('/school/add.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 机构详情
  getSchoolInfo ({schoolId}, cb, er) {
    var config = {
      params: { schoolId },
      isShowLoad: false
    }
    axios.get('/school/info.json', config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 增加完善资料选项
  saveSchoolDatum ({schoolId, extendType, extendParam}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('extendType', extendType)
    form.append('extendParam', extendParam)
    axios.post('/school/datum/saveSchoolDatum.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 查看完善资料选项
  querySchoolDatum ({schoolId, extendType}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('extendType', extendType)
    axios.post('/school/datum/querySchoolDatum.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 为学校添加群时查询的我的群列表（过滤已加入的群
  queryMyOrg (cb, er) {
    axios.get('/school/myorg.json')
    .then(function (response) {
      cb(response.data)
    })
    .catch(function ({response}) {
      er(response.data)
    })
  },
  // 为学校添加群
  addSchoolOrg ({schoolId, orgs}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('orgs', orgs)
    axios.post('/school/add/org.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 查询学校关联的群
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
  // 为学校删除群
  deleteRelationOrg ({schoolId, orgId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('orgId', orgId)
    axios.post('/school/delete/org.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 给学生选择对应班级
  getBaseSubjectList({ schoolId }, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    axios.post('/school/lesson/base/list.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 获取课程管理列表
  getClassList({schoolId, gradeId, classType, rowStart, rowCount}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    form.append('isGraduate', false)
    if (gradeId !== null && gradeId !== undefined) {
      form.append('gradeId', gradeId)
    }
    if (classType !== null && classType !== undefined) {
      form.append('classType', classType)
    }
    axios.post('/school/class/list.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 添加班级
  addClass({schoolId, gradeId, classType, info}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('classType', classType)
    if (gradeId) {
      form.append('gradeId', gradeId)
    }
    for (const key in info) {
      if (info.hasOwnProperty(key)) {
        const element = info[key]
        if (element) {
          form.append(key, element)
        }
      }
    }
    axios.post('/school/class/add.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 编辑班级
  editClass({schoolId, classId, info}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('classId', classId)
    for (const key in info) {
      if (info.hasOwnProperty(key)) {
        const element = info[key]
        if (element) {
          form.append(key, element)
        }
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
  // 修改学校信息
  editSchoolInfo ({schoolId, data}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    for (var key in data) {
      if (data[key] !== null && data[key] !== undefined) {
        form.append(key, data[key])
      }
    }
    axios.post('/school/edit.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 查询学生所在班级
  queryStudentClass ({schoolId, studentId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('studentId', studentId)
    axios.post('/school/student/queryStudentClass.json', form, config)
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
  },
  // 获取管理课程列表
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
  // 添加课程
  addLessons ({schoolId, lessonName, lessonDesc}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('lessonName', lessonName)
    if (lessonDesc !== null && lessonDesc !== undefined) {
      form.append('lessonDesc', lessonDesc)
    }
    axios.post('/school/lesson/add.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 修改课程
  editLessons ({schoolId, lessonId, lessonName, lessonDesc}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('lessonId', lessonId)
    form.append('lessonName', lessonName)
    form.append('lessonDesc', lessonDesc)
    axios.post('/school/lesson/edit.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  getLessonsInfo ({schoolId, lessonId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('lessonId', lessonId)
    axios.post('/school/lesson/info.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 查询班级信息
  getClassInfo ({schoolId, classId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('classId', classId)
    axios.post('/school/class/info.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 学校学生绑定二维码返回
  getStudentBindingCode ({schoolId, studentId, classId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('studentId', studentId)
    if (classId !== null && classId !== undefined) {
      form.append('classId', classId)
    }
    axios.post('/school/student/getStudentBindingCode.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  getTeacherListForLessons ({schoolId, lessonId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('lessonId', lessonId)
    form.append('rowStart', 0)
    form.append('rowCount', 9999)
    axios.post('/school/teacher/ref/lesson/list.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  selectTeacherListToLessons ({schoolId, lessonId, teacherName}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('lessonId', lessonId)
    if (teacherName !== null && teacherName !== undefined) {
      form.append('teacherName', teacherName)
    }
    form.append('rowStart', 0)
    form.append('rowCount', 9999)
    axios.post('/school/teacher/noref/lesson/list.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  addTeacherToLessons ({schoolId, lessonId, teacherId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('lessonId', lessonId)
    form.append('teacherId', teacherId)
    axios.post('/school/lesson/teacher/ref/add.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  getClassForLessons ({schoolId, lessonId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('lessonId', lessonId)
    form.append('rowStart', 0)
    form.append('rowCount', 9999)
    axios.post('/school/lesson/class/list.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  delTeacherForLessons ({schoolId, lessonId, teacherId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('lessonId', lessonId)
    form.append('teacherId', teacherId)
    axios.post('/school/lesson/teacher/ref/delete.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 学校家长绑定二维码返回老师验证码
  getStudentBindingByTeacherCode ({schoolId, studentId, classId}, cb, er) {
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
    axios.post('/school/parent/getStudentBindingByTeacherCode.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 班级添加学生
  classAddStudent ({schoolId, studentId, classId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('studentId', studentId)
    form.append('classId', classId)
    axios.post('/school/student/addStudentClass.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 学校学生解除绑定微信
  delStudentBinding ({schoolId, studentId, classId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('studentId', studentId)
    if (classId !== null && classId !== undefined) {
      form.append('classId', classId)
    }
    axios.post('/school/student/delStudentBinding.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  delLessons ({schoolId, lessonId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('lessonId', lessonId)
    axios.post('/school/lesson/delete.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 群配置
  getUserSchoolSetting ({orgId, schoolId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' },
      isShowLoad: false
    }
    var form = new FormData()
    if (schoolId !== null && schoolId !== undefined) {
      form.append('schoolId', schoolId)
    } else {
      if (orgId !== null && orgId !== undefined) {
        form.append('orgId', orgId)
      }
    }
    axios.post('/school/user/info.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 根据班级id查询有请假权限的老师列表
  queryTeacherListByClassId({ schoolId, classId, featureCode }, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('classId', classId)
    form.append('featureCode', featureCode)
    axios.post('/school/teacher/queryClassTeacherList.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 学生或者家长请假保存
  addVacation({ schoolId, vacationInfo, studentId }, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    var url
    form.append('schoolId', schoolId)
    console.log(vacationInfo)
    if (studentId !== undefined && studentId !== null) {
      form.append('studentId', studentId)
      url = '/school/vacation/addVacationToParent.json'
    } else {
      url = '/school/vacation/addVacation.json'
    }
    for (var key in vacationInfo) {
      if (vacationInfo[key] !== null && vacationInfo[key] !== undefined) {
        form.append(key, vacationInfo[key])
      }
    }
    axios.post(url, form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 获取学校设置
  getSettingInfo ({schoolId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    axios.post('/school/setting/info.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 设置学校设置
  saveSetting ({schoolId, teacherLookStudentType}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    if (teacherLookStudentType !== null && teacherLookStudentType !== undefined) {
      form.append('teacherLookStudentType', teacherLookStudentType)
    }
    axios.post('/school/setting/save.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 学校学生假期详情
  getVacationInfo ({schoolId, vacationId}, cb, er) {
    var config = {
      params: { schoolId, vacationId }
    }
    axios.get('/school/vacation/getVacationInfo.json', config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 学校学生请假列表(学生查看)
  queryVacationListByStudentId ({schoolId, studentId}, cb, er) {
    var config = {
      params: { schoolId, studentId }
    }
    var url = null
    if (studentId !== null && studentId !== undefined) {
      url = '/school/vacation/parent/queryVacationListByStudentId.json'
    } else {
      url = '/school/vacation/queryVacationListByStudentId.json'
    }
    axios.get(url, config)
    .then(function (response) {
      cb(response.data)
    })
    .catch(function ({ response }) {
      er(response.data)
    })
  },
  // 学校学生请假列表(教师查看)Long schoolId 学校ID
  queryVacationListByTeacherId({schoolId, rowStart, rowCount, data}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    if (data !== undefined && data !== null) {
      for (var key in data) {
        if (data[key] !== null && data[key] !== undefined) {
          form.append(key, data[key])
        }
      }
    }
    axios.post('/school/vacation/queryVacationListByTeacherId.json', form, config)
    .then(function (response) {
      cb(response.data)
    })
    .catch(function ({ response }) {
      er(response.data)
    })
  },
  // 学校老师处理假期
  ratifyVacation ({schoolId, vacationId, ratify, classId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('vacationId', vacationId)
    form.append('classId', classId)
    form.append('ratify', ratify)
    axios.post('/school/vacation/ratifyVacation.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 学生作业详情（通用）
  studentWorkInfo({schoolId, studentWorkId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('studentWorkId', studentWorkId)
    axios.post('/school/work/student/info.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 学生提交作业
  submitWork({schoolId, studentWorkId, workContent, workImg, workVoice, workVideo}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('studentWorkId', studentWorkId)
    if (workContent !== null && workContent !== undefined) {
      form.append('workContent', workContent)
    }
    if (workImg !== null && workImg !== undefined) {
      form.append('workImg', workImg)
    }
    if (workVoice !== null && workVoice !== undefined) {
      form.append('workVoice', workVoice)
    }
    if (workVideo !== null && workVideo !== undefined) {
      form.append('workVideo', workVideo)
    }
    axios.post('/school/work/student/submit.json', form, config)
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
    if (workRemark !== null && workRemark !== undefined && workRemark !== '') {
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
  // 老师-添加作业
  teacherAddWork ({schoolId, classes, lessonId, workDate, endDate, workContent, workImg, workVoice, workVideo}, cb, er) {
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
    form.append('workDate', workDate)
    if (endDate !== null && endDate !== undefined) {
      form.append('endDate', endDate)
    }
    form.append('workContent', workContent)
    if (workImg !== null && workImg !== undefined) {
      form.append('workImg', workImg)
    }
    if (workVoice !== null && workVoice !== undefined && workVoice.length > 0) {
      form.append('workVoice', workVoice)
    }
    if (workVideo !== null && workVideo !== undefined && workVideo.length > 0) {
      form.append('workVideo', workVideo)
    }
    axios.post('/school/work/add.json', form, config)
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
  teacherEditHomework ({schoolId, classes, workId, endDate, workContent, workImg, workVoice, workVideo}, cb, er) {
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
    form.append('workId', workId)
    form.append('endDate', endDate)
    form.append('workContent', workContent)
    if (workImg !== undefined && workImg !== null) {
      form.append('workImg', workImg)
    }
    if (workVoice !== undefined && workVoice !== null) {
      form.append('workVoice', workVoice)
    }
    if (workVideo !== undefined && workVideo !== null) {
      form.append('workVideo', workVideo)
    }
    axios.post('/school/work/save.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 学校学生假期销假(老师用)
  gcancelVacation ({schoolId, vacationId, vacationCode, classId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('vacationId', vacationId)
    form.append('vacationCode', vacationCode)
    form.append('classId', classId)
    axios.post('/school/vacation/gcancelVacation.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 及时评语老师评语列表
  getTeacherTimelyCommentsList ({schoolId, classId, rowStart, rowCount}, cb, er) {
    var config = {
      params: {
        schoolId: schoolId,
        classId: classId,
        rowStart: rowStart,
        rowCount: rowCount
      }
    }
    axios.get('/school/comment/real/teacher/list.json', config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 创建及时评语
  publishTimelyComments ({schoolId, classesId, studentId, lessonId, commentLevel, commentContent}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('classesId', classesId)
    form.append('studentId', studentId)
    if (lessonId !== null) {
      form.append('lessonId', lessonId)
    }
    form.append('commentLevel', commentLevel)
    form.append('commentContent', commentContent)
    axios.post('/school/comment/real/teacher/add.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 删除及时评语
  deleteTimelyComments ({schoolId, classId, commentRealId}, cb, er) {
    var config = {
      params: {
        schoolId: schoolId,
        classId: classId,
        commentRealId: commentRealId
      }
    }
    axios.get('/school/comment/real/teacher/delete.json', config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 及时评语详情
  getTimelyCommentsInfo ({schoolId, classId, commentRealId, roleType}, cb, er) {
    var config = {
      params: {
        schoolId: schoolId,
        classId: classId,
        commentRealId: commentRealId
      }
    }
    var url = ''
    switch (roleType) {
      case 'teacher':
        url = '/school/comment/real/teacher/info.json'
        break
      case 'parent':
        url = '/school/comment/real/parent/info.json'
        break
      case 'student':
        url = '/school/comment/real/student/info.json'
        break
    }
    axios.get(url, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 编辑及时评语
  editTimelyComments ({schoolId, classId, commentRealId, commentLevel, commentContent}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('classId', classId)
    form.append('commentRealId', commentRealId)
    form.append('commentLevel', commentLevel)
    form.append('commentContent', commentContent)
    axios.post('/school/comment/real/teacher/edit.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
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
  // 老师发布的成绩单详情
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
  // 添加成绩单
  addAchievement ({schoolId, data, students}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        if (key !== 'lessonId') {
          const element = data[key]
          if (key === 'fullmark') {
            form.append('fullMarks[0].lessonId', data.lessonId)
            form.append('fullMarks[0].score', data.fullmark)
          }
          form.append(key, element)
        }
      }
    }
    if (students !== null && students.length > 0) {
      for (var i = 0; i < students.length; i++) {
        form.append('students[' + i + '].studentId', students[i].studentId)
        if (data.lessonId !== null && data.lessonId !== undefined && data.lessonId !== '') {
          form.append('students[' + i + '].lessons[0].lessonId', data.lessonId)
        }
        form.append('students[' + i + '].lessons[0].achievementsScore', students[i].achievementsScore)
      }
    }
    axios.post('/school/achievement/teacher/add.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 修改成绩单
  editAchievement ({schoolId, achievementsId, classId, students, achievementsName, lessonId, achievementsNote, scorModel, lessonName, fullmarks}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'application/json' }
    }
    let j = {schoolId: schoolId, achievementsId: achievementsId, achievementsName: achievementsName, classId: classId, achievementsNote: achievementsNote, fullmarks: fullmarks, students: []}
    students.forEach(element => {
      let needFeedBack = element.needFeedBack
      let parentIsRead = element.parentIsRead
      let achievementsBadNote = element.achievementsBadNote
      if (element.achievementsScore < scorModel) {
        needFeedBack = true
        parentIsRead = parentIsRead === null ? false : parentIsRead
        if (lessonId === 0) {
          achievementsBadNote = '总成绩低于' + scorModel + '分'
        } else {
          achievementsBadNote = lessonName + '成绩低于' + scorModel + '分'
        }
      } else {
        needFeedBack = false
        parentIsRead = parentIsRead === null ? false : parentIsRead
        // parentIsRead = false
        achievementsBadNote = null
      }
      if (element.achievementsTeacherNote) {
        needFeedBack = true
      }
      j.students.push({studentId: element.studentId, isNeedFeedBack: needFeedBack, parentIsRead: parentIsRead, achievementsBadNote: achievementsBadNote, achievementsTeacherNote: element.achievementsTeacherNote, lessons: [{lessonId: lessonId, achievementsScore: element.achievementsScore}]})
    })
    axios.post('/school/achievement/teacher/edit.json', j, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 删除成绩单
  deleteAchievement ({schoolId, achievementsId, classId}, cb, er) {
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
  queryTeacherClassList ({schoolId, featureCode}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    if (featureCode !== null && featureCode !== undefined) {
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
  queryTeacherDefaultClass ({schoolId, featureCode}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    if (featureCode !== null && featureCode !== undefined) {
      form.append('featureCode', featureCode)
    }
    axios.post('/school/teacher/queryTeacherDefaultClass.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 管理员设置权限，选择班级列表
  queryClassList ({schoolId, roleId, isExist}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('roleId', roleId)
    form.append('isExist', isExist)
    axios.post('/school/role/class/query.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 教师身份按照班级查询学生
  queryStudentList ({schoolId, classId, studentName, rowStart = '0', rowCount = '9999'}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    if (classId !== null && classId !== undefined) {
      form.append('classId', classId)
    }
    if (studentName) {
      form.append('studentName', studentName)
    }
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    axios.post('/school/student/teacher/studentList.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 教师身份按照班级查询学生
  addClassToLessons ({schoolId, lessonId, classId, teacherId, classHour}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('lessonId', lessonId)
    form.append('classId', classId)
    if (teacherId !== null && teacherId !== undefined) {
      form.append('teacherId', teacherId)
    }
    if (classHour !== null && classHour !== '' && classHour !== undefined) {
      form.append('classHour', classHour)
    }
    axios.post('/school/lesson/ref/class.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 学生查看成绩单列表
  getAchievementList ({schoolId, lessonId, classId, searchTime, studentId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    if (lessonId !== null && lessonId !== undefined) {
      form.append('lessonId', lessonId)
    }
    if (classId !== null && classId !== undefined) {
      form.append('classId', classId)
    }
    if (searchTime !== null && searchTime !== undefined) {
      form.append('searchTime', searchTime)
    }
    form.append('rowStart', 0)
    form.append('rowCount', 9999)
    var url = null
    if (studentId === null || studentId === undefined) {
      url = '/school/achievement/student/list.json'
    } else {
      form.append('studentId', studentId)
      url = '/school/achievement/parent/list.json'
    }
    axios.post(url, form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 家长查看成绩单列表
  getAchievementListForParent ({schoolId, lessonId, classId, searchTime}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    if (lessonId !== null && lessonId !== undefined) {
      form.append('lessonId', lessonId)
    }
    if (classId !== null && classId !== undefined) {
      form.append('classId', classId)
    }
    if (searchTime !== null && searchTime !== undefined) {
      form.append('searchTime', searchTime)
    }
    form.append('rowStart', 0)
    form.append('rowCount', 9999)
    axios.post('/school/achievement/parent/list.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 学生作业列表（带查询条件）
  studentQueryWork({schoolId, studentId, data}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    if (studentId !== null && studentId !== undefined) {
      form.append('studentId', studentId)
    }
    for (var key in data) {
      if (data[key] !== null && data[key] !== undefined) {
        form.append(key, data[key])
      }
    }
    axios.post('/school/work/student/query.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 及时评语学生列表
  getStudentTimelyCommentsList ({schoolId, rowStart, rowCount}, cb, er) {
    var config = {
      params: {
        schoolId: schoolId,
        rowStart: rowStart,
        rowCount: rowCount
      }
    }
    axios.get('/school/comment/real/student/list.json', config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 及时评语家长列表
  getParentsTimelyCommentsList ({schoolId, studentId, rowStart, rowCount}, cb, er) {
    var config = {
      params: {
        schoolId: schoolId,
        studentId: studentId,
        rowStart: rowStart,
        rowCount: rowCount
      }
    }
    axios.get('/school/comment/real/parent/list.json', config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 移除课程的班级
  deleteLessonsClass ({schoolId, lessonId, classId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('lessonId', lessonId)
    form.append('classId', classId)
    axios.post('/school/lesson/ref/class/delete.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 移除课程的班级
  updateStudentClass ({schoolId, studentId, oldClassId, newClassId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('studentId', studentId)
    if (oldClassId !== null && oldClassId !== undefined) {
      form.append('oldClassId', oldClassId)
    }
    form.append('newClassId', newClassId)
    axios.post('/school/student/updateStudentClass.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 获取当前教师教的课程列表,不排序
  queryTeacherLessonListTome ({schoolId}, cb, er) {
    var config = {
      params: {
        schoolId
      }
    }
    axios.get('/school/teacher/queryLessonListToMe.json', config)
    .then(function (response) {
      cb(response.data)
    })
    .catch(function ({ response }) {
      er(response.data)
    })
  },
  // 创建点名
  createRollCall ({schoolId, classesId, lessonId, isDay, teacherId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('classesId', classesId)
    if (lessonId !== undefined && lessonId !== null) {
      form.append('lessonId', lessonId)
    }
    if (teacherId !== undefined && teacherId !== null) {
      form.append('teachingTeacherId', teacherId)
    }
    if (isDay !== undefined && isDay !== null) {
      form.append('day', isDay)
    }
    axios.post('/school/check/addCheck.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 创建周／月评语
  createCycleComments ({schoolId, classesId, lessonId, commentTitle, commentType}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('classesId', classesId)
    if (lessonId !== undefined && lessonId !== null) {
      form.append('lessonId', lessonId)
    }
    form.append('commentTitle', commentTitle)
    form.append('commentType', commentType)
    axios.post('/school/comment/period/teacher/add.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 查看周／月评语详情
  getCommentsInfo ({schoolId, commentPeriodId, studentPeriodId}, cb, er) {
    var config = {
      params: {
        schoolId: schoolId
      }
    }
    var url = ''
    if (commentPeriodId !== undefined && commentPeriodId !== null) {
      config.params.commentPeriodId = commentPeriodId
      url = '/school/comment/period/teacher/info.json'
    } else if (studentPeriodId !== undefined && studentPeriodId !== null) {
      config.params.studentPeriodId = studentPeriodId
      url = '/school/comment/period/teacher/student/info.json'
    }
    axios.get(url, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 获取要评论的学生列表
  getCommentsStudentList ({schoolId, commentPeriodId, rowStart, rowCount}, cb, er) {
    var config = {
      params: {
        schoolId: schoolId,
        commentPeriodId: commentPeriodId,
        rowStart: rowStart,
        rowCount: rowCount
      }
    }
    axios.get('/school/comment/period/teacher/student/list.json', config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 为学生添加评语
  addCommentToStudent ({schoolId, studentPeriodId, commentLevel, commentContent}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('studentPeriodId', studentPeriodId)
    form.append('commentLevel', commentLevel)
    form.append('commentContent', commentContent)
    axios.post('/school/comment/period/teacher/student/edit.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 学校家长解绑学生
  delParentBindingStudent({schoolId, parentId, studentId, classId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('parentId', parentId)
    form.append('studentId', studentId)
    if (classId !== null && classId !== undefined) {
      form.append('classId', classId)
    }
    axios.post('/school/parent/delParentBindingStudent.json', form, config)
    .then(function (response) {
      cb(response.data)
    })
    .catch(function ({ response }) {
      er(response.data)
    })
  },
  // 老师获取周／月评语列表
  getTeacherCycleCommentList ({schoolId, classId, rowStart, rowCount}, cb, er) {
    var config = {
      params: {
        schoolId: schoolId,
        rowStart: rowStart,
        rowCount: rowCount
      }
    }
    if (classId !== undefined && classId !== null) {
      config.params.classId = classId
    }
    axios.get('/school/comment/period/teacher/list.json', config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 获取学生和家长查看列表
  getCycleCommentList({schoolId, studentId, rowStart, rowCount}, cb, er) {
    var config = {
      params: {
        schoolId: schoolId,
        rowStart: rowStart,
        rowCount: rowCount
      }
    }
    var url = ''
    if (studentId !== undefined && studentId !== null) {
      config.params.studentId = studentId
      url = '/school/comment/period/parent/list.json'
    } else {
      url = '/school/comment/period/student/list.json'
    }
    axios.get(url, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 学生／家长 查看评语详情
  getCycleCommentInfo ({schoolId, studentPeriodId}, cb, er) {
    var config = {
      params: {
        schoolId: schoolId,
        studentPeriodId: studentPeriodId
      }
    }
    axios.get('/school/comment/period/teacher/student/info.json', config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 编辑周／月评语
  editCycleComment ({schoolId, commentPeriodId, lessonId, commentTitle, commentType}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('commentPeriodId', commentPeriodId)
    if (lessonId !== undefined && lessonId !== null) {
      form.append('lessonId', lessonId)
    }
    form.append('commentTitle', commentTitle)
    form.append('commentType', commentType)
    axios.post('/school/comment/period/teacher/edit.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 删除周期评语
  deleteCycleComment ({schoolId, commentPeriodId}, cb, er) {
    var config = {
      params: {
        schoolId: schoolId,
        commentPeriodId: commentPeriodId
      }
    }
    axios.get('/school/comment/period/teacher/delete.json', config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 学校家长保存
  saveAddParent ({schoolId, classId, data, teacherName, validateBindStudentName, type}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('classId', classId)
    for (var key in data) {
      if (data[key] !== undefined && data[key] !== null) {
        form.append(key, data[key])
      }
    }
    if (teacherName) {
      form.append('teacherName', teacherName)
    }
    if (type) {
      form.append('type', type)
    }
    if (validateBindStudentName && validateBindStudentName.length > 0) {
      validateBindStudentName.forEach(element => {
        form.append('verifiedStudentName', element)
      })
    }
    axios.post('/school/parent/addParent.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 获取家长信息详情（绑定时）
  bindingToParentInfo ({schoolId, studentId, bindingCode}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('studentId', studentId)
    form.append('bindingCode', bindingCode)
    axios.post('/school/parent/bindingToParentInfo.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 学校家长綁定学生
  parentBindingStudent ({schoolId, data}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    for (var key in data) {
      if (data[key] !== null && data[key] !== undefined) {
        form.append(key, data[key])
      }
    }
    axios.post('/school/parent/addParentBindingStudent.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 获取家长信息详情(自己)
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
  },
  // 学校家长编辑自己资料
  updateParentInfo ({schoolId, parentId, data}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    for (var key in data) {
      if (data[key] !== null && data[key] !== undefined) {
        form.append(key, data[key])
      }
    }
    axios.post('/school/parent/updateParent.json', form, config)
    .then(function (response) {
      cb(response.data)
    })
    .catch(function ({response}) {
      er(response.data)
    })
  },
  // 学校家长绑定二维码返回学生验证码
  getStudentBindingStudentCode ({schoolId, studentId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    if (studentId !== null && studentId !== undefined) {
      form.append('studentId', studentId)
    }
    axios.post('/school/parent/getStudentBindingStudentCode.json', form, config)
    .then(function (response) {
      cb(response.data)
    })
    .catch(function ({ response }) {
      er(response.data)
    })
  },
  // 获取点名学生列表
  getRollCallStudentList ({schoolId, classesId, checkId, rowStart, rowCount}, cb, er) {
    var config = {
      params: {
        schoolId: schoolId,
        classesId: classesId,
        checkId: checkId,
        rowStart: rowStart,
        rowCount: rowCount
      }
    }
    axios.get('/school/check/queryCheckStudentList.json', config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 点名
  starRollcall ({schoolId, checkStudentId, checkId, classesId, checkStatus}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('checkStudentId', checkStudentId)
    form.append('checkId', checkId)
    form.append('classesId', classesId)
    if (checkStatus !== undefined && checkStatus !== null) {
      form.append('checkStatus', checkStatus)
    }
    axios.post('/school/check/addCheckStudent.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 获取老师点名列表
  getTeacherRollcallList ({schoolId, data, rowStart, rowCount}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    for (var key in data) {
      if (data[key] !== null && data[key] !== undefined) {
        form.append(key, data[key])
      }
    }
    axios.post('/school/check/queryCheckList.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
    // var config = {
    //   params: {
    //     schoolId: schoolId,
    //     rowStart: rowStart,
    //     rowCount: rowCount
    //   }
    // }
    // axios.get('/school/check/queryCheckList.json', config)
    //   .then(function (response) {
    //     cb(response.data)
    //   })
    //   .catch(function ({response}) {
    //     er(response.data)
    //   })
  },
  // 获取点名详情
  getTeacherRollcallInfo ({schoolId, classesId, checkId}, cb, er) {
    var config = {
      params: {
        schoolId: schoolId,
        classesId: classesId,
        checkId: checkId
      }
    }
    axios.get('/school/check/queryCheckInfo.json', config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 结束点名
  endRollcall ({schoolId, classesId, checkId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('checkId', checkId)
    form.append('classesId', classesId)
    axios.post('/school/check/endCheck.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 获取学生考勤记录
  getAttendanceRecord ({schoolId, studentId, rowStart, rowCount}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    if (studentId !== null && studentId !== undefined) {
      form.append('studentId', studentId)
    }
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    axios.post('/school/check/queryStudentCheckList.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 获取异常的考勤记录
  getExceptionAttendanceRecord ({schoolId, studentId, rowStart, rowCount}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    if (studentId !== null && studentId !== undefined) {
      form.append('studentId', studentId)
    }
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    axios.post('/school/check/queryUnusualStudentCheckList.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({ response }) {
          er(response.data)
        })
  },
  // 查询学生班级(学生自己)
  queryStudentClassList ({schoolId}, cb, er) {
    var config = {
      params: {
        schoolId
      }
    }
    axios.get('/school/student/classList.json', config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 删除班级
  deleteClass ({schoolId, classId}, cb, er) {
    var config = {
      params: {
        schoolId: schoolId,
        classId: classId
      }
    }
    axios.get('/school/class/delete.json', config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
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
    axios.post('/school/work/pushWork.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({ response }) {
          er(response.data)
        })
  },
  getWorkIntro ({schoolId, workId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('workId', workId)
    axios.post('/school/work/teacher/intro.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({ response }) {
          er(response.data)
        })
  },
  // 推送评语
  pushComments ({schoolId, commentPeriodId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('commentPeriodId', commentPeriodId)
    axios.post('/school/comment/period/teacher/push.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({ response }) {
          er(response.data)
        })
  },
  getCommentIntro ({schoolId, commentPeriodId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('commentPeriodId', commentPeriodId)
    axios.post('/school/comment/period/teacher/intro.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({ response }) {
          er(response.data)
        })
  },
  getAchievementIntro ({schoolId, achievementsId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('achievementsId', achievementsId)
    axios.post('/school/achievement/teacher/intro.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({ response }) {
          er(response.data)
        })
  },
  // 推送成绩单
  pushTranscripts({schoolId, achievementsId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('achievementsId', achievementsId)
    axios.post('/school/achievement/teacher/push.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({ response }) {
          er(response.data)
        })
  },
  // 获取我的学校
  getMySchoolList (cb, er) {
    var config = {
      isShowLoad: false
    }
    axios.get('/school/my/list.json', config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 查询学生的基本信息
  queryStudentInfo({schoolId, studentId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('studentId', studentId)
    axios.post('/school/student/pithyStudentInfo.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({ response }) {
          er(response.data)
        })
  },
  // 获取家长信息详情(管理员)
  teacherQueryParentInfo ({schoolId, parentId, classId, studentId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('parentId ', parentId)
    if (classId !== null && classId !== undefined) {
      form.append('classId', classId)
    }
    if (studentId !== null && studentId !== undefined) {
      form.append('studentId ', studentId)
    }
    axios.post('/school/parent/manage/parentInfo.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 根据班级查询群里面没有绑定的学生
  getStudentsByclassId ({schoolId, classId, wantName}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('wantName', wantName)
    if (classId !== null && classId !== undefined) {
      form.append('classId', classId)
    }
    axios.post('/school/student/getNoBindUser.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 学校学生綁定微信保存（教师操作根据userId）
  bindingStudentByuserId ({schoolId, studentId, userId, classId, orgId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('studentId ', studentId)
    form.append('userId ', userId)
    if (classId !== null && classId !== undefined) {
      form.append('classId ', classId)
    }
    if (orgId !== null && orgId !== undefined) {
      form.append('orgId ', orgId)
    }
    axios.post('/school/student/addStudentBinding.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 菜谱查询
  queryCanteen ({schoolId, mealType, groupType, startDate, endDate, rowStart, rowCount}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    if (mealType !== null && mealType !== undefined) {
      form.append('mealType ', mealType)
    }
    if (groupType !== null && groupType !== undefined) {
      form.append('groupType ', groupType)
    }
    if (startDate !== null && startDate !== undefined) {
      form.append('startDate ', startDate)
    }
    if (endDate !== null && endDate !== undefined) {
      form.append('endDate ', endDate)
    }
    if (rowStart !== null && rowStart !== undefined) {
      form.append('rowStart ', rowStart)
    }
    if (rowCount !== null && rowCount !== undefined) {
      form.append('rowCount ', rowCount)
    }
    axios.post('/school/canteen/menu/query.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 查询自己的报修记录
  queryRepairsList ({schoolId, rowStart, rowCount}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    axios.post('/school/repair/query.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 查询用户提交的所有的报修记录
  queryManageRepairsList ({schoolId, rowStart, rowCount}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    axios.post('/school/repair/manager/query.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 菜谱-添加/修改
  saveCanteenMenu ({schoolId, data}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    for (var key in data) {
      if (data[key] !== null && data[key] !== undefined) {
        form.append(key, data[key])
      }
    }
    axios.post('/school/canteen/menu/save.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 获取菜单详情
  getCanteenInfo ({schoolId, canteenMenuId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('canteenMenuId', canteenMenuId)
    axios.post('/school/canteen/menu/info.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 菜谱删除
  delCanteenMenu ({schoolId, canteenMenuId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('canteenMenuId', canteenMenuId)
    axios.post('/school/canteen/menu/del.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 菜谱推送
  pushCanteenMenu ({schoolId, canteenMenuId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('canteenMenuId', canteenMenuId)
    axios.post('/school/canteen/menu/push.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 添加报修
  addRepair ({schoolId, contentText, imgs, repairTitle, repairType}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('contentText', contentText)
    form.append('repairTitle', repairTitle)
    form.append('repairType', repairType)
    var strs = ''
    for (var index = 0; index < imgs.length; index++) {
      var element = imgs[index]
      if (index === imgs.length - 1) {
        strs += element
        break
      }
      strs = strs + element + ','
    }
    form.append('contentImg', strs)
    axios.post('/school/repair/add.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 报修详情
  repairDetail ({schoolId, repairId, isManage}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('repairId', repairId)
    var url = String(isManage) === 'true' ? '/school/repair/manager/info.json' : '/school/repair/info.json'
    axios.post(url, form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 保修完成
  repairComplete ({schoolId, repairId, repairText, imgs}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('repairId', repairId)
    form.append('repairText', repairText)
    form.append('repairImg', imgs.toString())
    axios.post('/school/repair/complete.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 保修者删除保修记录
  delRepair ({schoolId, repairId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('repairId', repairId)
    axios.post('/school/repair/del.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 学校学费
  schoolRenew({schoolId, payPackageId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('payPackageId', payPackageId)
    axios.post('/school/renew.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 家长，学生获取周报列表
  getUserWeeklyReport ({schoolId, studentId, rowStart, rowCount}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    if (studentId !== undefined && studentId !== null) {
      form.append('studentId', studentId)
    }
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    axios.post('/school/checkWeekly/queryCheckWeeklyStudentList.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 获取学生，家长周报详情
  getUserWeeklyDetail({schoolId, studentId, weeklyId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    if (studentId !== undefined && studentId !== null) {
      form.append('studentId', studentId)
    }
    form.append('weeklyId', weeklyId)
    axios.post('/school/checkWeekly/getCheckWeeklyStudentInfo.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 获取教师周报列表
  getManageWeeklyList({schoolId, rowStart, rowCount}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    axios.post('/school/checkWeekly/queryCheckWeeklyList.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 教师获取周报详情
  getManageWeeklyDetail({schoolId, weeklyId, classId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('weeklyId', weeklyId)
    form.append('classId', classId)
    axios.post('/school/checkWeekly/getCheckWeeklyInfo.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 查询角色信息
  getRoleInfo ({schoolId, roleId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('roleId', roleId)
    axios.post('/school/role/info.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 推送周报
  pushWeekly({schoolId, weeklyId, classId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('weeklyId', weeklyId)
    form.append('classId', classId)
    axios.post('/school/checkWeekly/pushCheckWeekly.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 保存推送接收老师
  saveAttendPushTarget({schoolId, teacherId, classIds}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('teacherId', teacherId)
    classIds.forEach((val) => {
      form.append('classId', val)
    })
    axios.post('/school/checkset/save.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 接收推送的老师
  getAttendPushTeachers({schoolId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    axios.post('/school/checkset/list.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 删除接收考勤推送的老师
  deleteAttendPushTeacher({schoolId, teacherId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('teacherId', teacherId)
    axios.post('/school/checkset/del.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 获取接收推送的班级
  getAttendPushClasses({schoolId, teacherId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('teacherId', teacherId)
    axios.post('/school/checkset/class/list.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 学生列表
  getFeaturesStudents({schoolId, studentName, classId, featureCode, rowStart, rowCount}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('classId', classId)
    if (studentName !== undefined && studentName !== null) {
      form.append('studentName', studentName)
    }
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
  // 获取课程列表(带老师)根据班级id
  // queryLessonListByClassId({schoolId, classId, featureCode}, cb, er) {
  //   var config = {
  //     method: 'post',
  //     headers: { 'Content-Type': 'multipart/form-data' }
  //   }
  //   var form = new FormData()
  //   form.append('schoolId', schoolId)
  //   form.append('classId', classId)
  //   form.append('featureCode', featureCode)
  //   axios.post('/school/lesson/queryLessonListByClassId.json', form, config)
  //     .then(function (response) {
  //       cb(response.data)
  //     })
  //     .catch(function ({ response }) {
  //       er(response.data)
  //     })
  // },
  // 获取学生信息
  simplenessStudentInfo({schoolId, studentId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    if (studentId !== null && studentId !== undefined) {
      form.append('studentId', studentId)
    }
    axios.post('/school/student/simplenessStudentInfo.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 查询没有绑定老师的用户
  getNoBindTeacherUser({schoolId, orgId, name, wantName, rowStart, rowCount}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('wantName', wantName)
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    if (orgId !== null && orgId !== undefined) {
      form.append('orgId', orgId)
    }
    if (name !== undefined && name !== null) {
      form.append('name', name)
    }
    axios.post('/school/teacher/getNoBindUser.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 学校教师綁定连接返回（教师操作根据userId）
  selectTeacherBind({schoolId, userId, teacherId, orgId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('userId', userId)
    form.append('teacherId', teacherId)
    if (orgId !== null && orgId !== undefined) {
      form.append('orgId', orgId)
    }
    axios.post('/school/teacher/addTeacherBindingToUser.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 检查教师是否关注公众号
  examineTeacherBindPublic({schoolId, teacherId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('teacherId', teacherId)
    axios.post('/school/teacher/getTeacherBindingToUserId.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  getOrgEnterExraParams({schoolId, type}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('type', type)
    axios.post('/school/teacher/getExtendParamInfo.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 编辑老师
  orgEnterUpdateTeacher ({schoolId, teacherId, data}, cb, er) {
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
    axios.post('/school/teacher/updateTeacherToBinding.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 判断是否允许创建学校群
  checkCreateSchoolOrg({schoolId, type}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('type', type)
    axios.post('/school/create/check.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 创建学校群
  createSchoolOrg({schoolId, type, randomId, classId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('type', type)
    form.append('randomId', randomId)
    if (classId !== null && classId !== undefined) {
      form.append('classId', classId)
    }
    axios.post('/school/create/org.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 获取家长群成员列表
  selectParentBind({schoolId, orgId, classId, name, wantName}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('classId', classId)
    form.append('wantName', wantName)
    if (orgId !== undefined && orgId !== null) {
      form.append('orgId', orgId)
    }
    if (name !== undefined && name !== null) {
      form.append('name', name)
    }
    axios.post('/school/parent/getNoBindUser.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 获取班级课程详情
  getClassLessonInfo({schoolId, classId, lessonId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('classId', classId)
    form.append('lessonId', lessonId)
    axios.post('/school/lesson/ref/class/info.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 编辑班级详情
  editClassLesson({schoolId, lessonId, classId, teacherId, classHour}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('lessonId', lessonId)
    if (teacherId !== undefined && teacherId !== null) {
      form.append('teacherId', teacherId)
    }
    if (classHour !== undefined && classHour !== null) {
      form.append('classHour', classHour)
    }
    form.append('classId', classId)
    axios.post('/school/lesson/ref/class/edit.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 管理员绑定家长
  addParentBinding({schoolId, userIds, studentId, orgId, classId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    for (let index = 0; index < userIds.length; index++) {
      const element = userIds[index]
      form.append('userIds', element)
    }
    form.append('studentId', studentId)
    // form.append('orgId', orgId)
    form.append('classId', classId)
    axios.post('/school/parent/addParentBinding.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 获取未开通的学校
  getNoOpenSchool (cb, er) {
    var config = {
      params: {}
    }
    axios.get('/school/my/notOpen.json', config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 检查家长是否关注公众号
  examineParentBindPublic({schoolId, parentId, studentId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('parentId', parentId)
    form.append('studentId', studentId)
    axios.post('/school/parent/getParentBindingToUserId.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response)
      })
  },
  sendCreateSchoolVerificationCode ({userPhone}, cb, er) {
    var config = {
      params: {userPhone}
    }
    axios.get('school/apply/send.json', config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  updateParentBindInfo({schoolId, data}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    for (var key in data) {
      if (data[key] !== null && data[key] !== undefined) {
        form.append(key, data[key])
      }
    }
    axios.post('/school/parent/updateParentToBinding.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  changeNickName({schoolId, robotNickname}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('robotNickname', robotNickname)
    axios.post('/school/saveRobotNickname.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 学生取消请假
  studentDeleteVacation ({schoolId, vacationId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('vacationId', vacationId)
    axios.post('/school/vacation/deleteVacation.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 家长取消假期
  parentDeleteVacation ({schoolId, vacationId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('vacationId', vacationId)
    axios.post('/school/vacation/deleteVacationToParent.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 家长同意请假
  ratifyVacationToParent ({schoolId, vacationId, ratify}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('vacationId', vacationId)
    form.append('ratify', ratify)
    axios.post('/school/vacation/ratifyVacationToParent.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 查询学生班级(家长)
  parentGetClass ({schoolId, studentId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('studentId', studentId)
    axios.post('/school/student/parentGetClass.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 查询学生班级(家长)
  getTeacherNeedBindClassList ({schoolId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' },
      isShowLoad: false
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('isGraduate', false)
    axios.post('/school/class/getTeacherNeedBindClassList.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 查询用户是否有待绑定身份 老师、家长
  getOneselfIdentity ({schoolId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    axios.post('/school/parent/getOneselfIdentity.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 功能开关设置－查询功能
  featurePowerList ({schoolId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    axios.post('/school/feature/power/list.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 功能开关设置－开关功能
  saveFeaturePower ({schoolId, featureId, isOpen}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('featureId', featureId)
    form.append('isOpen', isOpen)
    axios.post('/school/feature/power/save.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 功能开关设置－开关功能
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
  // 功能开关设置－开关功能
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
  getShorturl ({url}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('url', url)
    axios.post('/shorturl/getUrl.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  oneselfTeacherBinding ({schoolId, teacherInfo, type, verifiedTeacherName}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    for (var key in teacherInfo) {
      if (teacherInfo[key] !== null && teacherInfo[key] !== undefined) {
        form.append(key, teacherInfo[key])
      }
    }
    if (type) {
      form.append('type', type)
    }
    if (verifiedTeacherName && verifiedTeacherName.length > 0) {
      verifiedTeacherName.forEach(element => {
        form.append('verifiedTeacherName', element)
      })
    }
    axios.post('/school/teacher/oneselfTeacherBinding.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  queryClassListByOrg ({schoolId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    axios.post('/school/parent/queryClassListByOrg.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  parentSubmitHomework({schoolId, studentId, studentWorkId, workContent, workImg, workVoice, workVideo}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('studentId', studentId)
    form.append('studentWorkId', studentWorkId)
    if (workContent !== null && workContent !== undefined) {
      form.append('workContent', workContent)
    }
    if (workImg !== null && workImg !== undefined) {
      form.append('workImg', workImg)
    }
    if (workVoice !== null && workVoice !== undefined && workVoice.length > 0) {
      form.append('workVoice', workVoice)
    }
    if (workVideo !== null && workVideo !== undefined && workVideo.length > 0) {
      form.append('workVideo', workVideo)
    }
    axios.post('/school/work/parent/student/submit.json', form, config)
    .then(function (response) {
      cb(response.data)
    })
    .catch(function ({response}) {
      er(response.data)
    })
  },
  identity ({schoolId, data}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    for (var key in data) {
      if (data[key] !== null && data[key] !== undefined) {
        form.append(key, data[key])
      }
    }
    axios.post('/school/remove/identity.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 开通学校订单允许取消
  cancelOrder ({schoolId}, cb, er) {
    var config = {
      params: { schoolId }
    }
    axios.get('/school/cancel/order.json', config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 学校学生删除班级
  delStudentClass ({schoolId, studentId, classId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('studentId', studentId)
    form.append('classId', classId)
    axios.post('/school/student/delStudentClass.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  getOrgUsers({schoolId, type, classId, name, wantName, rowStart, rowCount}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    const form = new FormData()
    let data = arguments[0]
    console.log(arguments[0])
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const element = data[key]
        if (element !== undefined && element !== null) {
          form.append(key, element)
        }
      }
    }
    axios.post('school/user/getNoBindUser.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 根据班级查询默认角色
  queryByClassId ({ schoolId, classId }, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('classId', classId)
    axios.post('/school/role/queryByClassId.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  queryAchievementInfo({schoolId, achievementsId, studentId}, cb, er) {
    let config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    let form = new FormData()
    form.append('schoolId', schoolId)
    form.append('achievementsId', achievementsId)
    let url = ''
    if (studentId !== null && studentId !== undefined) {
      form.append('studentId', studentId)
      url = '/school/achievement/parent/info.json'
    } else {
      url = '/school/achievement/student/info.json'
    }
    axios.post(url, form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  addGrade({schoolId, gradeName}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('gradeName', gradeName)
    this.doPostRequest('/school/grade/add.json', form, cb, er)
  },
  saveGrade({schoolId, gradeId, gradeName}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('gradeId', gradeId)
    form.append('gradeName', gradeName)
    this.doPostRequest('/school/grade/save.json', form, cb, er)
  },
  getGradeInfo({schoolId, gradeId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('gradeId', gradeId)
    this.doPostRequest('/school/grade/info.json', form, cb, er)
  },
  getGradeList({schoolId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('isFinish', false)
    this.doPostRequest('/school/grade/list.json', form, cb, er)
  },
  delGrade({schoolId, gradeId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('gradeId', gradeId)
    this.doPostRequest('/school/grade/del.json', form, cb, er)
  },
  addSelfClassLesson({schoolId, classIds, lessonIds}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    if (classIds !== null && classIds !== undefined) {
      classIds.forEach(element => {
        form.append('classId', element)
      })
    }
    if (lessonIds !== null && lessonIds !== undefined) {
      lessonIds.forEach(element => {
        form.append('lessonId', element)
      })
    }
    this.doPostRequest('/school/teacher/addSelfClassLesson.json', form, cb, er)
  },
  sendParentApply({schoolId, studentId, relationship, parentName}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('studentId', studentId)
    form.append('relationship', relationship)
    form.append('parentName', parentName)
    this.doPostRequest('/school/parent/apply/add.json', form, cb, er)
  },
  getParentApplyInfo({schoolId, applyId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('applyId', applyId)
    this.doPostRequest('/school/parent/apply/info.json', form, cb, er)
  },
  applyParentApprove({schoolId, applyId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('applyId', applyId)
    this.doPostRequest('/school/parent/apply/approve.json', form, cb, er)
  },
  achievementFeedback({schoolId, studentId, achievementsId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('studentId', studentId)
    form.append('achievementsId', achievementsId)
    this.doPostRequest('/school/achievement/parent/feedBack.json', form, cb, er)
  },
  queryClassTeacherListByClassTeacher({schoolId, classId, featureCode}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('classId', classId)
    form.append('featureCode', featureCode)
    this.doPostRequest('/school/teacher/queryClassTeacherListByClassTeacher.json', form, cb, er)
  },
  queryStudentListOrderName({schoolId, classId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('classId', classId)
    form.append('rowStart', 0)
    form.append('rowCount', 999)
    this.doPostRequest('/school/student/teacher/studentList/orderName.json', form, cb, er)
  },
  getLessonsByAchievementId({schoolId, achievementsId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('achievementsId', achievementsId)
    this.doPostRequest('/school/achievement/lesson/list.json', form, cb, er)
  },
  getAchievementChartByTeacher({schoolId, achievementsId, lessonId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('achievementsId', achievementsId)
    if (lessonId) {
      form.append('lessonId', lessonId)
    }
    this.doPostRequest('/school/achievement/teacher/chart.json', form, cb, er)
  },
  getAchievementChartByStudent({schoolId, achievementsId, lessonId, studentId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('achievementsId', achievementsId)
    if (lessonId) {
      form.append('lessonId', lessonId)
    }
    let url = ''
    if (studentId) {
      url = '/school/achievement/parent/chart.json'
      form.append('studentId', studentId)
    } else {
      url = '/school/achievement/student/chart.json'
    }
    this.doPostRequest(url, form, cb, er)
  },
  // 查询班主任所管理的班级列表
  queryHeadTeacherClassList({schoolId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('isGraduate', false)
    this.doPostRequest('/school/class/queryHeadTeacherClassList.json', form, cb, er)
  },
  // 查询班主任所管理的班级列表
  getStudentBindingCodeByParent({schoolId, studentId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('studentId', studentId)
    this.doPostRequest('/school/student/getStudentBindingCodeByParent.json', form, cb, er)
  },
  // 删除作业
  deleteWork({schoolId, workId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('workId', workId)
    this.doPostRequest('/school/work/deleteWork.json', form, cb, er)
  },
  // 查询接收消息设置
  queryReceiveSetting({schoolId, type}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('type', type)
    this.doPostRequest('/school/push/setting/query.json', form, cb, er)
  },
  // 保存接收消息设置
  saveReceiveSetting({schoolId, isPush, code, type}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('isPush', isPush)
    form.append('code', code)
    form.append('type', type)
    this.doPostRequest('/school/push/setting/save.json', form, cb, er)
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
  // 家长添加孩子
  addConnectStudent({schoolId, classId, relationship, studentName}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('relationship', relationship)
    form.append('studentName', studentName)
    form.append('classId', classId)
    this.doPostRequest('/school/parent/addConnectStudent.json', form, cb, er)
  },
  // 兴趣班毕业
  interest ({schoolId, classId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('classId', classId)
    this.doPostRequest('/school/class/finish.json', form, cb, er)
  },
  // 年级组长功能列表
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
  // 年级组长管理列表
  gradeTeacherList ({schoolId, gradeId, teacherName, isExist}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('gradeId', gradeId)
    if (teacherName !== null && teacherName !== undefined) {
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
  // 年级组添加、删除老师
  queryTeacherDefaultClassStudent ({schoolId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('schoolId', schoolId)
    axios.post('/school/teacher/queryTeacherDefaultClassStudent.json', form, config)
    .then(function (response) {
      cb(response.data)
    })
    .catch(function ({ response }) {
      er(response.data)
    })
  }
}
