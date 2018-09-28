<template>
  <div>
    <flexbox style="margin-top:30px;margin-bottom:30px;">
      <flexbox-item><x-button plain style="font-size:15px;width:120px;color:#2E84D4; border: 1px solid #2E84D4;background:#fff" @click.native="scoreClass('score')">星级班级评定</x-button></flexbox-item>
      <flexbox-item><x-button plain style="font-size:15px;width:120px;color:#2E84D4; border: 1px solid #2E84D4;background:#fff" @click.native="scoreClass('student')">学生操行评定</x-button></flexbox-item>
    </flexbox>
    <group>
      <cell title="星级班级评定报告" is-link :link="{name: 'educationScoreClassEvaluateSituation'}"></cell>
      <cell title="班级评定扣分查询" is-link :link="{name: 'educationScoreClassItemList'}"></cell>
    </group>
    <group gutter="10px">
      <cell title="学生操行评定报告" is-link :link="{name: 'educationScoreStudentEvaluateSituation'}"></cell>
      <cell title="学生评定加／减分查询" is-link :link="{name: 'educationScoreStudentItemList'}"></cell>
    </group>
    <group gutter="10px">
      <cell title="核查请假情况" is-link :link="{name: 'educationCheckLeaveInfo'}"></cell>
    </group>
    <group title="高级设置">
      <cell title="星级班级评定项设置" is-link :link="{name: 'educationScoreItemClassSetting'}"></cell>
      <cell title="学生操行评定项设置" is-link :link="{name: 'educationScoreItemStudentSetting'}"></cell>
      <cell title="年级组德育管理设置" is-link :link="{name: 'educationMoralGradeSetting'}"></cell>
      <cell title="星级班级评定员设置" is-link :link="{name: 'educationClassAssessorSetingAdmin', params: {type: 'admin'}}"></cell>
      <cell title="请假设置" is-link :link="{name: 'educationMoralLeaveSetting'}"></cell>
      <cell title="考勤设置" is-link :link="{name: 'educationMoralCheckSetting'}"></cell>
    </group>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import { Group, Cell, Flexbox, FlexboxItem, XButton } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
// import api from '@/feature/moral/api'
export default {
  components: {
    Group, Cell, Flexbox, FlexboxItem, XButton, DetailTabbar
  },
  mounted () {
  },
  methods: {
    scoreClass (type) {
      if (type === 'student') {
        this.$router.push({'name': 'educationStudentConductEvaluate'})
      } else {
        this.$router.push({'name': 'educationScoreClassEvaluate'})
      }
    }
  }
}
</script>

<style>

</style>
