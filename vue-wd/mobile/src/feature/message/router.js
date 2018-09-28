
const MessageRouter = Array.of(
  {
    path: 'message',
    component: resolve => require(['./page/Index'], resolve),
    children: [
      { name: 'educationMessageIndex', path: '', component: resolve => require(['./page/List'], resolve), meta: {title: '我的留言'} },
      { name: 'educationMessageCreate', path: 'create', component: resolve => require(['./page/Create'], resolve), meta: {title: '创建留言'} },
      { name: 'educationMessageConversation', path: 'conversation/msg/:messageId', component: resolve => require(['./page/Conversation'], resolve), meta: {title: '留言'} },
      { name: 'educationMessageConversationForParents', path: ':studentId/conversation/msg/:messageId', component: resolve => require(['./page/Conversation'], resolve), meta: {title: '留言'} },
      { name: 'educationMessageIndexForParents', path: ':studentId', component: resolve => require(['./page/List'], resolve), meta: {title: '我的留言'} },
      // { name: 'educationMessageDetail', path: 'detail/:memberId', component: resolve => require(['./page/Detail'], resolve), meta: {title: '留言'} },
      { name: 'educationMessageLiveMessage', path: 'detail/:memberId', component: resolve => require(['./page/LiveMessage'], resolve), meta: {title: '留言'} },
      { name: 'educationMessageCreateForParents', path: ':studentId/create', component: resolve => require(['./page/Create'], resolve), meta: {title: '创建留言'} },
      { name: 'educationMessageEdit', path: 'edit/:messageId', component: resolve => require(['./page/Edit'], resolve), meta: {title: '修改留言'} },
      { name: 'educationMessageEditForParents', path: ':studentId/edit/:messageId', component: resolve => require(['./page/Edit'], resolve), meta: {title: '修改留言'} }
    ]
  }
)

export default MessageRouter
