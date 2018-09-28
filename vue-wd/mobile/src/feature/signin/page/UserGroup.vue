<template>
  <div>
    <checklist v-if="vipList.length > 0" title="VIP等级" :options="vipList" v-model="vipListValue" @on-change="vipChange" label-position="left"></checklist>
    <checklist v-if="scoreList.length > 0" title="积分等级" :options="scoreList" v-model="scoreListValue" @on-change="scoreChange" label-position="left"></checklist>
    <detail-tabbar :actionLink="saveSignInGroup" :actions="actions" isHideMe=true></detail-tabbar>
  </div>
</template>

<script>
  import { Checklist } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import api from '@/feature/signin/api'
  export default {
    components: {
      Checklist, DetailTabbar
    },
    data () {
      return {
        vipList: [],
        vipListValue: [],
        scoreList: [],
        scoreListValue: [],
        orgId: this.$route.params.orgManagementId,
        signSetting: [],
        actions: [{
          name: '保存',
          code: 'save'
        }]
      }
    },
    mounted () {
      var orgId = this.orgId
      api.getLevelList({orgId}, (list) => {
        for (var i = 0; i < list.length; i++) {
          this.scoreList.push({key: list[i].levelId + '', value: list[i].levelName})
        }
      }, () => {})
      api.getVipLevelList({orgId}, (list) => {
        for (var i = 0; i < list.length; i++) {
          this.vipList.push({key: list[i].vipId + '', value: list[i].vipName})
        }
      }, () => {})
      api.getSignInManageSetting({orgId}, (data) => {
        if (data.allowVip !== null && data.allowVip !== '') {
          this.vipListValue = data.allowVip.split(',')
        }
        if (data.allowLevel !== null && data.allowLevel !== '') {
          this.scoreListValue = data.allowLevel.split(',')
        }
      }, () => {})
    },
    methods: {
      vipChange (val) {
        this.vipListValue = val
      },
      scoreChange (val) {
        this.scoreListValue = val
      },
      saveSignInGroup () {
        if (this.scoreListValue.length > 0) {
          var scoreValue = this.scoreListValue.join(',')
          this.signSetting.push({name: 'allowLevel', value: scoreValue})
        } else {
          this.signSetting.push({name: 'allowLevel', value: ''})
        }
        if (this.vipListValue.length > 0) {
          var vipValue = this.vipListValue.join(',')
          this.signSetting.push({name: 'allowVip', value: vipValue})
        } else {
          this.signSetting.push({name: 'allowVip', value: ''})
        }
        var orgId = this.orgId
        var signSetting = this.signSetting
        api.setSignInManageSetting({orgId, signSetting}, (data) => {
          if (data.rs === 1) {
            this.$router.back()
            this.tools.successToast('设置成功')
          } else {
            this.tools.warnToast('设置失败')
          }
        }, () => {})
      }
    }
  }
</script>
