<template>
  <div>
    <div :style="{'position': 'relative', 'height': scrollerHeight + 'px'}" v-show="!isDelete">
      <scroller :on-infinite="infinite" :no-data-text="showText" ref="manage_scroller">
        <Group gutter="0">
          <h3 style="text-align: center;margin: 20px;">{{voteInfo.base.voteName}}</h3>
          <div style="padding: 0 10px;font-size: 15px;position: relative;left: 0;top: 0;">
            <p :style="{'width': coverHeight*2-75+'px','text-overflow':'ellipsis'}" v-if="voteInfo.sponsor.masterName"><strong>主办方：</strong>{{voteInfo.sponsor.masterName}}</p>
            <p :style="{'width': coverHeight*2-75+'px','text-overflow':'ellipsis'}" v-if="voteInfo.sponsor.organizerName"><strong>承办方：</strong>{{voteInfo.sponsor.organizerName}}</p>
            <p v-if="voteInfo.base.startDate && voteInfo.base.endDate">
              <strong>活动时间：</strong><span>{{tools.formateTime(voteInfo.base.startDate, 'YYYY/MM/DD')}}</span><span>&nbsp;-&nbsp;</span><span>{{tools.formateTime(voteInfo.base.endDate, 'YYYY/MM/DD')}}</span>
            </p>
            <span style="border-radius: 3px;position:absolute;right:10px;top: 0;padding:0 5px;color:#fff;background:#8FBE58;" v-if="voteInfo.isApply">已报名</span>
            <span style="color:rgb(46, 132, 212);position:absolute;right:10px;top: 25px;" v-if="voteInfo.isApply" @click="editApply">报名情况</span>
          </div>
          <div v-if="voteInfo.base.voteLogo" :style="{'height': coverHeight+'px','width': '100vw', 'padding': '0 10px', 'margin': voteInfo.sponsor.masterName && voteInfo.sponsor.organizerName && voteInfo.base.startDate && voteInfo.base.endDate ? '10px 0' : '25px 0','box-sizing': 'border-box'}">
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
              <span>&nbsp;&nbsp;|&nbsp;&nbsp;总票数：{{resultCount.voteTotal}}</span>
            </p>
          </div>
        </Group>
        <Group gutter="10px">
          <tab custom-bar-width="5em">
            <tab-item selected @on-item-click="tabSelect(1)">编号</tab-item>
            <tab-item @on-item-click="tabSelect(2)">排名</tab-item>
            <tab-item @on-item-click="tabSelect(3)">规则说明</tab-item>
          </tab>
        </Group>
        <div class="search_wrap" style="margin: 7px 0;" v-if="index == 1 || index == 2">
            <form class="form_dd">
                <input class="input_dd" type="text" placeholder="请输入选手或编号" v-model="searchValue" @input="change">
                <button class="button_dd" type="button" @click="onSearch"></button>
            </form>
        </div>
        <div v-if="index == 1 || index == 2">
          <div style="width: 100%;overflow:hidden;padding:0 6px;box-sizing: border-box;">
            <div class="image_style" v-for="(item, index) in userList" :key="index" :style="{'height': (coverHeight + 40)+'px'}" @click="voteDetail(item)">
              <div class="vote-cover" :style="{'position': 'relative', 'border-radius': '5px 5px 0 0','height': coverHeight+'px', 'width': '100%', 'background-image':'url('+tools.cdn(item.itemLogo, 'logo.png')+')'}">
                <span v-if="item.voteNum > 0" style="position:absolute;right:0;top:0;color: #fff;background: rgba(0, 0, 0, 0.6);padding: 0 5px;font-size:12px;border-radius:0 5px 0 0">排名：{{item.rankNum}}</span>
              </div>
              <div style="height:40px;overflow:hidden;padding:0 5px;background:#fff;border-radius: 0 0 5px 5px;">
                <div style="width:70%;float:left;font-size:13px;">
                  <p style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                    <span>{{'[' + item.itemNo + ']'}}</span>
                    <span>{{editName(item)}}</span>
                  </p>
                  <p>
                    <span>票数：{{item.voteNum}}</span>
                  </p>
                </div>
                <div style="width: 30%;float: right;background: rgb(46, 132, 212);color: #fff;text-align: center;border-radius: 2px;margin-top: 9px;" @click.stop="voteClick(item)">投票</div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="index == 3">
          <Group gutter="0" title="基本信息">
            <div style="font-size:15px;padding:10px 15px;">
              <p>活动主题：{{voteInfo.base.voteName}}</p>
              <p v-if="voteInfo.sponsor.masterName">主办方：{{voteInfo.sponsor.masterName}}</p>
              <p v-if="voteInfo.sponsor.organizerName">承办方：{{voteInfo.sponsor.organizerName}}</p>
              <p v-if="voteInfo.sponsor.sponsorName">赞助商：{{voteInfo.sponsor.sponsorName}}</p>
              <p v-if="voteInfo.apply.startDate && voteInfo.apply.endDate">报名时间：{{tools.formateTime(voteInfo.apply.startDate, 'YYYY/MM/DD') + ' － ' + tools.formateTime(voteInfo.apply.endDate, 'YYYY/MM/DD')}}</p>
              <p>投票时间：{{tools.formateTime(voteInfo.base.startDate, 'YYYY/MM/DD') + ' － ' + tools.formateTime(voteInfo.base.endDate, 'YYYY/MM/DD')}}</p>
              <p>活动说明：{{voteInfo.base.voteDesc}}</p>
            </div>
          </Group>
          <Group gutter="0" title="投票规则">
            <div style="font-size:15px;padding:10px 15px;">
              <p>是否允许次日再次投票：{{voteInfo.role.isAllowNextDay ? '是' : '否'}}</p>
              <p>每人每日可投票数：{{voteInfo.role.dayNum}}</p>
              <p>每人每日对同一选项可投票数：{{voteInfo.role.dayItemNum}}</p>
            </div>
          </Group>
        </div>
      </scroller>
    </div>
    <p v-show="isDelete" style="text-align: center;padding: 20px;font-size: 16px;color: #999;">{{promptText}}</p>
    <actionsheet v-model="chooseIdentity" :menus="identity" @on-click-menu="clickIdentity" show-cancel></actionsheet>
    <confirm
      v-model="showConfirm"
      title="请选择学生"
      @on-confirm="confirmChildren">
      <group gutter="0">
        <checklist style="text-align:left;color: #000;" label-position="left" :max="1" :options="childrenList" v-model="selectChildren"></checklist>
      </group>
    </confirm>
    <detail-tabbar :actionLink="linkFunction" :actions="actions"></detail-tabbar>
  </div>
</template>

<script>
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import api from '@/feature/vote/api'
  import eduApi from '@/feature/education/api'
  import { Group, Cell, Actionsheet, Confirm, Checklist, Tab, TabItem, XProgress, Box, TransferDom } from 'vux'
  export default {
    directives: {
      TransferDom
    },
    components: {
      DetailTabbar, Group, Cell, Tab, Confirm, Actionsheet, Checklist, TabItem, XProgress, Box
    },
    data () {
      return {
        userInfo: {},
        coverHeight: 0,
        scrollerHeight: 0,
        showConfirm: false,
        chooseIdentity: false,
        identity: {},
        childrenList: [],
        selectChildren: null,
        searchValue: null,
        voteUser: null,
        actions: [],
        showTime: null,
        setInterval: null,
        userList: [],
        voteInfo: {
          sponsor: {},
          base: {},
          role: {},
          apply: {}
        },
        index: 1,
        orderStr: 'num',
        resultCount: {},
        type: null,
        isVote: true,
        day: null,
        hour: null,
        minute: null,
        secs: null,
        isDelete: false,
        promptText: ''
      }
    },
    watch: {
      index: {
        handler (newIndex, old) {
          if (newIndex === 3) {
            this.showText = ''
          } else {
            this.showText = '没有更多选项'
          }
        },
        immediate: true
      }
    },
    computed: {
      voteId () {
        return this.$route.params.voteId
      }
    },
    mounted () {
      this.coverHeight = window.innerWidth / 2
      this.scrollerHeight = window.innerHeight - 50
      this.localStorage.getUserInfo({schoolId: this.$route.params.schoolId}, (data) => {
        this.userInfo = data
      }, () => {})
      api.getVoteInfo({schoolId: this.$route.params.schoolId, voteId: this.$route.params.voteId}, (data) => {
        this.voteInfo = data
        if (this.voteInfo.apply.isOpen && this.voteInfo.base.voteType !== 'TEXT' && this.voteInfo.base.voteType !== 'IMAGE') {
          this.actions = [
            {
              name: '我要报名',
              code: 'sign'
            }
          ]
        }
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
      editApply () {
        this.$router.push({name: 'educationSignUpList'})
      },
      change () {
        if (!this.searchValue && this.searchValue === '') {
          this.$refs.manage_scroller.finishInfinite()
        }
      },
      editName (item) {
        if (item.itemName) {
          return item.itemName
        } else {
          return item.studentName ? item.studentName : item.teacherName
        }
      },
      voteDetail (item) {
        this.$router.push({name: 'educationSignUpDetail', params: {voteId: item.voteId, itemId: item.itemId}})
      },
      voteClick (item) {
        this.voteUser = item
        if (this.voteInfo.base.isAnyoneVote) {
          // 微信用户投票
          this.voteByAdmin('weChatUser')
        } else {
          switch (parseInt(this.voteInfo.base.voteScope)) {
            case 1:
              // 全校
              if (this.userInfo.isParent && this.userInfo.isTeacher) {
                this.identity = {
                  teacher: '以教师身份投票',
                  parent: '以家长身份投票'
                }
                this.isVote = true
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
                return
              }
              if (this.userInfo.isStudent) {
                this.voteByAdmin('student')
              }
              break
          }
        }
      },
      clickIdentity (code) {
        if (this.isVote) {
          if (code === 'teacher') {
            this.voteByAdmin('teacher')
          } else if (code === 'parent') {
            this.getChildren()
          }
        } else {
          if (code === 'teacher') {
            this.type = 'teacher'
          } else if (code === 'parent') {
            this.type = 'parent'
          }
          this.$router.push({name: 'educationSignUp', params: {voteId: this.$route.params.voteId, type: this.type}})
        }
      },
      linkFunction (code) {
        if (this.userInfo.isParent && this.userInfo.isTeacher) {
          this.identity = {
            teacher: '以教师身份报名',
            parent: '以家长身份报名'
          }
          this.isVote = false
          this.chooseIdentity = true
          return
        }
        if (this.userInfo.isParent) {
          this.type = 'parent'
        }
        if (this.userInfo.isStudent) {
          this.type = 'student'
        }
        this.$router.push({name: 'educationSignUp', params: {voteId: this.$route.params.voteId, type: this.type}})
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
      onSearch () {
        if (this.searchValue) {
          this.userList.splice(0, this.userList.length)
          this.$refs.manage_scroller.finishInfinite()
        }
      },
      tabSelect (tag) {
        if (tag === this.index) {
          return
        }
        this.index = tag
        switch (tag) {
          case 1:
            this.orderStr = 'num'
            break
          case 2:
            this.orderStr = 'rank'
            break
          case 3:
            break
        }
        if (parseInt(tag) !== 3) {
          this.userList.splice(0, this.userList.length)
          this.$refs.manage_scroller.finishInfinite()
        }
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
          this.toolsWarnToast(er, '投票失败')
          this.selectChildren = null
        })
      },
      getResultCount () {
        api.voteResultCount({schoolId: this.$route.params.schoolId, voteId: this.$route.params.voteId}, (data) => {
          this.resultCount = data
        }, (er) => {})
      },
      infinite (done) {
        this.getUser(this.userList.length, 20, (data) => {
          this.userList = this.userList.concat(data)
          if (data.length >= 20) {
            done()
          } else {
            done(true)
          }
        })
      },
      getUser (rowStart, rowCount, cb) {
        api.getUserVoteItemList({schoolId: this.$route.params.schoolId, voteId: this.$route.params.voteId, orderStr: this.orderStr, searchStr: this.searchValue === '' || this.searchValue === null ? null : this.searchValue, rowStart: rowStart, rowCount: rowCount}, (data) => {
          cb(data)
        }, (er) => {
          if (this.voteInfo.isAllowVote) {
            this.toolsWarnToast(er, '加载失败')
          }
        })
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
.image_style{
  float: left;
  width: calc(50% - 3px);
  margin: 0 6px 6px 0;
}
.image_style:nth-child(2n) {
  margin-right: 0px;
}
.form_dd {
	position:relative;
	width:97vw;
	margin:0 auto;
}
.search_wrap input {
	border:2px solid #8FBE58;
	border-radius:5px;
	background:transparent;
	top:0;
	right:0;
}
.search_wrap button {
	background:#8FBE58;
	border-radius:0 5px 5px 0;
	width:60px;
	top:0;
	right:0;
}
.search_wrap button:before {
	content:"搜索";
	font-size:13px;
	color:#F9F0DA;
}
.input_dd {
  border:none;
	outline:none;
	width:100%;
	height:38px;
	padding-left:13px;
  box-sizing:border-box;
}
.button_dd {
  border:none;
	outline:none;
	height:38px;
	width:38px;
	cursor:pointer;
	position:absolute;
}
</style>

