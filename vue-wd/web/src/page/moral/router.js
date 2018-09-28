const MoralRouter = Array.of(
  {
    path: '',
    component: resolve => require(['./Index.vue'], resolve),
    children: [
      {
        name: 'StudentEvaluationSetting',
        path: 'student_evaluation_setting',
        component: resolve => require(['./StudentEvaluationSetting.vue'], resolve),
        meta: {title: '学生操行评比项设置'}
      },
      {
        name: 'ClassEvaluationSetting',
        path: 'class_evaluation_setting',
        component: resolve => require(['./ClassEvaluationSetting.vue'], resolve),
        meta: {title: '星级班级评比项设置'}
      }
    ]
  }
)

export default MoralRouter
