<template>
  <div>
    <group label-width="5em" label-margin-right="0.5em" label-align="left">
      <x-input title="公司名称" placeholder="必填" v-model="info.agentName" required></x-input>
      <x-input title="公司地址" placeholder="必填" v-model="info.agentAddress" required></x-input>
      <x-input title="代理城市" placeholder="必填" v-model="info.agentCity" required></x-input>
      <x-input title="联系人" placeholder="必填" v-model="info.agentLink" required></x-input>
      <x-input ref="agentLinkPhone" title="联系手机号" placeholder="必填" v-model="info.agentLinkPhone" required keyboard="number" is-type="china-mobile"></x-input>
      <cell title="短信验证码">
        <x-input slot="value" placeholder="必填" style="position: absolute;left:5.5em;padding-top:0px;padding-bottom:0px;width:130px;top:10px" v-model="info.verificationCode" required></x-input>
        <button v-if="isShowCountDown == false" style="width:70px;height:30px;position: absolute;right:5px;top:7px; background:#A2D268;color:#fff;border:0px;font-size:13px" @click="getVerificationCode">获取验证码</button>
        <button v-else style="width:70px;height:30px;position: absolute;right:5px;top:7px; background:#d2d2d2;color:#fff;border:0px;font-size:13px">{{countdownText}}</button>
      </cell>
      
      <x-textarea title="备注" placeholder="选填" :rows="4" v-model="info.agentRemark"></x-textarea>
    </group>
    <x-button style="margin: 20px auto;width: 90%;display:block;" text="申请成为代理商" type="primary" @click.native="apply"></x-button>
  </div>
</template>

<script>
import { Group, Cell, XInput, XButton, XTextarea } from 'vux'
import api from '../api'
export default {
  components: {
    Group, Cell, XInput, XButton, XTextarea
  },
  data () {
    return {
      isShowCountDown: false,
      countdown: 60,
      countdownText: '',
      info: {
        agentName: null,
        agentLink: null,
        agentLinkPhone: null,
        agentAddress: null,
        agentCity: null,
        agentRemark: null,
        verificationCode: null
      }
    }
  },
  methods: {
    apply () {
      for (var key in this.info) {
        if (key !== 'agentRemark' && this.tools.isNull(this.info[key])) {
          this.tools.warnToast('请完善必填项')
          return
        }
      }
      api.addAgent(this.info, (data) => {
        this.tools.successToast('申请成功，请等待审核', '180px')
        this.$router.replace({name: 'agentDispatch'})
      }, (err) => {
        if (err.toUser) {
          this.tools.warnToast(err.message, '180px')
        } else {
          this.tools.warnToast('申请失败')
        }
      })
    },
    getVerificationCode () {
      if (this.tools.isNull(this.info.agentLinkPhone) || this.$refs.agentLinkPhone.valid === false) {
        this.tools.warnToast('请输入正确的手机号', '170px')
        return
      }
      api.getVerificationCode({userPhone: this.info.agentLinkPhone}, (data) => {
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

</style>
