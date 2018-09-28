<template>
  <div>
    <group label-width="5em" label-margin-right="1em" label-align="right">
      <x-input style="fontSize:16px;" title="签到积分数" placeholder="请输入签到积分数" v-model="signInPoints" type="number" keyboard="number"></x-input>
    </group>
    <detail-tabbar :actionLink="saveSignInGroup" :actions="actions" isHideMe=true></detail-tabbar>
  </div>
</template>

<script>
import { Group, XInput } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '@/feature/signin/api'
export default {
  components: {
    Group, XInput, DetailTabbar
  },
  data() {
    return {
      orgId: this.$route.params.orgManagementId,
      signInPoints: '',
      actions: [{
        name: '保存',
        code: 'save'
      }]
    }
  },
  mounted() {
    var orgId = this.orgId
    api.getSignInManageSetting({ orgId }, (val) => {
      if (val !== null && val.baseScore !== null && val.baseScore !== '') {
        this.signInPoints = val.baseScore
      }
    }, () => { })
  },
  methods: {
    saveSignInGroup() {
      var orgId = this.orgId
      var signSetting = []
      signSetting.push({ name: 'baseScore', value: this.signInPoints })
      api.setSignInManageSetting({ orgId, signSetting }, (data) => {
        if (data.rs === 1) {
          this.$router.back()
          this.tools.successToast('设置成功')
        } else {
          this.tools.warnToast('设置失败')
        }
      }, () => { })
    }
  }
}
</script>
