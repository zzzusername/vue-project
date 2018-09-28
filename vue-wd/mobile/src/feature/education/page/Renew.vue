<template>
  <div>
    <Group gutter="0" label-width="5em" label-margin-right="0.5em" label-align="left">
      <cell>
        <div slot="icon" class="renew_list_img" :style="{'background-image':'url('+tools.cdn(userInfo.userIcon, 'logo.png')+')'}" src=""></div>
        <span style="display:inline-block;text-align:left !important;color:#000;font-size:16px;">{{userInfo.userName}}您好！欢迎使用智慧教育家校管理系统。请按以下提示对您的机构续费：</span>
      </cell>
      <cell title="学校名称" :value="schoolInfo.schoolName" value-align="left"></cell>
      <cell title="学校性质" :value="schoolInfo.schoolType" value-align="left"></cell>
      <cell title="学校地址" :value="schoolInfo.schoolAddress" value-align="left"></cell>
      <cell title="学校联系人" :value="schoolInfo.schoolPrincipal" value-align="left"></cell>
      <cell title="联系人电话" :value="schoolInfo.schoolTelephone" value-align="left"></cell>
      <cell title="学校地址" :value="schoolInfo.schoolAddress" value-align="left"></cell>
      <cell title="学校简介" :value="schoolInfo.schoolDesc" value-align="left"></cell>
      <!-- <selector title="学校规模" :options="costList" v-model="PayPackage" @on-change="changeCost" placeholder="请选择学校规模"></selector> -->
      <!-- <cell title="支付方式" value-align="left">
        <span slot="default">{{defaultPay | filterPay}}</span>
      </cell> -->
    </Group>
    <detail-tabbar :actionLink="saveMessage" :actions="actions" :isHideMe="true"></detail-tabbar>
  </div>
</template>
<script>
  import {PopupPicker, Selector, Group, Cell} from 'vux'
  import { mapGetters } from 'vuex'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import api from '../api'
  export default{
    components: {PopupPicker, Selector, Group, Cell, DetailTabbar},
    data () {
      return {
        schoolInfo: {
          schoolName: null,
          schoolType: null,
          schoolAddress: null,
          schoolPrincipal: null,
          schoolTelephone: null
        },
        defaultPay: null,       // 显示支付
        costList: [],
        PayPackage: '5',          // 购买年费包ID
        actions: [
          {
            name: '续费并支付',
            code: 'pay'
          }
        ]
      }
    },
    computed: {
      ...mapGetters({
        userInfo: 'userInfo'
      })
    },
    watch: {
      defaultPay: {
        handler: function (defaultPay, olddefaultPay) {
          if (!defaultPay) {
            this.actions = [
              {
                name: '续费并转账',
                code: 'turnAccount'
              }
            ]
          } else {
            this.actions = [
              {
                name: '续费并支付',
                code: 'pay'
              }
            ]
          }
        }
      }
    },
    mounted () {
      api.queryPackage({isRenew: 'isRenew'}, (data) => {
        var costArr = []
        data.forEach((element) => {
          // var year = parseInt(element.packageMonth / 12)
          // var month = element.packageMonth % 12
          // var textYear
          // var textMonth
          // if (parseInt(element.packageMonth / 12) !== 0) {
          //   textYear = '/' + parseInt(element.packageMonth / 12) + '年'
          // } else {
          //   textYear = ''
          // }
          // if (element.packageMonth % 12 !== 0) {
          //   textMonth = '/' + element.packageMonth % 12 + '月'
          // } else {
          //   textMonth = ''
          // }
          var item = {
            key: element.id,
            value: element.orgNum + '个群',
            // value: element.orgNum + '个群：' + element.price + '元' + textYear + textMonth,
            isWxPay: element.isWxPay
          }
          costArr.push(item)
        })
        this.costList = costArr
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
      api.getSchoolInfo({schoolId: this.$route.params.schoolId}, (data) => {
        this.schoolInfo = data
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    methods: {
      changeCost () {
        for (var i = 0; i < this.costList.length; i++) {
          if (this.costList[i].key === this.PayPackage) {
            this.defaultPay = this.costList[i].isWxPay
          }
        }
      },
      saveMessage(code) {
        // if (this.PayPackage === null || this.PayPackage === undefined || this.PayPackage === '') {
        //   this.tools.warnToast('请选择学校规模')
        //   return
        // }
        if (code === 'pay') {
          this.payMethod((data) => {
            this.$router.replace({name: 'payIndex', params: { orderId: data.orderId }})
          })
        }
        if (code === 'turnAccount') {
          this.payMethod((data) => {
            this.$router.replace({name: 'educationSchoolOrder', params: {schoolId: this.$route.params.schoolId, isRenew: 'isRenew'}})
          })
        }
      },
      payMethod(callback) {
        api.schoolRenew({schoolId: this.$route.params.schoolId, payPackageId: this.PayPackage, callback}, (data) => {
          callback(data)
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.tools.warnToast(er.message, '180px')
          } else {
            this.tools.warnToast('支付失败')
          }
        })
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
.renew_list_img {
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
</style>

