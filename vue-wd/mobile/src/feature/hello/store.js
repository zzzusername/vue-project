import api from './api'
import * as types from './types'

const hello = {
  state: {
    item: {},
    list: [],
    initListStatus: false,
    addStatus: ''
  },
  mutations: {
    [types.INIT_LIST_STATUS] (state) {
      state.initListStatus = true
    },
    [types.LIST] (state, { list }) {
      state.list = list
    },
    [types.ADD] (state, item) {
      state.item = item
    },
    [types.ADD_SUCCESS] (state) {
      state.addStatus = 'successful'
    },
    [types.ADD_FAILURE] (state) {
      state.addStatus = 'failed'
    }
  },
  actions: {
    [types.INIT_LIST] ({ commit, state }) {
      if (!state.initListStatus) {
        api.getAll(list => {
          commit(types.LIST, {list})
          commit(types.INIT_LIST_STATUS)
        })
      }
    },
    [types.GET_ALL] ({ commit }) {
      api.getAll(list => {
        commit(types.LIST, {list})
      })
    },
    [types.ADD] ({ commit }, item) {
      api.add(
        item,
        () => commit(types.ADD_SUCCESS),
        () => commit(types.ADD_FAILURE)
      )
    }
  },
  getters: {
    [types.LIST]: state => state.list,
    [types.ITEM]: state => state.item,
    [types.ADD_STATUS]: state => state.addStatus,
    [types.INIT_LIST_STATUS]: state => state.initListStatus
  }
}

export default hello
