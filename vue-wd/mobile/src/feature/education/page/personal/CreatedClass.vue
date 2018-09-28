<template>
  <div v-if="isSllowCreate == true">
    <Group gutter="0" label-width="6em" label-margin-right="0.5em" label-align="left">
      <cell>
        <div slot="icon" class="class_list_img" :style="{'background-image':'url('+tools.cdn(userInfo.userIcon, 'head.png', 128)+')'}" src=""></div>
        <span style="display:inline-block;text-align:left !important;color:#000;font-size:16px;">{{userInfo.userName}}您好！欢迎使用校和家。请按以下提示创建您的班级：</span>
      </cell>
      <x-input type="text" title="班级名称" required placeholder="必填" v-model="schoolInfo.className"></x-input>
      <selector title="班级类型" :options="natureList" v-model="schoolInfo.schoolType"></selector>
      <x-address title="所在城市" v-model="addressValue" raw-value :list="addressData" value-text-align="left" placeholder="必选"></x-address>
      <x-input type="text" title="所在学校名称" value-align="left" required placeholder="必填" v-model="schoolInfo.schoolName"></x-input>
      <x-input type="text" title="申请人姓名" required placeholder="必填" v-model="schoolInfo.schoolPrincipal"></x-input>
      <x-input ref="schoolPrincipalTelephone" type="tel" title="申请人电话" required placeholder="请输入手机号" v-model="schoolInfo.schoolPrincipalTelephone"></x-input>
      <cell title="短信验证码">
        <x-input slot="value" placeholder="必填" type="number" style="position: absolute;left:6.5em;padding-top:0px;padding-bottom:0px;width:130px;top:10px;color:#222" v-model="schoolInfo.verificationCode" required></x-input>
        <button v-if="isShowCountDown == false" style="width:70px;height:30px;position: absolute;right:5px;top:7px; background:#A2D268;color:#fff;border:0px;font-size:13px" @click="getVerificationCode">获取验证码</button>
        <button v-else style="width:70px;height:30px;position: absolute;right:5px;top:7px; background:#d2d2d2;color:#fff;border:0px;font-size:13px">{{countdownText}}</button>
      </cell>
    </Group>
    <p style="textAlign:center;padding: 10px 10px 5px;color:#CE3C39"><strong>永久免费</strong></p>
    <p style="padding: 10px 15px 0;">谨告：本系统专为学校和培训机构提供服务，其它类型用户切勿使用。</p>
    <detail-tabbar :actionLink="saveMessage" :actions="actions" :isHideMe="true"></detail-tabbar>
  </div>
</template>
<script>
  import { Group, Cell, XInput, Selector, XTextarea, XAddress, ChinaAddressV3Data, Value2nameFilter as value2name } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import { mapGetters } from 'vuex'
  import api from '../../api'
  import apiPersonal from '../../personalApi'
  export default {
    components: { Group, Cell, XInput, DetailTabbar, Selector, XTextarea, XAddress },
    data () {
      return {
        actions: [
          {
            name: '立即申请',
            code: 'pay'
          }
        ],
        natureList: ['幼儿园', '小学', '初中学校', '九年制学校（1-9年级）', '高中学校', '完全中学（含初高中）', '十二年一贯制学校', '婴幼儿培训机构', '中小学生培训机构', '职业教育培训机构', '其它教育培训机构'],
        schoolInfo: {
          schoolName: null,                // 学校名字
          schoolPrincipal: null,           // 申请人姓名
          schoolPrincipalTelephone: null,  // 申请人手机号
          schoolType: null,                // 学校类型
          verificationCode: null,          // 手机验证码
          className: null                  // 班级名称
        },
        isShowCountDown: false,
        countdownText: '',
        countdown: 60,
        isSllowCreate: false,
        addressValue: [],
        addressData: ChinaAddressV3Data
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
        apiPersonal.personalInfo({schoolId: this.$route.params.schoolId}, (data) => {
          this.schoolInfo = data
          this.addressValue = [data.schoolProvince, data.schoolCity, data.schoolCounty]
        }, (er) => {
          if (er.toUser && er.toUser !== undefined) {
            this.tools.warnToast(er.message)
          }
        })
      } else {
        // 判断是否有待审核的班级，如果有跳转到订单页面，如果没有走创建班级页面
        apiPersonal.personalNotopen((data) => {
          if (data !== null && !this.tools.isNull(data.schoolId)) {
            // 有未审核的学校
            this.$router.replace({name: 'educationClassOrder', params: {schoolId: data.schoolId}})
          } else {
            this.isSllowCreate = true
          }
        }, () => {
          this.isSllowCreate = true
        })
      }
    },
    methods: {
      saveMessage () {
        if (this.schoolInfo.className === null || this.schoolInfo.className === undefined || this.schoolInfo.className === '') {
          this.tools.warnToast('请填写班级名称', '160px')
          return
        }
        if (this.schoolInfo.schoolType === null || this.schoolInfo.schoolType === undefined || this.schoolInfo.schoolType === '') {
          this.tools.warnToast('请填写班级类型', '160px')
          return
        }
        var addrList = value2name(this.addressValue, ChinaAddressV3Data).split(' ')
        if (!this.tools.isNull(addrList) && addrList.length === 3) {
          this.schoolInfo.schoolProvince = addrList[0]
          this.schoolInfo.schoolCity = addrList[1]
          this.schoolInfo.schoolCounty = addrList[2]
        } else {
          this.tools.warnToast('请选择所在城市')
          return
        }
        if (this.schoolInfo.schoolName === null || this.schoolInfo.schoolName === undefined || this.schoolInfo.schoolName === '') {
          this.tools.warnToast('请填写班级所在学校名称', '190px')
          return
        }
        if (this.schoolInfo.schoolPrincipal === null || this.schoolInfo.schoolPrincipal === undefined || this.schoolInfo.schoolPrincipal === '') {
          this.tools.warnToast('请填写申请人姓名', '160px')
          return
        }
        if (this.schoolInfo.schoolPrincipalTelephone === null || this.schoolInfo.schoolPrincipalTelephone === undefined || this.schoolInfo.schoolPrincipalTelephone === '') {
          this.tools.warnToast('请填写申请人电话', '160px')
          return
        }
        if (this.schoolInfo.verificationCode === null || this.schoolInfo.verificationCode === undefined || this.schoolInfo.verificationCode === '') {
          this.tools.warnToast('请填写短信验证码', '160px')
          return
        }
        apiPersonal.addPersonal({schoolId: this.$route.params.schoolId, inviteUserId: this.$route.params.inviteUserId, data: this.schoolInfo, type: 'add'}, (data) => {
          this.tools.successToast('提交成功')
          this.$router.push({name: 'educationClassOrder', params: {schoolId: this.$route.params.schoolId !== undefined && this.$route.params.schoolId !== null ? this.$route.params.schoolId : data.schoolId}})
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.tools.warnToast(er.message, '200px')
          } else {
            this.tools.warnToast('创建失败')
          }
        })
      },
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
    }
  }
</script>
<style>
.class_list_img {
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

