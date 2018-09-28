// import default from "vux/src/plugins/close-dialogs";

// var defaultState = {
//   activityList: [
//     {
//       name: '活动标题',
//       type: 'text',
//       value: '',
//       code: 'activityName',
//       inputType: 'text',
//       required: true
//     },
//     {
//       name: '封面大图',
//       type: 'img',
//       value: {imgData: null, binaryData: null},
//       code: 'activityImg',
//       required: true
//     },
//     {
//       name: '活动地点',
//       type: 'text',
//       value: '',
//       code: 'activityAddress',
//       inputType: 'text',
//       required: true
//     },
//     {
//       name: '活动人数',
//       type: 'text',
//       value: '',
//       code: 'activityMaxNum',
//       inputType: 'number',
//       required: true
//     },
//     {
//       name: '活动开始',
//       type: 'date',
//       value: [],
//       code: 'startDate',
//       required: true
//     },
//     {
//       name: '活动结束',
//       type: 'date',
//       value: [],
//       code: 'endDate',
//       required: true
//     },
//     {
//       name: '支付积分',
//       type: 'text',
//       value: '',
//       code: 'activityPointCost',
//       inputType: 'number',
//       required: false
//     },
//     {
//       name: '活动联系人',
//       type: 'text',
//       value: '',
//       code: 'activityLinkName',
//       inputType: 'text',
//       required: false
//     },
//     {
//       name: '联系电话',
//       type: 'text',
//       value: '',
//       code: 'activityLinkPhone',
//       inputType: 'tel',
//       required: false
//     },
//     {
//       name: '联系人微信',
//       type: 'text',
//       value: '',
//       code: 'activityLinkWechatId',
//       inputType: 'text',
//       required: false
//     },
//     {
//       name: '报名人数',
//       type: 'text',
//       value: '',
//       code: 'userMaxSignNum',
//       inputType: 'number',
//       required: true
//     },
//     {
//       name: '报名开始',
//       type: 'date',
//       value: [],
//       code: 'signStartDate',
//       required: true
//     },
//     {
//       name: '报名结束',
//       type: 'date',
//       value: [],
//       code: 'signEndDate',
//       required: true
//     },
//     {
//       name: '只允许群成员报名',
//       type: 'switch',
//       value: false,
//       code: 'isOrgSign',
//       required: false
//     },
//     {
//       name: '联系资料',
//       type: 'router',
//       skip: {name: 'activityContactInfo'},
//       value: [{key: '姓名', value: ''}, {key: '手机号', value: ''}],
//       code: 'userLinkData',
//       required: false
//     },
//     {
//       name: '报名设置',
//       type: 'router',
//       skip: {name: 'activitySignUpSetting'},
//       value: {isCheck: false, isVerificationCode: false},
//       code: 'signUpSetting',
//       required: false
//     },
//     {
//       name: '报名费用',
//       type: 'router',
//       skip: {name: 'activitySignUpCost'},
//       value: '',
//       code: 'signCosts',
//       required: true
//     },
//     {
//       name: '邀请奖励',
//       type: 'router',
//       skip: {name: 'activityInviteSignUpReward'},
//       value: '',
//       code: 'invitationSignPoints',
//       required: false
//     },
//     {
//       name: '关于支付',
//       type: 'textarea',
//       value: '',
//       code: 'aboutPay',
//       rows: 2,
//       required: false
//     },
//     {
//       name: '关于退款',
//       type: 'textarea',
//       value: '',
//       code: 'aboutRefund',
//       rows: 2,
//       required: false
//     },
//     {
//       name: '关于费用',
//       type: 'textarea',
//       value: '',
//       code: 'aboutCost',
//       rows: 2,
//       required: false
//     },
//     {
//       name: '活动说明',
//       type: 'textarea',
//       value: '',
//       code: 'activityDetailsText',
//       rows: 5,
//       required: true
//     },
//     {
//       name: '活动图片',
//       type: 'imgs',
//       value: [],
//       code: 'activityDetailsImg',
//       required: false
//     }
//   ],
//   userLinkData: [{key: '姓名', value: ''}, {key: '手机号', value: ''}], // 联系资料选项
//   signUpSetting: [], // 报名设置
//   costList: [], // 报名费用
//   rewardList: []
// }
// export default {
//   state: JSON.parse(JSON.stringify(defaultState)),
//   mutations: {
//     changeActivityValue (state, data) {
//       console.log('changeActivityValue', data)
//       state.activityList[data.index].value = data.value
//     },
//     saveContactInfo (state, data) {
//       state.userLinkData.push(data)
//     },
//     removeContactInfo (state, index) {
//       state.userLinkData.splice(index, 1)
//     },
//     insertContactInfo (state, data) {
//       state.userLinkData.splice(data.index, 1, data.value)
//     },
//     addSignUpSetting (state, data) {
//       state.signUpSetting = data
//     },
//     addCostList (state, data) {
//       state.costList.push(data)
//     },
//     removeCostList (state, index) {
//       state.costList.splice(index, 1)
//     },
//     insertCostList (state, data) {
//       state.costList.splice(data.index, 1, data.value)
//     },
//     addRewardList (state, data) {
//       state.rewardList.push(data)
//     },
//     removeRewardList (state, index) {
//       state.rewardList.splice(index, 1)
//     },
//     insertRewardList (state, data) {
//       state.rewardList.splice(data.index, 0, data.value)
//     },
//     initActivityState (state, data) {
//       var _defaultState = JSON.parse(JSON.stringify(defaultState))
//       state.activityList = _defaultState.activityList
//       state.userLinkData = _defaultState.userLinkData
//       state.signUpSetting = _defaultState.signUpSetting
//       state.costList = _defaultState.costList
//       state.rewardList = _defaultState.rewardList
//     }
//   },
//   getters: {
//     getActivityList: state => {
//       console.log(state)
//       return state.activityList
//     },
//     getUserLinkData: state => {
//       return state.userLinkData
//     },
//     getSignUpSetting: state => {
//       return state.signUpSetting
//     },
//     getCostList: state => {
//       return state.costList
//     },
//     getRewardList: state => {
//       return state.rewardList
//     }
//   }
// }
export default {
  state: {
    publishAdvanceSettings: null,
    publishInfo: null,
    cover: null,
    detailImgs: null
  },
  mutations: {
    setAdvanceSettings(state, obj) {
      state.publishAdvanceSettings = obj
    },
    setPublishInfo(state, obj) {
      state.publishInfo = obj
    },
    setPublsihCover(state, obj) {
      state.cover = obj
    },
    setPublishDetailImgs(state, obj) {
      state.detailImgs = obj
    }
  },
  getters: {
    getAdvanceSettings: state => {
      return state.publishAdvanceSettings
    },
    getPublishInfo: state => {
      return state.publishInfo
    },
    getPublishCover: state => {
      return state.cover
    },
    getPublishDetailImgs: state => {
      return state.detailImgs
    }
  }

}
