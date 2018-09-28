import axios from '@/api/axios.base'
export default {
  doPost (form, url, cb, er) {
    const config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    axios.post(url, form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({ response }) {
        er(response.data)
      })
  },
  getNoticeList ({schoolId, type, rowStart, rowCount}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('type', type)
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    this.doPost(form, '/school/notice/selectNoticeListToManage.json', cb, er)
  },
  pushNotice ({schoolId, noticeId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('noticeId', noticeId)
    this.doPost(form, '/school/notice/pushNotice.json', cb, er)
  },
  deleteNotice ({schoolId, noticeId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('noticeId', noticeId)
    this.doPost(form, '/school/notice/deleteNotice.json', cb, er)
  },
  publishNotice ({schoolId, classIds, orgIds, noticeType, noticeTitle, noticeImg, noticeBody, noticeReadFeedback, publishEndDate, noticeFile}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    for (const key in classIds) {
      if (classIds.hasOwnProperty(key)) {
        const element = classIds[key]
        form.append('classIds', element)
      }
    }
    for (const key in orgIds) {
      if (orgIds.hasOwnProperty(key)) {
        const element = orgIds[key]
        form.append('orgIds', element)
      }
    }
    form.append('noticeType', noticeType)
    form.append('noticeTitle', noticeTitle)
    if (noticeImg) {
      form.append('noticeImg', noticeImg)
    }
    form.append('noticeBody', noticeBody)
    form.append('noticeReadFeedback', noticeReadFeedback)
    form.append('publishEndDate', publishEndDate)
    if (noticeFile !== undefined && noticeFile !== null) {
      form.append('noticeFile', noticeFile)
    }
    this.doPost(form, '/school/notice/addNotice.json', cb, er)
  },
  getNoticeInfo ({schoolId, noticeId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('noticeId', noticeId)
    this.doPost(form, '/school/notice/getNoticeInfo.json', cb, er)
  },
  editNotice ({schoolId, noticeId, noticeTitle, noticeImg, noticeBody, publishEndDate, noticeReadFeedback, noticeFile}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('noticeId', noticeId)
    form.append('noticeTitle', noticeTitle)
    if (noticeImg) {
      form.append('noticeImg', noticeImg)
    }
    form.append('noticeBody', noticeBody)
    form.append('publishEndDate', publishEndDate)
    form.append('noticeReadFeedback', noticeReadFeedback)
    if (noticeFile) {
      form.append('noticeFile', noticeFile)
    }
    this.doPost(form, '/school/notice/editNotice.json', cb, er)
  }
}
