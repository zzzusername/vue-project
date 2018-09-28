const orgRouter = Array.of(
  {
    path: 'org/:orgManagementId/set',
    name: 'orgSet',
    component: resolve => require(['./page/OrgSetHome'], resolve),
    children: [
      { name: 'orgSetList', path: 'list', component: resolve => require(['./page/OrgSetList'], resolve), meta: { title: '群设置' } },
      { name: 'orgSetLevel', path: 'level', component: resolve => require(['./page/OrgSetLevel'], resolve), meta: { title: '积分配置' } },
      { name: 'orgSetKeyword', path: 'keyword', component: resolve => require(['./page/KeywordList'], resolve), meta: { title: '关键字' } }
    ]
  },
  {
    path: 'org/joinorglist',
    name: 'orgJoinorglist',
    component: resolve => require(['./page/JoinOrgList'], resolve),
    meta: { title: '我加入的群' }
  },
  {
    path: 'org/myorglist',
    name: 'orgMyorglist',
    component: resolve => require(['./page/MyOrgList'], resolve),
    meta: { title: '我创建的群' }
  },
  {
    path: 'org/managerorglist',
    name: 'orgManagerorglist',
    component: resolve => require(['./page/ManageOrgList'], resolve),
    meta: { title: '我管理的群' }
  },
  // 公号入口，不显示创建群tab
  {
    path: 'org/managerorglist/:showTab',
    name: 'orgManagerorglist2',
    component: resolve => require(['./page/ManageOrgList'], resolve),
    meta: { title: '我管理的群' }
  },
  {
    path: 'org/:orgManagementId/orgmanagement',
    name: 'orgManagement',
    component: resolve => require(['./page/OrgManagement'], resolve),
    meta: {title: '群管理'}
  },
  {
    path: 'org/:orgManagementId/orgusermanage',
    name: 'orgUserManage',
    component: resolve => require(['./page/OrgUserManage'], resolve),
    meta: {title: '群用户管理'}
  },
  {
    path: 'org/:orgManagementId/adminsetting',
    name: 'orgAdminSetting',
    component: resolve => require(['./page/AdminSetting'], resolve),
    meta: {title: '管理员设置'}
  },
  {
    path: 'org/:orgManagementId/addadmin',
    name: 'orgAddAdmin',
    component: resolve => require(['./page/AddAdmin'], resolve),
    meta: {title: '添加管理员'}
  },
  {
    path: 'org/:orgManagementId/vip/setting',
    name: 'orgVipSetting',
    component: resolve => require(['./page/VipSetting'], resolve),
    meta: {title: 'VIP设置'}
  },
  {
    path: 'org/:orgManagementId/vip/:vipId/userlist',
    name: 'orgVipUserList',
    component: resolve => require(['./page/VipUserList'], resolve),
    meta: {title: 'VIP用户管理'}
  },
  {
    path: 'org/:orgManagementId/vip/:vipId/addvip',
    name: 'orgVipUserAdd',
    component: resolve => require(['./page/VipUserAdd'], resolve),
    meta: {title: '添加VIP'}
  },
  {
    path: 'org/:orgManagementId/integralrules',
    name: 'orgIntegralRules',
    component: resolve => require(['./page/IntegralRules'], resolve),
    meta: {title: '积分规则设置'}
  },
  {
    path: 'org/:orgManagementId/integralrules/modify',
    name: 'orgModifyActiveIntegralRules',
    component: resolve => require(['./page/ModifyActiveIntegralRules'], resolve),
    meta: {title: '积分规则设置'}
  },
  {
    path: 'org/:orgManagementId/modifyuserintegral',
    name: 'orgModifyUserIntegral',
    component: resolve => require(['./page/ModifyUserIntegral'], resolve),
    meta: {title: '积分规则设置'}
  },
  {
    path: 'org/open',
    name: 'orgCreateNewOrg',
    component: resolve => require(['./page/CreateNewOrg'], resolve),
    meta: {title: '开通群'}
  },
  // 代理商的开通连接
  {
    path: 'org/open/:salesmanId',
    name: 'orgCreateNewOrgAgent',
    component: resolve => require(['./page/CreateNewOrg'], resolve),
    meta: {title: '开通群'}
  },
  {
    path: 'org/:orgManagementId/authorizemanage/:userId',
    name: 'orgAuthorizeManage',
    component: resolve => require(['./page/AuthorizeManage'], resolve),
    meta: {title: '授权管理'}
  },
  {
    path: 'org/mylevel',
    name: 'orgMylevel',
    component: resolve => require(['./page/MyLevel'], resolve),
    meta: {title: '我的用户等级'}
  },
  {
    path: 'org/userlist',
    name: 'orgUserList',
    component: resolve => require(['./page/OrgUserList'], resolve),
    meta: {title: '用户列表'}
  },
  {
    path: 'org/integral_rules',
    name: 'orgShowIntegralRules',
    component: resolve => require(['./page/ShowIntegralRules'], resolve),
    meta: {title: '积分规则'}
  },
  {
    path: 'org/score_flow',
    name: 'OrgScoreFlow',
    component: resolve => require(['./page/OrgScoreFlow'], resolve),
    meta: {title: '积分流水'}
  }
)

export default orgRouter

