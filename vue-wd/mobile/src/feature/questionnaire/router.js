const questionRouter = Array.of(
  {
    path: 'question',
    component: resolve => require(['./page/Index'], resolve),
    children: [
      {name: 'questionCreatedForm', path: 'created_form', component: resolve => require(['./page/CreatedForm'], resolve), meta: {title: '创建问卷'}},
      {name: 'questionEditCreatedForm', path: 'edit_created_form/:questionId', component: resolve => require(['./page/CreatedForm'], resolve), meta: {title: '编辑问卷'}},
      {name: 'questionSubjectList', path: 'subject_list/:questionId', component: resolve => require(['./page/SubjectList'], resolve), meta: {title: '创建问卷'}},
      {name: 'questionUserViewList', path: 'user_view_list', component: resolve => require(['./page/UserViewList'], resolve), meta: {title: '问卷列表'}},
      {name: 'questionParentViewList', path: 'parent_view_list/:studentId', component: resolve => require(['./page/UserViewList'], resolve), meta: {title: '问卷列表'}},
      {name: 'questionManageViewList', path: 'manage_view_list', component: resolve => require(['./page/ManageViewList'], resolve), meta: {title: '问卷列表', keepAlive: true}},
      {name: 'questionAddSubject', path: 'add_subject/:questionId', component: resolve => require(['./page/AddSubject'], resolve), meta: {title: '增加题目'}},
      {name: 'questionEditSubject', path: 'edit_subject/:questionId/:subjectId', component: resolve => require(['./page/AddSubject'], resolve), meta: {title: '修改题目'}},
      {name: 'questionTeacherViewList', path: 'teacher_view_list', component: resolve => require(['./page/TeacherViewList'], resolve), meta: {title: '教师问卷列表'}},
      {name: 'questionStatisicsResult', path: 'statisics_result/:questionId', component: resolve => require(['./page/StatisicsResult'], resolve), meta: {title: '问卷结果统计'}},
      {name: 'questionUserList', path: 'user_list/:questionId', component: resolve => require(['./page/UserList'], resolve), meta: {title: '完成问卷用户'}},
      {name: 'questionUserTextList', path: 'user_text_list/question/:questionId/subject/:subjectId', component: resolve => require(['./page/UserTextList'], resolve), meta: {title: '完成问卷用户'}},
      {name: 'questionDetail', path: 'detail/:questionId', component: resolve => require(['./page/QuestionnaireDetail'], resolve), meta: {title: '问卷详情'}},
      {name: 'questionAnswerDetail', path: 'answer_detail/question/:questionId', component: resolve => require(['./page/AnswerDetail'], resolve), meta: {title: '问卷详情'}},
      {name: 'questionParentAnswerDetail', path: 'answer_detail/question/:questionId/student/:studentId', component: resolve => require(['./page/AnswerDetail'], resolve), meta: {title: '问卷详情'}},
      {name: 'questionCountAnswerDetail', path: 'answer_detail/question/:questionId/answer/:answerId', component: resolve => require(['./page/AnswerDetail'], resolve), meta: {title: '问卷详情'}},
      {name: 'questionSingleResult', path: 'single_result/:questionId', component: resolve => require(['./page/SingleResult'], resolve), meta: {title: '单项结果统计'}},
      {name: 'questionQuestionSingleDetail', path: 'question_single_detail/question/:questionId/subject/:subjectId', component: resolve => require(['./page/QuestionSingleDetail'], resolve), meta: {title: '单项结果统计'}},
      {name: 'questionParentDetail', path: 'detail/student/:studentId/question/:questionId', component: resolve => require(['./page/QuestionnaireDetail'], resolve), meta: {title: '问卷详情'}},
      {name: 'questionCrossStatistics', path: 'cross_statistics/question/:questionId', component: resolve => require(['./page/CrossStatistics'], resolve), meta: {title: '多项统计', keepAlive: true}},
      {name: 'questionDetailDispatch', path: 'detail_dispatch/:questionId', component: resolve => require(['./page/DetailDispatch'], resolve), meta: {title: '问卷详情'}},
      {name: 'questionMyQuestionList', path: 'my_question_list', component: resolve => require(['./page/MyQuestionList'], resolve), meta: {title: '参与的问卷'}},
      {name: 'questionMyQuestionListStudent', path: 'my_question_list/:studentId', component: resolve => require(['./page/MyQuestionList'], resolve), meta: {title: '参与的问卷'}}
    ]
  }
)
export default questionRouter
