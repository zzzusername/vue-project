import api from './api'
import * as types from './types'

const nonpay = {
  state: {
    chatRoomInfo: {},
    errCode: '0'
  },
  mutations: {
    [types.CHAT_ROOM_INFO] (state, chatRoomInfo) {
      state.chatRoomInfo = chatRoomInfo
    },
    [types.GET_CHAT_ROOM_ERROR] (state, errCode) {
      state.errCode = errCode
    }
  },
  actions: {
    [types.GET_CHAT_ROOM_INFO] ({ commit, state }, { randomId, cb, er }) {
      api.getOpenorg({ randomId }, chatRoomInfo => {
        commit(types.CHAT_ROOM_INFO, chatRoomInfo)
        cb()
      }, er)
    }
  },
  getters: {
    [types.CHAT_ROOM_INFO]: state => state.chatRoomInfo,
    [types.GET_CHAT_ROOM_ERROR]: state => state.errCode
  }
}

export default nonpay
