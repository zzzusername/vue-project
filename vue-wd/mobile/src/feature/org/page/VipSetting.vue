<template>
  <div>
    <group>
      <cell v-for="(item, index) in vipGradeList" :title="item.vipName" :value="item.isOpen==false?'已关闭':''" @click.native="openVipInfo(item)" :key="index" is-link></cell>
    </group>
    <actionsheet v-model="showmenus" :menus="menus" :close-on-clicking-mask="true" @on-click-menu="click" show-cancel></actionsheet>
    <popup v-model="isShowEdit"  is-transparent v-transfer-dom>
      <div flots="default" style="background-color:#fff;margin:10px;border-radius:5px;">
        <div class="jhy-padding-top-xs">
           <x-input title="名称" v-model="vipModel.vipName" placeholder="请输入VIP名称"></x-input>
           <!--<x-input title="金额" :is-type="isNumber" type="tel" placeholder="请输入VIP金额"></x-input>-->
           <x-switch title="是否开启" v-model="vipModel.isOpen"></x-switch>
           <x-textarea title="描述" v-model="vipModel.vipDesc" placeholder="请输入VIP描述"></x-textarea>
        </div>
        <div class="jhy-padding-horizontal jhy-padding-bottom">
          <x-button type="primary" class="jhy-background-success" @click.native="saveVipInfo" > 保存 </x-button>
        </div>
      </div>
    </popup>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import { Group, Cell, Actionsheet, XButton, Popup, XInput, XTextarea, XSwitch, TransferDomDirective as TransferDom } from 'vux'
import { mapGetters, mapActions } from 'vuex'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '@/feature/org/api'
import * as types from '../types'
export default {
  components: {
    Group, Cell, Actionsheet, XButton, DetailTabbar, Popup, XInput, XTextarea, XSwitch
  },
  data () {
    return {
      vipGradeList: [],
      showmenus: false,
      isShowEdit: false,
      menus: {
        manage: '管理用户',
        eidt: '编辑'
      },
      vipModel: {},
      itemModel: {},
      isNumber (value) {
        var valid = value === (value.match(/\d+(\.\d{0,2})?/) || [''])[0]
        return {
          valid,
          msg: '请输入正确的金额'
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      vipInfo: types.VIP_INFO
    })
  },
  mounted () {
    var orgId = this.$route.params.orgManagementId
    api.getVipSettingList({orgId}, (vipGradeList) => {
      this.vipGradeList = vipGradeList
    }, () => {})
  },
  methods: {
    ...mapActions({
      setVipInfo: types.SET_VIP_INFO
    }),
    openVipInfo (item) {
      this.showmenus = true
      this.itemModel = item
      this.vipModel.vipId = this.itemModel.vipId
      this.vipModel.vipName = this.itemModel.vipName
      this.vipModel.vipDesc = this.itemModel.vipDesc
      this.vipModel.isOpen = this.itemModel.isOpen
      this.setVipInfo({orgId: this.$route.params.orgManagementId, vipId: this.itemModel.vipId, vipName: this.itemModel.vipName})
    },
    saveVipInfo () {
      this.isShowEdit = false
      this.vipModel.orgId = this.$route.params.orgManagementId
      api.saveVipInfo(this.vipModel, () => {
        this.itemModel.vipId = this.vipModel.vipId
        this.itemModel.vipName = this.vipModel.vipName
        this.itemModel.vipDesc = this.vipModel.vipDesc
        this.itemModel.isOpen = this.vipModel.isOpen
        this.tools.successToast('保存成功')
      }, () => {})
    },
    click (key) {
      if (key === 'manage') {
        this.$router.push({name: 'orgVipUserList', params: {vipId: this.vipModel.vipId}})
      } else if (key === 'eidt') {
        this.isShowEdit = true
      }
    }
  },
  directives: {
    TransferDom
  }
}
</script>
