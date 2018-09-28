import api from './api'
import * as types from './types'

export default {
  state: {
    orgInfoList: [],
    joinOrgList: [], // 我加入的群
    myOrgList: [], // 我创建的群
    manageList: [], // 我管理的群
    vipInfo: {}  // 当前的vipInfo
  },
  mutations: {
    [types.ORG_INFO_LIST] (state, orgInfo) {
      // 删除旧的数据
      state.orgInfoList = state.orgInfoList.filter(p => p.orgId !== orgInfo.orgId)
      state.orgInfoList.push(orgInfo)
    },
    [types.JOIN_ORG_LIST] (state, joinOrgList) { // 我加入的群
      state.joinOrgList = joinOrgList
    },
    [types.MY_ORG_LIST] (state, myOrgList) { // 我创建的群
      state.myOrgList = myOrgList
    },
    [types.MANAGER_ORG_LIST] (state, manageList) { // 我管理的群
      state.manageList = manageList
    },
    [types.VIP_INFO] (state, vipInfo) { // vip信息
      state.vipInfo = vipInfo
    }
  },
  actions: {
    [types.GET_ORG_INFO] ({ commit, state }, {orgId}) {
      var orgInfo = state.orgInfoList.find(p => p.orgId === orgId)
      if (orgInfo == null) {
        api.getOrgInfo({orgId}, rogInfo => {
          commit(types.ORG_INFO, rogInfo)
          commit(types.ORG_INFO_LIST, rogInfo)
        })
      } else {
        commit(types.ORG_INFO, orgInfo)
      }
    },
    [types.GET_JOIN_ORG_LIST] ({ commit, state }) { // 我加入的群
      api.getJoinOrgList(list => {
        commit(types.JOIN_ORG_LIST, list)
      }, er => {
      })
    },
    [types.GET_MY_ORG_LIST] ({ commit, state }) { // 我创建的群
      api.getMyOrgList(list => {
        commit(types.MY_ORG_LIST, list)
      })
    },
    [types.GET_MANAGER_ORG_LIST] ({ commit, state }) { // 我管理的群
      api.getManagerOrgList(list => {
        commit(types.MANAGER_ORG_LIST, list)
      })
    },
    [types.SET_VIP_INFO] ({ commit, state }, {orgId, vipId, vipName}) { // 我管理的群
      commit(types.VIP_INFO, {orgId, vipId, vipName})
    }
  },
  getters: {
    [types.JOIN_ORG_LIST]: state => state.joinOrgList, // 我加入的群
    [types.MY_ORG_LIST]: state => state.myOrgList, // 我创建的群
    [types.MANAGER_ORG_LIST]: state => state.manageList, // 我管理的群
    [types.VIP_INFO]: state => state.vipInfo
  }
}
