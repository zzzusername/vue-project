const TeacherRouter = Array.of(
  {
    path: '',
    component: resolve => require(['./Index.vue'], resolve),
    children: [
      {
        name: 'TeacherImport',
        path: 'teacher_import',
        component: resolve => require(['@/page/teacher/TeacherImport'], resolve),
        meta: { title: '导入老师' }
      },
      {
        name: 'TeacherList',
        path: 'Teacher_list',
        component: resolve => require(['@/page/teacher/TeacherList'], resolve),
        meta: { title: '老师管理' }
      }
    ]
  }
)

export default TeacherRouter
