<template>
  <div>
    <group>
      <cell style="color:#FF6D56;" :title="'当前可提现收益：¥ '+walletInfo.money.toFixed(2)"></cell>
      <cell :title="'历史总收益：¥ '+walletInfo.totalMoney.toFixed(2)"></cell>
      <cell :title="'历史已成功提现收益：¥ '+walletInfo.withdrawMoney.toFixed(2)"></cell>
    </group>
    <div style="text-align:right;margin-top:15px;margin-right:15px">
      <span style="color:#FF6D56" v-on:click="onShowDetail">收支明细</span>
    </div>
    <!--<tabbar v-transfer-dom style="position:fixed">
      <tabbar-item @on-item-click="$router.back()">
        <span slot="label" >返回</span>
      </tabbar-item>
      <tabbar-item @on-item-click="showDialogBox=true" style="background-color:#8ebf52">
        <span slot="label" style="color:#fff">提现</span>
      </tabbar-item>
    </tabbar>-->
    <detail-tabbar :actionLink="showTixian" :actions="actions" isHideMe=true></detail-tabbar>
    <x-dialog v-model="showDialogBox" hide-on-blur>
      <p style="background:#FBFBFB;text-align:left;padding:15px">提现到微信钱包（手续费1％）</p>
      <p style="text-align:left;padding-top:15px;padding-left:15px">提现金额</p>
      <div style="border-bottom:1px solid #ededed;margin-right:15px;margin-left:15px;">
        <strong style="left:15px;position:absolute;width:30px;font-size:22px;">
          ￥
        </strong>
        <div>
          <x-input ref="input" v-model="money" :is-type="isNumber" type="number" style="left:25px;font-size:26px;padding:0px!important;margin-right:20px" :show-clear="false" @on-change="onChange"></x-input>
        </div>
      </div>
      <div style="height:50px">
        <p style="left:15px;position:absolute;text-align:left;padding-top:5px">可提现收益 ￥{{walletInfo.money}}</p>
        <p style="left:150px;position:absolute;text-align:left;padding-top:5px;color:#A2D268" v-on:click="quanbu">全部提现</p>
      </div>
      <x-button type="primary" style="text-align:center;width:200px;margin-bottom:15px" :disabled="isDisabledButton" @click.native="tixian">提现</x-button>
    </x-dialog>
  </div>
</template>

<script>
  import {Group, Cell, Tabbar, TabbarItem, XDialog, XInput, XButton} from 'vux'
  import api from '@/feature/wallet/api'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  export default {
    components: {
      Group,
      Cell,
      Tabbar,
      TabbarItem,
      XDialog,
      XInput,
      XButton,
      DetailTabbar
    },
    data () {
      return {
        walletInfo: {money: 0, totalMoney: 0, withdrawMoney: 0},
        showDialogBox: false,
        isDisabledButton: true,
        money: '',
        actions: [{
          name: '提现',
          code: 'tixian'
        }],
        isNumber (value) {
          var valid = value === (value.match(/\d+(\.\d{0,2})?/) || [''])[0]
          return {
            valid,
            msg: '请输入正确的金额'
          }
        }
      }
    },
    mounted () {
      api.getWalletInfo((data) => {
        this.walletInfo = data
      }, () => {})
    },
    methods: {
      onShowDetail () {
        this.$router.push({name: 'walletDetail'})
      },
      onChange () {
        if (this.money === '' || parseFloat(this.money) === 0) {
          this.isDisabledButton = true
        } else if (this.$refs.input.valid === true && this.money <= this.walletInfo.money) {
          this.isDisabledButton = false
        } else {
          this.isDisabledButton = true
        }
      },
      showTixian () {
        this.showDialogBox = true
      },
      tixian () {
        this.showDialogBox = false
        this.tools.toast('提现功能暂未上线，敬请期待', '240px')
        // api.withdrawal({amount: this.money}, (data) => {
        //   this.showDialogBox = false
        //   this.tools.successToast('提现成功')
        // }, (data) => {
        //   this.showDialogBox = false
        //   if (data.toUser) {
        //     this.tools.warnToast(data.message, '170px')
        //   } else {
        //     this.tools.warnToast('提现失败')
        //   }
        // })
      },
      quanbu () {
        this.money = this.walletInfo.money
        this.onChange()
      }
    }
  }
</script>

<style>
div {
  -webkit-tap-highlight-color:rgba(0, 0, 0, 0)
}
</style>
