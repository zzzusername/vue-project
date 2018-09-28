<template>
  <div>
    <group label-width="8em" label-margin-right="1em" label-align="right">
      <x-input style="fontSize:16px;" title="连续签到天数" placeholder="请输入天数" v-model="continuesDay" type="number" keyboard="number"></x-input>
      <x-input style="fontSize:16px;" title="连续签到获得积分" placeholder="请输入积分数" v-model="points" type="number" keyboard="number"></x-input>
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
      continuesDay: '',
      points: '',
      actions: [{
        name: '保存',
        code: 'save'
      }]
    }
  },
  mounted() {
    var orgId = this.orgId
    api.getSignInManageSetting({ orgId }, (val) => {
      if (val !== null && val.linkScore !== null && val.linkScore !== '') {
        var temp = val.linkScore.split('-')
        this.continuesDay = temp[0]
        this.points = temp[1]
      }
    }, () => { })
  },
  methods: {
    saveSignInGroup() {
      var orgId = this.orgId
      var signSetting = []
      if (this.continuesDay === '' && this.points === '') {
        signSetting.push({ name: 'linkScore', value: '' })
      } else if (this.continuesDay === '' || this.points === '') {
        this.tools.warnToast('信息不完整', '140px')
        return
      } else {
        signSetting.push({ name: 'linkScore', value: this.continuesDay + '-' + this.points })
      }
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
