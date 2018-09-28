<template>
  <div v-title="title">
    <user-list :org-id="$route.params.orgManagementId" btn-value="添加" :ignoreVipId="$route.params.vipId" @item-btn-click="itemBtnClick"></user-list>
    <detail-tabbar ></detail-tabbar>
    <popup v-model="isShowModifyExpiryDate" is-transparent v-transfer-dom>
      <div flots="default" style="background-color:#fff;margin:10px;border-radius:5px;height:160px;padding-top:10px">
        <group :title="currentUser.userName">
          <datetime v-model="currentUser.expiryDate" :start-date="startDate" :max-year=2027 format="YYYY-MM-DD" title="有效截止日期" year-row="{value}年" month-row="{value}月" day-row="{value}日" confirm-text="完成" cancel-text="取消"></datetime>
        </group>
        <div class="jhy-padding-horizontal jhy-padding-bottom" style="margin-top:20px">
          <x-button type="primary" class="jhy-background-success" @click.native="saveExpiryDate" > 添加VIP用户 </x-button>
        </div>
      </div>
    </popup>
  </div>
</template>

<script>
import { XNumber, XButton, Popup, Group, TransferDomDirective as TransferDom, Toast, Datetime } from 'vux'
import UserList from '../components/UserList'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '@/feature/org/api'
import { mapGetters } from 'vuex'
import * as types from '../types'
export default {
  components: {
    DetailTabbar,
    UserList,
    XNumber,
    XButton,
    Popup,
    Group,
    Toast,
    Datetime
  },
  data () {
    return {
      title: '添加VIP',
      isShowModifyExpiryDate: false,
      currentUser: {}
    }
  },
  computed: {
    ...mapGetters({
      vipInfo: types.VIP_INFO
    })
  },
  created () {
    var orgId = this.$route.params.orgManagementId
    if (this.vipInfo.orgId === orgId) {
      this.title = '添加' + this.vipInfo.vipName
    }
  },
  methods: {
    itemBtnClick (val) {
      this.isShowModifyExpiryDate = true
      this.currentUser = val
    },
    saveExpiryDate () {
      if (this.currentUser.expiryDate === undefined) {
        this.tools.warnToast('请填写有效截止日期', '160px')
        return
      }
      let vip = {orgId: this.$route.params.orgManagementId, userId: this.currentUser.userId, vipId: this.$route.params.vipId, expiryDate: this.currentUser.expiryDate}
      api.addVip(vip, () => {
        this.isShowModifyExpiryDate = false
        this.$router.back()
        this.tools.successToast('添加成功')
      }, () => {
        this.tools.warnToast('添加失败')
      })
    }
  },
  directives: {
    TransferDom
  }
}
</script>
<style>
.popup0 {
  padding-bottom:15px;
  height:200px;
}
</style>
