
const UserRouter = Array.of(
  {
    path: 'user',
    component: resolve => require(['./page/Home'], resolve),
    children: [
      { name: 'userIndex', path: '', component: resolve => require(['./page/Index'], resolve), meta: { title: '个人中心' } },
      { name: 'industryList', path: 'industry', component: resolve => require(['./page/IndustryList'], resolve), meta: { title: '我的校和家' } },
      // 代理商购买社群＋
      { name: 'industryListForSalesman', path: 'industry/:salesmanId', component: resolve => require(['./page/IndustryList'], resolve), meta: { title: '我的校和家' } },
      { name: 'userLoginList', path: 'userloginlist', component: resolve => require(['./page/UserIndexTest'], resolve), meta: { title: '登陆-测试' } },
      { name: 'userShareAuth', path: 'auth_share/:userBindKey', component: resolve => require(['./page/UserShareAuth'], resolve), meta: { title: '用户授权' } },
      { name: 'test1', path: 'test1', component: resolve => require(['./page/Test1'], resolve), meta: { title: '用户测试' } }
    ]
  }
)

export default UserRouter
