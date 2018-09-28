<template>
  <div>
    <group gutter="0" v-if="studentInfo != null">
      <cell :title="studentInfo.studentName">
        <div slot="icon" class="student_head_img" :style="{'background-image':'url('+tools.cdn(studentInfo.userIcon, 'head.png', 128)+')'}" src=""></div>
      </cell>
    </group>
    <div :style="{'position': 'relative', 'height': scrollerHeight + 'px'}">
      <scroller :on-infinite="infinite" no-data-text="没有更多留言～" ref="manage_scroller">
        <div>
          <group gutter="10px" v-if="messageList.length>0">
            <cell v-for="(item, index) in messageList" :key="index" @click.native="goDetail(item, index)">
              <span slot="title" style="font-size:16px;margin-top:5px;color:#282828;overflow:hidden;text-overflow:ellipsis;word-break:break-all;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">{{item.message}}</span>
              <p v-if="item.state === 1" slot="inline-desc" style="margin-top:15px;"><span style="color:#8ebf52">发送给</span>：{{item.desc}} <span style="float:right">{{tools.formateTime(item.replyUpdateDate, 'MM-DD')}}</span></p>
              <p v-else slot="inline-desc" style="margin-top:15px;"><span style="color:#2067FB">来自于</span>：{{item.desc}} <span style="float:right">{{tools.formateTime(item.replyUpdateDate, 'MM-DD')}}</span></p>
              <badge v-if="item.unreadCount > 0" :text="item.unreadCount"></badge>
            </cell>
          </group>
        </div>
      </scroller>
      <p v-if="noData" style="textAlign:center;marginTop:20px;color:#999;font-size:14px">您还没有任何留言～</p>
    </div>
    <detail-tabbar :actionLink="onCreate" :actions="actions"></detail-tabbar>
  </div>
</template>

<script>
import DetailTabbar from '@/components/DetailTabbar.vue'
import { Group, Cell, Badge } from 'vux'
import eduApi from '@/feature/education/api'
import api from '../api'
export default {
  components: {
    DetailTabbar, Group, Cell, Badge
  },
  data () {
    return {
      actions: [{name: '写留言'}],
      scrollerHeight: 0,
      messageList: [
      ],
      studentInfo: null,
      identityState: 0,
      userInfo: {},
      noData: false
    }
  },
  mounted () {
    this.scrollerHeight = window.innerHeight - 50
    if (!this.tools.isNull(this.$route.params.studentId)) {
      this.scrollerHeight = window.innerHeight - 50 - 44
      eduApi.queryStudentInfo({schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId}, (data) => {
        this.studentInfo = data
      }, () => {})
    }
  },
  methods: {
    goDetail (item) {
      if (item.state === 1 && item.userName.split(',').length > 1) {
        if (this.tools.isNull(this.$route.params.studentId)) {
          this.$router.push({name: 'educationMessageConversation', params: {messageId: item.messageId}})
        } else {
          this.$router.push({name: 'educationMessageConversationForParents', params: {messageId: item.messageId, studentId: this.$route.params.studentId}})
        }
      } else {
        this.$router.push({name: 'educationMessageLiveMessage', params: {memberId: item.memberId}})
      }
    },
    onCreate () {
      if (this.tools.isNull(this.$route.params.studentId)) {
        // 教师或学生创建留言
        this.$router.push({name: 'educationMessageCreate'})
      } else {
        // 家长为孩子创建留言
        this.$router.push({name: 'educationMessageCreateForParents', params: {studentId: this.$route.params.studentId}})
      }
    },
    infinite(done) {
      this.localStorage.getUserInfo({schoolId: this.$route.params.schoolId}, (data) => {
        this.userInfo = data
        if (this.tools.isNull(this.$route.params.studentId)) {
          if (data.isStudent === true) {
            this.identityState = 2
          } else {
            this.identityState = 1
          }
        } else {
          this.identityState = 3
        }
        this.queryMessageList(this.messageList.length, (data) => {
          this.messageList = this.messageList.concat(data)
          this.messageList.forEach(element => {
            let desc = ''
            if (!this.tools.isNull(element.userName)) {
              if (element.userName.split(',').length > 2) {
                desc = element.userName.split(',')[0] + ',' + element.userName.split(',')[1] + ' 等' + element.userName.split(',').length + '人的留言'
              } else {
                desc = element.userName + ' 的留言'
              }
            }
            element.desc = desc
          })
          if (this.messageList.length === 0) {
            this.noData = true
          }
          if (data.length >= 20) {
            done()
          } else {
            done(true)
          }
        })
      }, () => {})
    },
    queryMessageList (rowStart, callback) {
      var rowCount = 20
      api.queryMessageList({schoolId: this.$route.params.schoolId, identityState: this.identityState, studentId: this.$route.params.studentId, rowStart, rowCount}, (data) => {
        callback(data)
      }, () => {})
    }
  }
}
</script>

<style>
.message_list_head_icon {
  width: 50px;
  height:50px;
  border-radius: 2px;
  background-position: center center;
  background-size: cover;
  border-style:none;
  border-width:0;
  position: absolute;
  top: 10px;
  left: 10px;
}
</style>
