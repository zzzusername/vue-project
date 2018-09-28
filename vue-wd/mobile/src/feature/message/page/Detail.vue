<template>
  <div>
    <div :style="{'position': 'relative', 'height': scrollerHeight + 'px'}" class="height_wrap">
      <scroller ref="manage_scroller">
        <div style="width:100%;height:10px;"></div>
        <div v-for="(item, index) in dataList" :key="index">
          <div class="message_wrap" style="overflow: hidden;margin-bottom:10px;" v-if="editSelf(item)">
            <div style="float: right;">
              <div class="head_icon" :style="{'background-image':'url('+tools.cdn(filterIcon(item), 'head.png', 128)+')', 'margin': '10px 5px 0 0'}"></div><!--v-bind:class="{right: editSelf(item)}"-->
              <!-- <p style="color:#999;text-align: center;">{{filterName(item)}}</p> -->
            </div>
            <div class="dialog_wrap" style="float:right;margin-right:25px;">
              <span class="bot" style="border-color: #f6f6f6 #f6f6f6 #beceeb #beceeb;right:-20px;"></span><!--v-bind:class="{hormRight: editSelf(item)}"-->
              <p>{{item.message}}</p>
              <div v-if="item.messageImg.length > 0" v-for="(img, index) in item.messageImg" :key="index" @click="previewImage(item.messageImg, index)" style="margin-top:5px;">
                <img slot="default" style="display:inline-block;width:100%;" :src="tools.cdn(img)"/>
              </div>
              <p style="color:#999;">发送时间：<span>{{tools.formateTime(item.createDate, 'YYYY-MM-DD HH:mm')}}</span></p>
              <span style="color:blue;" v-if="editSelf(item) && !item.read && !item.isOriginal" @click="revoke(item, index)">撤回</span>
            </div>
          </div>
          <div class="message_wrap" style="overflow: hidden;margin-bottom:10px;" v-else>
            <div style="float:left;">
              <div class="head_icon" :style="{'background-image':'url('+tools.cdn(filterIcon(item), 'head.png', 128)+')', 'margin': '10px 0 0 5px'}"></div><!--v-bind:class="{left: !editSelf(item)}"-->
              <p style="color:#999;text-align: center;">{{filterName(item)}}</p>
            </div>
            <div class="dialog_wrap" style="float:left;margin-left:25px;">
              <span class="bot" style="border-color:#f6f6f6 #beceeb #beceeb #f6f6f6;left:-20px;"></span><!--v-bind:class="{hormLeft: !editSelf(item)}"-->
              <!-- <span>{{filterName(item)}}说：</span> -->
              <p>{{item.message}}</p>
              <div v-if="item.messageImg.length > 0" v-for="(img, index) in item.messageImg" :key="index" @click="previewImage(item.messageImg, index)" style="margin-top:5px;">
                <img slot="default" style="display:inline-block;width:100%;" :src="tools.cdn(img)"/>
              </div>
              <p style="color:#999;">发送时间：<span>{{tools.formateTime(item.createDate, 'YYYY-MM-DD HH:mm')}}</span></p>
              <span style="color:blue;" v-if="editSelf(item) && !item.read && !item.isOriginal" @click="revoke(item, index)">撤回</span>
            </div>
          </div>
        </div>
      </scroller>
    </div>
    <div class="border_top" style="position:fixed;left:0;bottom:0;width:100%;height:50px;background:#fff;padding:6px 0;box-sizing: border-box;overflow: hidden;">
      <div style="float: left;height: 37px;width: 19%;text-align: center;line-height: 37px;" @click="goBack">
        <span class="iconfont icon-fanhui"></span>
      </div>
      <input type="text" v-model="message" ref="chat_input" class="border_input" style="-webkit-appearance: none;border-radius: 5px;text-indent: 1em;font-size:16px;height: 35px;width: 60%;outline:none;background:#fff;">
      <div style="float: right;height: 37px;width: 19%;text-align: center;line-height: 37px;" @click="reply">
        <span>回复</span>
      </div>
    </div>
    <div v-transfer-dom>
      <confirm v-model="showConfirm" @on-cancel="showConfirm = false" title="提示" @on-confirm="onConfirm">
        <p style="text-align:center;"><span style="color:#ff595a;">您确定撤回吗？</span></p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <alert v-model="showAlert" button-text="立即回执" title="提示" @on-hide="hideAlert"><span style="color:#ff595a;">您好，该留言要求您必须发送阅读回执！</span></alert>
    </div>
  </div>
</template>

<script>
import { Alert, Group, Cell, XInput, Confirm, TransferDomDirective as TransferDom } from 'vux'
import api from '../api'
export default {
  directives: {
    TransferDom
  },
  components: {
    Alert, Group, Cell, XInput, Confirm
  },
  data () {
    return {
      message: null,
      dataList: [],
      userInfo: {},
      showConfirm: false,
      item: {},
      tag: 0,
      scrollerHeight: 0,
      showAlert: false,
      beforeDestroy: false,
      messageMember: {},
      messageId: 0
    }
  },
  mounted () {
    this.scrollerHeight = window.innerHeight - 50
    this.localStorage.getUserInfo({schoolId: this.$route.params.schoolId}, (data) => {
      this.userInfo = data
    }, () => {})
    this.getData()
    // this.$nextTick(function () {
      // console.log(document.querySelector('.height_wrap').offsetHeight)
    // })
  },
  methods: {
    goBack () {
      this.$router.back()
      setTimeout(() => {
        if (!this.beforeDestroy) {
          if (this.messageMember.studentUserId !== this.userInfo.userId && this.messageMember.teacherUserId !== this.userInfo.userId) {
            // 家长
            this.$router.replace({name: 'educationMessageIndexForParents', params: {schoolId: this.$route.params.schoolId, studentId: this.messageMember.studentId}})
          } else {
            // 学生或教师
            this.$router.replace({name: 'educationMessageIndex', params: {schoolId: this.$route.params.schoolId}})
          }
        }
      }, 200)
    },
    hideAlert () {
      api.addReceiptMessage({schoolId: this.$route.params.schoolId, memberId: this.$route.params.memberId, replyBody: '我已查看'}, (data) => {
        this.getData()
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message, '200px')
        } else {
          this.tools.warnToast('回执失败')
        }
      })
    },
    onConfirm () {
      api.messageReplyRevocation({schoolId: this.$route.params.schoolId, replyId: this.item.replyId}, (data) => {
        this.tools.successToast('撤销成功')
        this.dataList.splice(this.tag, 1)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message, '200px')
        } else {
          this.tools.warnToast('撤销失败')
        }
      })
    },
    revoke (item, index) {
      this.showConfirm = true
      this.item = item
      this.tag = index
    },
    filterIcon (code) {
      if (code.isOriginal) {  // 是不是原始
        return code.teacherUserIcon
      } else {
        if (parseInt(code.replyType) === 1) {
          return code.teacherUserIcon
        } else if (parseInt(code.replyType) === 2) {
          return code.studentUserIcon
        } else if (parseInt(code.replyType) === 3) {
          return code.parentUserIcon
        }
      }
    },
    editSelf (code) {
      if (code.isOriginal) {  // 是不是原始
        if (code.teacherUserId === this.userInfo.userId) {
          return true
        } else {
          return false
        }
      } else {
        if (parseInt(code.replyType) === 1) {
          if (parseInt(code.teacherUserId) === this.userInfo.userId) {
            return true
          } else {
            return false
          }
        } else if (parseInt(code.replyType) === 2) {
          if (parseInt(code.studentUserId) === this.userInfo.userId) {
            return true
          } else {
            return false
          }
        } else if (parseInt(code.replyType) === 3) {
          if (parseInt(code.parentUserId) === this.userInfo.userId) {
            return true
          } else {
            return false
          }
        }
      }
    },
    filterName (code) {
      if (code.isOriginal) {  // 是不是原始
        return code.teacherName
      } else {
        if (parseInt(code.replyType) === 1) {
          return code.teacherName
        } else if (parseInt(code.replyType) === 2) {
          return code.studentName
        } else if (parseInt(code.replyType) === 3) {
          return code.parentName
        }
      }
    },
    getData () {
      api.messageMemberInfo({schoolId: this.$route.params.schoolId, memberId: this.$route.params.memberId}, (data) => {
        this.messageMember = data.messageMember
        this.messageId = data.message.messageId
        let imagesArr = []
        this.dataList = []
        if (!this.tools.isNull(data.message.messageImg)) {
          data.message.messageImg.split(',').forEach((element) => {
            imagesArr.push(element)
          }, this)
        }
        var dataOriginal = {
          'message': data.message.message,
          'createDate': data.message.createDate,
          'messageImg': imagesArr,
          'teacherName': data.name,
          'teacherUserIcon': data.userIcon,
          'teacherUserId': data.userId,
          'parentName': null,
          'parentUserIcon': null,
          'parentUserId': null,
          'studentUserIcon': null,
          'studentUserId': null,
          'studentName': null,
          'replyId': null,
          'replyType': null,
          'isOriginal': true,
          'read': null
        }
        if (data.list.length > 0) {
          for (let i = 0; i < data.list.length; i++) {
            let item = {
              'message': data.list[i].replyBody,
              'createDate': data.list[i].createDate,
              'studentUserIcon': data.list[i].studentUserIcon,
              'studentUserId': data.list[i].studentUserId,
              'studentName': data.list[i].studentName,
              'teacherName': data.list[i].teacherName,
              'teacherUserIcon': data.list[i].teacherUserIcon,
              'teacherUserId': data.list[i].teacherUserId,
              'parentName': data.list[i].parentName,
              'parentUserIcon': data.list[i].parentUserIcon,
              'parentUserId': data.list[i].parentUserId,
              'replyId': data.list[i].replyId,
              'replyType': data.list[i].replyType,
              'isOriginal': false,
              'read': data.list[i].read
            }
            this.dataList.push(item)
          }
        }
        this.dataList.unshift(dataOriginal)
        for (let i = 0; i < this.dataList.length; i++) {
          this.editSelf(this.dataList[i])
        }
        if (data.message.returnReceipt && !data.messageMember.isRead && data.userId !== this.userInfo.userId) {
          this.showAlert = true
        } else {
          this.showAlert = false
        }
      }, (er) => {})
    },
    reply () {
      if (this.message) {
        console.log(this.message)
        api.addLeaveMessage({schoolId: this.$route.params.schoolId, memberId: this.$route.params.memberId, replyBody: this.message}, (data) => {
          this.tools.successToast('回复成功')
          this.getData()
          this.message = null
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.tools.warnToast(er.message, '200px')
          } else {
            this.tools.warnToast('回复失败')
          }
        })
      }
    },
    previewImage (list, index) {
      var imgs = []
      for (let i = 0; i < list.length; i++) {
        imgs.push(this.tools.cdn(list[i]))
      }
      this.$wechat.previewImage({
        current: imgs[index],
        urls: imgs
      })
    }
  },
  beforeDestroy () {
    this.beforeDestroy = true
  }
}
</script>

<style>
.head_icon {
  width: 50px;
  height: 50px;
  display: inline-block; 
  border-radius: 6px;
  /* margin: 10px 0 0 5px; */
  background-position: center center;
  background-size: cover;
}
.dialog_wrap{
  width:55%;
  padding:15px 10px;
  background:#beceeb;
  position:relative;
  border-radius: 5px;
}
.dialog_wrap span.bot{
  width:0;
  height:0;
  font-size:0;
  overflow:hidden;
  position:absolute;
    border-width:10px;
  border-style:solid;
  top: 15px;
}
.border_input{
  border: 1px solid #C0BFC4;
}
@media screen and (-webkit-min-device-pixel-ratio: 2) {
  .border_input { border: 0.5px solid #999 }
}
@media screen and (-webkit-min-device-pixel-ratio: 3) {
  .border_input { border: 0.333333px solid #999 }
}
.border_top{
  border-top: 1px solid #C0BFC4;
}
@media screen and (-webkit-min-device-pixel-ratio: 2) {
  .border_top { border-top: 0.5px solid #999 }
}
@media screen and (-webkit-min-device-pixel-ratio: 3) {
  .border_top { border-top: 0.333333px solid #999 }
}
.message_wrap .right{
  float: right;
  margin: 10px 5px 0 0;
}
.message_wrap .left{
  float: left;
  margin: 10px 0 0 5px;
}
.dialog_wrap .hormLeft{
  border-color:#f6f6f6 #beceeb #beceeb #f6f6f6;left:-20px;
}
.dialog_wrap .hormRight{
  border-color: #f6f6f6 #f6f6f6 #beceeb #beceeb;right:-20px;
}
</style>
