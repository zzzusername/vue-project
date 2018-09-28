<template>
  <!-- 星级班级评定排名查询 -->
  <div>
    <div v-if="rankingData.length > 0">
      <span style="position: absolute;right: 0;top: 0;margin-right:10px;margin-top:5px;color:#2E84D4;" @click="showFilter=true">筛选条件</span>
      <p style="text-align:center;font-size:16px;margin-top:40px;">{{currentTitle}}</p>
      <p style="text-align:center;font-size:14px;color:#a2a2a2">{{startDate + ' 至 ' + endDate}}</p>
      <group>
        <cell v-for="(item, index) in rankingData" :key="index" :title="item.className" :value="item.totalScore+'分'" is-link @click.native="onShowDetail(item)">
          <p slot="inline-desc" style="margin-top:5px;">排名：{{item.ranking}}</p>
        </cell>
      </group>
    </div>
    <guide v-else :filterLink="onShowFilterView">
      <p style="text-align:center;color: #999">{{filterDesc}}</p>
    </guide>
    <div v-transfer-dom>
      <popup v-model="showFilter" height="80%">
        <div style="backgroundColor: #fff;width: 100%;minHeight: 90%;position: relative">
          <scroller>
            <div style="padding: 5px 10px 5px;">
              <p style="marginBottom: 10px;">选择年级</p>
              <select v-model="currentGradeId" class="select_week" style="margin-bottom:10px;">
                <option v-for='(item, index) in gradeList' :key="index" :value="item.gradeId">&nbsp;&nbsp;{{item.gradeName}}</option>
              </select>
            </div>
            <div style="padding: 5px 10px 5px;">
              <p style="marginBottom: 10px;">排名类型</p>
              <div>
                <checker v-model="filterType" default-item-class="default_class" selected-item-class="selected_class" :radio-required="true">
                  <checker-item style="marginRight: 5px;" value="W" @on-item-click="selectType">周排名</checker-item>
                  <checker-item style="marginRight: 5px;" value="M" @on-item-click="selectType">月排名</checker-item>
                  <checker-item style="marginRight: 5px;" value="S" @on-item-click="selectType">学期排名</checker-item>
                </checker>
              </div>
            </div>
            <div style="padding: 0px 10px 5px;" v-if="filterType === 'W'">
              <p style="marginBottom: 10px;">选择学年</p>
              <div>
                <span style="border: 1px solid rgb(142, 191, 82);height:30px;display:block;font-size:12px;text-align:center;line-height:30px;width:60px;" @click="selectYear">
                  {{currentYear}}
                </span>
              </div>
            </div>
            <div style="padding: 0px 10px 5px;" v-if="filterType === 'W'">
              <p style="marginBottom: 10px;">选择周</p>
              <div>
                <select v-model="currentWeek" class="select_week">
                  <option v-for='(item, index) in weeks' :key="index" :value="item">&nbsp;&nbsp;第{{item}}周</option>
                </select>
                <span style="color:#a2a2a2;font-size:14px;margin-left:5px;">{{startDate}} 至 {{endDate}}</span>
              </div>
            </div>
            <div style="padding: 0px 10px 5px;" v-if="filterType === 'M'">
              <p style="marginBottom: 10px;">选择月</p>
              <div>
                <select v-model="currentMonth" class="select_week">
                  <option v-for='(item, index) in months' :key="index" :value="item">&nbsp;&nbsp;{{item}}月</option>
                </select>
              </div>
            </div>
            <div style="padding: 0px 10px 5px;" v-if="filterType === 'S'">
              <p style="marginBottom: 10px;">选择学期</p>
              <div>
                <select v-model="currentTerm" class="select_week">
                  <option v-for='(item, index) in terms' :key="index" :value="item">&nbsp;&nbsp;第{{item}}学期</option>
                </select>
              </div>
            </div>
            <div style="padding: 10px 10px 5px;" v-if="filterType === 'S' || filterType === 'M'">
              <p style="marginBottom: 10px;">日期区间</p>
              <div style="display: flex;">
                <p style="flex: 1;textAlign: center;borderRadius: 3px;backgroundColor: #ececec;lineHeight: 32px;fontSize: 12px;color: #b2b2b2;" @click="selectTime('start')">{{startDate == null ? '开始日期' : startDate}}</p>
                <p style="width: 20px;lineHeight:32px;textAlign: center">-</p>
                <p style="flex: 1;textAlign: center;borderRadius: 3px;backgroundColor: #ececec;lineHeight: 32px;fontSize: 12px;color: #b2b2b2;" @click="selectTime('end')">{{endDate == null ? '结束日期' : endDate}}</p>
              </div>
            </div>
            <div style="height: 50px;"></div>
          </scroller>
        </div>
        <div style="display: flex;height: 50px;position: absolute;bottom: 0;width: 100vw;">
          <p style="flex: 1;textAlign: center;lineHeight: 50px;backgroundColor: rgb(230, 230, 230)" @click="clearFilter">关闭</p>
          <p style="flex: 1;textAlign: center;lineHeight: 50px;color: #fff;backgroundColor: #A2D268" @click="confirmFilter">查询</p>
        </div>
      </popup>
    </div>
    <div v-transfer-dom>
      <popup v-model="showDatetime">
        <group gutter="0">
          <cell>
            <p slot="title" style="color: #828282;fontSize: 14px;" @click="showDatetime=false">取消</p>
            <p style="color: #A2D268;fontSize: 14px;" @click="confirm">确定</p>
          </cell>
        </group>
        <datetime-view ref="datetime" :min-year="startTime - 1" :max-year="startTime" v-model="datetime" year-row="{value}年" month-row="{value}月" day-row="{value}日"></datetime-view>
      </popup>
    </div>
    <div v-transfer-dom>
      <popup v-model="showYear">
        <group gutter="0">
          <cell>
            <p slot="title" style="color: #828282;fontSize: 14px;" @click="showYear=false">取消</p>
            <p style="color: #A2D268;fontSize: 14px;" @click="confirmYear">确定</p>
          </cell>
        </group>
        <datetime-view :min-year="startTime - 1" :max-year="startTime" format="YYYY" v-model="currentTempYear" year-row="{value}年" month-row="{value}月"></datetime-view>
      </popup>
    </div>
    <x-dialog v-model="showDetail" :dialog-style="{'text-align': 'left', 'min-height': '60vh', 'border-radius': '8px'}" hide-on-blur>
      <div>
        <scroller>
          <p style="text-align:center;margin-top:10px;margin-bottom:10px;font-size:16px;">{{currentItem.className}}</p>
          <group gutter="0">
            <cell v-for="(item, index) in currentItem.projects" :key="index" :title="item.projectName" :value="item.totalStore+'分'">
              <p slot="inline-desc" style="margin-top:5px;">排名：{{item.ranking}}</p>
            </cell>
          </group>
        </scroller>
      </div>
    </x-dialog>
    <detail-tabbar :actionLink="submit" :actions="actions"></detail-tabbar>
  </div>
</template>

<script>
import { Cell, Group, Popup, Checker, CheckerItem, Picker, TransferDomDirective as TransferDom, DatetimeView, XDialog } from 'vux'
import Guide from '@/feature/education/page/statistics/Guide.vue'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '@/feature/moral/api'
import eduApi from '../../education/api'
export default {
  directives: {
    TransferDom
  },
  components: {
    Cell, DetailTabbar, Guide, Popup, Checker, CheckerItem, Picker, Group, DatetimeView, XDialog
  },
  watch: {
    currentWeek (newVal, oldVal) {
      let weekDate = this.tools.getWeekDate(this.currentYear, newVal)
      this.startDate = weekDate.startDate
      this.endDate = weekDate.endDate
    },
    filterType (newVal, oldVal) {
      if (newVal === 'W') {
        this.getWeek()
      } else {
        this.startDate = null
        this.endDate = null
      }
    }
  },
  data () {
    return {
      actions: [{name: '生成报告并推送'}],
      filterDesc: '请选择筛选条件',
      showFilter: false,
      filters: {},
      filterType: 'W',
      weeks: [],
      currentWeek: 1,
      // currentWeekStartDate: '',
      // currentWeekEndDate: '',
      showWeekSelecter: false,
      currentMonth: new Date().getMonth(),
      months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      currentTerm: '1',
      terms: [1, 2],
      showDatetime: false,
      startTime: parseInt(this.tools.formateTime(new Date(), 'YYYY')),
      datetime: this.tools.formateTime(new Date(), 'YYYY-MM-DD'),
      startDate: null,
      endDate: null,
      timeType: null,
      showYear: false,
      currentYear: this.tools.formateTime(new Date(), 'YYYY'),
      currentTempYear: this.tools.formateTime(new Date(), 'YYYY'),
      currentGradeId: '',
      gradeList: [],
      rankingData: [],
      currentTitle: '',
      showDetail: false,
      currentItem: {}
    }
  },
  mounted () {
    this.getWeek()
    eduApi.getGradeList({schoolId: this.$route.params.schoolId}, (data) => {
      this.gradeList = data
      if (data.length > 0) {
        this.currentGradeId = data[0].gradeId
      }
    }, () => {
    })
  },
  methods: {
    getWeek () {
      for (var i = 1; i <= this.tools.getWeekCount(this.currentYear); i++) {
        this.weeks.push(i + '')
      }
      let week = this.tools.getWeekNumber(this.currentYear)
      this.currentWeek = week.week
      this.startDate = week.startDate
      this.endDate = week.endDate
    },
    onShowFilterView () {
      this.showFilter = true
    },
    selectType (itemValue, itemDisabled) {
      this.filterType = itemValue + ''
    },
    selectTime(val) {
      this.timeType = val
      switch (this.timeType) {
        case 'start':
          if (this.startDate) {
            this.datetime = this.startDate
          }
          break
        case 'end':
          if (this.endDate) {
            this.datetime = this.endDate
          }
          break
      }
      this.$refs.datetime.render()
      this.showDatetime = true
    },
    confirm() {
      switch (this.timeType) {
        case 'start':
          this.startDate = this.datetime
          break
        case 'end':
          this.endDate = this.datetime
          break
      }
      this.datetime = this.tools.formateTime(new Date(), 'YYYY-MM-DD')
      this.showDatetime = false
    },
    submit () {
      let reportCycle = null
      let reportYear = null
      if (this.filterType === 'W') {
        reportCycle = this.currentWeek
        reportYear = this.currentYear
      } else if (this.filterType === 'M') {
        reportCycle = this.currentMonth
        reportYear = new Date(this.startDate).getFullYear()
      } else if (this.filterType === 'S') {
        reportCycle = this.currentTerm
        reportYear = new Date(this.startDate).getFullYear()
      }
      if (this.rankingData.length === 0) {
        this.tools.warnToast('没有评定数据')
        return
      }
      api.addClassReport({schoolId: this.$route.params.schoolId, gradeId: this.currentGradeId, startDate: this.startDate, endDate: this.endDate, reportType: this.filterType, reportCycle, reportYear}, () => {
        this.tools.successToast('生成报告成功')
        this.$router.back()
      }, (er) => {
        if (er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    clearFilter () {
      this.showFilter = false
    },
    confirmFilter () {
      if (!this.startDate || !this.startDate) {
        this.tools.warnToast('请选择时间区间')
        return
      }
      api.previewClassReport({schoolId: this.$route.params.schoolId, gradeId: this.currentGradeId, startDate: this.startDate, endDate: this.endDate}, (data) => {
        this.rankingData = data
        this.showFilter = false
        let currentGradeName = this.getCurrentGradeName(this.currentGradeId)
        if (this.filterType === 'W') {
          this.currentTitle = '【第' + this.currentWeek + '周】【' + currentGradeName + '】班级周评定排名'
        } else if (this.filterType === 'M') {
          this.currentTitle = '【' + this.currentMonth + '月】【' + currentGradeName + '】班级月评定排名'
        } else if (this.filterType === 'S') {
          this.currentTitle = '【第' + this.currentTerm + '学期】【' + currentGradeName + '】班级学期评定排名'
        }
        if (data.length === 0) {
          this.filterDesc = this.currentTitle + '暂无排名信息'
        }
      }, () => {})
    },
    confirmYear () {
      this.currentYear = this.currentTempYear
      this.getWeek()
      this.showYear = false
    },
    selectYear () {
      this.showYear = true
    },
    getCurrentGradeName (id) {
      let gradeName = ''
      this.gradeList.forEach(element => {
        if (parseInt(id) === parseInt(element.gradeId)) {
          gradeName = element.gradeName
        }
      })
      return gradeName
    },
    onShowDetail (item) {
      this.showDetail = true
      this.currentItem = item
    }
  }
}
</script>

<style>
.default_class {
  border: 1px solid #ececec;
  padding: 5px 0;
  font-size: 12px;
  margin-bottom: 5px;
  width: 29%;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.selected_class {
  border: 1px solid rgb(142, 191, 82);
}
.select_week {
  width:80px;
  height:30px;
  font-size:12px;
  border:1px solid rgb(142, 191, 82);
}
.select_week select{
  text-align:center;
  background: #fff;
}
</style>
