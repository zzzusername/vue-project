const countRouter = Array.of(
  {
    path: 'count',
    component: resolve => require(['./page/Index'], resolve),
    children: [
      { name: 'countAction', path: 'action', component: resolve => require(['./page/Action'], resolve), meta: { title: '行为统计' } },
      { name: 'countUser', path: 'user', component: resolve => require(['./page/User'], resolve), meta: { title: '用户统计' } },
      { name: 'searchCountUser', path: 'user/:countDateType/date/:countDate', component: resolve => require(['./page/UserSearch'], resolve), meta: { title: '用户统计' } },
      { name: 'searchCountAction', path: 'action/:countDateType/date/:countDate', component: resolve => require(['./page/ActionSearch'], resolve), meta: { title: '行为统计' } }
    ]
  },
  { name: 'countUserList', path: 'count/userlist/:countDateType/date/:countDate/type/:listType', component: resolve => require(['./page/UserList'], resolve), meta: { title: '用户统计' } }
)
export default countRouter
