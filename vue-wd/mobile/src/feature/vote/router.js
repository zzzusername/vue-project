
const VoteRouter = Array.of(
  {
    path: 'vote',
    component: resolve => require(['./page/Index'], resolve),
    children: [
      { name: 'educationStudentVoteIndex', path: 'student/list', component: resolve => require(['./page/StudentVoteList'], resolve), meta: {title: '投票'} },
      { name: 'educationStudentVoteIndexForParents', path: 'student/:studentId/list', component: resolve => require(['./page/StudentVoteList'], resolve), meta: {title: '投票'} },
      { name: 'educationTeacherVoteIndex', path: 'teacher/list', component: resolve => require(['./page/TeacherVoteList'], resolve), meta: {title: '投票'} },
      { name: 'educationWordsVoteDetail', path: 'words/detail/:voteId', component: resolve => require(['./page/WordsVoteDetail.vue'], resolve), meta: {title: '投票详情'} },
      { name: 'educationPictureVoteDetail', path: 'picture/detail/:voteId', component: resolve => require(['./page/PictureVoteDetail.vue'], resolve), meta: {title: '投票详情'} },
      { name: 'educationSignUp', path: 'sign_up/:voteId/:type', component: resolve => require(['./page/SignUp.vue'], resolve), meta: {title: '投票报名'} },
      { name: 'educationSignUpEdit', path: 'sign_up/edit/:voteId/:applyId', component: resolve => require(['./page/SignUp.vue'], resolve), meta: {title: '修改报名'} },
      { name: 'educationSignUpList', path: 'sign_up_list/:voteId', component: resolve => require(['./page/SignUpList.vue'], resolve), meta: {title: '报名信息'} }, // 我的报名列表
      {
        path: '',
        component: resolve => require(['./page/PublishIndex'], resolve),
        children: [
          { name: 'educationVotePublish', path: 'publish', component: resolve => require(['./page/Publish'], resolve), meta: {title: '发布投票', keepAlive: true} },
          { name: 'educationAdvanceSetting', path: 'advance_setting', component: resolve => require(['./page/AdvanceSetting.vue'], resolve), meta: {title: '高级设置', keepAlive: true} }
        ]
      },
      {
        path: '',
        component: resolve => require(['./page/ManageIndex'], resolve),
        children: [
          { name: 'educationVoteManage', path: 'manage', component: resolve => require(['./page/Manage'], resolve), meta: {title: '投票管理', keepAlive: true} },
          { name: 'educationVoteSituation', path: 'situation/:voteId', component: resolve => require(['./page/VoteSituation.vue'], resolve), meta: {title: '投票情况'} },
          { name: 'educationVoteItemList', path: 'item_list/:voteId/type/:type', component: resolve => require(['./page/ItemList'], resolve), meta: {title: '投票项'} },
          { name: 'educationWordsVoteDetailForManage', path: 'words/detail/:voteId', component: resolve => require(['./page/WordsVoteDetail.vue'], resolve), meta: {title: '投票详情'} },
          { name: 'educationPictureVoteDetailForManage', path: 'picture/detail/:voteId', component: resolve => require(['./page/PictureVoteDetail.vue'], resolve), meta: {title: '投票详情'} },
          { name: 'educationSignUpReview', path: 'sign_up_review/:voteId', component: resolve => require(['./page/SignUpReview.vue'], resolve), meta: {title: '报名审核'} },
          { name: 'educationSignUpReviewDetail', path: 'sign_up_review/:voteId/:applyId', component: resolve => require(['./page/SignUpReviewDetail.vue'], resolve), meta: {title: '报名详情'} },
          { name: 'educationSignUpDetail', path: 'sign_up_detail/:voteId/:itemId', component: resolve => require(['./page/SignUpDetail.vue'], resolve), meta: {title: '投票详情'} },
          { name: 'educationVoteAddItem', path: 'add_item/:voteId/type/:type', component: resolve => require(['./page/AddItem'], resolve), meta: {title: '添加投票项'} },
          { name: 'educationVoteEditItem', path: 'edit_item/:voteId/type/:type/item/:itemId', component: resolve => require(['./page/AddItem'], resolve), meta: {title: '修改投票项'} },
          { name: 'educationVoteEdit', path: 'edit/:voteId', component: resolve => require(['./page/Publish'], resolve), meta: {title: '修改投票', keepAlive: true} },
          { name: 'educationSettingInfo', path: 'setting_info/:voteId', component: resolve => require(['./page/SettingInfo'], resolve), meta: {title: '查看投票设置'} },
          { name: 'educationAdvanceSettingForManage', path: 'advance_setting_for_manage', component: resolve => require(['./page/AdvanceSetting.vue'], resolve), meta: {title: '高级设置'} }
        ]
      }
    ]
  }
)

export default VoteRouter
