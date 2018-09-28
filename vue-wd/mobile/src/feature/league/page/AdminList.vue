<template>
  <div>
    <scroller use-pullup lock-x height="-50" ref="scroller" @on-pullup-loading="loadMore" v-model="status">
      <div>
        <group>
          <cell title="邀请管理员" is-link :link="{name: 'leagueInviteAdmin'}"></cell>
        </group>
        <group>
          <cell v-for="(item, index) in inviteList" :key="index" :title="item.userName" is-link @click.native="showAuditView(index)" >
            <span class="jhy-text-xs" style="color:#8ebf52">对方已同意，待审核</span>
            <img slot="icon" :src="tools.cdn(item.userIcon, 'head.png', 128)" class="jhy-cell-img"></img>
          </cell>
          <cell v-for="(item, index) in list" :key="index" :title="item.userName" is-link @click.native="showManageView(index)" >
            <!--<span class="jhy-text-xs">管理</span>-->
            <img slot="icon" :src="tools.cdn(item.userIcon, 'head.png', 128)" class="jhy-cell-img" error-class="cell-img-error"></img>
          </cell>
        </group>
      </div>
      <div slot="pullup" style="position: absolute; width: 100%; height: 40px; margin-top:5px; text-align: center; font-size:16px;">
        <span v-show="status.pullupStatus === 'default'">{{ pullupStatusText }}</span>
        <span v-show="status.pullupStatus === 'loading'">加载中...</span>
      </div>
    </scroller>
    <actionsheet v-model="isShowActionsheet" :menus="menus" @on-click-menu="onAudit" show-cancel></actionsheet>
    <actionsheet v-model="isShowDeleteMenus" :menus="deleteMenus" @on-click-menu-delete="onDelete" show-cancel></actionsheet>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>

import { Cell, Group, XImg, Scroller, Actionsheet } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '@/feature/league/api'

export default {
  components: {
    Cell,
    Group,
    XImg,
    DetailTabbar,
    Scroller,
    Actionsheet
  },
  data () {
    return {
      status: {
        pullupStatus: 'default',
        pulldownStatus: 'default'
      },
      pullupStatusText: '',
      list: [],
      inviteList: [],
      isShowActionsheet: false,
      isShowDeleteMenus: false,
      menus: {},
      selectIndex: 0,
      deleteMenus: {},
      isHasMore: true
    }
  },
  mounted () {
    this.getInviteList()
  },
  methods: {
    loadMore () {
      if (this.isHasMore) {
        this.getAdminList()
      } else {
        this.pullupStatusText = '没有更多了'
        this.$nextTick(() => {
          this.$refs.scroller.donePullup()
          this.$refs.scroller.reset()
        })
      }
    },
    getAdminList () {
      var leagueId = this.$route.params.leagueId
      api.getAdminList({leagueId, rowStart: this.list.length, rowCount: 20}, (data) => {
        this.list.push(...data)
        // var a = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
        // this.list.push(...a)
        if (data.length === 0) {
          this.pullupStatusText = '没有更多了'
          this.isHasMore = false
        }
        this.$nextTick(() => {
          this.$refs.scroller.donePullup()
          this.$refs.scroller.reset()
        })
      }, () => {})
    },
    getInviteList () {
      var leagueId = this.$route.params.leagueId
      api.getInviteList({leagueId}, (data) => {
        this.inviteList.push(...data)
        this.getAdminList()
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
    showManageView (index) {
      this.isShowActionsheet = true
      this.selectIndex = index
      this.menus = {
        auth: '修改权限',
        delete: '删除管理员'
      }
      console.log('this.selectIndex', this.selectIndex)
    },
    onAudit (key) {
      if (key === 'agree') {
        this.inviteApproval(true)
      } else if (key === 'reject') {
        this.inviteApproval(false)
      } else if (key === 'auth') {
        var userId = this.list[this.selectIndex].userId
        var leagueId = this.$route.params.leagueId
        this.$router.push({name: 'leagueAuthManager', params: {leagueId, leagueManagerId: userId}})
      } else if (key === 'delete') {
        var userName = this.list[this.selectIndex].userName
        this.deleteMenus = {
          'title.noop': '您确定删除“' + userName + '”吗?<br/>',
          delete: '<span style="color:red">删除</span>'
        }
        this.isShowDeleteMenus = true
      }
    },
    inviteApproval (status) {
      var inviteId = this.inviteList[this.selectIndex].inviteId
      var leagueId = this.$route.params.leagueId
      api.inviteApproval({leagueId, inviteId, status}, () => {
        if (status) {
          this.list.push(this.inviteList[this.selectIndex])
          this.inviteList.splice(this.selectIndex, 1)
          this.tools.successToast('管理员设置成功')
        } else {
          this.inviteList.splice(this.selectIndex, 1)
          this.tools.successToast('拒绝成功')
        }
      }, () => {})
    },
    onDelete () {
      var managerId = this.list[this.selectIndex].userId
      var leagueId = this.$route.params.leagueId
      api.delManager({leagueId, managerId}, () => {
        this.list.splice(this.selectIndex, 1)
        this.tools.successToast('删除成功')
      }, () => {})
    }
  }
}
</script>
