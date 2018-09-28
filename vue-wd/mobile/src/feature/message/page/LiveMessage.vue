<template>
  <div>
    <div :style="{'position': 'relative', 'height': scrollerHeight + 'px'}">
      <scroller ref="manage_scroller">
        <group :gutter="index !== 0 ? '10px' : '0px'" v-for="(item, index) in dataList" :key="index">
          <div>
            <cell>
              <div slot="icon" class="head_icon" :style="{'background-image':'url('+tools.cdn(filterIcon(item), 'head.png', 128)+')'}"></div>
              <span slot="title" style="margin-left: 10px;">{{filterName(item)}}</span>
              <span slot="inline-desc" style="margin-left: 10px;">{{tools.formateTime(item.createDate, 'YYYY-MM-DD HH:mm')}}</span>
              <span slot="child" style="font-size: 14px;top: -20px;position: relative;right: 0;top: -12px;color:#888;" v-if="item.isOriginal && item.teacherUserId === userInfo.userId" @click="editOriginal">编辑</span>
              <span slot="child" style="font-size: 14px;top: -20px;position: relative;right: 0;top: -12px;color:#999;" v-if="editSelf(item) && !item.read && !item.isOriginal" @click="revoke(item, index)">撤回</span>
            </cell>
            <div style="padding: 0 15px 10px 15px;">
              <p style="font-size:16px;color:rgb(86, 82, 82);">{{item.message}}</p>
              <div v-if="item.messageImg.length > 0" v-for="(img, index) in item.messageImg" :key="index" @click="previewImage(item.messageImg, index)" style="margin-top:5px;">
                <img slot="default" style="display:inline-block;width:100%;" :src="tools.cdn(img)"/>
              </div>
            </div>
          </div>
        </group>
      </scroller>
    </div>
    <div class="border_top" ref="input_wrap" style="position:fixed;left:0;bottom:0;width:100%;height:50px;background:#fff;padding:6px 0;box-sizing: border-box;overflow: hidden;">
      <div style="float: left;height: 37px;width: 19%;text-align: center;line-height: 37px;" @click="goBack">
        <span class="iconfont icon-fanhui" style="color:rgb(86, 82, 82);"></span>
      </div>
      <input type="text" v-model="message" @focus="focus" @blur="blur" ref="chat_input" class="border_input" style="-webkit-appearance: none;border-radius: 5px;text-indent: 1em;font-size:16px;height: 35px;width: 60%;outline:none;background:#fff;border-color:#ddd">
      <div style="float: right;height: 37px;width: 19%;text-align: center;line-height: 37px;" @click="reply">
        <span style="font-size: 16px;color:rgb(86, 82, 82);">回复</span>
      </div>
    </div>
    <div v-transfer-dom>
      <confirm v-model="showConfirm" @on-cancel="showConfirm = false" title="提示" @on-confirm="onConfirm">
        <p style="text-align:center;"><span style="color:#ff595a;">您确定撤回吗？</span></p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <alert v-model="showAlert" button-text="立即反馈" title="提示" @on-hide="hideAlert"><span style="color:#ff595a;">您好，该留言要求您必须发送阅读反馈！</span></alert>
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
      messageId: 0,
      messageType: null
    }
  },
  mounted () {
    this.scrollerHeight = window.innerHeight - 50
    this.localStorage.getUserInfo({schoolId: this.$route.params.schoolId}, (data) => {
      this.userInfo = data
    }, () => {})
    this.getData()
  },
  methods: {
    focus () {
      if (navigator.userAgent.match('iPhone')) {
        // this.$refs.input_wrap.scrollIntoView(false)
        // this.$refs.input_wrap.style.position = 'relative'
        setTimeout(() => {
          document.body.scrollTop = document.body.scrollHeight
        }, 600)
      }
    },
    blur () {
      if (navigator.userAgent.match('iPhone')) {
        // this.$refs.input_wrap.style.position = 'fixed'
      }
    },
    editOriginal () {
      if (this.messageMember.studentUserId !== this.userInfo.userId && this.messageMember.teacherUserId !== this.userInfo.userId) {
        // 家长
        this.$router.push({name: 'educationMessageEditForParents', params: {schoolId: this.$route.params.schoolId, messageId: this.messageId, studentId: this.messageMember.studentId}})
      } else {
        // 学生或教师
        this.$router.push({name: 'educationMessageEdit', params: {schoolId: this.$route.params.schoolId, messageId: this.messageId}})
      }
    },
    goBack () {
      this.$router.back()
      setTimeout(() => {
        if (!this.beforeDestroy) {
          if (this.messageType === 4) {
            this.$router.replace({name: 'educationMessageIndex', params: {schoolId: this.$route.params.schoolId}})
            return
          }
          if (this.messageMember.studentUserId !== this.userInfo.userId && this.messageMember.fromTeacherUserId !== this.userInfo.userId) {
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
      api.addReceiptMessage({schoolId: this.$route.params.schoolId, memberId: this.$route.params.memberId, replyBody: '我已知晓，谢谢！'}, (data) => {
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
        } else if (parseInt(code.replyType) === 4) {
          return code.teacherUserIcon
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
      console.log(code)
      if (code.isOriginal) {  // 是不是原始
        return code.teacherName
      } else {
        if (parseInt(code.replyType) === 1) {
          return code.teacherName
        } else if (parseInt(code.replyType) === 2) {
          return code.studentName
        } else if (parseInt(code.replyType) === 3) {
          return code.relationship
        } else if (parseInt(code.replyType) === 4) {
          return code.teacherName
        }
      }
    },
    getData () {
      api.messageMemberInfo({schoolId: this.$route.params.schoolId, memberId: this.$route.params.memberId}, (data) => {
        this.messageMember = data.messageMember
        this.messageType = data.message.messageType
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
          'read': null,
          'relationship': null
        }
        if (data.list.length > 0) {
          for (let i = 0; i < data.list.length; i++) {
            let item = {
              'message': data.list[i].replyBody,
              'createDate': data.list[i].createDate,
              'studentUserIcon': data.list[i].studentUserIcon,
              'studentUserId': data.list[i].studentUserId,
              'studentName': data.list[i].studentName,
              'teacherName': data.list[i].replyType === 1 ? data.list[i].fromTeacherName : data.list[i].replyType === 4 ? data.list[i].toTeacherName : null,
              'teacherUserIcon': data.list[i].replyType === 1 ? data.list[i].fromTeacherUserIcon : data.list[i].replyType === 4 ? data.list[i].toTeacherUserIcon : null,
              'teacherUserId': data.list[i].replyType === 1 ? data.list[i].fromTeacherUserId : data.list[i].replyType === 4 ? data.list[i].toTeacherUserId : null,
              'parentName': data.list[i].parentName,
              'parentUserIcon': data.list[i].parentUserIcon,
              'parentUserId': data.list[i].parentUserId,
              'replyId': data.list[i].replyId,
              'replyType': data.list[i].replyType,
              'isOriginal': false,
              'read': data.list[i].read,
              'relationship': data.list[i].relationship
            }
            this.dataList.push(item)
          }
        }
        this.dataList.unshift(dataOriginal)
        setTimeout(() => {
          this.$refs.manage_scroller.scrollTo(0, this.$refs.manage_scroller.$el.lastChild.clientHeight, false)
        }, 200)
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
  background-position: center center;
  background-size: cover;
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
  border-top: 1px solid #ddd;
}
@media screen and (-webkit-min-device-pixel-ratio: 2) {
  .border_top { border-top: 0.5px solid #ddd }
}
@media screen and (-webkit-min-device-pixel-ratio: 3) {
  .border_top { border-top: 0.333333px solid #ddd }
}
</style>

