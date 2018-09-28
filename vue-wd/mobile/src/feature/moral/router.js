
const MoralRouter = Array.of(
  {
    path: 'moral',
    component: resolve => require(['./page/Index'], resolve),
    children: [
      { name: 'educationMoralManage', path: 'manage', component: resolve => require(['./page/Manage'], resolve), meta: {title: '德育管理'} },
      { name: 'educationMoralEvaluation', path: 'evaluation', component: resolve => require(['./page/Evaluation'], resolve), meta: {title: '德育评定'} },
      { name: 'educationScoreItemClassSetting', path: 'class/setting/score_item', component: resolve => require(['./page/ScoreItemClassSetting'], resolve), meta: {title: '星级班级评定项设置'} },
      { name: 'educationScoreItemStudentSetting', path: 'student/setting/score_item', component: resolve => require(['./page/ScoreItemStudentSetting'], resolve), meta: {title: '学生操行评定项设置'} },
      { name: 'educationMoralLeaveSetting', path: 'leave_setting', component: resolve => require(['./page/LeaveSetting'], resolve), meta: {title: '请假设置'} },
      { name: 'educationMoralCheckSetting', path: 'check_setting', component: resolve => require(['./page/CheckSetting'], resolve), meta: {title: '考勤设置'} },
      { name: 'educationMoralGradeSetting', path: 'grade_setting', component: resolve => require(['./page/GradeSetting'], resolve), meta: {title: '年级组德育管理设置'} },
      { name: 'educationMoralGradeSettingTeacherList', path: 'grade_setting/grade/:gradeId', component: resolve => require(['./page/GradeSettingTeacherList'], resolve), meta: {title: '年级组管理者'} },
      { name: 'educationScoreClassEvaluate', path: 'score/class/evaluate', component: resolve => require(['./page/ScoreClassEvaluate'], resolve), meta: {title: '星级班级评定'} },
      { name: 'educationStudentConductEvaluate', path: 'student/conduct/evaluate', component: resolve => require(['./page/StudentConductEvaluate'], resolve), meta: {title: '学生操行评定'} },
      { name: 'educationCheckLeaveInfo', path: 'check_leave', component: resolve => require(['./page/CheckLeaveInfo'], resolve), meta: {title: '核查请假情况'} },
      { name: 'educationScoreClassEvaluateSituation', path: 'score/class/evaluate/situation', component: resolve => require(['./page/ScoreClassEvaluateSituation'], resolve), meta: {title: '星级班级评定报告'} },
      { name: 'educationScoreClassEvaluateSituationDetail', path: 'score/class/evaluate/situation/detail/:reportId', component: resolve => require(['./page/ScoreClassEvaluateSituationDetail'], resolve), meta: {title: '星级班级评定报告'} },
      { name: 'educationScoreStudentEvaluateSituation', path: 'score/student/evaluate/situation', component: resolve => require(['./page/ScoreStudentEvaluateSituation'], resolve), meta: {title: '学生操行评定报告'} },
      { name: 'educationScoreStudentEvaluateSituationDetail', path: 'score/student/evaluate/situation/detail/:reportId', component: resolve => require(['./page/ScoreStudentEvaluateSituationDetail'], resolve), meta: {title: '学生操行评定报告'} },
      { name: 'educationScoreClassEvaluateRanking', path: 'score/class/evaluate/ranking', component: resolve => require(['./page/ScoreClassEvaluateRanking'], resolve), meta: {title: '查询评定排名'} },
      { name: 'educationScoreStudentEvaluateRanking', path: 'score/student/evaluate/ranking', component: resolve => require(['./page/ScoreStudentEvaluateRanking'], resolve), meta: {title: '查询评定排名'} },
      { name: 'educationScoreClassItemList', path: 'score/class/item_list', component: resolve => require(['./page/ScoreClassItemList'], resolve), meta: {title: '班级评定扣分查询'} },
      { name: 'educationScoreStudentItemList', path: 'score/student/item_list', component: resolve => require(['./page/ScoreStudentItemList'], resolve), meta: {title: '学生评定加／减分查询'} },
      { name: 'educationScoreStudentScoreOption', path: 'student_score_option/type/:projectType', component: resolve => require(['./page/StudentScoreOption'], resolve), meta: {title: ''} },
      { name: 'educationStudentScoreItemListForParents', path: 'student/:studentId/item_list', component: resolve => require(['./page/StudentScoreItemList'], resolve), meta: {title: '德育表现'} },
      { name: 'educationStudentScoreItemListForStudent', path: 'student/item_list', component: resolve => require(['./page/StudentScoreItemList'], resolve), meta: {title: '德育表现'} },
      { name: 'educationMoralMyClassScoreList', path: 'my_class', component: resolve => require(['./page/MyClassScoreList'], resolve), meta: {title: ''} },
      { name: 'educationMoralClassScoreForGrade', path: 'score/class_info/:recordId', component: resolve => require(['./page/ClassScoreForGrade'], resolve), meta: {title: '星级班级排名'} },
      { name: 'educationMoralStudentReportList', path: 'student_report_list/student/:studentId', component: resolve => require(['./page/StudentReportList.vue'], resolve), meta: {title: '德育报告列表'} },
      { name: 'educationMoralStudentReportListForStudent', path: 'student_report_list', component: resolve => require(['./page/StudentReportList.vue'], resolve), meta: {title: '德育报告列表'} },
      { name: 'educationMoralStudentScoreDetail', path: 'student_score_detail/student/:studentId/evaluate/:evaluateId', component: resolve => require(['./page/StudentScoreDetail.vue'], resolve), meta: {title: '德育评分详情'} },
      { name: 'educationMoralStudentScoreDetailForStudent', path: 'student_score_detail/student/evaluate/:evaluateId', component: resolve => require(['./page/StudentScoreDetail.vue'], resolve), meta: {title: '德育评分详情'} },
      { name: 'educationStudentScoreReportDetailForParents', path: 'student/:studentId/report/detail/:recordId', component: resolve => require(['./page/StudentScoreReportDetail'], resolve), meta: {title: '操行排名'} },
      { name: 'educationStudentScoreReportDetailForStudent', path: 'student/report/detail/:recordId', component: resolve => require(['./page/StudentScoreReportDetail'], resolve), meta: {title: '操行排名'} },
      { name: 'educationMoralScoreStudentDetail', path: 'score_student_detail/class/:classId/evaluate/:evaluateId', component: resolve => require(['./page/ScoreStudentDetail.vue'], resolve), meta: {title: '学生评定详情'} },
      { name: 'educationMoralScoreClassDetail', path: 'score_class_detail/class/:classId/evaluate/:evaluateId', component: resolve => require(['./page/ScoreClassDetail.vue'], resolve), meta: {title: '班级评定详情'} },
      { name: 'educationMoralStudentEvaluate', path: 'student/evaluate', component: resolve => require(['./page/StudentEvaluate.vue'], resolve), meta: {title: '学生操行评定'} },
      { name: 'educationMoralConductEvaluationList', path: 'conduct/evaluation/list', component: resolve => require(['./page/ConductEvaluationList.vue'], resolve), meta: {title: '操行评定记录'} },
      { name: 'educationMoralClassAssessorManage', path: 'class/assessor/manage', component: resolve => require(['./page/ClassAssessorManage.vue'], resolve), meta: {title: '操行评定员管理'} },
      { name: 'educationClassAssessorSetingAdmin', path: 'class/assessor/seting/:type', component: resolve => require(['./page/ClassAssessorSeting.vue'], resolve), meta: {title: '班级评定员设置'} },
      { name: 'educationClassAssessorSetingManage', path: 'class/assessor/seting/:type', component: resolve => require(['./page/ClassAssessorSeting.vue'], resolve), meta: {title: '班级评定员设置'} },
      { name: 'educationKeepStudent', path: 'keep/student/:type', component: resolve => require(['./page/KeepStudent.vue'], resolve), meta: {title: '选择学生'} }
    ]
  }
)

export default MoralRouter
