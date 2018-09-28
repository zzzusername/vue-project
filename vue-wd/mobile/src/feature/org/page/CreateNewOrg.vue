<template>
  <div style="paddingLeft:5px;paddingRight:5px;">
    <p style="fontSize: 16px;">创建属于您的班级只要下面的三步^_^</p>
    <ol>
      <li style="marginTop: 10px">
        <p style="fontSize: 16px;">一、长按识别下面的二维码，然后添加为好友</p>
        <div style="text-align:center">
          <qrcode ref="iqr" :value="createOrgQrcode" :size="200" ></qrcode>
        </div>
        <p style="paddingLeft: 15px;fontSize: 14px;color: red">注：加为好友后，请不要和助手闲聊，以免妨碍其正常工作。</p>
      </li>
      <li style="marginTop: 10px">
        <p style="fontSize: 16px;">二、将该好友拉进您准备开通的班级管理的目标微信群</p>
        <p style="paddingLeft: 15px;fontSize: 14px;color: red;marginTop: 10px;">注：该微信好友入群后会给您发送其成功入群的信息，和开通该群的链接</p>
      </li>
      <li style="marginTop: 10px">
        <p style="fontSize: 16px;">三、点击该好友发给您的链接打开页面，使用已有授权或者付费完成开通。</p>
      </li>
    </ol>
    <p  style="marginTop: 15px;fontSize: 16px;color: red">注：开通后，请将该微信用户保留在您的微信群中，他将协助您一起管理社群</p>
    <detail-tabbar v-if="isShowTabbar"></detail-tabbar>
  </div>
</template>

<script>
  import { Cell } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import Qrcode from '@/components/Qrcode.vue'
  import api from '@/feature/org/api'
  export default {
    components: {
      Cell, DetailTabbar, Qrcode
    },
    data () {
      return {
        createOrgQrcode: '',
        isShowTabbar: false
      }
    },
    mounted () {
      var orgId = this.$route.params.orgId
      if (orgId !== undefined && orgId !== null && orgId !== '0') {
        this.isShowTabbar = true
      } else {
        this.isShowTabbar = false
      }
      api.getRobotQr({salesmanId: this.$route.params.salesmanId}, robotQr => {
        if (robotQr.qrPath !== null) {
          this.createOrgQrcode = robotQr.qrcode
        }
      }, () => {})
    }
  }
</script>

<style>
  .create_new_org_qrcode{
    display: block;
    width: 160px;
    margin: 10px auto;
  }
</style>
