import axios from '@/api/axios.base'

export default {
  // 获取群成员数
  getOrgUserCount({ orgId, activityId, rowStart, rowCount }, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('orgId', orgId)
    axios.post('/stat/count.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 获取群活跃数量
  getOrgUserActiveCount({ orgId, type, date }, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('orgId', orgId)
    form.append('type', type)
    form.append('date', date)
    axios.post('/stat/activity.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 获取意见领袖数量
  getOrgUserLeaderCount({ orgId, type, date }, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('orgId', orgId)
    form.append('type', type)
    form.append('date', date)
    axios.post('/stat/leader.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 获取新增成员数量
  getOrgUserNewCount({ orgId, type, date }, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('orgId', orgId)
    form.append('type', type)
    form.append('date', date)
    axios.post('/stat/added.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 获取退群人数
  getOrgUserQuitCount({ orgId, type, date }, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('orgId', orgId)
    form.append('type', type)
    form.append('date', date)
    axios.post('/stat/quit.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 获取群活跃用户列表
  getOrgUserList({ orgId, type, date, rowStart, rowCount, apiType }, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('orgId', orgId)
    form.append('type', type)
    form.append('date', date)
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    var url = ''
    if (apiType === 'active') {
      url = '/stat/activity/list.json'
    } else if (apiType === 'leader') {
      url = '/stat/leader/list.json'
    } else if (apiType === 'new') {
      url = '/stat/added/list.json'
    } else if (apiType === 'quit') {
      url = '/stat/quit/list.json'
    }
    axios.post(url, form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 群行为统计数量
  getOrgBehaviorCount({ orgId, type, date }, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('orgId', orgId)
    form.append('type', type)
    form.append('date', date)
    axios.post('/stat/behavior/count.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  getOrgBehaviorUserList({ orgId, type, date, rowStart, rowCount, sortType }, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('orgId', orgId)
    form.append('type', type)
    form.append('date', date)
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    form.append('sortType', sortType)
    axios.post('/stat/behavior/user/list.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  getOrgBehaviorIntervalReport({ orgId, type, startDate, endDate }, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('orgId', orgId)
    form.append('type', type)
    // form.append('startDate', startDate)
    // form.append('endDate', endDate)
    axios.post('/stat/behavior/report.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  }
}
