<template>
  <div>
    <group label-width="5em" label-margin-right="0.5em" label-align="left">
      <cell title="姓名" :value="salesManInfo.salesmanName" value-align="left"></cell>
      <cell title="手机号" :value="salesManInfo.salesmanPhone" value-align="left" @click.native="onCall(salesManInfo.salesmanPhone)"></cell>
      <cell title="绑定二维码" :value="text" value-align="left" is-link @click.native="showQrcode"></cell>
    </group>
    <div v-transfer-dom>
      <x-dialog v-model="showPopup" class="dialog-demo" hide-on-blur>
        <div class="img-style">
          <div style="width: 200px; height: 200px;margin: auto;">
            <qrcode v-if="showPopup" ref="iqr" :value="url" :size="200" ></qrcode>
          </div>
          <p style="text-align: center;margin-top: 2vw;">
            <span style="font-size:18px;">请扫码绑定微信！</span>
          </p>
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
import { Group, Cell, XDialog, TransferDomDirective as TransferDom } from 'vux'
import Qrcode from '@/components/Qrcode.vue'
import api from '../api'
export default {
  directives: {
    TransferDom
  },
  components: {
    Group, Cell, XDialog, Qrcode
  },
  data () {
    return {
      salesManInfo: {},
      text: '',
      upon: false,
      showPopup: false,
      showAlert: false,
      url: ''
    }
  },
  mounted () {
    api.querySalesmanByManage({salesmanId: this.$route.params.salesmanId}, (data) => {
      this.salesManInfo = data
      console.log(this.salesManInfo)
      if (this.salesManInfo.userId !== null && this.salesManInfo.userId !== undefined) {
        this.text = '已绑定'
        this.upon = false
      } else {
        this.text = '点击绑定'
        this.upon = true
      }
    }, (er) => {})
  },
  methods: {
    showQrcode () {
      if (this.upon) {
        api.getSalesmanBindingCode({salesmanId: this.$route.params.salesmanId}, (data) => {
          var index = location.href.indexOf('#')
          this.url = location.href.substring(0, index + 1) + '/agent/salesman/binding_page/salesman/' + data.salesmanId + '/code/' + data.bindingCode
          this.showPopup = true
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.tools.warnToast(er.message, '180px')
          } else {
            this.tools.warnToast('获取失败')
          }
        })
      } else {
        this.tools.warnToast('该业务员已绑定微信', '160px')
      }
    },
    onCall (salesmanPhone) {
      window.location.href = 'tel://' + salesmanPhone
    }
  }
}
</script>

<style>
.img-style{
  padding:20px 20px 20px 20px;
}
.img-style img{
  display: inline-block !important;
  width:100% !important;
}
</style>
