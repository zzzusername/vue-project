<template>
  <div >
      <group v-if="comment.voteNum > 0">
          <card>
            <div slot="content" class="jhy-padding" style="font-size:14px">
              <i class="iconfont icon-zan"></i> {{comment.voteNum}}人赞过：
                <span v-for=" (vote, index) in comment.votes" :key="index">
                  <span v-if="index == 0" class="jhy-text-a-color">
                    {{vote.userName}}
                  </span>
                  <span v-else-if="index<50">
                    ,
                    <span class="jhy-text-a-color">
                      {{vote.userName}}
                    </span>
                  </span>
                </span>
                <span v-if="comment.voteNum>50">
                    等
                </span>
            </div>
          </card>
      </group>
      <divider v-if="comment.replys !=null && comment.replys.length>0">评论信息</divider>
      <group style="margin-top:-20px">
        <cell v-for="reply in comment.replys" :key="reply.idStr" >
          <flexbox slot="child" align="flex-start" style="font-size:14px">
            <flexbox-item :span="1/9" >
              <img width="40" :src="tools.cdn(reply.userIcon)" style="border-radius: 10rem;">
            </flexbox-item>
            <flexbox-item>
              <flexbox>
                <flexbox-item>
                  {{reply.userName}}
                  <!-- <span v-if="reply.levelName!=null&&reply.levelName!=undefined" class="jhy-user-level">{{reply.levelName}}</span>
                  <span v-if="reply.vipId!=undefined&&reply.vipId>0" :class="vipClass(reply.vipId)">{{reply.vipName}}</span> -->
                </flexbox-item>
                <flexbox-item :span="1/5" style="text-align:right">
                  <i class="iconfont icon-zan" @click="addSubVote(bsId, type, reply.idStr, () => onVoteChange)"></i>&emsp;
                  <i class="iconfont icon-pinglun am-margin-left-xs" @click="toAddSubReply(reply.idStr)"></i> 
                </flexbox-item>
              </flexbox>
              <div class="jhy-text-xs jhy-link-muted"> {{tools.formateTime(reply.date, 'MM-DD HH:mm')}} </div>
              <div class="jhy-text-default jhy-link-muted" style="margin-top:5px">{{reply.content}}</div> 
              <div v-show="reply.voteNum>0||reply.replyNum>0" class="jhy-text-default jhy-padding-horizontal-xs" style="background-color:#F5F5F5;margin-top:10px">
                <div v-show="reply.voteNum>0" class="jhy-text-default">{{reply.voteNum}}人赞：
                  <span v-for="(vote, index) in reply.votes" :key="index" class="jhy-text-a-color"> {{vote.userName}}{{reply.votes.length-1===index?'':','}}</span>
                </div>
                <div v-for="(reply, index) in reply.replys " :key="index"><span class="jhy-text-a-color">{{reply.userName}}</span>：<span class="jhy-link-muted">{{reply.content}}</span></div>
              </div >
            </flexbox-item>
          </flexbox>
        </cell>
      </group>

      <tabbar v-transfer-dom style="position:fixed">
      <tabbar-item @on-item-click="toIndex()">
        <span slot="label" class="index-tabbar"  style="border:0;color:#333333">
          <span class="iconfont icon-fanhui jhy-text-big"></span>
        </span>
      </tabbar-item>
      <tabbar-item @click.native="toAddReply() ">
        <span slot="label" class="index-tabbar" style="border:0;color:#333333">
          <span class="iconfont icon-pinglun jhy-text-big"></span>
          <span style="color:#333">{{comment.replyNum>999?'999+':comment.replyNum}}</span>
        </span>
      </tabbar-item>
      <tabbar-item @click.native="addVote(bsId, type, () => onVoteChange)">
        <span slot="label" class="index-tabbar" style="border:0;color:#333333">
          <span class="iconfont icon-zan jhy-text-big"></span>
          <span style="color:#333">{{comment.voteNum>999?'999+':comment.voteNum}}</span>
        </span>
      </tabbar-item>
      <tabbar-item v-if="isShowRead" @click.native.once="onRead" :style="{'border':'0','background-color':(isRead?'#d2d2d2':'#FF513D')}"> 
        <span slot="label" style="color:#fff">已阅</span>
      </tabbar-item>
      <tabbar-item v-else-if="isShowManage" @click.native="onManage" :style="{'border':'0','background-color':'#8ebf52'}"> 
        <span slot="label" style="color:#fff">管理</span>
      </tabbar-item>
      <tabbar-item v-else @click.native="toMe"> 
        <span slot="label" class="index-tabbar" style="border:0;color:#333333">
          <span class="iconfont icon-wode1 jhy-text-big"></span>
        </span>
      </tabbar-item>
    </tabbar>
    <popup v-model="show" height="180px" is-transparent v-transfer-dom>
      <div flots="default" style="width: 95%;background-color:#fbf9fe;height:160px;margin:0 auto;border-radius:5px;padding-top:10px;">
      <x-textarea  v-model="replys.content" placeholder="请输入评论"></x-textarea>
      <div style="padding:10px 15px;">
        <x-button type="primary" @click.native="send ()" > 评 论 </x-button>
      </div>
      </div>
    </popup>
  </div>
</template>

<script>
import { Tabbar, TabbarItem, Group, Cell, Popup, XButton, TransferDomDirective as TransferDom, XTextarea, Divider, Flexbox, FlexboxItem, LoadMore, Card } from 'vux'
import { mapGetters } from 'vuex'
import api from '../api'

export default {
  data () {
    return {
      comment: {
        replyNum: 0,
        voteNum: 0,
        replys: [],
        votes: []
      },
      show: false,
      replys: {
        content: '',
        replyId: ''
      },
      isMain: true,
      beforeDestroy: false,
      schoolId: this.$route.params.schoolId
      // isRead: true // 是否已读
    }
  },
  props: ['bsId', 'type', 'backLink', 'isShowRead', 'isRead', 'isShowManage'],
  computed: mapGetters({
    // orgId: 'orgId',
    orgInfo: 'orgInfo'
  }),
  methods: {
    getComment(bsId, type, cb) {
      var length = 0
      if (this.comment.replys !== null) {
        length = this.comment.replys.length
      }
      api.getComment({ schoolId: this.schoolId, bsId, type, skip: length }, comment => {
        cb(comment.replys)
        if (comment.replys) {
          comment.replys = [].concat(this.comment.replys, comment.replys) // 合并数组
        }
        this.comment = comment
        this.$emit('comment-num', {replyNum: comment.replyNum, viewNum: comment.viewNum, readerNum: comment.readerNum, voteNum: comment.voteNum})
      })
    },
    addVote(bsId, type, cb) {
      api.addVote({ schoolId: this.schoolId, bsId, type }, (vote) => {
        if (this.comment.votes) {
          var old = this.comment.votes.find(p => p.userId === vote.userId)
          if (!old) {
            this.comment.votes.push(vote)
            this.comment.voteNum += 1
          }
        } else {
          this.comment.votes = [vote]
          this.comment.voteNum = 1
        }
        cb()
      }, (errorData) => {
        if (errorData.toUser) {
          this.tools.warnToast(errorData.message, '170px')
        }
      })
    },
    addSubVote(bsId, type, replyId, cb) {
      api.addSubVote({ schoolId: this.schoolId, bsId, type, replyId }, (vote) => {
        var reply = this.comment.replys.find(p => p.idStr === replyId)
        if (reply) {
          if (reply.votes) {
            var old = reply.votes.find(p => p.userId === vote.userId)
            if (!old) {
              // reply.votes = this.comment.votes.push(vote)
              reply.votes.push(vote)
              reply.voteNum = reply.voteNum + 1
            }
          } else {
            reply.votes = [vote]
            reply.voteNum = 1
          }
        }
        cb()
      }, (errorData) => {
        if (errorData.toUser) {
          this.tools.warnToast(errorData.message, '170px')
        }
      })
    },
    addReply(bsId, type, content, cb) {
      api.addReply({ schoolId: this.schoolId, bsId, type, content }, (reply) => {
        if (this.comment.replys) {
          reply.replyNum += 1
          this.comment.replys.push(reply)
          this.comment.replyNum += 1
        } else {
          reply.replyNum += 1
          this.comment.replys = [reply]
          this.comment.replyNum = 1
        }
        cb()
      }, (errorData) => {
        if (errorData.toUser) {
          this.tools.warnToast(errorData.message, '170px')
        }
      })
    },
    addSubReply(bsId, type, content, replyId, cb) {
      api.addSubReply({schoolId: this.schoolId, bsId, type, content, replyId}, (reply) => {
        var pReply = this.comment.replys.find(p => p.idStr === replyId)
        if (pReply) {
          if (pReply.replys) {
            pReply.replys.push(reply)
          } else {
            pReply.replys = [reply]
          }
        }
        cb()
      }, (errorData) => {
        if (errorData.toUser) {
          this.tools.warnToast(errorData.message, '170px')
        }
      })
    },
    addViewNum(bsId, type) {
      api.addViewNum({schoolId: this.schoolId, bsId, type}, () => {}, () => {})
    },
    toAddReply () {
      this.show = true
      this.isMain = true
    },
    toAddSubReply (replyId) {
      this.show = true
      this.replys.replyId = replyId
      this.isMain = false
    },
    toIndex () {
      if (this.backLink === undefined) {
        if (this.$store.state.canGoBack) {
          this.$router.back()
          setTimeout(() => {
            if (!this.beforeDestroy) {
              if (this.tools.isNull(this.$route.params.schoolId)) {
                this.$router.push({name: 'index'})
              } else {
                this.$router.push({name: 'schoolIndex', params: {schoolId: this.$route.params.schoolId}})
              }
            }
          }, 200)
        } else {
          if (this.tools.isNull(this.$route.params.schoolId)) {
            this.$router.push({name: 'index'})
          } else {
            this.$router.push({name: 'schoolIndex', params: {schoolId: this.$route.params.schoolId}})
          }
        }
      } else {
        this.$router.push(this.backLink)
      }
    },
    send () {
      console.log('this.replys.content', this.replys.content)
      if (this.replys.content === null || this.replys.content === '' || this.replys.content === undefined) {
        this.tools.toast('评论内容不能为空', '140px')
        return
      }
      console.log({
        bsId: this.bsId,
        type: this.type,
        content: this.replys.content,
        cb: this.onChange
      })
      if (this.isMain === true) {
        this.addReply(this.bsId, this.type, this.replys.content, () => { this.onChange })
      } else {
        this.addSubReply(this.bsId, this.type, this.replys.content, this.replys.replyId, () => { this.onChange })
      }
      this.show = false
      this.replys.content = ''
    },
    onChange () {
      this.tools.successToast('评论成功')
      this.$nextTick(() => {
        this.$emit('change')
      })
    },
    onVoteChange () {
      this.tools.successToast('点赞成功')
      this.$nextTick(() => {
        this.$emit('change')
      })
    },
    log (str) {
      console.log(str)
    },
    loadMore (cb) {
      this.getComment(this.bsId, this.type, (data) => {
        cb(data)
      })
    },
    vipClass (index) {
      if (index === 1) {
        return 'jhy-user-vip1'
      } else if (index === 2) {
        return 'jhy-user-vip2'
      } else if (index === 3) {
        return 'jhy-user-vip3'
      }
    },
    toMe () {
      this.$router.push({name: 'userIndex', orgId: this.orgInfo.orgId})
    },
    onRead () {
      if (!this.isRead) {
        // api.addReader({schoolId: this.$route.params.schoolId, bsId: this.bsId, type: this.type}, () => {
        //   this.isRead = true
        //   this.tools.successToast('已阅')
        //   this.callback({isRead: true})
        // }, () => {})
        this.$emit('on-read')
      }
    },
    onManage () {
      this.$emit('on-manage')
    }
  },
  beforeDestroy () {
    this.beforeDestroy = true
  },
  created () {
    console.log('comment list activated', this.bsId, this.type)
  },
  mounted () {
    this.addViewNum(this.bsId, this.type)
    if (this.isShowRead) {
      api.isRead({schoolId: this.$route.params.schoolId, bsId: this.bsId, type: this.type}, (data) => {
        this.isRead = data.isRead
      }, () => {})
    }
  },
  components: {
    Tabbar,
    TabbarItem,
    Group,
    Cell,
    Popup,
    XButton,
    XTextarea,
    Divider,
    Flexbox,
    FlexboxItem,
    LoadMore,
    Card
  },
  directives: {
    TransferDom
  }
}
</script>
<style>
.icon{
  line-height:1.1;
  font-size: 27px;
}
</style>
