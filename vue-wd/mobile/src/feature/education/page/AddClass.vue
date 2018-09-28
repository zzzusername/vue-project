<template>
  <div>
    <group gutter="0" label-align="left">
      <x-input label-width="9em" v-model="info.className" placeholder="请输入班级名">
        <p slot="label" v-if="gradeId && gradeInfo" style="marginRight: 5px;"><span>班级名称</span>&nbsp;&nbsp;&nbsp;<span style="color: #555">{{gradeInfo.gradeName}}</span></p>
        <p slot="label" style="marginRight: 10px;" v-else>班级名称</p>
      </x-input>
      <cell title="班级类型" :value="(gradeId || $route.params.classType == 1)?'行政班':'兴趣班'"></cell>
      <cell title="班主任" @click.native="selectTeacher" :value="teacherName" is-link>
        <p slot="inline-desc">可以创建班级群、添加／删除学生</p>
      </cell>
      <x-switch v-if="showCreatOrg" title="允许班主任关联微信群" v-model="info.isTeacherCreateOrg"></x-switch>
      <cell title="关联学生群" is-link @click.native="() => { orgType = 2, showOrgList = true, defaultOrg = Object.assign({}, tempStuOrg) }" :value="stuOrgName"></cell>
      <cell title="关联家长群" is-link @click.native="() => { orgType = 3, showOrgList = true, defaultOrg = Object.assign({}, tempParentOrg) }" :value="parentOrgName"></cell>
    </group>
    <detail-tabbar :actionLink="submit" :actions="actions"></detail-tabbar>
    <teacher-list :single="true" :show="isShowTeacherList" :callback="teacherListCallBack" :load="teacherListLoadData" :search="teacherListSearch"></teacher-list>
    <org-list :show="showOrgList" :org-type="orgType" :classId="String($route.params.classId)" :defaultOrg="defaultOrg" @select-value="selectOrgValue" @close="showOrgList = false"></org-list>
  </div>
</template>

<script>
import { Group, Cell, XSwitch, XInput } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import TeacherList from '../components/TeacherList.vue'
import OrgList from '../components/OrgList.vue'
import api from '../api'
export default {
  components: {
    Group, Cell, XSwitch, XInput, DetailTabbar, TeacherList, OrgList
  },
  data() {
    return {
      actions: [{ name: '提交' }],
      info: {
        className: null,
        classTeacherId: null,
        isTeacherCreateOrg: true,
        orgId: null,
        parentOrgId: null
      },
      teacherName: null,
      stuOrgName: null,
      tempStuOrg: null,
      tempParentOrg: null,
      parentOrgName: null,
      showOrgList: false, // orglist组件显示/隐藏
      isShowTeacherList: false, // teacherlist组件显示/隐藏
      showCreatOrg: false, // 允许班主任关联微信群条目显示与隐藏
      orgType: 0,
      defaultOrg: null,
      gradeInfo: null,
      classInfo: null
    }
  },
  computed: {
    gradeId() {
      return this.$route.params.gradeId
    },
    classId() {
      return this.$route.params.classId
    }
  },
  mounted() {
    if (this.gradeId) {
      api.getGradeInfo({schoolId: this.$route.params.schoolId, gradeId: this.gradeId}, (data) => {
        this.gradeInfo = data
      }, (er) => { this.error(er, '获取年级信息失败') })
    }
    if (this.classId) {
      api.getClassInfo({ schoolId: this.$route.params.schoolId, classId: this.$route.params.classId }, (data) => {
        this.classInfo = data
        this.info.className = data.classInfoName
        this.info.classTeacherId = data.classTeacherId
        this.teacherName = data.classTeacherName
        if (data.classTeacherId) {
          this.showCreatOrg = true
          this.info.isTeacherCreateOrg = data.isTeacherCreateOrg
        }
        this.stuOrgName = data.orgName
        this.info.orgId = data.orgId
        if (!this.tools.isNull(data.orgId)) {
          this.tempStuOrg = {
            orgName: data.orgName,
            orgId: data.orgId
          }
        }
        this.parentOrgName = data.parentOrgName
        this.info.parentOrgId = data.parentOrgId
        if (!this.tools.isNull(data.parentOrgId)) {
          this.tempParentOrg = {
            orgName: data.parentOrgName,
            orgId: data.parentOrgId
          }
        }
      }, (er) => { this.error(er, '获取班级信息失败') })
    }
  },
  methods: {
    submit() {
      console.log(this.info)
      if (!this.info.className || this.info.className === '') {
        this.tools.warnToast('班级名不能为空')
        return
      }
      if (this.classId) {
        api.editClass({ schoolId: this.$route.params.schoolId, classId: this.$route.params.classId, info: this.info }, (data) => {
          this.tools.successToast('修改成功')
          this.$router.go(-1)
        }, (er) => { this.error(er, '修改失败') })
      } else {
        let classType = 1
        if (this.$route.params.classType !== null && this.$route.params.classType !== undefined) {
          classType = this.$route.params.classType
        }
        api.addClass({schoolId: this.$route.params.schoolId, gradeId: this.gradeId, classType, info: this.info}, (data) => {
          this.tools.successToast('保存成功')
          this.$router.go(-1)
        }, (er) => { this.error(er, '保存失败') })
      }
    },
    selectTeacher() {
      this.isShowTeacherList = true
    },
    selectOrgValue(val) {
      if (this.orgType === 2) {
        if (val.length === 0) {
          this.stuOrgName = null
          this.info.orgId = null
          this.tempStuOrg = null
        } else {
          try {
            let obj = JSON.parse(val[0])
            this.stuOrgName = obj.orgName
            this.info.orgId = obj.orgId
            this.tempStuOrg = obj
          } catch (error) {
          }
        }
      } else {
        if (val.length === 0) {
          this.parentOrgName = null
          this.info.parentOrgId = null
          this.tempParentOrg = null
        } else {
          try {
            let obj = JSON.parse(val[0])
            this.parentOrgName = obj.orgName
            this.info.parentOrgId = obj.orgId
            this.tempParentOrg = obj
          } catch (error) {
          }
        }
      }
    },
    teacherListSearch(keyword, cb) {
      api.getTeacherList({ schoolId: this.$route.params.schoolId, teacherName: keyword, rowStart: 0, rowCount: 9999 }, (data) => {
        cb(data)
      }, (er) => { })
    },
    teacherListCallBack({ status, teacher }, cb) {
      if (status === 'cancel') {
        this.isShowTeacherList = false
      } else if (status === 'success') {
        this.info.classTeacherId = teacher.teacherId
        this.teacherName = teacher.teacherName
        this.showCreatOrg = true
        cb()
      }
    },
    teacherListLoadData(cb) {
      api.getTeacherList({ schoolId: this.$route.params.schoolId, teacherName: null, rowStart: 0, rowCount: 9999 }, (data) => {
        cb(data)
      }, (er) => { })
    },
    error(er, hint) {
      if (er.toUser) {
        this.tools.warnToast(er.message)
        return
      }
      this.tools.warnToast(hint)
    }
  }
}
</script>

<style>

</style>
