<template>
  <div>
    <group v-for="(item,index) in list" :key="index">
      <cell :title="item.saName + ' ' + item.saPhone" :inline-desc="item.saProvince + item.saCity + item.saArea + item.saDetail" @click.native="onSelect(item)"></cell>
      <div class = "store-checklist-div">
        <checklist class="store-checklist-item" :options="item.list" v-model="item.checkedList" @on-change="val=>{change(val, index)}" style="width:120px;margin-top:2px"></checklist>
      </div>
      <label style="position:absolute;right:50px;bottom:8px;font-size:13px;color:#A2D268" v-on:click="onEdit(item)">编辑</label>
      <label style="position:absolute;right:10px;bottom:8px;font-size:13px;color:#FF6D56" v-on:click="onDelete(item)">删除</label>
    </group>

    <popup v-model="show" height="60%">
      <group label-width="4em" label-margin-right="1em" label-align="right">
        <x-input ref="inputName" title="姓名" v-model="address.saName" placeholder="请填写姓名" :min="2" :max="20"></x-input>
        <x-input ref="inputPhone" title="手机号码" v-model="address.saPhone" type="tel" placeholder="请填写手机号" keyboard="number" is-type="china-mobile"></x-input>
        <x-address title="所在地区" v-model="addressValue" raw-value :list="addressData" value-text-align="left" placeholder="请选择省市区" @on-hide="addressHide"></x-address>
        <x-textarea title="详细地址" v-model="address.saDetail" placeholder="建议您如实填写详细收货地址"></x-textarea>
        <x-switch v-if="isShowEditAddressDefault" title="是否设置为默认收货地址" v-model="address.saDefault"></x-switch>
      </group>
      <x-button type="primary" style="width:140px; margin-top:30px" @click.native="onAdd">保存</x-button>
    </popup>
    <actionsheet v-model="isShowDeleteMenus" :menus="deleteMenus" @on-click-menu-delete="onConfirmDelete" show-cancel></actionsheet>
    <detail-tabbar :actionLink="showEdit" :actions="actions" isHideMe=true></detail-tabbar>
  </div>
</template>

<script>
import {Group, Cell, Checklist, XButton, Tabbar, TabbarItem, Popup, XAddress, ChinaAddressV3Data, XInput, XTextarea, XSwitch, Value2nameFilter as value2name, Actionsheet} from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '@/feature/store/api'
import { mapActions } from 'vuex'
import * as types from '../types'
export default {
  components: {
    Group,
    Cell,
    Checklist,
    XButton,
    Tabbar,
    TabbarItem,
    Popup,
    XAddress,
    ChinaAddressV3Data,
    XInput,
    XTextarea,
    XSwitch,
    DetailTabbar,
    Actionsheet
  },
  data () {
    return {
      list: [],
      actions: [{
        name: '添加新地址',
        code: 'add'
      }],
      readyDeleteAddress: {},
      isShowDeleteMenus: false,
      deleteMenus: {},
      isShowEditAddressDefault: true,
      address: {},
      show: false,
      addressValue: [],
      addressData: ChinaAddressV3Data,
      isLoadFinish: false // 页面已渲染完成
    }
  },
  mounted () {
    this.getAddresses()
  },
  methods: {
    getAddresses () {
      this.isLoadFinish = false
      api.getAddresses((data) => {
        for (var i = 0; i < data.length; i++) {
          var item = data[i]
          if (item.saDefault) {
            item.list = [{key: i + '', value: '默认地址'}]
            item.checkedList = [i + '']
          } else {
            item.list = [{key: i + '', value: '设置为默认'}]
          }
        }
        this.list = data
        if (data.length === 0) {
          this.show = true
        }
        this.$nextTick(() => {
          this.isLoadFinish = true
        })
      }, () => {})
    },
    change (val, index) {
      if (this.isLoadFinish) {
        // 处理UI变化
        this.$nextTick(() => {
          var tempList = JSON.parse(JSON.stringify(this.list))
          for (var i = 0; i < tempList.length; i++) {
            var item = tempList[i]
            if (i === index) {
              item.list[0].value = '默认地址'
              item.checkedList = [index + '']
              item.saDefault = true
            } else {
              item.list[0].value = '设置为默认'
              item.checkedList = []
              item.saDefault = false
            }
          }
          this.list = tempList
          this.isLoadFinish = false
          this.$nextTick(() => {
            this.isLoadFinish = true
          })
        })

        // 请求接口
        var addr = this.list[index]
        if (addr.saDefault) {
          return
        } else {
          addr.saDefault = true
          this.saveAddress(addr)
        }
      }
    },
    showEdit () {
      this.address = {
        saId: null,
        saName: null,
        saProvince: null,
        saCity: null,
        saArea: null,
        saDetail: null,
        saPhone: null,
        saDefault: false
      }
      this.isShowEditAddressDefault = true
      this.show = true
    },
    onAdd () {
      if (this.tools.isNull(this.address.saName) || this.$refs.inputName.valid === false) {
        this.tools.warnToast('姓名输入有误')
        return
      }
      if (this.tools.isNull(this.address.saPhone) || this.$refs.inputPhone.valid === false) {
        this.tools.warnToast('手机号输入有误')
        return
      }
      if (this.tools.isNull(this.address.saDetail)) {
        this.tools.warnToast('详细地址输入有误', '150px')
        return
      }
      if (this.address.saProvince === null || this.address.saCity === null || this.address.saArea === null) {
        this.tools.warnToast('请选择所在地区')
        return
      }
      if (typeof (this.address.saDefault) === 'undefined') {
        this.address.saDefault = false
      }
      if (this.address.saId === null || typeof (this.address.saId) === 'undefined') {
        api.addAddress(this.address, () => {
          this.getAddresses()
          this.tools.successToast('添加成功')
        }, () => {})
      } else {
        this.saveAddress(this.address)
      }
      console.log('address', this.address)
      this.show = false
    },
    saveAddress (address) {
      api.saveAddress(address, () => {
        this.list.forEach((element) => {
          if (element.saId === address.saId) {
            element.saName = address.saName
            element.saPhone = address.saPhone
            element.saProvince = address.saProvince
            element.saCity = address.saCity
            element.saArea = address.saArea
            element.saDetail = address.saDetail
          }
        }, this)
        this.tools.successToast('修改成功')
      }, () => {})
    },
    onDelete (item) {
      this.readyDeleteAddress = item
      this.deleteMenus = {
        'title.noop': '您确定删除“' + this.readyDeleteAddress.saName + '/' + this.readyDeleteAddress.saProvince + this.readyDeleteAddress.saCity + this.readyDeleteAddress.saArea + this.readyDeleteAddress.saDetail + '”吗?<br/>',
        delete: '<span style="color:red">删除</span>'
      }
      this.isShowDeleteMenus = true
    },
    onConfirmDelete () {
      api.delAddress({saId: this.readyDeleteAddress.saId}, () => {
        var index = this.list.indexOf(this.readyDeleteAddress)
        this.list.splice(index, 1)
        this.tools.successToast('删除成功')
      }, (data) => {
        this.tools.warnToast(data.message, '140px')
      })
    },
    onEdit (item) {
      this.addressValue = [item.saProvince, item.saCity, item.saArea]
      this.address = JSON.parse(JSON.stringify(item))
      this.isShowEditAddressDefault = false
      this.show = true
    },
    addressHide (closeType) {
      if (closeType === true) { // 完成
        var addrList = value2name(this.addressValue, ChinaAddressV3Data).split(' ')
        this.address.saProvince = addrList[0]
        this.address.saCity = addrList[1]
        this.address.saArea = addrList[2]
      }
    },
    ...mapActions({
      setProductOrderInfo: types.SET_PRODUCT_ORDER_INFO
    }),
    onSelect (item) {
      this.$router.back()
      this.setProductOrderInfo({productId: this.$route.params.productId, addressInfo: item})
    }
  }
}

</script>

<style>
.store-checklist-item div{
  font-size:14px!important;
  /*height:20px!important;*/
}
.store-checklist-item label{
  padding:5px!important
}
.store-checklist-div {
  position:relative;
}
.store-checklist-div::before{
    content: '';
    position: absolute;
    top: 0;
    left: 0;  
    border-top: 1px solid #D9D9D9;
    width: 200%;
    height: 200%;
    transform-origin: 0 0;
    transform: scale(0.5,0.5);
    box-sizing: border-box;
}

</style>
