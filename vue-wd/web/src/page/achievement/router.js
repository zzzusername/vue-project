const AchievementRouter = Array.of(
  {
    path: '',
    component: resolve => require(['./Index.vue'], resolve),
    children: [
      {
        name: 'AchievementImport',
        path: 'achievement_import',
        component: resolve => require(['@/page/achievement/AchievementImport'], resolve),
        meta: { title: '成绩管理' }
      },
      {
        name: 'AchievementList',
        path: 'achievement_list',
        component: resolve => require(['@/page/achievement/AchievementList'], resolve),
        meta: { title: '成绩单列表' }
      },
      {
        name: 'AchievementDetailsLook',
        path: 'achievement_details/:achievementsId/:edit/:classId',
        component: resolve => require(['@/page/achievement/AchievementDetails'], resolve),
        meta: { title: '查看成绩单' }
      },
      {
        name: 'AchievementDetailsEdit',
        path: 'achievement_details/:achievementsId/:edit/:classId',
        component: resolve => require(['@/page/achievement/AchievementDetails'], resolve),
        meta: { title: '编辑成绩单' }
      },
      {
        name: 'AchievementStatistics',
        path: 'achievement_statistics',
        component: resolve => require(['@/page/achievement/AchievementStatistics'], resolve),
        meta: { title: '成绩统计' }
      },
      {
        name: 'AchievementDispense',
        path: 'achievement_dispense',
        component: resolve => require(['@/page/achievement/AchievementDispense'], resolve),
        meta: { title: '分发' }
      },
      {
        name: 'AchievementDegree',
        path: 'achievement_degree',
        component: resolve => require(['@/page/achievement/AchievementDegree'], resolve),
        meta: { title: '成绩管理' }
      }
    ]
  }
)

export default AchievementRouter
