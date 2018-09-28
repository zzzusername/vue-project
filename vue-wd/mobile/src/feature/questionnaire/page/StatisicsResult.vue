<template>
  <div>
    <group gutter="10PX">
      <cell>
        <p slot="title">问卷标题：{{resultData.questionTitle}}</p>
        <p slot="inline-desc">
          <span>
            截止日期: <i v-bind:class="{ active: resultData.endDate - new Date().getTime() < 0 }" style="font-style: normal;">{{resultData.endDate | filterTime}}</i>
          </span>
        </p>
      </cell>
    </group>
    <group gutter="10px">
      <cell title="完成问卷用户数" is-link :link="{name: 'questionUserList'}">
        <span slot="default">{{resultData.actorCount > 0 ? resultData.actorCount + '人' : '无'}}</span>
      </cell>
    </group>
    <div style="overflow: hidden;padding: 20px 20px;">
      <div style="float:left;">
        <x-button type="primary" :link="{name: 'questionSingleResult',params: {'questionId': this.$route.params.questionId}}">单项结果统计</x-button>
      </div>
      <div style="float:right;">
        <x-button type="primary" :link="{name: 'questionCrossStatistics', params: {questionId: this.$route.params.questionId}}">多项交叉统计</x-button>
      </div>
    </div>
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
        resultData: {}
      }
    },
    mounted () {
      api.queryResult({schoolId: this.$route.params.schoolId, questionId: this.$route.params.questionId}, (data) => {
        this.resultData = data
      }, (er) => {})
    },
    methods: {},
    filters: {
      filterTime (val) {
        if (val) {
          if (val - new Date().getTime() > 0) {
            return Math.ceil((val - new Date().getTime()) / 1000 / 60 / 60 / 24) + '天'
          } else {
            return '已过期'
          }
        }
      }
    }
  }
</script>
<style>
.active{
  color: red;
}
</style>

