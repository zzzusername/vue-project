const admissionRouter = Array.of(
  {
    path: 'admission',
    component: resolve => require(['./page/Index'], resolve),
    children: [
      { name: 'admissionList', path: 'list', component: resolve => require(['./page/List'], resolve), meta: { title: '招生列表' } },
      { name: 'admissionDetail', path: 'detail/:admissionId', component: resolve => require(['./page/Detail'], resolve), meta: { title: '招生简章' } },
      { name: 'admissionInviteDetail', path: 'detail/:admissionId/invite/:inviteDeputyId', component: resolve => require(['./page/Detail'], resolve), meta: { title: '招生简章' } },
      { name: 'admissionOrgManageDetail', path: 'org/:orgManagementId/detail/:admissionId', component: resolve => require(['./page/Detail'], resolve), meta: { title: '招生简章' } },
      { name: 'admissionLeagueManageDetail', path: 'league/:leagueId/detail/:admissionId', component: resolve => require(['./page/Detail'], resolve), meta: { title: '招生简章' } },
      { name: 'admissionMyDetail', path: 'my/:myOrgId/detail/:admissionId', component: resolve => require(['./page/Detail'], resolve), meta: { title: '招生简章' } },
      { name: 'admissionOrgPublish', path: 'org/:orgManagementId/publish', component: resolve => require(['./page/Publish'], resolve), meta: { title: '发布招生信息' } },
      { name: 'admissionLeaguePublish', path: 'league/:leagueId/publish', component: resolve => require(['./page/Publish'], resolve), meta: { title: '发布招生信息' } },
      { name: 'admissionOrgEdit', path: 'org/:orgManagementId/edit/:admissionId', component: resolve => require(['./page/Publish'], resolve), meta: { title: '修改招生信息' } },
      { name: 'admissionLeagueEdit', path: 'org/:leagueId/edit/:admissionId', component: resolve => require(['./page/Publish'], resolve), meta: { title: '修改招生信息' } },
      { name: 'admissionOrgManage', path: 'org/:orgManagementId/manage', component: resolve => require(['./page/Manage'], resolve), meta: { title: '招生管理' } },
      { name: 'admissionLeagueManage', path: 'league/:leagueId/manage', component: resolve => require(['./page/Manage'], resolve), meta: { title: '招生管理' } },
      { name: 'admissionOrgStuation', path: 'org/:orgManagementId/stuation/:admissionId', component: resolve => require(['./page/Stuation'], resolve), meta: { title: '招生情况' } },
      { name: 'admissionLeagueStuation', path: 'league/:leagueId/stuation/:admissionId', component: resolve => require(['./page/Stuation'], resolve), meta: { title: '招生情况' } },
      { name: 'admissionOrgCount', path: 'org/:orgManagementId/count/:admissionId/:deputyId/:userId', component: resolve => require(['./page/Count'], resolve), meta: { title: '招生统计' } },
      { name: 'admissionLeagueCount', path: 'league/:leagueId/count/:admissionId/:deputyId/:userId', component: resolve => require(['./page/Count'], resolve), meta: { title: '招生统计' } },
      // { name: 'admissionOrgStudentDetail', path: 'org/:orgManagementId/studentdetail/:admissionId/:userId', component: resolve => require(['./page/StudentDetail'], resolve), meta: { title: '招生报名详情' } },
      // { name: 'admissionLeagueStudentDetail', path: 'league/:leagueId/studentdetail/:admissionId/:userId', component: resolve => require(['./page/StudentDetail'], resolve), meta: { title: '招生报名详情' } },
      { name: 'admissionApplyInfo', path: 'apply/:admissionId', component: resolve => require(['./page/ApplyInfo'], resolve), meta: { title: '报名' } },
      { name: 'admissionInviteApplyInfo', path: 'apply/:admissionId/invite/:inviteDeputyId', component: resolve => require(['./page/ApplyInfo'], resolve), meta: { title: '报名' } },
      { name: 'admissionMyList', path: 'my_list', component: resolve => require(['./page/MyList'], resolve), meta: { title: '我参与的' } },
      { name: 'admissionAwards', path: 'awards/:admissionId', component: resolve => require(['./page/Awards'], resolve), meta: { title: '奖项' } },
      { name: 'admissionAward', path: 'my/:myOrgId/award/:admissionId', component: resolve => require(['./page/Award'], resolve), meta: { title: '我要领奖' } },
      // { name: 'admissionAward', path: 'award', component: resolve => require(['./page/Award'], resolve), meta: { title: '我要领奖' } },
      { name: 'admissionMyAwards', path: 'my_awards/:admissionId', component: resolve => require(['./page/MyAwards'], resolve), meta: { title: '已兑换奖项' } },
      { name: 'admissionShare', path: 'share/:admissionId/', component: resolve => require(['./page/Share'], resolve), meta: { title: '分享' } },
      { name: 'admissionInviteShare', path: 'share/:admissionId/invite/:inviteDeputyId', component: resolve => require(['./page/Share'], resolve), meta: { title: '分享' } },
      { name: 'admissionMyCount', path: 'org/:myOrgId/mycount/:admissionId', component: resolve => require(['./page/MyCount'], resolve), meta: { title: '招生统计' } },
      { name: 'admissionOrgAwardManage', path: 'org/:orgManagementId/audit/:admissionId', component: resolve => require(['./page/AwardManage'], resolve), meta: { title: '兑奖审核' } },
      { name: 'admissionLeagueAwardManage', path: 'league/:leagueId/audit/:admissionId', component: resolve => require(['./page/AwardManage'], resolve), meta: { title: '兑奖审核' } }
    ]
  }
)
export default admissionRouter
