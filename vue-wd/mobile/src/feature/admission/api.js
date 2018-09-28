import axios from '@/api/axios.base'

export default {
  // 发布招生
  publishAdmission ({orgId, leagueId, data}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    for (var key in data) {
      if (key === 'closeDate') {
        if (data[key] !== null && data[key] !== undefined && data[key].length === 3) {
          form.append(key, data[key][0] + ' ' + data[key][1] + ':' + data[key][2])
        }
      } else if (key === 'contentType') {
        if (data[key] === true) {
          form.append(key, 'LINK')
        } else {
          form.append(key, 'CONTENT')
        }
      } else if (key === 'deputyRewards') {
        if (data[key] !== null && data[key] !== undefined) {
          for (var i = 0; i < data[key].length; i++) {
            form.append('rewards[' + i + ']', data[key][i].value)
          }
        }
      } else if (key === 'applyExt') {
        form.append(key, JSON.stringify(data[key]))
      } else if (key === 'recruitSubjects') {
        if (data[key] !== null && data[key] !== undefined) {
          for (var m = 0; m < data[key].length; m++) {
            form.append(key + '[' + m + '].subjectName', data[key][m])
          // form.append(key + '[' + m + '].subjectDesc', data[key][m].value)
          }
        }
      } else if (key === 'recruitGuideRewards') {
        if (data[key] !== null && data[key] !== undefined) {
          for (var n = 0; n < data[key].length; n++) {
            form.append(key + '[' + n + '].rewardName', data[key][n].rewardName)
            form.append(key + '[' + n + '].pointsNum', data[key][n].pointsNum)
          }
        }
      } else if (data[key] !== null) {
        form.append(key, data[key])
      }
    }
    var url = ''
    if (orgId !== undefined) {
      url = '/org/recruit/manager/add.json'
      form.append('orgId', orgId)
    } else if (leagueId !== undefined) {
      url = '/league/recruit/manager/add.json'
      form.append('leagueId', leagueId)
    }
    axios.post(url, form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  editAdmission ({orgId, leagueId, guideId, data}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('guideId', guideId)
    for (var key in data) {
      if (key === 'closeDate') {
        if (data[key] !== null && data[key] !== undefined && data[key].length === 3) {
          form.append(key, data[key][0] + ' ' + data[key][1] + ':' + data[key][2])
        }
      } else if (key === 'contentType') {
        if (data[key] === true) {
          form.append(key, 'LINK')
        } else {
          form.append(key, 'CONTENT')
        }
      } else if (key === 'deputyRewards') {
        // if (data[key] !== null && data[key] !== undefined) {
        //   for (var i = 0; i < data[key].length; i++) {
        //     form.append('rewards[' + i + ']', data[key][i].value)
        //   }
        // }
      } else if (key === 'applyExt') {
        form.append(key, JSON.stringify(data[key]))
      } else if (key === 'recruitSubjects') {
        if (data[key] !== null && data[key] !== undefined) {
          for (var m = 0; m < data[key].length; m++) {
            form.append(key + '[' + m + '].subjectName', data[key][m])
          // form.append(key + '[' + m + '].subjectDesc', data[key][m].value)
          }
        }
      } else if (key === 'recruitGuideRewards') {
        // if (data[key] !== null && data[key] !== undefined) {
        //   for (var n = 0; n < data[key].length; n++) {
        //     form.append(key + '[' + n + '].rewardName', data[key][n].rewardName)
        //     form.append(key + '[' + n + '].pointsNum', data[key][n].pointsNum)
        //   }
        // }
      } else if (data[key] !== null) {
        form.append(key, data[key])
      }
    }
    var url = ''
    if (orgId !== undefined) {
      url = '/org/recruit/manager/edit.json'
      form.append('orgId', orgId)
    } else if (leagueId !== undefined) {
      url = '/league/recruit/manager/edit.json'
      form.append('leagueId', leagueId)
    }
    axios.post(url, form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  getManagerAdmissionList ({orgId, leagueId, status, rowStart, rowCount}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('status', status)
    if (rowStart !== undefined) {
      form.append('rowStart', rowStart)
    }
    if (rowCount !== undefined) {
      form.append('rowCount', rowCount)
    }
    var url = ''
    if (orgId !== undefined) {
      url = '/org/recruit/manager/list.json'
      form.append('orgId', orgId)
    } else if (leagueId !== undefined) {
      url = '/league/recruit/manager/list.json'
      form.append('leagueId', leagueId)
    }
    axios.post(url, form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  getManagerAdmissionInfo ({orgId, leagueId, guideId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('guideId', guideId)
    var url = ''
    if (orgId !== undefined) {
      url = '/org/recruit/manager/info.json'
      form.append('orgId', orgId)
    } else if (leagueId !== undefined) {
      url = '/league/recruit/manager/info.json'
      form.append('leagueId', leagueId)
    }
    axios.post(url, form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  getAdmissionList ({orgId, rowStart, rowCount}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('orgId', orgId)
    if (rowStart !== undefined) {
      form.append('rowStart', rowStart)
    }
    if (rowCount !== undefined) {
      form.append('rowCount', rowCount)
    }
    axios.post('/org/recruit/list.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  getAdmissionInfo ({orgId, guideId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('orgId', orgId)
    form.append('guideId', guideId)
    axios.post('/org/recruit/info.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  getApplyInfo ({orgId, guideId, deputyId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('orgId', orgId)
    form.append('guideId', guideId)
    if (deputyId !== null && deputyId !== undefined) {
      form.append('deputyId', deputyId)
    }
    axios.post('/org/recruit/toAdd.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  applyAdmission ({orgId, guideId, deputyId, data}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('orgId', orgId)
    form.append('guideId', guideId)
    if (deputyId !== null && deputyId !== undefined) {
      form.append('deputyId', deputyId)
    }
    for (var key in data) {
      form.append(key, data[key])
    }
    axios.post('/org/recruit/add.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  getDeputyList ({orgId, leagueId, guideId, rowStart, rowCount}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('orgId', orgId)
    form.append('leagueId', leagueId)
    form.append('guideId', guideId)
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    var url = ''
    if (orgId !== undefined) {
      url = '/org/recruit/manager/deputy/list.json'
    } else if (leagueId !== undefined) {
      url = '/league/recruit/manager/deputy/list.json'
    }
    axios.post(url, form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  getSignUpList ({orgId, leagueId, guideId, rowStart, rowCount}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('orgId', orgId)
    form.append('leagueId', leagueId)
    form.append('guideId', guideId)
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    var url = ''
    if (orgId !== undefined) {
      url = '/org/recruit/manager/student/list.json'
    } else if (leagueId !== undefined) {
      url = '/league/recruit/manager/student/list.json'
    }
    axios.post(url, form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  getDeputySignUpList ({orgId, leagueId, guideId, deputyId, rowStart, rowCount}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('orgId', orgId)
    form.append('leagueId', leagueId)
    form.append('guideId', guideId)
    form.append('deputyId', deputyId)
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    var url = ''
    if (orgId !== undefined) {
      url = '/org/recruit/manager/repUser/list.json'
    } else if (leagueId !== undefined) {
      url = '/league/recruit/manager/repUser/list.json'
    }
    axios.post(url, form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  signDeputy ({orgId, guideId, inviteDeputyId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('orgId', orgId)
    form.append('guideId', guideId)
    if (inviteDeputyId !== undefined) {
      form.append('inviteDeputyId', inviteDeputyId)
    }
    axios.post('/org/recruit/signDeputy.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  getMyDeputy ({rowStart, rowCount}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    axios.post('/org/recruit/getMyDeputy.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  getMyApplyGuide ({rowStart, rowCount}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    axios.post('/org/recruit/getMyApplyGuide.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  getStuationInfo ({orgId, leagueId, guideId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    var url = ''
    if (orgId !== undefined) {
      url = '/org/recruit/manager/count.json'
      form.append('orgId', orgId)
    } else if (leagueId !== undefined) {
      url = '/league/recruit/manager/count.json'
      form.append('leagueId', leagueId)
    }
    form.append('guideId', guideId)
    axios.post(url, form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  getDeputySubDeputyList ({orgId, leagueId, guideId, userId, rowStart, rowCount}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('guideId', guideId)
    form.append('userId', userId)
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    var url = ''
    if (orgId !== undefined) {
      url = '/org/recruit/manager/repDeputy/list.json'
      form.append('orgId', orgId)
    } else if (leagueId !== undefined) {
      url = '/league/recruit/manager/repDeputy/list.json'
      form.append('leagueId', leagueId)
    }
    axios.post(url, form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  getExchangeList ({orgId, leagueId, guideId, deputyId, rowStart, rowCount}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('guideId', guideId)
    form.append('deputyId', deputyId)
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    var url = ''
    if (orgId !== undefined) {
      url = '/org/recruit/manager/redeem/list.json'
      form.append('orgId', orgId)
    } else if (leagueId !== undefined) {
      url = '/league/recruit/manager/redeem/list.json'
      form.append('leagueId', leagueId)
    }
    axios.post(url, form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  deputyRedeem ({orgId, guideId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('orgId', orgId)
    form.append('guideId', guideId)
    axios.post('/org/recruit/deputyRedeem.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  addRedeem ({orgId, guideId, guideRewardId, guideRewardCount, saId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('orgId', orgId)
    form.append('guideId', guideId)
    if (guideRewardId !== null && guideRewardId !== undefined) {
      form.append('guideRewardId', guideRewardId)
    }
    if (guideRewardCount !== null && guideRewardCount !== undefined) {
      form.append('guideRewardCount', guideRewardCount)
    }
    if (saId !== null && saId !== undefined) {
      form.append('saId', saId)
    }
    axios.post('/org/recruit/addRedeem.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  deleteAdmission ({orgId, leagueId, guideId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('guideId', guideId)
    var url = ''
    if (orgId !== undefined) {
      url = '/org/recruit/manager/delete.json'
      form.append('orgId', orgId)
    } else if (leagueId !== undefined) {
      url = '/league/recruit/manager/delete.json'
      form.append('leagueId', leagueId)
    }
    axios.post(url, form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  getRewards ({orgId, guideId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('orgId', orgId)
    form.append('guideId', guideId)
    axios.post('/org/recruit/guide/rewards.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  getRedeemlist ({orgId, guideId, rowStart, rowCount}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('orgId', orgId)
    form.append('guideId', guideId)
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    axios.post('/org/recruit/redeem/list.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  getDeputyInfo({orgId, leagueId, guideId, deputyId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('guideId', guideId)
    form.append('deputyId', deputyId)
    var url = ''
    if (orgId !== undefined) {
      url = '/org/recruit/manager/rep/info.json'
      form.append('orgId', orgId)
    } else if (leagueId !== undefined) {
      url = '/league/recruit/manager/rep/info.json'
      form.append('leagueId', leagueId)
    }
    axios.post(url, form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  getStudentReviewInfo ({orgId, leagueId, guideId, applyUserId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('guideId', guideId)
    form.append('applyUserId', applyUserId)
    var url = ''
    if (orgId !== undefined) {
      url = '/org/recruit/manager/apply/check.json'
      form.append('orgId', orgId)
    } else if (leagueId !== undefined) {
      url = '/league/recruit/manager/apply/check.json'
      form.append('leagueId', leagueId)
    }
    axios.post(url, form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  reviewStudent ({orgId, leagueId, guideId, applyId, auditStatus}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('guideId', guideId)
    form.append('applyId', applyId)
    form.append('auditStatus', auditStatus)
    var url = ''
    if (orgId !== undefined) {
      url = '/org/recruit/manager/apply/audit.json'
      form.append('orgId', orgId)
    } else if (leagueId !== undefined) {
      url = '/league/recruit/manager/apply/audit.json'
      form.append('leagueId', leagueId)
    }
    axios.post(url, form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  pushAdmission ({orgId, leagueId, guideId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('guideId', guideId)
    var url = ''
    if (orgId !== undefined) {
      url = '/org/recruit/manager/push.json'
      form.append('orgId', orgId)
    } else if (leagueId !== undefined) {
      url = '/league/recruit/manager/push.json'
      form.append('leagueId', leagueId)
    }
    axios.post(url, form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  getMyDeputyInfo ({orgId, guideId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('guideId', guideId)
    form.append('orgId', orgId)
    axios.post('/org/recruit/rep/info.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  getMyDeputySignUpList ({orgId, guideId, rowStart, rowCount}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('guideId', guideId)
    form.append('orgId', orgId)
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    axios.post('/org/recruit/repUser/list.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  getMyDeputySubDeputyList ({orgId, guideId, rowStart, rowCount}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('guideId', guideId)
    form.append('orgId', orgId)
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    axios.post('/org/recruit/repDeputy/list.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  getMyExchangeList ({orgId, guideId, rowStart, rowCount}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('guideId', guideId)
    form.append('orgId', orgId)
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    axios.post('/org/recruit/redeem/list.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  getAwardAuditList ({orgId, leagueId, guideId, auditStatus, rowStart, rowCount}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('guideId', guideId)
    form.append('auditStatus', auditStatus)
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    var url = ''
    if (orgId !== undefined) {
      url = '/org/recruit/manager/audit/list.json'
      form.append('orgId', orgId)
    } else if (leagueId !== undefined) {
      url = '/league/recruit/manager/audit/list.json'
      form.append('leagueId', leagueId)
    }
    axios.post(url, form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  getAwardAuditInfo ({orgId, leagueId, guideId, deputyGiveRewardId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('guideId', guideId)
    form.append('deputyGiveRewardId', deputyGiveRewardId)
    var url = ''
    if (orgId !== undefined) {
      url = '/org/recruit/manager/deputy/rewards/info.json'
      form.append('orgId', orgId)
    } else if (leagueId !== undefined) {
      url = '/league/recruit/manager/deputy/rewards/info.json'
      form.append('leagueId', leagueId)
    }
    axios.post(url, form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  auditRewards ({orgId, leagueId, guideId, deputyGiveRewardId, auditStatus, courierSn, courierName}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('guideId', guideId)
    form.append('deputyGiveRewardId', deputyGiveRewardId)
    form.append('auditStatus', auditStatus)
    if (courierSn !== null && courierSn !== undefined) {
      form.append('courierSn', courierSn)
    }
    if (courierName !== null && courierName !== undefined) {
      form.append('courierName', courierName)
    }
    var url = ''
    if (orgId !== undefined) {
      url = '/org/recruit/manager/deputy/rewards/audit.json'
      form.append('orgId', orgId)
    } else if (leagueId !== undefined) {
      url = '/league/recruit/manager/deputy/rewards/audit.json'
      form.append('leagueId', leagueId)
    }
    axios.post(url, form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  }
}
