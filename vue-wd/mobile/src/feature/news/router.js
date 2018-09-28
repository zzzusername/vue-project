
const NewsRouter = Array.of(
  {
    path: 'news',
    component: resolve => require(['./page/Index'], resolve),
    children: [
      { name: 'educationNewsList', path: 'list', component: resolve => require(['./page/List'], resolve), meta: {title: '资讯'} },
      { name: 'educationNewsListForParents', path: 'list/:studentId', component: resolve => require(['./page/List'], resolve), meta: {title: '资讯'} },
      { name: 'educationNewsManage', path: 'manage', component: resolve => require(['./page/NewsManage'], resolve), meta: {title: '资讯管理', keepAlive: true} },
      { name: 'educationNewsPublish', path: 'publish', component: resolve => require(['./page/PublishNews'], resolve), meta: {title: '发布资讯'} },
      { name: 'educationNewsTeacherList', path: 'teacher/list', component: resolve => require(['./page/TeacherNewsList'], resolve), meta: {title: '教师资讯'} },
      { name: 'educationModifyNews', path: 'modify/:newsId', component: resolve => require(['./page/PublishNews'], resolve), meta: {title: '修改群资讯'} },
      { name: 'educationNewsDispatch', path: 'dispatch/:newsId', component: resolve => require(['./page/Dispatch'], resolve), meta: {title: '资讯'} }
      // { name: 'educationNewsDetail', path: 'detail/:newsId', component: resolve => require(['./page/NewsDetail'], resolve), meta: {title: '资讯详情'} },
    ]
  }
)

export default NewsRouter
