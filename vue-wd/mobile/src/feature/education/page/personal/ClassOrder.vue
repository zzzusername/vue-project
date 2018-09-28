<template>
  <div>
    <Group gutter="0" label-width="6em" label-margin-right="0.5em" label-align="left">
      <cell>
        <div slot="icon" class="school_list_img" :style="{'background-image':'url('+tools.cdn(userInfo.userIcon, 'logo.png')+')'}" src=""></div>
        <span style="display:inline-block;text-align:left !important;color:#000;font-size:16px;">{{userInfo.userName}}您好！欢迎使用智慧教育家校管理系统。请按以下提示创建您的班级：</span>
      </cell>
      <cell title="班级名称" :value="schoolInfo.className" value-align="left"></cell>
      <cell title="班级类型" :value="schoolInfo.schoolType" value-align="left"></cell>
      <cell title="所在学校名称" value-align="left" required placeholder="必填" :value="schoolInfo.schoolName"></cell>
      <cell title="申请人姓名" :value="schoolInfo.schoolPrincipal" value-align="left"></cell>
      <cell title="申请人电话" :value="schoolInfo.schoolPrincipalTelephone" value-align="left"></cell>
      <!-- <cell title="支付方式" value-align="left">
        <span slot="default">{{defaultPay | filterPay}}</span>
      </cell> -->
    </Group>
    <div>
      <p style="textAlign:center;padding: 10px 10px 5px;color:#CE3C39"><strong><span>申请成功</span>&nbsp;&nbsp;<span>等待审核中...</span></strong></p>
      <p style="padding: 10px 15px 0;">谨告：本系统专为学校和培训机构提供服务，其它类型用户切勿使用。</p>
    </div>
    <detail-tabbar :actionLink="created" :actions="actions" :isHideMe="true"></detail-tabbar><!--:backLink="{name: 'index'}"-->
    <div v-transfer-dom>
      <confirm v-model="showConfirm" title="提示" theme="ios" @on-confirm="onConfirm">
        <p style="text-align:center;color:rgb(255, 109, 86);">您确定取消本次申请吗？</p>
      </confirm>
    </div>
  </div>
</template>
<script>
  import { Confirm, Group, Cell, XInput, XDialog, TransferDomDirective as TransferDom } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import Qrcode from '@/components/Qrcode.vue'
  import { mapGetters } from 'vuex'
  import apiPersonal from '../../personalApi'
  import api from '../../api'
  export default{
    directives: {
      TransferDom
    },
    components: { Confirm, Qrcode, Group, Cell, XInput, DetailTabbar, XDialog },
    data () {
      return {
        schoolInfo: {
          className: null,
          schoolName: null,
          schoolType: null,
          schoolPrincipal: null,
          schoolPrincipalTelephone: null
        },
        actions: [
          {
            name: '取消申请',
            code: 'closeOrder',
            color: 'rgb(46, 132, 212)'
          },
          {
            name: '修改申请信息',
            code: 'creadClass'
          }
        ],
        defaultPay: false,
        showConfirm: false
      }
    },
    computed: {
      ...mapGetters({
        userInfo: 'userInfo'
      })
    },
    watch: {},
    mounted () {
      apiPersonal.personalNotopen((data) => {
        this.schoolInfo = data
      }, (er) => {})
    },
    methods: {
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
        if (code === 'closeOrder') {
          this.showConfirm = true
          return
        }
        if (code === 'creadClass') {
          this.$router.replace({name: 'educationAgainCreatedClass'})
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

