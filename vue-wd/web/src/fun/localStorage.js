export const localStorage = {
  // 导入老师
  isFirstTeacher (schoolId, status) {
    window.localStorage.setItem('isFirstTeacher' + schoolId, status)
  },
  noFirstTeacher (schoolId) {
    return window.localStorage.getItem('isFirstTeacher' + schoolId)
  },
  // 转班
  isFirstBatchTurn (schoolId, status) {
    window.localStorage.setItem('isFirstBatchTurn' + schoolId, status)
  },
  noFirstBatchTurn (schoolId) {
    return window.localStorage.getItem('isFirstBatchTurn' + schoolId)
  },
  // 导入学生
  isFirstStudent (schoolId, status) {
    window.localStorage.setItem('isFirstStudent' + schoolId, status)
  },
  noFirstStudent (schoolId) {
    return window.localStorage.getItem('isFirstStudent' + schoolId)
  },
  // 分数成绩
  isFirstScore (schoolId, status) {
    window.localStorage.setItem('isFirstScore' + schoolId, status)
  },
  noFirstScore (schoolId) {
    return window.localStorage.getItem('isFirstScore' + schoolId)
  },
  // 等级成绩
  isFirstGrade (schoolId, status) {
    window.localStorage.setItem('isFirstGrade' + schoolId, status)
  },
  noFirstGrade (schoolId) {
    return window.localStorage.getItem('isFirstGrade' + schoolId)
  },
  // 缓存当前用户身份
  setSchoolUserIdentity (schoolId, userId, identity) {
    if (userId !== null && userId !== undefined) {
      window.sessionStorage.setItem('schoolUserIdentity_' + schoolId + '_' + userId, identity)
    }
  },
  getSchoolUserIdentity (schoolId, userId) {
    return window.sessionStorage.getItem('schoolUserIdentity_' + schoolId + '_' + userId)
  }
}

export default {
  install: function (Vue) {
    Vue.prototype.localStorage = localStorage
  }
}
