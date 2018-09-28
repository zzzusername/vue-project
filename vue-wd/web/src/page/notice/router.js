const NoticeRouter = Array.of(
  {
    path: '',
    component: resolve => require(['./Index.vue'], resolve),
    children: [
      {
        name: 'NoticeList',
        path: 'notice_list',
        component: resolve => require(['./List.vue'], resolve),
        meta: {title: '公告列表'}
      },
      {
        name: 'NoticePublish',
        path: 'publish_notice',
        component: resolve => require(['./Publish.vue'], resolve),
        meta: {title: '发布公告'}
      },
      {
        name: 'NoticeModify',
        path: 'modify_notice/:noticeId',
        component: resolve => require(['./Modify.vue'], resolve),
        meta: {title: '修改公告'}
      }
    ]
  }
)

export default NoticeRouter
