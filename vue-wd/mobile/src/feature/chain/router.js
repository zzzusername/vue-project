
const ChainRouter = Array.of(
  {
    path: 'chain',
    component: resolve => require(['./page/Index'], resolve),
    children: [
      { name: 'educationChainList', path: 'list', component: resolve => require(['./page/ChainListTeacher.vue'], resolve), meta: {title: '接龙列表'} },
      { name: 'educationChainListStudent', path: 'student/list', component: resolve => require(['./page/ChainList.vue'], resolve), meta: {title: '接龙列表'} },
      { name: 'educationChainListParent', path: 'list/:studentId', component: resolve => require(['./page/ChainList.vue'], resolve), meta: {title: '接龙列表'} },
      {
        path: '/',
        component: resolve => require(['./page/PublishIndex'], resolve),
        children: [
          { name: 'educationChainPublish', path: 'publish', component: resolve => require(['./page/PublishChain.vue'], resolve), meta: {title: '发布接龙', keepAlive: true} },
          { name: 'educationChainAdvanced', path: 'advanced', component: resolve => require(['./page/ChainAdvanced.vue'], resolve), meta: {title: '接龙高级设置', keepAlive: true} },
          { name: 'educationChangeChain', path: 'change/:chainId', component: resolve => require(['./page/ChangeChain.vue'], resolve), meta: {title: '修改接龙', keepAlive: true} }
        ]
      },
      { name: 'educationModifyChain', path: 'modify/:chainId', component: resolve => require(['./page/PublishChain.vue'], resolve), meta: {title: '修改接龙'} },
      { name: 'educationChainDetail', path: 'detail/:chainId', component: resolve => require(['./page/ChainDetail.vue'], resolve), meta: {title: '接龙详情'} },
      { name: 'educationChainHistory', path: 'history', component: resolve => require(['./page/ChainHistory.vue'], resolve), meta: {title: '接龙任务'} }
    ]
  }
)

export default ChainRouter
