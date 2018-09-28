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
    .catch(function ({ er }) {
      if (er && er.data) {
        er(er.data)
      }
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
  // 查看公告列表
  getNoticeList ({schoolId, isTeacher, type, studentId, rowStart, rowCount}, cb, er) {
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    if (studentId !== null && studentId !== undefined) {
      form.append('studentId', studentId)
    }
    let url = ''
    if (isTeacher === true) {
      if (type) {
        form.append('type', type)
      }
      url = '/school/notice/selectNoticeListToTeacher.json'
    } else {
      url = '/school/notice/selectNoticeListToStudentAndParet.json'
    }
    this.doPostRequest(url, form, cb, er, false)
  },
  // 发布公告
  publishNotice ({schoolId, classIds, orgIds, noticeId, noticeType, noticeTitle, noticeImg, noticeBody, expireDate, noticeReadFeedback, readScope}, cb, er) {
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('noticeTitle', noticeTitle)
    if (noticeImg !== null && noticeImg !== undefined && noticeImg !== '') {
      form.append('noticeImg', noticeImg)
    }
    form.append('noticeBody', noticeBody)
    form.append('publishEndDate', expireDate)
    form.append('noticeReadFeedback', noticeReadFeedback)
    if (readScope !== undefined && readScope !== null) {
      form.append('readScope', readScope)
    }
    var url = ''
    if (noticeId !== null && noticeId !== undefined) {
      form.append('noticeId', noticeId)
      url = '/school/notice/editNotice.json'
    } else {
      form.append('noticeType', noticeType)
      if (classIds !== null && classIds !== undefined) {
        classIds.forEach((val) => {
          form.append('classIds', val)
        })
      }
      if (orgIds !== null && orgIds !== undefined) {
        orgIds.forEach((val) => {
          form.append('orgIds', val)
        })
      }
      url = '/school/notice/addNotice.json'
    }
    this.doPostRequest(url, form, cb, er)
  },
  // 删除公告
  deleteNotice ({schoolId, noticeId}, cb, er) {
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('noticeId', noticeId)
    var url = '/school/notice/deleteNotice.json'
    this.doPostRequest(url, form, cb, er)
  },
  // 查询公告信息
  getNoticeInfo ({schoolId, noticeId}, cb, er) {
    var form = new FormData()
    form.append('noticeId', noticeId)
    form.append('schoolId', schoolId)
    const url = '/school/notice/getNoticeInfo.json'
    this.doPostRequest(url, form, cb, er)
  },
  // 公告管理列表
  getNoticeManageList ({schoolId, type, rowStart, rowCount}, cb, er) {
    var form = new FormData()
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    form.append('schoolId', schoolId)
    // 公告类型 1:全校 2:老师 3:班级
    form.append('type', type)
    var url = '/school/notice/selectNoticeListToManage.json'
    this.doPostRequest(url, form, cb, er)
  },
  pushNotice ({schoolId, noticeId}, cb, er) {
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('noticeId', noticeId)
    var url = '/school/notice/pushNotice.json'
    this.doPostRequest(url, form, cb, er)
  },
  submitReadStatus({schoolId, noticeId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('noticeId', noticeId)
    this.doPostRequest('/school/notice/addNoticeRead.json', form, cb, er)
  },
  getReaderList({schoolId, noticeId, readStatus, rowStart, rowCount}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('noticeId', noticeId)
    form.append('readStatus', readStatus)
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    this.doPostRequest('/school/notice/NoticeUnreadList.json', form, cb, er)
  },
  isRead({schoolId, noticeId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('noticeId', noticeId)
    this.doPostRequest('/school/notice/IsNoticeRead.json', form, cb, er)
  },
  pushToUnReader({schoolId, noticeId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('noticeId', noticeId)
    this.doPostRequest('/school/notice/unread/pushNotice.json', form, cb, er)
  },
  getReaderNum({schoolId, noticeId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('noticeId', noticeId)
    this.doPostRequest('/school/notice/getNoticeReadCount.json', form, cb, er)
  },
  selectOneselfNoticeList({schoolId, rowStart, rowCount}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    this.doPostRequest('/school/notice/selectOneselfNoticeList.json', form, cb, er)
  },
  isNoticeJurisdiction({schoolId, noticeId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('noticeId', noticeId)
    this.doPostRequest('/school/notice/isNoticeJurisdiction.json', form, cb, er)
  }
}
