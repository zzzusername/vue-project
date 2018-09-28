<template>
  <div style="backgroundColor: #f6f6f6">
    <div v-if="classList.length > 0 || teachers.length > 0 || checkTeachers.length > 0">
      <p style="textAlign: right;padding: 5px 15px;">
        <span style="color: #2E84D4" @click="showFilter = true">筛选</span>
      </p>
      <div :style="{'position': 'relative', 'height': scrollerHeight + 'px'}">
        <scroller v-if="listType == '0'">
          <cell style="backgroundColor: #fff" v-for="(item, index) in classList" :key="index" is-link @click.native="seeDeatils(item)">
            <p slot="title" style="fontSize: 17px;">{{ item.className }}</p>
            <p slot="inline-desc" style="marginLeft: 5px">点名 {{item.count}} 次</p>
            <p>出勤率: {{ (item.num * 100).toFixed(2) + '%' }}</p>
          </cell>
        </scroller>
        <scroller v-else-if="listType == '1'">
          <cell style="backgroundColor: #fff" v-for="(item, index) in teachers" :key="index" is-link @click.native="seeDeatils(item)">
            <div slot="icon" class="master_attend_user_icon" :style="{'background-image':'url('+tools.cdn(item.userIcon, 'head.png', 128)+')'}"></div>
            <p slot="title" style="fontSize: 17px;marginLeft: 5px;">{{ item.teacherName }}</p>
            <p slot="inline-desc" style="marginLeft: 5px">点名 {{item.count}} 次</p>
            <p>出勤率: {{ (item.num * 100).toFixed(2) + '%' }}</p>
          </cell>
        </scroller>
        <scroller v-else>
          <cell style="backgroundColor: #fff" v-for="(item, index) in checkTeachers" :key="index">
            <div slot="icon" class="master_attend_user_icon" :style="{'background-image':'url('+tools.cdn(item.userIcon, 'head.png', 128)+')'}"></div>
            <p slot="title" style="fontSize: 17px;marginLeft: 5px">{{ item.teacherName }}</p>
            <p slot="inline-desc" style="marginLeft: 5px">点名 {{item.count}} 次</p>
            <p>出勤率: {{ (item.num * 100).toFixed(2) + '%' }}</p>
          </cell>
        </scroller>
      </div>
    </div>
    <guide  v-else :filterLink="onShowFilterView">
      <p style="text-align:center;color: #999">{{filterDesc}}</p>
    </guide>
    <div>
      <popup v-model="showFilter" height="80%">
        <div style="backgroundColor: #fff;width: 100%;minHeight: 100%;">
          <scroller>
            <div style="padding: 10px 10px 5px;">
              <p style="marginBottom: 10px;">日期区间</p>
              <div style="display: flex;">
                <p style="flex: 1;textAlign: center;borderRadius: 3px;backgroundColor: #ececec;lineHeight: 32px;fontSize: 12px;" @click="selectTime('start')">{{filters.startDate == null ? '开始日期' : filters.startDate}}</p>
                <p style="width: 20px;lineHeight:32px;textAlign: center">-</p>
                <p style="flex: 1;textAlign: center;borderRadius: 3px;backgroundColor: #ececec;lineHeight: 32px;fontSize: 12px;" @click="selectTime('end')">{{filters.endDate == null ? '结束日期' : filters.endDate}}</p>
              </div>
            </div>
            <div style="padding: 0px 10px 5px;">
              <p style="marginBottom: 10px;">查看类型</p>
              <div>
                <checker v-model="tempType" default-item-class="default_class" selected-item-class="selected_class" :radio-required="true">
                  <checker-item style="marginRight: 7px;" v-for="(item, index) in typeList" :key="index" :value="item.type" @on-item-click="selectType">{{item.name}}</checker-item>
                </checker>
              </div>
            </div>
            <div style="padding: 5px 10px 5px;" v-if="lessonList.length > 0 && showLessons">
              <p style="marginBottom: 10px;">课程</p>
              <div>
                <checker v-model="filters.lessonId" default-item-class="default_class" selected-item-class="selected_class">
                  <checker-item style="marginRight: 7px;" v-for="(item, index) in lessonList" :key="index" :value="item.lessonId" @on-item-click="showTeachers = false">{{item.lessonName}}</checker-item>
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
          <div v-if="listType == '0' && classInfo.length > 0">
            <p>{{ classInfo[0].className }}</p>
          </div>
          <div v-else>
            <div class="master_attend_user_icon" :style="{'background-image':'url('+tools.cdn(clickTeacherInfo.userIcon, 'head.png', 128)+')', 
            'height': '54px', 'width': '54px', 'border-radius': '27px', 'margin': '10px auto 5px'}"></div>
            <p style="textAlign: center;">{{clickTeacherInfo.teacherName}}</p>
            <p>时间范围: {{tools.formateTime(new Date(filters.startDate), 'YYYY.MM.DD') + ' - ' + tools.formateTime(new Date(filters.endDate), 'YYYY.MM.DD')}}</p>
            <p ><span>点名次数: {{clickTeacherInfo.count}} 次</span>&nbsp;&nbsp;<span>出勤率: {{(clickTeacherInfo.num * 100).toFixed(2) + '%'}}</span></p>
          </div>
          <divider style="color: #d2d2d2;margin: 0 20px">•</divider>
          <div v-if="listType == '0'">
            <p v-for="(item, index) in classInfo" :key="index" class="master_attend_detail">
              <strong v-if="!item.isDay && item.lessonName != null">{{item.lessonName}}: </strong>
              <strong v-else>无课程: </strong>
              <span>出勤率 {{ (item.num * 100).toFixed(2) + '%' }}</span>
              <span>点名 {{ item.count }} 次</span>
            </p>
          </div>
          <div v-else>
            <p v-for="(item, index) in teacherInfo" :key="index" class="master_attend_detail">
              <strong v-if="!item.isDay && item.lessonName != null">{{item.lessonName + '(' + item.className + ')'}}: </strong>
              <strong v-else>无课程: </strong>
              <span>出勤率 {{ (item.num * 100).toFixed(2) + '%' }}</span>
              <span>点名 {{ item.count }} 次</span>
            </p>
          </div>
        </div>
      </x-dialog>
    </div>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import { Cell, Popup, Checker, CheckerItem, DatetimeView, Group, XDialog, Divider, TransferDom, dateFormat } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import Guide from './Guide.vue'
import api from '../../statisticsApi.js'
export default {
  directives: {
    TransferDom
  },
  components: {
    Cell, Popup, Checker, CheckerItem, DatetimeView, Group, XDialog, Divider, DetailTabbar, Guide
  },
  data() {
    return {
      schoolId: this.$route.params.schoolId,
      scrollerHeight: 0,
      showFilter: false,
      showDatetime: false,
      listType: '0',
      filters: {
        startDate: null,
        endDate: null,
        lessonId: null
      },
      typeList: [{type: '0', name: '班级'}, {type: '1', name: '任课老师'}, {type: '2', name: '点名老师'}],
      lessonList: [],
      startTime: parseInt(this.tools.formateTime(new Date(), 'YYYY')),
      datetime: this.tools.formateTime(new Date(), 'YYYY-MM-DD'),
      timeType: '',
      showLessons: true,
      tempType: '0',
      classList: [],
      teachers: [],
      checkTeachers: [],
      showDetail: false,
      studentAttendDeatil: {},
      classInfo: [],
      clickTeacherInfo: {},
      teacherInfo: [],
      filterDesc: '请选择筛选条件'
    }
  },
  mounted() {
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
    this.scrollerHeight = window.innerHeight - 32 - 44
    api.getSchoolLessons({schoolId: this.schoolId}, (data) => {
      this.lessonList = this.lessonList.concat(data)
    }, (er) => {
      this.error(er)
    })
  },
  methods: {
    seeDeatils(val) {
      if (this.listType === '0') {
        api.queryStatisticsClassInfo({schoolId: this.schoolId, filters: this.filters, classId: val.classId}, (data) => {
          this.classInfo = data
          this.showDetail = true
        }, (er) => { this.error(er) })
      } else if (this.listType === '1') {
        this.clickTeacherInfo = val
        api.queryCheckStatisticsTeacherInfo({schoolId: this.schoolId, filters: this.filters, teacherId: val.teacherId}, (data) => {
          this.teacherInfo = data
          this.showDetail = true
        }, (er) => { this.error(er) })
      } else if (this.listType === '2') {
        this.clickTeacherInfo = val
        api.queryStatisticsCheckTeacherInfo({schoolId: this.schoolId, filters: this.filters, teacherId: val.teacherId}, (data) => {
          this.teacherInfo = data
          this.showDetail = true
        }, (er) => { this.error(er) })
      }
    },
    onShowFilterView() {
      this.showFilter = true
    },
    clearFilter() {
      this.filters.lessonId = null
    },
    confirmFilter() {
      // 提交筛选条件
      this.showFilter = false
      this.listType = this.tempType
      if (this.tempType === '0') {
        this.classList.splice(0, this.classList.length)
        api.queryCheckClassStatistics({schoolId: this.schoolId, filters: this.filters}, (data) => {
          this.classList = this.classList.concat(data)
          this.isShowGuide(data)
        }, (er) => { this.error(er) })
      } else if (this.tempType === '1') {
        this.teachers.splice(0, this.teachers.length)
        api.queryCheckStatisticsTeachers({schoolId: this.schoolId, filters: this.filters}, (data) => {
          this.teachers = this.teachers.concat(data)
          this.isShowGuide(data)
        }, (er) => { this.error(er) })
      } else {
        this.checkTeachers.splice(0, this.checkTeachers.length)
        api.queryCheckTeacherStatistics({schoolId: this.schoolId, filters: this.filters}, (data) => {
          this.checkTeachers = this.checkTeachers.concat(data)
          this.isShowGuide(data)
        }, (er) => { this.error(er) })
      }
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
    selectType(itemValue, itemDisabled) {
      if (itemValue === '2') {
        this.showLessons = false
      } else {
        this.showLessons = true
      }
    },
    error(er) {
      if (er.toUser !== undefined && er.toUser) {
        this.tools.warnToast(er.message)
      }
    },
    isShowGuide(val) {
      if (val.length === 0) {
        this.filterDesc = '该筛选条件没有数据，请重新选择筛选条件'
      }
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

.master_attend_user_icon{
  width: 44px;
  height: 44px;
  display: block;
  border-radius: 5px;
  background-position: center center;
  background-size: cover;
  border-style: none;
  border-width: 0;
}

.master_attend_detail {
  text-align: left;
  margin: 5px 15px 0px;
  font-size: 14px;
}
</style>
