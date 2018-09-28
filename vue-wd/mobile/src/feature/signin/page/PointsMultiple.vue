<template>
  <div>
    <group title="VIP等级" label-width="4em" label-margin-right="1em" label-align="right">
      <x-input style="fontSize:16px;" v-for="(item, index) in vipList" :title="item.name" :key="index" :placeholder="item.hint" v-model="item.value" text-align="left" type="number"></x-input>
    </group>
    <group title="积分等级" label-width="4em" label-margin-right="1em" label-align="right">
      <x-input style="fontSize:16px;" v-for="(item, index) in scoreList" :title="item.name" :key="index" :placeholder="item.hint" v-model="item.value" text-align="left" type="number"></x-input>
    </group>
    <detail-tabbar :actionLink="saveBounusPoints" :actions="actions" isHideMe=true></detail-tabbar>
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
    data () {
      return {
        orgId: this.$route.params.orgManagementId,
        vipList: [],
        scoreList: [],
        signSetting: [],
        actions: [{
          name: '保存',
          code: 'save'
        }]
      }
    },
    mounted () {
      var orgId = this.orgId
      api.getSignInManageSetting({orgId}, (data) => {
        api.getLevelList({orgId}, (list) => {
          for (var i = 0; i < list.length; i++) {
            this.scoreList.push({name: list[i].levelName, value: '', levelId: list[i].levelId + '', hint: '请输入积分倍数'})
          }
          if (data.levelScore !== null && data.levelScore !== '') {
            var tempList = data.levelScore.split(',')
            for (var m = 0; m < tempList.length; m++) {
              var temp = tempList[m].split('-')
              for (var k = 0; k < this.scoreList.length; k++) {
                if (this.scoreList[k].levelId === temp[0]) {
                  this.scoreList[k].value = temp[1]
                }
              }
            }
          }
        }, () => {})
        api.getVipLevelList({orgId}, (list) => {
          for (var i = 0; i < list.length; i++) {
            this.vipList.push({name: list[i].vipName, value: '', levelId: list[i].vipId + '', hint: '请输入积分倍数'})
          }
          if (data.vipScore !== null && data.vipScore !== '') {
            var tempList1 = data.vipScore.split(',')
            for (var j = 0; j < tempList1.length; j++) {
              var temp1 = tempList1[j].split('-')
              for (var l = 0; l < this.vipList.length; l++) {
                if (this.vipList[l].levelId === temp1[0]) {
                  this.vipList[l].value = temp1[1]
                }
              }
            }
          }
        }, () => {})
      }, () => {})
    },
    methods: {
      saveBounusPoints () {
        var levelScore = []
        for (var i = 0; i < this.scoreList.length; i++) {
          if (this.scoreList[i].value !== '' && this.scoreList[i].value !== null) {
            levelScore.push(this.scoreList[i].levelId + '-' + this.scoreList[i].value)
          }
        }
        var levelVip = []
        for (var j = 0; j < this.vipList.length; j++) {
          if (this.vipList[j].value !== '' && this.vipList[j].value !== null) {
            levelVip.push(this.vipList[j].levelId + '-' + this.vipList[j].value)
          }
        }
        this.signSetting.push({name: 'levelScore', value: levelScore.join(',')})
        this.signSetting.push({name: 'vipScore', value: levelVip.join(',')})
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
