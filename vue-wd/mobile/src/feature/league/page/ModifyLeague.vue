<template>
  <div>
    <group>
      <cell v-for="(item, index) in list" :title="item.name" v-if="item.type === 'text' || item.type === 'textarea' || item.type === 'number'" :key="index" is-link @click.native="onClick(index)" :value="item.value&&item.value.length>10?item.value.substring(0,10)+'...':item.value"></cell>
      <datetime-range v-else-if="item.type === 'date'" :title="item.name" :start-date="startDateTime" :end-date="endDateTime" v-model="item.value" format="YYYY年MM月DD日"></datetime-range>
      <cell v-else-if="item.type === 'img'" :title="item.name"  @click.native='chooseImg(index)' is-link>
        <img slot="default" :src="tools.cdn(item.value,'logo.png')" class="cell-league-logo"/>
      </cell>
      <x-switch v-else-if="item.type === 'switch'" :title="item.name" v-model="item.value" @on-change="val=>{changeSwitchStatus(val,item.code)}"></x-switch>
      <popup-picker v-else-if="item.type === 'picker'" :title="item.name" :data="propertyList" show-name v-model="property" @on-hide="propertyHide" @on-show="propertyShow(index)"></popup-picker>
      <cell v-else :title="item.name" is-link :link="item.value"></cell>
    </group>
    <popup v-model="showPopupInput" is-transparent>
      <div flots="default" style="width: 95%;background-color:#fbf9fe;height:125px;margin:0 auto;border-radius:5px;padding-top:10px; margin-bottom:10px">
        <x-input v-model="newEditTextValue" :placeholder="placeholder" style="background-color:#fff;margin:10px 15px;" :show-clear="true" :type="inputType"></x-input>
        <div style="padding:10px 15px;">
          <x-button type="primary" @click.native="saveEditTextValue()" > 确定 </x-button>
        </div>
      </div>
    </popup>
    <popup v-model="showPopupTextArea" is-transparent>
      <div flots="default" style="width: 95%;background-color:#fbf9fe;height:150px;margin:0 auto;border-radius:5px;padding-top:10px;margin-bottom:10px">
        <x-textarea v-model="newEditTextValue" :placeholder="placeholder"></x-textarea>
        <div style="padding:10px 15px;">
          <x-button type="primary" @click.native="saveEditTextValue()" > 确定 </x-button>
        </div>
      </div>
    </popup>

    <tabbar v-transfer-dom style="position:fixed">
      <tabbar-item @on-item-click="onBack()">
        <span slot="label" >返回</span>
      </tabbar-item>
      <tabbar-item @on-item-click="onPay()" style="background-color:#8ebf52">
        <span slot="label" style="color:#fff">{{payBtnTitle}}</span>
      </tabbar-item>
    </tabbar>

    <toast v-model="showCheckToast" type="warn" style='font-size:19px'>联盟名称不能为空</toast>
  </div>
</template>

<script>
  import { Cell, Group, Popup, XInput, XSwitch, XButton, XTextarea, PopupPicker, Tabbar, TabbarItem, TransferDomDirective as TransferDom, Toast } from 'vux'
  import api from '@/feature/league/api'
  export default {
    components: {
      Cell, Group, Popup, XInput, XSwitch, XButton, XTextarea, PopupPicker, Tabbar, TabbarItem, Toast
    },
    data () {
      return {
        showPopupInput: false,
        showPopupTextArea: false,
        placeholder: '',
        inputType: 'text',
        clickIndex: 0,
        newEditTextValue: '',
        property: ['false'],
        showCheckToast: false,
        showToastText: '',
        payBtnTitle: '创建联盟',
        money: '198',
        isModify: false,
        leagueId: 0,
        list: [
          {
            name: '联盟名称',
            code: 'leagueName',
            type: 'text',
            placeholder: '请输入联盟名称'
          }, {
            name: '联盟图标',
            code: 'leagueLogotmp',
            type: 'img'
          }, {
            name: '联盟简介',
            code: 'leagueIntroduce',
            type: 'textarea',
            placeholder: '请输入联盟简介'
          }
        ],
        propertyList: [],
        leagueLogoFile: null
      }
    },
    mounted () {
      this.propertyList = [[{
        name: '自用联盟（免费）',
        value: 'false'
      }, {
        name: '公开联盟（￥' + this.money + '／年）',
        value: 'true'
      }]]
      this.leagueId = this.$route.params.leagueId
      if (this.leagueId > 0) {
        this.payBtnTitle = '保存'
        api.getLeagueInfo({leagueId: this.leagueId}, (data) => {
          // 如果是公开联盟，需要追加两个属性
          if (data.isPublic === true && data.isCheck === true) {
            this.list.push({
              name: '加入联盟是否审核',
              code: 'isCheck',
              type: 'switch',
              value: false
            })
          } else if (data.isPublic === true && data.isCheck === false) {
            this.changeData()
          }
          // 属性赋值，copy再赋值解决页面不联动改变的问题
          var _list = []
          this.list.forEach(function (element) {
            var o = {...element}
            _list.push(o)
          })
          _list.forEach(function (element) {
            if (data[element.code] !== null && typeof (data[element.code]) !== 'undefined') {
              element.value = data[element.code]
            }
          })
          this.list = _list
        }, () => {})
      } else {
        // 创建流程需要增加此项
        this.list.push({
          name: '联盟属性',
          code: 'isPublic',
          type: 'picker',
          value: 'false'
        })
      }
    },
    methods: {
      onClick (index) {
        this.clickIndex = index
        var item = this.list[index]
        this.inputType = item.type
        this.newEditTextValue = item.value ? item.value + '' : item.value
        if (item.type === 'text' || item.type === 'number') {
          this.showPopupInput = true
          this.placeholder = item.placeholder
        } else if (item.type === 'textarea') {
          this.showPopupTextArea = true
          this.placeholder = item.placeholder
        }
      },
      saveEditTextValue () {
        this.showPopupInput = false
        this.showPopupTextArea = false
        var item = this.list[this.clickIndex]
        item.value = this.newEditTextValue
      },
      onBack () {
        this.$router.back(-1)
      },
      onPay () {
        let param = {}
        this.list.forEach(function (element) {
          if (typeof (element.value) !== 'undefined') {
            param[element.code] = element.value
          }
        })
        if (!param.leagueName) {
          this.showCheckToast = true
          return
        }
        if (this.leagueId > 0) {
          param.leagueId = this.leagueId
          this.saveLeague(param)
        } else {
          this.createLeague(param)
        }
      },
      propertyHide (closeType) {
        if (closeType === true) { // 完成
          var item = this.list[this.clickIndex]
          item.value = this.property[0] + ''
          if (item.value === 'true') {
            this.changeData()
            this.payBtnTitle = '支付￥' + this.money + ' 并创建联盟'
          } else {
            this.payBtnTitle = '创建联盟'
            for (var i = this.list.length - 1; i >= 0; i--) {
              var element = this.list[i]
              if (element.code === 'isCheck' || element.code === 'joinCost') {
                this.list.splice(i, 1)
              }
            }
          }
        }
      },
      propertyShow (index) {
        this.clickIndex = index
      },
      chooseImg (index) {
        var _list = [...this.list]
        var item = _list[index]
        this.$wechat.chooseImage({
          count: 1,
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: res => {
            this.$wechat.getLocalImgData({
              localId: res.localIds[0], // 图片的localID
              success: res2 => {
                item.value = this.tools.data2imgDataUrl(res2.localData)
                this.list = _list
                this.leagueLogoFile = this.tools.data2blob(res2.localData)
              }
            })
          }
        })
      },
      changeData () {
        this.list.push({
          name: '加入联盟是否审核',
          code: 'isCheck',
          type: 'switch',
          value: false
        })
        this.list.push({
          name: '加入联盟费用',
          code: 'joinCost',
          type: 'number',
          placeholder: '请输入加入联盟费用'
        })
      },
      createLeague (param) {
        api.createLeague({data: param, leagueLogoFile: this.leagueLogoFile}, (data) => {
          if (data.isToPay) {
            this.$router.replace({name: 'payIndex', params: {orderId: data.orderId}})
          } else {
            this.$router.replace({name: 'leagueMyList'})
            this.tools.successToast('创建成功')
          }
        }, () => {})
      },
      saveLeague (param) {
        api.saveLeague({data: param, leagueLogoFile: this.leagueLogoFile}, (data) => {
          this.$router.back(-1)
          this.tools.successToast('保存成功')
        }, () => {})
      },
      changeSwitchStatus (val, code) {
        if (val) {
          for (var i = this.list.length - 1; i >= 0; i--) {
            var element = this.list[i]
            if (element.code === 'joinCost') {
              this.list.splice(i, 1)
            }
          }
        } else {
          this.list.push({
            name: '加入联盟费用',
            code: 'joinCost',
            type: 'number',
            placeholder: '请输入加入联盟费用'
          })
        }
      }
    },
    directives: {
      TransferDom
    }
  }
</script>

<style>
.cell-league-logo{
  display:block;
  margin-right:8px; 
  width: 50px;
  height: 50px;
}
</style>
