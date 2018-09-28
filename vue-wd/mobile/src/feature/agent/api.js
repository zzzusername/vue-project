import axios from '@/api/axios.base'

export default {

  // 查询代理商身份
  agentIdentity(cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    axios.post('/agent/identity.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({ response }) {
          er(response.data)
        })
  },
  // 流水查询
  queryBillFlow ({rowStart, rowCount, startDate, endDate, dataFilter}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    if (startDate !== null && startDate !== undefined) {
      form.append('startDate', startDate)
    }
    if (endDate !== null && endDate !== undefined) {
      form.append('endDate', endDate)
    }
    if (dataFilter !== undefined && dataFilter !== null) {
      for (var key in dataFilter) {
        if (dataFilter[key] !== null && dataFilter[key] !== undefined && dataFilter[key] !== '') {
          form.append(key, dataFilter[key])
        }
      }
    }
    axios.post('/agent/flow/query.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 查询客户
  getCostomerList({salesmanId, isTemp, startDate, endDate, name, rowStart, rowCount}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    if (salesmanId !== undefined && salesmanId !== null) {
      form.append('salesmanId', salesmanId)
    }
    if (isTemp !== undefined && isTemp !== null) {
      form.append('isTemp', isTemp)
    }
    if (startDate !== undefined && startDate !== null) {
      form.append('startDate', startDate)
    }
    if (endDate !== undefined && endDate !== null) {
      form.append('endDate', endDate)
    }
    if (name !== undefined && name !== null) {
      form.append('name', name)
    }
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    axios.post('/agent/user/query.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({ response }) {
          er(response.data)
        })
  },
  // 代理商查询业务员列表
  getSalesManList(cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    axios.post('/salesman/list.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({ response }) {
          er(response.data)
        })
  },
  // 代理商增加业务员
  addSalesman({salesmanName, salesmanPhone}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('salesmanName', salesmanName)
    form.append('salesmanPhone', salesmanPhone)
    axios.post('/salesman/add.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 代理商删除业务员
  deleteSalesman({salesmanId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('salesmanId', salesmanId)
    axios.post('/salesman/delete.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 业务员详情(代理商查看)
  querySalesmanByManage({salesmanId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('salesmanId', salesmanId)
    axios.post('/salesman/InfoToAgent.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 代理商操作--业务员绑定二维码返回
  getSalesmanBindingCode({salesmanId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('salesmanId', salesmanId)
    axios.post('/salesman/getSalesmanBindingCode.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 用户绑定业务员
  addSalesmanBinding({salesmanId, bindingCode}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('salesmanId', salesmanId)
    form.append('bindingCode', bindingCode)
    axios.post('/salesman/addSalesmanBinding.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 代理商编辑业务员信息
  editSalesman({salesmanId, salesmanName, salesmanPhone}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('salesmanId', salesmanId)
    form.append('salesmanName', salesmanName)
    form.append('salesmanPhone', salesmanPhone)
    axios.post('/salesman/editSalesman.json', form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  // 产品列表
  getProductUrl(cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    axios.post('/salesman/getUrl.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({ response }) {
          er(response.data)
        })
  },
  // 查询代理商周账单
  getAgentsWeekBill({rowStart, rowCount}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    axios.post('/agent/report/query.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({ response }) {
          er(response.data)
        })
  },
  // 申请代理商
  addAgent(data, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    for (var key in data) {
      if (data[key] !== null && data[key] !== undefined) {
        form.append(key, data[key])
      }
    }
    axios.post('/agent/addAgent.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({ response }) {
          er(response.data)
        })
  },
  // 获取短信验证码
  getVerificationCode({userPhone}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    if (userPhone !== null && userPhone !== undefined) {
      form.append('userPhone', userPhone)
    }
    axios.post('/agent/apply/send.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({ response }) {
          er(response.data)
        })
  },
  // 获取代理商详情
  getAgentApplyInfo(cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    axios.post('/agent/agentApply/info.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({ response }) {
          er(response.data)
        })
  },
  // 查询业务员周账单
  getSalesmanWeekBill({salesmanId, reportDate, rowStart, rowCount}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    if (salesmanId !== undefined && salesmanId !== null) {
      form.append('salesmanId', salesmanId)
    }
    if (reportDate !== undefined && reportDate !== null) {
      form.append('reportDate', reportDate)
    }
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    axios.post('/agent/salesman/report/query.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({ response }) {
          er(response.data)
        })
  },
  // 获取代理商详情
  getAgentInfo(cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    axios.post('/agent/info.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({ response }) {
          er(response.data)
        })
  },
  // 获取社群＋产品列表
  getCommunityProductList(cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    axios.post('/agent/order/list.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({ response }) {
          er(response.data)
        })
  },
  // 手动开通社群＋
  openCommunityProduct({orderId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    form.append('orderId', orderId)
    axios.post('/agent/order/open.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({ response }) {
          er(response.data)
        })
  },
  // 用户绑定业务员
  salesmanBindUser({salesmanId}, cb, er) {
    var config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    var form = new FormData()
    if (salesmanId !== null && salesmanId !== undefined) {
      form.append('salesmanId', salesmanId)
    }
    axios.post('/salesman/user/bind.json', form, config)
        .then(function (response) {
          cb(response.data)
        })
        .catch(function ({ response }) {
          er(response.data)
        })
  }
}
