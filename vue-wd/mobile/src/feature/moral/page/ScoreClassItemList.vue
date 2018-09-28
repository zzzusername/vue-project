<template>
  <!-- 星级班级评定扣分查询 -->
  <div>
    <p class="filter-btn">
      <label @click="filterSearch"><span>筛选</span></label>
    </p>
    <div :style="{'position': 'relative', height: contentHeight + 'px'}">
      <scroller :on-infinite="infinite" no-data-text="没有更多数据了～" ref="scroller">
        <div style="height: 10px" v-if="list.length == 0"></div>
        <cell style="background-color: #fff;font-size: 16px;" 
          v-for="(item, index) in list" :key="index" 
          :title="item.projectName" is-link @click.native="showDetail(item)">
          <div slot="inline-desc">
            <p><span>{{item.className}}</span></p>
            <p>
              <span v-if="item.creatorTeacherName" style="margin-right:15px;">{{item.creatorTeacherName}}</span>
              <span>{{tools.formateTime(item.evaluateDate, 'YYYY-MM-DD HH:mm')}}</span>
            </p>
          </div>
          <p v-if="item.isRemove==true" style="color:#FC5355;font-size:14px;">已消分</p>
          <p v-else style="font-size:14px;">-{{item.evaluateStore}}分</p>
        </cell>
      </scroller>
    </div>
    <detail-tabbar></detail-tabbar>
    <div>
      <popup v-model="showPopUp" height="80%">
        <div style="backgroundColor: #fff;width: 100%;minHeight: 100%;">
          <scroller ref="scroller">
            <div style="padding: 10px 10px 5px;">
              <p style="marginBottom: 10px;">日期区间</p>
              <div style="display: flex;">
                <p style="flex: 1;textAlign: center;borderRadius: 3px;backgroundColor: #ececec;lineHeight: 32px;fontSize: 12px;color: #b2b2b2;" @click="selectTime('start')">{{filter.startDate == null ? '开始日期' : filter.startDate}}</p>
                <p style="width: 20px;lineHeight:32px;textAlign: center">-</p>
                <p style="flex: 1;textAlign: center;borderRadius: 3px;backgroundColor: #ececec;lineHeight: 32px;fontSize: 12px;color: #b2b2b2;" @click="selectTime('end')">{{filter.endDate == null ? '结束日期' : filter.endDate}}</p>
              </div>
            </div>
            <div style="padding: 0px 10px 5px;" v-if="gradeList.length > 0">
              <p style="marginBottom: 10px;">年级</p>
              <div>
                <checker v-model="filter.gradeId" default-item-class="checker-default-class" selected-item-class="checker-selected-class" radio-required>
                  <checker-item style="marginRight: 7px;" v-for="(item, index) in gradeList" :key="index" :value="item.gradeId">{{item.gradeName}}</checker-item>
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
      <div>
        <popup v-model="showDatetime">
          <group gutter="0">
            <cell>
              <p slot="title" style="color: #828282;fontSize: 14px;" @click="showDatetime=false">取消</p>
              <p style="color: #A2D268;fontSize: 14px;" @click="() => {showDatetime=false, confirmDateTime()}">确定</p>
            </cell>
          </group>
          <datetime-view ref="datetime" :min-year="startTime - 10" :max-year="startTime + 10" v-model="datetime" year-row="{value}年" month-row="{value}月" day-row="{value}日"></datetime-view>
        </popup>
      </div>
    </div>
    <score-class-detail :show="viewDetail" :detail="scoreDetail" @close="(val) => {viewDetail = false}" @clear-score-success="clearScoreSuccess"></score-class-detail>
  </div>
</template>

<script>
import api from '../api'
import DetailTabbar from '@/components/DetailTabbar.vue'
import ScoreClassDetail from '../components/ScoreClassDetail'
import {Cell, Popup, Checker, CheckerItem, Group, DatetimeView} from 'vux'
export default {
  components: {
    DetailTabbar, ScoreClassDetail, Cell, Popup, Checker, CheckerItem, Group, DatetimeView
  },
  data() {
    return {
      contentHeight: 0,
      list: [],
      filter: {},
      showPopUp: false,
      gradeList: [],
      showDatetime: false,
      datetime: null,
      timeType: null,
      viewDetail: false,
      scoreDetail: {}
    }
  },
  computed: {
    schoolId() {
      return this.$route.params.schoolId
    },
    startTime() {
      return new Date().getFullYear()
    }
  },
  mounted() {
    this.contentHeight = window.innerHeight - 84
    this.datetime = this.tools.formateTime(new Date(), 'YYYY-MM-DD')
    api.moralTeacherClass({schoolId: this.$route.params.schoolId, isHaveLessonClass: false}, (data) => {
      this.gradeList = data
    }, (er) => {})
  },
  methods: {
    filterSearch() {
      if (!this.filter.startDate) {
        this.filter.startDate = this.tools.formateTime(new Date(), 'YYYY-MM-DD')
      }
      if (!this.filter.endDate) {
        this.filter.endDate = this.tools.formateTime(new Date(), 'YYYY-MM-DD')
      }
      this.showPopUp = true
    },
    infinite(done) {
      this.getList(this.list.length, (data) => {
        this.list = this.list.concat(data)
        if (data.length === 20) {
          done(false)
        } else {
          done(true)
        }
      })
    },
    getList(rowStart, cb) {
      // if (this.filter.startDate && this.filter.endDate) {
      //   this.filter.startDate = this.filter.startDate + ' 00:00'
      //   this.filter.endDate = this.filter.endDate + ' 23:59'
      // }
      api.getClassMinusMoralScoreList({schoolId: this.schoolId, filter: this.filter, rowStart: rowStart, rowCount: 20}, (data) => {
        cb(data)
      }, (er) => {
        this.warnToast(er)
      })
    },
    warnToast(er) {
      if (er.toUser) {
        this.tools.warnToast(er.message)
        return
      }
      this.tools.warnToast('获取列表失败')
    },
    showDetail(val) {
      // skip detail
      this.scoreDetail = val
      this.viewDetail = true
    },
    selectTime(val) {
      this.timeType = val
      this.showDatetime = true
    },
    clearFilter() {
      this.filter = {}
    },
    confirmFilter() {
      if (this.filter.startDate && !this.filter.endDate) {
        this.tools.warnToast('请选择结束时间')
        return
      }
      if (!this.filter.startDate && this.filter.endDate) {
        this.tools.warnToast('请选择开始时间')
        return
      }
      this.showPopUp = false
      if (this.list.length > 10) {
        this.list = []
        this.$refs.scroller.finishInfinite()
      } else {
        this.list = []
        this.getList(this.list.length, (data) => {
          this.list = data
        })
      }
      // this.list = []
      // this.$refs.scroller.finishInfinite()
      // this.getList(this.list.length, (data) => {
      //   this.list = data
      // })
    },
    confirmDateTime() {
      if (this.timeType === 'start') {
        this.filter.startDate = this.datetime
      } else {
        this.filter.endDate = this.datetime
      }
      this.datetime = this.tools.formateTime(new Date(), 'YYYY-MM-DD')
    },
    clearScoreSuccess(val) {
      this.list.forEach(element => {
        if (element.evaluateId === val) {
          element.isRemove = true
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.filter-btn {
  text-align: right;
  background-color: #f6f6f6;
  label {
    padding: 7px 15px;
    line-height: 34px;
    color: rgb(46, 132, 212);
  }
}
.checker-default-class {
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
.checker-selected-class {
  border: 1px solid #A2D268;
}
.student-name-input {
  input {
    width: 100%;
    height: 40px;
    border-radius: 3px;
    border: 1px #d9d9d9 solid;
    font-size: 16px;
    background-color: #fff;
    background-image: none;
  }
}
</style>

