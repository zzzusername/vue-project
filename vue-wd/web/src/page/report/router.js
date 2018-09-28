const ReportRouter = Array.of(
  {
    path: '',
    component: resolve => require(['./Index.vue'], resolve),
    children: [
      {
        name: 'ReviewReport',
        path: 'review',
        component: resolve => require(['@/page/report/ReviewReport'], resolve),
        meta: { title: '预览' }
      },
      {
        name: 'QualityEvaluation',
        path: 'quality_evaluation',
        component: resolve => require(['@/page/report/QualityEvaluation'], resolve),
        meta: { title: '筛选学生', keepAlive: true }
      },
      {
        name: 'QualityEvaluationForReport',
        path: 'quality_evaluation/:gradeId/:gradeCode/:semesterCode',
        component: resolve => require(['@/page/report/QualityEvaluation'], resolve),
        meta: { title: '筛选学生', keepAlive: true }
      },
      {
        name: 'QualityEvaluationForGradeuate',
        path: 'quality_evaluation/:gradeId',
        component: resolve => require(['@/page/report/QualityEvaluation'], resolve),
        meta: { title: '筛选学生', keepAlive: true }
      },
      { // 教师
        name: 'SemesterReport',
        path: 'semester_report/grade/:gradeId/class/:classId/student/:studentId/report/:reportId',
        component: resolve => require(['@/page/report/SemesterReport'], resolve),
        meta: { title: '学生素质评价' }
      },
      { // 家长、学生
        name: 'SemesterReportIdentity',
        path: 'semester_report_identity/report/:reportId',
        component: resolve => require(['@/page/report/SemesterReport'], resolve),
        meta: { title: '学生素质评价' }
      },
      {
        name: 'ReportManage',
        path: 'report_manage',
        component: resolve => require(['@/page/report/ReportManage'], resolve),
        meta: { title: '评价报表管理', keepAlive: true }
      },
      {
        name: 'studentBaseInfoList',
        path: 'student_base_info_list',
        component: resolve => require(['./StudentBaseInfoList.vue'], resolve),
        meta: { title: '学生基本信息列表' }
      },
      {
        name: 'importHistoryData',
        path: 'import_history_data',
        component: resolve => require(['./ImportHistoryData.vue'], resolve),
        meta: { title: '历史评价导入' }
      },
      {
        name: 'GraduationPresentation',
        path: 'graduation_presentation/grade/:gradeId/class/:classId/student/:studentId/graduation/:graduateReportId',
        component: resolve => require(['./GraduationPresentation.vue'], resolve),
        meta: { title: '毕业评价报告' }
      },
      {
        name: 'ReportList',
        path: 'report_list',
        component: resolve => require(['./ReportList.vue'], resolve),
        meta: { title: '评价报告列表' }
      }
    ]
  }
)

export default ReportRouter
