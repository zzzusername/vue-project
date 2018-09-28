// import api from './api'
import * as types from './types'

const notice = {
  state: {
    item: {},
    list: []
  },
  mutations: {
    [types.LIST] (state, { list }) {
      state.list = list
    }
  },
  actions: {
    [types.GET_LIST] ({ commit, state }) {
      commit(types.LIST, {})
    }
  },
  getters: {
    [types.LIST]: state => state.list
  }
}

export default notice
