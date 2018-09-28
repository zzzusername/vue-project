<template>
  <div style="padding-bottom:62px;box-sizing: border-box;">
    <div style="width: 100%;padding: 10px 0px;position: fixed; bottom: 0;z-index: 1000;background: #f6f6f6;">
      <x-button style="width: 90%;display:block;" text="添加业务员" type="primary" @click.native="addSalesman"></x-button>
    </div>
    <group gutter="0">
      <cell v-for="(item, index) in list" :key="index" is-link @click.native="onItemClick(item, index)">
        <div slot="icon" class="sales_manage_img" :style="{'background-image':'url('+tools.cdn(item.userIcon, 'head.png', 128)+')'}"></div>
        <span slot="title">{{item.salesmanName}}</span>
        <span class="agent-copy-span" slot="inline-desc" v-if="item.salesmanPhone !== null && item.salesmanPhone !== undefined">手机号：{{item.salesmanPhone}}</span>
      </cell>
    </group>
    <div v-transfer-dom>
      <confirm v-model="showConfirm" title="操作提示" @on-cancel="showConfirm = false" @on-confirm="onConfirm">
        <p style="text-align:center;color:red;">您确认删除吗？</p>
      </confirm>
    </div>
    <actionsheet v-model="showMenu" :menus="managemenus" @on-click-menu="menuClick" show-cancel></actionsheet>
  </div>
</template>

<script>
import { Confirm, Group, Cell, XButton, Actionsheet, TransferDomDirective as TransferDom } from 'vux'
import api from '../api'
export default {
  directives: {
    TransferDom
  },
  components: {
    Confirm, Group, Cell, XButton, Actionsheet
  },
  data () {
    return {
      showConfirm: false,
      list: [],
      managemenus: {
        review: '查看',
        change: '修改',
        delete: '<p style="color:red;">删除</p>'
      },
      showMenu: false,
      currentItem: {},
      num: 0,
      salesScrollerHeight: 0
    }
  },
  mounted () {
    this.getSalesManList()
  },
  methods: {
    addSalesman () {
      this.$router.push({name: 'agentSalesmanAdd'})
    },
    onItemClick (item, index) {
      this.num = index
      this.currentItem = item
      this.showMenu = true
    },
    menuClick (val) {
      if (val === 'review') {
        this.$router.push({name: 'agentSalesmanInfo', params: {salesmanId: this.currentItem.salesmanId}})
      } else if (val === 'change') {
        this.$router.push({name: 'agentSalesmanEdit', params: {salesmanId: this.currentItem.salesmanId}})
      } else if (val === 'delete') {
        this.showConfirm = true
      }
    },
    getSalesManList() {
      api.getSalesManList((data) => {
        this.list = data
      }, (er) => {})
    },
    onConfirm () {
      api.deleteSalesman({salesmanId: this.currentItem.salesmanId}, (data) => {
        this.tools.successToast('删除成功！')
        this.list.splice(this.num, 1)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message, '180px')
        } else {
          this.tools.warnToast('删除失败')
        }
      })
    }
  }
}
</script>

<style>
.sales_manage_img {
  width: 12vw;
  height:12vw;
  display: inline-block;
  border-radius: 2vw;
  margin-right: 10px;
  background-position: center center;
  background-size: cover;
  border-style:none;
  border-width:0;
  vertical-align:middle;
}
.agent-copy-span{
  -webkit-touch-callout:default !important;  /*系统默认菜单被禁用*/
  -webkit-user-select:all !important; /*webkit浏览器*/ 
  user-select:all !important;   
}
</style>
