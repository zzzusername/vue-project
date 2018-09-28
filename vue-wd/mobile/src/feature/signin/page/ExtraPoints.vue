<template>
  <div>
    <group v-if="ruleList.length > 0">
      <cell v-for="(item, index) in ruleList" :key="index" :title="item.name" :value="item.value" is-link @click.native="itemClick(index)"></cell>
    </group>
    <div style="margin: 20px 10px;">
      <x-button type="primary" text="添加设置" @click.native="showPop"></x-button>
    </div>
    <popup v-model="showEdit" is-transparent>
      <div flots="default" style="width: 95%;background-color:#fbf9fe;height:200px;margin:0 auto;border-radius:5px;padding-top:10px;">
        <x-input style="fontSize:16px;" title="开始名次" placeholder="请输入开始名次" v-model="startRanking" type="number" keyboard="number"></x-input>
        <x-input style="fontSize:16px;" title="结束名次" placeholder="请输入结束名次" v-model="endRanking" type="number" keyboard="number"></x-input>
        <x-input style="fontSize:16px;" title="额外积分" placeholder="请输入额外积分" v-model="extraPoints" type="number" keyboard="number"></x-input>
        <div style="padding:10px 15px;" class="jhy-1px-t">
          <x-button style="height:42px;" type="primary" @click.native="saveEditTextValue" text="确定"></x-button>
        </div>
      </div>
    </popup>
    <actionsheet v-model="showMenu" :menus="actionMenus" @on-click-menu="actionSheetClick" show-cancel></actionsheet>
    <detail-tabbar :actionLink="saveSignInGroup" :actions="actions" isHideMe=true></detail-tabbar>
  </div>
</template>

<script>
import { XButton, Group, Cell, Popup, XInput, Actionsheet } from 'vux'
import api from '@/feature/signin/api'
import DetailTabbar from '@/components/DetailTabbar.vue'
export default {
  components: {
    XButton, Group, Popup, XInput, Cell, DetailTabbar, Actionsheet
  },
  data() {
    return {
      showEdit: false,
      ruleList: [],
      startRanking: '',
      endRanking: '',
      extraPoints: '',
      orgId: this.$route.params.orgManagementId,
      showMenu: false,
      actionMenus: {
        change: '修改',
        delete: '删除'
      },
      clickIndex: -1,
      actions: [{
        name: '保存',
        code: 'save'
      }]
    }
  },
  mounted() {
    var orgId = this.orgId
    api.getSignInManageSetting({ orgId }, (data) => {
      if (data.rankScore !== null && data.rankScore !== '') {
        var tempList = data.rankScore.split(',')
        for (var i = 0; i < tempList.length; i++) {
          var temp = tempList[i].split('-')
          this.ruleList.push(
            {
              name: '前' + temp[0] + '-' + temp[1] + '名',
              startRanking: temp[0],
              endRanking: temp[1],
              extraPoints: temp[2],
              value: '额外增加' + temp[2] + '积分'
            }
          )
        }
      }
    }, () => { })
  },
  methods: {
    showPop() {
      this.showEdit = true
    },
    saveEditTextValue() {
      if (this.tools.isNull(this.startRanking)) {
        this.tools.warnToast('请输入开始名次')
        return
      }
      if (this.tools.isNull(this.endRanking)) {
        this.tools.warnToast('请输入结束名次')
        return
      }
      if (this.endRanking < this.startRanking) {
        this.tools.warnToast('结束名次不能小于开始名次', '200px')
        return
      }
      if (this.tools.isNull(this.extraPoints)) {
        this.tools.warnToast('请输入额外积分')
        return
      }
      if (this.clickIndex !== -1) {
        this.ruleList.splice(this.clickIndex, 1, {
          name: '前' + this.startRanking + '-' + this.endRanking + '名',
          startRanking: this.startRanking,
          endRanking: this.endRanking,
          extraPoints: this.extraPoints,
          value: '额外增加' + this.extraPoints + '积分'
        })
      } else {
        this.ruleList.push(
          {
            name: '前' + this.startRanking + '-' + this.endRanking + '名',
            startRanking: this.startRanking,
            endRanking: this.endRanking,
            extraPoints: this.extraPoints,
            value: '额外增加' + this.extraPoints + '积分'
          }
        )
      }
      this.startRanking = ''
      this.endRanking = ''
      this.extraPoints = ''
      this.showEdit = false
      this.clickIndex = -1
    },
    // showMenu = !showMenu
    itemClick(index) {
      this.showMenu = !this.showMenu
      this.clickIndex = index
    },
    actionSheetClick(key) {
      switch (key) {
        case 'change':
          console.log('change')
          this.startRanking = this.ruleList[this.clickIndex].startRanking
          this.endRanking = this.ruleList[this.clickIndex].endRanking
          this.extraPoints = this.ruleList[this.clickIndex].extraPoints
          this.showEdit = true
          break
        case 'delete':
          console.log('delete')
          this.ruleList.splice(this.clickIndex, 1)
          break
      }
    },
    saveSignInGroup() {
      var signSetting = []
      var tempArray = []
      for (var i = 0; i < this.ruleList.length; i++) {
        tempArray.push(this.ruleList[i].startRanking + '-' + this.ruleList[i].endRanking + '-' + this.ruleList[i].extraPoints)
      }
      signSetting.push({name: 'rankScore', value: tempArray.join(',')})
      var orgId = this.orgId
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
