<template>
  <div>
    <group>
      <cell title="用户名" :value="userInfo.userName"></cell>
      <cell title="当前所在群" :value="userInfo.orgName"></cell>
    </group>
    <group>
      <cell title="当前群用户等级" :value="userInfo.levelName"></cell>
      <cell title="当前群所得积分" :value="userInfo.score"></cell>
      <cell v-show="list.length>0" title="当前群VIP等级" :value="userInfo.vipName" ></cell>
    </group>
    <group v-show="list.length>0">
      <cell v-for="(item, index) in list" :key="index" :title="item.vipName" :inline-desc="item.vipDesc">
        <x-button class="level-cell-btn" plain type="primary" @click.native="onItemClick">{{item.btnTitle}}</x-button>
      </cell>
    </group>
    <alert v-model="show" @on-show="onShow" @on-hide="onHide">请联系群主变更或续费VIP</alert>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import {Group, Cell, XButton, Alert} from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '@/feature/org/api'
export default {
  components: {
    Group,
    Cell,
    XButton,
    Alert,
    DetailTabbar
  },
  data () {
    return {
      list: [],
      userInfo: {},
      show: false
    }
  },
  mounted () {
    var orgId = this.$route.params.orgId
    api.getUserInfo({orgId: this.$route.params.orgId}, (data) => {
      this.userInfo = data
      api.getVipList({orgId}, (data) => {
        for (var i = data.length - 1; i >= 0; i--) {
          var item = data[i]
          if (item.isOpen === false) {
            data.splice(i, 1)
            continue
          }
          if (this.userInfo.vipId === null) {
            item.btnTitle = '办理'
          } else if (item.vipId === this.userInfo.vipId) {
            item.btnTitle = '续期'
          } else {
            item.btnTitle = '变更'
          }
        }
        this.list = data
      }, () => {})
    }, () => {})
  },
  methods: {
    onItemClick () {
      this.show = true
    }
  }
}
</script>

<style>
.level-cell-btn{
  width:55px !important; 
  height:32px; 
  line-height:32px;
  font-size: 12px;
  color: #8ebf52;
  border: 1px solid #8ebf52;
}
</style>
