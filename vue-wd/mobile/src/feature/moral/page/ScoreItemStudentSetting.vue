<template>
  <div>
    <p style="font-size: 14px;padding:10px 15px;color:#FC5355">请用电脑登陆edu.qunxiaozhu.com操作新增／编辑</p>
    <group gutter="0">
      <cell title="月基础分" :value="scoreObj.monthBaseStore ? scoreObj.monthBaseStore + '分': '未设置'"></cell>
      <cell title="加分项设置" is-link :link="{name: 'educationScoreStudentScoreOption', params: {projectType: 1}}"></cell>
      <cell title="减分项设置" is-link :link="{name: 'educationScoreStudentScoreOption', params: {projectType: 2}}"></cell>
      <cell title="系统加分项设置">
        <p slot="inline-desc">
          <span>学生一周内无任何违纪现象</span>
          <span style="margin-left: 10px">{{scoreObj.weekBonusStore?'+' + scoreObj.weekBonusStore : '未设置' }}分</span>
        </p>
      </cell>
    </group>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import { Group, Cell } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '../api'
export default {
  components: {
    Group, Cell, DetailTabbar
  },
  data() {
    return {
      scoreObj: {}
    }
  },
  mounted () {
    api.getStudentMoralBaseAndSysScore({schoolId: this.$route.params.schoolId}, (data) => {
      this.scoreObj = data
    }, (er) => {
      if (er.toUser) {
        this.tools.warnToast(er.message)
        return
      }
      this.tool.warnToast('获取信息失败')
    })
  }
}
</script>

<style>

</style>
