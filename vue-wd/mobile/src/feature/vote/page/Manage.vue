<template>
  <div>
    <tab v-if="isSchoolManage" custom-bar-width="5em">
      <!-- <tab-item :selected="selectedIndex == index" @on-item-click="tabSelect" v-for="(item, index) in tabList" :key="index">{{item}}</tab-item> -->
      <tab-item selected @on-item-click="tabSelect(1)">全校</tab-item>
      <tab-item @on-item-click="tabSelect(2)">教师</tab-item>
      <tab-item @on-item-click="tabSelect(3)">班级</tab-item>
    </tab>
    <div v-if="isSchoolManage != null" :style="{'position': 'relative', 'height': scrollerHeight + 'px', 'margin-top': '-1px'}">
      <scroller :on-infinite="infinite" :on-refresh="refresh" no-data-text="没有更多投票～" ref="manage_scroller">
        <div>
          <group gutter="0">
            <cell v-for="(item, index) in newList" :key="index" @click.native="showOperate(index)">
              <p slot="title" style="font-size:16px;padding-right:5px;overflow:hidden;text-overflow:ellipsis;word-break:break-all;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">{{item.voteName}}</p>
              <!-- <p style="font-size:12px;">进行中</p> -->
              <p slot="inline-desc" style="margin-top:15px;font-size:13px;">
                <!-- <span>{{getFormateDate(item.startDate)}}</span> -->
                <span>{{item.voteTypeTitle}}</span>
                <span style="margin-left:10px;">{{getFormateDate(item.startDate)}}</span>
                <span :style="{'float':'right', 'color': item.voteStatusColor}">{{item.voteStatusTitle}}</span>
              </p>
              <!-- <span slot="child" class="notice-cell-status" :style="{backgroundColor: (item.isExpire ? '#FC501F' : '#A2D268')}">{{item.isExpire ? '已过期' : '进行中'}}</span> -->
            </cell>
          </group>
          <p v-if="isNoData" style="textAlign:center;marginTop:20px;color:#999;font-size:14px">没有发布任何投票～</p>
        </div>
      </scroller>
    </div>
    <div v-transfer-dom>
      <confirm v-model="showConfirm"
      :title="confirmTitle"
      @on-confirm="onConfirm(confirmType)">
        <p style="text-align:center;">{{confirmDesc}}</p>
      </confirm>
    </div>
    <actionsheet v-model="showMenu" :menus="managemenus" @on-click-menu="menuClick" show-cancel></actionsheet>
    <detail-tabbar :actionLink="onPublish" :actions="actions"></detail-tabbar>
  </div>
</template>

<script>
import { Cell, Group, XImg, Actionsheet, TransferDom, dateFormat, Tab, TabItem, Confirm } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '@/feature/vote/api'
export default {
  directives: {
    TransferDom
  },
  components: {
    Cell, Group, XImg, DetailTabbar, Actionsheet, Tab, TabItem, Confirm
  },
  data () {
    return {
      newList: [],
      managemenus: {},
      showMenu: false,
      selectedIndex: -1,
      actions: [{
        name: '创建投票'
      }],
      isNoData: false,
      scrollerHeight: 0,
      tabIndex: 0,
      isSchoolManage: null, // 是否是全校公告管理
      showConfirm: false,
      confirmDesc: '',
      confirmTitle: '操作提示',
      confirmType: 0,
      isAllowAutoRefresh: false
    }
  },
  activated () {
    if (this.isAllowAutoRefresh) {
      this.$refs.manage_scroller.triggerPullToRefresh()
    }
  },
  deactivated () {
    this.isAllowAutoRefresh = true
  },
  mounted () {
    this.localStorage.getFeatureManageStatus({schoolId: this.$route.params.schoolId}, (data) => {
      if (data.schoolNoticeStatus === true) {
        this.localStorage.getUserInfo({schoolId: this.$route.params.schoolId}, (info) => {
          if (info.schoolModel === 2) {
            this.isSchoolManage = false
            this.tabIndex = 1
          } else {
            this.isSchoolManage = true
            this.tabIndex = 1
          }
        }, () => {})
      } else {
        this.isSchoolManage = false
        this.tabIndex = 3
      }
      if (this.isSchoolManage === true) {
        this.scrollerHeight = window.innerHeight - 50 - 44
      } else {
        this.scrollerHeight = window.innerHeight - 50
      }
    })
  },
  methods: {
    tabSelect(index) {
      this.tabIndex = index
      this.newList.splice(0, this.newList.length)
      this.$refs.manage_scroller.finishInfinite()
    },
    refresh(done) {
      this.newList.splice(0, this.newList.length)
      this.getNoticeList(0, (data) => {
        this.newList.splice(0, this.newList.length)
        this.newList = this.newList.concat(data)
        done(true)
      })
    },
    infinite(done) {
      this.getNoticeList(this.newList.length, (data) => {
        this.newList = this.newList.concat(data)
        if (data.length >= 20) {
          done()
        } else {
          done(true)
        }
      })
    },
    onPublish () {
      this.$router.push({name: 'educationVotePublish'})
    },
    getNoticeList (rowStart, callback) {
      var schoolId = this.$route.params.schoolId
      var rowCount = 20
      api.getVoteManageList({schoolId, voteScope: this.tabIndex, rowStart, rowCount}, (list) => {
        for (var i = 0; i < list.length; i++) {
          let item = list[i]
          if (item.voteType === 'TEXT') {
            item.voteTypeTitle = '普通文字'
          } else if (item.voteType === 'IMAGE') {
            item.voteTypeTitle = '普通图片'
          } else if (item.voteType === 'TEACHER') {
            item.voteTypeTitle = '教师图片'
          } else if (item.voteType === 'STUDENT') {
            item.voteTypeTitle = '学生图片'
          }
          if (item.voteStatus === 0) {
            item.voteStatusTitle = '未发布'
            item.voteStatusColor = '#FC5355'
          } else if (item.voteStatus === 3) {
            item.voteStatusTitle = '已结束'
            item.voteStatusColor = '#75757B'
          } else if (item.voteStatus === 2 || item.voteStatus === 1) {
            item.voteStatusTitle = '进行中'
            item.voteStatusColor = '#51C332'
          }
        }
        callback(list)
      }, () => {})
    },
    getFormateDate (time) {
      return dateFormat(time, 'YYYY/MM/DD')
    },
    showOperate (index) {
      this.showMenu = true
      this.selectedIndex = index
      var item = this.newList[index]
      if (item.voteStatusTitle === 3) {
        this.managemenus = {
          preview: '查看',
          delete: '删除'
        }
      } else {
        if (item.isOpen === true) {
          if (item.voteStatus === 0) {
            this.managemenus = {
              publish: '发布投票',
              changeItem: '投票项管理',
              change: '修改',
              delete: '删除'
            }
          } else {
            if (item.isAudit === true) {
              this.managemenus = {
                preview: '查看',
                review: '报名审核',
                changeItem: '投票项管理',
                delete: '删除'
              }
            } else {
              this.managemenus = {
                preview: '查看',
                changeItem: '投票项管理',
                delete: '删除'
              }
            }
          }
        } else {
          if (item.voteStatus === 0) {
            this.managemenus = {
              publish: '发布投票',
              changeItem: '投票项管理',
              change: '修改',
              delete: '删除'
            }
          } else {
            this.managemenus = {
              preview: '查看',
              changeItem: '投票项管理',
              delete: '删除'
            }
          }
        }
      }
    },
    menuClick (key) {
      var currentItem = this.newList[this.selectedIndex]
      switch (key) {
        case 'preview':
          this.$router.push({name: 'educationVoteSituation', params: {schoolId: this.$route.params.schoolId, voteId: currentItem.voteId}})
          break
        case 'change':
          this.$router.push({name: 'educationVoteEdit', params: {schoolId: this.$route.params.schoolId, voteId: currentItem.voteId}})
          break
        case 'changeItem':
          if (currentItem.voteType === 'TEXT') {
            this.$router.push({name: 'educationVoteItemList', params: {schoolId: this.$route.params.schoolId, voteId: this.newList[this.selectedIndex].voteId, type: 1}})
          } else {
            this.$router.push({name: 'educationVoteItemList', params: {schoolId: this.$route.params.schoolId, voteId: this.newList[this.selectedIndex].voteId, type: 2}})
          }
          break
        case 'delete':
          var item = this.newList[this.selectedIndex]
          this.showConfirm = true
          this.confirmType = 1
          this.confirmDesc = '您确定要删除［' + item.voteName + '］吗'
          break
        case 'publish':
          var item2 = this.newList[this.selectedIndex]
          this.showConfirm = true
          this.confirmType = 2
          this.confirmDesc = '发布后不可再修改，您确定要发布［' + item2.voteName + '］吗'
          break
        case 'review':
          this.$router.push({name: 'educationSignUpReview', params: {schoolId: this.$route.params.schoolId, voteId: currentItem.voteId}})
          break
      }
    },
    onConfirm (type) {
      if (type === 1) {
        this.onDelete()
      } else if (type === 2) {
        this.confirmPublish()
      }
    },
    onDelete () {
      var voteId = this.newList[this.selectedIndex].voteId
      api.delSchoolVote({schoolId: this.$route.params.schoolId, voteId}, (data) => {
        if (data.rs === 1) {
          this.newList.splice(this.selectedIndex, 1)
          this.tools.successToast('删除成功')
        } else {
          this.tools.warnToast('删除失败')
        }
      }, () => {
        this.tools.warnToast('删除失败')
      })
    },
    confirmPublish () {
      let item = this.newList[this.selectedIndex]
      api.publishVote({schoolId: this.$route.params.schoolId, voteId: item.voteId}, (data) => {
        this.tools.successToast('发布成功')
        item.voteStatus = 1
        item.voteStatusTitle = '进行中'
        item.voteStatusColor = '#51C332'
      }, (errorData) => {
        if (errorData.toUser) {
          this.tools.warnToast(errorData.message)
        } else {
          this.tools.successToast('发布失败')
        }
      })
    }
  }
}
</script>

<style>

.notice-cell-status{
  margin-right:-8px; 
  padding:0px;
  font-size: 10px;
  width: 48px;
  height: 20px;
  line-height:20px;
  text-align:center;
  color: #fff;
  border-radius:5px;

}
.notic_list_img {
  width: 70px;
  height:55px;
  display: block;
  border-radius: 2px;
  margin-right: 10px;
  background-position: center center;
  background-size: cover;
  border-style:none;
  border-width:0;
}

</style>
