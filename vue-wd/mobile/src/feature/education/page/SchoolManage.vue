<template>
    <div>
      <Group v-if="isShow == true" gutter="0">
        <Cell title="完善学校信息" is-link :link="{name: 'educationSchoolMessage'}"></Cell>
        <Cell title="基础设置" is-link :link="{name: 'educationBaseSetting'}"></Cell>
        <Cell title="高级设置" is-link :link="{name: 'educationAdvancedSetting'}"></Cell>
        <Cell title="教师管理" is-link :link="{name: 'educationTeacherManage'}"></Cell>
        <Cell title="班级管理" is-link :link="{name: 'educationClassManage'}"></Cell>
        <Cell title="课程管理" is-link :link="{name: 'educationLessonsManage'}"></Cell>
        <Cell title="学生管理" is-link @click.native="studentManage"></Cell>
        <Cell title="权限管理" is-link :link="{name: 'educationRoleManage'}"></Cell>
        <Cell title="学校群管理" is-link :link="{name: 'educationGroupList'}"></Cell>
      </Group>
      <p v-else style="text-align:center;font-size: 16px;padding: 5px 15px;fontSize:16px;color:#a2a2a2; margin-top:20px;">{{desc}}</p>
      <Group>
        <cell is-link :link="{name: 'educationRenew', params:{'schoolId': this.$route.params.schoolId}}">
          <p slot="title" style="color:#2E84D4">续费</p>
        </cell>
        <cell is-link @click.native="help">
          <p slot="title" style="color:#FF6D56">帮助</p>
        </cell>
      </Group>
      <detail-tabbar></detail-tabbar> 
    </div>
</template>
<script>
  import { Group, Cell } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import userApi from '../../user/api'
  export default{
    components: {
      Group, Cell, DetailTabbar
    },
    data () {
      return {
        isShow: false,
        desc: ''
      }
    },
    mounted () {
      userApi.getIndustryInfo({code: 'EDUCATION'}, (data) => {
        if (data.businessStatus === 1) {
          this.isShow = true
        } else if (data.businessStatus === 3) {
          this.desc = '学校已欠费，请续费后使用'
        } else if (data.businessStatus === 2) {
          this.desc = '学校未付费，请付费后使用'
        }
      }, (er) => {})
    },
    methods: {
      help () {
        location.href = 'http://doc.qunxiaozhu.com/index.php?s=/page/1'
      },
      studentManage () {
        this.$router.push({name: 'educationStudentManage'})
      }
    }
  }
</script>
<style >

</style>

