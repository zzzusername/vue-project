const SignInRouter = Array.of(
  {
    path: 'signin',
    component: resolve => require(['./page/Index'], resolve),
    children: [
      { name: 'signInIndex', path: '', component: resolve => require(['./page/Home'], resolve), meta: { title: '签到' } },
      { path: 'home', name: 'signInHome', component: resolve => require(['./page/Home'], resolve), meta: { title: '签到' } },
      { path: ':orgManagementId/managment', name: 'signInManagment', component: resolve => require(['./page/SignInManagment'], resolve), meta: { title: '签到管理' } },
      { path: ':orgManagementId/user_group', name: 'signInUserGroup', component: resolve => require(['./page/UserGroup'], resolve), meta: { title: '允许签到用户组' } },
      { path: ':orgManagementId/points_multiple', name: 'signPointsMultiple', component: resolve => require(['./page/PointsMultiple'], resolve), meta: { title: '积分倍数设置' } },
      { path: ':orgManagementId/extra_points', name: 'signExtraPoints', component: resolve => require(['./page/ExtraPoints'], resolve), meta: { title: '额外积分设置' } },
      { path: ':orgManagementId/continues_points', name: 'signContinuesPoints', component: resolve => require(['./page/ContinuesPoints'], resolve), meta: { title: '连续签到设置' } },
      { path: ':orgManagementId/set_base_points', name: 'signSetBasePoints', component: resolve => require(['./page/SetBasePoints'], resolve), meta: { title: '签到奖励积分' } },
      { path: 'setinfo', name: 'SignSetInfo', component: resolve => require(['./page/SignSetInfo'], resolve), meta: { title: '签到规则' } }
    ]
  }
)
export default SignInRouter
