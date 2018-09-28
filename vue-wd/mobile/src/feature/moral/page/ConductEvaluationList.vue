<template>
  <div>
    <p class="filter-btn">
      <label @click="filterSearch"><span>筛选</span></label>
    </p>
    <div :style="{'position': 'relative', height: contentHeight + 'px'}">
      <scroller :on-infinite="infinite" no-data-text="没有更多评定记录了～" ref="scroller">
        <div style="height: 10px" v-if="list.length == 0"></div>
        <cell style="background-color: #fff;font-size: 16px;" v-for="(item, index) in list" :key="index" 
          :title="item.projectName" is-link @click.native="showDetail(item)">
          <div slot="inline-desc">
            <p><span>{{item.studentName}}</span><span>({{item.className}})</span></p>
            <p>
              <span>{{tools.formateTime(item.evaluateDate, 'YYYY-MM-DD HH:mm')}}</span>
            </p>
          </div>
          <p v-if="item.isRemove==true" style="color:#FC5355;font-size:14px;">已消分</p>
          <p v-else style="font-size:14px;">{{getValue(item)}}分</p>
        </cell>
      </scroller>
    </div>
    <x-dialog v-model="showDialog" :dialog-style="{'text-align': 'left', 'min-height': '60vh', 'border-radius': '8px'}" hide-on-blur>
      <div>
        <scroller>
          <cell :title="'['+evaluateInfo.studentName+'] '+evaluateInfo.projectName" style="background:#f6f6f6" :value="getValueDetail() + '分'">
            <p style="color:#FC5355;">{{evaluateInfo.isRemove ? '已消分' : getValueDetail() + '分'}}</p>
          </cell>
          <div class="score-detail">
            <p class="title">评定明细</p>
            <p class="content"><span>{{evaluateInfo.itemName}}:</span><span style="margin-left: 5px">{{getValueDetail()}}分</span></p>
            <div class="content" style="padding-top: 5px;" v-if="evaluateInfo.classEvaluateId">
              <p><span>{{'['+evaluateInfo.className + '] ' + evaluateInfo.classProjectName + '(' + evaluateInfo.classItemName + ')'}}: </span><span style="margin-left: 5px;">{{getValueDetail() + '分'}}</span></p>
            </div>
          </div>
          <div>
            <p class="title">评定原因</p>
            <p class="content">{{evaluateInfo.evaluateDesc}}</p>
            <div v-if="evaluateInfo.evaluateImg" style="font-size:0;">
              <img style="width:100%;" v-for="(item, index) in getImgs()" :key="index" :src="tools.cdn(item)" alt="">
            </div>
          </div>
        </scroller>
      </div>
    </x-dialog>
    <popup v-model="showPopUp" height="50%">
        <div style="backgroundColor: #fff;width: 100%;minHeight: 100%;">
          <scroller ref="scroller">
            <div style="padding: 5px 10px;">
              <p style="marginBottom: 10px;">日期区间</p>
              <div style="display: flex;">
                <p style="color: rgb(178, 178, 178);flex: 1;textAlign: center;borderRadius: 3px;backgroundColor: #ececec;lineHeight: 32px;fontSize: 12px;" @click="showDatefun('start')">{{filter.startDate | filterStart}}</p>
                <p style="width: 20px;lineHeight:32px;textAlign: center">-</p>
                <p style="color: rgb(178, 178, 178);flex: 1;textAlign: center;borderRadius: 3px;backgroundColor: #ececec;lineHeight: 32px;fontSize: 12px;" @click="showDatefun('end')">{{filter.endDate | filterEnd}}</p>
              </div>
            </div>
            <div style="padding: 5px 10px 5px;">
              <p style="marginBottom: 10px;">学生姓名</p>
              <div class="student-name-input">
                <input type="text" v-model="filter.studentName">
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
      <div v-transfer-dom>
        <popup v-model="showDate" style="background:#fff;">
          <Group gutter="0">
            <cell>
              <span slot="title" @click="showDate = false">取消</span>
              <span slot="default" style="color:rgb(142, 191, 82);" @click="confirmDate">完成</span>
            </cell>
          </Group>
          <datetime-view ref="datetime" :min-year="startTime - 10" :max-year="startTime + 10" v-model="valueDate" year-row="{value}年" month-row="{value}月" day-row="{value}日"></datetime-view>
        </popup>
      </div>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import { Cell, XDialog, Popup, Group, DatetimeView, TransferDomDirective as TransferDom } from 'vux'
  import api from '../api'
  export default {
    directives: {
      TransferDom
    },
    components: {DetailTabbar, Cell, Group, XDialog, Popup, DatetimeView},
    data () {
      return {
        contentHeight: 0,
        list: [],
        filter: {
          startDate: null,
          endDate: null,
          studentName: null
        },
        showDialog: false,
        evaluateInfo: {},
        showPopUp: false,
        showDate: false,
        timeType: null,
        valueDate: null,
        tag: null
      }
    },
    computed: {
      startTime() {
        return new Date().getFullYear()
      }
    },
    mounted () {
      this.contentHeight = window.innerHeight - 84
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
      clearFilter () {
        this.filter = {
          startDate: null,
          endDate: null,
          studentName: null
        }
      },
      showDatefun(code) {
        this.showDate = true
        if (code === 'start') {
          if (!this.tools.isNull(this.filter.startDate)) {
            this.valueDate = this.filter.startDate
          }
          this.tag = 'start'
        } else {
          if (!this.tools.isNull(this.filter.endDate)) {
            this.valueDate = this.filter.endDate
          }
          this.tag = 'end'
        }
        this.$refs.datetime.render()
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
        this.getList(this.filter, 0, (data) => {
          this.list = data
        })
      },
      confirmDate() {
        if (this.tag === 'start') {
          this.filter.startDate = this.valueDate
          this.showDate = false
        } else {
          this.filter.endDate = this.valueDate
          this.showDate = false
        }
      },
      showDetail (item) {
        api.studentManagerEvaluateInfo({schoolId: this.$route.params.schoolId, evaluateId: item.evaluateId}, (data) => {
          this.evaluateInfo = data
          this.showDialog = true
        }, (er) => {
          this.warnToast(er)
        })
      },
      infinite (done) {
        this.getList(this.filter, this.list.length, (data) => {
          this.list = this.list.concat(data)
          if (data.length === 20) {
            done(false)
          } else {
            done(true)
          }
        })
      },
      getList(filter, rowStart, cb) {
        api.queryStudentEvaluateHistory({schoolId: this.$route.params.schoolId, filter: filter, rowStart: rowStart, rowCount: 20}, (data) => {
          cb(data)
        }, (er) => {
          this.warnToast(er)
        })
      },
      getValue(val) {
        if (val.projectType === 1) {
          return '+' + val.evaluateStore
        } else {
          return '-' + val.evaluateStore
        }
      },
      getValueDetail() {
        if (this.evaluateInfo.projectType === 1) {
          return '+' + this.evaluateInfo.evaluateStore
        } else {
          return '-' + this.evaluateInfo.evaluateStore
        }
      },
      getImgs() {
        return this.evaluateInfo.evaluateImg.split(',')
      },
      selectTime(val) {
        this.timeType = val
        this.showDatetime = true
      },
      warnToast(er) {
        if (er.toUser) {
          this.tools.warnToast(er.message)
          return
        }
        this.tools.warnToast('获取列表失败')
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

<style lang="less" scoped>
@import '~vux/src/styles/close';
.title {
  text-align: center;
  font-weight: bold;
  // background-color: #f6f6f6;
  padding: 10px 15px;
}
.content {
  padding: 10px 15px 5px;
}
.btn {
  height: 40px;
  text-align: center;
  position: fixed;
  bottom: 0;
  width: 100%;
  line-height: 40px;
  font-size: 16px;
  background-color: rgb(46, 132, 212);
  border-radius: 0 0 5px 5px;
  color: #fff;
}
.filter-btn {
  text-align: right;
  background-color: #f6f6f6;
  label {
    padding: 7px 15px;
    line-height: 34px;
    color: rgb(46, 132, 212);
  }
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
    text-indent: 1em;
  }
}
</style>

