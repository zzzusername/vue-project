<template>
  <div>
    <!-- 文字投票 -->
    <div :style="{'position': 'relative', 'height': scrollerHeight + 'px'}" v-show="!isDelete">
      <scroller :on-infinite="infinite" no-data-text="没有更多选项～" ref="manage_scroller">
        <Group gutter="0">
          <h3 style="text-align: center;margin: 20px;">{{voteInfo.base.voteName}}</h3>
          <div style="padding: 0 10px;font-size: 15px;position: relative;left: 0;top: 0;">
            <p v-if="voteInfo.sponsor.masterName"><strong>主办方：</strong>{{voteInfo.sponsor.masterName}}</p>
            <p v-if="voteInfo.sponsor.organizerName"><strong>承办方：</strong>{{voteInfo.sponsor.organizerName}}</p>
            <p v-if="voteInfo.base.startDate && voteInfo.base.endDate">
              <strong>活动时间：</strong><span>{{tools.formateTime(voteInfo.base.startDate, 'YYYY/MM/DD')}}</span><span>&nbsp;-&nbsp;</span><span>{{tools.formateTime(voteInfo.base.endDate, 'YYYY/MM/DD')}}</span>
            </p>
            <span style="border-radius: 3px;position:absolute;right:10px;top: 0;padding:0 5px;color:#fff;background:#8FBE58;" v-if="voteInfo.isApply">已报名</span>
            <span style="color:rgb(46, 132, 212);position:absolute;right:10px;top: 20px;" v-if="voteInfo.isApply">查看报名列表</span>
          </div>
          <div v-if="voteInfo.base.voteLogo" :style="{'height': coverHeight+'px','width': '100vw', 'padding': '0 10px', 'margin': '10px 0','box-sizing': 'border-box'}">
            <div class="vote-cover" :style="{'background-image':'url('+tools.cdn(voteInfo.base.voteLogo, 'logo.png')+')'}"></div>
          </div>
          <div style="text-align: center;font-size: 14px;margin:10px 0;">
            <p v-if="this.showTime == null">投票结束还剩
              <span style="color:#FC5355;">
                <i style="font-style:normal;" v-if="this.day > 0">{{this.day}}天</i><i style="font-style:normal;" v-if="this.hour > 0">{{this.hour}}时</i><i style="font-style:normal;" v-if="this.minute > 0">{{this.minute}}分</i><i style="font-style:normal;" v-if="this.secs > 0">{{this.secs}}秒</i>
              </span>
            </p>
            <p v-else style="color:#FC5355;">投票已结束</p>
            <p style="margin-top:5px;padding:0 20px;font-size:15px;">
              <span>参与人：{{resultCount.votePeopleNum}}</span>
              <span>&nbsp;&nbsp;|&nbsp;&nbsp;总票数：{{resultCount.voteTotal}}&nbsp;&nbsp;|&nbsp;&nbsp;</span>
              <span style="color:#46A0FC;text-decoration: underline;" @click="showVoteDesc">规则说明</span>
            </p>
          </div>
        </Group>
        <Group gutter="10px">
          <div v-for="(item, index) in userList" :key="index" style="padding:10px 15px;overflow:hidden;">
            <input type="radio" :name="voteId" :value="item.itemId" :id="item.itemId" style="float:left;margin-top: 2px;" @change="(e) => {changeCheck(item, e)}">
            <label :for="item.itemId" style="float:left;width: calc(100% - 24px);position:relative;left:0;top:0;">
              <p style="font-size: 16px;padding-left:5px;">{{item.itemName}}</p>
              <p style="font-size: 14px;color: #999;padding-left:5px;">{{item.itemDesc}}</p>
              <p style="font-size: 14px;overflow:hidden;">
                <x-progress v-if="item.voteNumProportion" :percent="item.voteNumProportion" :show-cancel="false" style="width:50%;float:left;margin-top:8px;"></x-progress>
                <span style="vertical-align: middle;margin: 0 10px;" v-if="item.voteNumProportion">{{item.voteNum}}票</span>
                <span style="vertical-align: middle;" v-if="item.voteNumProportion">{{item.voteNumProportion}}%</span>
                <span style="vertical-align: middle;" v-if="item.voteNum > 0 && item.voteNumProportion">排名：{{item.rankNum}}</span>
              </p>
            </label>
          </div>
        </Group>
      </scroller>
    </div>
    <p v-show="isDelete" style="text-align: center;padding: 20px;font-size: 16px;color: #999;">{{promptText}}</p>
    <confirm
      v-model="showConfirm"
      title="请选择学生"
      @on-confirm="confirmChildren">
      <group gutter="0">
        <checklist style="text-align:left;color: #000;" label-position="left" :max="1" :options="childrenList" v-model="selectChildren"></checklist>
      </group>
    </confirm>
    <div v-transfer-dom>
      <x-dialog v-model="showHide" class="dialog-demo" hide-on-blur>
        <div style="max-height:80vh;min-height:30vh;overflow-y: scroll;padding: 20px 15px 15px;font-size:16px;">
          <p style="text-align:left;"><strong>活动说明：</strong></p>
          <p style="text-indent:1em;text-align:left;font-size:14px;">{{voteInfo.base.voteDesc}}</p>
          <div style="font-size:16px;text-align:left;margin-top: 10px;">
            <p style="text-align:left;"><strong>投票规则：</strong></p>
            <p style="text-indent:1em;text-align:left;font-size:14px;">是否允许次日再次投票：{{voteInfo.role.isAllowNextDay ? '是' : '否'}}</p>
            <p style="text-indent:1em;text-align:left;font-size:14px;">每人每日可投票数：{{voteInfo.role.dayNum}}</p>
            <p style="text-indent:1em;text-align:left;font-size:14px;">每人每日对同一选项可投票数：{{voteInfo.role.dayItemNum}}</p>
          </div>
        </div>
      </x-dialog>
    </div>
    <actionsheet v-model="chooseIdentity" :menus="identity" @on-click-menu="clickIdentity" show-cancel></actionsheet>
    <detail-tabbar :actionLink="linkFunction" :actions="actions"></detail-tabbar>
  </div>
</template>

<script>
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import api from '@/feature/vote/api'
  import eduApi from '@/feature/education/api'
  import { Group, Cell, Actionsheet, XDialog, Confirm, Checklist, XProgress, Box, Alert, TransferDom } from 'vux'
  export default {
    directives: {
      TransferDom
    },
    components: {
      DetailTabbar, Group, Cell, Actionsheet, XDialog, Confirm, Checklist, XProgress, Box, Alert
    },
    data () {
      return {
        showHide: false,
        coverHeight: 0,
        scrollerHeight: 0,
        showAlert: false,
        chooseIdentity: false,
        showConfirm: false,
        voteUser: null,
        actions: [
          {
            name: '投Ta一票',
            code: 'push'
          }
        ],
        identity: {
          teacher: '以教师身份投票',
          parent: '以家长身份投票'
        },
        childrenList: [],
        selectChildren: null,
        showTime: null,
        setInterval: null,
        userList: [],
        voteInfo: {
          sponsor: {},
          base: {},
          role: {},
          apply: {}
        },
        userInfo: {},
        resultCount: {},
        day: null,
        hour: null,
        minute: null,
        secs: null,
        isDelete: false,
        promptText: ''
      }
    },
    computed: {
      voteId () {
        return this.$route.params.voteId
      }
    },
    mounted () {
      this.coverHeight = window.innerWidth / 3
      this.scrollerHeight = window.innerHeight - 50
      this.localStorage.getUserInfo({schoolId: this.$route.params.schoolId}, (data) => {
        this.userInfo = data
      }, () => {})
      api.getVoteInfo({schoolId: this.$route.params.schoolId, voteId: this.$route.params.voteId}, (data) => {
        this.voteInfo = data
        if (this.voteInfo.base.endDate) {
          this.setInterval = setInterval(() => {
            this.editDateTime(this.voteInfo.base.endDate)
          }, 1000)
        }
        if (!this.voteInfo.isAllowVote) {
          switch (parseInt(this.voteInfo.base.voteScope)) {
            case 1:
              this.promptText = '对不起，此投票只允许校内师生参与'
              break
            case 2:
              this.promptText = '对不起，此投票只允许相关教师群成员参与'
              break
            case 3:
              this.promptText = '对不起，此投票只允许班级学生参与'
              break
          }
          this.isDelete = true
        }
      }, (er) => {
        if (er.toUser) {
          if (er.errCode === '21180101') {
            this.isDelete = true
            this.$vux.alert.show({
              title: '提示',
              content: '投票内容已被删除'
            })
          } else {
            this.$vux.alert.show({
              title: '提示',
              content: er.message
            })
          }
        }
      })
      this.getResultCount()
    },
    methods: {
      showVoteDesc() {
        this.showHide = true
      },
      linkFunction (code) {
        if (!this.voteUser) {
          this.tools.warnToast('请选择选项')
          return
        }
        if (this.voteInfo.base.isAnyoneVote) {
          // 微信用户投票
          this.voteByAdmin('weChatUser')
        } else {
          switch (parseInt(this.voteInfo.base.voteScope)) {
            case 1:
              // 全校
              if (this.userInfo.isParent && this.userInfo.isTeacher) {
                this.chooseIdentity = true
                return
              }
              if (this.userInfo.isTeacher) {
                this.voteByAdmin('teacher')
                return
              }
              if (this.userInfo.isParent) {
                this.getChildren()
                return
              }
              if (this.userInfo.isStudent) {
                this.voteByAdmin('student')
              }
              break
            case 2:
              // 老师
              this.voteByAdmin('teacher')
              break
            case 3:
              // 班级
              if (this.userInfo.isParent) {
                this.getChildren()
              }
              if (this.userInfo.isStudent) {
                this.voteByAdmin('student')
              }
              break
          }
        }
      },
      clickIdentity (code) {
        if (code === 'teacher') {
          this.voteByAdmin('teacher')
        } else if (code === 'parent') {
          this.getChildren()
        }
      },
      confirmChildren () {
        this.voteByAdmin('parent')
      },
      getChildren () {
        eduApi.getParentInfoSelf({schoolId: this.$route.params.schoolId}, (data) => {
          this.childrenList = []
          data.studentlist.forEach((element) => {
            let item = {
              key: element.studentId,
              value: element.studentName
            }
            this.childrenList.push(item)
          })
          if (this.childrenList.length <= 1) {
            this.selectChildren = this.childrenList[0].key
            this.voteByAdmin('parent')
          } else {
            this.showConfirm = true
          }
        })
      },
      voteByAdmin (type) {
        api.voteByuser({
          schoolId: this.$route.params.schoolId,
          voteId: this.$route.params.voteId,
          itemId: this.voteUser.itemId,
          studentId: this.selectChildren,
          type: type
        }, (data) => {
          this.tools.successToast('投票成功')
          this.selectChildren = null
          this.userList.splice(0, this.userList.length)
          this.$refs.manage_scroller.finishInfinite()
          this.getResultCount()
        }, (er) => {
          this.selectChildren = null
          this.toolsWarnToast(er, '投票失败')
        })
      },
      getResultCount () {
        api.voteResultCount({schoolId: this.$route.params.schoolId, voteId: this.$route.params.voteId}, (data) => {
          this.resultCount = data
        }, (er) => {})
      },
      toolsWarnToast (er, msg) {
        if (er.toUser) {
          this.$vux.alert.show({
            title: '提示',
            content: er.message
          })
        } else {
          this.$vux.alert.show({
            title: '提示',
            content: msg
          })
        }
      },
      changeCheck(item, e) {
        if (e.target.checked) {
          this.voteUser = item
        }
      },
      onShow () {
        this.$router.go(-1)
      },
      infinite (done) {
        this.getUser(this.userList.length, (data) => {
          this.userList = this.userList.concat(data)
          if (data.length >= 20) {
            done()
          } else {
            done(true)
          }
        })
      },
      getUser (rowStart, cb) {
        api.getUserVoteItemList({schoolId: this.$route.params.schoolId, voteId: this.$route.params.voteId, orderStr: 'num', rowStart: rowStart, rowCount: 20}, (data) => {
          cb(data)
        }, (er) => {
          if (this.voteInfo.isAllowVote) {
            if (er.toUser) {
              this.$vux.alert.show({
                title: '提示',
                content: er.message
              })
            } else {
              this.$vux.alert.show({
                title: '提示',
                content: '加载失败'
              })
            }
          }
        })
      },
      editDateTime (timeOver) {
        let dateTime = new Date().getTime()
        // 时间差
        let leftTime = timeOver - dateTime
        var d, h, m, s
        if (leftTime >= 0) {
          d = Math.floor(leftTime / 1000 / 60 / 60 / 24)
          h = Math.floor(leftTime / 1000 / 60 / 60 % 24)
          m = Math.floor(leftTime / 1000 / 60 % 60)
          s = Math.floor(leftTime / 1000 % 60)
          // this.showTime = d + '天' + h + '时' + m + '分' + s + '秒'
          this.day = d
          this.hour = h
          this.minute = m
          this.secs = s
        } else {
          clearInterval(this.setInterval)
          this.showTime = '0:0:0'
        }
      }
    },
    beforeDestroy () {
      clearInterval(this.setInterval)
    }
  }
</script>

<style scoped>
.vote-cover {
  width: 100%;
  height: 100%;
  display: block;
  margin: auto;
  background-position: center center;
  background-size: cover;
  border-style:none;
  border-width:0;
}
input[type=radio],input[type=checkbox]  {
	display: inline-block;
	vertical-align: middle;
	width: 24px;
	height: 24px;
	/* margin-left: 5px; */
	-webkit-appearance: none;
	background-color: transparent;
	border: 0;
	outline: 0 !important;
	line-height: 20px;
	color: #d8d8d8;
}
input[type=radio]:after  {
	content: "";
	display:block;
	width: 20px;
	height: 20px;
	border-radius: 50%;
	text-align: center;
	line-height: 14px;
	font-size: 16px;
	color: #fff;
	border: 2px solid #ddd;
	background-color: #fff;
	box-sizing:border-box;
}

input[type=checkbox]:after  {
	content: "";
	display:block;
	width: 20px;
	height: 20px;
  text-align: center;
  border-radius: 50%;
	line-height: 14px;
	font-size: 16px;
	color: #fff;
	border: 2px solid #ddd;
	background-color: #fff;
	box-sizing:border-box;
}
input[type=checkbox]:checked:after  {
  content: "L";
	transform:matrix(-0.766044,-0.642788,-0.642788,0.766044,0,0);
	-webkit-transform:matrix(-0.766044,-0.642788,-0.642788,0.766044,0,0);
	border-color: #A2D268;
	background-color: #A2D268;
}

input[type=radio]:checked:after  {
	content: "L";
	transform:matrix(-0.766044,-0.642788,-0.642788,0.766044,0,0);
	-webkit-transform:matrix(-0.766044,-0.642788,-0.642788,0.766044,0,0);
	border-color: #A2D268;
	background-color: #A2D268;
}
.border_bottom{
  border-bottom: 1px solid #C0BFC4;
}
@media screen and (-webkit-min-device-pixel-ratio: 2) {
  .border_bottom { border-bottom: 0.5px solid #999 }
}
@media screen and (-webkit-min-device-pixel-ratio: 3) {
  .border_bottom { border-bottom: 0.333333px solid #999 }
}
</style>

