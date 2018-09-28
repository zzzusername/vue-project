<template>
  <div>
    <div v-if="isDefault" style="height:30px;">
      <p style="float:right;margin-right:10px;color:#2E84D4;height:30px;line-height:30px;text-align:center;" @click="showFilter = true">筛选</p>
    </div>
    <div v-if="isDefault" :style="{'height': scrollerHeight + 'px', 'position': 'relative'}">
      <scroller ref="scroller">
        <cell style="backgroundColor: #fff;" v-show="showClass" v-for="(item,index) in classListWork" :key="index" is-link @click.native="chooseMode(item, 'class')">
          <span slot="title" class="font_style">{{item.className}}</span>
          <span slot="default" v-if="item.completionRate !== null && item.completionRate !== undefined">完成率{{(parseFloat(item.completionRate) * 100).toFixed(2) + '%'}}</span>
          <span slot="inline-desc" v-if="item.submittimes !== null && item.submittimes !== undefined">发布作业{{item.submittimes}}次</span>
        </cell>
        <cell style="backgroundColor: #fff;" v-show="showTeacher" v-for="(item,index) in teacherListWork" :key="index" is-link @click.native="chooseMode(item, 'teacher')">
          <span slot="title" class="font_style">{{item.teacherName}}</span>
          <span slot="inline-desc" v-if="item.submittimes !== null && item.submittimes !== undefined">发布作业{{item.submittimes}}次</span><span slot="default" v-if="item.checkCount !== null && item.checkCount !== undefined">已批阅{{item.checkCount}}人次</span>
          <div slot="icon" class="teacher_manage_img" :style="{'background-image':'url('+tools.cdn(item.userIcon, 'head.png', 128)+')'}"></div>
        </cell>
      </scroller>
    </div>
    <guide v-else :filterLink="onClickA">
      <p style="text-align:center;color: #999">{{filterDesc}}</p>
    </guide>
    <div>
      <popup v-model="showFilter" height="80%">
          <div style="backgroundColor: #fff;width: 100%;minHeight: 100%;">
            <scroller ref="scrolletwor">
            <div style="padding: 10px 10px 5px;">
              <p style="marginBottom: 10px;">日期区间</p>
              <div style="display: flex;">
                <p style="color: rgb(178, 178, 178);flex: 1;textAlign: center;borderRadius: 3px;backgroundColor: #ececec;lineHeight: 32px;fontSize: 12px;" @click="showDatefun('start')">{{filterData.startDate | filterStart}}</p>
                <p style="width: 20px;lineHeight:32px;textAlign: center">-</p>
                <p style="color: rgb(178, 178, 178);flex: 1;textAlign: center;borderRadius: 3px;backgroundColor: #ececec;lineHeight: 32px;fontSize: 12px;" @click="showDatefun('end')">{{filterData.endDate | filterEnd}}</p>
              </div>
            </div>
            <div style="padding: 10px 10px 5px;">
              <p style="marginBottom: 10px;">查看方式</p>
              <div>
                <checker v-model="type" :radio-required="true" default-item-class="default_class" selected-item-class="selected_class">
                  <checker-item value="class">班级</checker-item>
                  <checker-item value="teacher">教师</checker-item>
                </checker>
              </div>
            </div>
            <div style="padding: 5px 10px 5px;" v-if="lessonList.length > 0">
              <p style="marginBottom: 10px;">课程</p>
              <div>
                <checker v-model="filterData.lessonId" default-item-class="default_class" selected-item-class="selected_class">
                  <checker-item style="marginRight: 7px;" v-for="(item, index) in lessonList" :key="index" :value="item.lessonId">{{item.lessonName}}</checker-item>
                </checker>
              </div>
            </div>
            <div style="height: 50px;"></div>
            </scroller>
            <div style="display: flex;height: 50px;position: absolute;bottom: 0;width: 100vw;">
              <p style="flex: 1;textAlign: center;lineHeight: 50px;backgroundColor: rgb(230, 230, 230)" @click="clearFilter">重置</p>
              <p style="flex: 1;textAlign: center;lineHeight: 50px;color: #fff;backgroundColor: #A2D268" @click="confirmFilter">确定</p>
            </div>
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
      <x-dialog v-model="showDetail" hide-on-blur @on-hide="teacherMsg = {userIcon: null}, classMsg = {className: null}">
        <div style="max-height:70vh;overflow-y: scroll;padding: 15px 0px 20px;">
            <div class="homework_user_icon" v-show="teacherMsg.userIcon" :style="{'background-image':'url('+tools.cdn(teacherMsg.userIcon, 'head.png', 128)+')', 'border-radius': '27px'}"></div>
            <p style="textAlign: center;" v-show="classMsg.className">{{classMsg.className}}</p>
            <p style="textAlign: center;">时间范围: {{tools.formateTime(new Date(this.filterData.startDate), 'YYYY.MM.DD')}} - {{tools.formateTime(new Date(this.filterData.endDate), 'YYYY.MM.DD')}}</p>
          <divider style="color: #d2d2d2;margin: 0 20px">•</divider>
          <p v-show="item.teacherName !== null && item.teacherName !== undefined" v-for="(item, index) in detailArr" :key="index" class="attend_detail">
            <strong>{{item.lessonName}}({{item.teacherName}}): </strong><span style="font-size: 14px;">发布作业{{item.submittimes}}次&nbsp;&nbsp;</span><span style="font-size: 14px;" v-show="item.checkCount">已批阅{{item.checkCount}}次&nbsp;&nbsp;</span><span style="font-size: 14px;">完成率{{(parseFloat(item.completionRate)* 100).toFixed(2)  + '%'}}</span>
          </p>
          <p v-show="item.className !== null && item.className !== undefined" v-for="(item, index) in detailArr" :key="index" class="attend_detail">
            <strong>{{item.className}}: </strong><span style="font-size: 14px;">发布作业{{item.submittimes}}次&nbsp;&nbsp;</span><span style="font-size: 14px;" v-show="item.checkCount">已批阅{{item.checkCount}}次&nbsp;&nbsp;</span><span style="font-size: 14px;">完成率{{(parseFloat(item.completionRate) * 100).toFixed(2) + '%'}}</span>
          </p>
          <p v-if="detailArr.length<=0" style="textAlign: center;">无作业记录</p>
        </div>
      </x-dialog>
    </div>
    <detail-tabbar></detail-tabbar>
  </div>
</template>
<script>
  import { Divider, XDialog, Popup, Checker, CheckerItem, dateFormat, DatetimeView, Group, Cell, TransferDomDirective as TransferDom } from 'vux'
  import Guide from './Guide.vue'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import apiFirst from '../../api'
  import api from '../../statisticsApi'
  export default{
    components: {Divider, XDialog, Popup, Checker, CheckerItem, dateFormat, DatetimeView, Group, Cell, Guide, DetailTabbar},
    directives: {
      TransferDom
    },
    data() {
      return {
        showDetail: false,
        isDefault: false,
        classListWork: [],
        showFilter: false,
        filterDesc: '请选择筛选条件',
        showDate: false,
        scrollerHeight: 0,
        lessonList: [],
        teacherListWork: [],
        detailArr: [],
        valueDate: dateFormat(new Date(), 'YYYY-MM-DD'),
        filterData: {
          startDate: null,
          endDate: null,
          lessonId: null,
          classId: null,
          teacherId: null
        },
        type: 'class',
        showClass: false,
        showTeacher: false,
        tag: null,
        teacherMsg: {
          userIcon: null
        },
        classMsg: {
          className: null
        }
      }
    },
    mounted() {
      this.changeDatetime()
      this.scrollerHeight = window.innerHeight - 50 - 30
      apiFirst.getBaseSubjectList({schoolId: this.$route.params.schoolId}, (data) => {
        data.forEach(function(element) {
          var item = {
            lessonId: element.lessonId,
            lessonName: element.lessonName
          }
          this.lessonList.push(item)
        }, this)
      }, (er) => {})
    },
    methods: {
      changeDatetime() {
        var now = new Date()
        var nowTime = now.getTime()
        var day = now.getDay()
        var oneDayLong = 24 * 60 * 60 * 1000
        var MondayTime = nowTime - (day - 1 + 7) * oneDayLong
        var SundayTime = nowTime - day * oneDayLong
        var monday = new Date(MondayTime)
        var sunday = new Date(SundayTime)
        this.filterData.startDate = dateFormat(monday, 'YYYY-MM-DD')
        this.filterData.endDate = dateFormat(sunday, 'YYYY-MM-DD')
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
          this.filterData.startDate = this.valueDate
          this.showDate = false
        } else {
          this.filterData.endDate = this.valueDate
          this.showDate = false
        }
      },
      confirmFilter() {
        this.showFilter = false
        this.isDefault = true
        api.getHomeWorkListAlway({
          schoolId: this.$route.params.schoolId,
          startDate: this.filterData.startDate,
          endDate: this.filterData.endDate,
          lessonId: this.filterData.lessonId,
          type: this.type}, (data) => {
          if (data.length > 0) {
            if (this.type === 'class') {
              this.showClass = true
              this.showTeacher = false
              this.teacherListWork = []
              this.classListWork = data
            } else {
              this.showClass = false
              this.showTeacher = true
              this.classListWork = []
              this.teacherListWork = data
            }
          } else {
            this.isDefault = false
            this.filterDesc = '没有统计结果，请重新筛选'
          }
        }, (er) => {
          this.error(er)
        })
      },
      clearFilter() {
        this.filterData = {
          startDate: null,
          endDate: null,
          lessonId: null,
          classId: null,
          teacherId: null
        }
        this.type = 'class'
        this.changeDatetime()
      },
      onClickA() {
        this.showFilter = true
      },
      chooseMode(item, code) {
        if (code === 'class') {
          this.filterData.teacherId = null
          this.filterData.classId = item.classId
          this.classMsg = item
          this.getDetail('class', (data) => {
            this.detailArr = data
            this.showDetail = true
          })
        } else {
          this.filterData.classId = null
          this.filterData.teacherId = item.teacherId
          this.teacherMsg = item
          this.getDetail('teacher', (data) => {
            this.detailArr = data
            this.showDetail = true
          })
        }
      },
      getDetail(type, callback) {
        api.getSchoolWorkCountClass(
          {
            schoolId: this.$route.params.schoolId,
            startDate: this.filterData.startDate,
            endDate: this.filterData.endDate,
            lessonId: this.filterData.lessonId,
            teacherId: this.filterData.teacherId,
            classId: this.filterData.classId,
            type: type
          }, (data) => {
          callback(data)
        }, (er) => {
          this.error(er)
        })
      },
      error(er) {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        } else {
          this.tools.warnToast('筛选失败，稍后再试！')
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
.teacher_manage_img {
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
.attend_detail {
  text-align: left;
  margin: 5px 15px 0px;
  font-size: 16px;
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
.font_style{
  font-size:16px;
}
</style>

