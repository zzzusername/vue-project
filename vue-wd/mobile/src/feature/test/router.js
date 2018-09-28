const orgRouter = Array.of(
  {
    path: 'test',
    name: 'test',
    component: resolve => require(['./page/Home'], resolve),
    children: [
      { name: 'testOrgSetting', path: 'orgsetting', component: resolve => require(['./page/TestOrgSetting'], resolve), meta: { title: '测试群配置' } },
      { name: 'testGetRobotQr', path: 'getrobotqr', component: resolve => require(['./page/TestGetRobotQr'], resolve), meta: { title: '测试获取群二维码' } }
    ]
  }
)

export default orgRouter
