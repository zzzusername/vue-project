const ClassStudentRouter = Array.of(
  {
    path: '',
    component: resolve => require(['./Index.vue'], resolve),
    children: [
      {
        name: 'GradeManage',
        path: 'grade_manage',
        component: resolve => require(['@/page/grademanage/GradeManage'], resolve),
        meta: { title: '年级管理' }
      },
      {
        name: 'ClassManage',
        path: 'class_manage',
        component: resolve => require(['@/page/grademanage/ClassManage'], resolve),
        meta: { title: '班级管理' }
      },
      {
        name: 'StudentManage',
        path: 'student_manage',
        component: resolve => require(['@/page/grademanage/StudentManage'], resolve),
        meta: { title: '学生管理' }
      },
      {
        name: 'ImportStudent',
        path: 'import_student',
        component: resolve => require(['@/page/grademanage/ImportStudent'], resolve),
        meta: { title: '导入学生' }
      },
      {
        name: 'BatchTurn',
        path: 'batch_turn',
        component: resolve => require(['@/page/grademanage/BatchTurn'], resolve),
        meta: { title: '学生转班' }
      },
      {
        name: 'GradeLeaderManage',
        path: 'grade_leader_manage/:gradeId',
        component: resolve => require(['@/page/grademanage/GradeLeaderManage'], resolve),
        meta: { title: '年级组长管理' }
      },
      {
        name: 'GradeLeaderManageAdd',
        path: 'grade_leader_manage_add/:gradeId/:isAdd',
        component: resolve => require(['@/page/grademanage/GradeLeaderManage'], resolve),
        meta: { title: '年级组长管理' }
      },
      {
        name: 'DivisionShift',
        path: 'division_shift',
        component: resolve => require(['@/page/grademanage/DivisionShift'], resolve),
        meta: { title: '学生分班' }
      },
      {
        name: 'ShiftClassDispatch',
        path: 'shift_class_dispatch',
        component: resolve => require(['@/page/grademanage/ShiftClassDispatch'], resolve),
        meta: { title: '分发' }
      }
    ]
  }
)

export default ClassStudentRouter
