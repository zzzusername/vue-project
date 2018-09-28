<template>
  <div>
    <group gutter="10px">
      <cell>
        <p slot="title">问卷名：{{resultData.questionTitle}}</p>
        <p slot="inline-desc" style="line-height:25px;">
          <span>问卷时长: {{tools.formateTime(resultData.createDate, 'YYYY/MM/DD') + ' - ' + tools.formateTime(resultData.endDate, 'YYYY/MM/DD')}}</span>
        </p>
      </cell>
    </group>
     <div :style="{'position': 'relative', 'height': scrollerHeight + 'px'}">
      <scroller :on-infinite="infinite" no-data-text="没有更多用户～" ref="manage_scroller">
        <div style="height: 10px" v-if="actorUser.length==0"></div>
        <group gutter="10px">
          <cell is-link v-for="(item, index) in actorUser" :key="index" @click.native="answerDetail(item)">
            <div slot="icon" class="user_manage_img" :style="{'background-image':'url('+tools.cdn(editImage(item), 'head.png', 128)+')'}"></div>
            <span slot="title">{{item | filterName}}</span>
            <span slot="inline-desc">答卷内容：{{item.valueDesc}}</span>
          </cell>
        </group>
      </scroller>
    </div>
    <detail-tabbar></detail-tabbar>
  </div>
</template>
<script>
  import {Group, Cell, XButton, GroupTitle} from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import api from '../api'
  export default {
    components: {Group, Cell, DetailTabbar, XButton, GroupTitle},
    data () {
      return {
        scrollerHeight: 0,
        resultData: {},
        actorUser: []
      }
    },
    mounted () {
      this.scrollerHeight = window.innerHeight - 79
      api.queryResult({schoolId: this.$route.params.schoolId, questionId: this.$route.params.questionId}, (data) => {
        this.resultData = data
      }, (er) => {})
    },
    methods: {
      answerDetail (item) {
        this.$router.push({name: 'questionAnswerDetail', params: {questionId: this.$route.params.questionId, answerId: item.answerId}})
      },
      // refresh (done) {
      //   this.getList(this.actorUser.length, (data) => {
      //     this.actorUser = this.actorUser.concat(data)
      //     if (data.length >= 20) {
      //       done()
      //     } else {
      //       done(true)
      //     }
      //   })
      // },
      infinite (done) {
        this.getList(this.actorUser.length, (data) => {
          this.actorUser = this.actorUser.concat(data)
          if (data.length >= 20) {
            done()
          } else {
            done(true)
          }
        })
      },
      getList (rowStart, callback) {
        api.singleText({schoolId: this.$route.params.schoolId, questionId: this.$route.params.questionId, subjectId: this.$route.params.subjectId, rowStart: rowStart, rowCount: 20}, (data) => {
          callback(data)
        }, (er) => {
          if (er.toUser) {
            this.tools.warnToast(er.message)
          }
        })
      },
      editImage (item) {
        if (item.studentId !== null && item.studentId !== undefined) {
          return item.studentUserIcon
        } else if (item.teacherId !== null && item.teacherId !== undefined) {
          return item.teacherUserIcon
        }
      }
    },
    filters: {
      filterName (item) {
        if (item.parentId !== null && item.parentId !== undefined) {
          return item.studentName + '的家长'
        } else if (item.studentId !== null && item.studentId !== undefined) {
          return item.studentName
        } else if (item.teacherId !== null && item.teacherId !== undefined) {
          return item.teacherName
        } else {
          return '匿名用户'
        }
      }
    }
  }
</script>
<style>
.user_manage_img {
  width: 12vw;
  height:12vw;
  display: inline-block;
  border-radius: 6px;
  margin-right: 10px;
  background-position: center center;
  background-size: cover;
  border-style:none;
  border-width:0;
  vertical-align:middle;
}
</style>
