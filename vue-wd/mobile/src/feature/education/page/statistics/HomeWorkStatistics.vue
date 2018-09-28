<template>
  <div>
    <div v-show="isDefault == false && list.length>0" style="height:36px;">
      <span slot class="iconfont icon-List" v-bind:class="{select : showList}" style="float:left;margin-left:20px;font-size:22px;color:#a2a2a2;" @click="changeStyle('list')"></span>
      <span slot class="iconfont icon-biaoge" v-bind:class="{select : !showList}" style="float:left;margin-left:25px;font-size:22px;color:#a2a2a2;" @click="changeStyle('table')"></span>
      <p v-if="showList" style="float:right;margin-right:10px;color:#2E84D4;height:36px;line-height:36px;text-align:center;font-size:16px;" @click="showFilter = true">筛选</p >
    </div>
    <div v-if="isDefault == false && list.length>0">
      <div v-if="showList" :style="{'height': scrollerHeight + 'px', 'position': 'relative'}">
        <scroller ref="scroller">
          <cell style="backgroundColor: #fff;" v-for="(item,index) in list" :key="index" is-link @click.native="goDetails(item)">
            <span slot="title" style="font-size:16px;">{{item.studentName}}</span>
            <span slot="title" v-if="item.uncommitNum" style="font-size:13px;margin-left:20px;">{{item.uncommitNum}}次未交</span>
            <span slot="default">{{item.avgNum | filterGrade}}</span>
            <div slot="icon" class="student_manage_img" :style="{'background-image':'url('+tools.cdn(item.userIcon, 'head.png', 128)+')'}"></div>
          </cell>
        </scroller>
      </div>
      <div v-else :style="{'overflow-x': 'auto', 'overflow-y': 'auto', 'backgroundColor': '#fff', 'minWidth': '100%', 'height': scrollerHeight + 'px'}">
        <table-view :tabData="tabData" :func="getStatus"></table-view>
      </div>
    </div>
    <guide v-else :filterLink="onClickA">
      <p style="text-align:center;color: #999">{{filterDesc}}</p>
    </guide>
    <div>
      <popup v-model="showFilter" height="80%">
          <div style="backgroundColor: #fff;width: 100%;minHeight: 90%;position:relative;">
            <scroller ref="scroller">
            <div style="padding: 10px 10px 5px;">
              <p style="marginBottom: 10px;">日期区间</p>
              <div style="display: flex;">
                <p style="color: rgb(178, 178, 178);flex: 1;textAlign: center;borderRadius: 3px;backgroundColor: #ececec;lineHeight: 32px;fontSize: 12px;" @click="showDatefun('start')">{{startDate | filterStart}}</p>
                <p style="width: 20px;lineHeight:32px;textAlign: center">-</p>
                <p style="color: rgb(178, 178, 178);flex: 1;textAlign: center;borderRadius: 3px;backgroundColor: #ececec;lineHeight: 32px;fontSize: 12px;" @click="showDatefun('end')">{{endDate | filterEnd}}</p>
              </div>
            </div>
            <div style="padding: 10px 10px 5px;">
              <p style="marginBottom: 10px;">排序方式</p>
              <div>
                <checker v-model="filterData.sortState" default-item-class="default_class" selected-item-class="selected_class">
                  <checker-item value="1">平均成绩</checker-item>
                  <checker-item value="2">未提交次数</checker-item>
                </checker>
              </div>
            </div>
            <div style="padding: 0px 10px 5px;" v-if="classData.length > 0">
              <p style="marginBottom: 10px;">班级</p>
              <div>
                <checker v-model="filterData.classId" :radio-required="true" default-item-class="default_class" selected-item-class="selected_class">
                  <checker-item style="marginRight: 7px;" v-for="(item, index) in classData" :key="index" :value="item.value" @on-item-click="selectClass">{{item.name}}</checker-item>
                </checker>
              </div>
            </div>
            <div style="padding: 5px 10px 5px;" v-if="lessonList.length > 0 && showLessons">
              <p style="marginBottom: 10px;">课程</p>
              <div>
                <checker v-model="filterData.lessonId" default-item-class="default_class" selected-item-class="selected_class">
                  <checker-item style="marginRight: 7px;" v-for="(item, index) in lessonList" :key="index" :value="item.lessonId" @on-item-click="showTeachers = false">{{item.lessonName}}</checker-item>
                </checker>
              </div>
            </div>
            <div style="padding: 5px 10px 5px;" v-if="teacherList.length > 0 && showTeachers">
              <p style="marginBottom: 10px;">教师</p>
              <div>
                <checker v-model="filterData.teacherId" default-item-class="default_class" selected-item-class="selected_class">
                  <checker-item style="marginRight: 7px;" v-for="(item, index) in teacherList" :key="index" :value="item.teacherId" @on-item-click="showLessons = false">{{item.teacherName}}</checker-item>
                </checker>
              </div>
            </div>
            <div style="height: 50px;"></div>
            </scroller>
          </div>
          <div style="display: flex;height: 50px;position: absolute;bottom: 0;width: 100vw;">
            <p style="flex: 1;textAlign: center;lineHeight: 50px;backgroundColor: rgb(230, 230, 230)" @click="clearFilter">重置</p>
            <p style="flex: 1;textAlign: center;lineHeight: 50px;color: #fff;backgroundColor: #A2D268" @click="confirmFilter">确定</p>
          </div>
      </popup>
    </div>
    <div v-transfer-dom>
      <popup v-model="showDate" style="background:#fff;">
        <Group gutter="0">
          <cell>
            <span slot="title" @click="showDate = false">取消</span>
            <span slot="default" style="color:rgb(142, 191, 82);" @click="confirmDate">完成</span>
          </cell>
        </Group>
        <datetime-view v-model="valueDate" year-row="{value}年" month-row="{value}月" day-row="{value}日"></datetime-view>
      </popup>
    </div>
    <div v-transfer-dom>
      <x-dialog v-model="showDetail" hide-on-blur>
        <div style="max-height:70vh;overflow-y: scroll;padding: 15px 0px 20px;">
          <div>
            <div class="homework_user_icon" :style="{'background-image':'url('+tools.cdn(studentDetails.userIcon, 'head.png', 128)+')', 'border-radius': '27px'}"></div>
            <p style="textAlign: center;">{{studentDetails.studentName}}</p>
            <p style="textAlign: center;">时间范围: {{tools.formateTime(new Date(startDate), 'YYYY.MM.DD')}} - {{tools.formateTime(new Date(endDate), 'YYYY.MM.DD')}}</p>
            <p style="textAlign: center;"><span>总完成率{{(parseFloat(studentDetails.progress) * 100).toFixed(2) + '%'}}</span>&nbsp;&nbsp;<span v-if="studentDetails.avgNum !== null && studentDetails.avgNum !== undefined">总平均成绩{{studentDetails.avgNum | filterGrade}}</span></p>
          </div>
          <divider style="color: #d2d2d2;margin: 0 20px">•</divider>
          <p v-for="(item, index) in studentDetails.lesson" :key="index" class="attend_detail">
            <strong>{{item.lessonName == null ? '无课程' : item.lessonName}}: </strong><span style="font-size: 14px;" v-if="item.avgNum !== null && item.avgNum !== undefined">平均成绩{{item.avgNum | filterGrade}}&nbsp;&nbsp;</span><span style="font-size: 14px;" v-if="item.uncommitNum>0">未提交{{item.uncommitNum}}次&nbsp;&nbsp;</span><span style="font-size: 14px;">完成率{{(parseFloat(item.progress) * 100).toFixed(2) + '%'}}</span>
          </p>
        </div>
      </x-dialog>
    </div>
  </div>
</template>
<script>
import {Divider, XDialog, dateFormat, DatetimeView, Group, Cell, Popup, Checker, CheckerItem, TransferDomDirective as TransferDom} from 'vux'
import Guide from './Guide.vue'
import TableView from './TableView'
import api from '../../statisticsApi.js'
export default {
  components: {TableView, Divider, XDialog, dateFormat, DatetimeView, Group, Cell, Guide, Popup, Checker, CheckerItem},
  directives: {
    TransferDom
  },
  props: {
    classData: Array
  },
  data() {
    return {
      showList: true,
      containerHeight: 0,
      showDetail: false,
      showLessons: false,
      showTeachers: false,
      isDefault: true,
      showFilter: false,
      showDate: false,
      valueDate: dateFormat(new Date(), 'YYYY-MM-DD'),
      list: [],
      lessonList: [],
      teacherList: [],
      scrollerHeight: 0,
      filterDesc: '请选择筛选条件',
      startDate: null,
      endDate: null,
      filterData: {
        sortState: null,
        classId: null,
        lessonId: null,
        teacherId: null
      },
      studentDetails: {},
      tabData: {}
    }
  },
  mounted () {
    this.changeDatetime()
    this.scrollerHeight = window.innerHeight - 50 - 44 - 30
  },
  methods: {
    changeStyle(code) {
      if (code === 'list') {
        if (this.showList) {
          return
        }
        this.showList = true
        this.getListData()
      } else {
        if (!this.showList) {
          return
        }
        this.showList = false
        this.tabData = {}
        api.queryWorkStudentCycleReport({schoolId: this.$route.params.schoolId, data: this.filterData, startDate: this.startDate, endDate: this.endDate}, (data) => {
          this.tabData = data
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.tools.warnToast(er.message)
          } else {
            this.tools.warnToast('切换失败，稍后重试！', '180px')
          }
        })
      }
    },
    changeDatetime() {
      var now = new Date()
      var nowTime = now.getTime()
      var day = now.getDay()
      var oneDayLong = 24 * 60 * 60 * 1000
      var MondayTime = nowTime - (day - 1 + 7) * oneDayLong
      var SundayTime = nowTime - day * oneDayLong
      var monday = new Date(MondayTime)
      var sunday = new Date(SundayTime)
      this.startDate = dateFormat(monday, 'YYYY-MM-DD')
      this.endDate = dateFormat(sunday, 'YYYY-MM-DD')
    },
    clearFilter() {
      this.filterData = {
        sort: null,
        classId: null,
        lessonId: null,
        teacherId: null
      }
      this.changeDatetime()
      this.lessonList = []
      this.teacherList = []
    },
    confirmFilter() {
      if (this.filterData.classId !== null && this.filterData.classId !== undefined && this.filterData.classId !== '') {
      } else {
        this.tools.warnToast('请选择班级')
        return
      }
      this.getListData()
    },
    getListData() {
      api.queryWorkStatisticsTeacherList({schoolId: this.$route.params.schoolId, data: this.filterData, startDate: this.startDate, endDate: this.endDate}, (data) => {
        this.isDefault = false
        this.showFilter = false
        this.filterDesc = '没有统计结果，请重新筛选'
        this.list = data
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        } else {
          this.tools.warnToast('筛选失败，稍后重试！', '180px')
        }
      })
    },
    goDetails(item) {
      api.queryWorkStatisticsTeacherList({schoolId: this.$route.params.schoolId, data: this.filterData, startDate: this.startDate, endDate: this.endDate, studentId: item.studentId}, (data) => {
        this.studentDetails = data
        this.showDetail = true
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        } else {
          this.tools.warnToast('查看详情失败，稍后重试！', '180px')
        }
      })
    },
    onClickA() {
      this.showFilter = true
    },
    selectClass(itemValue, itemDisabled) {
      this.showLessons = true
      this.showTeachers = true
      this.filterData.lessonId = null
      this.filterData.teacherId = null
      api.queryTeacherLessonList({schoolId: this.$route.params.schoolId, featureCode: 'ZUOYE'}, (data) => {
        this.lessonList.splice(0, this.lessonList.length)
        this.lessonList = this.lessonList.concat(data)
      }, (er) => {
        this.error(er)
      })
      api.queryClassTeacherList({schoolId: this.$route.params.schoolId, classId: itemValue, featureCode: 'ZUOYE'}, (data) => {
        this.teacherList.splice(0, this.teacherList.length)
        this.teacherList = this.teacherList.concat(data)
      }, (er) => {
        this.error(er)
      })
    },
    error(er) {
      if (er.toUser !== undefined && er.toUser) {
        this.tools.warnToast(er.message)
      }
    },
    showDatefun(code) {
      this.showDate = true
      if (code === 'start') {
        this.tag = 'start'
      } else {
        this.tag = 'end'
      }
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
    getStatus (val) {
      return val.isCommit === true ? this.filterGrade(val.workLevel) : '缺'
    },
    filterGrade (val) {
      switch (parseInt(val)) {
        case 15:
          return '优+'
        case 14:
          return '优'
        case 13:
          return '优-'
        case 12:
          return '良+'
        case 11:
          return '良'
        case 10:
          return '良-'
        case 9:
          return '中+'
        case 8:
          return '中'
        case 7:
          return '中-'
        case 6:
          return '般+'
        case 5:
          return '般'
        case 4:
          return '般-'
        case 3:
          return '差+'
        case 2:
          return '差'
        case 1:
          return '差-'
      }
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
    },
    filterGrade: function (val) {
      switch (parseInt(val)) {
        case 15:
          return '优+'
        case 14:
          return '优'
        case 13:
          return '优-'
        case 12:
          return '良+'
        case 11:
          return '良'
        case 10:
          return '良-'
        case 9:
          return '中+'
        case 8:
          return '中'
        case 7:
          return '中-'
        case 6:
          return '一般+'
        case 5:
          return '一般'
        case 4:
          return '一般-'
        case 3:
          return '差+'
        case 2:
          return '差'
        case 1:
          return '差-'
      }
    }
  }
}
</script>
<style>
.student_manage_img {
  width: 12vw;
  height:12vw;
  display: inline-block;
  border-radius: 2px;
  margin-right: 10px;
  background-position: center center;
  background-size: cover;
  border-style:none;
  border-width:0;
  vertical-align:middle;
}
.homework_user_icon{
  width: 54px;
  height: 54px;
  display: block;
  border-radius: 5px;
  margin: 10px auto;
  background-position: center center;
  background-size: cover;
  border-style: none;
  border-width: 0;
}
.default_class {
  border: 1px solid #ececec;
  padding: 5px 0;
  font-size: 12px;
  margin-bottom: 5px;
  width: 30%;
  text-align: center
}
.default_class {
  border: 1px solid #ececec;
  padding: 5px 0;
  font-size: 12px;
  margin-bottom: 5px;
  width: 30%;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.selected_class {
  border: 1px solid #A2D268;
}
.attend_detail {
  text-align: left;
  margin: 5px 15px 0px;
  font-size: 16px;
}
.select{
  color:#A2D268 !important;
}
</style>

