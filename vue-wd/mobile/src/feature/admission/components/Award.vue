<template>
  <div v-transfer-dom>
    <popup v-model="isShowPopup" height="90vh">
      <div>
        <group>
          <x-input title="奖励虚拟货币名称" placeholder="美术豆" v-model="tempDefaultData.deputyRewardUnit" :disabled="!isNew"></x-input>
        </group>
        <group title="奖项设置">
          <cell v-for="(item, index) in tempDefaultData.recruitGuideRewards" :key="index" :title="item.rewardName" :value="item.pointsNum" @click.native="onButtonClick(index, 0)" :is-link="isNew"></cell>
        </group>
        <x-button v-show="isNew" style="margin: 10px auto;width: 40%;display:block;" text="添加奖项" type="primary" @click.native="addAwardItem"></x-button>
        <group title="奖励等级设置">
          <cell v-for="(item, index) in tempDefaultData.deputyRewards" :key="index" :title="item.key" :value="item.value" @click.native="onButtonClick(index, 1)" :is-link="isNew"></cell>
        </group>
        <x-button v-show="isNew" style="margin: 10px auto;width: 40%;display:block;" text="添加奖励等级" type="primary" @click.native="addItem"></x-button>
        <div style="margin-bottom:180px"></div>
        <!--添加弹出框-->
        <popup v-model="showPopupAward" is-transparent>
          <div flots="default" style="width: 95%;background-color:#fbf9fe;margin:0 auto;border-radius:5px;padding-top:10px;">
            <div>
              <x-input v-model="newEditTextAwardValue" title="奖项内容" placeholder="请输入奖项" style="background-color:#fff;margin:10px 15px;" :show-clear="true"></x-input>
              <x-input ref="awardIntegral" v-model="newEditTextAwardIntegralValue" title="所需货币数" placeholder="请输入数量" style="background-color:#fff;margin:10px 15px;" :show-clear="true" :is-type="isNumber" type="number"></x-input>
            </div>
            <div style="padding:10px 15px;">
              <x-button type="primary" @click.native="saveEditTextAwardValue()" > 确定 </x-button>
            </div>
          </div>
        </popup>
        <popup v-model="showPopupInput" is-transparent>
          <div flots="default" style="width: 95%;background-color:#fbf9fe;margin:0 auto;border-radius:5px;padding-top:10px;">
            <p v-if="showContentLengthHit" style="fontSize:12px;marginLeft:15px;color:red;">选项不能超过5个字</p>
            <div>
              <x-input ref="awardMoney" v-model="newEditTextValue" :title="inputTitle" placeholder="请输入虚拟货币数" style="background-color:#fff;margin:10px 15px;" :show-clear="true" :is-type="isNumber" type="number"></x-input>
            </div>
            <div style="padding:10px 15px;">
              <x-button type="primary" @click.native="saveEditTextValue()" > 确定 </x-button>
            </div>
          </div>
        </popup>
      </div>
      <tabbar v-show="isNew" style="position:fixed">
        <tabbar-item @on-item-click="goBack">
          <span slot="label" >取消</span>
        </tabbar-item>
        <tabbar-item style="background-color:#8ebf52">
          <span slot="label" style="color:#fff" @click="onDone">完成</span>
        </tabbar-item>
      </tabbar>
      <tabbar v-show="!isNew" style="position:fixed">
        <tabbar-item @on-item-click="goBack">
          <span slot="label" style="color:#FF6D56">关闭</span>
        </tabbar-item>
      </tabbar>
    </popup>
    <actionsheet v-model="showActionSheet" :menus="menu" @on-click-menu="actionSheetClick" show-cancel></actionsheet>
  </div>
</template>

<script>
import {TransferDom, Popup, Tabbar, TabbarItem, Group, GroupTitle, XButton, XInput, Cell, Actionsheet} from 'vux'
export default {
  directives: {
    TransferDom
  },
  components: {
    Popup, Tabbar, TabbarItem, Group, GroupTitle, XButton, XInput, Cell, Actionsheet
  },
  props: ['isShow', 'goBack', 'returnData', 'defaultData'],
  data () {
    return {
      info: {},
      tempDefaultData: {},
      // infoList: [],
      // tempInfoList: [],
      // tempAwardList: [],
      showPopupInput: false,
      showPopupAward: false,
      newEditTextValue: null,
      newEditTextAwardValue: null,
      newEditTextAwardIntegralValue: null,
      showContentLengthHit: false,
      showActionSheet: false,
      currentIndex: -1,
      isModify: false,
      actions: [
        {
          name: '保存',
          code: 'save'
        }
      ],
      menu: {
        modify: '修改',
        delete: '<p style="color:red;">删除</p>'
      },
      inputTitle: null,
      isShowPopup: false,
      isNumber (value) {
        var valid = (value === (value.match(/\d+(\.\d{0,2})?/) || [''])[0])
        return {
          valid,
          msg: '请输入正确的金额'
        }
      },
      isNew: true,
      settingType: 0   // 设置类型  0奖励内容 1邀请等级
    }
  },
  watch: {
    isShow(newValue, old) {
      this.isShowPopup = newValue
      if (newValue === true) {
        if (this.info !== null) {
          // {deputyRewardUnit: temp.deputyRewardUnit, rewards: temp.rewards, recruitGuideRewards: temp.recruitGuideRewards}
          this.info = this.defaultData
        }
        this.isNew = this.defaultData.isNew
        this.tempDefaultData = JSON.parse(JSON.stringify(this.info))
        // 设置初始值
        if (this.tempDefaultData.recruitGuideRewards === null || this.tempDefaultData.recruitGuideRewards === undefined) {
          this.tempDefaultData.recruitGuideRewards = []
        }
        if (this.tempDefaultData.deputyRewardUnit === undefined) {
          this.tempDefaultData.deputyRewardUnit = null
        }
        // this.tempInfoList = JSON.parse(JSON.stringify(this.infoList))
      }
    },
    isShowPopup(newValue, old) {
      if (newValue === false) {
        this.goBack()
      }
    }
  },
  mounted () {
    this.returnData(this.info)
  },
  methods: {
    addItem () {
      if (this.tempDefaultData.deputyRewards.length >= 5) {
        this.tools.warnToast('选项数已达上限', '130px')
      } else {
        this.inputTitle = (this.tempDefaultData.deputyRewards.length + 1) + '级奖励'
        this.newEditTextValue = null
        this.isModify = false
        this.showPopupInput = true
      }
    },
    addAwardItem () {
      if (this.tempDefaultData.recruitGuideRewards.length >= 10) {
        this.tools.warnToast('奖项数已达上限', '130px')
      } else {
        this.newEditTextAwardIntegralValue = null
        this.newEditTextAwardValue = null
        this.isModify = false
        this.showPopupAward = true
      }
    },
    saveEditTextValue () {
      if (this.$refs.awardMoney.valid === false) {
        this.tools.warnToast('请输入正确的虚拟货币数', '170px')
        return
      }
      this.showContentLengthHit = false
      if (this.newEditTextValue === null || this.newEditTextValue === '') {
        this.showPopupInput = false
        return
      }
      if (this.tools.getLength(this.newEditTextValue) > 10) {
        this.showContentLengthHit = true
        return
      }
      if (!/^\+?[1-9][0-9]*$/.test(this.newEditTextValue)) {
        this.tools.warnToast('虚拟货币数必须是整数', '170px')
        return
      }
      if (this.isModify) {
        // 修改
        this.isModify = false
        this.tempDefaultData.deputyRewards.splice(this.currentIndex, 1, {key: this.inputTitle, value: this.newEditTextValue})
      } else {
        this.tempDefaultData.deputyRewards.push({key: this.inputTitle, value: this.newEditTextValue})
      }
      this.newEditTextValue = null
      this.showPopupInput = false
    },
    saveEditTextAwardValue () {
      if (this.newEditTextAwardValue === null || this.newEditTextAwardValue === '') {
        this.showPopupAward = false
        return
      }
      if (!/^\+?[1-9][0-9]*$/.test(this.newEditTextAwardIntegralValue)) {
        this.tools.warnToast('虚拟货币数必须是整数', '150px')
        return
      }
      if (this.isModify) {
        // 修改
        this.isModify = false
        this.tempDefaultData.recruitGuideRewards.splice(this.currentIndex, 1, {rewardName: this.newEditTextAwardValue, pointsNum: this.newEditTextAwardIntegralValue})
      } else {
        this.tempDefaultData.recruitGuideRewards.push({rewardName: this.newEditTextAwardValue, pointsNum: this.newEditTextAwardIntegralValue})
      }
      this.newEditTextAwardValue = null
      this.showPopupAward = false
    },
    onButtonClick (index, type) {
      if (this.isNew === false) {
        return
      }
      this.settingType = type
      this.showActionSheet = true
      this.currentIndex = index
    },
    actionSheetClick (key) {
      switch (key) {
        case 'modify':
          if (this.settingType === 1) {
            this.showPopupInput = true
            this.inputTitle = this.tempDefaultData.deputyRewards[this.currentIndex].key
            this.newEditTextValue = this.tempDefaultData.deputyRewards[this.currentIndex].value
            this.isModify = true
          } else if (this.settingType === 0) {
            this.showPopupAward = true
            this.newEditTextAwardValue = this.tempDefaultData.recruitGuideRewards[this.currentIndex].rewardName
            this.newEditTextAwardIntegralValue = this.tempDefaultData.recruitGuideRewards[this.currentIndex].pointsNum
            this.isModify = true
          }
          break
        case 'delete':
          if (this.settingType === 1) {
            if (this.currentIndex === this.tempDefaultData.deputyRewards.length - 1) {
              this.tempDefaultData.deputyRewards.splice(this.currentIndex, 1)
            } else {
              this.tools.warnToast('请从' + this.tempDefaultData.deputyRewards[this.tempDefaultData.deputyRewards.length - 1].key + '开始删除', '170px')
            }
          } else if (this.settingType === 0) {
            this.tempDefaultData.recruitGuideRewards.splice(this.currentIndex, 1)
          }
          break
      }
    },
    onDone () {
      this.info = JSON.parse(JSON.stringify(this.tempDefaultData))
      this.returnData(this.info)
    }
  }
}
</script>
