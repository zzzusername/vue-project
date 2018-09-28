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
    <group gutter="10px" title="统计结果" v-if="detail.subjectType == '1'">
      <cell v-for="(item, index) in detail.texts" :key="index">
        <span slot="title">参与人数：{{item.answerCount}}</span>
        <p slot="inline-desc">百分比：{{item.pct}}%</p>
        <p slot="inline-desc">内容：{{item.valueDesc}}</p>
      </cell>
    </group>
    <div v-if="detail.subjectType == '2' || detail.subjectType == '3'">
      <load-more :tip="questionTitle" :show-loading="false" background-color="#f6f6f6"></load-more>
      <x-table :cell-bordered="false" :content-bordered="false" style="background-color:#fff;">
        <thead>
          <tr style="background-color: #fff">
            <th>选项</th>
            <th>数量</th>
            <th>百分比</th>
            <th>详情</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in detail.items" :key="index">
            <td style="width:45%;">{{item.itemNo + '、' + item.itemDesc}}</td>
            <td style="width:25%;">{{item.answerCount}}</td>
            <td style="width:15%;">{{item.pct !== null ? item.pct + '%' : '无'}}</td>
            <td style="width:15%;">
              <span @click="valueItem(item)" style="color: rgb(46, 132, 212);">详情</span>
            </td>
          </tr>
        </tbody>
      </x-table>
    </div>
    <div v-if="detail.subjectType == '4'">
      <load-more :tip="questionTitle" :show-loading="false" background-color="#fbf9fe"></load-more>
      <p style="background:#fff;padding: 5px 10px;">
        <span>平均评分：{{detail.scoreAverage | filterScore}}</span>
        <span>参与评价人数：{{detail.scoreApplyCount}}</span>
      </p>
      <x-table full-bordered style="background-color:#fff;">
        <thead>
          <tr>
            <th>评分</th>
            <th>非常不满意</th>
            <th>不满意</th>
            <th>一般</th>
            <th>满意</th>
            <th>非常满意</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>人数</td>
            <td v-for="(item, index) in detail.scores" :key="index">{{item.answerCount}}</td>
          </tr>
          <tr>
            <td>百分比</td>
            <td v-for="(item, index) in detail.scores" :key="index">{{item.pct}}%</td>
          </tr>
          <tr>
            <td>详情</td>
            <td v-for="(item, index) in detail.scores" :key="index">
              <span @click="goDetail(item)" style="color: rgb(46, 132, 212);">详情</span>
            </td>
          </tr>
        </tbody>
      </x-table>
    </div>
    <detail-tabbar></detail-tabbar>
  </div>
</template>
<script>
  import {Group, Cell, XTable, LoadMore, Divider, XButton} from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import api from '../api'
  export default {
    components: {Group, Cell, DetailTabbar, XTable, LoadMore, Divider, XButton},
    data () {
      return {
        detail: {},
        questionTitle: null
      }
    },
    mounted () {
      this.scores = []
      api.single({schoolId: this.$route.params.schoolId, questionId: this.$route.params.questionId, subjectId: this.$route.params.subjectId}, (data) => {
        this.detail = data
        this.questionTitle = '问题：' + data.subjectTitle
      }, (er) => {})
    },
    methods: {
      goDetail (item) {
        var obj = {
          type: 'alone'
        }
        Object.assign(obj, {valueScore: item.valueScore, subjectId: item.subjectId})
        this.$router.push({name: 'questionUserList', params: {questionId: this.$route.params.questionId}, query: obj})
      },
      valueItem (item) {
        var obj = {
          type: 'alone'
        }
        Object.assign(obj, {valueItemId: item.itemId, subjectId: item.subjectId})
        this.$router.push({name: 'questionUserList', params: {questionId: this.$route.params.questionId}, query: obj})
      }
    },
    filters: {
      filterScore (val) {
        if (val !== null && val !== undefined) {
          switch (val) {
            case 1:
              return '非常不满意'
            case 2:
              return '不满意'
            case 3:
              return '一般'
            case 4:
              return '满意'
            case 5:
              return '非常满意'
          }
        } else {
          return '无'
        }
      }
    }
  }
</script>
<style>

</style>

