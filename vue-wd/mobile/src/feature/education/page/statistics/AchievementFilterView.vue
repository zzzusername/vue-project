<template>
  <div>
    <div>
      <popup v-model="showPopUp" height="80%">
        <div style="backgroundColor: #fff;width: 100%;minHeight: 100%;">
          <scroller ref="scroller">
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
                <checker v-model="filters.classId" default-item-class="achi_default_class" selected-item-class="achi_selected_class" radio-required>
                  <checker-item style="marginRight: 7px;" v-for="(item, index) in classList" :key="index" :value="item.classId" @on-item-click="selectClass">{{item.className}}</checker-item>
                </checker>
              </div>
            </div>
            <div style="padding: 5px 10px 5px;" v-if="lessonList.length > 0">
              <p style="marginBottom: 10px;">
                课程
                <!-- <span v-show="filters.lessonId!=null&&filters.lessonId.length==1" style="margin-left: 10px;color:red;font-size:12px">单门课程平均成绩汇总</span>
                <span v-show="filters.lessonId!=null&&filters.lessonId.length>1" style="margin-left: 10px;color:red;font-size:12px">多门课程总分成绩汇总</span> -->
              </p>
              <div>
                <checker v-model="filters.lessonId" default-item-class="achi_default_class" selected-item-class="achi_selected_class" type="radio" @on-change="onChangeLesson">
                  <checker-item style="marginRight: 7px;" v-for="(item, index) in lessonList" :key="index" :value="item.lessonId">{{item.lessonName}}</checker-item>
                </checker>
              </div>
            </div>
            <div style="padding: 5px 10px 5px;" v-if="achievementList.length > 0">
              <p style="marginBottom: 10px;">成绩单
                <span style="margin-left: 10px;color:red;font-size:12px">建议每门课程只能选择一个成绩单进行汇总</span>
              </p>
              <div>
                <checker v-model="filters.achievementsId" default-item-class="achi_achi_class" selected-item-class="achi_selected_class" type="checkbox">
                  <checker-item style="marginRight: 7px;" v-for="(item, index) in achievementList" :key="index" :value="item.achievementsId">{{item.achievementsName}}</checker-item>
                </checker>
              </div>
            </div>
            <div style="height: 50px;"></div>
          </scroller>
          <div style="display: flex;height: 50px;position: absolute;bottom: 0;width: 100vw;">
            <p style="flex: 1;textAlign: center;lineHeight: 50px;backgroundColor: rgb(230, 230, 230)" @click="clearFilter">重置</p>
            <p style="flex: 1;textAlign: center;lineHeight: 50px;color: #fff;backgroundColor: #A2D268" @click="confirmFilter(filters)">确定</p>
          </div>
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
        <datetime-view ref="datetime" :min-year="startTime - 10" :max-year="startTime + 10" v-model="datetime" year-row="{value}年" month-row="{value}月" day-row="{value}日"></datetime-view>
      </popup>
    </div>
  </div>
</template>

<script>
import { Cell, Popup, Checker, CheckerItem, DatetimeView, Group, TransferDom, dateFormat } from 'vux'
import api from '../../statisticsApi.js'

export default {
  directives: {
    TransferDom
  },
  components: {
    Cell, Popup, Checker, CheckerItem, DatetimeView, Group
  },
  props: ['showFilter', 'confirmFilter', 'classId'],
  data () {
    return {
      schoolId: this.$route.params.schoolId,
      showPopUp: false,
      showDatetime: false,
      filters: {
        startDate: null,
        endDate: null,
        classId: null,
        lessonId: null,
        achievementsId: null
      },
      classList: [],
      lessonList: [],
      achievementList: [],
      startTime: parseInt(this.tools.formateTime(new Date(), 'YYYY')),
      datetime: this.tools.formateTime(new Date(), 'YYYY-MM-DD'),
      timeType: '',
      showDetail: false,
      showLessons: true,
      showAchievement: false,
      monday: null,
      sunday: null
    }
  },
  watch: {
    showFilter(newValue, old) {
      if (this.showPopUp === true) {
        this.showPopUp = false
      } else {
        this.showPopUp = true
      }
    }
  },
  mounted () {
    var now = new Date()
    var nowTime = now.getTime()
    var day = now.getDay()
    var oneDayLong = 24 * 60 * 60 * 1000
    var MondayTime = nowTime - (day - 1 + 7) * oneDayLong
    var SundayTime = nowTime - day * oneDayLong
    this.monday = new Date(MondayTime)
    this.sunday = new Date(SundayTime)
    this.filters.startDate = dateFormat(this.monday, 'YYYY-MM-DD')
    this.filters.endDate = dateFormat(this.sunday, 'YYYY-MM-DD')
    if (!this.tools.isNull(this.classId)) {
      // 唯一班级，校长入口
      this.filters.classId = this.classId
      this.selectClass(this.classId)
    } else {
      api.queryTeacherClassList({schoolId: this.schoolId, featureCode: 'CHENGJI'}, (data) => {
        this.classList = this.classList.concat(data)
      }, (er) => {
        this.error(er)
      })
    }
  },
  methods: {
    clearFilter() {
      this.filters = {
        startDate: dateFormat(this.monday, 'YYYY-MM-DD'),
        endDate: dateFormat(this.sunday, 'YYYY-MM-DD'),
        classId: this.tools.isNull(this.classId) ? null : this.classId,
        lessonId: null,
        achievementsId: null
      }
      this.lessonList = this.tools.isNull(this.classId) ? [] : this.lessonList
      this.achievementList = []
    },
    selectTime(val) {
      this.timeType = val
      switch (this.timeType) {
        case 'start':
          this.datetime = this.filters.startDate
          break
        case 'end':
          this.datetime = this.filters.endDate
          break
      }
      this.$refs.datetime.render()
      this.showDatetime = true
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
      this.showLessons = true
      this.showAchievement = false
      this.filters.lessonId = null
      this.filters.achievementsId = null
      api.queryTeacherLessonList({schoolId: this.schoolId, featureCode: 'CHENGJI'}, (data) => {
        this.lessonList.splice(0, this.lessonList.length)
        this.lessonList = this.lessonList.concat(data)
      }, (er) => {
        // this.error(er)
        api.queryTeacherLessonList({schoolId: this.schoolId, featureCode: 'TONGJI'}, (data) => {
          this.lessonList.splice(0, this.lessonList.length)
          this.lessonList = this.lessonList.concat(data)
        }, (er) => {
          // this.error(er)
        })
      })
    },
    error(er) {
      if (er.toUser !== undefined && er.toUser) {
        this.tools.warnToast(er.message)
      }
    },
    onChangeLesson () {
      if (this.filters.lessonId !== null && this.filters.lessonId.length > 1) {
        api.getAchievementBaseList({schoolId: this.schoolId, classId: this.filters.classId, lessonId: this.filters.lessonId, startDate: this.filters.startDate + ' 00:00:00', endDate: this.filters.endDate + ' 23:59:59'}, (data) => {
          this.filters.achievementsId = null
          this.achievementList = data
        }, () => {})
      } else {
        this.achievementList = []
        this.filters.achievementsId = null
      }
    }
  }
}
</script>

<style>
.achi_default_class {
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
.achi_achi_class {
  border: 1px solid #ececec;
  padding: 5px 0;
  font-size: 12px;
  margin-bottom: 5px;
  width: 47%;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.achi_selected_class {
  border: 1px solid #A2D268;
}
</style>
