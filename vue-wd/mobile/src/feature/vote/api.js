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
  // 保存
  saveVote({schoolId, voteId, classIds, orgIds, params}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    if (voteId) {
      form.append('voteId', voteId)
    }
    classIds.forEach(id => {
      form.append('classIds', id)
    })
    orgIds.forEach(id => {
      form.append('orgIds', id)
    })
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        const data = params[key]
        for (const k in data) {
          if (data.hasOwnProperty(k)) {
            const value = data[k]
            if (value !== null && value !== undefined) {
              form.append(key + '.' + k, value)
            }
          }
        }
      }
    }
    this.doPostRequest('/school/vote/save.json', form, cb, er)
  },
  // 查询投票信息
  getVoteInfo({schoolId, voteId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('voteId', voteId)
    this.doPostRequest('/school/vote/info.json', form, cb, er)
  },
  // 查询学生／家长可投票列表
  getStudentVoteList({schoolId, studentId, rowStart, rowCount}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    let url = '/school/vote/student/list.json'
    if (studentId) {
      form.append('studentId', studentId)
      url = '/school/vote/parent/list.json'
    }
    this.doPostRequest(url, form, cb, er)
  },
  // 查询教师可投票列表
  getTeacherVoteList({schoolId, rowStart, rowCount}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    this.doPostRequest('/school/vote/teacher/list.json', form, cb, er)
  },
  // 添加／修改选项
  addOrUpdateVoteItem({schoolId, voteId, itemId, params}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('voteId', voteId)
    if (itemId) {
      form.append('itemId', itemId)
    }
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        const element = params[key]
        if (element !== null && element !== undefined) {
          form.append(key, element)
        }
      }
    }
    this.doPostRequest('/school/vote/item/addOrUpdate.json', form, cb, er)
  },
  // 管理－选项列表
  getManagerVoteItemList({schoolId, voteId, rowStart, rowCount}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('voteId', voteId)
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    this.doPostRequest('/school/vote/item/manager/list.json', form, cb, er)
  },
  // 管理－选项详情
  getManagerVoteItemInfo({schoolId, voteId, itemId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('voteId', voteId)
    form.append('itemId', itemId)
    this.doPostRequest('/school/vote/item/manager/info.json', form, cb, er)
  },
  // 投票详情－选项列表
  getUserVoteItemList({schoolId, voteId, orderStr, searchStr, rowStart, rowCount}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('voteId', voteId)
    if (orderStr) {
      form.append('orderStr', orderStr)
    }
    if (searchStr !== undefined && searchStr !== null) {
      form.append('searchStr', searchStr)
    }
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    this.doPostRequest('/school/vote/item/list.json', form, cb, er)
  },
  // 投票详情－选项详情
  getUserVoteItemInfo({schoolId, voteId, itemId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('voteId', voteId)
    form.append('itemId', itemId)
    this.doPostRequest('/school/vote/item/info.json', form, cb, er)
  },
  // 管理列表
  getVoteManageList({schoolId, voteScope, rowStart, rowCount}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    // 发布范围 1:全校 2:老师 3:班级
    form.append('voteScope', voteScope)
    this.doPostRequest('/school/vote/my/list.json', form, cb, er)
  },
  // 投票：老师、家长、学生
  voteByuser({schoolId, voteId, itemId, studentId, type}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('voteId', voteId)
    form.append('itemId', itemId)
    let url
    if (type === 'teacher') {
      url = '/school/vote/item/teacher/result.json'
    } else if (type === 'student') {
      url = '/school/vote/item/student/result.json'
    } else if (type === 'parent') {
      if (studentId !== undefined && studentId !== null) {
        form.append('studentId', studentId)
      }
      url = '/school/vote/item/parent/result.json'
    } else if (type === 'weChatUser') {
      url = '/school/vote/item/user/result.json'
    }
    this.doPostRequest(url, form, cb, er)
  },
  // 报名
  voteApply ({schoolId, voteId, data}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('voteId', voteId)
    for (let item in data) {
      if (data[item] !== undefined && data[item] !== null) {
        form.append(item, data[item])
      }
    }
    this.doPostRequest('/school/vote/item/apply.json', form, cb, er)
  },
  // 管理列表
  delSchoolVote({schoolId, voteId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('voteId', voteId)
    this.doPostRequest('/school/vote/del.json', form, cb, er)
  },
  // 统计
  voteResultCount ({schoolId, voteId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('voteId', voteId)
    this.doPostRequest('/school/vote/item/result/count.json', form, cb, er)
  },
  deleteItem({schoolId, itemId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('itemId', itemId)
    this.doPostRequest('/school/vote/item/del.json', form, cb, er)
  },
  // 查询投票统计
  getVoteCountResult({schoolId, voteId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('voteId', voteId)
    this.doPostRequest('/school/vote/item/result/count.json', form, cb, er)
  },
  // 发布投票
  publishVote({schoolId, voteId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('voteId', voteId)
    this.doPostRequest('/school/vote/publish.json', form, cb, er)
  },
  // 查询报名审核
  getApplyList({schoolId, voteId, isAgree, rowStart, rowCount}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('voteId', voteId)
    if (isAgree) {
      form.append('isAgree', isAgree)
    }
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    this.doPostRequest('/school/vote/item/apply/list.json', form, cb, er)
  },
  // 报名审核
  auditApplyItem({schoolId, applyId, isPass}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('applyId', applyId)
    form.append('isPass', isPass)
    this.doPostRequest('/school/vote/item/apply/audit.json', form, cb, er)
  },
  // 我报名的投票报名详情
  applyItemInfo({schoolId, voteId, applyId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('applyId', applyId)
    form.append('voteId', voteId)
    this.doPostRequest('/school/vote/item/apply/info.json', form, cb, er)
  },
  // 修改报名的投票报名信息
  editItemApply({schoolId, applyId, data}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('applyId', applyId)
    for (let item in data) {
      if (data[item] !== undefined && data[item] !== null) {
        form.append(item, data[item])
      }
    }
    this.doPostRequest('/school/vote/item/apply/edit.json', form, cb, er)
  },
  // 我的报名列表
  getMySignUpList({schoolId, voteId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('voteId', voteId)
    this.doPostRequest('/school/vote/item/apply/my/list.json', form, cb, er)
  },
  // 报名审核详情
  getApplyAuditInfo({schoolId, applyId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('applyId', applyId)
    this.doPostRequest('/school/vote/item/apply/audit/info.json', form, cb, er)
  },
  // 发布报名结果
  publishVoteResult({schoolId, voteId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('voteId', voteId)
    this.doPostRequest('/school/vote/result/publish.json', form, cb, er)
  },
  // 报名审核详情
  deleteApplyItem({schoolId, voteId, applyId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('voteId', voteId)
    form.append('applyId', applyId)
    this.doPostRequest('/school/vote/item/apply/delete.json', form, cb, er)
  }
}
