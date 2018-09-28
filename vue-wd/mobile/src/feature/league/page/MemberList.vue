<template>
  <div>
    <group>
      <cell :title="title" is-link @click.native="onInvite"></cell>
    </group>
    <group>
      <cell v-for="(item, index) in inviteList" :key="index" :title="item.orgName" is-link @click.native="showAuditView(index)" >
        <span class="jhy-text-xs" style="color:#8ebf52">对方已申请入联盟，待审核</span>
        <img slot="icon" :src="tools.cdn(item.orgLogo)" class="jhy-cell-img" error-class="org-cell-img-error"></img>
      </cell>
      <cell v-for="(item, index) in list" :key="index" :title="item.orgName" :is-link="isLink" @click.native="onManage(index)">
        <img slot="icon" :src="tools.cdn(item.orgLogo)" class="jhy-cell-img" error-class="org-cell-img-error"></img>
      </cell>
    </group>
    <actionsheet v-model="isShowActionsheet" :menus="menus" @on-click-menu="onAudit" show-cancel></actionsheet>
    <actionsheet v-model="isShowDeleteMenus" :menus="deleteMenus" @on-click-menu-delete="onDelete" show-cancel></actionsheet>
    <actionsheet v-model="isShowAddMenus" :menus="addMenus" @on-click-menu="onAddQun" show-cancel></actionsheet>
    <detail-tabbar ></detail-tabbar>
  </div>
</template>

<script>

import { Cell, Group, XImg, Actionsheet } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '@/feature/league/api'

export default {
  components: {
    Cell,
    Group,
    XImg,
    DetailTabbar,
    Actionsheet
  },
  data () {
    return {
      list: [],
      inviteList: [],
      isShowActionsheet: false,
      isShowDeleteMenus: false,
      menus: {},
      selectIndex: 0,
      deleteMenus: {},
      isPublic: false,
      title: '',
      isLink: true,
      addMenus: {
        invite: '邀请群',
        add: '添加群'
      },
      isShowAddMenus: false
    }
  },
  mounted () {
    api.getLeagueInfo({leagueId: this.$route.params.leagueId}, (data) => {
      this.isPublic = data.isPublic
      // if (this.isPublic) {
      //   this.title = '邀请新联盟成员'
      //   // this.isLink = false
      // } else {
      //   this.title = '添加群为联盟成员'
      //   // this.isLink = true
      // }
      this.title = '添加群成员'
    }, () => {})
    this.getInviteList()
  },
  methods: {
    onInvite () {
      var leagueId = this.$route.params.leagueId
      // api.createMemberInvite({leagueId}, (data) => {
      //   console.log('data', data)
      //   this.$router.push({name: 'leagueInviteMemberPage', params: {inviteId: data.inviteId, inviteCode: data.inviteCode}})
      // }, () => {})
      if (this.isPublic) {
        this.isShowAddMenus = true
        // this.$router.push({name: 'leagueInviteMemberPage', params: {leagueId}})
      } else {
        this.$router.push({name: 'leagueAuthOrg', params: {leagueId}})
      }
    },
    getMemberList () {
      var leagueId = this.$route.params.leagueId
      api.getMemberList({leagueId}, (data) => {
        this.list = data
      }, () => {})
    },
    getInviteList () {
      var leagueId = this.$route.params.leagueId
      api.getMemberInviteList({leagueId}, (data) => {
        this.inviteList.push(...data)
        this.getMemberList()
      }, () => {})
    },
    showAuditView (index) {
      this.isShowActionsheet = true
      this.selectIndex = index
      this.menus = {
        agree: '同意',
        reject: '拒绝'
      }
      console.log('this.selectIndex', this.selectIndex)
    },
    onAudit (key) {
      if (key === 'agree') {
        this.inviteApproval(true)
      } else if (key === 'reject') {
        this.inviteApproval(false)
      }
    },
    inviteApproval (status) {
      var inviteId = this.inviteList[this.selectIndex].inviteId
      var leagueId = this.$route.params.leagueId
      api.memberInviteApproval({leagueId, inviteId, status}, (data) => {
        if (status) {
          this.list.push(this.inviteList[this.selectIndex])
          this.inviteList.splice(this.selectIndex, 1)
          this.tools.successToast('审核通过')
        } else {
          this.inviteList.splice(this.selectIndex, 1)
          this.tools.successToast('拒绝成功')
        }
      }, () => {})
    },
    onDelete () {
      var item = this.list[this.selectIndex]
      api.delMember({leagueId: this.$route.params.leagueId, orgId: item.orgId}, (data) => {
        this.list.splice(this.selectIndex, 1)
        this.tools.successToast('删除成功')
      }, () => {
        this.tools.warnToast('删除失败')
      })
    },
    onManage (index) {
      this.selectIndex = index
      var item = this.list[index]
      if (this.isLink) {
        this.deleteMenus = {
          'title.noop': '您确定删除“' + item.orgName + '”吗?<br/>',
          delete: '<span style="color:red">删除</span>'
        }
        this.isShowDeleteMenus = true
      }
    },
    onAddQun (key) {
      var leagueId = this.$route.params.leagueId
      if (key === 'invite') {
        this.$router.push({name: 'leagueInviteMemberPage', params: {leagueId}})
      } else if (key === 'add') {
        this.$router.push({name: 'leagueAuthOrg', params: {leagueId}})
      }
    }
  }
}
</script>

<style>
.org-cell-img-error {
  background-image: url("../../../assets/logo.png") no-repeat;
  background-size: 100% 100% !important;
}
</style>
