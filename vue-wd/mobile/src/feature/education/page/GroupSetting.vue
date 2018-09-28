<template>
  <div>
    <checklist label-position="left" required :options="commonList" v-model="orgs"></checklist>
    <p style="text-align:center;font-size: 16px;padding: 20px 15px;fontSize:16px;color:#a2a2a2" v-if="showProp">没有可选择的群，请先去开通微信群！</p>
    <x-button v-if="showProp" class="btn-item" type="primary" @click.native="payAction()">开通群</x-button>
    <detail-tabbar :actionLink="confirmSave" :actions="actions"></detail-tabbar>
  </div>
</template>
<script>
  import { Checklist, XButton } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import api from '../api'
  export default{
    components: {
      DetailTabbar, Checklist, XButton
    },
    data () {
      return {
        showProp: false,
        orgs: [],
        commonList: [],
        propText: '',
        actions: [{
          name: '完成选择',
          code: 'confirmSave'
        }]
      }
    },
    mounted () {
      api.queryMyOrg((data) => {
        if (data.length > 0) {
          var listArr = []
          data.forEach((item) => { listArr.push({}) })
          for (var i = 0; i < data.length; i++) {
            listArr[i].value = data[i].orgName + '&nbsp;&nbsp;' + '[' + data[i].memberNum + '人]'
            listArr[i].key = data[i].orgId
          }
          this.showProp = false
          this.commonList = listArr
        } else {
          this.showProp = true
        }
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    methods: {
      confirmSave (code) {
        if (code === 'confirmSave') {
          if (this.orgs.length > 0) {
            api.addSchoolOrg({schoolId: this.$route.params.schoolId, orgs: this.orgs}, (data) => {
              this.$router.go(-1)
              this.tools.successToast('添加成功')
            }, (er) => {
              if (er.toUser !== undefined && er.toUser) {
                this.tools.warnToast(er.message)
              } else {
                this.tools.warnToast('添加失败')
              }
            })
          } else {
            this.tools.warnToast('请选择要添加的群！', '160px')
          }
        }
      },
      payAction () {
        this.$router.push({name: 'orgCreateNewOrg'})
      }
    }
  }
</script>

<style>
.btn-item{
  width:120px !important; 
  height:36px; 
  line-height:36px;
  font-size: 15px;
  border: 1px solid #8ebf52;
}
</style>

