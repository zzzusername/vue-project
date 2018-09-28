<template>
  <div>
    <scroller lock-x height="-50" use-pullup :pullup-config="pullUpConfig" @on-pullup-loading="loadMore" ref="scroller">
      <div>
        <group v-if="list.length>0" gutter="0">
          <cell v-for="(item, index) in list" :key="index" :title="item.guideTitle" @click.native="skipDetail(index)">
            <div slot="icon" class="admission_list_img" :style="{'background-image':'url('+tools.cdn(item.guideImg, 'logo.png')+')'}" src=""></div>
            <p slot="inline-desc" style="color:#666;fontSize:14px;margin-top:2.5vw"><span>{{item.applyCount}}人报名</span> <label style="float:right;background:#a2d268;color:#fff;font-size:12px;padding:1px 3px 1px 3px;border-radius: 5px;">进行中</label></p>
          </cell>
        </group>
        <group v-if="expireList.length>0" title="历史招生">
          <cell v-for="(item, index) in expireList" :key="index" :title="item.guideTitle" @click.native="skipDetail(index, 2)">
            <div slot="icon" class="admission_list_img" :style="{'background-image':'url('+tools.cdn(item.guideImg, 'logo.png')+')'}" src=""></div>
            <p slot="inline-desc" style="color:#666;fontSize:14px;margin-top:2.5vw">{{getFormateDate(item.closeDate)}} <label style="float:right;background:#d2d2d2;color:#fff;font-size:12px;padding:1px 3px 1px 3px;border-radius: 5px;">已结束</label></p>
          </cell>
        </group>
        <p v-if="list.length==0" style="textAlign:center;marginTop:20px;color:#999;font-size:14px">没有任何招生信息～</p>
      </div>
    </scroller>
    <actionsheet v-model="showMenu" :menus="managemenus" @on-click-menu="menuClick" show-cancel></actionsheet>
    <actionsheet v-model="isShowDeleteMenus" :menus="deleteMenus" @on-click-menu-delete="onDelete" show-cancel></actionsheet>
    <detail-tabbar :actionLink="onPublish" :actions="actions"></detail-tabbar>
  </div>
</template>

<script>
import DetailTabbar from '@/components/DetailTabbar.vue'
import OrgHand from '@/feature/org/components/OrgHand.vue'
import { Group, Cell, Scroller, dateFormat, Actionsheet } from 'vux'
import api from '@/feature/admission/api'
export default {
  components: {
    DetailTabbar, OrgHand, Scroller, Group, Cell, dateFormat, Actionsheet
  },
  data () {
    return {
      actions: [
        {
          name: '发布招生',
          code: 'publish'
        }
      ],
      list: [],
      expireList: [],
      pullUpConfig: {
        content: '',
        downContent: '松开进行加载',
        upContent: '上拉加载更多',
        loadingContent: '加载中...'
      },
      managemenus: {
        preview: '预览',
        change: '修改',
        manage: '管理',
        push: '推送',
        delete: '删除'
      },
      showMenu: false,
      currentItem: null,
      deleteMenus: null,
      isShowDeleteMenus: false
    }
  },
  mounted () {
    // 查询进行中的
    api.getManagerAdmissionList({orgId: this.$route.params.orgManagementId, leagueId: this.$route.params.leagueId, status: 1}, (data) => {
      this.list = data
      this.$nextTick(() => {
        this.$refs.scroller.reset()
      })
      // 查询历史的
      this.loadExpireData()
    }, () => {
      this.$refs.scroller.disablePullup()
    })
  },
  methods: {
    getFormateDate (time) {
      return dateFormat(time, 'YYYY-MM-DD')
    },
    onPublish () {
      if (this.tools.isNull(this.$route.params.leagueId)) {
        this.$router.push({name: 'admissionOrgPublish'})
      } else {
        this.$router.push({name: 'admissionLeaguePublish'})
      }
    },
    skipDetail (index, type) {
      this.selectIndex = index
      if (type === 2) { // 已结束
        this.currentItem = this.expireList[this.selectIndex]
        this.managemenus = {
          preview: '预览',
          manage: '管理',
          delete: '删除'
        }
      } else {
        this.currentItem = this.list[this.selectIndex]
        this.managemenus = {
          preview: '预览',
          change: '修改',
          manage: '管理',
          push: '推送',
          delete: '删除'
        }
      }
      this.showMenu = true
    },
    loadExpireData () {
      api.getManagerAdmissionList({orgId: this.$route.params.orgManagementId, leagueId: this.$route.params.leagueId, status: 2, rowStart: this.expireList.length, rowCount: 20}, (data) => {
        this.expireList.push(...data)
        this.$nextTick(() => {
          this.$refs.scroller.reset()
        })
        if (data.length === 0 || data.length < 20) {
          this.$refs.scroller.disablePullup()
        } else {
          this.$refs.scroller.donePullup()
        }
      }, () => {})
    },
    loadMore () {
      this.loadExpireData()
    },
    menuClick (key) {
      switch (key) {
        case 'preview':
          var orgManagementId = this.$route.params.orgManagementId
          if (orgManagementId !== undefined) {
            this.$router.push({name: 'admissionOrgManageDetail', params: {orgManagementId: orgManagementId, admissionId: this.currentItem.guideId}})
          }
          var leagueId = this.$route.params.leagueId
          if (leagueId !== undefined) {
            this.$router.push({name: 'admissionLeagueManageDetail', params: {leagueId: leagueId, admissionId: this.currentItem.guideId}})
          }
          break
        case 'change':
          if (this.$route.params.orgManagementId !== undefined) {
            this.$router.push({name: 'admissionOrgEdit', params: {orgManagementId: this.$route.params.orgManagementId, admissionId: this.currentItem.guideId}})
          }
          if (this.$route.params.leagueId !== undefined) {
            this.$router.push({name: 'admissionLeagueEdit', params: {leagueId: this.$route.params.leagueId, admissionId: this.currentItem.guideId}})
          }
          break
        case 'manage':
          if (this.$route.params.orgManagementId !== undefined) {
            this.$router.push({name: 'admissionOrgStuation', params: {orgManagementId: this.$route.params.orgManagementId, admissionId: this.currentItem.guideId}})
          }
          if (this.$route.params.leagueId !== undefined) {
            this.$router.push({name: 'admissionLeagueStuation', params: {leagueId: this.$route.params.leagueId, admissionId: this.currentItem.guideId}})
          }
          // this.$router.push({name: 'admissionStuation'})
          break
        case 'push':
          api.pushAdmission({orgId: this.$route.params.orgManagementId, leagueId: this.$route.params.leagueId, guideId: this.currentItem.guideId}, (val) => {
            this.tools.successToast('推送成功')
          }, (val) => {
            if (val.toUser) {
              this.tools.warnToast(val.message, '170px')
            } else {
              this.tools.warnToast('推送失败')
            }
          })
          break
        case 'delete':
          this.deleteMenus = {
            'title.noop': '您确定删除“' + this.currentItem.guideTitle + '”吗?<br/>',
            delete: '<span style="color:red">删除</span>'
          }
          this.isShowDeleteMenus = true
          break
      }
    },
    onDelete () {
      api.deleteAdmission({orgId: this.$route.params.orgManagementId, leagueId: this.$route.params.leagueId, guideId: this.currentItem.guideId}, (data) => {
        if (this.currentItem.guideStatus === 2) {
          this.expireList.splice(this.selectIndex, 1)
        } else if (this.currentItem.guideStatus === 1) {
          this.list.splice(this.selectIndex, 1)
        }
        this.tools.successToast('删除成功')
      }, () => {
        this.tools.warnToast('删除失败')
      })
    }
  }
}
</script>

<style>
.admission_list_img {
  width: 19vw;
  height:14vw;
  display: block;
  border-radius: 2px;
  margin-right: 10px;
  background-position: center center;
  background-size: cover;
  border-style:none;
  border-width:0;
}
</style>

