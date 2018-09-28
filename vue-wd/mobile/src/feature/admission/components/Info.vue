<template>
  <div v-transfer-dom>
    <popup v-model="isShowPopup" height="90vh">
      <div>
        <group title="点击按钮添加资料选项">
          <cell v-for="(item, index) in tempInfoList" :key="index" :title="item.key" @click.native="onButtonClick(index)" :is-link="(index==1||index==0)?false:true"></cell>
        </group>
        <x-button style="margin: 10px auto;width: 90%;display:block;margin-bottom:70px" text="增加资料选项" type="primary" @click.native="addItem"></x-button>
        <!--添加弹出框-->
        <popup v-model="showPopupInput" is-transparent>
          <div flots="default" style="width: 95%;background-color:#fbf9fe;margin:0 auto;border-radius:5px;padding-top:10px;">
            <p v-if="showContentLengthHit" style="fontSize:12px;marginLeft:15px;color:red;">选项不能超过5个字</p>
            <div>
              <x-input v-model="newEditTextValue" placeholder="请输入" style="background-color:#fff;margin:10px 15px;" :show-clear="true"></x-input>
            </div>
            <div style="padding:10px 15px;">
              <x-button type="primary" @click.native="saveEditTextValue()" > 确定 </x-button>
            </div>
          </div>
        </popup>
      </div>
      <tabbar style="position:fixed">
        <tabbar-item @on-item-click="goBack">
          <span slot="label" >取消</span>
        </tabbar-item>
        <tabbar-item style="background-color:#8ebf52">
          <span slot="label" style="color:#fff" @click="onDone">完成</span>
        </tabbar-item>
      </tabbar>
    </popup>
    <actionsheet v-model="showActionSheet" :menus="menu" @on-click-menu="actionSheetClick" show-cancel></actionsheet>
  </div>
</template>

<script>
import {TransferDom, Popup, Tabbar, TabbarItem, Group, XButton, XInput, Cell, Actionsheet} from 'vux'
export default {
  directives: {
    TransferDom
  },
  components: {
    Popup, Tabbar, TabbarItem, Group, XButton, XInput, Cell, Actionsheet
  },
  props: ['isShow', 'goBack', 'returnData', 'defaultData'],
  data () {
    return {
      infoList: [{key: '姓名', value: ''}, {key: '手机号', value: ''}],
      tempInfoList: [],
      showPopupInput: false,
      newEditTextValue: null,
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
      isShowPopup: false
    }
  },
  watch: {
    isShow(newValue, old) {
      this.isShowPopup = newValue
      if (this.defaultData !== null) {
        this.infoList = this.defaultData
      }
      this.tempInfoList = JSON.parse(JSON.stringify(this.infoList))
    },
    isShowPopup(newValue, old) {
      if (newValue === false) {
        this.goBack()
      }
    }
  },
  mounted () {
    this.returnData(this.infoList)
  },
  methods: {
    onButtonClick (index) {
      if (index === 0 || index === 1) {
        return
      }
      this.showActionSheet = true
      this.currentIndex = index
    },
    addItem () {
      if (this.tempInfoList.length >= 6) {
        this.tools.warnToast('选项数已达上限', '130px')
      } else {
        this.newEditTextValue = null
        this.isModify = false
        this.showPopupInput = true
      }
    },
    saveEditTextValue () {
      this.showContentLengthHit = false
      if (this.newEditTextValue === null || this.newEditTextValue === '') {
        this.showPopupInput = false
        return
      }
      if (this.tools.getLength(this.newEditTextValue) > 10) {
        this.showContentLengthHit = true
        return
      }
      if (this.isModify) {
        // 修改
        this.isModify = false
        this.tempInfoList.splice(this.currentIndex, 1, {key: this.newEditTextValue, value: ''})
      } else {
        this.tempInfoList.push({key: this.newEditTextValue, value: ''})
      }
      this.newEditTextValue = null
      this.showPopupInput = false
    },
    actionSheetClick (key) {
      switch (key) {
        case 'modify':
          this.showPopupInput = true
          this.newEditTextValue = this.tempInfoList[this.currentIndex].key
          this.isModify = true
          break
        case 'delete':
          this.tempInfoList.splice(this.currentIndex, 1)
          break
      }
    },
    onDone () {
      this.infoList = JSON.parse(JSON.stringify(this.tempInfoList))
      this.returnData(this.infoList)
    }
  }
}
</script>
