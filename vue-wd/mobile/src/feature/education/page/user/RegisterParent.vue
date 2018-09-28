<template>
  <div>
    <group title="基本信息" label-width="5em" label-margin-right="0.5em" label-align="left">
      <x-input type="text" title="姓名" placeholder="请填写姓名" v-model="dataInfo.parentName"></x-input>
      <!-- <x-input type="tel" title="手机号" required ref="mobilePhone" keyboard="number" is-type="china-mobile" placeholder="请填写手机号码" v-model="dataInfo.telephoneNum"></x-input> -->
    </group>
    <group title="验证信息" label-width="5em" label-margin-right="0.5em" label-align="left">
      <x-input type="text" title="学生姓名" placeholder="请填写学生姓名" v-model="dataInfo.studentName"></x-input>
    </group>
    <detail-tabbar :actionLink="saveInfo" :actions="actions" :isHideMe="true"></detail-tabbar>
  </div>
</template>
<script>
  import { Group, XInput } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import api from '../../api'
  export default{
    components: {Group, XInput, DetailTabbar},
    data () {
      return {
        dataInfo: {
          studentName: null,
          parentName: null,
          telephoneNum: null
        },
        actions: [
          {
            name: '完成注册',
            code: 'registerparent'
          }
        ]
      }
    },
    methods: {
      saveInfo () {
        if (!this.dataInfo.parentName) {
          this.tools.warnToast('请填写姓名')
          return
        }
        // if (!this.dataInfo.telephoneNum) {
        //   this.tools.warnToast('请填写手机号码')
        //   return
        // }
        // if (!this.$refs.mobilePhone.valid) {
        //   this.tools.warnToast('请填写合法手机号', '160px')
        //   return
        // }
        if (!this.dataInfo.studentName) {
          this.tools.warnToast('请填写学生姓名')
          return
        }
        api.saveAddParent({schoolId: this.$route.params.schoolId, classId: this.$route.params.classId, data: this.dataInfo}, (data) => {
          this.tools.successToast('注册成功')
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.tools.warnToast(er.message)
          } else {
            this.tools.warnToast('注册失败')
          }
        })
      }
    }
  }
</script>
<style>

</style>
