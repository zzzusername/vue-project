const StudentRouter = Array.of(
  {
    path: '',
    component: resolve => require(['./Index.vue'], resolve),
    children: [
      {
        name: 'StudentImport',
        path: 'student_import',
        component: resolve => require(['@/page/student/StudentImport'], resolve),
        meta: { title: '导入学生' }
      },
      {
        name: 'StudentManageMy',
        path: 'student_manage_my',
        component: resolve => require(['@/page/student/StudentManageMy'], resolve),
        meta: { title: '学生管理' }
      }
    ]
  }
)

export default StudentRouter
