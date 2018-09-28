<template>
  <div>
    <group gutter="0">
      <cell :title="lessonsInfo.lessonName" value="编辑" :link="{name: 'educationModifyLessons', params:{lessonId: $route.params.lessonId}}"></cell>
    </group>
    <group gutter="10px">
      <tab custom-bar-width="5em">
        <tab-item selected @on-item-click="onItemClick(1)">任课教师</tab-item>
        <tab-item @on-item-click="onItemClick(2)">开课班级</tab-item>
      </tab>
    </group>
    <group v-show="tabIndex==1" gutter="-1px">
      <cell v-for="(item, index) in teacherList" :key="index" :title="item.teacherName" is-link @click.native="onClickTeacher(index)">
        <div slot="icon" class="teacher_list_img" :style="{'background-image':'url('+tools.cdn(item.userIcon, 'head.png', 128)+')'}" src=""></div>
        <!--<p slot="inline-desc">数学老师</p>-->
      </cell>
    </group>
    <p v-show="tabIndex==1&&teacherList.length==0" style="text-align:center;font-size: 16px;padding: 15px 15px;fontSize:16px;color:#a2a2a2">您还没有添加任课教师</p>
    <group v-show="tabIndex==2" gutter="-1px">
      <cell v-for="(item, index) in classList" :key="index" :title="item.className" :value="item.classHour==null?'':item.classHour+'课时'" is-link @click.native="editClassInfo(index)">
        <p slot="inline-desc">任课教师：{{item.teacherName}}</p>
      </cell>
    </group>
    <p v-show="tabIndex==2&&classList.length==0" style="text-align:center;font-size: 16px;padding: 15px 15px;fontSize:16px;color:#a2a2a2">您还没有添加开课班级</p>
    <actionsheet v-model="showMenu" :menus="managemenus" @on-click-menu="menuClick" show-cancel></actionsheet>
    <teacher-list :show="isShowTeacherList" :callback="teacherListCallBack" :load="teacherListLoadData" :search="teacherListSearch"></teacher-list>
    <popup v-model="showAddClass" height="90%">
      <group label-width="5em" label-margin-right="0.5em" label-align="left">
        <cell v-show="isEdit==true" title="开课班级" :value="classInfo.className"></cell>
        <cell v-show="isEdit==false" title="开课班级" :value="classInfo.className" is-link @click.native="showClassList = !showClassList"></cell>
        <popup-picker v-show="popTeacherList.length>0" title="任课教师" show-name :data="popTeacherList" v-model="classTeacher" value-text-align="left"></popup-picker>
        <x-input title="课时" placeholder="选填" v-model="classHour" type="number"></x-input>
      </group>
      <class-list :show="showClassList" :selected="classList" @get-select-value="getSelect"></class-list>
      <div style="display:flex;position: fixed;width: 100vw;bottom: 0;height: 50px;">
        <div v-show="isEdit==true" style="flex: 1;background: #FF6D56" @click="deleteClass()">
          <p style="line-height: 50px; textAlign: center;color: #fff;">移除</p>
        </div>
        <div style="flex: 2;backgroundColor: #8ebf52" @click="confirmClass()">
          <p style="line-height: 50px; textAlign: center;color: #fff;">保存并提交</p>
        </div>
      </div>
    </popup>
    <actionsheet v-model="showDeleteClass" :menus="managemenusClass" @on-click-menu="menuClickDelete" show-cancel @on-click-menu-cancel="showDeleteClass=false"></actionsheet>
    <detail-tabbar :actionLink="submit" :actions="actions" isHideMe=true></detail-tabbar>
    <div v-transfer-dom>
      <confirm v-model="showConfirm" title="提示" theme="ios" @on-confirm="onConfirm">
        <p style="text-align:center;">{{ confirmHint }}</p>
      </confirm>
    </div>
  </div>
</template>

<script>
import { Group, Cell, Tab, TabItem, Actionsheet, Popup, XInput, PopupPicker, Confirm, TransferDomDirective as TransferDom } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import TeacherList from '../components/TeacherList.vue'
import ClassList from '../components/ClassList.vue'
import api from '../api'
export default {
  directives: {
    TransferDom
  },
  components: {
    Group, Cell, Tab, TabItem, DetailTabbar, TeacherList, Actionsheet, Popup, XInput, PopupPicker, ClassList, Confirm
  },
  data() {
    return {
      managemenus: {
        delete: '移除'
      },
      actions: [
        { name: '添加教师' }
      ],
      teacherList: [],
      classList: [],
      isShowTeacherList: false,
      showMenu: false,
      currentTeacherIndex: 0,
      tabIndex: 1,
      lessonsInfo: {lessonName: this.$route.params.lessonName},
      showAddClass: false,
      showTeacherListMenu: false,
      popTeacherList: [[]],
      classTeacher: [],
      showClassList: false,
      classInfo: {},
      classHour: '',
      isEdit: false,
      currentClassIndex: 0,
      showDeleteClass: false,
      managemenusClass: {},
      showConfirm: false,
      confirmHint: ''
    }
  },
  mounted () {
    api.getLessonsInfo({schoolId: this.$route.params.schoolId, lessonId: this.$route.params.lessonId}, (data) => {
      this.lessonsInfo = data
      if (data.lessonStatus === false) {
        this.$router.back()
      }
    }, () => {})
    this.onItemClick(1)
  },
  methods: {
    getSelect(val) {
      this.classInfo = JSON.parse(val)
    },
    onClickTeacher (index) {
      this.currentTeacherIndex = index
      this.showMenu = true
    },
    menuClick (key) {
      if (key === 'delete') {
        var item = this.teacherList[this.currentTeacherIndex]
        this.confirmHint = '您确定移除"' + item.teacherName + '"以及与开课班级的关系吗？'
        this.showConfirm = true
        this.showMenu = false
      } else {
        this.showMenu = false
      }
    },
    onConfirm () {
      var item = this.teacherList[this.currentTeacherIndex]
      api.delTeacherForLessons({schoolId: this.$route.params.schoolId, lessonId: this.$route.params.lessonId, teacherId: item.teacherId}, () => {
        this.teacherList.splice(this.currentTeacherIndex, 1)
        this.tools.successToast('移除成功')
      }, () => {})
    },
    teacherListSearch (keyword, cb) {
      api.selectTeacherListToLessons({schoolId: this.$route.params.schoolId, lessonId: this.$route.params.lessonId, teacherName: keyword}, (data) => {
        cb(data)
      }, () => {})
    },
    teacherListLoadData (cb) {
      api.selectTeacherListToLessons({schoolId: this.$route.params.schoolId, lessonId: this.$route.params.lessonId}, (data) => {
        cb(data)
      }, () => {})
    },
    teacherListCallBack ({status, teacher}, cb) {
      if (status === 'cancel') {
        this.isShowTeacherList = false
      } else if (status === 'success') {
        api.addTeacherToLessons({
          schoolId: this.$route.params.schoolId,
          lessonId: this.$route.params.lessonId,
          teacherId: teacher.teacherId
        }, (data) => {
          cb(data)
          this.tools.successToast('添加成功')
          this.teacherList.push(teacher)
          var item = {
            name: teacher.userName === null ? teacher.teacherName : teacher.teacherName + '(' + teacher.userName + ')',
            value: teacher.teacherId + ''
          }
          this.popTeacherList[0].push(item)
        }, (data) => {
          if (data.toUser) {
            this.tools.warnToast(data.message, '170px')
          } else {
            this.tools.warnToast('添加失败')
          }
        })
      }
    },
    getTeacherListForLessons () {
      api.getTeacherListForLessons({schoolId: this.$route.params.schoolId, lessonId: this.$route.params.lessonId}, (data) => {
        this.teacherList = data
        this.popTeacherList = [[]]
        this.teacherList.forEach((element) => {
          var item = {
            name: element.userName === null ? element.teacherName : element.teacherName + '(' + element.userName + ')',
            value: element.teacherId + ''
          }
          this.popTeacherList[0].push(item)
        }, this)
      }, () => {})
    },
    getClassForLessons () {
      api.getClassForLessons({schoolId: this.$route.params.schoolId, lessonId: this.$route.params.lessonId}, (data) => {
        this.classList = data
      }, () => {})
    },
    submit(code) {
      if (code === 'teacher') {
        this.isShowTeacherList = true
      } else if (code === 'class') {
        this.isEdit = false
        this.classTeacher = []
        this.classInfo = {}
        this.classHour = ''
        this.showAddClass = true
      }
    },
    onItemClick (tab) {
      this.tabIndex = tab
      if (tab === 1) {
        this.actions = [
          {
            name: '添加任课教师',
            code: 'teacher'
          }
        ]
        this.getTeacherListForLessons()
      } else if (tab === 2) {
        this.actions = [
          {
            name: '添加开课班级',
            code: 'class'
          }
        ]
        this.getClassForLessons()
      }
    },
    confirmClass () {
      if (this.tools.isNull(this.classInfo.classId)) {
        this.tools.warnToast('请先选择开课班级', '150px')
        return
      }
      if (this.tools.isNull(this.classTeacher[0])) {
        this.tools.warnToast('请先选择任课教师', '150px')
        return
      }
      if (!this.tools.isNull(this.classHour) && !/^\+?[1-9][0-9]*$/.test(this.classHour)) {
        this.tools.warnToast('课时输入有误', '170px')
        return
      }
      api.addClassToLessons({schoolId: this.$route.params.schoolId, lessonId: this.$route.params.lessonId, classId: this.classInfo.classId, teacherId: this.classTeacher[0], classHour: this.classHour}, (data) => {
        this.getClassForLessons()
        this.showAddClass = false
      }, (err) => {
        if (err.toUser) {
          this.tools.warnToast(err.message, '170px')
        } else {
          this.tools.warnToast('保存失败')
        }
      })
    },
    editClassInfo (index) {
      this.currentClassIndex = index
      var item = this.classList[index]
      this.isEdit = true
      this.classTeacher = [item.teacherId + '']
      this.classHour = item.classHour
      this.classInfo = {
        className: item.className,
        classId: item.classId + ''
      }
      this.showAddClass = true
    },
    deleteClass () {
      this.showDeleteClass = true
      this.managemenusClass = {
        'title.noop': '您确定删除此班级吗?<br/>',
        delete: '<span style="color:red">删除</span>'
      }
    },
    menuClickDelete () {
      api.deleteLessonsClass({schoolId: this.$route.params.schoolId, lessonId: this.$route.params.lessonId, classId: this.classInfo.classId}, () => {
        this.classList.splice(this.currentClassIndex, 1)
        this.tools.successToast('移除成功')
        this.showAddClass = false
      }, (data) => {
        if (data.toUser) {
          this.tools.warnToast(data.message, '170px')
        } else {
          this.tools.warnToast('移除失败')
        }
      })
    }
  }
}
</script>

<style>
.teacher_list_img {
  width: 44px;
  height:44px;
  display: block;
  border-radius: 2px;
  margin-right: 10px;
  background-position: center center;
  background-size: cover;
  border-style:none;
  border-width:0;
}
</style>
