import axios from '@/api/axios.base'

export default {
  doGetRequest(url, config, cb, er) {
    axios.get(url, {params: config})
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
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
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 活动管理列表
  getManageList({ schoolId, activityType, rowStart, rowCount }, cb, er) {
    const url = '/school/activity/manager/list.json'
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('activityType', activityType)
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    this.doPostRequest(url, form, cb, er)
  },
  // 发布活动
  publishActivity({schoolId, data}, cb, er) {
    const form = new FormData() // FormData 对象=
    form.append('schoolId', schoolId)
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const element = data[key]
        if ((key === 'startDate' || key === 'endDate' || key === 'signStartDate' || key === 'signEndDate') && element !== null && element.length > 2) {
          form.append(key, element[0] + ' ' + element[1] + ':' + element[2])
          // console.log(element, element[0] + ' ' + element[1] + ':' + element[2])
        } else if (key === 'classesId' || key === 'orgId' || key === 'activityDetailsImg') {
          for (let index = 0; index < element.length; index++) {
            const c = element[index]
            form.append(key + '[' + index + ']', c)
          }
        } else if (key === 'userLinkData') {
          for (let k = 0; k < element.length; k++) {
            form.append(key + '[' + k + '].key', element[k].key)
            form.append(key + '[' + k + '].value', element[k].value)
          }
        } else {
          if (element !== null && element !== undefined) {
            form.append(key, element)
          }
        }
      }
    }
    const url = '/school/activity/manager/add.json'
    this.doPostRequest(url, form, cb, er)
  },
  // 活动详情
  getActivityInfo({schoolId, activityId, studentId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('activityId', activityId)
    if (studentId !== undefined && studentId !== null) {
      form.append('studentId', studentId)
    }
    const url = '/school/activity/info.json'
    this.doPostRequest(url, form, cb, er)
  },
  // 删除活动
  deleteActivity({schoolId, activityId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('activityId', activityId)
    const url = '/school/activity/manager/del.json'
    this.doPostRequest(url, form, cb, er)
  },
  // Long activityId
// Long schoolId

  // 活动列表
  getActivityList({ schoolId, isTeacher, listType, studentId, rowStart, rowCount }, cb, er) {
    let form = new FormData() // FormData 对象=
    form.append('schoolId', schoolId)
    if (studentId !== null && studentId !== undefined) {
      form.append('studentId', studentId)
    }
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    let url = ''
    if (isTeacher === true) {
      form.append('listType', listType)
      url = '/school/activity/teacher/list.json'
    } else {
      url = '/school/activity/list.json'
    }
    this.doPostRequest(url, form, cb, er, false)
  },
  // 活动审核列表
  getManageReviewList({schoolId, activityId, checkStatus, rowStart, rowCount}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('activityId', activityId)
    form.append('checkStatus', checkStatus)
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    const url = '/school/activity/manager/audit/list.json'
    this.doPostRequest(url, form, cb, er)
  },
  // 活动
  pushActivity({schoolId, activityId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('activityId', activityId)
    const url = '/school/activity/manager/push.json'
    this.doPostRequest(url, form, cb, er)
  },
  // // 活动详情
  // getActivityInfo({ activityId, orgId }, cb, er) {
  //   var config = { activityId, orgId }
  //   axios.get('/org/activity/info.json', { params: config })
  //     .then(function (response) {
  //       cb(response.data)
  //     })
  //     .catch(function ({response}) {
  //       er(response.data)
  //     })
  // },
  // getManageActivityInfo ({orgId, leagueId, activityId}, cb, er) {
  //   var config = {
  //     method: 'post',
  //     headers: { 'Content-Type': 'multipart/form-data' }
  //   }
  //   var form = new FormData()
  //   form.append('activityId', activityId)
  //   var url = ''
  //   if (orgId !== undefined) {
  //     form.append('orgId', orgId)
  //     url = '/org/activity/manager/info.json'
  //   } else if (leagueId !== undefined) {
  //     form.append('leagueId', leagueId)
  //     url = '/league/activity/manager/info.json'
  //   }
  //   axios.post(url, form, config)
  //     .then(function (response) {
  //       cb(response.data)
  //     })
  //     .catch(function ({response}) {
  //       er(response.data)
  //     })
  // },
  // 活动报名页信息
  getSignUpInfo({ schoolId, activityId }, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('activityId', activityId)
    const url = '/school/activity/info/linkData.json'
    this.doPostRequest(url, form, cb, er)
  },
  // 活动报名用户列表
  getSignUpUserList({ schoolId, activityId, rowStart, rowCount }, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('activityId', activityId)
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    const url = '/school/activity/user.json'
    this.doPostRequest(url, form, cb, er)
  },
  // 活动报名
  signUpActivity({ schoolId, activityId, studentId, userNum, userLinkData, signName, signPhoneNum }, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('activityId', activityId)
    form.append('userNum', userNum)
    form.append('signName', signName)
    form.append('signPhoneNum', signPhoneNum)
    if (studentId !== null && studentId !== undefined) {
      form.append('studentId', studentId)
    }
    for (var i = 0; i < userLinkData.length; i++) {
      form.append('userLinkData[' + i + '].key', userLinkData[i].key)
      form.append('userLinkData[' + i + '].value', userLinkData[i].value)
    }
    const url = '/school/activity/sign.json'
    this.doPostRequest(url, form, cb, er)
  },
  // // 获取所有用户等级
  // getVipList({ orgId }, cb, er) {
  //   var config = { orgId }
  //   axios.get('/vip/list.json', { params: config })
  //     .then(function (response) {
  //       cb(response.data)
  //     })
  //     .catch(function ({response}) {
  //       er(response.data)
  //     })
  // },
  // // 活动审核列表
  // getAuditList({ orgId, leagueId, activityId, checkStatus, rowStart, rowCount }, cb, er) {
  //   // var leagueId = this.$route.params.leagueId
  //   var config = {
  //     method: 'post',
  //     headers: { 'Content-Type': 'multipart/form-data' }
  //   }
  //   var form = new FormData()
  //   form.append('activityId', activityId)
  //   form.append('checkStatus', checkStatus)
  //   form.append('rowStart', rowStart)
  //   form.append('rowCount', rowCount)
  //   var url = ''
  //   if (orgId !== undefined) {
  //     form.append('orgId', orgId)
  //     url = '/org/activity/manager/audit/list.json'
  //   } else {
  //     form.append('leagueId', leagueId)
  //     url = '/league/activity/manager/audit/list.json'
  //   }
  //   axios.post(url, form, config)
  //     .then(function (response) {
  //       cb(response.data)
  //     })
  //     .catch(function ({response}) {
  //       er(response.data)
  //     })
  // },
  // // 活动管理列表
  // getActivityManagerList({ orgId, leagueId, activityStatus, rowStart, rowCount }, cb, er) {
  //   var config = {
  //     method: 'post',
  //     headers: { 'Content-Type': 'multipart/form-data' }
  //   }
  //   var form = new FormData()
  //   form.append('activityStatus', activityStatus)
  //   form.append('rowStart', rowStart)
  //   form.append('rowCount', rowCount)
  //   var url = ''
  //   if (leagueId !== undefined) {
  //     form.append('leagueId', leagueId)
  //     url = '/league/activity/manager/list.json'
  //   } else if (orgId !== undefined) {
  //     form.append('orgId', orgId)
  //     url = '/org/activity/manager/list.json'
  //   }
  //   axios.post(url, form, config)
  //     .then(function (response) {
  //       cb(response.data)
  //     })
  //     .catch(function ({response}) {
  //       er(response.data)
  //     })
  // },
  // 活动审核详情
  signUpUserInfo ({schoolId, activityId, activitySignId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('activityId', activityId)
    form.append('activitySignId', activitySignId)
    const url = '/school/activity/manager/audit/info.json'
    this.doPostRequest(url, form, cb, er)
  },
  // 活动审核
  reviewUser({ schoolId, activityId, activitySignId, checkStatus }, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('activityId', activityId)
    form.append('activitySignId', activitySignId)
    form.append('checkStatus', checkStatus)
    const url = '/school/activity/manager/audit.json'
    this.doPostRequest(url, form, cb, er)
  },
  // 活动核销
  activityVerification ({schoolId, activityId, verificationCode}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('activityId', activityId)
    form.append('verificationCode', verificationCode)
    const url = '/school/activity/manager/verification.json'
    this.doPostRequest(url, form, cb, er)
  },
  // 已核销列表
  getVerificationList ({schoolId, activityId, rowStart, rowCount}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('activityId', activityId)
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    const url = '/school/activity/manager/verification/list.json'
    this.doPostRequest(url, form, cb, er)
  },
  // 核销的统计数据
  activityCount ({schoolId, activityId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('activityId', activityId)
    const url = '/school/activity/manager/activity/count.json'
    this.doPostRequest(url, form, cb, er)
  },
  // 我报名的活动列表
  getMySignUpActivityList ({schoolId, studentId, rowStart, rowCount}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    if (studentId !== null && studentId !== undefined) {
      form.append('studentId', studentId)
    }
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    const url = '/school/activity/my/activity.json'
    this.doPostRequest(url, form, cb, er)
  },
  getParticipateDetail ({schoolId, studentId, activityId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('activityId', activityId)
    if (studentId !== null && studentId !== undefined) {
      form.append('studentId', studentId)
    }
    const url = '/school/activity/my/activity/info.json'
    this.doPostRequest(url, form, cb, er)
  },
  // deleteActivity({orgId, leagueId, activityId}, cb, er) {
  //   var config = {
  //     method: 'post',
  //     headers: { 'Content-Type': 'multipart/form-data' }
  //   }
  //   var form = new FormData()
  //   form.append('activityId', activityId)
  //   var url = ''
  //   if (orgId !== undefined) {
  //     form.append('orgId', orgId)
  //     url = '/org/activity/manager/del.json'
  //   } else if (leagueId !== undefined) {
  //     form.append('leagueId', leagueId)
  //     url = '/league/activity/manager/del.json'
  //   }
  //   axios.post(url, form, config)
  //     .then(function (response) {
  //       cb(response.data)
  //     })
  //     .catch(function ({response}) {
  //       er(response.data)
  //     })
  // },
  cancelSignActivity({activitySignId, studentId}, cb, er) {
    const form = new FormData()
    form.append('activitySignId', activitySignId)
    if (studentId !== null && studentId !== undefined) {
      form.append('studentId', studentId)
    }
    const url = '/school/activity/cancel/sign.json'
    this.doPostRequest(url, form, cb, er)
  },
  modifyActivity({schoolId, activityId, formList}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('activityId', activityId)
    for (var i = 0; i < formList.length; i++) {
      if (formList[i].type === 'text') {
        form.append(formList[i].code, formList[i].value)
      } else {
        form.append(formList[i].code, formList[i].value[0] + ' ' + formList[i].value[1] + ':' + formList[i].value[2])
      }
    }
    const url = '/school/activity/manager/edit.json'
    this.doPostRequest(url, form, cb, er)
  }
  // pushActivity ({orgId, leagueId, activityId}, cb, er) {
  //   var config = {
  //     method: 'post',
  //     headers: { 'Content-Type': 'multipart/form-data' }
  //   }
  //   var form = new FormData()
  //   form.append('activityId', activityId)
  //   var url = ''
  //   if (orgId !== undefined) {
  //     form.append('orgId', orgId)
  //     url = '/org/activity/manager/push.json'
  //   } else if (leagueId !== undefined) {
  //     form.append('leagueId', leagueId)
  //     url = '/league/activity/manager/push.json'
  //   }
  //   axios.post(url, form, config)
  //     .then(function (response) {
  //       cb(response.data)
  //     })
  //     .catch(function ({response}) {
  //       er(response.data)
  //     })
  // },
  // getAuditCount({orgId, leagueId, activityId}, cb, er) {
  //   var config = {
  //     method: 'post',
  //     headers: { 'Content-Type': 'multipart/form-data' }
  //   }
  //   var form = new FormData()
  //   form.append('activityId', activityId)
  //   var url = ''
  //   if (orgId !== undefined) {
  //     form.append('orgId', orgId)
  //     url = '/org/activity/manager/audit/count.json'
  //   } else if (leagueId !== undefined) {
  //     form.append('leagueId', leagueId)
  //     url = '/league/activity/manager/audit/count.json'
  //   }
  //   axios.post(url, form, config)
  //     .then(function (response) {
  //       cb(response.data)
  //     })
  //     .catch(function ({response}) {
  //       er(response.data)
  //     })
  // }
}
