// import api from './api'
import * as types from './types'
import api from './api'

const index = {
  state: {
    featureList: []
  },
  mutations: {
    [types.FEATURE_LIST] (state, featureList) {
      state.featureList = featureList
    }
  },
  actions: {
    [types.GET_FEATURE_LIST] ({ commit, state }, {orgId}, cb, er) {
      api.getIndexFeatures({orgId}, (featureList) => {
        commit(types.FEATURE_LIST, featureList)
        cb(featureList)
      }, er)
    }
  },
  getters: {
    [types.FEATURE_LIST]: state => state.featureList
  }
}

export default index
