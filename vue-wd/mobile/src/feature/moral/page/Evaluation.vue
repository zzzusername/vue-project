<template>
  <div>
    <flexbox style="margin-top:30px;margin-bottom:30px;">
      <flexbox-item v-if="teacherInfo.isDeyu || teacherInfo.isGrade">
        <x-button plain style="font-size:15px;width:120px;color:#2E84D4; border: 1px solid #2E84D4;background:#fff" @click.native="scoreClass('score')">星级班级评定</x-button>
      </flexbox-item>
      <flexbox-item>
        <x-button plain style="font-size:15px;width:120px;color:#2E84D4; border: 1px solid #2E84D4;background:#fff" @click.native="scoreClass('student')">学生操行评定</x-button>
      </flexbox-item>
    </flexbox>
    <group>
      <cell v-if="teacherInfo.isDeyu || teacherInfo.isGrade" title="星级班级评定报告" is-link :link="{name: 'educationScoreClassEvaluateSituation'}"></cell>
      <cell v-if="teacherInfo.isDeyu || teacherInfo.isGrade || teacherInfo.isAdviser" title="班级评定扣分查询" is-link :link="{name: 'educationScoreClassItemList'}"></cell>
      <cell v-if="teacherInfo.isAdviser" title="我的班级评定报告" is-link :link="{name: 'educationMoralMyClassScoreList'}"></cell>
    </group>
    <group gutter="10px">
      <cell title="学生操行评定报告" is-link :link="{name: 'educationScoreStudentEvaluateSituation'}"></cell>
      <cell title="学生评定加／减分查询" is-link :link="{name: 'educationScoreStudentItemList'}"></cell>
    </group>
    <group v-if="teacherInfo.isAdviser || teacherInfo.isGrade" title="高级设置">
      <cell title="学生操行评定员设置" v-if="teacherInfo.isAdviser" is-link :link="{name: 'educationMoralClassAssessorManage'}"></cell>
      <cell title="星级班级评定员设置" v-if="teacherInfo.isGrade" is-link :link="{name: 'educationClassAssessorSetingManage', params: {type: 'manage'}}"></cell>
    </group>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import DetailTabbar from '@/components/DetailTabbar.vue'
import { Group, Cell, Flexbox, FlexboxItem, XButton } from 'vux'
import api from '@/feature/moral/api'
export default {
  components: {
    Group, Cell, Flexbox, FlexboxItem, XButton, DetailTabbar
  },
  data () {
    return {
      teacherInfo: {}
    }
  },
  mounted () {
    api.getMoralTeacherInfo({schoolId: this.$route.params.schoolId}, (data) => {
      this.teacherInfo = data
    }, () => {})
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
