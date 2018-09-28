<template>
  <div>
    <group label-width="4em" label-margin-right="0.5em" label-align="left">
      <x-input title="姓名" required placeholder="必填" v-model="salesmanName"></x-input>
      <x-input title="手机号" required type="tel" placeholder="必填" is-type="china-mobile" ref="telphone" v-model="salesmanPhone"></x-input>
    </group>
    <x-button style="margin: 20px auto;width: 90%;display:block;" :text="text" type="primary" @click.native="save"></x-button>
  </div>
</template>

<script>
import { Group, Cell, XInput, XButton } from 'vux'
import api from '../api'
export default {
  components: {
    Group, Cell, XInput, XButton
  },
  data () {
    return {
      salesmanName: null,
      salesmanPhone: null,
      text: '',
      tag: false
    }
  },
  mounted () {
    if (this.$route.name === 'agentSalesmanEdit') {
      this.text = '修改并提交'
      this.tag = true
      api.querySalesmanByManage({salesmanId: this.$route.params.salesmanId}, (data) => {
        this.salesmanName = data.salesmanName
        this.salesmanPhone = data.salesmanPhone
      }, (er) => {})
    } else {
      this.text = '保存并提交'
      this.tag = false
    }
  },
  methods: {
    save () {
      if (!this.salesmanName) {
        this.tools.warnToast('请填写姓名', '150px')
        return
      }
      if (!this.salesmanPhone) {
        this.tools.warnToast('请填写手机号', '150px')
        return
      }
      if (!this.$refs.telphone.valid) {
        this.tools.warnToast('请填写合法手机号', '150px')
        return
      }
      if (this.tag) {
        this.changeMsg()
      } else {
        this.saveMsg()
      }
    },
    saveMsg () {
      api.addSalesman({salesmanName: this.salesmanName, salesmanPhone: this.salesmanPhone}, (data) => {
        this.tools.successToast('保存成功！')
        if (data.result) {
          this.$router.replace({name: 'agentSalesmanInfo', params: {salesmanId: data.result}})
        }
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message, '180px')
        } else {
          this.tools.warnToast('保存失败')
        }
      })
    },
    changeMsg () {
      api.editSalesman({salesmanId: this.$route.params.salesmanId, salesmanName: this.salesmanName, salesmanPhone: this.salesmanPhone}, (data) => {
        this.tools.successToast('修改成功')
        this.$router.go(-1)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message, '180px')
        } else {
          this.tools.warnToast('修改失败')
        }
      })
    }
  }
}
</script>

<style>

</style>
