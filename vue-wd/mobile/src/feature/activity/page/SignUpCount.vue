<template>
  <div>
    <div :style="{'position': 'relative', 'height': scrollerHeight + 'px'}">
      <scroller :on-infinite="infinite" no-data-text="" ref="manage_scroller">
        <div>
          <group gutter="0">
            <div style="width:100px;fontSize:12px;margin:10px auto;">
              <divider>活动核销</divider>
            </div>
            <div style="margin:10px 10px">
              <flexbox>
                <flexbox-item>
                  <div @click="qrcodeVerification()">
                    <span style="display:block;textAlign:center;fontSize:40px;color:#666" class="iconfont icon-saomahexiao"></span>
                    <span style="display:block;textAlign:center;fontSize:14px;color:#666">扫码核销</span>
                  </div>
                </flexbox-item>
                <flexbox-item>
                  <div @click="codeVerification()">
                    <span style="display:block;textAlign:center;fontSize:40px;color:#666" class="iconfont icon-querenmahexiao"></span>
                    <span style="display:block;textAlign:center;fontSize:14px;color:#666">确认码核销</span>
                  </div>
                </flexbox-item>
              </flexbox>
            </div>
          </group>
          <group class="custom-group-bottom">
            <div style="width:100px;fontSize:12px;margin:10px auto;">
              <divider>概览</divider>
            </div>
            <div style="margin:0 24px 20px;">
              <flexbox>
                <flexbox-item v-for="(item, index) in countList" :key="index">
                  <div style="border: #f36d21 solid 1px;borderRadius:2px;margin:0 10px;">
                    <span style="display:block;text-align:center;fontSize:14px;padding:5px 0;border-bottom: #f36d21 solid 1px;">{{item.key}}</span>
                    <span style="display:block;text-align:center;fontSize:12px;padding:8px 0">{{item.value}}</span>
                  </div>
                </flexbox-item>
              </flexbox>
            </div>
            <div v-show="verificationList.length>0" style="width:100px;fontSize:12px;margin:10px auto;margin-bottom:5px;">
              <divider>到场用户</divider>
            </div>
          </group>
          <group gutter="0" class="custom-group-top">
            <cell v-for="(item, index) in verificationList" :key="index" :title="item.signName + '  ' + item.signPhoneNum" :inline-desc="'到场时间：'+getFormateTime(item.verificationDate)" style="font-size: 16px;">
              <x-img slot="icon" :src="tools.cdn(tools.isNull(item.studentUserIcon)?item.teacherUserIcon:item.studentUserIcon, 'head.png')" class="cell-img" error-class="cell-img-error"></x-img>
            </cell>
          </group>
        </div>
      </scroller>
    </div>
    <div>
      <x-dialog v-model="showDialogStyle" hide-on-blur :dialog-style="{'max-width': '100%', width: '100%', height: '50%', 'background-color': 'transparent'}">
        <div style="padding: 20px;backgroundColor:#fff;width:80%;margin:auto;border-radius:5px;">
          <p style="fontSize:12px;color:red;" v-if="errorMessage !== ''">{{errorMessage}}</p>
          <x-input style="border: 1px solid #D9D9D9" placeholder="请输入确认码" v-model="confirmationCode" @on-change="codeChange"></x-input>
          <div style="width: 60%;margin:0 auto">
            <x-button style="marginTop: 20px;fontSize:14px;" text="核销" type="primary" @click.native="codeSubmit()"></x-button>
          </div>
        </div>
      </x-dialog>
    </div>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import { Cell, Group, XButton, Flexbox, FlexboxItem, XImg, Popup, TransferDom, Divider, XDialog, XInput, dateFormat } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '@/feature/activity/api'
export default {
  directives: {
    TransferDom
  },
  components: {
    Cell, Group, DetailTabbar, XButton, Flexbox, FlexboxItem, XImg, Popup, Divider, XDialog, XInput
  },
  data() {
    return {
      newList: [{}],
      showDialogStyle: false,
      confirmationCode: '',
      errorMessage: '',
      verificationList: [],
      countList: [],
      scrollerHeight: 0
    }
  },
  mounted() {
    this.scrollerHeight = window.innerHeight - 50
    var schoolId = this.$route.params.schoolId
    var activityId = this.$route.params.activityId
    api.activityCount({ schoolId, activityId }, (data) => {
      this.countList.push({ key: '总报名人数', value: data.signCount })
      this.countList.push({ key: '到场用户', value: data.verificationUserCount })
    }, () => { })
  },
  methods: {
    infinite(done) {
      this.getVerificationList(this.verificationList.length, (data) => {
        this.verificationList = this.verificationList.concat(data)
        if (data.length >= 20) {
          done()
        } else {
          done(true)
        }
      })
    },
    qrcodeVerification() {
      this.$wechat.scanQRCode({
        needResult: 1,
        scanType: ['qrCode', 'barCode'],
        success: res => {
          var result = res.resultStr // 当needResult 为 1 时，扫码返回的结果
          this.verification(result, (data) => {
          })
        }
      })
    },
    codeVerification() {
      this.showDialogStyle = true
    },
    codeChange(val) {
      this.errorMessage = ''
    },
    codeSubmit() {
      this.verification(this.confirmationCode, (data) => {
        if (data.rs === 1) {
          this.showDialogStyle = false
        } else {
          this.errorMessage = data.message
        }
      })
    },
    verification(verificationCode, callback) {
      var schoolId = this.$route.params.schoolId
      var activityId = this.$route.params.activityId
      api.activityVerification({ schoolId, activityId, verificationCode }, (data) => {
        callback(data)
        if (data.rs === 1) {
          this.tools.toast('核销成功')
          this.verificationList = []
          this.$refs.manage_scroller.finishInfinite()
        }
      }, (error) => {
        if (error !== null && error.toUser) {
          this.tools.toast(error.message)
        }
      })
    },
    getFormateTime(time) {
      if (time === null) {
        return ''
      }
      return dateFormat(time, 'HH:mm')
    },
    getVerificationList(rowStart, callback) {
      var schoolId = this.$route.params.schoolId
      var activityId = this.$route.params.activityId
      var rowCount = 20
      api.getVerificationList({ schoolId, activityId, rowStart, rowCount }, (list) => {
        callback(list)
      }, () => { })
    }
  }
}
</script>

<style>
.tab-item-sel {
  text-align: center;
  color: #A2D268;
}

.tab-item {
  text-align: center;
  color: #000;
}

.tab-divider {
  text-align: center;
  margin: 0 auto;
  background-color: #e5e5e5;
  width: 1px;
  height: 30px;
}

.btn-item {
  width: 120px !important;
  color: #fff;
  height: 30px;
  line-height: 30px;
  font-size: 16px;
  background-color: #FF843E!important
}

.cell-img {
  display: block;
  margin-right: 8px;
  border-radius: 25px;
  width: 50px;
}

.cell-btn {
  /*display:block;*/
  margin-right: 8px;
  font-size: 14px;
  /*border-radius: 25px;*/
  width: 60px!important;
}

.cell-img-error {
  background-image: url("../../../assets/head.png") no-repeat;
  background-size: 100% 100% !important;
}

.tab-div {
  display: table-cell;
  font-size: 16px;
  height: 40px;
  line-height: 40px;
  padding-left: 10px;
}
.custom-group-bottom .weui-cells::after {
  border-bottom: 0px solid #D9D9D9;
}
.custom-group-top .weui-cells::before {
  border-top: 0px solid #D9D9D9;
}
</style>
