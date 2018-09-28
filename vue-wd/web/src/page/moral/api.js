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
  getClassMoralList ({schoolId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    this.doPost(form, '/school/moral/class/list.json', cb, er)
  },
  addClassMoral ({schoolId, scoreForm}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    for (const key in scoreForm) {
      if (scoreForm.hasOwnProperty(key)) {
        const obj = scoreForm[key]
        if (key !== 'items') {
          form.append(key, obj)
        } else {
          for (let index = 0; index < obj.length; index++) {
            const item = obj[index]
            form.append(key + '[' + index + '].itemName', item.itemName)
            form.append(key + '[' + index + '].itemDesc', item.itemDesc)
            form.append(key + '[' + index + '].itemStore', item.itemStore)
          }
        }
      }
    }
    this.doPost(form, '/school/moral/class/add.json', cb, er)
  },
  removeClassMoral ({schoolId, projectId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('projectId', projectId)
    this.doPost(form, '/school/moral/class/delete.json', cb, er)
  },
  getClassMoralInfo ({schoolId, projectId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('projectId', projectId)
    this.doPost(form, '/school/moral/class/info.json', cb, er)
  },
  editClassMoral ({schoolId, projectId, scoreForm}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('projectId', projectId)
    for (const key in scoreForm) {
      if (scoreForm.hasOwnProperty(key)) {
        const obj = scoreForm[key]
        if (key !== 'items') {
          form.append(key, obj)
        } else {
          for (let index = 0; index < obj.length; index++) {
            const item = obj[index]
            form.append(key + '[' + index + '].itemName', item.itemName)
            form.append(key + '[' + index + '].itemDesc', item.itemDesc)
            form.append(key + '[' + index + '].itemStore', item.itemStore)
          }
        }
      }
    }
    this.doPost(form, '/school/moral/class/edit.json', cb, er)
  },
  updateBaseOrSysScore ({schoolId, monthBaseStore, weekBonusStore}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    if (monthBaseStore) {
      form.append('monthBaseStore', monthBaseStore)
    }
    if (weekBonusStore) {
      form.append('weekBonusStore', weekBonusStore)
    }
    this.doPost(form, '/school/moral/student/setting/edit.json', cb, er)
  },
  addStudentAddScoreOption ({schoolId, scoreForm}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    for (const key in scoreForm) {
      if (scoreForm.hasOwnProperty(key)) {
        const obj = scoreForm[key]
        if (key !== 'items') {
          form.append(key, obj)
        } else {
          for (let index = 0; index < obj.length; index++) {
            const item = obj[index]
            form.append(key + '[' + index + '].itemName', item.itemName)
            form.append(key + '[' + index + '].itemStore', item.itemStore)
          }
        }
      }
    }
    this.doPost(form, '/school/moral/student/add.json', cb, er)
  },
  getStudentAddAndMinusScoreList ({schoolId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    this.doPost(form, '/school/moral/student/list.json', cb, er)
  },
  getBaseAndSysScore ({schoolId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    this.doPost(form, '/school/moral/student/setting/info.json', cb, er)
  },
  removeStudentScoreItem ({schoolId, projectId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('projectId', projectId)
    this.doPost(form, '/school/moral/student/delete.json', cb, er)
  },
  getStudentMoralScoreInfo ({schoolId, projectId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('projectId', projectId)
    this.doPost(form, '/school/moral/student/info.json', cb, er)
  },
  editStudentMoralScoreInfo ({schoolId, projectId, scoreForm}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('projectId', projectId)
    for (const key in scoreForm) {
      if (scoreForm.hasOwnProperty(key)) {
        const obj = scoreForm[key]
        if (key !== 'items') {
          form.append(key, obj)
        } else {
          for (let index = 0; index < obj.length; index++) {
            const item = obj[index]
            form.append(key + '[' + index + '].itemName', item.itemName)
            form.append(key + '[' + index + '].itemStore', item.itemStore)
          }
        }
      }
    }
    this.doPost(form, '/school/moral/student/edit.json', cb, er)
  },
  // 学生管理员查看评定学生详情
  studentAddTemplate ({schoolId, type}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    form.append('type', type)
    this.doPost(form, '/school/moral/student/addTemplate.json', cb, er)
  },
  // 学校班级模板增加
  classAddTemplate ({schoolId}, cb, er) {
    const form = new FormData()
    form.append('schoolId', schoolId)
    this.doPost(form, '/school/moral/class/addTemplate.json', cb, er)
  }
}
