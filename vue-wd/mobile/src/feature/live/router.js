
const liveRouter = Array.of(
  {
    path: 'live',
    component: resolve => require(['./page/LiveHome'], resolve),
    meta: { title: '直播入口' },
    beforeEnter: (to, from, next) => {
      console.log('live 变化了')
      next()
    }
  },
  {
    path: 'liveRoom',
    name: 'liveRoom',
    component: resolve => require(['./page/LiveRoom'], resolve),
    meta: { title: '直播间' },
    beforeEnter: (to, from, next) => {
      console.log('live 变化了')
      next()
    }
  },
  {
    path: 'LiveInteractive',
    name: 'LiveInteractive',
    component: resolve => require(['./page/LiveInteractive'], resolve),
    meta: { title: '直播互动' },
    beforeEnter: (to, from, next) => {
      console.log('live 变化了')
      next()
    },
    children: [
      // {name: 'livechatroom', path: '', component: require('./page/LiveChatRoom')},
      {name: 'livechatroom', path: 'livechatroom', component: resolve => require(['./page/LiveChatRoom'], resolve)},
      {name: 'liveintroduce', path: 'liveintroduce', component: resolve => require(['./page/LiveIntroduce'], resolve)}
    ]
  }
)

export default liveRouter
