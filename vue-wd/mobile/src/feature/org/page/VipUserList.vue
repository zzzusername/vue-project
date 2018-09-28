<template>
  <div>
    <scroller use-pullup lock-x height="-50" ref="scroller" @on-pullup-loading="loadMore" v-model="status"
      :pullup-config="{content:'加载更多',downContent:'松开加载更多',upContent:'加载更多',loadingContent:'努力加载中...'}">
      <div>
        <group>
          <cell :title="title" is-link :link="{name: 'orgVipUserAdd'}"></cell>
        </group>
        <group v-if="userList !== null && userList.length > 0" title="VIP用户">
          <cell v-for="item in userList" :key="item.userId" :title="item.userName" :inline-desc="'有效截止日期：' + item.expiryDate" @click.native="onShowMenu(item)" is-link>
            <img slot="icon" width="40" style="display:block;margin-right:5px;" :src="tools.cdn(item.userIcon)">
          </cell>
        </group>
      </div>
      <div slot="pullup" style="position: absolute; width: 100%; height: 40px; text-align: center; font-size:16px;">
        <span v-show="status.pullupStatus === 'default'">{{ pullupStatusText }}</span>
        <!--<span class="pullup-arrow" v-show="status.pullupStatus === 'down' || status.pullupStatus === 'up'" :class="{'rotate': status.pullupStatus === 'up'}">↑</span>-->
        <span v-show="status.pullupStatus === 'loading'">加载中...</span>
      </div>
    </scroller>
    <detail-tabbar></detail-tabbar>
    <actionsheet v-model="isShowActionsheet" :menus="menus" @on-click-menu="onClickMenu" show-cancel></actionsheet>
    <actionsheet v-model="showmenus" :menus="delMenus" @on-click-menu-delete="onDelete" show-cancel></actionsheet>

    <popup v-model="isShowModifyExpiryDate" is-transparent v-transfer-dom>
      <div flots="default" style="background-color:#fff;margin:10px;border-radius:5px;height:150px;padding-top:10px">
        <datetime style="margin-top:20px" v-model="currentUserExpiryDate" :start-date="startDate" :max-year=2027 format="YYYY-MM-DD" title="有效截止日期" year-row="{value}年" month-row="{value}月" day-row="{value}日" confirm-text="完成" cancel-text="取消"></datetime>
        <div class="jhy-padding-horizontal jhy-padding-bottom" style="margin-top:20px">
          <x-button type="primary" class="jhy-background-success" @click.native="saveExpiryDate" > 保存 </x-button>
        </div>
      </div>
    </popup>
  </div>
</template>

<script>
  import { Cell, Group, Scroller, Actionsheet, Toast, TransferDomDirective as TransferDom, Datetime, Popup, XButton, dateFormat } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import api from '@/feature/org/api'
  import { mapGetters } from 'vuex'
  import * as types from '../types'

  export default {
    components: {
      Cell, Group, DetailTabbar, Scroller, Actionsheet, Toast, Datetime, Popup, XButton
    },
    data () {
      return {
        userList: [],
        title: '添加VIP',
        status: {
          pullupStatus: 'default',
          pulldownStatus: 'default'
        },
        pullupStatusText: '',
        rowCount: 20,
        showmenus: false,
        delMenus: {},
        menus: {
          modify: '修改有效期',
          delete: '删除'
        },
        currentUser: {},
        isShowActionsheet: false,
        isShowModifyExpiryDate: false,
        startDate: dateFormat(new Date(), 'YYYY-MM-DD'),
        currentUserExpiryDate: ''
      }
    },
    computed: {
      ...mapGetters({
        vipInfo: types.VIP_INFO
      })
    },
    mounted () {
      var orgId = this.$route.params.orgManagementId
      if (this.vipInfo.orgId === orgId) {
        this.title = '添加' + this.vipInfo.vipName
      }
      this.gitUserList(this.userList.length, (userList) => {
        this.userList.push(...userList)
      })
    },
    methods: {
      gitUserList (rowStart, callback) {
        var orgId = this.$route.params.orgManagementId
        api.getUserList({orgId, rowStart, rowCount: this.rowCount, vipId: this.$route.params.vipId}, (userList) => {
          userList.forEach(function(element) {
            element.expiryDate = dateFormat(element.vipExpiryDate, 'YYYY-MM-DD')
            console.log('aaaa', element.expiryDate)
          }, this)
          callback(userList)
        }, () => {})
      },
      loadMore () {
        this.gitUserList(this.userList.length, (userList) => {
          this.userList.push(...userList)
          if (userList.length === 0) {
            this.pullupStatusText = '没有更多了'
          }
          this.$nextTick(() => {
            this.$refs.scroller.donePullup()
            this.$refs.scroller.reset()
          })
        })
      },
      onShowMenu (user) {
        this.currentUser = user
        this.currentUserExpiryDate = this.currentUser.expiryDate
        this.isShowActionsheet = true
      },
      onDelete () {
        var orgId = this.$route.params.orgManagementId
        api.deleteVip({orgId, userId: this.currentUser.userId}, () => {
          for (var i = 0; i < this.userList.length; i++) {
            var element = this.userList[i]
            if (element.userId === this.currentUser.userId) {
              this.userList.splice(i, 1)
            }
          }
          this.userList.forEach((element) => {
            if (element.userId === this.currentUser.userId) {
              var index = this.userList.indexOf(element)
              if (index > -1) {
                this.userList.splice(index, 1)
              }
            }
          })
          this.tools.successToast('删除成功')
        }, () => {
          this.tools.warnToast('删除失败')
        })
      },
      onClickMenu (val) {
        if (val === 'delete') {
          this.delMenus = {
            'title.noop': '您确定删除“' + this.currentUser.userName + '”吗?<br/>',
            delete: '<span style="color:red">删除</span>'
          }
          this.showmenus = true
        } else if (val === 'modify') {
          this.isShowModifyExpiryDate = true
        }
      },
      saveExpiryDate () {
        let vip = {orgId: this.$route.params.orgManagementId, userId: this.currentUser.userId, vipId: this.$route.params.vipId, expiryDate: this.currentUserExpiryDate}
        api.addVip(vip, () => {
          this.currentUser.expiryDate = dateFormat(this.currentUserExpiryDate, 'YYYY-MM-DD')
          this.currentUser.vipExpiryDate = this.currentUserExpiryDate
          this.tools.successToast('修改成功')
          this.isShowModifyExpiryDate = false
        }, () => {
          this.tools.warnToast('修改失败')
        })
      }
    },
    directives: {
      TransferDom
    }
  }
</script>

<style>

</style>
