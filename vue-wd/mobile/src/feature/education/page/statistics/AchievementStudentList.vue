<template>
  <div>
    <div v-show="isDefault == false" style="height:36px;">
      <span class="iconfont icon-List" :style="{'float':'left', 'margin-left':'20px', 'font-size':'22px', 'color':showList==true?'#A2D268':'#a2a2a2'}" @click="changeStyle(true)"></span>
      <span class="iconfont icon-biaoge" :style="{'float':'left', 'margin-left':'20px', 'font-size':'22px', 'color':showList==true?'#a2a2a2':'#A2D268'}" @click="changeStyle(false)"></span>
      <p v-show="showList==true" style="float:right;margin-right:10px;color:#2E84D4;height:36px;line-height:36px;text-align:center;font-size:16px;" @click="onShowFilterView">筛选</p>
    </div>
    <div v-if="isDefault == false && showList == true" :style="{'height': scrollerHeight + 'px', 'position': 'relative'}">
      <scroller :on-infinite="infinite" ref="scroller">
        <!-- <cell v-show="list.length>0" style="fontSize: 16px;backgroundColor: #fff;" title="表格展示" is-link>
          <span slot class="iconfont icon-biaoge"></span>
        </cell> -->
        <cell style="fontSize: 16px;backgroundColor: #fff;" v-for="(item,index) in list" :key="index" :title="item.studentName" is-link @click.native="onItemclick(item)">
          <div slot="icon" class="statistics_achi_student_icon" :style="{'background-image':'url('+tools.cdn(item.userIcon, 'head.png', 128)+')'}"></div>
          <div v-if="parseFloat(item.sumNum)>0" slot>总分：{{item.sumNum}}</div>
          <div v-else slot>平均分：{{item.avgNum}}</div>
        </cell>
      </scroller>
    </div>
    <div v-else-if="isDefault == false && showList == false" :style="{'overflow-x': 'auto', 'overflow-y': 'auto', 'backgroundColor': '#fff', 'minWidth': '100%', 'height': scrollerHeight + 'px'}">
      <table-view :tabData="tabData" :func="getStatus"></table-view>
    </div>
    <guide v-else :filterLink="onShowFilterView">
      <p style="text-align:center;color: #999">{{filterDesc}}</p>
    </guide>
    <achievement-filter-view :showFilter="showFilter" :confirmFilter="confirmFilter" :classId="classId"></achievement-filter-view>
    <div v-transfer-dom>
      <x-dialog v-model="showDialog" hide-on-blur class="achi-dialog">
        <div style="max-height:70vh;overflow-y: scroll;padding: 15px 0px 20px;">
          <div style="">
            <div class="statistics_achi_dialog_user_icon" :style="{'background-image':'url('+tools.cdn(currentItem.userIcon, 'head.png', 128)+')', 'border-radius': '27px'}"></div>
            <p style="textAlign: center;">{{currentItem.studentName}}</p>
            <p>时间范围: {{tools.formateTime(new Date(filters.startDate), 'YYYY.MM.DD') + ' - ' + tools.formateTime(new Date(filters.endDate), 'YYYY.MM.DD')}}</p>
            <p v-if="filters.achievementsId!=null&&filters.achievementsId.length>0">总分：{{currentItem.sumNum}}</p>
            <p v-else>平均分: {{currentItem.avgNum}}</p>
          </div>
          <divider style="color: #d2d2d2;margin: 0 20px">•</divider>
          <div v-for="(item, index) in studentDeatil.lesson" :key="index" class="statistics_achi_dialog_attend_detail">
            <p v-if="filters.achievementsId!=null&&filters.achievementsId.length>0">
              <strong>{{item.lessonName == null ? '总成绩' : item.lessonName}}: </strong>
              <span style="font-size: 14px;">{{item.achievementsScore == null ? '无成绩' : item.achievementsScore + '分'}}</span>
            </p>
            <p v-else>
              <strong>{{item.achievementsName}}: </strong>
              <span style="font-size: 14px;">{{item.achievementsScore == null ? '无成绩' : item.achievementsScore + '分'}}</span>
            </p>
          </div>
          <!-- <div style="overflow-x: scroll">
            <CountTime v-show="filters.lessonId != null && filters.lessonId.length == 1" opinionWidth="85vw" :opinion="lineData.opinion" :opinionData="lineData.opinionData" :opinionXAxis="lineData.opinionXAxis"/>
          </div> -->
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
import {Group, Cell, TransferDomDirective as TransferDom, XDialog, Divider, dateFormat} from 'vux'
import Guide from './Guide.vue'
import AchievementFilterView from './AchievementFilterView.vue'
import StudentInfoView from './StudentInfoView.vue'
// import CountTime from '@/feature/count/components/CountTime'
import api from '../../statisticsApi.js'
import TableView from './TableView'
export default {
  directives: {
    TransferDom
  },
  components: {
    Group, Cell, Guide, AchievementFilterView, StudentInfoView, XDialog, Divider, TableView
  },
  props: ['classId'],
  data () {
    return {
      list: [],
      scrollerHeight: 0,
      isDefault: true,
      showFilter: false,
      filters: {},
      showDialog: false,
      studentDeatil: {},
      currentItem: {},
      filterDesc: '请选择筛选条件',
      lineData: {
        opinion: [''],
        opinionXAxis: [],
        opinionData: [{
          type: 'line',
          name: '',
          data: 0
        }]
      },
      showList: true,
      tabData: []
    }
  },
  mounted () {
    if (this.tools.isNull(this.classId)) {
      this.scrollerHeight = window.innerHeight - 50 - 44 - 36
    } else {
      this.scrollerHeight = window.innerHeight - 50 - 36
    }
  },
  methods: {
    getStatus (val) {
      return val.achievementsScore
    },
    changeStyle(showList) {
      if (this.showList === showList) {
        return
      }
      this.showList = showList
      if (this.showList === false) {
        this.tabData = {}
        api.queryAchievementStudentCycleReport({schoolId: this.$route.params.schoolId, classId: this.filters.classId, lessonId: this.filters.lessonId, achievementsId: this.filters.achievementsId, startDate: this.filters.startDate + ' 00:00:00', endDate: this.filters.endDate + ' 23:59:59'}, (data) => {
          this.tabData = data
        }, () => {})
      }
    },
    infinite (done) {
      // this.list = this.list.concat(data)
      done()
    },
    onShowFilterView () {
      // this.isDefault = false
      this.showFilter = !this.showFilter
    },
    confirmFilter (filters) {
      this.filters = filters
      if (filters.classId === null || (filters.classId !== null && filters.classId.length === 0)) {
        this.tools.warnToast('请先选择一个班级', '140px')
        return
      }
      if (filters.lessonId === null || (filters.lessonId !== null && filters.lessonId.length === 0)) {
        this.tools.warnToast('请先选择一门课程', '140px')
        return
      }
      if (filters.lessonId !== null && filters.lessonId.length > 1 && (filters.achievementsId === null || filters.achievementsId.length === 0)) {
        this.tools.warnToast('多门课程汇总必须选择成绩单', '160px')
        return
      }
      // 查询，如果有数据隐藏默认页
      api.queryStatisticsStudentListByClassInfo({schoolId: this.$route.params.schoolId, classId: filters.classId, lessonId: filters.lessonId, achievementsId: filters.achievementsId, startDate: filters.startDate + ' 00:00:00', endDate: filters.endDate + ' 23:59:59'}, (data) => {
        this.showFilter = !this.showFilter
        this.list = data
        if (this.list.length > 0) {
          this.isDefault = false
        } else {
          this.filterDesc = '没有统计结果，请重新筛选'
          this.isDefault = true
        }
      }, () => {})
    },
    onItemclick(item) {
      this.currentItem = item
      this.showDialog = true
      this.studentDeatil = {}
      api.queryStatisticsStudentInfoByClassInfo({schoolId: this.$route.params.schoolId, classId: this.filters.classId, lessonId: this.filters.lessonId, studentId: item.studentId, achievementsId: this.filters.achievementsId, startDate: this.filters.startDate + ' 00:00:00', endDate: this.filters.endDate + ' 23:59:59'}, (data) => {
        this.studentDeatil = data
        if (this.filters.lessonId !== null && this.filters.lessonId.length === 1 && data.lesson !== null && data.lesson.length > 0) {
          this.lineData.opinion = [data.lesson[0].lessonName]
          var opinionData = []
          this.lineData.opinionXAxis = []
          data.lesson.forEach(function(element) {
            this.lineData.opinionXAxis.push(dateFormat(element.publishDate, 'MM-DD'))
            opinionData.push(element.achievementsScore)
          }, this)
          this.lineData.opinionData = [{
            type: 'line',
            name: data.lesson[0].lessonName,
            data: opinionData
          }]
          console.log('this.lineData', this.lineData)
        }
      }, () => {})
    }
  }
}
</script>

<style>
.statistics_achi_student_icon {
  width: 44px;
  height: 44px;
  display: block;
  margin-right: 5px;
  background-position: center center;
  background-size: cover;
}
.statistics_achi_dialog_user_icon{
  width: 54px;
  height: 54px;
  display: block;
  border-radius: 5px;
  margin: 10px auto 5px;
  background-position: center center;
  background-size: cover;
  border-style: none;
  border-width: 0;
}

.statistics_achi_dialog_attend_detail {
  text-align: left;
  margin: 5px 15px 0px;
  font-size: 14px;
}

.achi-dialog .weui-dialog {
  width:85vw !important;
  max-width:85vw !important;
}
</style>
