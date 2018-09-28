
const IndexRouter = Array.of(
  // {
  //   path: 'index',
  //   name: 'index',
  //   component: require('./page/Index'),
  //   meta: { title: '首页' }
  // },
  // {
  //   path: 'space',
  //   name: 'spaceIndex',
  //   component: require('./page/SpaceIndex'),
  //   meta: { title: '空间' }
  // }
  {
    path: 'index',
    name: 'index',
    component: require('./page/Dispatch'),
    meta: { title: '首页' }
  },
  {
    path: 'index/:schoolId',
    name: 'schoolIndex',
    component: require('./page/Dispatch'),
    meta: { title: '首页' }
  },
  {
    path: 'user',
    name: 'userIndex',
    component: require('../user/page/Index'),
    meta: { title: '我的' }
  },
  {
    path: 'user/:schoolId',
    name: 'schoolUser',
    component: require('../user/page/Index'),
    meta: { title: '我的' }
  },
  {
    path: 'login_test',
    name: 'userLoginList',
    component: require('../user/page/UserIndexTest'),
    meta: { title: '测试' }
  },
  {
    path: 'login_test/:schoolId',
    name: 'schoolUserLoginList',
    component: require('../user/page/UserIndexTest'),
    meta: { title: '测试' }
  },
  {
    path: 'auth_share/:schoolId/key/:userBindKey',
    name: 'userShareAuth',
    component: require('../user/page/UserShareAuth'),
    meta: { title: '用户授权' }
  },
  {
    path: 'user_help/:schoolId',
    name: 'eduUserHelp',
    component: require('./page/EduHelp'),
    meta: { title: '欢迎' }
  },
  {
    path: 'personal_register/:schoolId/status/:status',
    name: 'eduPersonalRegister',
    component: require('./page/PersonalRegister'),
    meta: { title: '欢迎' }
  },
  {
    path: 'user_invalid/:schoolId',
    name: 'eduUserInvalid',
    component: require('./page/EduHelp2'),
    meta: { title: '欢迎' }
  },
  {
    path: 'test_pdf',
    name: 'testPdf',
    component: require('./page/Test'),
    meta: { title: '测试' }
  }
)

export default IndexRouter
