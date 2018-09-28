<template>
  <div :style="{'position': 'relative', 'height': scrollerHeight + 'px', 'margin-top': '-1px'}">
    <scroller :on-infinite="infinite" :on-refresh="refresh" no-data-text="没有更多投票项～" ref="manage_scroller">
      <group gutter="0">
        <cell is-link @click.native="showDetail">
          <p slot="title" style="font-size:16px;">{{info.voteName}}</p>
          <p style="font-size:14px;margin-top:3px;">预览</p>
          <p slot="inline-desc" style="margin-top:15px;font-size:12px;">
            <span v-if="info.voteStatus === 3" style="color:#FC5355">已结束</span>
            <span v-else>投票时间：{{getFormateDate(info.startDate)}} － {{getFormateDate(info.endDate)}}</span>
          </p>
        </cell>
      </group>
      <group title="活动概览">
        <cell>
          <div slot="title" style="width:100%">
            <ul class="total-ul">
              <li>投票选项数
                <br/>
                <span style="line-height: 30px;">{{countInfo.itemCount}}</span>
              </li>
              <li>参与投票人数
                <br/>
                <span style="line-height: 30px;">{{countInfo.votePeopleNum}}</span>
              </li>
              <li>总票数
                <br/>
                <span style="line-height: 30px;">{{countInfo.voteTotal}}</span>
              </li>
            </ul>
          </div>
        </cell>
      </group>
      <group title="投票情况">
        <cell v-for="(item, index) in itemList" :key="index" :title="item.title">
          <p slot="inline-desc"><span>编号：{{item.itemNo}}</span> <span style="margin-left:15px;">票数：{{item.voteNum}}</span></p>
          <p style="font-size:14px;" v-if="item.voteNum > 0">排名：{{item.rankNum}}</p>
        </cell>
      </group>
    </scroller>
    <detail-tabbar :actionLink="onAction" :actions="actions"></detail-tabbar>
  </div>
</template>

<script>
import { Cell, Group, dateFormat, AlertPlugin } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '@/feature/vote/api'
import Vue from 'vue'
Vue.use(AlertPlugin)
export default {
  components: {
    Cell, Group, DetailTabbar
  },
  data () {
    return {
      info: {},
      countInfo: {},
      scrollerHeight: 0,
      itemList: [],
      actions: []
    }
  },
  mounted () {
    this.scrollerHeight = window.innerHeight - 50

    api.getVoteInfo({schoolId: this.$route.params.schoolId, voteId: this.$route.params.voteId}, (data) => {
      this.info = data.base
      if (data.base.isPublish === true) {
        this.actions = [{
          name: '查看设置',
          code: 'info',
          color: '#46A0FC'
        }]
      }
      if (this.info.voteType === 'TEACHER' || this.info.voteType === 'STUDENT') {
        this.actions.push({
          name: '公布结果',
          code: 'push'
        })
      }
    }, () => {})
    api.getVoteCountResult({schoolId: this.$route.params.schoolId, voteId: this.$route.params.voteId}, (data) => {
      this.countInfo = data
    }, () => {})
  },
  methods: {
    getFormateDate (time) {
      return dateFormat(time, 'YYYY/MM/DD')
    },
    refresh(done) {
      this.itemList.splice(0, this.itemList.length)
      this.getManagerVoteItemList(0, (data) => {
        this.itemList.splice(0, this.itemList.length)
        this.itemList = this.itemList.concat(data)
        done(true)
      })
    },
    infinite(done) {
      this.getManagerVoteItemList(this.itemList.length, (data) => {
        this.itemList = this.itemList.concat(data)
        if (data.length >= 20) {
          done()
        } else {
          done(true)
        }
      })
    },
    getManagerVoteItemList (rowStart, callback) {
      var rowCount = 20
      api.getUserVoteItemList({schoolId: this.$route.params.schoolId, voteId: this.$route.params.voteId, orderStr: 'rank', rowStart, rowCount}, (data) => {
        data.forEach(element => {
          if (!this.tools.isNull(element.itemName)) {
            element.title = element.itemName
          } else if (!this.tools.isNull(element.studentName)) {
            element.title = element.studentName
          } else if (!this.tools.isNull(element.teacherName)) {
            element.title = element.teacherName
          }
        })
        callback(data)
      }, () => {})
    },
    showDetail () {
      if (this.info.voteType === 'TEXT') {
        this.$router.push({name: 'educationWordsVoteDetailForManage', params: {schoolId: this.$route.params.schoolId, voteId: this.$route.params.voteId}})
      } else {
        this.$router.push({name: 'educationPictureVoteDetailForManage', params: {schoolId: this.$route.params.schoolId, voteId: this.$route.params.voteId}})
      }
    },
    onAction (code) {
      if (code === 'info') {
        this.$router.push({name: 'educationSettingInfo', params: {schoolId: this.$route.params.schoolId, voteId: this.$route.params.voteId}})
      } else if (code === 'push') {
        api.publishVoteResult({schoolId: this.$route.params.schoolId, voteId: this.$route.params.voteId}, () => {
          this.tools.successToast('发布成功')
        }, (er) => {
          if (er.toUser) {
            this.$vux.alert.show({
              title: '提示',
              content: er.message
            })
          } else {
            this.$vux.alert.show({
              title: '提示',
              content: '发布失败'
            })
          }
        })
      }
    }
  }
}
</script>

<style>
  .total-ul li {
    width: 29%;
    height: 3rem;
    float: left;
    color: #666;
    list-style: none;
    text-align: center;
    padding-top: 0.4rem;
    /* padding-left: 0.2rem; */
    padding-bottom: 0.4rem;
    margin: 5px 0px 0px 2.8%;
    border: 1px solid #8ebf52;
    font-size: 13px;
  }

  .total-ul li span {
    margin-top:10px;
    color: #666;
    font-size: 14px;
  }
</style>
