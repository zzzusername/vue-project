export const mutations = {
  updateComLoadingStatus (state, {isLoading}) {
    if (isLoading) {
      state.comLoadCount++
    } else {
      state.comLoadCount--
    }
    if (state.comLoadCount === 0) {
      state.isComLoading = false
    } else {
      state.isComLoading = true
    }
    state.isLoading = state.isComLoading || state.isDataLoading
  },
  updateDataLoadingStatus (state, {isLoading}) {
    if (isLoading) {
      state.loadCount++
    } else {
      state.loadCount--
    }
    if (state.loadCount === 0) {
      state.isDataLoading = false
    } else {
      state.isDataLoading = true
    }
    state.isLoading = state.isComLoading || state.isDataLoading
  },
  orgId (state, orgId) {
    state.orgId = orgId
  },
  orgInfo (state, orgInfo) {
    state.orgInfo = orgInfo
  },
  orgImgUrl (state, orgImgUrl) {
    state.orgInfo.orgImgUrl = orgImgUrl
  },
  orgIntroduce (state, orgIntroduce) {
    state.orgInfo.orgIntroduce = orgIntroduce
  },
  orgName (state, orgName) {
    state.orgInfo.orgName = orgName
  },
  msg (state, msg) {
    state.orgId = msg
  },
  showToast (state, {isShowToast, toastTitle, toastType, toastWidth}) {
    state.isShowToast = isShowToast
    state.toastTitle = toastTitle
    state.toastType = toastType
    state.toastWidth = toastWidth
  },
  updateUserInfo (state, userInfo) {
    state.userInfo = userInfo
  },
  updatePayInfo (state, payInfo) {
    state.payInfo = payInfo
  },
  updateOrgQrcode(state, {isShowOrgQrcode, orgQrcode, orgName}) {
    state.isShowOrgQrcode = isShowOrgQrcode
    state.orgQrcode = orgQrcode
    state.orgName = orgName
  },
  updateWechatQrcode(state, {isShowWechatQrcode, wechatQrcode}) {
    state.isShowWechatQrcode = isShowWechatQrcode
    state.wechatQrcode = wechatQrcode
  },
  updateCanGoBack(state, {canGoBack}) {
    state.canGoBack = canGoBack
  },
  updateLogoutStatus(state, {logoutStatus}) {
    state.logoutStatus = logoutStatus
  },
  updateShowUserShareView(state, {showUserShareView}) {
    state.showUserShareView = showUserShareView
  },
  updateTeacherFeature (state, teacherFeature) {
    state.teacherFeature = teacherFeature
  },
  updateEduUserInfo (state, eduUserInfo) {
    state.eduUserInfo = eduUserInfo
  },
  updatePersonalSchoolClassInfo (state, personalSchoolClassInfo) {
    state.personalSchoolClassInfo = personalSchoolClassInfo
  }
}
