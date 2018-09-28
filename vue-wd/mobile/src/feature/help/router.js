const HelpRouter = Array.of(
  { name: 'helpSchool', path: 'school', component: resolve => require(['./page/test'], resolve), meta: { title: '测试帮助' } }
  // { name: 'helpAgent', path: 'agent', component: resolve => require(['./page/Agent'], resolve), meta: { title: '校和家代理商火热招募中' } }
)
export default HelpRouter
