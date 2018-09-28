<template>
  <div>
    <div :style="{'position': 'relative', 'height': scrollerHeight + 'px'}">
      <scroller ref="manage_scroller">
        <Group gutter="0px">
          <cell style="font-size:16px;">
            <p slot="title">
              <span>{{editName(voteInfo)}}</span>
            </p>
            <p slot="inline-desc" style="margin-top:5px;font-size:16px;">
              <span style="margin-right:20px;color:#46A0FC;">票数：{{voteInfo.voteNum}}</span>
              <span v-if="voteInfo.voteNum > 0" style="color:#46A0FC;">排名：{{voteInfo.rankNum}}</span>
            </p>
          </cell>
          <p v-if="voteInfo.itemDesc" style="font-size:16px;padding:0 15px;margin: 10px 0 5px 0;">{{voteInfo.itemDesc}}</p>
          <div style="font-size:0;padding:5px 15px;" v-if="imgs.length>0" v-for="(item, index) in imgs" :key="index" @click="previewImage('teacher' ,index, item.imgData)">
            <img slot="default" style="display:inline-block;width:100%;" :src="tools.cdn(item.imgData)"/>
          </div>
        </Group>
      </scroller>
    </div>
    <confirm
      v-model="showConfirm"
      title="请选择学生"
      @on-confirm="confirmChildren">
      <group gutter="0">
        <checklist style="text-align:left;color: #000;" label-position="left" :max="1" :options="childrenList" v-model="selectChildren"></checklist>
      </group>
    </confirm>
    <actionsheet v-model="chooseIdentity" :menus="identity" @on-click-menu="clickIdentity" show-cancel></actionsheet>
    <detail-tabbar :actionLink="linkFunction" :actions="actions"></detail-tabbar>
  </div>
</template>

<script>
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import { Group, Cell, Actionsheet, Confirm, Checklist, TransferDom } from 'vux'
  import api from '../api.js'
  import eduApi from '@/feature/education/api'
  export default {
    directives: {
      TransferDom
    },
    components: {
      DetailTabbar, Group, Cell, Actionsheet, Confirm, Checklist
    },
    data () {
      return {
        scrollerHeight: 0,
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
        voteInfo: {},
        imgs: [],
        chooseIdentity: false,
        showConfirm: false,
        userInfo: {},
        selectChildren: null,
        childrenList: [],
        voteMessage: []
      }
    },
    mounted () {
      this.scrollerHeight = window.innerHeight - 50
      this.localStorage.getUserInfo({schoolId: this.$route.params.schoolId}, (data) => {
        this.userInfo = data
      }, () => {})
      api.getVoteInfo({schoolId: this.$route.params.schoolId, voteId: this.$route.params.voteId}, (data) => {
        this.voteMessage = data
        if (!this.voteMessage.base.isPublish) {
          this.actions = []
        }
      }, (er) => {})
      this.getVoteInfo()
    },
    methods: {
      getVoteInfo () {
        api.getUserVoteItemInfo({schoolId: this.$route.params.schoolId, voteId: this.$route.params.voteId, itemId: this.$route.params.itemId}, (data) => {
          this.voteInfo = data
          if (!this.tools.isNull(this.voteInfo.itemImgs)) {
            this.voteInfo.itemImgs.split(',').forEach((element) => {
              var item = {imgData: element}
              this.imgs.push(item)
            }, this)
          }
        }, (er) => {})
      },
      editName (item) {
        if (item.itemName) {
          return item.itemName
        } else {
          return item.studentName ? item.studentName : item.teacherName
        }
      },
      linkFunction () {
        if (this.voteMessage.base.isAnyoneVote) {
          // 微信用户投票
          this.voteByAdmin('weChatUser')
        } else {
          switch (parseInt(this.voteMessage.base.voteScope)) {
            case 1:
              // 全校
              if (this.userInfo.isParent && this.userInfo.isTeacher) {
                this.chooseIdentity = true
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
        if (code === 'teacher') {
          this.voteByAdmin('teacher')
        } else if (code === 'parent') {
          this.getChildren()
        }
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
      confirmChildren () {
        this.voteByAdmin('parent')
      },
      voteByAdmin (type) {
        api.voteByuser({
          schoolId: this.$route.params.schoolId,
          voteId: this.$route.params.voteId,
          itemId: this.$route.params.itemId,
          studentId: this.selectChildren,
          type: type
        }, (data) => {
          this.tools.successToast('投票成功')
          this.selectChildren = null
          this.getVoteInfo()
        }, (er) => {
          this.toolsWarnToast(er, '投票失败')
          this.selectChildren = null
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
      previewImage (type, index, code) {
        var imgs = []
        this.imgs.forEach((element) => {
          imgs.push(this.tools.cdn(element.imgData))
        })
        this.$wechat.previewImage({
          current: imgs[index],
          urls: imgs
        })
      }
    }
  }
</script>

<style scoped>

</style>
