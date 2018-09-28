import axios from '@/api/axios.base'

// const list = [
//   {'orgId': 1, 'orgName': '群1', 'orgImgUrl': 'activity/38/activityImg', 'orgLogo': '/bb'},
//   {'orgId': 2, 'orgName': '群2', 'orgImgUrl': 'activity/29/activityImg', 'orgLogo': '/bb'},
//   {'orgId': 3, 'orgName': '群3', 'orgImgUrl': 'activity/39/activityImg', 'orgLogo': '/bb'}
// ]

export default {
  getUserList ({orgId, rowStart, rowCount, userName, vipId, order, isVip, ignoreVipId, ignoreManager}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData() // FormData 对象=
    form.append('orgId', orgId)
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    if (userName !== undefined && userName !== null) {
      form.append('userName', userName)
    }
    if (vipId !== undefined) {
      form.append('vipId', vipId)
    }
    if (order !== undefined) {
      form.append('order', order)
    }
    if (isVip !== undefined) {
      form.append('isVip', isVip)
    }
    if (ignoreVipId !== undefined) {
      form.append('ignoreVipId', ignoreVipId)
    }
    if (ignoreManager !== undefined) {
      form.append('ignoreManager', ignoreManager)
    }
    axios.post('/org/user/query.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  setManager ({orgId, userId, featureId, isExist}, cb, er) {
    var config = {orgId, userId, featureId, isExist}
    axios.get('/orgManager/changeAuth.json', {params: config})
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  getManageList ({orgId}, cb, er) {
    var config = {orgId}
    axios.get('/orgManager/list.json', {params: config})
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  getRobotQr ({salesmanId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    if (salesmanId !== null && salesmanId !== undefined) {
      form.append('salesmanId', salesmanId)
    }
    axios.post('/org/getRobotQr.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  getOrgSetting ({orgId}, cb, er) {
    var config = {orgId}
    axios.get('/org/setting/query.json', {params: config})
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  saveOrgSettingData (setting, cb, er) {
    axios.get('/org/setting/saveData.json', {params: setting})
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  saveOrgSettingImg ({orgId, orgMasterQrcode, orgQrcode, mpQrcode}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData() // FormData 对象=
    form.append('orgMasterQrcode', orgMasterQrcode)
    form.append('orgQrcode', orgQrcode)
    form.append('mpQrcode', mpQrcode)
    form.append('orgId', orgId)
    axios.post('/org/setting/saveImg.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  saveOrgIntroduce ({orgId, masterId, orgIntroduce}, cb, er) {
    var config = {orgId, masterId, orgIntroduce}
    axios.get('/org/saveOrgIntroduce.json', {params: config})
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  saveOrgImgUrl ({orgId, masterId, data2blob}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData() // FormData 对象=
    form.append('file', data2blob)
    form.append('orgId', orgId)
    form.append('masterId', masterId)
    axios.post('/org/saveOrgImgUrl.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  saveOrgLogo ({orgId, masterId, data2blob}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData() // FormData 对象=
    form.append('file', data2blob)
    form.append('orgId', orgId)
    form.append('masterId', masterId)
    axios.post('/org/saveOrgLogo.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  saveOrgName ({orgId, masterId, orgName}, cb, er) {
    var config = {orgId, masterId, orgName}
    axios.get('/org/saveOrgName.json', {params: config})
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  saveOrgArea ({orgId, masterId, orgArea}, cb, er) {
    var config = {orgId, masterId, orgArea}
    axios.get('/org/saveOrgArea.json', {params: config})
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  saveOrgType ({orgId, masterId, orgType}, cb, er) {
    var config = {orgId, masterId, orgType}
    axios.get('/org/saveOrgType.json', {params: config})
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  getOrgInfo ({orgId}, cb, er) {
    var config = {orgId}
    axios.get('/org/orgInfo.json', {params: config})
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
    // setTimeout(() => cb(list.find(p => p.orgId === orgId)), 100)
  },
  // 群设置－获取等级列表
  getLevelList ({orgId}, cb, er) {
    axios.get('/orgLevel/list.json', {params: {orgId}})
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 群设置－获取等级信息
  getLevelInfo ({levelId}, cb, er) {
    var config = {levelId}
    axios.get('/orgLevel/info.json', {params: config})
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 群设置－删除等级
  delLevelInfo ({levelId}, cb, er) {
    var config = {levelId}
    axios.get('/orgLevel/del.json', {params: config})
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 群设置－保存等级信息
  saveLevelInfo (levelInfo, cb, er) {
    axios.get('/orgLevel/save.json', {params: levelInfo})
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  getJoinOrgList (cb, er) {
    var config = {}
    axios.get('/org/getJoinOrgList.json', {params: config})
      .then(function (response) {
        console.log('正常')
        cb(response.data)
      })
      .catch(function ({response}) {
        console.log('异常')
        er(response.data)
      })
  },
  getMyOrgList (cb, er) {
    var config = {}
    axios.get('/org/getMyOrgList.json', {params: config})
      .then(function (response) {
        console.log('正常')
        cb(response.data)
      })
      .catch(function ({response}) {
        console.log('异常')
        er(response.data)
      })
  },
  getManagerOrgList (cb, er) {
    var config = {}
    axios.get('/org/getManagerOrgList.json', {params: config})
      .then(function (response) {
        console.log('正常')
        cb(response.data)
      })
      .catch(function ({response}) {
        console.log('异常')
        er(response.data)
      })
  },
  getFeatures ({orgId}, cb, er) {
    var config = {orgId}
    axios.get('/feature/getFeatures.json', {params: config})
      .then(function (response) {
        console.log('正常')
        cb(response.data)
      })
      .catch(function ({response}) {
        console.log('异常')
        er(response.data)
      })
  },
  getAllFeatures ({orgId}, cb, er) {
    var config = {orgId}
    axios.get('/feature/getAllFeatures.json', {params: config})
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  getSelectAuthorize ({orgId, userId}, cb, er) {
    var config = {orgId, userId}
    axios.get('/orgManager/listByUserId.json', {params: config})
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  getVipSettingList ({orgId}, cb, er) {
    var config = {orgId}
    axios.get('/vip/set/list.json', {params: config})
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  getVipList ({orgId}, cb, er) {
    var config = {orgId}
    axios.get('/vip/list.json', {params: config})
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  saveVipInfo (config, cb, er) {
    axios.get('/vip/save.json', {params: config})
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  addVip (config, cb, er) {
    axios.get('/vip/user/save.json', {params: config})
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  deleteVip (config, cb, er) {
    axios.get('/vip/user/del.json', {params: config})
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  modifyScore ({orgId, userId, score}, cb, er) {
    axios.get('/org/score/grant.json', {params: {orgId, userId, score}})
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  saveAuth ({orgId, userId, data}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    console.log('data', data)
    var form = new FormData()
    form.append('orgId', orgId)
    form.append('userId', userId)
    for (var i = 0; i < data.length; i++) {
      form.append('auth[' + i + '].featureId', data[i].featureId)
      form.append('auth[' + i + '].isExist', data[i].isExist)
    }
    axios.post('/orgManager/saveAuth.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({response}) {
          er(response.data)
        }
      )
  },
  getUserInfo ({orgId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('orgId', orgId)
    axios.post('/org/user/my.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({response}) {
          er(response.data)
        }
      )
  },
  // 设置积分规则
  saveScore ({orgId, scoreRule, scoreType}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('orgId', orgId)
    form.append('rule[0].scoreRule', scoreRule)
    form.append('rule[0].scoreType', scoreType)
    axios.post('/org/score/set/save.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({response}) {
          er(response.data)
        }
      )
  },
  // 查询积分规则
  getScoreList ({orgId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('orgId', orgId)
    axios.post('/org/score/set/list.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({response}) {
          er(response.data)
        }
      )
  },
  // 分享获取积分
  addShareScore ({orgId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('orgId', orgId)
    axios.post('/org/score/addShareScore.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({response}) {
          er(response.data)
        }
      )
  },
  // 积分流水
  getScoreFlow ({orgId, rowStart, rowCount}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('orgId', orgId)
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    axios.post('/org/score/flow.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({response}) {
          er(response.data)
        }
      )
  },
  getKeywordList({orgId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('orgId', orgId)
    axios.post('/org/setting/keyword/query.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({response}) {
          er(response.data)
        }
      )
  },
  getSubscribeStatus({type}, cb, er) {
    var config = {type}
    axios.get('/wechat/push/isSubscribe.json', {params: config})
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  saveRobotName ({orgId, robotNickName}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('orgId', orgId)
    form.append('robotNickName', robotNickName)
    axios.post('/org/saveRobotName.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({response}) {
          er(response.data)
        }
      )
  }
  // // 访问获取积分
  // addVisitScore ({orgId}, cb, er) {
  //   var config = {
  //     method: 'post',
  //     headers: { 'Content-Type': 'multipart/form-data' }
  //   }
  //   var form = new FormData()
  //   form.append('orgId', orgId)
  //   axios.post('/org/score/addVisitScore.json', form, config)
  //       .then(function (response) {
  //         cb(response.data)
  //       })
  //       .catch(function (error) {
  //         er(error.data)
  //       }
  //     )
  // }

}
