<template>
  <div v-if="isSllowCreate == true">
    <Group gutter="0" label-width="5em" label-margin-right="0.5em" label-align="left">
      <cell>
        <div slot="icon" class="school_list_img" :style="{'background-image':'url('+tools.cdn(userInfo.userIcon, 'head.png', 128)+')'}" src=""></div>
        <span style="display:inline-block;text-align:left !important;color:#000;font-size:16px;">{{userInfo.userName}}您好！欢迎使用校和家。请按以下提示创建您的机构：</span>
      </cell>
      <x-input type="text" title="学校名称" required placeholder="必填" v-model="schoolInfo.schoolName"></x-input>
      <selector title="学校类型" :options="natureList" v-model="schoolInfo.schoolType"></selector>
      <x-address title="所在城市" v-model="addressValue" raw-value :list="addressData" value-text-align="left" placeholder="必选"></x-address>
      <x-textarea title="学校地址" required autosize :rows='1' placeholder="必填" v-model="schoolInfo.schoolAddress"></x-textarea>
      <!-- <selector title="学校规模" :options="costList" v-model="PayPackage" @on-change="changeCost" placeholder="请选择学校规模"></selector> -->
      <!-- <cell title="支付方式" value-align="left">
        <span slot="default">{{defaultPay | filterPay}}</span>
      </cell> -->
      <x-input type="text" title="申请人姓名" required placeholder="必填" v-model="schoolInfo.schoolPrincipal"></x-input>
      <x-input ref="schoolPrincipalTelephone" type="tel" title="申请人电话" required placeholder="请输入手机号" v-model="schoolInfo.schoolPrincipalTelephone"></x-input>
      <cell title="短信验证码">
        <x-input slot="value" placeholder="必填" type="number" style="position: absolute;left:5.5em;padding-top:0px;padding-bottom:0px;width:130px;top:10px;color:#222" v-model="schoolInfo.verificationCode" required></x-input>
        <button v-if="isShowCountDown == false" style="width:70px;height:30px;position: absolute;right:5px;top:7px; background:#A2D268;color:#fff;border:0px;font-size:13px" @click="getVerificationCode">获取验证码</button>
        <button v-else style="width:70px;height:30px;position: absolute;right:5px;top:7px; background:#d2d2d2;color:#fff;border:0px;font-size:13px">{{countdownText}}</button>
      </cell>
    </Group>
    <p style="textAlign:center;padding: 10px 10px 5px;color:#CE3C39"><strong><span>免费申请使用</span></strong></p>
    <p style="padding: 10px 15px 0;">谨告：本系统专为学校和培训机构提供服务，其它类型用户切勿使用。</p>
    <detail-tabbar :actionLink="saveMessage" :actions="actions" :isHideMe="true"></detail-tabbar>
  </div>
</template>
<script>
  import { Group, Cell, XInput, Selector, XTextarea, XAddress, ChinaAddressV3Data, Value2nameFilter as value2name } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import { mapGetters } from 'vuex'
  import api from '../api'
  export default{
    components: { Group, Cell, XInput, DetailTabbar, Selector, XTextarea, XAddress },
    data () {
      return {
        isShowCountDown: false,
        countdown: 60,
        countdownText: '',
        showWx: false,
        isSllowCreate: false,
        actions: [
          {
            name: '立即申请',
            code: 'pay'
          }
        ],
        natureList: ['幼儿园', '小学', '初中学校', '九年制学校（1-9年级）', '高中学校', '完全中学（含初高中）', '十二年一贯制学校', '婴幼儿培训机构', '中小学生培训机构', '职业教育培训机构', '其它教育培训机构'],
        showPopup: true,
        packjsonList: [
          {
            'expiryDate': 1598803200000,
            'id': 3,
            'isWxPay': false,
            'orgNum': 100,
            'price': 10
          }
        ],
        costList: [],
        defaultPay: null,       // 显示支付
        schoolInfo: {
          schoolName: null,     // 学校名字
          schoolAddress: null,    // 学校地址
          schoolPrincipal: null,  // 申请人姓名
          schoolPrincipalTelephone: null,  // 申请人手机号
          payPackageId: null,      // 学校年费
          schoolType: null,        // 学校性质
          verificationCode: null,    // 手机验证码
          schoolProvince: null, // 省
          schoolCity: null,  // 市
          schoolCounty: null  // 区县
        },
        addressValue: [],
        addressData: ChinaAddressV3Data,
        PayPackage: '5'          // 购买年费包ID
      }
    },
    watch: {
      defaultPay: {
        handler: function (defaultPay, olddefaultPay) {
          if (!defaultPay) {
            this.actions = [
              {
                name: '立即申请',
                code: 'turnAccount'
              }
            ]
          } else {
            this.actions = [
              {
                name: '保存并支付',
                code: 'pay'
              }
            ]
          }
        }
      }
    },
    computed: {
      ...mapGetters({
        userInfo: 'userInfo'
      })
    },
    mounted () {
      if (this.$route.params.schoolId) {
        this.isSllowCreate = true
        api.getSchoolInfo({schoolId: this.$route.params.schoolId}, (data) => {
          this.queryPackage(data)
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.tools.warnToast(er.message)
          }
        })
      } else {
        // 判断是否有待审核的学校，如果有跳转到订单页面，如果没有走创建学校页面
        api.getNoOpenSchool((data) => {
          if (data !== null && !this.tools.isNull(data.schoolId)) {
            // 有未审核的学校
            this.$router.replace({name: 'educationSchoolOrder', params: {schoolId: data.schoolId, isRenew: 'noRenew'}})
          } else {
            this.isSllowCreate = true
            this.queryPackage()
          }
        }, () => {
          this.isSllowCreate = true
          this.queryPackage()
        })
      }
    },
    methods: {
      getVerificationCode () {
        if (this.tools.isNull(this.schoolInfo.schoolPrincipalTelephone) || this.$refs.schoolPrincipalTelephone.valid === false) {
          this.tools.warnToast('请输入正确的手机号', '170px')
          return
        }
        api.sendCreateSchoolVerificationCode({userPhone: this.schoolInfo.schoolPrincipalTelephone}, (data) => {
          this.tools.toast('短信已发送')
          this.settime()
        }, (err) => {
          if (err.toUser) {
            this.tools.warnToast(err.message, '180px')
          } else {
            this.tools.warnToast('短信发送失败')
          }
        })
      },
      queryPackage (info) {
        api.queryPackage({isRenew: null}, (data) => {
          var costArr = []
          data.forEach((element) => {
            // var textYear
            // var textMonth
            // if (element.isExperience) {
            //   element.orgNum = 10
            //   element.price = 0
            //   textYear = '/' + '15天(体验)'
            //   textMonth = ''
            // } else {
            //   if (parseInt(element.packageMonth / 12) !== 0) {
            //     textYear = '/' + parseInt(element.packageMonth / 12) + '年'
            //   } else {
            //     textYear = ''
            //   }
            //   if (element.packageMonth % 12 !== 0) {
            //     textMonth = '/' + element.packageMonth % 12 + '月'
            //   } else {
            //     textMonth = ''
            //   }
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
          if (info !== undefined && info !== null) {
            this.schoolInfo = info
            this.addressValue = [info.schoolProvince, info.schoolCity, info.schoolCounty]
          }
          if (this.schoolInfo.schoolPayPackageId !== undefined && this.schoolInfo.schoolPayPackageId !== null) {
            this.PayPackage = this.schoolInfo.schoolPayPackageId  // 修改年费
          }
        }, (er) => {})
      },
      saveMessage (code) {
        var addrList = value2name(this.addressValue, ChinaAddressV3Data).split(' ')
        if (!this.tools.isNull(addrList) && addrList.length === 3) {
          this.schoolInfo.schoolProvince = addrList[0]
          this.schoolInfo.schoolCity = addrList[1]
          this.schoolInfo.schoolCounty = addrList[2]
        } else {
          this.tools.warnToast('请选择所在城市')
          return
        }
        if (this.schoolInfo.schoolName && this.schoolInfo.schoolAddress && this.schoolInfo.schoolPrincipal && this.schoolInfo.schoolPrincipalTelephone && this.schoolInfo.schoolType && this.PayPackage && this.schoolInfo.verificationCode) {
          var obj = this.schoolInfo
          obj.payPackageId = this.PayPackage
          api.addSchool({schoolInfo: obj}, (data) => {
            this.$router.replace({name: 'educationSchoolOrder', params: {schoolId: data.schoolId, isRenew: 'noRenew'}})
            // if (data.orderId) {
            //   if (code === 'pay') {
            //     this.tools.setPaySuccessLink({name: 'educationManageSchool', params: { orgId: this.$route.params.orgId, schoolId: data.schoolId }})
            //     this.$router.replace({name: 'payIndex', params: { orderId: data.orderId }})
            //   }
            // } else {
            //   if (code === 'pay') {
            //     this.$router.replace({name: 'educationSchoolOrder', params: {schoolId: data.schoolId, isRenew: 'noRenew'}})
            //   }
            //   if (code === 'turnAccount') {
            //     this.$router.replace({name: 'educationSchoolOrder', params: {schoolId: data.schoolId, isRenew: 'noRenew'}})
            //   }
            // }
            // 缓存创建学校的id 引导帮助使用
            this.localStorage.setHelpProgressForSchoolMaster(data.schoolId, 1)
          }, (er) => {
            if (er.toUser !== undefined && er.toUser) {
              this.tools.warnToast(er.message, '200px')
            } else {
              this.tools.warnToast('创建失败')
            }
          })
        } else {
          this.tools.warnToast('请完善资料')
        }
      },
      changeCost () {
        for (var i = 0; i < this.costList.length; i++) {
          if (this.costList[i].key === this.PayPackage) {
            this.defaultPay = this.costList[i].isWxPay
          }
        }
      },
      settime () {
        if (this.countdown === 0) {
          this.isShowCountDown = false
          this.countdown = 60
          return
        } else {
          this.isShowCountDown = true
          this.countdown --
          this.countdownText = this.countdown + 's'
        }
        setTimeout(() => {
          this.settime()
        }, 1000)
      }
    },
    filters: {
      filterPay: function (val) {
        if (val !== null && val !== undefined) {
          if (!val) {
            return '线下转账'
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
</style>

