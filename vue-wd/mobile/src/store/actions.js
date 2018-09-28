import orgApi from '@/feature/org/api'
export const actions = {
  updateComLoading ({ commit, state }, {isLoading}) {
    commit('updateComLoadingStatus', {isLoading})
  },
  updateDataLoading ({ commit, state }, {isLoading}) {
    commit('updateDataLoadingStatus', {isLoading})
  },
  setOrgId ({ commit, state }, { orgId }) {
    commit('orgId', orgId)
  },
  saveOrgIntroduce ({ commit, state }, {orgIntroduce}) {
    const oldOrgIntroduce = state.orgInfo.orgIntroduce
    const orgId = state.orgInfo.orgId
    const masterId = state.orgInfo.masterId
    commit('orgIntroduce', orgIntroduce) // 先更改本地
    orgApi.saveOrgIntroduce({orgId, masterId, orgIntroduce},
      () => {},
      () => {
        commit('orgIntroduce', oldOrgIntroduce)
      })
  },
  saveOrgImgUrl ({ commit, state }, {orgImgUrl, data2blob}) {
    const oldOrgImgUrl = state.orgInfo.orgImgUrl
    const orgId = state.orgInfo.orgId
    const masterId = state.orgInfo.masterId
    console.log('orgImgUrl', orgImgUrl)
    commit('orgImgUrl', orgImgUrl) // 先更改本地
    orgApi.saveOrgImgUrl({orgId, masterId, data2blob},
      () => {},
      () => {
        commit('orgImgUrl', oldOrgImgUrl)
      })
  },
  saveOrgName ({ commit, state }, {orgName}) {
    const oldOrgName = state.orgInfo.orgName
    const orgId = state.orgInfo.orgId
    const masterId = state.orgInfo.masterId
    commit('orgName', orgName) // 先更改本地
    orgApi.saveOrgName({orgId, masterId, orgName},
      () => {},
      () => {
        commit('orgName', oldOrgName)
      })
  },
  getOrgInfo ({ commit, state }, { orgId }) {
    if (state.orgInfo.orgId !== orgId) {
      orgApi.getOrgInfo({ orgId }, orgInfo => {
        commit('orgInfo', orgInfo)
      })
    }
  },
  setMsg ({ commit, state }, msg) {
    commit('msg', msg)
  }
}
