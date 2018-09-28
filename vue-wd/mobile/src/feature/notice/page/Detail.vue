<template>
  <div :style="{'position': 'relative', 'height': scrollerHeight + 'px'}">
    <scroller ref="scroller" :on-infinite="infinite" no-data-text="没有更多评论了～">
      <div v-if="info.teacherName !== undefined" style="position: relative;padding: 10px;height:50px;overflow: hidden;backgroundColor:#fff;">
        <img style="width:50px;height:50px;position:absolute;" :src="tools.cdn(info.userIcon, 'head.png')">
        <div style="padding-left:60px;position:absolute;height:50px;width:100vw;">
          <p style="fontSize:16px;"><span>{{info.teacherName}}</span></p>
          <p style="fontSize:14px;color:#999;width:100%;margin-top:5px;"><span>{{tools.getDateDiff(info.createDate)}}</span>&nbsp;<span></span></p>
          <span v-if="info.noticeReadFeedback == 2" style="position:absolute;right:80px;top:32px;color:#1E5CCA" @click="showReaderList">{{readerNum}}人已读、{{unreadNum}}人未读 >></span>
          <span v-if="info.noticeReadFeedback == 1" style="position:absolute;right:80px;top:32px;">{{nums.viewNum}}浏览</span>
        </div>
      </div>
      <p v-if="info.className" style="padding: 0 10px 5px;background-color:#fff;color: #999">公告班级：{{info.className}}</p>
      <p v-show="info.noticeReadFeedback==2" style="margin-top:7px;margin-bottom:2px;color:#FF6D56;text-align:center">
        <span>这是一则重要公告，请详细阅读</span>
      </p>
      <div v-if="info !== null" style="padding:0 15px;backgroundColor:#fff;margin-top:5px;overflow:hidden;">
        <p style="margin:10px 0;fontSize:18px;">{{info.noticeTitle}}</p>
        <div style="text-indent:1em;fontSize:16px;marginBottom:10px;" v-html="tools.isNull(info.noticeBody)?'':info.noticeBody.replace(/\n/g, '<br/>')"></div>
        <div v-if="info.noticeFile" style="margin: 5px 0;" v-for="(item, index) in info.noticeFile" :key="index">
          <span>附件{{index + 1}}:</span>&nbsp;&nbsp;<a style="padding: 5px 0;" :href="tools.cdn(item.url)">{{item.name}}</a>
        </div>
        <img style="width:100%;marginBottom:10px;" v-for="(item, index) in info.noticeImages" :src="tools.cdn(item)" :key="index" @click="previewImage(index)">
      </div>
      <comment style="clear:both" ref="comment" :bsId="$route.params.noticeId" type="SCHOOL_NOTICE" @change="commentChange" @comment-num="commentNum" :isShowManage="isShowManage" @on-manage="onManage"> </comment>
    </scroller>
    <detail-tabbar></detail-tabbar>
    <div>
      <alert :hide-on-blur="false" v-model="showReadBtn" title="提示" button-text="我已知晓" @on-hide="onAlertHide"><span style="color: red">这是一则重要公告，请详细阅读</span></alert>
    </div>
    <div v-transfer-dom>
      <confirm v-model="showConfirm"
      :title="confirmTitle"
      @on-confirm="onConfirm(confirmType)">
        <p style="text-align:center;">{{confirmDesc}}</p>
      </confirm>
    </div>
    <actionsheet v-model="showMenu" :menus="managemenus" @on-click-menu="menuClick" show-cancel></actionsheet>
  </div>
</template>


<script>
import { dateFormat, Alert, Actionsheet, TransferDom, Confirm } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import Comment from '@/feature/comment/components/Comment.vue'
import api from '@/feature/notice/api'
import {mapGetters} from 'vuex'
export default {
  directives: {
    TransferDom
  },
  components: {
    DetailTabbar, Comment, Alert, Actionsheet, Confirm
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    })
  },
  data () {
    return {
      info: {},
      scrollerHeight: 0,
      readerNum: null,
      unreadNum: null,
      isRead: false,
      showReadBtn: false,
      nums: {},
      showAlert: true,
      showMenu: false,
      managemenus: {
        change: '修改',
        push: '推送',
        delete: '删除'
      },
      isShowManage: false,
      showConfirm: false,
      confirmTitle: '',
      confirmType: 0,
      confirmDesc: ''
    }
  },
  mounted () {
    this.scrollerHeight = window.innerHeight - 50
    api.isNoticeJurisdiction({schoolId: this.$route.params.schoolId, noticeId: this.$route.params.noticeId}, (data) => {
      if (data.result === true) {
        this.isShowManage = true
      }
    }, () => {})
    api.getNoticeInfo({schoolId: this.$route.params.schoolId, noticeId: this.$route.params.noticeId}, (data) => {
      this.info = data
      // let reg = /[a-zA-z]+:\/\/[^\s]*/g
      let reg = /((ht|f)tps?):\/\/([\w\\-]+(\.[\w\\-]+)*\/)*[\w\\-]+(\.[\w\\-]+)*\/?(\?([\w\-\\.,@?^=%&:\\/~\\+#]*)+)?/g
      let content = data.noticeBody
      if (content) {
        let result = content.match(reg)
        console.log(result)
        if (result) {
          for (let index = 0; index < result.length; index++) {
            const element = result[index]
            this.info.noticeBody = this.info.noticeBody.replace(element, '<a style="word-wrap:break-word" href=' + element + '>' + element + '</a>')
          }
        }
      }
      if (data.noticeFile) {
        this.info.noticeFile = JSON.parse(data.noticeFile)
      } else {
        this.info.noticeFile = null
      }
      let image = null
      this.readerNum = data.noticeReadCount
      this.unreadNum = data.noticeUnreadCount
      this.localStorage.getUserInfo({schoolId: this.$route.params.schoolId}, (user) => {
        if (data.noticeReadFeedback === 1) {
          return
        }
        this.isReaded(user, data)
      }, () => {
        data.noticeReadFeedback === 1 ? this.showReadBtn = false : this.showReadBtn = true
        this.isReaded()
      })
      if (data.noticeImg !== null) {
        this.info.noticeImages = data.noticeImg.split(',')
        image = process.env.CDN_DOMAIN + '/' + this.info.noticeImages[0] + '?imageView2/1/w/128/h/128'
      } else {
        image = process.env.CDN_DOMAIN + '/notice/img/share_icon.png'
      }
      if (window.__wxjs_environment === 'miniprogram') {
        this.$wechat.miniProgram.postMessage({ data: {title: this.info.noticeTitle, desc: this.tools.isNull(this.info.noticeBody) ? '' : this.info.noticeBody.substring(0, 20), url: location.href.split('#')[1]} })
        return
      }
      this.tools.shareWechat({title: this.info.noticeTitle, desc: this.tools.isNull(this.info.noticeBody) ? '' : this.info.noticeBody.substring(0, 20), imgUrl: image})
      api.getComment({ schoolId: this.$route.params.schoolId, bsId: this.$route.params.noticeId, type: 'SCHOOL_NOTICE', skip: 1 }, comment => {
        this.nums = {replyNum: comment.replyNum, viewNum: comment.viewNum, readerNum: comment.readerNum, voteNum: comment.voteNum}
      })
    }, (data) => {
      this.isShow = false
      if (data.toUser) {
        this.tools.warnToast(data.message, '170px')
      } else {
        this.tools.warnToast('无法修改，请重试', '170px')
      }
    })
  },
  methods: {
    previewImage (index) {
      var imgs = []
      this.info.noticeImages.forEach((element) => {
        imgs.push(this.tools.cdn(element))
      })
      this.$wechat.previewImage({
        current: imgs[index],
        urls: imgs
      })
    },
    getFormateDate (time) {
      return dateFormat(time, 'YYYY-MM-DD HH:mm')
    },
    commentNum(val) {
      this.nums = val
    },
    commentChange () {
    },
    infinite(done) {
      this.$refs.comment.loadMore((data) => {
        if (data == null || data.length === 0) {
          done(true)
        } else {
          done()
        }
      })
    },
    showReaderList () {
      this.$router.push({name: 'educationReaderList', params: {noticeId: this.$route.params.noticeId}})
    },
    onRead() {
      api.submitReadStatus({schoolId: this.$route.params.schoolId, noticeId: this.$route.params.noticeId}, (data) => {
        this.isRead = true
        this.readerNum += 1
        if (this.unreadNum > 1) {
          this.unreadNum -= 1
        }
      }, (er) => {
        if (er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    isReaded(user, data) {
      // readScope;    //阅读反馈：1、所有。2、学生。3家长
      // noticeType;    //公告类型 1:全校 2:全体老师 3:班级
      api.isRead({schoolId: this.$route.params.schoolId, noticeId: this.$route.params.noticeId}, (read) => {
        if (read.result === 1 || read.result === 3) {
          this.showReadBtn = false
          return
        }
        if (data.noticeType === 2 && !user.isMaster && !user.isTeacher) {
          // 全体教师公告，不是教师不需要显示已知晓
          this.showReadBtn = false
        } else {
          if (data.readScope === 2) {
            // 需要学生反馈
            user.isStudent ? this.showReadBtn = true : this.showReadBtn = false
          } else if (data.readScope === 3) {
            // 需要家长反馈
            user.isParent ? this.showReadBtn = true : this.showReadBtn = false
          } else {
            // 需要所有人反馈
            this.showReadBtn = true
          }
        }
      }, (er) => {
        if (er.toUser) {
          this.tools.warnToast(er.message, '170px')
        } else {
          this.tools.warnToast('无法修改，请重试', '170px')
        }
      })
    },
    onAlertHide() {
      this.onRead()
    },
    onManage () {
      this.showMenu = true
    },
    menuClick (key) {
      switch (key) {
        case 'change':
          this.$router.push({name: 'educationModifyNotice', params: {schoolId: this.$route.params.schoolId, noticeId: this.info.noticeId}})
          break
        case 'delete':
          this.showConfirm = true
          this.confirmType = 1
          this.confirmDesc = '您确定要删除［' + this.info.noticeTitle + '］吗'
          break
        case 'push':
          this.showConfirm = true
          this.confirmType = 2
          this.confirmDesc = '您确定要推送［' + this.info.noticeTitle + '］吗'
          break
      }
    },
    onConfirm (type) {
      if (type === 1) {
        this.onDelete()
      } else if (type === 2) {
        this.onPush()
      }
    },
    onDelete () {
      api.deleteNotice({schoolId: this.$route.params.schoolId, noticeId: this.info.noticeId}, (data) => {
        if (data.rs === 1) {
          this.$router.back()
          this.tools.successToast('删除成功')
        } else {
          this.tools.warnToast('删除失败')
        }
      }, () => {
        this.tools.warnToast('删除失败')
      })
    },
    onPush () {
      api.pushNotice({schoolId: this.$route.params.schoolId, noticeId: this.info.noticeId}, (data) => {
        this.tools.successToast('推送成功')
      }, (errorData) => {
        if (errorData.toUser) {
          this.tools.warnToast(errorData.message)
        } else {
          this.tools.successToast('推送失败')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
