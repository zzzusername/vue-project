const PublicRouter = Array.of(
  {
    path: '',
    component: resolve => require(['./Index.vue'], resolve),
    children: [
      {
        name: 'Welcome',
        path: 'welcome_page',
        component: resolve => require(['@/page/public/Hello'], resolve),
        meta: { title: '老师管理' }
      }
    ]
  }
)

export default PublicRouter
