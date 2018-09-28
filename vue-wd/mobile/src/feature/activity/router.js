const ActivityRouter = Array.of(
  {
    path: 'activity',
    component: resolve => require(['./page/Index'], resolve),
    children: [
      {
        path: 'list',
        name: 'educationActivityList',
        component: resolve => require(['./page/ActivityList'], resolve),
        meta: { title: '活动列表' }
      },
      {
        path: 'list/:studentId',
        name: 'educationActivityListForParents',
        component: resolve => require(['./page/ActivityList'], resolve),
        meta: { title: '活动列表' }
      },
      // 教师活动列表
      {
        path: 'teacher/list',
        name: 'educationTeacherActivityList',
        component: resolve => require(['./page/TeacherActivityList'], resolve),
        meta: { title: '活动列表' }
      },
      {
        path: 'detail/:activityId',
        name: 'educationActivityDetail',
        component: resolve => require(['./page/ActivityDetail'], resolve),
        meta: {title: '活动详情'}
      },
      {
        path: 'detail/:activityId/student/:studentId',
        name: 'educationActivityDetailForParents',
        component: resolve => require(['./page/ActivityDetail'], resolve),
        meta: {title: '活动详情'}
      },
      {
        path: 'dispatch/:activityId/type/:activityType',
        name: 'educationActivityDetailDispatch',
        component: resolve => require(['./page/DetailDispatch'], resolve),
        meta: {title: '活动详情'}
      },
      // {
      //   path: 'detail/:activityId/invite/:inviteCode',
      //   name: 'activityInvite',
      //   component: resolve => require(['./page/ActivityDetail'], resolve),
      //   meta: {title: '活动详情'}
      // },
      // // 活动详情，群管理预览
      // {
      //   path: 'org/:orgManagementId/detail/:activityId',
      //   name: 'orgActivityDetail',
      //   component: resolve => require(['./page/ActivityDetail'], resolve),
      //   meta: {title: '活动详情'}
      // },
      // // 活动详情，我参与的活动全局预览
      // {
      //   path: 'user/org/:activityOrgId/detail/:activityId',
      //   name: 'orgActivityDetailUser',
      //   component: resolve => require(['./page/ActivityDetail'], resolve),
      //   meta: {title: '活动详情'}
      // },
      // {
      //   path: 'user/org/:activityOrgId/detail/:activityId/invite/:inviteCode',
      //   name: 'orgActivityDetailUserInvite',
      //   component: resolve => require(['./page/ActivityDetail'], resolve),
      //   meta: {title: '活动详情'}
      // },
      // 活动详情，联盟管理预览
      // {
      //   path: 'league/:leagueId/detail/:activityId',
      //   name: 'leagueActivityDetail',
      //   component: resolve => require(['./page/ActivityDetail'], resolve),
      //   meta: {title: '活动详情'}
      // },
      {
        path: 'signup/:activityId',
        name: 'educationSignUpActiviy',
        component: resolve => require(['./page/SignUpActivity'], resolve),
        meta: {title: '活动报名'}
      },
      {
        path: 'signup/:activityId/student/:studentId',
        name: 'educationSignUpActiviyForParents',
        component: resolve => require(['./page/SignUpActivity'], resolve),
        meta: {title: '活动报名'}
      },
      {
        path: 'manage',
        name: 'educationActivityManage',
        component: resolve => require(['./page/ActivityManage'], resolve),
        meta: {title: '活动管理', keepAlive: true}
      },
      {
        path: 'publish_advanced_setting',
        name: 'educationActivityPublishSetting',
        component: resolve => require(['./page/PublishAdvancedSetting'], resolve),
        meta: {title: '高级设置'}
      },
      // {
      //   path: 'league/:leagueId/manage',
      //   name: 'leagueActivityManage',
      //   component: resolve => require(['./page/ActivityManage'], resolve),
      //   meta: {title: '联盟活动管理'}
      // },
      {
        path: 'review/:activityId',
        name: 'educationReviewActivity',
        component: resolve => require(['./page/ReviewActivity'], resolve),
        meta: {title: '活动报名审核'}
      },
      // {
      //   path: 'league/:leagueId/review/:activityId',
      //   name: 'leagueSignUpReview',
      //   component: resolve => require(['./page/SignUpReview'], resolve),
      //   meta: {title: '联盟活动报名审核'}
      // },
      {
        path: 'publish',
        name: 'educationPublishActivity',
        component: resolve => require(['./page/PublishActivity'], resolve),
        meta: {title: '发布活动'}
      },
      {
        path: 'modify/:activityId',
        name: 'educationModifyActivity',
        component: resolve => require(['./page/ModifyActivity'], resolve),
        meta: {title: '修改活动'}
      },

      // {
      //   path: 'league/:leagueId/publish',
      //   name: 'publishLeagueActivity',
      //   component: resolve => require(['./page/PublishActivity'], resolve),
      //   meta: {title: '发布联盟活动'}
      // },
      {
        path: 'count/:activityId',
        name: 'educationActivitySignUpCount',
        component: resolve => require(['./page/SignUpCount'], resolve),
        meta: {title: '核销统计'}
      },
      {
        path: 'sign_user_list/:activityId',
        name: 'educationActivitySignUpUserList',
        component: resolve => require(['./page/SignUpUserList'], resolve),
        meta: {meta: '已报名用户列表'}
      },
      {
        path: 'activity/:activityId/user/:activitySignId',
        name: 'educationActivityReviewInfo',
        component: resolve => require(['./page/ReviewUserInfo'], resolve),
        meta: {title: '资料审核'}
      },
      {
        path: 'my/list',
        name: 'educationMySignActivity',
        component: resolve => require(['./page/MySignActivityList'], resolve),
        meta: {title: '我参与的活动'}
      },
      {
        path: 'my/list/:studentId',
        name: 'educationMySignActivityForParents',
        component: resolve => require(['./page/MySignActivityList'], resolve),
        meta: {title: '我参与的活动'}
      },
      {
        path: 'my/detail/:activityId',
        name: 'educationActivityParticipateDetail',
        component: resolve => require(['./page/ParticipateDetail'], resolve),
        meta: {title: '活动报名详情'}
      },
      {
        path: 'my/detail/:activityId/student/:studentId',
        name: 'educationActivityParticipateDetailForParents',
        component: resolve => require(['./page/ParticipateDetail'], resolve),
        meta: {title: '活动报名详情'}
      },
      {
        path: 'manage_view_users/:activityId',
        name: 'educationActivityManageSignUsers',
        component: resolve => require(['./page/ManageSignUsers'], resolve),
        meta: {title: '活动报名用户列表'}
      }

    ]
  }

  // ParticipateDetail
)

export default ActivityRouter
