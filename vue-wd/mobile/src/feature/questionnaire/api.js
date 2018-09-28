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
  doPost(url, data, cb, er, isShowLoad) {
    let config = {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' },
      isShowLoad: isShowLoad !== false ? true : isShowLoad
    }
    const form = new FormData()
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const element = data[key]
        if (element !== undefined && element !== null) {
          form.append(key, element)
        }
      }
    }
    axios.post(url, form, config)
      .then(function (response) {
        cb(response.data)
      })
      .catch(function ({response}) {
        er(response.data)
      })
  },
  // 学校问答新增
  addQuestion ({schoolId, questionData, isEdit, classIds, orgIds}, cb, er) {
    var form = new FormData()
    var url
    form.append('schoolId', schoolId)
    if (classIds !== null && classIds !== undefined) {
      form.append('classIds', classIds)
    }
    if (orgIds !== null && orgIds !== undefined) {
      form.append('orgIds', orgIds)
    }
    if (isEdit === 'yes') {
      url = 'school/question/editQuestion.json'
    } else {
      url = 'school/question/addQuestion.json'
    }
    for (let key in questionData) {
      if (questionData[key] !== undefined && questionData[key] !== null) {
        form.append(key, questionData[key])
      }
    }
    this.doPostRequest(url, form, cb, er)
  },
  // 学校问答简单详情
  questionSimplenessInfo ({schoolId, questionId}, cb, er) {
    var form = new FormData()
    form.append('schoolId', schoolId)
    form.append('questionId', questionId)
    var url = 'school/question/questionSimplenessInfo.json'
    this.doPostRequest(url, form, cb, er)
  },
  // 学校问答题目新增
  addQuestionSubject ({schoolId, questionId, subjectId, subjectTitle, subjectType, maxItem, isRequired, item, type}, cb, er) {
    var form = new FormData()
    var url
    form.append('schoolId', schoolId)
    form.append('questionId', questionId)
    form.append('subjectTitle', subjectTitle)
    form.append('subjectType', subjectType)
    form.append('isRequired', isRequired)
    if (maxItem !== null && maxItem !== undefined) {
      form.append('maxItem', maxItem)
    }
    if (subjectId !== null && subjectId !== undefined) {
      form.append('subjectId', subjectId)
    }
    if (item.length > 0 && item !== null && item !== undefined) {
      for (let index = 0; index < item.length; index++) {
        let element = item[index]
        if (element.itemNo !== undefined && element.itemNo !== null && element.itemNo !== '') {
          form.append('item[' + index + '].itemNo', element.itemNo)
        }
        if (element.itemDesc !== undefined && element.itemDesc !== null && element.itemDesc !== '') {
          form.append('item[' + index + '].itemDesc', element.itemDesc)
        }
        if (element.isFill !== undefined && element.isFill !== null && element.isFill !== '') {
          form.append('item[' + index + '].isFill', element.isFill)
        }
      }
    }
    if (type === 'save') {
      url = 'school/question/addQuestionSubject.json'
    } else {
      url = 'school/question/editQuestionSubject.json'
    }
    this.doPostRequest(url, form, cb, er)
  },
  // 学校问答题目列表（问答管理）
  selectQuestionSubjecListToManage({schoolId, questionId, rowStart, rowCount}, cb, er) {
    var form = new FormData()
    var url = 'school/question/selectQuestionSubjecListToManage.json'
    form.append('schoolId', schoolId)
    form.append('questionId', questionId)
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    this.doPostRequest(url, form, cb, er)
  },
  // 学校问答发布
  publishQuestion({schoolId, questionId}, cb, er) {
    var form = new FormData()
    var url = 'school/question/publishQuestion.json'
    form.append('schoolId', schoolId)
    form.append('questionId', questionId)
    this.doPostRequest(url, form, cb, er)
  },
  // 学校问答题目删除
  deleteQuestionSubject ({schoolId, questionId, subjectId}, cb, er) {
    var form = new FormData()
    var url = 'school/question/deleteQuestionSubject.json'
    form.append('schoolId', schoolId)
    form.append('questionId', questionId)
    form.append('subjectId', subjectId)
    this.doPostRequest(url, form, cb, er)
  },
  // 学校问答题目详情
  questionSubjectInfo ({schoolId, questionId, subjectId}, cb, er) {
    var form = new FormData()
    var url = 'school/question/questionSubjectInfo.json'
    form.append('schoolId', schoolId)
    form.append('questionId', questionId)
    form.append('subjectId', subjectId)
    this.doPostRequest(url, form, cb, er)
  },
  // 获取问卷管理列表
  getQuestionnaireManageList({schoolId, type, rowStart, rowCount}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('type', type)
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    const url = 'school/question/selectQuestionListToManage.json'
    this.doPostRequest(url, form, cb, er)
  },
  // 教师获取问卷列表
  getTeacherQuestionnaireList({schoolId, type, rowStart, rowCount}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('type', type)
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    const url = 'school/question/selectQuestionListToTeacher.json'
    this.doPostRequest(url, form, cb, er)
  },
  // 学生/家长获取问卷列表
  getStudentOrParentQuestionnaireList({schoolId, studentId, rowStart, rowCount}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    if (studentId !== undefined && studentId !== null) {
      form.append('studentId', studentId)
    }
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    const url = 'school/question/selectQuestionListToStudentAndParet.json'
    this.doPostRequest(url, form, cb, er)
  },
  // 获取问卷详情
  getQuestionaireInfo({schoolId, studentId, questionId}, cb, er) {
    let url = 'school/question/questionInfo.json'
    this.doPost(url, arguments[0], cb, er)
  },
  // 学校问答题目顺序修改
  orderQuestionSubject ({schoolId, questionId, subjectIds}, cb, er) {
    var form = new FormData()
    var url = 'school/question/orderQuestionSubject.json'
    form.append('schoolId', schoolId)
    form.append('questionId', questionId)
    form.append('subjectIds', subjectIds)
    this.doPostRequest(url, form, cb, er)
  },
  // 学校问答删除
  deleteQuestion ({schoolId, questionId}, cb, er) {
    var form = new FormData()
    var url = 'school/question/deleteQuestion.json'
    form.append('schoolId', schoolId)
    form.append('questionId', questionId)
    this.doPostRequest(url, form, cb, er)
  },
  // 学校问答推送
  pushQuestion ({schoolId, questionId}, cb, er) {
    let form = new FormData()
    let url = 'school/question/pushQuestion.json'
    form.append('schoolId', schoolId)
    form.append('questionId', questionId)
    this.doPostRequest(url, form, cb, er)
  },
  // 提交答卷
  submitQuestionnaire({schoolId, questionId, studentId, items}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('questionId', questionId)
    if (studentId !== undefined && studentId !== null) {
      form.append('studentId', studentId)
    }
    for (let index = 0; index < items.length; index++) {
      const element = items[index]
      form.append('items[' + index + '].subjectId', element.subjectId)
      if (element.valueItemId) {
        form.append('items[' + index + '].valueItemId', element.valueItemId)
      }
      if (element.valueDesc) {
        form.append('items[' + index + '].valueDesc', element.valueDesc)
      }
      if (element.valueScore) {
        form.append('items[' + index + '].valueScore', element.valueScore)
      }
      if (element.valueItemDesc) {
        form.append('items[' + index + '].valueItemDesc', element.valueItemDesc)
      }
    }
    let url = 'school/question/addUserInfo.json'
    this.doPostRequest(url, form, cb, er)
  },
  // 查看结果
  queryResult ({schoolId, questionId}, cb, er) {
    var form = new FormData()
    var url = '/school/question/result.json'
    form.append('schoolId', schoolId)
    form.append('questionId', questionId)
    this.doPostRequest(url, form, cb, er)
  },
  // 参与用户列表
  actorUserList ({schoolId, questionId, filterData, rowStart, rowCount}, cb, er) {
    var form = new FormData()
    var url
    form.append('schoolId', schoolId)
    form.append('questionId', questionId)
    if (filterData !== undefined && filterData !== null) {
      if (filterData.type === 'alone') {
        delete filterData.type
        url = '/school/question/actorUser/list.json'
        for (let key in filterData) {
          if (filterData[key] !== undefined && filterData[key] !== null) {
            form.append(key, filterData[key])
          }
        }
      } else if (filterData.type === 'much') {
        delete filterData.type
        url = '/school/question/result/multiple/actorUser/list.json'
        for (let key in filterData) {
          if (filterData[key] !== undefined && filterData[key] !== null) {
            form.append(key, filterData[key])
          }
        }
      }
    } else {
      url = '/school/question/actorUser/list.json'
    }
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    this.doPostRequest(url, form, cb, er)
  },
  // 单项结果统计
  single ({schoolId, questionId, subjectId}, cb, er) {
    var form = new FormData()
    var url = '/school/question/result/single.json'
    form.append('schoolId', schoolId)
    form.append('questionId', questionId)
    if (subjectId !== null && subjectId !== undefined) {
      form.append('subjectId', subjectId)
    }
    this.doPostRequest(url, form, cb, er)
  },
  //  单项统计填空－参与用户列表
  singleText ({schoolId, questionId, subjectId, rowStart, rowCount}, cb, er) {
    var form = new FormData()
    var url = '/school/question/result/single/text.json'
    form.append('schoolId', schoolId)
    form.append('questionId', questionId)
    form.append('subjectId', subjectId)
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    this.doPostRequest(url, form, cb, er)
  },
  // 交叉统计
  crossStatisticsResult({schoolId, questionId, subjectIdOne, subjectIdTwo, subjectIdThree}, cb, er) {
    const url = '/school/question/result/multiple.json'
    this.doPost(url, arguments[0], cb, er)
  },
  // 答卷详情
  getAnswerDetail({schoolId, studentId, questionId}, cb, er) {
    const url = 'school/question/questionAnswerInfo.json'
    this.doPost(url, arguments[0], cb, er)
  },
  // 统计查看详情
  getCountAnswerDetail({schoolId, questionId, answerId}, cb, er) {
    const url = '/school/question/actorUser/info.json'
    this.doPost(url, arguments[0], cb, er)
  },
  // 我参与的学校问答列表
  selectQuestionListToJoin ({schoolId, studentId, rowStart, rowCount}, cb, er) {
    let form = new FormData()
    let url = 'school/question/selectQuestionListToJoin.json'
    form.append('schoolId', schoolId)
    if (studentId !== null && studentId !== undefined) {
      form.append('studentId', studentId)
    }
    form.append('rowStart', rowStart)
    form.append('rowCount', rowCount)
    this.doPostRequest(url, form, cb, er)
  }
}
