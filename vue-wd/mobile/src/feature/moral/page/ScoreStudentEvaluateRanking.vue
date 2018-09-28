<template>
  <!-- 学生操行评定排名查询 -->
  <div>
    <div v-if="rankingData.length > 0">
      <span style="position: absolute;right: 0;top: 0;margin-right:10px;margin-top:5px;color:#2E84D4;" @click="showFilter=true">筛选条件</span>
      <p style="text-align:center;font-size:16px;margin-top:40px;">{{currentTitle}}</p>
      <p style="text-align:center;font-size:14px;color:#a2a2a2">{{startDate + ' 至 ' + endDate}}</p>
      <group>
        <cell v-for="(item, index) in rankingData" :key="index" :title="item.studentName" :value="item.totalScore+'分'">
          <p slot="inline-desc" style="margin-top:5px;"><span v-show="item.ranking>0" style="margin-right:10px;">排名：{{item.ranking}}</span><span v-show="item.additionStore>0" style="margin-right:10px;">加分：{{item.additionStore}}分</span><span style="margin-right:10px;" v-show="item.subtractStore>0">扣分：{{item.subtractStore}}分</span><span v-show="item.attachStore>0">无违纪：＋{{item.attachStore}}分</span></p>
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
              <select v-model="currentClassId" class="select_week" style="margin-bottom:10px;width:150px;">
                <option v-for='(item, index) in classList' :key="index" :value="item.classId">&nbsp;&nbsp;{{item.className}}</option>
              </select>
            </div>
            <div style="padding: 0px 10px 5px;" v-if="filterType === 'M'">
              <p style="marginBottom: 10px;">选择月</p>
              <div>
                <select v-model="currentMonth" class="select_week">
                  <option v-for='(item, index) in months' :key="index" :value="item">&nbsp;&nbsp;{{item}}月</option>
                </select>
              </div>
            </div>
            <div style="padding: 10px 10px 5px;" v-if="filterType === 'M'">
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
    <!-- <x-dialog v-model="showDetail" :dialog-style="{'text-align': 'left', 'min-height': '60vh', 'border-radius': '8px'}" hide-on-blur>
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
    </x-dialog> -->
    <detail-tabbar :actionLink="submit" :actions="actions"></detail-tabbar>
  </div>
</template>

<script>
import { Cell, Group, Popup, Checker, CheckerItem, Picker, TransferDomDirective as TransferDom, DatetimeView, XDialog } from 'vux'
import Guide from '@/feature/education/page/statistics/Guide.vue'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '@/feature/moral/api'
export default {
  directives: {
    TransferDom
  },
  components: {
    Cell, DetailTabbar, Guide, Popup, Checker, CheckerItem, Picker, Group, DatetimeView, XDialog
  },
  watch: {
    currentGradeId (newVal, oldVal) {
      this.gradeList.forEach(element => {
        if (element.gradeId === newVal) {
          this.classList = element.classes
          if (this.classList.length > 0) {
            this.currentClassId = this.classList[0].classId
          }
        }
      })
    }
  },
  data () {
    return {
      actions: [{name: '生成报告并推送'}],
      filterDesc: '请选择筛选条件',
      showFilter: false,
      filterType: 'M',
      currentMonth: new Date().getMonth(),
      months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      showDatetime: false,
      startTime: parseInt(this.tools.formateTime(new Date(), 'YYYY')),
      datetime: this.tools.formateTime(new Date(), 'YYYY-MM-DD'),
      startDate: null,
      endDate: null,
      timeType: null,
      currentGradeId: '',
      gradeList: [],
      rankingData: [],
      currentTitle: '',
      showDetail: false,
      currentItem: {},
      classList: [],
      currentClassId: ''
    }
  },
  mounted () {
    api.moralTeacherClass({schoolId: this.$route.params.schoolId, isHaveLessonClass: false}, (data) => {
      this.gradeList = data
      if (data.length > 0) {
        this.currentGradeId = data[0].gradeId
      }
    }, (er) => {})
  },
  methods: {
    onShowFilterView () {
      this.showFilter = true
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
      if (this.filterType === 'M') {
        reportCycle = this.currentMonth
        reportYear = new Date(this.startDate).getFullYear()
      }
      if (this.rankingData.length === 0) {
        this.tools.warnToast('没有评定数据')
        return
      }
      api.addStudentReport({schoolId: this.$route.params.schoolId, classId: this.currentClassId, startDate: this.startDate, endDate: this.endDate, reportType: this.filterType, reportCycle, reportYear}, () => {
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
      if (!this.startDate || !this.endDate) {
        this.tools.warnToast('请选择时间区间')
        return
      }
      api.previewStudentReport({schoolId: this.$route.params.schoolId, classId: this.currentClassId, startDate: this.startDate, endDate: this.endDate}, (data) => {
        this.rankingData = data
        this.showFilter = false
        let currentGradeName = this.getCurrentGradeName(this.currentGradeId)
        if (this.filterType === 'M') {
          this.currentTitle = '【' + this.currentMonth + '月】【' + currentGradeName + '】操行月评定排名'
        }
        if (data.length === 0) {
          this.filterDesc = this.currentTitle + '暂无排名信息'
        }
      }, (er) => {
        if (er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
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
