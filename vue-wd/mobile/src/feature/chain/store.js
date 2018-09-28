export default {
  state: {
    selectClassList: null,
    classStudents: null,
    studentHomeworkSetting: null
  },
  mutations: {
    setSelectClassList(state, list) {
      state.selectClassList = list
    },
    setClassStudents(state, obj) {
      state.classStudents = obj
    },
    setStudentHomeworkSetting(state, list) {
      state.studentHomeworkSetting = list
    }
  },
  getters: {
    getSelectClassList: state => {
      return state.selectClassList
    },
    getClassStudents: state => {
      return state.classStudents
    },
    getStudentHomeworkSetting: state => {
      return state.studentHomeworkSetting
    }
  }
}
