import store from '../store'
import eduApi from '@/feature/education/api'
export const localStorage = {

  // 判断是否是学校创建者
  setHelpProgressForSchoolMaster (schoolId, process) {
    window.localStorage.setItem('schoolMaster_' + schoolId, process)
  },
  getHelpProgressForSchoolMaster (schoolId) {
    return window.localStorage.getItem('schoolMaster_' + schoolId)
  },

  // 缓存当前用户身份
  setSchoolUserIdentity (schoolId, userId, identity) {
    if (userId !== null && userId !== undefined) {
      window.sessionStorage.setItem('schoolUserIdentity_' + schoolId + '_' + userId, identity)
    }
  },
  getSchoolUserIdentity (schoolId, userId) {
    return window.sessionStorage.getItem('schoolUserIdentity_' + schoolId + '_' + userId)
  },

  // 缓存管理员是否显示引导的状态 true:已阅
  setHelpForSchoolManager (schoolId, status) {
    window.localStorage.setItem('schoolManager_' + schoolId, status)
  },
  getHelpForSchoolManager (schoolId) {
    return window.localStorage.getItem('schoolManager_' + schoolId)
  },

  // 缓存老师管理是否显示帮助页面 true:已阅
  setTeacherHelpForSchoolManager (schoolId, status) {
    window.localStorage.setItem('schoolTeacherManager_' + schoolId, status)
  },
  getTeacherHelpForSchoolManager (schoolId) {
    return window.localStorage.getItem('schoolTeacherManager_' + schoolId)
  },

  // 缓存课程管理是否显示帮助页面 true:已阅
  setLessonsHelpForSchoolManager (schoolId, status) {
    window.localStorage.setItem('schoolLessonsManager_' + schoolId, status)
  },
  getLessonsHelpForSchoolManager (schoolId) {
    return window.localStorage.getItem('schoolLessonsManager_' + schoolId)
  },

  // 缓存班级管理是否显示帮助页面 true:已阅
  setClassHelpForSchoolManager (schoolId, status) {
    window.localStorage.setItem('schoolClassManager_' + schoolId, status)
  },
  getClassHelpForSchoolManager (schoolId) {
    return window.localStorage.getItem('schoolClassManager_' + schoolId)
  },

  // 缓存班级管理是否显示帮助页面 true:已阅
  setOrgManageHelpForSchoolManager (schoolId, status) {
    window.localStorage.setItem('schoolOrgManager_' + schoolId, status)
  },
  getOrgManageHelpForSchoolManager (schoolId) {
    return window.localStorage.getItem('schoolOrgManager_' + schoolId)
  },

  // 群管理帮助引导
  setCreateOrgHelpForSchoolManager (schoolId, status) {
    window.localStorage.setItem('schoolCreateOrgStatus_' + schoolId, status)
  },
  getCreateOrgHelpForSchoolManager (schoolId) {
    return window.localStorage.getItem('schoolCreateOrgStatus_' + schoolId)
  },

  // 教师版本的创建者的首次使用引导
  setHelpForPersonalSchoolMaster (schoolId, status) {
    window.localStorage.setItem('personalSchoolMaster_' + schoolId, status)
  },
  getHelpForPersonalSchoolMaster (schoolId) {
    return window.localStorage.getItem('personalSchoolMaster_' + schoolId)
  },
  // 个人版创建者显示做任务的奖励展示
  setRedEnvelopesPersonalSchoolMaster (schoolId, status) {
    window.localStorage.setItem('personalRedEnvelopesTeacher_' + schoolId, status)
  },
  getRedEnvelopesPersonalSchoolMaster (schoolId) {
    return window.localStorage.getItem('personalRedEnvelopesTeacher_' + schoolId)
  },
  // 个人本家长首页引导
  setRedEnvelopesPersonalSchoolParent (schoolId, status) {
    window.localStorage.setItem('personalRedEnvelopesParent_' + schoolId, status)
  },
  getRedEnvelopesPersonalSchoolParent (schoolId) {
    return window.localStorage.getItem('personalRedEnvelopesParent_' + schoolId)
  },
  setStudyVideoSchoolParent (schoolId, status) {
    window.localStorage.setItem('studyVideoParent_' + schoolId, status)
  },
  getStudyVideoSchoolParent (schoolId) {
    return window.localStorage.getItem('studyVideoParent_' + schoolId)
  },
  // 家长首页功能使用帮助引导
  setHelpStatusForParent (schoolId, status) {
    window.localStorage.setItem('helpStatusForParent_' + schoolId, status)
  },
  getHelpStatusForParent (schoolId) {
    return window.localStorage.getItem('helpStatusForParent_' + schoolId)
  },
  // 获取教师功能
  getTeacherFeature ({schoolId}, cb, er) {
    if (store.state.teacherFeature.length > 0) {
      cb(store.state.teacherFeature)
      return
    }
    eduApi.getTeacherFeatures({schoolId}, (data) => {
      if (data.length > 0) {
        store.commit('updateTeacherFeature', data)
      }
      cb(data)
    }, er)
  },
  // 查询管理权限的级别，是学校的还是班级的
  getFeatureManageStatus ({schoolId}, cb, er) {
    this.getTeacherFeature({schoolId}, (data) => {
      const status = {
        schoolNoticeStatus: false,
        classNoticeStatus: false,
        schoolActivityStatus: false,
        classActivityStatus: false,
        schoolNewsStatus: false,
        classNewsStatus: false,
        schoolVoteStatus: false,
        classVoteStatus: false
      }
      data.forEach(element => {
        if (element.featureCode === 'GONGGAO_XUEXIAO') {
          status.schoolNoticeStatus = true
        } else if (element.featureCode === 'GONGGAO_BANJI') {
          status.classNoticeStatus = true
        } else if (element.featureCode === 'HUODONG_XUEXIAO') {
          status.schoolActivityStatus = true
        } else if (element.featureCode === 'HUODONG_BANJI') {
          status.classActivityStatus = true
        } else if (element.featureCode === 'WENJUAN_XUEXIAO') {
          status.schoolQuestionStatus = true
        } else if (element.featureCode === 'WENJUAN_BANJI') {
          status.classQuestionStatus = true
        } else if (element.featureCode === 'ZIXUN_XUEXIAO') {
          status.schoolNewsStatus = true
        } else if (element.featureCode === 'ZIXUN_BANJI') {
          status.classNewsStatus = true
        } else if (element.featureCode === 'TOUPIAO_XUEXIAO') {
          status.schoolVoteStatus = true
        } else if (element.featureCode === 'TOUPIAO_BANJI') {
          status.classVoteStatus = true
        }
      })
      cb(status)
    }, er)
  },
  // 清空教师功能缓存
  clearTeacherFeature () {
    store.commit('updateTeacherFeature', [])
  },

  // 获取用户信息
  getUserInfo ({schoolId, isRefresh}, cb, er) {
    if (schoolId === null || schoolId === undefined) {
      return
    }
    if (parseInt(store.state.eduUserInfo.schoolId) !== parseInt(schoolId) || isRefresh) {
      this.clearUserInfo()
    }
    if (store.state.eduUserInfo.userId !== null && store.state.eduUserInfo.userId !== undefined) {
      cb(store.state.eduUserInfo)
      return
    }
    eduApi.getUserSchoolSetting({schoolId}, (data) => {
      if (data.isTeacher === true || data.isMaster === true) {
        this.getTeacherFeature({schoolId}, (featureData) => {
          let feature = {}
          featureData.forEach(element => {
            if (element.featureCode === 'BANJIGUANLI') {
              feature.classManage = true
            } else if (element.featureCode === 'LAOSHIGUANLI') {
              feature.teacherManage = true
            } else if (element.featureCode === 'KECHENGGUANLI') {
              feature.lessonsManage = true
            } else if (element.featureCode === 'QUANXIANGUANLI') {
              feature.roleManage = true
            } else if (element.featureCode === 'JIELONG_BANJI') {
              feature.classChain = true
            } else if (element.featureCode === 'JIELONG_XUEXIAO') {
              feature.schoolChain = true
            }
          })
          data.feature = feature
          store.commit('updateTeacherFeature', featureData)
          store.commit('updateEduUserInfo', data)
          store.commit('updateUserInfo', data)
          cb(data)
        }, () => {
          cb(data)
          store.commit('updateEduUserInfo', data)
          store.commit('updateUserInfo', data)
        })
      } else {
        cb(data)
        store.commit('updateEduUserInfo', data)
        store.commit('updateUserInfo', data)
      }
    }, (errdata) => {
      er(errdata)
    })
  },
  // 清空用户信息缓存
  clearUserInfo () {
    store.commit('updateEduUserInfo', {})
  },
  // 获取用户信息
  getPersonalSchoolClassInfo ({schoolId, isRefresh}, cb, er) {
    if (schoolId === null || schoolId === undefined) {
      return
    }
    if (parseInt(store.state.personalSchoolClassInfo.schoolId) !== parseInt(schoolId) || isRefresh) {
      this.clearPersonalSchoolClassInfo()
    }
    if (store.state.personalSchoolClassInfo.classId !== null && store.state.personalSchoolClassInfo.classId !== undefined) {
      cb(store.state.personalSchoolClassInfo)
      return
    }
    eduApi.getClassList({schoolId: schoolId, classType: 1, rowStart: 0, rowCount: 20}, (data) => {
      if (data.length > 0) {
        let item = {
          schoolId: schoolId,
          classId: data[0].classId,
          className: data[0].className
        }
        store.commit('updatePersonalSchoolClassInfo', item)
        cb(item)
      }
    }, (errdata) => {
      er(errdata)
    })
  },
  clearPersonalSchoolClassInfo () {
    store.commit('updatePersonalSchoolClassInfo', {})
  }
}
export default {
  install: function (Vue) {
    Vue.prototype.localStorage = localStorage
  }
}
