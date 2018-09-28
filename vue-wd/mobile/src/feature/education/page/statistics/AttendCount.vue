<template>
  <div style="height: 100%;">
    <!-- <cell> -->
      <!-- <p style="color: #2E84D4" @click="showFilter = true">筛选</p> -->
    <!-- </cell> -->
    <div style="height: 100%;" v-if="studentList.length > 0">
      <div style="display: flex;padding: 5px 15px;">
        <p style="flex: 1">
          <!-- <span style="color: #2E84D4" @click="changeStyle">{{ styleHint }}</span> -->
          <!-- <span class="iconfont icon-biaoge" style="color: #2E84D4; fontSize: 20px; padding: 0 10px"></span>
          <span class="iconfont icon-quntongji" style="color: #2E84D4; fontSize: 20px"></span> -->
          <span class="iconfont icon-List" :style="{'margin-left':'5px','font-size':'22px','color': showList ? '#A2D268':'#a2a2a2'}" @click="changeStyle('list')"></span>
          <span class="iconfont icon-biaoge" :style="{'margin-left':'25px','font-size':'22px','color':showList ? '#a2a2a2':'#A2D268'}" @click="changeStyle('table')"></span>
        </p>
        <p style="flex: 1;textAlign: right;">
          <span v-if="showList" style="color: #2E84D4;line-height:35px;font-size: 16px;" @click="showFilter = true">筛选</span>
        </p>
      </div>
      <!-- <p style="textAlign: right;">
        <span style="color: #2E84D4" @click="showFilter = true">筛选</span>
      </p> -->
      <div v-if="showList" :style="{'backgroundColor': '#fff', 'position': 'relative', 'height': containerHeight + 'px'}">
        <scroller>
          <cell v-for="(item, index) in studentList" :key="index" is-link @click.native="seeDeatils(item)">
            <p slot="title" style="fontSize: 17px;marginLeft: 8px;">{{item.studentName}}</p>
            <div slot="icon" class="attend_user_icon" :style="{'background-image':'url('+tools.cdn(item.userIcon, 'head.png', 128)+')', 'width': '40px', 'height': '40px'}"></div>
            <p>{{ item.num > 0 ? '未全勤' : '全勤' }}</p>
          </cell>
        </scroller>
      </div>
      <div v-else :style="{'overflow-x': 'auto', 'overflow-y': 'auto', 'backgroundColor': '#fff', 'minWidth': '100%', 'height': containerHeight + 'px'}">
        <table-view :tabData="tabData" :func="getStatus"></table-view>
      </div>
    </div>
    <guide v-else :filterLink="onShowFilterView">
      <p style="text-align:center;color: #999">{{filterDesc}}</p>
    </guide>
    <div>
      <popup v-model="showFilter" height="80%">
        <div style="backgroundColor: #fff;width: 100%;minHeight: 90%;position: relative">
          <scroller>
            <div style="padding: 10px 10px 5px;">
              <p style="marginBottom: 10px;">日期区间</p>
              <div style="display: flex;">
                <p style="flex: 1;textAlign: center;borderRadius: 3px;backgroundColor: #ececec;lineHeight: 32px;fontSize: 12px;color: #b2b2b2;" @click="selectTime('start')">{{filters.startDate == null ? '开始日期' : filters.startDate}}</p>
                <p style="width: 20px;lineHeight:32px;textAlign: center">-</p>
                <p style="flex: 1;textAlign: center;borderRadius: 3px;backgroundColor: #ececec;lineHeight: 32px;fontSize: 12px;color: #b2b2b2;" @click="selectTime('end')">{{filters.endDate == null ? '结束日期' : filters.endDate}}</p>
              </div>
            </div>
            <div style="padding: 0px 10px 5px;" v-if="classList.length > 0">
              <p style="marginBottom: 10px;">班级</p>
              <div>
                <checker v-model="filters.classId" default-item-class="default_class" selected-item-class="selected_class" :radio-required="true">
                  <checker-item style="marginRight: 7px;" v-for="(item, index) in classList" :key="index" :value="item.classId" @on-item-click="selectClass">{{item.className}}</checker-item>
                </checker>
              </div>
            </div>
            <div style="padding: 5px 10px 5px;">
              <p style="marginBottom: 10px;">查看类型</p>
              <div>
                <checker v-model="filterType" default-item-class="default_class" selected-item-class="selected_class" :radio-required="true">
                  <checker-item style="marginRight: 7px;" value="1" @on-item-click="selectType">课程</checker-item>
                  <checker-item style="marginRight: 7px;" value="2" @on-item-click="selectType">点名教师</checker-item>
                </checker>
              </div>
            </div>
            <div style="padding: 5px 10px 5px;" v-if="lessonList.length > 0">
              <p style="marginBottom: 10px;">课程</p>
              <div>
                <checker v-model="filters.lessonId" default-item-class="default_class" selected-item-class="selected_class">
                  <checker-item style="marginRight: 7px;" v-for="(item, index) in lessonList" :key="index" :value="item.lessonId">{{item.lessonName}}</checker-item>
                </checker>
              </div>
            </div>
            <div style="padding: 5px 10px 5px;" v-if="teacherList.length > 0">
              <p style="marginBottom: 10px;">教师</p>
              <div>
                <checker v-model="filters.teacherId" default-item-class="default_class" selected-item-class="selected_class">
                  <checker-item style="marginRight: 7px;" v-for="(item, index) in teacherList" :key="index" :value="item.teacherId">{{item.teacherName}}</checker-item>
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
      <popup v-model="showDatetime">
        <group gutter="0">
          <cell>
            <p slot="title" style="color: #828282;fontSize: 14px;" @click="showDatetime=false">取消</p>
            <p style="color: #A2D268;fontSize: 14px;" @click="confirm">确定</p>
          </cell>
        </group>
        <datetime-view :min-year="startTime - 10" :max-year="startTime + 10" v-model="datetime" year-row="{value}年" month-row="{value}月" day-row="{value}日"></datetime-view>
      </popup>
    </div>
    <div v-transfer-dom>
      <x-dialog v-model="showDetail" hide-on-blur>
        <div style="max-height:70vh;overflow-y: auto;padding: 15px 0px 20px;">
          <div style="">
            <div class="attend_user_icon" :style="{'background-image':'url('+tools.cdn(studentAttendDeatil.userIcon, 'head.png', 128)+')', 'border-radius': '27px'}"></div>
            <p style="textAlign: center;">{{studentAttendDeatil.studentName}}</p>
            <p>时间范围: {{tools.formateTime(new Date(filters.startDate), 'YYYY.MM.DD') + ' - ' + tools.formateTime(new Date(filters.endDate), 'YYYY.MM.DD')}}</p>
            <p v-if="studentAttendDeatil.attendance != null">出勤率: {{parseFloat(studentAttendDeatil.attendance) * 100 + '%'}}</p>
            <p v-else>出勤率: 0</p>
          </div>
          <divider style="color: #d2d2d2;margin: 0 20px">•</divider>
          <p v-for="(item, index) in studentAttendDeatil.lesson" :key="index" class="attend_detail">
            <strong style="font-size: 18px;" v-if="!item.isDay && item.lessonName != null">{{item.lessonName}}: </strong>
            <strong style="font-size: 18px;" v-else>无课程: </strong>
            <span v-if="item.checkNonarrival != 0">未到{{item.checkNonarrival}}次 </span>
            <span v-if="item.checkVacation != 0">请假{{item.checkVacation}}次 </span>
            <span v-if="item.checkBeLate != 0">迟到{{item.checkBeLate}}次 </span>
            <span v-if="item.checkLeaveEarly != 0">早退{{item.checkLeaveEarly}}次 </span>
            <span v-if="item.checkTruant != 0">旷课{{item.checkTruant}}次 </span>
            <span v-if="item.checkTruant == 0 && item.checkBeLate == 0 && item.checkLeaveEarly == 0 && item.checkVacation == 0 && item.checkNonarrival == 0">全勤</span>
          </p>
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
import { Cell, Popup, Checker, CheckerItem, DatetimeView, Group, XDialog, Divider, dateFormat, TransferDom } from 'vux'
import Guide from './Guide.vue'
import TableView from './TableView'
import api from '../../statisticsApi.js'
export default {
  directives: {
    TransferDom
  },
  components: {
    Cell, Popup, Checker, CheckerItem, DatetimeView, Group, XDialog, Divider, Guide, TableView
  },
  data() {
    return {
      containerHeight: 0,
      schoolId: this.$route.params.schoolId,
      showFilter: false,
      showDatetime: false,
      showList: true,
      filterType: '1',
      filters: {
        startDate: null,
        endDate: null,
        classId: null,
        lessonId: null,
        teacherId: null
      },
      classList: [],
      lessonList: [],
      teacherList: [],
      startTime: parseInt(this.tools.formateTime(new Date(), 'YYYY')),
      datetime: this.tools.formateTime(new Date(), 'YYYY-MM-DD'),
      timeType: '',
      showDetail: false,
      showLessons: true,
      showTeachers: true,
      studentList: [],
      studentAttendDeatil: {},
      filterDesc: '请选择筛选条件',
      tabData: {}
    }
  },
  mounted() {
    this.containerHeight = window.innerHeight - 45 - 94
    var now = new Date()
    var nowTime = now.getTime()
    var day = now.getDay()
    var oneDayLong = 24 * 60 * 60 * 1000
    var MondayTime = nowTime - (day - 1 + 7) * oneDayLong
    var SundayTime = nowTime - day * oneDayLong
    var monday = new Date(MondayTime)
    var sunday = new Date(SundayTime)
    this.filters.startDate = dateFormat(monday, 'YYYY-MM-DD')
    this.filters.endDate = dateFormat(sunday, 'YYYY-MM-DD')
    // 请求数据
    api.queryTeacherClassList({schoolId: this.schoolId, featureCode: 'DIANMING'}, (data) => {
      this.classList = this.classList.concat(data)
    }, (er) => {
      this.error(er)
    })
  },
  methods: {
    changeStyle(val) {
      if (val === 'table') {
        if (!this.showList) {
          return
        }
        this.showList = false
        this.tabData = {}
        api.queryCheckStudentCycleReport({schoolId: this.schoolId, filters: this.filters}, (data) => {
          this.tabData = data
        }, (er) => { this.error(er) })
      } else {
        this.showList = true
      }
    },
    onShowFilterView () {
      this.showFilter = true
    },
    seeDeatils(val) {
      api.queryCheckStatisticsStudentInfo({schoolId: this.schoolId, filters: this.filters, studentId: val.studentId}, (data) => {
        this.studentAttendDeatil = data
        this.showDetail = true
      }, (er) => { this.error(er) })
    },
    clearFilter() {
      this.filters.classId = null
      this.filters.lessonId = null
      this.filters.teacherId = null
      this.lessonList.splice(0, this.lessonList.length)
      this.teacherList.splice(0, this.teacherList.length)
    },
    confirmFilter() {
      if (this.filters.classId === null) {
        this.tools.warnToast('请选择班级')
        return
      }
      // 提交筛选条件
      this.showFilter = false
      api.queryCheckStatisticsTeacherList({schoolId: this.schoolId, filters: this.filters}, (data) => {
        this.studentList = data
        if (data.length === 0) {
          this.filterDesc = '该筛选条件没有数据，请重新选择筛选条件'
        }
      }, (er) => { this.error(er) })
    },
    selectTime(val) {
      this.showDatetime = true
      this.timeType = val
    },
    confirm() {
      switch (this.timeType) {
        case 'start':
          this.filters.startDate = this.datetime
          break
        case 'end':
          this.filters.endDate = this.datetime
          break
      }
      this.datetime = this.tools.formateTime(new Date(), 'YYYY-MM-DD')
      this.showDatetime = false
    },
    selectClass(itemValue, itemDisabled) {
      this.showTeachers = true
      this.showLessons = true
      this.filters.lessonId = null
      this.filters.teacherId = null
      if (this.filterType === '1') {
        api.queryTeacherLessonList({schoolId: this.schoolId, featureCode: 'DIANMING'}, (data) => {
          this.lessonList.splice(0, this.lessonList.length)
          this.lessonList = this.lessonList.concat(data)
        }, (er) => {
          this.error(er)
        })
      } else {
        api.queryClassTeacherList({schoolId: this.schoolId, classId: itemValue, featureCode: 'DIANMING'}, (data) => {
          this.teacherList.splice(0, this.teacherList.length)
          this.teacherList = this.teacherList.concat(data)
        }, (er) => {
          this.error(er)
        })
      }
    },
    selectType(itemValue, itemDisabled) {
      if (this.filters.classId === null) {
        this.tools.warnToast('请选择班级')
        return
      }
      if (itemValue === '1') {
        this.filters.teacherId = null
        this.teacherList.splice(0, this.teacherList.length)
        api.queryTeacherLessonList({schoolId: this.schoolId, featureCode: 'DIANMING'}, (data) => {
          this.lessonList.splice(0, this.lessonList.length)
          this.lessonList = this.lessonList.concat(data)
        }, (er) => {
          this.error(er)
        })
      } else {
        this.filters.lessonId = null
        this.lessonList.splice(0, this.lessonList.length)
        api.queryClassTeacherList({schoolId: this.schoolId, classId: this.filters.classId, featureCode: 'DIANMING'}, (data) => {
          this.teacherList.splice(0, this.teacherList.length)
          this.teacherList = this.teacherList.concat(data)
        }, (er) => {
          this.error(er)
        })
      }
    },
    selectLesson(itemValue, itemDisabled) {
      this.showTeachers = false
    },
    selectTeacher(itemValue, itemDisabled) {
      this.showLessons = false
    },
    error(er) {
      if (er.toUser !== undefined && er.toUser) {
        this.tools.warnToast(er.message)
      }
    },
    getStatus (val) {
      var str = ''
      switch (val.checkStatus) {
        case 1:
          str = '已到'
          break
        case 2:
          str = '未到'
          break
        case 3:
          str = '请假'
          break
        case 4:
          str = '迟到'
          break
        case 5:
          str = '早退'
          break
        case 6:
          str = '旷课'
          break
      }
      return str
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
  width: 30%;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.selected_class {
  border: 1px solid #A2D268;
}

.attend_user_icon{
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

.attend_detail {
  text-align: left;
  margin: 5px 15px 0px;
  font-size: 14px;
}
</style>
