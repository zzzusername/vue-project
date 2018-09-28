<template>
  <div>
    <Group gutter="0" label-width="6em" label-margin-right="0.5em" label-align="left">
      <cell>
        <div slot="icon" class="school_list_img" :style="{'background-image':'url('+tools.cdn(userInfo.userIcon, 'logo.png')+')'}" src=""></div>
        <span style="display:inline-block;text-align:left !important;color:#000;font-size:16px;">{{userInfo.userName}}您好！欢迎使用智慧教育家校管理系统。请按以下提示<i style="font-style: normal;">{{propText}}</i>：</span>
      </cell>
      <cell title="学校名称" :value="schoolInfo.schoolName" value-align="left"></cell>
      <cell title="学校类型" :value="schoolInfo.schoolType" value-align="left"></cell>
      <cell title="学校地址" :value="schoolInfo.schoolAddress" value-align="left"></cell>
      <cell title="申请人姓名" :value="schoolInfo.schoolPrincipal" value-align="left"></cell>
      <cell title="申请人电话" :value="schoolInfo.schoolPrincipalTelephone" value-align="left"></cell>
      <!-- <cell title="学校规模" :value="schoolInfo.payPack" value-align="left"></cell> -->
      <!-- <cell title="支付方式" :value="schoolInfo.schoolPayType === 2 ? '在线转账' : '微信支付'" value-align="left"></cell> -->
      <!-- <cell title="支付方式" value-align="left">
        <span slot="default">{{defaultPay | filterPay}}</span>
      </cell> -->
    </Group>
    <!-- <Group v-if="showWx" title="添加微信" label-width="6em" label-margin-right="0.5em" label-align="left">
      <cell title="客服微信号" value-align="left">
        <span slot="default" style="color:rgb(255, 109, 86);">laozhao513</span>
      </cell>
    </Group> -->
    <div v-show="$route.params.isRenew=='noRenew'">
      <p style="textAlign:center;padding: 10px 10px 5px;color:#CE3C39"><strong><span>申请成功</span>&nbsp;&nbsp;<span>等待审核中...</span></strong></p>
      <p style="padding: 10px 15px 0;">谨告：本系统专为学校和培训机构提供服务，其它类型用户切勿使用。</p>
    </div>
    <detail-tabbar :actionLink="created" :actions="actions" :isHideMe="true" :backLink="{name: 'index'}"></detail-tabbar>
    <!-- <div v-transfer-dom>
      <x-dialog v-model="showConfirm" class="dialog-demo" hide-on-blur>
        <div class="img-style">
          <div style="width: 200px; height: 200px;margin: auto;">
            <qrcode ref="iqr" src="http://img1.sq3q.com/robot/chatUserIcon/b5e781e5f90a1853d56089021394acc0" value="https://u.wechat.com/ECWJJggXZwlqx0xu48UZKls" :size="200" ></qrcode>
          </div>
          <p slot="default" style="text-align:center;margin-top:10px;"><span>请长按扫码添加客服微信</span></br><span>完成支付并开通！</span></p>
        </div>
      </x-dialog>
    </div> -->
    <div v-transfer-dom>
      <confirm v-model="showConfirm" title="提示" theme="ios" @on-confirm="onConfirm">
        <p style="text-align:center;color:rgb(255, 109, 86);">您确定取消此本次申请吗？</p>
      </confirm>
    </div>
  </div>
</template>
<script>
  import { Confirm, Group, Cell, XInput, XDialog, TransferDomDirective as TransferDom } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import Qrcode from '@/components/Qrcode.vue'
  import { mapGetters } from 'vuex'
  import api from '../api'
  export default{
    directives: {
      TransferDom
    },
    components: { Confirm, Qrcode, Group, Cell, XInput, DetailTabbar, XDialog },
    data () {
      return {
        showWx: false,
        // showConfirm: false,
        schoolInfo: {
          schoolName: null,
          schoolType: null,
          schoolAddress: null,
          schoolPrincipal: null,
          schoolTelephone: null
        },
        costList: [],
        actions: [],
        defaultPay: null,
        propText: '',
        showConfirm: false
      }
    },
    computed: {
      ...mapGetters({
        userInfo: 'userInfo'
      })
    },
    watch: {
      defaultPay: {
        handler: function(defaultPay, olddefaultPay) {
          if (this.$route.params.isRenew !== 'isRenew') {
            if (!defaultPay) {
              // this.showConfirm = true
              this.actions = [
                {
                  name: '取消申请',
                  code: 'closeOrder',
                  color: 'rgb(46, 132, 212)'
                },
                {
                  name: '修改申请信息',
                  code: 'creadSchool'
                }
              ]
            } else {
              this.actions = [
                {
                  name: '开通学校',
                  code: 'wxpay'
                }
              ]
            }
          } else {
            // this.showConfirm = true
            this.actions = [
              {
                name: '重新选择续费',
                code: 'againRenew'
              }
            ]
          }
        }
      }
    },
    mounted () {
      if (this.$route.params.isRenew !== 'isRenew') {
        this.propText = '创建您的机构'
      } else {
        this.propText = '对您的机构续费'
      }
      api.getSchoolInfo({schoolId: this.$route.params.schoolId}, (data) => {
        this.getPayageId(data)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    methods: {
      getPayageId (obj) {
        api.queryPackage({isRenew: this.$route.params.isRenew}, (data) => {
          for (var i = 0; i < data.length; i++) {
            if (data[i].id === obj.schoolPayPackageId) {
              // var textYear
              // var textMonth
              // if (data[i].isExperience) {
              //   data[i].orgNum = 10
              //   data[i].price = 0
              //   textYear = '/' + '15天(体验)'
              //   textMonth = ''
              // } else {
              //   if (parseInt(data[i].packageMonth / 12) !== 0) {
              //     textYear = '/' + parseInt(data[i].packageMonth / 12) + '年'
              //   } else {
              //     textYear = ''
              //   }
              //   if (data[i].packageMonth % 12 !== 0) {
              //     textMonth = '/' + data[i].packageMonth % 12 + '/月'
              //   } else {
              //     textMonth = ''
              //   }
              // }
              obj.payPack = data[i].orgNum + '个群'
              this.defaultPay = data[i].isWxPay
              break
            }
          }
          this.schoolInfo = obj
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.tools.warnToast(er.message)
          }
        })
      },
      choose (data) {
        this.costList.forEach((el) => {
          if (el.id === data) {
            return el.value
          }
        })
      },
      onConfirm () {
        api.cancelOrder({schoolId: this.$route.params.schoolId}, (data) => {
          this.tools.successToast('取消订单成功')
          this.$router.replace({name: 'educationSchoolList'})
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.tools.warnToast(er.message)
          } else {
            this.tools.warnToast('取消订单失败')
          }
        })
      },
      created (code) {
        if (this.$route.params.isRenew !== 'isRenew') {
          if (code === 'wxpay') {
            this.$router.replace({name: 'educationAgainCreateSchool'})
          } else if (code === 'creadSchool') {
            this.$router.replace({name: 'educationAgainCreateSchool'})
          } else if (code === 'closeOrder') {
            this.showConfirm = true
          }
        } else {
          this.$router.replace({name: 'educationRenew'})
        }
      }
    },
    filters: {
      filterPay: function (val) {
        if (val !== null && val !== undefined) {
          if (!val) {
            return '在线转账'
          } else {
            return '微信支付'
          }
        } else {
          return '无'
        }
      }
    }
  }
</script>
<style>
.school_list_img {
  width: 16vw;
  height:16vw;
  display: inline-block;
  border-radius: 6px;
  margin-right: 10px;
  background-position: center center;
  background-size: cover;
  border-style:none;
  border-width:0;
  vertical-align:middle;
}
.weui-cell__ft{
  text-align: left !important;
}
.img-style{
  padding:20px 20px 20px 20px;
}
.img-style img{
  display: inline-block !important;
  width:100% !important;
}
</style>

