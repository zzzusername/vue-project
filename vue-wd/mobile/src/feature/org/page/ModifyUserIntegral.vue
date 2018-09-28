<template>
  <div>
    <user-list :org-id="$route.params.orgManagementId" btn-value="修改积分" @item-btn-click="itemBtnClick"></user-list>
    <popup v-model="isShowModifyIntegral" is-transparent v-transfer-dom>
      <div flots="default" style="background-color:#fff;margin:10px;border-radius:5px;height:190px;padding-top:10px">
        <group title="增加积分或减少积分" style="margin:15px">
          <x-number v-model="scoreValue" title="积分数" fillable style="margin-top:10px;margin-bottom:10px"></x-number>
        </group>
        <div class="jhy-padding-horizontal jhy-padding-bottom" style="background-color: #fff">
          <x-button type="primary" class="jhy-background-success" @click.native="modifyScore" > 变更 </x-button>
        </div>
      </div>
    </popup>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import { XNumber, XButton, Popup, Group, TransferDomDirective as TransferDom } from 'vux'
import UserList from '../components/UserList'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '@/feature/org/api'

export default {
  components: {
    DetailTabbar,
    UserList,
    XNumber,
    XButton,
    Popup,
    Group
  },
  data () {
    return {
      isShowModifyIntegral: false,
      show: false,
      currentUser: {},
      scoreValue: 0
    }
  },
  methods: {
    itemBtnClick (val) {
      this.currentUser = val
      this.scoreValue = 0
      this.isShowModifyIntegral = true
    },
    modifyScore () {
      api.modifyScore({orgId: this.$route.params.orgManagementId, userId: this.currentUser.userId, score: this.scoreValue}, () => {
        this.isShowModifyIntegral = false
        this.currentUser.score = this.currentUser.score + this.scoreValue
        this.tools.successToast('积分修改成功')
      }, () => {
        this.tools.successToast('积分修改失败')
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
