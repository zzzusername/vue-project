export default {
  updateLoadingStatus (state, status) {
    state.isLoading = status
  },
  getSchoolList (state, schoolList) {
    state.schoolList = schoolList
  },
  getInfo (state, info) {
    state.userInfo = info
  },
  isClassMaster (state, states) {
    state.isClassMaster = states
  },
  isManager (state, states) {
    state.isManager = states
  },
  studentInfo (state, states) {
    state.studentInfo = states
  }
}
