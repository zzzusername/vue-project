<template>
  <div>
    <group gutter="10px">
      <cell>
        <p slot="title">问卷名：{{detail.questionTitle}}</p>
        <p slot="inline-desc">
          <span>问卷时长: {{tools.formateTime(detail.createDate, 'YYYY/MM/DD') + ' - ' + tools.formateTime(detail.endDate, 'YYYY/MM/DD')}}</span>
        </p>
      </cell>
    </group>
    <group title="单项结果统计">
      <cell v-for="(item, index) in list" :key="index" is-link @click.native="queryDetail(item)">
        <span slot="title">{{index + 1 + '、' + item.subjectTitle}}</span>
        <span slot="default">查看</span>
      </cell>
    </group>
    <detail-tabbar></detail-tabbar>
  </div>
</template>
<script>
  import {Group, Cell, XButton} from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import api from '../api'
  export default {
    components: {Group, Cell, DetailTabbar, XButton},
    data () {
      return {
        detail: {},
        list: []
      }
    },
    mounted () {
      api.queryResult({schoolId: this.$route.params.schoolId, questionId: this.$route.params.questionId}, (data) => {
        this.detail = data
      }, (er) => {})
      api.selectQuestionSubjecListToManage({schoolId: this.$route.params.schoolId, questionId: this.$route.params.questionId, rowStart: 0, rowCount: 99999999}, (data) => {
        this.list = data
      }, (er) => {})
    },
    methods: {
      queryDetail (item) {
        if (item.subjectType === 1) {
          this.$router.push({name: 'questionUserTextList', params: {questionId: this.$route.params.questionId, subjectId: item.subjectId}})
        } else {
          this.$router.push({name: 'questionQuestionSingleDetail', params: {questionId: this.$route.params.questionId, subjectId: item.subjectId}})
        }
      }
    }
  }
</script>
<style>

</style>

