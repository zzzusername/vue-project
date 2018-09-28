<template>
  <div>
    <tab v-if="isSchoolManage" custom-bar-width="5em">
      <!-- <tab-item :selected="selectedIndex == index" @on-item-click="tabSelect" v-for="(item, index) in tabList" :key="index">{{item}}</tab-item> -->
      <tab-item selected @on-item-click="tabSelect(1)">全校公告</tab-item>
      <tab-item @on-item-click="tabSelect(2)">教师公告</tab-item>
      <tab-item @on-item-click="tabSelect(3)">班级公告</tab-item>
    </tab>
    <div v-if="isSchoolManage != null" :style="{'position': 'relative', 'height': scrollerHeight + 'px', 'margin-top': '-1px'}">
      <scroller :on-infinite="infinite" :on-refresh="refresh" no-data-text="没有更多公告～" ref="manage_scroller">
        <div>
          <group gutter="0">
            <cell v-for="(item, index) in newList" :key="index" :title="item.noticeTitle.length>19?item.noticeTitle.substring(0,19)+'...':item.noticeTitle" style="font-size: 16px;" @click.native="showOperate(index)" is-link>
              <div slot="icon" class="notic_list_img" :style="{'background-image':'url('+tools.cdn(item.noticeImages[0], 'notice.png', 128)+')'}">
                <!-- <p v-if="item.noticeReadFeedback==2" style="font-size: 10px;color:#fff;background-color:red;width: 2em;height:12px;padding: 2px;text-align:center;line-height: 12px;">重要</p> -->
              </div>
              <p slot="inline-desc" style="margin-top:5px;">{{tools.getDateDiff(item.createDate)}}&nbsp;<span v-if="item.readerNum">{{item.readerNum}}阅读&nbsp;</span><span v-else-if="item.viewNum">{{item.viewNum}}浏览</span>
              <span v-if="tabIndex == 3 && item.className"><br>{{getClassName(item.className)}}</span>
              </p>
              <!-- <span slot="child" class="notice-cell-status" :style="{backgroundColor: (item.isExpire ? '#FC501F' : '#A2D268')}">{{item.isExpire ? '已过期' : '进行中'}}</span> -->
            </cell>
          </group>
          <p v-if="isNoData" style="textAlign:center;marginTop:20px;color:#999;font-size:14px">没有发布任何公告～</p>
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
import api from '@/feature/notice/api'
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
        name: '发布公告'
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
    console.log('mounted')
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
      this.$router.push({name: 'educationNoticePublish'})
    },
    getNoticeList (rowStart, callback) {
      var schoolId = this.$route.params.schoolId
      var rowCount = 20
      api.getNoticeManageList({schoolId, type: this.tabIndex, rowStart, rowCount}, (list) => {
        for (var i = 0; i < list.length; i++) {
          if (list[i].noticeImg !== null) {
            list[i].noticeImages = list[i].noticeImg.split(',')
          } else {
            list[i].noticeImages = ''
          }
        }
        callback(list)
      }, () => {})
    },
    getFormateDate (time) {
      return dateFormat(time, 'YYYY-MM-DD HH:mm')
    },
    showOperate (index) {
      this.showMenu = true
      this.selectedIndex = index
      var item = this.newList[index]
      if (item.isExpire) {
        this.managemenus = {
          preview: '预览',
          delete: '删除'
        }
      } else {
        if (item.noticeReadFeedback === 1) {
          this.managemenus = {
            preview: '预览',
            change: '修改',
            push: '推送',
            delete: '删除'
          }
        } else {
          this.managemenus = {
            preview: '预览',
            read: '阅读情况',
            change: '修改',
            push: '推送',
            delete: '删除'
          }
        }
      }
    },
    menuClick (key) {
      switch (key) {
        case 'preview':
          this.$router.push({name: 'educationNoticeDetail', params: {schoolId: this.$route.params.schoolId, noticeId: this.newList[this.selectedIndex].noticeId}})
          break
        case 'change':
          this.$router.push({name: 'educationModifyNotice', params: {schoolId: this.$route.params.schoolId, noticeId: this.newList[this.selectedIndex].noticeId}})
          break
        case 'delete':
          var item = this.newList[this.selectedIndex]
          this.showConfirm = true
          this.confirmType = 1
          this.confirmDesc = '您确定要删除［' + item.noticeTitle + '］吗'
          break
        case 'push':
          var item2 = this.newList[this.selectedIndex]
          this.showConfirm = true
          this.confirmType = 2
          this.confirmDesc = '您确定要推送［' + item2.noticeTitle + '］吗'
          break
        case 'read':
          this.$router.push({name: 'educationReaderList', params: {noticeId: this.newList[this.selectedIndex].noticeId}})
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
      var noticeId = this.newList[this.selectedIndex].noticeId
      api.deleteNotice({schoolId: this.$route.params.schoolId, noticeId}, (data) => {
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
    onPush () {
      api.pushNotice({schoolId: this.$route.params.schoolId, noticeId: this.newList[this.selectedIndex].noticeId}, (data) => {
        this.tools.successToast('推送成功')
      }, (errorData) => {
        if (errorData.toUser) {
          this.tools.warnToast(errorData.message)
        } else {
          this.tools.successToast('推送失败')
        }
      })
    },
    getClassName(val) {
      let arr = val.split(',')
      let str = ''
      if (arr.length > 1) {
        str = str + arr[0] + ',' + arr[1] + '等'
      } else {
        str = val
      }
      return str
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
