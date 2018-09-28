import axios from '@/api/axios.base'

export default {
  // 创建联盟
  createLeague ({data, leagueLogoFile}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    if (leagueLogoFile != null) {
      form.append('leagueLogoFile', leagueLogoFile)
    }
    for (var p in data) {
      form.append(p, data[p])
    }
    axios.post('/league/add.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({response}) {
          er(response.data)
        })
  },
  // 我的联盟列表
  getLeagueList ({rowStart, rowCount}, cb, er) {
    axios.get('/league/list.json', {params: {rowStart, rowCount}})
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 我管理的联盟
  myManageLeagueList (cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    axios.post('/league/manager/league/list.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({response}) {
          er(response.data)
        })
  },
  // 获取联盟信息
  getLeagueInfo ({leagueId}, cb, er) {
    axios.get('/league/info.json', {params: {leagueId}})
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 修改联盟
  saveLeague ({data, leagueLogoFile}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    if (leagueLogoFile != null) {
      form.append('leagueLogoFile', leagueLogoFile)
    }
    for (var p in data) {
      form.append(p, data[p])
    }
    axios.post('/league/save.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({response}) {
          er(response.data)
        })
  },
  // 管理员列表
  getAdminList ({leagueId, rowStart, rowCount}, cb, er) {
    axios.get('/league/manager/list.json', {params: {leagueId, rowStart, rowCount}})
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 受邀待处理列表
  getInviteList ({leagueId}, cb, er) {
    axios.get('/league/manager/invite/list.json', {params: {leagueId}})
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  inviteApproval ({leagueId, inviteId, status}, cb, er) {
    axios.get('/league/manager/invite/approval.json', {params: {leagueId, inviteId, status}})
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 删除管理员
  delManager ({leagueId, managerId}, cb, er) {
    axios.get('/league/manager/del.json', {params: {leagueId, managerId}})
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 联盟启动的功能列表,邀请管理员中使用
  getLeagueFeatureList ({leagueId}, cb, er) {
    axios.get('/league/feature/list.json', {params: {leagueId}})
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 管理员可设置权限的功能列表，修改管理员权限中使用
  getAdminFeatureList ({leagueId, managerId}, cb, er) {
    axios.get('/league/manager/feature.json', {params: {leagueId, managerId}})
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 我的功能列表
  getMyFeatureList ({leagueId}, cb, er) {
    axios.get('/league/feature/myList.json', {params: {leagueId}})
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 设置管理员权限
  saveAuth ({leagueId, managerId, data}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('leagueId', leagueId)
    form.append('managerId', managerId)
    for (var i = 0; i < data.length; i++) {
      form.append('auth[' + i + '].featureId', data[i].featureId)
      form.append('auth[' + i + '].isExist', data[i].isExist)
    }
    axios.post('/league/manager/saveAuth.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({response}) {
          er(response.data)
        }
      )
  },
  // 邀请管理员
  createInvite ({leagueId, params}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('leagueId', leagueId)
    for (var p in params) {
      form.append('featureId', params[p])
    }
    axios.post('/league/manager/invite/create.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({response}) {
          er(response.data)
        })
  },
  // 管理员的邀请信息
  getInviteInfo ({inviteId, inviteCode}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('inviteId', inviteId)
    form.append('inviteCode', inviteCode)
    axios.post('/league/manager/invite/info.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({response}) {
          er(response.data)
        })
  },
  // 同意管理员邀请
  agreeInvite ({inviteId, inviteCode}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('inviteId', inviteId)
    form.append('inviteCode', inviteCode)
    axios.post('/league/manager/invite/agree.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({response}) {
          er(response.data)
        })
  },
  // 设置联盟功能开启状态
  saveFeature ({leagueId, featureId, isExist}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('leagueId', leagueId)
    form.append('featureId', featureId)
    form.append('isExist', isExist)
    axios.post('/league/feature/saveFeature.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({response}) {
          er(response.data)
        })
  },
// 创建成员邀请
  createMemberInvite ({leagueId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('leagueId', leagueId)
    axios.post('/league/member/invite/create.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({response}) {
          er(response.data)
        })
  },
  // 成员的邀请信息
  getMemberInviteInfo ({inviteId, inviteCode}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('inviteId', inviteId)
    form.append('inviteCode', inviteCode)
    axios.post('/league/member/invite/info.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({response}) {
          er(response.data)
        })
  },
  // 成员列表
  getMemberList ({leagueId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('leagueId', leagueId)
    axios.post('/league/member/list.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({response}) {
          er(response.data)
        })
  },
  // 待审核成员列表
  getMemberInviteList ({leagueId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('leagueId', leagueId)
    axios.post('/league/member/invite/list.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({response}) {
          er(response.data)
        })
  },
  // 删除私有联盟成员
  delMember ({leagueId, orgId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('leagueId', leagueId)
    form.append('orgId', orgId)
    axios.post('/league/member/delete.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({response}) {
          er(response.data)
        })
  },
  // 审核成员
  memberInviteApproval ({leagueId, inviteId, status}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('inviteId', inviteId)
    form.append('leagueId', leagueId)
    form.append('status', status)
    axios.post('/league/member/invite/approval.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({response}) {
          er(response.data)
        })
  },
  // 加入联盟的群
  getMyOrgListForLeagueCount (cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    axios.post('/org/getMyOrgListForLeagueCount.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({response}) {
          er(response.data)
        })
  },
  // 某个群加入的联盟列表
  getLeagueByOrgId ({orgId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('orgId', orgId)
    axios.post('/league/member/getLeagueByOrgId.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({response}) {
          er(response.data)
        })
  },
  // 加入联盟时展示联盟功能列表
  getFeatureByLeagueIdForOrgId ({orgId, leagueId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('orgId', orgId)
    form.append('leagueId', leagueId)
    axios.post('/league/feature/selectFeatureByLeagueIdForOrgId.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({response}) {
          er(response.data)
        })
  },
  // 授权功能给联盟
  applyMemberInvite ({orgId, leagueId, featureId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('orgId', orgId)
    form.append('leagueId', leagueId)
    featureId.forEach((element) => {
      form.append('featureId', element)
    })
    axios.post('/league/member/invite/apply.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({response}) {
          er(response.data)
        })
  },
  // 通过联盟id查询当前用户的联盟列表
  getMyOrgListForLeagueId ({leagueId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('leagueId', leagueId)
    axios.post('/org/getMyOrgListForLeagueId.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({response}) {
          er(response.data)
        })
  },
  // 获取当前用户的群授权给联盟的功能
  getMemberFeatureList ({leagueId, orgId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('leagueId', leagueId)
    form.append('orgId', orgId)
    axios.post('/league/member/feature.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({response}) {
          er(response.data)
        })
  },
  // 获取当前用户的群授权给联盟的功能
  saveMemberAuth ({leagueId, orgId, data}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('leagueId', leagueId)
    form.append('orgId', orgId)
    for (var i = 0; i < data.length; i++) {
      console.log('data', data[i].featureId)
      form.append('auth[' + i + '].featureId', data[i].featureId)
      form.append('auth[' + i + '].isExist', data[i].isExist)
    }
    axios.post('/league/member/saveAuth.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({response}) {
          er(response.data)
        }
      )
  },
  // 获取联盟活动分成设置
  getLeagueActivityDividendSetting ({leagueId}, cb, er) {
    axios.get('/league/activity/manager/setting/info.json', {params: {leagueId}})
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
    // 设置联盟活动分成参数
  saveLeagueActivityDividendSetting ({leagueId, dividendType, incomePercentage, maxIncome, fixedIncome}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('leagueId', leagueId)
    form.append('dividendType', dividendType)
    form.append('incomePercentage', incomePercentage)
    form.append('maxIncome', maxIncome)
    form.append('fixedIncome', fixedIncome)
    axios.post('/league/activity/manager/setting.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({response}) {
          er(response.data)
        }
      )
  }
}
