const HomeworkRouter = Array.of(
  {
    path: '',
    component: resolve => require(['./Index.vue'], resolve),
    children: [
      {
        name: 'PublishHomework',
        path: 'publish_homework',
        component: resolve => require(['@/page/homework/PublishHomework.vue'], resolve),
        meta: { title: '发布作业' }
      },
      {
        name: 'HomeworkList',
        path: 'homework_list',
        component: resolve => require(['@/page/homework/HomeworkList.vue'], resolve),
        meta: { title: '作业列表' }
      },
      {
        name: 'ChangeHomework',
        path: 'change_homework/:workId',
        component: resolve => require(['@/page/homework/ChangeHomework.vue'], resolve),
        meta: { title: '修改作业' }
      },
      {
        name: 'HomeworkPercent',
        path: 'homework_percent/:workId',
        component: resolve => require(['@/page/homework/HomeworkPercent.vue'], resolve),
        meta: { title: '作业完成情况' }
      },
      {
        name: 'HomeworkDetail',
        path: 'homework_detail/:studentWorkId',
        component: resolve => require(['@/page/homework/HomeworkDetail.vue'], resolve),
        meta: { title: '作业详情' }
      }
    ]
  }
)

export default HomeworkRouter
