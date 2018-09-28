<template>
<!-- 德育管理请假设置 -->
  <div>
    <group>
      <x-switch title="是否只允许班主任批假"  v-model="techerStatus" prevent-default @on-click="onClick"></x-switch>
      <cell title="有效请假时间设置" is-link @click.native="showTimeSetting=true"></cell>
      <popup v-model="showTimeSetting" height="80%">
        <div :style="{'position': 'relative', 'height': scrollerHeight + 'px'}">
          <scroller>
          <p style="margin:5px 5px;font-size:16px;">请设置上午／下午有效提交请假时间</p>
          <p style="margin:5px 5px;color:#FC5355;font-size:14px;">注：学生请上午或全天假，必须要在上午有效时间前提交请假申请；学生请下午或次日假，必须要在下午有效时间前提交请假申请</p>
          <group gutter="0">
            <cell>
              <span slot="title">星期一</span>
              <div style="display: inline-flex;">
                <p style="font-size:16px;lineHeight: 32px;margin-right:5px;">上午 </p>
                <p style="width:54px;color: rgb(178, 178, 178);flex: 1;textAlign: center;borderRadius: 3px;backgroundColor: #ececec;lineHeight: 32px;fontSize: 16px;" @click="showDatefun('mondayAm')">{{info.mondayAm}}</p>
                <p style="font-size:16px;lineHeight: 32px;margin-left:20px;margin-right:5px;">下午 </p>
                <p style="width:54px;color: rgb(178, 178, 178);flex: 1;textAlign: center;borderRadius: 3px;backgroundColor: #ececec;lineHeight: 32px;fontSize: 16px;" @click="showDatefun('mondayPm')">{{info.mondayPm}}</p>
              </div>
            </cell>
            <cell>
              <span slot="title">星期二</span>
              <div style="display: inline-flex;">
                <p style="font-size:16px;lineHeight: 32px;margin-right:5px;">上午 </p>
                <p style="width:54px;color: rgb(178, 178, 178);flex: 1;textAlign: center;borderRadius: 3px;backgroundColor: #ececec;lineHeight: 32px;fontSize: 16px;" @click="showDatefun('tuesdayAm')">{{info.tuesdayAm}}</p>
                <p style="font-size:16px;lineHeight: 32px;margin-left:20px;margin-right:5px;">下午 </p>
                <p style="width:54px;color: rgb(178, 178, 178);flex: 1;textAlign: center;borderRadius: 3px;backgroundColor: #ececec;lineHeight: 32px;fontSize: 16px;" @click="showDatefun('tuesdayPm')">{{info.tuesdayPm}}</p>
              </div>
            </cell>
            <cell>
              <span slot="title">星期三</span>
              <div style="display: inline-flex;">
                <p style="font-size:16px;lineHeight: 32px;margin-right:5px;">上午 </p>
                <p style="width:54px;color: rgb(178, 178, 178);flex: 1;textAlign: center;borderRadius: 3px;backgroundColor: #ececec;lineHeight: 32px;fontSize: 16px;" @click="showDatefun('wednesdayAm')">{{info.wednesdayAm}}</p>
                <p style="font-size:16px;lineHeight: 32px;margin-left:20px;margin-right:5px;">下午 </p>
                <p style="width:54px;color: rgb(178, 178, 178);flex: 1;textAlign: center;borderRadius: 3px;backgroundColor: #ececec;lineHeight: 32px;fontSize: 16px;" @click="showDatefun('wednesdayPm')">{{info.wednesdayPm}}</p>
              </div>
            </cell>
            <cell>
              <span slot="title">星期四</span>
              <div style="display: inline-flex;">
                <p style="font-size:16px;lineHeight: 32px;margin-right:5px;">上午 </p>
                <p style="width:54px;color: rgb(178, 178, 178);flex: 1;textAlign: center;borderRadius: 3px;backgroundColor: #ececec;lineHeight: 32px;fontSize: 16px;" @click="showDatefun('thursdayAm')">{{info.thursdayAm}}</p>
                <p style="font-size:16px;lineHeight: 32px;margin-left:20px;margin-right:5px;">下午 </p>
                <p style="width:54px;color: rgb(178, 178, 178);flex: 1;textAlign: center;borderRadius: 3px;backgroundColor: #ececec;lineHeight: 32px;fontSize: 16px;" @click="showDatefun('thursdayPm')">{{info.thursdayPm}}</p>
              </div>
            </cell>
            <cell>
              <span slot="title">星期五</span>
              <div style="display: inline-flex;">
                <p style="font-size:16px;lineHeight: 32px;margin-right:5px;">上午 </p>
                <p style="width:54px;color: rgb(178, 178, 178);flex: 1;textAlign: center;borderRadius: 3px;backgroundColor: #ececec;lineHeight: 32px;fontSize: 16px;" @click="showDatefun('fridayAm')">{{info.fridayAm}}</p>
                <p style="font-size:16px;lineHeight: 32px;margin-left:20px;margin-right:5px;">下午 </p>
                <p style="width:54px;color: rgb(178, 178, 178);flex: 1;textAlign: center;borderRadius: 3px;backgroundColor: #ececec;lineHeight: 32px;fontSize: 16px;" @click="showDatefun('fridayPm')">{{info.fridayPm}}</p>
              </div>
            </cell>
            <cell>
              <span slot="title">星期六</span>
              <div style="display: inline-flex;">
                <p style="font-size:16px;lineHeight: 32px;margin-right:5px;">上午 </p>
                <p style="width:54px;color: rgb(178, 178, 178);flex: 1;textAlign: center;borderRadius: 3px;backgroundColor: #ececec;lineHeight: 32px;fontSize: 16px;" @click="showDatefun('saturdayAm')">{{info.saturdayAm}}</p>
                <p style="font-size:16px;lineHeight: 32px;margin-left:20px;margin-right:5px;">下午 </p>
                <p style="width:54px;color: rgb(178, 178, 178);flex: 1;textAlign: center;borderRadius: 3px;backgroundColor: #ececec;lineHeight: 32px;fontSize: 16px;" @click="showDatefun('saturdayPm')">{{info.saturdayPm}}</p>
              </div>
            </cell>
            <cell>
              <span slot="title">星期日</span>
              <div style="display: inline-flex;">
                <p style="font-size:16px;lineHeight: 32px;margin-right:5px;">上午 </p>
                <p style="width:54px;color: rgb(178, 178, 178);flex: 1;textAlign: center;borderRadius: 3px;backgroundColor: #ececec;lineHeight: 32px;fontSize: 16px;" @click="showDatefun('sundayAm')">{{info.sundayAm}}</p>
                <p style="font-size:16px;lineHeight: 32px;margin-left:20px;margin-right:5px;">下午 </p>
                <p style="width:54px;color: rgb(178, 178, 178);flex: 1;textAlign: center;borderRadius: 3px;backgroundColor: #ececec;lineHeight: 32px;fontSize: 16px;" @click="showDatefun('sundayPm')">{{info.sundayPm}}</p>
              </div>
            </cell>
          </group>
          </scroller>
        </div>
        <div style="display:flex;position: fixed;width: 100vw;bottom: 0;height: 50px;">
          <div style="flex: 1;backgroundColor:rgb(230, 230, 230)" @click="showTimeSetting = false">
            <p style="line-height: 50px; textAlign: center;">关闭</p>
          </div>
          <div style="flex: 1;backgroundColor: #8ebf52" @click="onSave()">
            <p style="line-height: 50px; textAlign: center;color: #fff;">保存</p>
          </div>
        </div>
      </popup>
    </group>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import { Group, Cell, XSwitch, Popup, DatetimePlugin, dateFormat } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '@/feature/moral/api'
import Vue from 'vue'
Vue.use(DatetimePlugin)
export default {
  components: {
    Group, Cell, XSwitch, DetailTabbar, Popup
  },
  data () {
    return {
      showTimeSetting: false,
      info: {
        mondayAm: null,
        mondayPm: null,
        tuesdayAm: null,
        tuesdayPm: null,
        wednesdayAm: null,
        wednesdayPm: null,
        thursdayAm: null,
        thursdayPm: null,
        fridayAm: null,
        fridayPm: null,
        saturdayAm: null,
        saturdayPm: null,
        sundayAm: null,
        sundayPm: null
      },
      techerStatus: false,
      scrollerHeight: 0
    }
  },
  mounted () {
    this.scrollerHeight = window.innerHeight * 0.8 - 50
    api.settingVacationInfo({schoolId: this.$route.params.schoolId}, (data) => {
      this.info.mondayAm = this.formatDate(data.mondayAm)
      this.info.mondayPm = this.formatDate(data.mondayPm)
      this.info.tuesdayAm = this.formatDate(data.tuesdayAm)
      this.info.tuesdayPm = this.formatDate(data.tuesdayPm)
      this.info.wednesdayAm = this.formatDate(data.wednesdayAm)
      this.info.wednesdayPm = this.formatDate(data.wednesdayPm)
      this.info.thursdayAm = this.formatDate(data.thursdayAm)
      this.info.thursdayPm = this.formatDate(data.thursdayPm)
      this.info.fridayAm = this.formatDate(data.fridayAm)
      this.info.fridayPm = this.formatDate(data.fridayPm)
      this.info.saturdayAm = this.formatDate(data.saturdayAm)
      this.info.saturdayPm = this.formatDate(data.saturdayPm)
      this.info.sundayAm = this.formatDate(data.sundayAm)
      this.info.sundayPm = this.formatDate(data.sundayPm)
      this.techerStatus = data.isAdviserAllow
    }, () => {})
  },
  methods: {
    formatDate (time) {
      if (parseInt(time) === 0) {
        return '08:00'
      } else {
        return dateFormat(time, 'HH:mm')
      }
    },
    showDatefun (key) {
      let self = this
      console.log('self.info[key]', self.info[key])
      this.$vux.datetime.show({
        value: '2016-08-18 ' + self.info[key],
        format: 'HH:mm',
        confirmText: '确认',
        cancelText: '取消',
        hourRow: '{value}点',
        minuteRow: '{value}分',
        onConfirm (val) {
          self.info[key] = val
        }
      })
    },
    onClick (newVal, oldVal) {
      this.techerStatus = newVal
      api.classTeacherVacation({schoolId: this.$route.params.schoolId, bo: newVal}, () => {
        this.tools.successToast('设置成功')
      }, (er) => {
        if (er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    onSave () {
      if ((!this.info.mondayAm && this.info.mondayAm) || (this.info.mondayPm && this.info.mondayAm > this.info.mondayPm)) {
        this.tools.warnToast('星期一有效时间设置错误')
        return
      }
      if ((!this.info.tuesdayAm && this.info.tuesdayPm) || (this.info.tuesdayPm && this.info.tuesdayAm > this.info.tuesdayPm)) {
        this.tools.warnToast('星期二有效时间设置错误')
        return
      }
      if ((!this.info.wednesdayAm && this.info.wednesdayPm) || (this.info.wednesdayPm && this.info.wednesdayAm > this.info.wednesdayPm)) {
        this.tools.warnToast('星期三有效时间设置错误')
        return
      }
      if ((!this.info.thursdayAm && this.info.thursdayPm) || (this.info.thursdayPm && this.info.thursdayAm > this.info.thursdayPm)) {
        this.tools.warnToast('星期四有效时间设置错误')
        return
      }
      if ((!this.info.fridayAm && this.info.fridayPm) || (this.info.fridayPm && this.info.fridayAm > this.info.fridayPm)) {
        this.tools.warnToast('星期五有效时间设置错误')
        return
      }
      if ((!this.info.saturdayAm && this.info.saturdayPm) || (this.info.saturdayPm && this.info.saturdayAm > this.info.saturdayPm)) {
        this.tools.warnToast('星期六有效时间设置错误')
        return
      }
      if ((!this.info.mondayAm && this.info.mondayAm) || (this.info.sundayPm && this.info.sundayAm > this.info.sundayPm)) {
        this.tools.warnToast('星期日有效时间设置错误')
        return
      }
      api.timeSettingVacation({schoolId: this.$route.params.schoolId, info: this.info}, () => {
        this.showTimeSetting = false
        this.tools.successToast('设置成功')
      }, (er) => {
        if (er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    }
  }
}
</script>

<style>

</style>
