<template>
  <div>
    <group>
      <cell title="开启更多联盟功能" :link="{name: 'leagueFeatureSetting'}"></cell>
    </group>
    <checklist v-if="list.length>0" title="请授权以下联盟功能邀请管理员" style="marginBottom:42px;" label-position="left" :options="list" v-model="listValue" @on-change="onChange"></checklist>
    <div v-else style="font-size:16px;margin:5px">您还没有开启联盟功能，无法邀请管理员。</div>
    <tabbar style="position:fixed">
      <tabbar-item @on-item-click="onBack()">
        <span slot="label" >返回</span>
      </tabbar-item>
      <tabbar-item @on-item-click="onInvite()" style="background-color:#8ebf52">
        <span slot="label" style="color:#fff">立即邀请管理员</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>

<script>
import { Checklist, Tabbar, TabbarItem, XButton, Blur, Cell, Group } from 'vux'
import api from '@/feature/league/api'

export default {
  components: {
    Checklist,
    Tabbar,
    TabbarItem,
    XButton,
    Blur,
    Cell,
    Group
  },
  data () {
    return {
      inviteId: 0,
      inviteCode: '',
      isShowButton: true,
      submitBtnText: '提交',
      list: [],
      listValue: [],
      listName: [],
      inviteInfo: {}
    }
  },
  mounted () {
    var leagueId = this.$route.params.leagueId
    api.getLeagueFeatureList({leagueId}, (data) => {
      data.forEach((element) => {
        var item = {}
        item.key = element.featureId
        item.value = element.fName
        if (element.isExist) {
          this.list.push(item)
        }
      })
    }, () => {})
  },
  methods: {
    onBack () {
      this.$router.push({name: 'leagueAdminList'})
    },
    onInvite () {
      if (this.listValue.length === 0) {
        this.tools.warnToast('请选择功能')
        return
      }
      this.listValue.forEach((featureId) => {
        this.list.forEach((item) => {
          if (item.key === featureId) {
            this.listName.push(item.value)
          }
        })
      })
      console.log('listName', this.listName)
      var leagueId = this.$route.params.leagueId
      api.createInvite({leagueId, params: this.listValue}, (data) => {
        this.inviteCode = data.inviteCode
        this.inviteId = data.inviteId
        this.isShowButton = false
        this.$router.replace({name: 'leagueInviteAdminPage', params: {inviteId: this.inviteId, inviteCode: this.inviteCode}})
      }, () => {})
    },
    onChange (val) {
      this.listValue = val
      console.log('change', this.listValue)
    }
  }
}
</script>

<style>
.demo5-item {
  width: 100px;
  height: 26px;
  line-height: 26px;
  text-align: center;
  border-radius: 3px;
  border: 1px solid #ccc;
  background-color: #fff;
  margin-right: 10px;
  margin-bottom: 10px;
}
.demo5-item-selected {
  /*background: #ffffff url(../../../assets/active.png) no-repeat right bottom;*/
  border-color: #FF6D56;
}

</style>
