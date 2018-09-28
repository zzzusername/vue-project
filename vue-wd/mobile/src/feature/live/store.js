export default {
  state: {
    liveChatRoomHeight: 0
  },
  mutations: {
    setLiveChatRoomHeight (state, val) {
      state.liveChatRoomHeight = val
    }
  },
  getters: {
    getLiveChatRoomHeight: state => {
      return state.liveChatRoomHeight
    }
  }
}
