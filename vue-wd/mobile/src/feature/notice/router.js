
const NoticeRouter = Array.of(
  {
    path: 'notice',
    component: resolve => require(['./page/Index'], resolve),
    children: [
      { name: 'educationNoticeIndex', path: '', component: resolve => require(['./page/List'], resolve), meta: {title: '公告'} },
      { name: 'educationNoticeListForTeacher', path: 'list/teacher', component: resolve => require(['./page/PublishNoticeList'], resolve), meta: {title: '公告'} },
      { name: 'educationNoticeList', path: 'list', component: resolve => require(['./page/List'], resolve), meta: {title: '公告'} },
      { name: 'educationNoticeListForParents', path: 'list/:studentId', component: resolve => require(['./page/List'], resolve), meta: {title: '公告'} },
      { name: 'educationNoticeTeacherList', path: 'teacher/list', component: resolve => require(['./page/TeacherNoticeList'], resolve), meta: {title: '教师公告'} },
      { name: 'educationNoticeDetail', path: 'detail/:noticeId', component: resolve => require(['./page/Detail'], resolve), meta: {title: '公告详情'} },
      { name: 'educationNoticeManage', path: 'manage', component: resolve => require(['./page/Manage'], resolve), meta: {title: '公告管理', keepAlive: true} },
      { name: 'educationNoticePublish', path: 'publish', component: resolve => require(['./page/PublishNotice'], resolve), meta: {title: '发布群公告'} },
      { name: 'educationModifyNotice', path: 'modify/:noticeId', component: resolve => require(['./page/PublishNotice'], resolve), meta: {title: '修改群公告'} },
      { name: 'educationReaderList', path: 'reader_list/notice/:noticeId', component: resolve => require(['./page/ReaderList'], resolve), meta: {title: '阅读者列表'} },
      { name: 'educationUserReadList', path: 'user_read_list/notice/:noticeId', component: resolve => require(['./page/UserReadList'], resolve), meta: {title: '阅读者列表'} },
      { name: 'educationUpdate', path: 'update_grade/:old/to/:new', component: resolve => require(['./page/Update.vue'], resolve), meta: {title: '年级升级公告'} }
    ]
  }
)

export default NoticeRouter
