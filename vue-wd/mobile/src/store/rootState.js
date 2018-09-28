const state = {
  isLoading: false,
  loadCount: 0,
  isComLoading: false,
  comLoadCount: 0,
  isDataLoading: false,
  msg: 'init', // 初始值为空
  orgInfo: {}, // 群信息，异步从服务器获得
  isShowToast: false,
  toastType: '',
  toastTitle: '',
  toastWidth: '',
  userInfo: {},
  payInfo: {},
  isShowOrgQrcode: false,
  orgQrcode: '',
  orgName: '',
  isShowWechatQrcode: false,
  wechatQrcode: '',
  canGoBack: false,
  logoutStatus: false,
  showUserShareView: false,
  teacherFeature: [],
  eduUserInfo: {},
  personalSchoolClassInfo: {}
}
export default state
