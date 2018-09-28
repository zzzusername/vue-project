const educationRouter = Array.of(
  {
    path: '',
    component: resolve => require(['./page/Index'], resolve),
    children: [
      {name: 'educationStudentHome', path: 'student_home', component: resolve => require(['./page/user/StudentHome'], resolve), meta: {title: '学生首页'}},
      {name: 'educationTeacherHome', path: 'teacher_home', component: resolve => require(['./page/user/TeacherHome'], resolve), meta: {title: '教师首页'}},
      {name: 'educationParentsHome', path: 'parents_home', component: resolve => require(['./page/user/ParentsHome'], resolve), meta: {title: '家长首页'}},
      {name: 'educationGroupSetting', path: 'group_setting', component: resolve => require(['./page/GroupSetting'], resolve), meta: { title: '学校群设置' }},
      {name: 'educationSchoolMessage', path: 'school_info', component: resolve => require(['./page/SchoolMessages'], resolve), meta: { title: '设置学校信息' }},
      {name: 'educationManageSchool', path: 'manage', component: resolve => require(['./page/SchoolManage'], resolve), meta: { title: '学校管理' }},
      {name: 'educationRoleManage', path: 'role', component: resolve => require(['./page/RoleManage'], resolve), meta: { title: '权限管理' }},
      {name: 'educationRoleDetails', path: 'role_details/:roleId', component: resolve => require(['./page/RoleDetails'], resolve), meta: { title: '权限管理' }},
      {name: 'educationTeacherManage', path: 'teacher_manage', component: resolve => require(['./page/TeacherManage'], resolve), meta: { title: '教师管理' }},
      {name: 'educationAddTeacher', path: 'add_teacher', component: resolve => require(['./page/AddTeacher'], resolve), meta: { title: '添加教师' }},
      {name: 'educationEditTeacher', path: 'add_teacher/:teacherId', component: resolve => require(['./page/AddTeacher'], resolve), meta: { title: '编辑教师' }},
      {name: 'educationStudentInfo', path: 'student_info', component: resolve => require(['./page/user/StudentInfo'], resolve), meta: { title: '学生资料' }},
      {name: 'educationTeacherInfo', path: 'teacher_info', component: resolve => require(['./page/user/TeacherInfo'], resolve), meta: { title: '教师资料' }},
      {name: 'educationParentsInfo', path: 'parents_info/student/:studentId/code/:bindingCode', component: resolve => require(['./page/user/ParentsInfo'], resolve), meta: { title: '家长资料' }},
      {name: 'educationBindParentsInfo', path: 'bind_parents_info/student/:studentId', component: resolve => require(['./page/user/ParentsInfo'], resolve), meta: { title: '家长资料' }},
      {name: 'educationParentsEditInfo', path: 'parents_edit_info', component: resolve => require(['./page/user/ParentsInfo'], resolve), meta: { title: '编辑资料' }},
      {name: 'educationRollCallRecord', path: 'roll_call_record', component: resolve => require(['./page/user/RollCallRecord'], resolve), meta: { title: '考勤记录' }},
      {name: 'educationTeacherMessages', path: 'teacher_messages/:teacherId', component: resolve => require(['./page/TeacherMessages'], resolve), meta: { title: '教师信息' }},
      {name: 'educationLessonsManage', path: 'lessons_manage', component: resolve => require(['./page/LessonsManage'], resolve), meta: { title: '课程管理' }},
      {name: 'educationAddLessons', path: 'add_lessons', component: resolve => require(['./page/LessonsModify'], resolve), meta: { title: '添加课程' }},
      {name: 'educationModifyLessons', path: 'modify_lessons/:lessonId', component: resolve => require(['./page/LessonsModify'], resolve), meta: { title: '编辑课程' }},
      {name: 'educationLessonsSetting', path: 'lessons_setting/:lessonId/:lessonName', component: resolve => require(['./page/LessonsSetting'], resolve), meta: { title: '课程设置' }},
      {name: 'educationStudentManage', path: 'student_manage', component: resolve => require(['./page/StudentManage'], resolve), meta: { title: '学生管理' }},
      {name: 'educationAddStudent', path: 'add_student', component: resolve => require(['./page/AddStudent'], resolve), meta: { title: '添加学生' }},
      {name: 'educationEditStudent', path: 'edit_student/:studentId', component: resolve => require(['./page/AddStudent'], resolve), meta: { title: '修改学生资料' }},
      {name: 'educationRoleFunctionSetup', path: 'role_setup/:roleId', component: resolve => require(['./page/RoleFunctionSetup'], resolve), meta: { title: '角色功能设置' }},
      {name: 'educationEditRole', path: 'edit_role/:roleId', component: resolve => require(['./page/EditRole'], resolve), meta: { title: '编辑角色' }},
      {name: 'educationAddRole', path: 'add_role', component: resolve => require(['./page/EditRole'], resolve), meta: { title: '添加角色' }},
      {name: 'educationLookStudentInfo', path: 'look_student_info/:studentId', component: resolve => require(['./page/LookStudentInfo'], resolve), meta: { title: '学生信息' }},
      {name: 'educationLookStudentInfoClassId', path: 'look_student_info/student/:studentId/class/:classId', component: resolve => require(['./page/LookStudentInfo'], resolve), meta: { title: '学生信息' }},
      {name: 'educationBaseSetting', path: 'setting', component: resolve => require(['./page/BaseSetting'], resolve), meta: { title: '基础设置' }},
      {name: 'educationBasePerfectInfoSetting', path: 'setting/perfect_info/:type', component: resolve => require(['./page/BasePerfectInfoSetting'], resolve), meta: { title: '完善资料设置' }},
      {name: 'educationClassManage', path: 'class_manage_d', component: resolve => require(['./page/ClassManageDispatch'], resolve), meta: { title: '班级列表', keepAlive: true }},
      {name: 'educationClassManageForGrade', path: 'class_manage/:gradeId', component: resolve => require(['./page/ClassManage'], resolve), meta: { title: '班级列表', keepAlive: true }},
      {name: 'educationGroupList', path: 'group_list', component: resolve => require(['./page/GroupList'], resolve), meta: { title: '学校群管理' }},
      {name: 'educationAddGrade', path: 'add_grade', component: resolve => require(['./page/AddGrade'], resolve), meta: { title: '添加年级' }},
      {name: 'educationEditGrade', path: 'edit_grade/:gradeId', component: resolve => require(['./page/AddGrade'], resolve), meta: { title: '添加年级' }},
      {name: 'educationAddClass', path: 'add_class/:gradeId', component: resolve => require(['./page/AddClass'], resolve), meta: { title: '添加班级' }},
      {name: 'educationGradeLeaderManage', path: 'grade_leader_manage/:gradeId', component: resolve => require(['./page/GradeLeaderManage'], resolve), meta: { title: '年级组长管理' }},
      {name: 'educationAddClassForType', path: 'add_class/type/:classType', component: resolve => require(['./page/AddClass'], resolve), meta: { title: '添加班级' }},
      {name: 'educationEditClass', path: 'edit_class/:classId/grade/:gradeId', component: resolve => require(['./page/AddClass'], resolve), meta: { title: '编辑班级' }},
      {name: 'educationEditClassForType', path: 'edit_class/:classId/type/:classType', component: resolve => require(['./page/AddClass'], resolve), meta: { title: '编辑班级' }},
      {name: 'educationEditSavorClass', path: 'edit_savor_class/:classId', component: resolve => require(['./page/AddClass'], resolve), meta: { title: '编辑班级' }},
      {name: 'educationAddTeacherBinding', path: 'add_teacher_binding/teacher/:teacherId/code/:bindingCode', component: resolve => require(['./page/AddTeacherBinding'], resolve), meta: { title: '教师信息' }},
      {name: 'educationEditTeacherMessage', path: 'edit_teacher_messageg/:teacherId', component: resolve => require(['./page/AddTeacherBinding'], resolve), meta: { title: '教师信息' }},
      {name: 'educationEditTeacherInfo', path: 'edit_teacher_info', component: resolve => require(['./page/AddTeacherBinding'], resolve), meta: { title: '教师信息' }},
      {name: 'educationClassStudentList', path: 'class_student_list/:classId/class_type/:classType', component: resolve => require(['./page/ClassStudentList'], resolve), meta: { title: '班级学生列表' }},
      {name: 'educationClassAddStudent', path: 'class_add_student/:classId', component: resolve => require(['./page/AddStudent'], resolve), meta: { title: '班级添加学生' }},
      {name: 'educationAddStudentBinding', path: 'add_student_binding/student/:studentId/code/:bindinCode', component: resolve => require(['./page/AddStudentBinding'], resolve), meta: { title: '学生信息' }},
      {name: 'educationEditStudentMessage', path: 'edit_student_message/:studentId', component: resolve => require(['./page/AddStudentBinding'], resolve), meta: { title: '学生资料' }},
      {name: 'educationRegisterParent', path: 'register_parent', component: resolve => require(['./page/user/RegisterParent'], resolve), meta: { title: '注册家长' }},
      {name: 'educationStudentVacation', path: 'student_vacation', component: resolve => require(['./page/user/StudentVacation'], resolve), meta: { title: '请假申请' }},
      {name: 'educationParentVacation', path: 'student_vacation/:studentId', component: resolve => require(['./page/user/StudentVacation'], resolve), meta: { title: '请假申请' }},
      {name: 'educationVacationDetails', path: 'vacation_details/:vacationId', component: resolve => require(['./page/user/RemoveVacation'], resolve), meta: { title: '请假详情' }},
      {name: 'educationStudentVacationList', path: 'vacation_list', component: resolve => require(['./page/user/VacationList'], resolve), meta: { title: '我要请假' }}, // 学生自己的请假
      {name: 'educationVacationList', path: 'vacation_list/:studentId', component: resolve => require(['./page/user/VacationList'], resolve), meta: { title: '我要请假' }}, // 家长查看孩子的请假
      {name: 'educationVacationManage', path: 'vacation_manage', component: resolve => require(['./page/user/VacationManage'], resolve), meta: { title: '请假管理' }},
      {name: 'educationTeacherQueryVacation', path: 'teacher_query_vacation/:vacationId', component: resolve => require(['./page/user/TeacherQueryVacation'], resolve), meta: { title: '假条详情' }},
      {name: 'educationQueryVacation', path: 'teacher_query_vacation/:check/:vacationId', component: resolve => require(['./page/user/TeacherQueryVacation'], resolve), meta: { title: '假条详情' }},
      {name: 'educationTeacherReomveVacation', path: 'teacher_remove_vacation/vacation/:vacationId/code/:vacationCode', component: resolve => require(['./page/user/TeacherQueryVacation'], resolve), meta: { title: '假条详情' }},
      // 作业推送链接
      {name: 'educationWorkDispatch', path: 'work_dispatch/:workId', component: resolve => require(['./page/user/StudentWorkDispatch'], resolve), meta: { title: '作业详情' }},
      {name: 'educationCommentsTeacherManage', path: 'comments_teacher_manage', component: resolve => require(['./page/user/CommentsTeacherManage'], resolve), meta: { title: '评语管理' }},
      {name: 'educationWriteComments', path: 'write_comments/:commentPeriodId', component: resolve => require(['./page/user/WriteComments'], resolve), meta: { title: '写评语' }},
      {name: 'educationCreateComments', path: 'create_comments', component: resolve => require(['./page/user/CreateComments'], resolve), meta: { title: '创建评语' }},
      {name: 'educationEditComments', path: 'edit_cycle_comments/:commentPeriodId', component: resolve => require(['./page/user/CreateComments'], resolve), meta: { title: '编辑评语' }},
      {name: 'educationStudentComments', path: 'student_comments', component: resolve => require(['./page/user/StudentComments'], resolve), meta: { title: '查看评语' }},
      {name: 'educationTimelyComments', path: 'timely_comments', component: resolve => require(['./page/user/TimelyComments'], resolve), meta: { title: '创建即时评语' }},
      {name: 'educationEditTimelyComments', path: 'edit/timely_comments/class/:classId/comment/:commentRealId', component: resolve => require(['./page/user/TimelyComments'], resolve), meta: { title: '编辑即时评语' }},
      {name: 'educationAchievementManage', path: 'achievement/manage', component: resolve => require(['./page/user/AchievementManage'], resolve), meta: { title: '成绩单' }},
      {name: 'educationAchievementPublish', path: 'achievement/publish', component: resolve => require(['./page/user/AchievementPublish'], resolve), meta: { title: '发布成绩单' }},
      {name: 'educationCreateRollCall', path: 'create_roll_call', component: resolve => require(['./page/user/CreateRollCall'], resolve), meta: { title: '创建点名' }},
      {name: 'educationRollCall', path: 'roll_call/:checkId/class/:classId/:status', component: resolve => require(['./page/user/RollCall'], resolve), meta: { title: '点名' }},
      {name: 'educationStudentAttendanceRecord', path: 'attendance_record', component: resolve => require(['./page/user/AttendanceRecord'], resolve), meta: { title: '考勤' }}, // 学生的考勤列表
      {name: 'educationAttendanceRecord', path: 'attendance_record/:studentId', component: resolve => require(['./page/user/AttendanceRecord'], resolve), meta: { title: '考勤' }}, // 家长的考勤列表
      {name: 'educationCommentsInfo', path: 'comments_info/class/:classId/comment/:commentRealId/:role/:commentType', component: resolve => require(['./page/user/CommentsInfo'], resolve), meta: { title: '评语详情' }},
      {name: 'educationCycleCommentsInfo', path: 'comments_info/:studentPeriodId/:commentType', component: resolve => require(['./page/user/CommentsInfo'], resolve), meta: { title: '评语详情' }},
      {
        path: '/',
        component: resolve => require(['./page/user/HomeworkIndex'], resolve),
        children: [
          {name: 'educationHomeworkOverview', path: 'homework_overview/work/:workId', component: resolve => require(['./page/user/HomeworkOverview'], resolve), meta: { title: '作业完成详情', keepAlive: true }},
          {name: 'educationStudentWorkDetails', path: 'student_work_details/:student', component: resolve => require(['./page/user/StudentWorkDetails'], resolve), meta: { title: '作业详情' }},
          {name: 'educationMarkingHomework', path: 'marking_homework/:student', component: resolve => require(['./page/user/MarkingHomework'], resolve), meta: { title: '批阅作业' }},
          {name: 'educationDoHomework', path: 'do_homework/:student', component: resolve => require(['./page/user/DoHomework'], resolve), meta: { title: '做作业' }},
          {name: 'educationParentDoHomework', path: 'parent_do_homework/:student/student/:studentId', component: resolve => require(['./page/user/DoHomework'], resolve), meta: { title: '做作业' }},
          {name: 'educationTeacherWorkList', path: 'teacher_work_list', component: resolve => require(['./page/user/TeacherWorkList'], resolve), meta: { title: '教师作业管理' }},
          {name: 'educationStudentWorkList', path: 'student_work_list', component: resolve => require(['./page/user/StudentWorkList'], resolve), meta: { title: '我的作业' }},
          {name: 'educationChildrenWorkList', path: 'children_work_list/:studentId', component: resolve => require(['./page/user/StudentWorkList'], resolve), meta: { title: '作业' }},
          {name: 'educationStudentOnlyWorkList', path: 'student_onlywork_list/:studentId', component: resolve => require(['./page/user/StudentWorkList'], resolve), meta: { title: '作业列表' }}
        ]
      },
      {
        path: '/',
        component: resolve => require(['./page/user/PublishIndex'], resolve),
        children: [
          {name: 'educationPublishHomework', path: 'publish_homework', component: resolve => require(['./page/user/PublishHomework'], resolve), meta: { title: '发布作业', keepAlive: true }},
          {name: 'educationTeacherChangeHomework', path: 'teacher_change_homework/work/:workId', component: resolve => require(['./page/user/TeacherChangeHomework'], resolve), meta: { title: '修改作业', keepAlive: true }},
          {name: 'educationHomeworkAdvanced', path: 'homework_advanced', component: resolve => require(['./page/user/HomeworkAdvanced'], resolve), meta: {title: '作业高级设置', keepAlive: true}}
        ]
      },
      {name: 'educationStudentAchievementList', path: 'achievement/list', component: resolve => require(['./page/user/AchievementList'], resolve), meta: { title: '我的成绩单' }},
      {name: 'educationAchievementList', path: 'achievement/list/:studentId', component: resolve => require(['./page/user/AchievementList'], resolve), meta: { title: '成绩单' }},
      {name: 'educationViewStudentList', path: 'view_student/list', component: resolve => require(['./page/user/ViewStudentList'], resolve), meta: { title: '我的班级' }},
      {name: 'educationViewStudentListForClassId', path: 'view_student/list/:classId', component: resolve => require(['./page/user/ViewStudentList'], resolve), meta: { title: '我的班级' }},
      {name: 'educationAchievementModify', path: 'achievement/modify/:achievementsId', component: resolve => require(['./page/user/AchievementPublish'], resolve), meta: { title: '修改成绩单' }},
      {name: 'educationRollcallDetail', path: 'rollcall_detail/:checkId/class/:classId', component: resolve => require(['./page/user/RollcallDetail'], resolve), meta: { title: '点名详情' }},
      {name: 'educationParentsComments', path: 'parents_comments/:studentId', component: resolve => require(['./page/user/ParentsComments'], resolve), meta: { title: '评语' }},
      // 评语推送链接
      {name: 'educationCommentsDispatch', path: 'comments_dispatch/:commentPeriodId', component: resolve => require(['./page/user/StudentCommentsDispatch'], resolve), meta: { title: '评语' }},
      // 成绩单推送链接
      {name: 'educationAchievementDispatch', path: 'achievement_dispatch/:achievementsId', component: resolve => require(['./page/user/AchievementDispatch'], resolve), meta: { title: '成绩' }},
      {name: 'educationAchievementInfo', path: 'achievement/info/:achievementsId', component: resolve => require(['./page/user/AchievementInfo'], resolve), meta: { title: '查看成绩单' }}, // 老师查看成绩单
      {name: 'educationAchievementMulInfo', path: 'achievement_mul_info/:achievementsId', component: resolve => require(['./page/user/AchievementMulInfo'], resolve), meta: { title: '查看成绩单' }}, // 老师查看成绩单
      {name: 'educationAchievementTeacherDistributed', path: 'achievement_teacher_distributed/:achievementsId', component: resolve => require(['./page/user/AchievementTeacherDistributed'], resolve), meta: { title: '查看成绩单' }}, // 老师查看成绩单
      {name: 'educationQueryParentInfo', path: 'query_parent_info/student/:studentId/parent/:parentId/class/:classId', component: resolve => require(['./page/user/QueryParentInfo'], resolve), meta: { title: '家长详情' }},
      {name: 'educationManageParentInfo', path: 'manage_parent_info/student/:studentId/parent/:parentId', component: resolve => require(['./page/user/QueryParentInfo'], resolve), meta: { title: '家长详情' }},
      {name: 'educationMenuList', path: 'menu_list', component: resolve => require(['./page/user/MenuManage'], resolve), meta: { title: '菜谱' }},
      {name: 'educationMenuManage', path: 'menu_manage', component: resolve => require(['./page/user/MenuManage'], resolve), meta: { title: '菜谱管理' }},
      {name: 'educationPublishMenu', path: 'publish_menu', component: resolve => require(['./page/user/PublishMenu'], resolve), meta: { title: '发布菜谱' }},
      {name: 'educationEditMenu', path: 'edit_menu/:canteenMenuId', component: resolve => require(['./page/user/PublishMenu'], resolve), meta: { title: '修改菜谱' }},
      {name: 'educationRepairsList', path: 'repairs_list', component: resolve => require(['./page/user/RepairsList'], resolve), meta: { title: '我的报修' }},
      {name: 'educationRepairsPublish', path: 'repairs_publish', component: resolve => require(['./page/user/RepairsPublish'], resolve), meta: { title: '发布报修' }},
      {name: 'educationRepairsDetail', path: 'repairs_detail/:repairId/is_manage/:isManage', component: resolve => require(['./page/user/RepairsDetail'], resolve), meta: { title: '报修详情' }},
      {name: 'educationRepairProcess', path: 'repair_process/:repairId', component: resolve => require(['./page/user/RepairProcess'], resolve), meta: { title: '报修处理' }},
      {name: 'educationRepairsManage', path: 'repairs_manage', component: resolve => require(['./page/user/RepairsManage'], resolve), meta: { title: '报修管理' }},
      {name: 'educationMenuDetails', path: 'menu_details/:canteenMenuId', component: resolve => require(['./page/user/MenuDetails'], resolve), meta: { title: '菜单详情' }},
      {name: 'educationSchoolInfo', path: 'info', component: resolve => require(['./page/SchoolInfo'], resolve), meta: { title: '学校主页' }},
      {name: 'educationParentsWeeklyDetail', path: 'weekly_detail/student/:studentId/weekly/:weeklyId', component: resolve => require(['./page/user/WeeklyDetail'], resolve), meta: { title: '周报详情' }},
      {name: 'educationStudentWeeklyDetail', path: 'weekly_detail/weekly/:weeklyId', component: resolve => require(['./page/user/WeeklyDetail'], resolve), meta: { title: '周报详情' }},
      {name: 'educationTeacherWeeklyDetail', path: 'teacher_weekly_detail/class/:classId/weekly/:weeklyId', component: resolve => require(['./page/user/TeacherWeeklyDetail'], resolve), meta: { title: '周报详情' }},
      {name: 'educationAdvancedSetting', path: 'advanced_setting', component: resolve => require(['./page/AdvancedSetting'], resolve), meta: { title: '高级设置' }},
      {name: 'educationAttendPushSetting', path: 'attend_push_setting', component: resolve => require(['./page/AttendPushSetting'], resolve), meta: { title: '接收考勤通知设置' }},
      {name: 'educationAttendPushTarget', path: 'attend_push_target', component: resolve => require(['./page/AttendPushTarget'], resolve), meta: { title: '添加设置' }},
      {name: 'educationChangeAttendPushClass', path: 'change/attend_push_class/:teacherId', component: resolve => require(['./page/AttendPushTarget'], resolve), meta: { title: '修改设置' }},
      {name: 'educationMasterAttendCount', path: 'master_attend_count', component: resolve => require(['./page/statistics/MasterAttendCount'], resolve), meta: { title: '考勤统计' }},
      {name: 'educationStatisticsHome', path: 'statistics', component: resolve => require(['./page/statistics/Home'], resolve), meta: { title: '统计' }},
      {name: 'educationPrincipalLookWork', path: 'statistics/principal_look_work', component: resolve => require(['./page/statistics/PrincipalLookWork'], resolve), meta: { title: '作业统计' }},
      {name: 'educationAchievementClassList', path: 'statistics/class_list', component: resolve => require(['./page/statistics/AchievementClassList'], resolve), meta: { title: '成绩统计' }},
      {name: 'educationAchievementClassDetail', path: 'statistics/class_detail/:classId', component: resolve => require(['./page/statistics/AchievementClassDetail'], resolve), meta: { title: '成绩统计' }},
      {name: 'educationAchievementCount', path: 'statistics/achievement_count', component: resolve => require(['./page/statistics/AchievementCount.vue'], resolve), meta: { title: '成绩统计' }},
      {name: 'educationStudentStudyInfoForParents', path: 'statistics/study/:studentId/parents/:parents', component: resolve => require(['./page/statistics/StudentInfoView'], resolve), meta: { title: '学习汇总' }}, // 家长
      {name: 'educationStudentStudyInfoForParentsPush', path: 'statistics/study/:studentId/parents/:parents/date/:startDate/:endDate', component: resolve => require(['./page/statistics/StudentInfoView'], resolve), meta: { title: '学习汇总' }}, // 家长
      {name: 'educationStudentStudyInfoForTeacher', path: 'statistics/class/:classId/study/:studentId/parents/:parents', component: resolve => require(['./page/statistics/StudentInfoView'], resolve), meta: { title: '学习汇总' }}, // 老师
      {name: 'educationStudentStudyInfoForDate', path: 'statistics/study/date/:startDate/:endDate', component: resolve => require(['./page/statistics/StudentInfoView'], resolve), meta: { title: '学习汇总' }}, // 学生
      {name: 'educationStudentStudyInfo', path: 'statistics/study', component: resolve => require(['./page/statistics/StudentInfoView'], resolve), meta: { title: '学习汇总' }}, // 学生BindPublic
      {name: 'educationStudentInfoTrendForStudent', path: 'statistics/trend/type/:type', component: resolve => require(['./page/statistics/StudentInfoTrend'], resolve), meta: { title: '成绩分析' }}, // 学生走势
      {name: 'educationStudentInfoTrendForParent', path: 'statistics/trend/:studentId/type/:type', component: resolve => require(['./page/statistics/StudentInfoTrend'], resolve), meta: { title: '成绩分析' }}, // 家长走势
      {name: 'educationStudentInfoForTeacher', path: 'statistics/class/:classId/study/:studentId/type/:type', component: resolve => require(['./page/statistics/StudentInfoTrend'], resolve), meta: { title: '成绩分析' }}, // 老师走势
      {name: 'educationBindPublic', path: 'bind_public/:teacherId', component: resolve => require(['./page/BindPublic'], resolve), meta: { title: '验证' }},
      {name: 'educationClassLessons', path: 'class_lessons/:classId', component: resolve => require(['./page/ClassLessons'], resolve), meta: { title: '班级课程管理' }},
      {name: 'educationAddClassLesson', path: 'add_class_lesson/:classId', component: resolve => require(['./page/AddClassLesson'], resolve), meta: { title: '添加课程' }},
      {name: 'educationEditClassLesson', path: 'edit_class_lesson/:classId/lesson/:lessonId', component: resolve => require(['./page/AddClassLesson'], resolve), meta: { title: '编辑课程' }},
      // 服务号功能链接
      {name: 'educationSchoolFeatureDispatch', path: 'feature_dispatch/:schoolMemberType/feature/:featureCode', component: resolve => require(['./page/SchoolFeatureDispatch'], resolve), meta: { title: '学校' }},
      // 指令回复链接
      {name: 'educationCommandDispatch', path: 'command_dispatch/:featureCode', component: resolve => require(['./page/CommandDispatch'], resolve), meta: { title: '身份选择' }},
      {name: 'educationParentBindPublic', path: 'parent_bind_public/:parentId/student/:studentId', component: resolve => require(['./page/ParentBindPublic'], resolve), meta: { title: '验证' }},
      // {name: 'educationOrgSetting', path: 'org_setting', component: resolve => require(['./page/org/OrgSetting.vue'], resolve), meta: { title: '群设置' }}
      {name: 'educationOrgSetting', path: 'org_setting', component: resolve => require(['./page/org/OrgSetting.vue'], resolve), meta: { title: '群设置' }},
      {name: 'educationChangeNick', path: 'change_nick', component: resolve => require(['./page/org/ChangeNick.vue'], resolve), meta: { title: '修改助手昵称' }},
      {name: 'educationBindStudentPublic', path: 'bind_student', component: resolve => require(['./page/BindStudentPublic.vue'], resolve), meta: { title: '关注我们' }},
      {name: 'educationSchoolOpenOrg', path: 'org/open', component: resolve => require(['./page/org/OpenOrg'], resolve), meta: {title: '开通群'}},
      {name: 'educationHelpPage', path: 'help_page/:type', component: resolve => require(['./page/user/HelpPage'], resolve), meta: {title: '帮助'}},
      {name: 'educationFeatureSetting', path: 'feature_setting', component: resolve => require(['./page/FeatureSetting'], resolve), meta: {title: '学校功能开关设置'}},
      {name: 'educationApplyBindParents', path: 'apply_bind_parents', component: resolve => require(['./page/user/ApplyBindParents'], resolve), meta: {title: '家长信息'}},
      {name: 'educationApplyBindTeacher', path: 'apply_bind_teacher', component: resolve => require(['./page/user/ApplyBindTeacher'], resolve), meta: {title: '教师信息'}},
      {name: 'educationValidateBindParents', path: 'validate_bind_parents', component: resolve => require(['./page/user/ValidateBindParents'], resolve), meta: {title: '验证'}},
      {name: 'educationValidateBindTeacher', path: 'validate_bind_teacher', component: resolve => require(['./page/user/ValidateBindTeacher'], resolve), meta: {title: '验证'}},
      {
        path: '/',
        component: resolve => require(['./page/personal/PersonalIndex'], resolve),
        children: [
          {name: 'educationPersonalAddStudent', path: 'personal_add_student', component: resolve => require(['./page/personal/AddStudent'], resolve), meta: {title: '添加学生'}},
          {name: 'educationPersonalAddTeacher', path: 'personal_add_teacher', component: resolve => require(['./page/personal/AddTeacher'], resolve), meta: {title: '添加教师', keepAlive: true}},
          {name: 'educationPersonalEditTeacher', path: 'personal_edit_teacher/:teacherId', component: resolve => require(['./page/personal/AddTeacher'], resolve), meta: {title: '编辑教师', keepAlive: true}},
          {name: 'educationPersonalAddLessons', path: 'personal_add_lessons', component: resolve => require(['./page/LessonsModify'], resolve), meta: { title: '添加课程' }},
          {name: 'educationClassMessage', path: 'change_classmessage', component: resolve => require(['./page/personal/ChangeClassInfo'], resolve), meta: {title: '设置班级信息'}},
          {name: 'educationClassInfo', path: 'class_message', component: resolve => require(['./page/personal/ClassMessage'], resolve), meta: {title: '班级信息'}},
          {name: 'educationGroupManage', path: 'group_manage', component: resolve => require(['./page/personal/GroupManage'], resolve), meta: {title: '群管理'}},
          {name: 'educationTeacherReview', path: 'personal_review_t/:applyId', component: resolve => require(['./page/personal/TeacherReview'], resolve), meta: {title: '审核'}},
          {name: 'educationParentReview', path: 'personal_review_p/:applyId', component: resolve => require(['./page/personal/ParentReview'], resolve), meta: {title: '审核'}}
        ]
      },
      {name: 'educationClassLessonsSetting', path: 'class_lessons_setting/:settingStatus', component: resolve => require(['./page/user/ClassLessonsSetting'], resolve), meta: {title: '任课设置'}},
      {name: 'educationAchievementDetail', path: 'achievement_detail/:achievementsId/student/:studentId', component: resolve => require(['./page/user/AchievementDetail'], resolve), meta: {title: '成绩详情'}},
      {name: 'educationStudentAchievementDetail', path: 'achievement_detail/:achievementsId', component: resolve => require(['./page/user/AchievementDetail'], resolve), meta: {title: '成绩详情'}},
      {name: 'educationParentsBindStudent', path: 'parents/bind_student', component: resolve => require(['./page/user/ParentsBindStudent'], resolve), meta: {title: '绑定学生'}}
    ]
  }
)

const schoolRouter = Array.of(
  {name: 'educationSchoolList', path: 'school_list', component: resolve => require(['./page/SchoolList'], resolve), meta: {title: '学校列表'}},
  {name: 'educationHomeJump', path: 'home_jump', component: resolve => require(['./page/Jump'], resolve), meta: {title: '空间跳转'}},
  {name: 'educationAgainCreateSchool', path: 'create_again/:schoolId', component: resolve => require(['./page/CreateSchool'], resolve), meta: { title: '创建学校' }},
  {name: 'educationCreateSchool', path: 'create', component: resolve => require(['./page/CreateSchool'], resolve), meta: { title: '创建学校' }},
  {name: 'educationRenew', path: 'renew/:schoolId', component: resolve => require(['./page/Renew'], resolve), meta: { title: '续费' }},
  {name: 'educationSchoolOrder', path: 'school_order/schoolId/:schoolId/renew/:isRenew', component: resolve => require(['./page/SchoolOrder'], resolve), meta: { title: '学校订单' }},
  {name: 'educationOpenOrg', path: 'org/open', component: resolve => require(['./page/org/OpenOrg'], resolve), meta: {title: '开通群'}},
  {name: 'educationCreatedClass', path: 'create_class', component: resolve => require(['./page/personal/CreatedClass'], resolve), meta: {title: '创建班级'}},
  {name: 'educationInviteCreatedClass', path: 'create_class/:inviteUserId', component: resolve => require(['./page/personal/CreatedClass'], resolve), meta: {title: '创建班级'}},
  {name: 'educationAgainCreatedClass', path: 'again_class/:schoolId', component: resolve => require(['./page/personal/CreatedClass'], resolve), meta: {title: '创建班级'}},
  {name: 'educationClassOrder', path: 'class_order/:schoolId', component: resolve => require(['./page/personal/ClassOrder'], resolve), meta: {title: '班级订单'}},
  {name: 'educationRedPacket', path: 'red_packet', component: resolve => require(['./page/personal/RedPacket'], resolve), meta: {title: '我的红包'}},
  {name: 'educationTaskDetail', path: 'task_detail/:type', component: resolve => require(['./page/personal/TaskDetail'], resolve), meta: {title: '首次红包任务'}},
  {name: 'educationSharePage', path: 'share_page', component: resolve => require(['./page/personal/SharePage'], resolve), meta: {title: '分享'}},
  {name: 'educationPersonalJoinUsForUserId', path: 'join_us/:inviteUserId', component: resolve => require(['./page/personal/JoinUs'], resolve), meta: {title: '班级微信群管理神器'}},
  {name: 'educationPersonalJoinUs', path: 'join_us', component: resolve => require(['./page/personal/JoinUs'], resolve), meta: {title: '班级微信群管理神器'}},
  {name: 'educationPersonalQRCode', path: 'perorg_qrcode', component: resolve => require(['./page/personal/OrgQRCode'], resolve), meta: {title: '加入我们'}},
  {name: 'educationReceiveMessageSetting', path: 'receive_setting', component: resolve => require(['./page/user/ReceiveMessageSetting'], resolve), meta: {title: '接收消息设置'}}
)

export {educationRouter, schoolRouter}
