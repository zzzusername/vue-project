<template>
  <div>
    <tab custom-bar-width="6em">
      <tab-item selected @on-item-click="onItemClick">考勤</tab-item>
      <!-- <tab-item @on-item-click="onItemClick">周报</tab-item> -->
      <tab-item @on-item-click="onItemClick">统计</tab-item>
    </tab>
    <p v-if="tabIndex == 0" style="overflow:hidden;box-sizing: border-box;line-height:36px;padding: 0 15px;">
      <span style="color:#999;">{{'共有' + recordList.length + '条考勤记录'}}</span>
      <span style="float:right;color:rgb(142, 191, 82);font-size:16px;height:36px;line-height:36px;" @click="showFilter = true">筛选</span>
    </p>
    <div v-if="tabIndex == 0" :style="{'height': scrollerHeightrecord + 'px', 'position': 'relative'}">
      <scroller :on-infinite="infinite" ref="recordList_scroller" no-data-text="没有更多点名～">
        <div style="height: 10px" v-if="recordList.length==0"></div>
        <cell style="fontSize: 14px;backgroundColor: #fff;" v-for="(item, index) in recordList" :key="index" is-link @click.native="skip(item)">
          <p style="fontSize: 16px;" slot="title"><span>{{item.lessonName==null?'全天点名':item.lessonName}}</span>&nbsp;<span style="fontSize: 13px;color:#999;margin-left:5px">{{tools.formateTime(item.checkDate, 'YYYY-MM-DD HH:mm')}}</span></p>
          <p slot="inline-desc"><span>{{item.className}}</span><span style="margin-left:15px">{{item.teacherName}}</span></p>
          <p :style="{color: item.checkStatus == 2 || parseInt(item.timeStatus) ? '#999':'#8ebf52'}">{{item.timeStatus == "1" ? '点名结束' : getStatus(item.checkStatus)}}</p>
        </cell>
      </scroller>
    </div>
    <!-- <div v-else-if="tabIndex == 1" :style="{'height': scrollerHeight + 'px', 'position': 'relative'}">
      <scroller :on-infinite="infinite" ref="weekly_scroller" no-data-text="没有更多周报～">
        <div style="height: 10px" v-if="weeklyList.length==0"></div>
        <cell style="fontSize: 14px;backgroundColor: #fff;" v-for="(item, index) in weeklyList" :key="index" is-link @click.native="operateWeekly(item)">
          <p style="fontSize: 16px;" slot="title">{{tools.formateTime(item.weeklyEndDate, 'YYYY-MM-DD') + ' 周报'}}</p>
          <p slot="inline-desc">{{item.className}}></p>
          <p :style="{'color': item.pushNumber == 0 ? '#FF6D56' : '#A2D268'}">{{item.pushNumber == 0 ? '未推送' : '已推送' + item.pushNumber + '次'}}</p>
        </cell>
      </scroller>
    </div> -->
    <div v-else :style="{'height': scrollerHeight + 'px'}">
      <attend-count></attend-count>
    </div>
    <detail-tabbar :actionLink="createRollCall" :actions="actions"></detail-tabbar>
    <toast v-model="showToast" type="text" :time="3000" width="13em" position="bottom" text="您不是创建者，暂时无<br>法查看未结束的点名"></toast>
    <actionsheet v-model="showActionSheet" :menus="menus" show-cancel @on-click-menu="menuClick"></actionsheet>
    <div v-transfer-dom>
      <confirm v-model="showConfirm" title="提示" theme="ios" @on-confirm="onConfirm">
        <p style="text-align:center;">{{ confirmHint }}</p>
      </confirm>
    </div>
    <popup v-model="showFilter" height="80%" style="backgroundColor: #fff;">
        <div style="backgroundColor: #fff;width: 100%;padding-bottom:50px;box-sizing: border-box;">
          <div style="padding: 5px 10px;">
            <p style="marginBottom: 10px;">日期区间</p>
            <div style="display: flex;">
              <p style="flex: 1;color: rgb(178, 178, 178);textAlign: center;borderRadius: 3px;backgroundColor: #ececec;lineHeight: 32px;fontSize: 12px;" @click="showDatefun('start')">{{startDate | filterStart}}</p>
              <p style="width: 20px;lineHeight:32px;textAlign: center">-</p>
              <p style="flex: 1;color: rgb(178, 178, 178);textAlign: center;borderRadius: 3px;backgroundColor: #ececec;lineHeight: 32px;fontSize: 12px;" @click="showDatefun('end')">{{endDate | filterEnd}}</p>
            </div>
          </div>
          <div style="padding: 5px 10px 5px;">
            <p style="marginBottom: 10px;">班级</p>
            <div>
              <checker v-model="filterData.classId" default-item-class="default_class" selected-item-class="selected_class">
                <checker-item style="marginRight: 3px;overflow: hidden; text-overflow:ellipsis; white-space: nowrap;" v-for="(item, index) in classData" :key="index" :value="item.value">{{item.name}}</checker-item>
              </checker>
            </div>
          </div>
          <div style="display:flex;position: fixed;z-index:;100000000;width: 100%;bottom: 0;height: 50px;">
            <div style="flex: 1;backgroundColor:rgb(230, 230, 230)" @click="clearFilter">
              <p style="line-height: 50px; textAlign: center;">重置</p>
            </div>
            <div style="flex: 1;backgroundColor: #8ebf52" @click="confirmFilter">
              <p style="line-height: 50px; textAlign: center;color: #fff;">确定</p>
            </div>
          </div>
        </div>
    </popup>
    <div v-transfer-dom>
      <popup v-model="showDate" style="background:#fff;">
        <Group gutter="0">
          <cell>
            <span slot="title" @click="showDate = false">取消</span>
            <span slot="default" style="color:rgb(142, 191, 82);" @click="confirmDate">完成</span>
          </cell>
        </Group>
        <datetime-view ref="datetime" v-model="valueDate" year-row="{value}年" month-row="{value}月" day-row="{value}日"></datetime-view>
      </popup>
    </div>
  </div>
</template>

<script>
import { DatetimeView, dateFormat, Popup, Checker, CheckerItem, Group, Cell, Toast, Tab, TabItem, Actionsheet, Confirm, TransferDomDirective as TransferDom } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import AttendCount from '../statistics/AttendCount.vue'
import api from '../../api'
export default {
  directives: {
    TransferDom
  },
  components: {
    DatetimeView, dateFormat, Popup, Checker, CheckerItem, Group, Cell, Toast, DetailTabbar, Tab, TabItem, Actionsheet, Confirm, AttendCount
  },
  data () {
    return {
      actions: [{name: '创建点名'}],
      scrollerHeight: 0,
      scrollerHeightrecord: 0,
      recordList: [],
      weeklyList: [],
      globalUserId: null,
      showToast: false,
      tabIndex: 0,
      showActionSheet: false,
      menus: {look: '查看', push: '推送'},
      tempWeekly: {},
      showConfirm: false,
      confirmHint: '',
      showFilter: false,
      classData: [],
      startDate: null,
      endDate: null,
      showDate: false,
      valueDate: dateFormat(new Date(), 'YYYY-MM-DD'),
      filterData: {
        classId: null
      },
      tag: null
    }
  },
  mounted() {
    this.scrollerHeight = window.innerHeight - 50 - 44
    this.scrollerHeightrecord = window.innerHeight - 50 - 44 - 36
    this.globalUserId = this.$store.getters.userInfo.userId
    api.queryTeacherClassList({schoolId: this.$route.params.schoolId, featureCode: 'QINGJIA'}, (data) => {
      data.forEach((element) => {
        var item = {
          name: element.className,
          value: element.classId
        }
        this.classData.push(item)
      }, this)
    }, () => {})
  },
  methods: {
    clearFilter () {
      this.filterData = {
        classId: null
      }
      this.startDate = null
      this.endDate = null
    },
    confirmFilter () {
      if (this.startDate !== null && this.startDate !== undefined) {
        this.filterData.startDate = this.startDate + ' ' + '00:00:00'
      }
      if (this.endDate !== null && this.endDate !== undefined) {
        this.filterData.endDate = dateFormat(new Date(this.endDate).getTime() + 24 * 60 * 60 * 1000, 'YYYY-MM-DD') + ' ' + '00:00:00'
      }
      this.recordList = []
      this.$refs.recordList_scroller.finishInfinite()
      this.showFilter = false
    },
    showDatefun(code) {
      this.showDate = true
      if (code === 'start') {
        if (!this.tools.isNull(this.startDate)) {
          this.valueDate = this.startDate
        }
        this.tag = 'start'
      } else {
        if (!this.tools.isNull(this.endDate)) {
          this.valueDate = this.endDate
        }
        this.tag = 'end'
      }
      this.$refs.datetime.render()
    },
    confirmDate() {
      if (this.tag === 'start') {
        this.startDate = this.valueDate
        this.showDate = false
      } else {
        this.endDate = this.valueDate
        this.showDate = false
      }
    },
    operateWeekly(val) {
      this.tempWeekly = val
      this.showActionSheet = true
    },
    menuClick(val) {
      switch (val) {
        case 'look':
          this.$router.push({name: 'educationTeacherWeeklyDetail', params: {classId: this.tempWeekly.classId, weeklyId: this.tempWeekly.weeklyId}})
          break
        case 'push':
          this.showConfirm = true
          this.confirmHint = '你确定推送' + this.tools.formateTime(this.tempWeekly.weeklyEndDate, 'YYYY-MM-DD') + '的周报吗？'
          break
      }
    },
    onConfirm() {
      api.pushWeekly({schoolId: this.$route.params.schoolId, weeklyId: this.tempWeekly.weeklyId, classId: this.tempWeekly.classId}, (data) => {
        this.tools.successToast('推送成功')
        for (var i = 0; i < this.weeklyList.length; i++) {
          if (this.weeklyList[i].weeklyId === this.tempWeekly.weeklyId) {
            this.weeklyList[i].pushNumber += 1
          }
        }
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    onItemClick(index) {
      this.tabIndex = index
      switch (index) {
        case 0:
          break
        case 1:
          // if (this.weeklyList.length === 0) {
          //   this.$refs.weekly_scroller.finishInfinite()
          // }
          break
      }
    },
    skip (val) {
      if (val.checkStatus === 1 && val.timeStatus === '0') {
        if (val.userId === this.globalUserId) {
          this.$router.push({ name: 'educationRollCall', params: { checkId: val.checkId, classId: val.classId, status: val.checkStatus } })
        } else {
          this.showToast = true
        }
      } else {
        this.$router.push({ name: 'educationRollcallDetail', params: { checkId: val.checkId, classId: val.classId } })
      }
    },
    createRollCall () {
      this.$router.push({name: 'educationCreateRollCall'})
    },
    infinite (done) {
      if (this.tabIndex === 0) {
        this.getRollcallRecord(this.filterData, this.recordList.length, (data) => {
          this.recordList = this.recordList.concat(data)
          if (data.length < 20) {
            done(true)
          } else {
            done()
          }
        })
      } else {
        // 请求周列表接口
        this.getManageWeeklyList(this.weeklyList.length, (data) => {
          this.weeklyList = this.weeklyList.concat(data)
          if (data.length < 20) {
            done(true)
          } else {
            done()
          }
        })
      }
    },
    getRollcallRecord(filterData, rowStart, callback) {
      api.getTeacherRollcallList({schoolId: this.$route.params.schoolId, data: filterData, rowStart: rowStart, rowCount: 20}, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    getManageWeeklyList(rowStart, callback) {
      api.getManageWeeklyList({schoolId: this.$route.params.schoolId, rowStart: rowStart, rowCount: 20}, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    getStatus(val) {
      var str
      switch (val) {
        case 1:
          str = '未结束'
          break
        case 2:
          str = '点名结束'
          break
      }
      return str
    }
  },
  filters: {
    filterStart: function (val) {
      if (val !== null) {
        return val
      } else {
        return '开始时间'
      }
    },
    filterEnd: function (val) {
      if (val !== null) {
        return val
      } else {
        return '结束时间'
      }
    }
  }
}
</script>

<style>

</style>
