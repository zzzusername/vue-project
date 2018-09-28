<template>
  <div>
    <div :style="{'height': scrollerHeight+'px', 'position': 'relative'}">
      <scroller :on-infinite="infinite" no-data-text="没有更多问卷～" >
        <div style="height: 10px" v-if="dataList.length==0"></div>
        <group title="教师问卷" v-if="dataList.length > 0">
          <cell style="background-color: #fff;font-size: 16px;" v-for="(item, index) in dataList" :key="index" :title="item.questionTitle" is-link @click.native="skipDetail(item)">
              <div slot="icon" class="question-list-img" :style="{'background-image':'url('+tools.cdn(item.questionImage, 'logo.png')+')'}"></div>
              <p slot="inline-desc">截止时间: <span>{{tools.formateTime(item.endDate, 'YYYY/MM/DD')}}</span>&nbsp;&nbsp;<span>{{item.number}}人参与</span></p>
              <p style="font-size: 14px;">{{item.isFinish ? '已结束' : '未结束'}}</p>
          </cell>
        </group>
      </scroller>
    </div>
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
        dataList: [],
        scrollerHeight: 0
      }
    },
    mounted () {
      this.scrollerHeight = window.innerHeight - 50
    },
    methods: {
      skipDetail (val) {
        let studentId = this.$route.params.studentId
        if (studentId) { // 家长
          this.$router.push({name: 'questionParentAnswerDetail', params: {questionId: val.questionId, studentId: studentId}})
        } else {
          this.$router.push({name: 'questionAnswerDetail', params: {questionId: val.questionId}})
        }
      },
      infinite (done) {
        this.getList(this.dataList.length, (data) => {
          this.dataList = this.dataList.concat(data)
          if (data.length > 20) {
            done()
          } else {
            done(true)
          }
        })
      },
      getList (rowStart, callback) {
        api.selectQuestionListToJoin({schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId, rowStart: rowStart, rowCount: 20}, (data) => {
          callback(data)
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.tools.warnToast(er.message)
          } else {
            this.tools.warnToast('获取信息失败')
          }
        })
      }
    },
    filters: {
      filterStatus (val) {
        if (val.isFinish) {
          return '已结束'
        } else {
          if (val.isAnswer) {
            return '已参与'
          } else {
            return '立即参与'
          }
        }
      }
    }
  }
</script>
<style>
.question-list-img {
  width: 3em;
  height: 3em;
  display: block;
  border-radius: 2px;
  margin-right: 10px;
  background-position: center center;
  background-size: cover;
  border-style:none;
  border-width:0;
}
</style>

