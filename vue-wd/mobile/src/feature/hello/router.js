const helloRouter = Array.of(
  {
    path: 'hello',
    component: resolve => require(['./page/Hello'], resolve),
    children: [
      { path: '', component: resolve => require(['./page/Home'], resolve) },
      { path: 'qrcode', component: resolve => require(['./page/TestQrcode.vue'], resolve) },
      { path: 'list', component: resolve => require(['./page/List'], resolve) },
      { path: 'list1', component: resolve => require(['./page/List.1'], resolve) },
      { path: 'list2', component: resolve => require(['./page/List.2'], resolve) },
      { path: 'edit', component: resolve => require(['./page/Edit'], resolve) }
    ],
    beforeEnter: (to, from, next) => {
      console.log('变化了')
      next()
    }
  }
)

export default helloRouter
