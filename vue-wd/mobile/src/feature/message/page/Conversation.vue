<template>
  <div>
    <div :style="{'position': 'relative', 'height': scrollerHeight + 'px'}">
      <scroller >
        <group gutter="0">
          <cell :is-link="isShowEditButton" @click.native="onEdit">
            <p v-show="isShowEditButton" slot style="font-size:14px;text-align:center;">编辑</p>
            <p slot="title"  style="overflow:hidden;text-overflow:ellipsis;word-break:break-all;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">{{tools.isNull(conInfo.message)?'':conInfo.message.message}}</p>
            <!-- <p v-if="!tools.isNull(conInfo.message) && conInfo.message.returnReceipt == true" slot="inline-desc" style="margin-top:5px;">回执留言</p> -->
          </cell>
        </group>
        <p v-if="!tools.isNull(conInfo.message) && conInfo.message.returnReceipt == true && !tools.isNull(conInfo.unread) && conInfo.unread.length > 0" style="color:#2067FB;text-align:right;margin-top:5px;margin-right:10px;" @click="onPush">提醒阅读</p>
        <group gutter="5px">
          <cell v-for="(item, index) in conInfo.list" :key="index" is-link @click.native="readMessage(item)">
            <div class="avatar" slot="icon" :style="{'background-image':'url('+tools.cdn(item.userIcon, 'head.png', 128)+')'}"></div>
            <P slot="title">{{tools.isNull(item.studentName)?item.teacherName:item.studentName}} <span style="font-size:12px;color:#888;margin-left:5px;">{{tools.formateTime(item.replyDate, 'HH:mm')}}</span></P>
            <p slot="inline-desc" style="margin-top:5px;">{{item.replyBody}}</p>
            <badge v-if="item.unreadCount > 0" :text="item.unreadCount"></badge>
            <p v-else-if="!tools.isNull(conInfo.message) && conInfo.message.returnReceipt == true && item.read == false" style="color:#FF6D56;font-size:14px;">未反馈</p>
          </cell>
        </group>
      </scroller>
    </div>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import { Group, Cell, Badge } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '../api'
export default {
  components: {
    Group, Cell, Badge, DetailTabbar
  },
  data() {
    return {
      scrollerHeight: 0,
      conInfo: {},
      isShowEditButton: false
    }
  },
  mounted() {
    this.scrollerHeight = window.innerHeight - 50
    let schoolId = this.$route.params.schoolId
    let messageId = this.$route.params.messageId
    let studentId = this.$route.params.studentId
    api.queryConversationList({schoolId, messageId, studentId, rowStart: 0, rowCount: 999}, (data) => {
      this.conInfo = data
      this.localStorage.getUserInfo({schoolId: this.$route.params.schoolId}, (userInfo) => {
        if (userInfo.userId === this.conInfo.userId) {
          this.isShowEditButton = true
        }
      }, () => {})
    }, (er) => {
      if (er.toUser) {
        this.tools.warnToast(er.message)
      }
    })
  },
  methods: {
    readMessage (item) {
      this.$router.push({name: 'educationMessageLiveMessage', params: {memberId: item.memberId}})
    },
    onEdit () {
      if (!this.isShowEditButton) {
        return
      }
      let schoolId = this.$route.params.schoolId
      let messageId = this.$route.params.messageId
      let studentId = this.$route.params.studentId
      if (this.tools.isNull(studentId)) {
        this.$router.push({name: 'educationMessageEdit', params: {schoolId, messageId}})
      } else {
        this.$router.push({name: 'educationMessageEditForParents', params: {schoolId, messageId, studentId}})
      }
    },
    onPush() {
      let schoolId = this.$route.params.schoolId
      let messageId = this.$route.params.messageId
      api.pushLeaveMessage({schoolId, messageId}, (data) => {
        this.tools.toast('推送成功')
      }, () => {
        this.tools.toast('推送失败')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.avatar {
  width: 50px;
  height: 50px;
  display: block;
  margin-right: 5px;
  background-position: center center;
  background-size: cover;
}
.message_cell_title {
/*单行*/
  width:400px;
  overflow:hidden;
  text-overflow:ellipsis;
  -o-text-overflow:ellipsis;
  -webkit-text-overflow:ellipsis;
  -moz-text-overflow:ellipsis;
  white-space:nowrap;
}
</style>

