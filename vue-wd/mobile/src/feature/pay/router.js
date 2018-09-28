
const PayRouter = Array.of(
  {
    path: '/pay',
    component: resolve => require(['./page/Index'], resolve),
    children: [
      // { name: 'payIndex', path: ':orderId', component: resolve => require(['./page/Pay'], resolve) },
      { name: 'payTest', path: 'test', component: resolve => require(['./page/Test.vue'], resolve) }
    ]
  }
)

export default PayRouter
