import axios from '@/api/axios.base'
export default {
  // post 请求
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
  doGetRequest(url, config, cb, er) {
    axios.get(url, config)
    .then(function (response) {
      cb(response.data)
    })
    .catch(function ({response}) {
      er(response.data)
    })
  },
  // 资讯保存
  addNew({schoolId, classIds, orgIds, newsType, newsTitle, newsImage, newsUrl, newsIntro}, cb, er) {
    var form = new FormData()
    form.append('schoolId', schoolId)
    if (classIds !== undefined && classIds !== null && classIds.length > 0) {
      form.append('classIds', classIds)
    }
    if (orgIds !== undefined && orgIds !== null && orgIds.length > 0) {
      form.append('orgIds', orgIds)
    }
    form.append('newsType', newsType)
    form.append('newsTitle', newsTitle)
    if (newsImage !== null && newsImage !== undefined) {
      form.append('newsImage', newsImage)
    }
    if (newsIntro !== undefined && newsIntro !== null) {
      form.append('newsIntro', newsIntro)
    }
    form.append('newsUrl', newsUrl)
    this.doPostRequest('/school/news/addNews.json', form, cb, er)
  },
  // 获取学校资讯列表（资讯管理）
  selectNewsListToManage({schoolId, type, rowStart, rowCount}, cb, er) {
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('type', type)
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    this.doPostRequest('/school/news/selectNewsListToManage.json', form, cb, er)
  },
  // 获取学校资讯列表（教师查看）
  selectNewsListToTeacher({schoolId, isTeacher, type, rowStart, rowCount}, cb, er) {
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('type', type)
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    let url
    if (isTeacher) {
      url = '/school/news/selectNewsListToTeacher.json'
    } else {
      url = '/school/news/selectNewsListToStudentAndParet.json'
    }
    this.doPostRequest(url, form, cb, er)
  },
  // 学校资讯删除
  deleteNews({schoolId, newsId}, cb, er) {
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('newsId', newsId)
    this.doPostRequest('/school/news/deleteNews.json', form, cb, er)
  },
  // 学校资讯编辑
  editNews({schoolId, newsId, newsTitle, newsImage, newsUrl}, cb, er) {
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('newsId', newsId)
    form.append('newsTitle', newsTitle)
    if (newsImage !== undefined && newsImage !== null) {
      form.append('newsImage', newsImage)
    }
    form.append('newsUrl', newsUrl)
    this.doPostRequest('/school/news/editNews.json', form, cb, er)
  },
  // 获取学校资讯详情
  getNewsInfo({schoolId, newsId}, cb, er) {
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('newsId', newsId)
    this.doPostRequest('/school/news/getNewsInfo.json', form, cb, er)
  },
  // 获取学校资讯列表（学生与家长）
  selectNewsListToStudentAndParet({schoolId, studentId, rowStart, rowCount}, cb, er) {
    var form = new FormData()
    form.append('schoolId', schoolId)
    if (studentId !== null && studentId !== undefined) {
      form.append('studentId', studentId)
    }
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    this.doPostRequest('/school/news/selectNewsListToStudentAndParet.json', form, cb, er)
  },
  // 资讯推送
  pushNews({schoolId, newsId}, cb, er) {
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('newsId', newsId)
    this.doPostRequest('/school/news/pushNews.json', form, cb, er)
  },
  // 获取原标题、图片
  getTitle({schoolId, url}, cb, er) {
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('url', url)
    this.doPostRequest('/school/news/parsingUrl.json', form, cb, er)
  }
}
