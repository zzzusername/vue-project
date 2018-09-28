<template>
  <div>
    <Group :gutter="0">
      <cell :title="roleName" :is-link="isDefault?false:true" @click.native="modifyRole">
        <p slot="inline-desc" style="color:#666;fontSize:12px;">{{featureList.length}} 项功能：{{featureList.join('、')}}</p>
        <p v-show="classList.length>0" slot="inline-desc" style="color:#666;fontSize:12px;margin-top:5px">关联班级：{{classList.join('、')}}</p>
        <p v-show="isShowWarn == true" slot="inline-desc" style="color:red;fontSize:12px;margin-top:5px">注意：此角色不可以手动添加或删除老师，只能通过拉老师入群或踢老师出群进行修改！必须保证老师已绑定微信号</p>
      </cell>
    </Group>
    <div v-if="this.teacherList.length>0">
      <Group title="成员列表">
        <cell v-for="(item, index) in teacherList" :key="index" :title="item.teacherName" :is-link="!isDefault" @click.native="showAction(item.teacherId)">
          <div slot="icon" class="teacher_list_img" :style="{'background-image':'url('+tools.cdn(item.userIcon, 'head.png', 128)+')'}" src=""></div>
        </cell>
      </Group>
    </div>
    <p style="text-align:center;font-size: 16px;padding: 5px 15px;fontSize:16px;color:#a2a2a2" v-else-if="isDefault == false">{{loadingText}}</p>
    <p style="text-align:center;font-size: 16px;padding: 5px 15px;fontSize:16px;color:#a2a2a2" v-else-if="isShowWarn == true">{{loadingDefaultText}}</p>
    <detail-tabbar :actionLink="onAction" :actions="actions" :isHideMe="!isDefault"></detail-tabbar>
    <actionsheet v-model="showMenu" :menus="managemenus" @on-click-menu="menuClick" show-cancel></actionsheet>
    <teacher-list :show="isShowTeacherList" :callback="teacherListCallBack" :load="teacherListLoadData" :search="teacherListSearch"></teacher-list>
  </div>
</template>
<script>
  import { Group, Cell, Actionsheet } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import api from '../api'
  import TeacherList from '../components/TeacherList.vue'
  export default{
    components: { Group, Cell, DetailTabbar, Actionsheet, TeacherList },
    data () {
      return {
        showMenu: false,
        teacherId: null,
        roleName: '',
        loadingText: '',
        loadingDefaultText: '',
        managemenus: {
          delete: '移除'
        },
        teacherList: [],
        actions: [],
        isShowTeacherList: false,
        featureList: [],
        classList: [],
        isDefault: true,
        isShowWarn: false
      }
    },
    mounted () {
      // let helpProgress = parseInt(this.localStorage.getHelpProgressForSchoolMaster(this.$route.params.schoolId))
      // if (helpProgress === 2) {
      //   this.isHideMe = true
      // }
      this.queryRoleTeacher()
      this.queryRoleFeature()
      this.queryRoleClass()
      this.queryRoleInfo()
    },
    methods: {
      queryRoleInfo () {
        api.getRoleInfo({schoolId: this.$route.params.schoolId, roleId: this.$route.params.roleId}, (data) => {
          this.roleName = data.roleName
          if (data.isGradeDefault === true || data.isDefault === true) {
            this.isDefault = true
          } else {
            this.isDefault = false
          }
          // if (this.isDefault === false) {
          this.actions = [{
            name: '修改权限',
            code: 'manage',
            color: '#2E84D4'
          }, {
            name: '添加教师',
            code: 'add'
          }]
          // } else {
          //   this.actions = [{
          //     name: '修改权限',
          //     code: 'manage',
          //     color: '#2E84D4'
          //   }]
          //   this.isShowWarn = true
          // }
        }, () => {})
      },
      queryRoleFeature () {
        api.getRoleFeature({schoolId: this.$route.params.schoolId, roleId: this.$route.params.roleId}, (data) => {
          data.forEach((element) => {
            if (element.isExist === true) {
              this.featureList.push(element.featureName)
            }
          }, this)
        }, (er) => {})
      },
      teacherListSearch (keyword, cb) {
        api.queryRoleTeacher({schoolId: this.$route.params.schoolId, roleId: this.$route.params.roleId, isExist: false, teacherName: keyword, userName: null, rowStart: 0, rowCount: 9999}, (data) => {
          cb(data)
        }, (er) => {})
      },
      teacherListLoadData (cb) {
        api.queryRoleTeacher({schoolId: this.$route.params.schoolId, roleId: this.$route.params.roleId, isExist: false, teacherName: null, userName: null, rowStart: 0, rowCount: 9999}, (data) => {
          cb(data)
        }, (er) => {})
      },
      onAction (val) {
        if (val === 'manage') {
          this.goRoleSetup()
        } else if (val === 'add') {
          this.isShowTeacherList = true
        }
      },
      queryRoleTeacher () {
        api.queryRoleTeacher({schoolId: this.$route.params.schoolId, roleId: this.$route.params.roleId, isExist: true, teacherName: null, userName: null, rowStart: 0, rowCount: 9999}, (data) => {
          this.teacherList = data
          if (data.length === 0) {
            this.loadingDefaultText = '请将老师微信加入到微信群中完成授权'
            this.loadingText = '您还没有添加成员！'
          }
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.tools.warnToast(er.message)
          } else {
            this.tools.warnToast('获取失败')
          }
        })
      },
      queryRoleClass () {
        api.queryClassList({schoolId: this.$route.params.schoolId, roleId: this.$route.params.roleId, isExist: true}, (data) => {
          data.forEach((element) => {
            this.classList.push(element.className)
          }, this)
        }, () => {})
      },
      modifyRole () {
        if (this.isDefault === true) {
          return
        }
        this.$router.push({name: 'educationEditRole', params: {roleId: this.$route.params.roleId}})
      },
      goRoleSetup () {
        this.$router.push({name: 'educationRoleFunctionSetup', params: {roleId: this.$route.params.roleId}})
      },
      showAction (val) {
        // if (this.isDefault === false) {
        this.showMenu = true
        this.teacherId = val
        // }
      },
      menuClick (key) {
        if (key === 'delete') {
          api.changeRoleTeahcer({
            schoolId: this.$route.params.schoolId,
            roleId: this.$route.params.roleId,
            teacherId: this.teacherId,
            isExist: false
          }, (data) => {
            this.tools.successToast('移除成功')
            this.queryRoleTeacher()
          }, (er) => {
            if (er.toUser !== undefined && er.toUser) {
              this.tools.warnToast(er.message)
            } else {
              this.tools.warnToast('移除失败')
            }
          })
        } else {
          this.showMenu = false
          this.teacherId = null
        }
      },
      teacherListCallBack ({status, teacher}, cb) {
        if (status === 'cancel') {
          this.isShowTeacherList = false
        } else if (status === 'success') {
          api.changeRoleTeahcer({
            schoolId: this.$route.params.schoolId,
            roleId: this.$route.params.roleId,
            teacherId: teacher.teacherId,
            isExist: true
          }, (data) => {
            cb(data)
            this.tools.successToast('添加成功')
            let helpProgress = parseInt(this.localStorage.getHelpProgressForSchoolMaster(this.$route.params.schoolId))
            if (helpProgress === 2) {
              this.localStorage.setHelpProgressForSchoolMaster(this.$route.params.schoolId, 3)
              this.$router.back()
              return
            }
            this.teacherList.push(teacher)
          }, (data) => {
            if (data.toUser) {
              this.tools.warnToast(data.message, '170px')
            } else {
              this.tools.warnToast('添加失败')
            }
          })
        }
      }
    }
  }
</script>
<style>
.teacher_list_img {
  width: 45px;
  height:45px;
  display: inline-block;
  border-radius: 5px;
  margin-right: 10px;
  background-position: center center;
  background-size: cover;
  border-style:none;
  border-width:0;
  vertical-align:middle;
}
.role-add-teacher-btn{
  width:130px !important; 
  height:36px; 
  line-height:36px;
  font-size: 15px;
  color: #8ebf52;
  border: 1px solid #8ebf52;
}
</style>
