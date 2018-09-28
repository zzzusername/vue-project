<template>
  <div>
    <p style="text-align:right;">
      <span style="line-height: 34px;color: #2e84d4;margin-right: 15px;" @click="initFilter">筛选</span>
    </p>
    <div :style="{'position': 'relative', 'height': scrollerHeight + 'px'}" v-if="list.length > 0">
      <scroller ref="manage_scroller" no-data-text="没有更多请假情况～">
        <group v-for="(item, index) in list" :key="index" gutter="5px">
          <cell>
            <div slot="title">
              <p :style="{'width': windowWidth+'px', 'vertical-align': ' middle', 'overflow': 'hidden', 'white-space': 'nowrap', 'text-overflow': 'ellipsis', 'display': 'inline-block'}">
                <span style="font-size:16px;">{{item.studentName}}</span>
                <span style="margin-left:10px;font-size:14px;color:#666;">{{item.className}}</span>
              </p>
              <p style="vertical-align: middle;display:inline-block;">
                <span style="font-size: 14px;margin:0 5px 0 10px;color: #999;">{{item.vacationType | filterType}}</span>
                <span style="font-size: 14px;color: rgb(46, 132, 212);" @click="vacationDetailes(item)">详情</span>
              </p>
            </div>
            <span slot="inline-desc" style="font-size: 14px;">申请时间：{{item.createDate | filterCreated}}</span>
            <p slot="inline-desc" style="font-size: 14px;">请假时间：<i style="font-style: normal;">{{item.startDate | filterCreated}}</i>&nbsp;至&nbsp;<i style="font-style: normal;">{{item.endDate | filterCreated}}</i></p>
            <div slot="inline-desc" style="margin-top: 10px;" v-if="item.evaluates.length > 0">
              <x-table>
                <thead>
                  <tr style="text-align:left;">
                    <th style="text-align:left;">违规情况</th>
                    <th>状态</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(tag, items) in item.evaluates" :key="items" v-if="tag.projectType == 2">
                    <td style="text-align:left;">
                      <span>{{tools.formateTime(tag.evaluateDate, ' YYYY-MM-DD HH:mm')}}</span>&nbsp;&nbsp;<span>{{tag.itemName}}</span>&nbsp;&nbsp;<span>{{'-' + tag.evaluateStore}}</span>
                    </td>
                    <td style="width:60px;color:#fff;">
                      <span style="padding: 0 5px;background:rgb(46, 132, 212);border-radius: 3px;" v-if="!tag.isRemove" @click="removeVacation(tag, items, index)">消分</span>
                      <span style="padding: 0 5px;background:#999;border-radius: 3px;" v-else>已消分</span>
                    </td>
                  </tr>
                </tbody>
              </x-table>
            </div>
          </cell>
        </group>
      </scroller>
    </div>
    <p v-if="list.length <= 0" style="text-align: center;font-size: 16px;padding: 0 15px;color: rgb(162, 162, 162);">没有更多请假情况～</p>
    <popup v-model="showFilter" height="50%" style="backgroundColor: #fff;">
      <div style="backgroundColor: #fff;width: 100%;">
        <div style="padding: 5px 10px;">
          <p style="marginBottom: 10px;">日期</p>
          <div style="display: flex;">
            <p style="color: rgb(178, 178, 178);flex: 1;textAlign: center;borderRadius: 3px;backgroundColor: #ececec;lineHeight: 32px;fontSize: 12px;" @click="showDate = true">{{filters.startDate | filterStart}}</p>
            <p style="flex: 1;"></p>
          </div>
        </div>
        <div style="padding: 5px 10px;">
          <p style="marginBottom: 10px;">时间</p>
          <div style="display: flex;">
            <p style="color: rgb(178, 178, 178);flex: 1;textAlign: center;borderRadius: 3px;backgroundColor: #ececec;lineHeight: 32px;fontSize: 12px;" @click="showTimefun('startHours')">{{filters.startHours | filterStart}}</p>
            <p style="width: 20px;lineHeight:32px;textAlign: center">-</p>
            <p style="color: rgb(178, 178, 178);flex: 1;textAlign: center;borderRadius: 3px;backgroundColor: #ececec;lineHeight: 32px;fontSize: 12px;" @click="showTimefun('endHours')">{{filters.endHours | filterStart}}</p>
          </div>
        </div>
        <div style="display:flex;position: fixed;z-index:;100000000;width: 100%;bottom: 0;height: 50px;">
          <div style="flex: 1;backgroundColor:rgb(230, 230, 230)" @click="clearFilter">
            <p style="line-height: 50px; textAlign: center;">重置</p>
          </div>
          <div style="flex: 1;backgroundColor: #8ebf52" @click="confirmFilter">
            <p style="line-height: 50px; textAlign: center;color: #fff;">确定</p>
          </div>
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
        <datetime-view ref="datetime" v-model="valueDate" :min-year="startTime - 1" :max-year="startTime" year-row="{value}年" month-row="{value}月" day-row="{value}日"></datetime-view>
      </popup>
    </div>
    <div v-transfer-dom>
      <popup v-model="showTime" style="background:#fff;">
        <Group gutter="0">
          <cell>
            <span slot="title" @click="showTime = false">取消</span>
            <span slot="default" style="color:rgb(142, 191, 82);" @click="confirmTime">完成</span>
          </cell>
        </Group>
        <datetime-view ref="time" v-model="valueTime" format="HH:mm"></datetime-view>
      </popup>
    </div>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import { Group, Cell, DatetimeView, Popup, XTable, TransferDomDirective as TransferDom } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '../api.js'
export default {
  directives: {
    TransferDom
  },
  components: {
    Group, Cell, DatetimeView, Popup, XTable, DetailTabbar
  },
  data () {
    return {
      scrollerHeight: 0,
      showFilter: false,
      showDate: false,
      showTime: false,
      startTime: new Date().getFullYear(),
      valueDate: this.tools.formateTime(new Date(), 'YYYY-MM-DD'),
      valueTime: new Date().getHours() + ':' + new Date().getMinutes(),
      tag: null,
      list: [],
      filters: {
        startDate: null,
        startHours: null,
        endHours: null
      },
      windowWidth: window.innerWidth - 115
    }
  },
  mounted () {
    this.scrollerHeight = window.innerHeight - 86
    this.getList(this.filters.startHours, this.filters.endHours, (data) => {
      this.list = data
    })
  },
  methods: {
    vacationDetailes (code) {
      this.$router.push({name: 'educationQueryVacation', params: {vacationId: code.vacationId, check: 'check'}})
    },
    initFilter () {
      if (!this.filters.startDate) {
        this.filters.startDate = this.tools.formateTime(new Date().getTime(), 'YYYY-MM-DD')
      }
      if (!this.filters.startHours) {
        this.filters.startHours = '06:00'
      }
      if (!this.filters.endHours) {
        this.filters.endHours = '22:00'
      }
      this.showFilter = true
    },
    clearFilter () {
      this.filters = {
        startDate: null,
        startHours: null,
        endHours: null
      }
    },
    removeVacation (code, indexSmall, indexBig) {
      api.clearStudentMorlScore({schoolId: this.$route.params.schoolId, evaluateId: code.evaluateId}, (data) => {
        this.tools.successToast('消分成功')
        this.list[indexBig].evaluates[indexSmall].isRemove = true
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        } else {
          this.tools.warnToast('消分失败')
        }
      })
    },
    confirmFilter () {
      if (this.filters.startDate) {
        if (!this.filters.startHours || !this.filters.endHours) {
          this.tools.warnToast('请选择时间')
          return
        }
      }
      if (this.filters.startHours !== null || this.filters.endHours !== null) {
        if (this.filters.startDate === null) {
          this.tools.warnToast('请选择日期')
          return
        }
        if (this.filters.startHours >= this.filters.endHours) {
          this.tools.warnToast('请选择正确时间')
          return
        }
      }
      let startDate = null
      let endDate = null
      if (this.filters.startDate !== null && this.filters.startHours !== null) {
        startDate = this.filters.startDate + ' ' + this.filters.startHours + ':00'
      }
      if (this.filters.startDate !== null && this.filters.endHours !== null) {
        endDate = this.filters.startDate + ' ' + this.filters.endHours + ':00'
      }
      this.getList(startDate, endDate, (data) => {
        this.list = data
      })
      this.showFilter = false
    },
    getList (startDate, endDate, callback) {
      api.evaluateVacation({schoolId: this.$route.params.schoolId, startDate: startDate, endDate: endDate, rowStart: 0, rowCount: 9999999}, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        } else {
          this.tools.warnToast('查询失败')
        }
      })
    },
    confirmDate () {
      this.filters.startDate = this.valueDate
      this.showDate = false
    },
    confirmTime () {
      if (this.tag === 'startHours') {
        this.filters.startHours = this.valueTime
      } else if (this.tag === 'endHours') {
        this.filters.endHours = this.valueTime
      }
      this.showTime = false
    },
    showTimefun (type) {
      if (type === 'startHours') {
        if (!this.tools.isNull(this.filters.startHours)) {
          this.valueTime = this.filters.startHours
        }
      } else if (type === 'endHours') {
        if (!this.tools.isNull(this.filters.endHours)) {
          this.valueTime = this.filters.endHours
        }
      }
      this.tag = type
      this.showTime = true
      this.$refs.time.render()
    }
  },
  filters: {
    filterStart: function (val) {
      if (val !== null) {
        return val
      } else {
        return '请选择时间'
      }
    },
    filterType: function (val) {
      if (val === 1) {
        return '事假'
      } else if (val === 2) {
        return '病假'
      } else {
        return '其它'
      }
    },
    filterCreated: function (date) {
      var val = new Date(date)
      let hours = val.getHours() >= 10 ? val.getHours() : '0' + val.getHours()
      let minutes = val.getMinutes() === 0 ? '00' : val.getMinutes().toString().length >= 2 ? val.getMinutes() : '0' + val.getMinutes()
      let str = val.getMonth() + 1 + '月' + val.getDate() + '日' + ' ' + hours + ':' + minutes
      return str
    }
  }
}
</script>

<style>

</style>
