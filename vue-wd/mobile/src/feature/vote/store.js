const vote = {
  // namespaced: true,
  state: {
    settings: null,
    showApply: false,
    voteInfo: null
  },
  mutations: {
    setData: (state, obj) => {
      state.settings = obj
    },
    setApplyStatus: (state, status) => {
      state.showApply = status
    },
    setVoteInfo: (state, obj) => {
      state.voteInfo = obj
    }
  },
  getters: {
    getSettings: (state) => {
      return state.settings
    },
    getApplyStatus: (state) => {
      return state.showApply
    },
    getVoteInfo: (state) => {
      return state.voteInfo
    }
  }
}
export default vote
