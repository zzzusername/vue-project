
const LeagueRouter = Array.of(
  {
    path: 'league',
    component: resolve => require(['./page/Index'], resolve),
    children: [
      { name: 'leagueIndex', path: '', component: resolve => require(['./page/MyList'], resolve) },
      { name: 'leagueMyList', path: 'list', component: resolve => require(['./page/MyList'], resolve) },
      { name: 'leagueManageList', path: 'managelist', component: resolve => require(['./page/ManageList'], resolve) },
      // 公号入口，不显示创建联盟tab
      { name: 'leagueManageList2', path: 'managelist/:showTab', component: resolve => require(['./page/ManageList'], resolve) },
      { name: 'leagueCreateLeague', path: 'create', component: resolve => require(['./page/ModifyLeague'], resolve) },
      { name: 'leagueModifyLeague', path: ':leagueId/modify', component: resolve => require(['./page/ModifyLeague'], resolve) },
      { name: 'leagueLeagueManagement', path: ':leagueId/manage', component: resolve => require(['./page/LeagueManagement'], resolve) },
      { name: 'leagueAdminList', path: ':leagueId/adminlist', component: resolve => require(['./page/AdminList'], resolve) },
      { name: 'leagueAuthManager', path: ':leagueId/auth/:leagueManagerId', component: resolve => require(['./page/AuthManager'], resolve) },
      { name: 'leagueInviteAdmin', path: ':leagueId/invite/', component: resolve => require(['./page/InviteAdmin'], resolve) },
      { name: 'leagueInviteAdminPage', path: ':leagueId/invite/:inviteId/:inviteCode', component: resolve => require(['./page/InviteAdminPage'], resolve), meta: {title: '邀请卡'} },
      { name: 'leagueMemberList', path: ':leagueId/memberlist', component: resolve => require(['./page/MemberList'], resolve) },
      { name: 'leagueInviteMemberPage', path: ':leagueId/invite/member', component: resolve => require(['./page/InviteMemberPage'], resolve), meta: {title: '邀请卡'} },
      { name: 'leagueFeatureSetting', path: ':leagueId/feature', component: resolve => require(['./page/FeatureSetting'], resolve) },
      { name: 'leagueOrgLeagueList', path: 'orgleaguelist/:leagueOrgId', component: resolve => require(['./page/OrgLeagueList'], resolve) },
      { name: 'leagueJoinLeague', path: 'join/:leagueOrgId', component: resolve => require(['./page/JoinLeague'], resolve) },
      { name: 'leagueAuthFeature', path: ':leagueId/authfeature/:leagueOrgId', component: resolve => require(['./page/AuthLeagueFeature'], resolve) },
      { name: 'leagueAuthFeatureModify', path: ':leagueId/modifyfeature/:leagueOrgId', component: resolve => require(['./page/AuthLeagueFeatureModify'], resolve) },
      { name: 'leagueAuthOrg', path: ':leagueId/authorg', component: resolve => require(['./page/AuthLeagueOrg'], resolve) },
      { name: 'leagueAuthOrgList', path: ':leagueId/invite/orglist', component: resolve => require(['./page/AuthLeagueOrgList'], resolve) }
    ]
  }
)

export default LeagueRouter
