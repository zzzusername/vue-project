<template>
  <div>
    <flexbox style='height:50px;background:#fff;border-bottom: 0.15vw solid #D9D9D9;font-size:16px' :gutter="0">
      <flexbox-item :span="159/320"><div class="tab-item-sel">报名审核</div></flexbox-item>
      <flexbox-item style="minWidth: 1px;"><div class="tab-divider"></div></flexbox-item>
      <flexbox-item :span="160/320" @click.native="selectLeagueTab()"><div class="tab-item">核销统计</div></flexbox-item>
    </flexbox>
    <group style="height:8vw;">
      <div class="tab-div" v-bind:style="{ color:divColor1}" v-on:click="untreated">未审核({{auditCount.noCheck}}人)</div>
      <div class="tab-div" v-bind:style="{ color:divColor2}" v-on:click="onApproved">已审核({{auditCount.checked}}人)</div>
      <div class="tab-div" v-bind:style="{ color:divColor3}" v-on:click="onRefused">已拒绝({{auditCount.refused}}人)</div>
    </group>
    <scroller style="background:#fff" lock-x use-pullup :pullup-config="pullUpConfig" height="-140" v-if="checkStatus === 1" ref="scroller" @on-pullup-loading="loadMore">
      <div>
        <cell v-if="unAuditList.length>0" v-for="item in unAuditList" :key="item.orgId" :title="item.signName + '  ' + item.signPhoneNum" :inline-desc="getFormateTime(item.signDate) + ' ' + isOrgMember(item.inOrg)" style="font-size: 16px;" @click.native="skipInfo(item)" is-link>
          <x-img slot="icon" :src="tools.cdn(item.userIcon)" class="cell-img" error-class="cell-img-error"></x-img>
        </cell>
        <p v-if="unAuditList.length==0" style="textAlign:center;marginTop:20px;color:#999;font-size:14px">无人参与活动～</p>
      </div>
    </scroller>
    <scroller style="background:#fff" lock-x use-pullup :pullup-config="pullUpConfig" height="-140" v-else-if="checkStatus === 3" ref="scroller" @on-pullup-loading="loadMore">
      <div>
        <cell v-for="item in auditedList" :key="item.orgId" :title="item.signName + '  ' + item.signPhoneNum" :inline-desc="getFormateTime(item.signDate) + ' ' + isOrgMember(item.inOrg)" style="font-size: 16px;">
          <x-img slot="icon" :src="tools.cdn(item.userIcon)" class="cell-img" error-class="cell-img-error"></x-img>
        </cell>
        <p v-if="auditedList.length==0" style="textAlign:center;marginTop:20px;color:#999;font-size:14px">快去审核吧～</p>
      </div>
    </scroller>
    <scroller style="background:#fff" lock-x use-pullup :pullup-config="pullUpConfig" height="-140" v-else-if="checkStatus === 2" ref="scroller" @on-pullup-loading="loadMore">
      <div>
        <cell v-for="item in refuseList" :key="item.orgId" :title="item.signName + '  ' + item.signPhoneNum" :inline-desc="getFormateTime(item.signDate) + ' ' + isOrgMember(item.inOrg)" style="font-size: 16px;">
          <x-img slot="icon" :src="tools.cdn(item.userIcon)" class="cell-img" error-class="cell-img-error"></x-img>
        </cell>
        <p v-if="refuseList.length==0" style="textAlign:center;marginTop:20px;color:#999;font-size:14px">无人被拒绝～</p>
      </div>
    </scroller>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import { Cell, Group, XButton, Flexbox, FlexboxItem, XImg, Popup, Scroller, TransferDom, dateFormat } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '@/feature/activity/api'
export default {
  directives: {
    TransferDom
  },
  components: {
    Cell, Group, DetailTabbar, XButton, Flexbox, FlexboxItem, XImg, Popup, Scroller
  },
  data () {
    return {
      unAuditList: [],
      auditedList: [],
      refuseList: [],
      checkStatus: 1,
      pullUpConfig: {
        content: '',
        downContent: '松开进行加载',
        upContent: '上拉加载更多',
        loadingContent: '加载中...'
      },
      divColor1: '#8ebf52',
      divColor2: '#666',
      divColor3: '#666',
      auditCount: {
        noCheck: 0,
        checked: 0,
        refused: 0
      }
    }
  },
  methods: {
    untreated () {
      console.log('untreated', this.unAuditList)
      this.tabColor(1)
      this.checkStatus = 1
      if (this.unAuditList.length === 0) {
        this.getList(this.checkStatus, 0, (list) => {
          this.unAuditList = list
          if (list.length === 0 || list.length < 20) {
            this.$refs.scroller.disablePullup()
          } else {
            this.$refs.scroller.donePullup()
          }
          this.scrollerRest2Top()
        })
      } else {
        this.scrollerRest2Top()
      }
    },
    onApproved () {
      console.log('onApproved', this.auditedList)
      this.tabColor(2)
      this.checkStatus = 3
      if (this.auditedList.length === 0) {
        this.getList(this.checkStatus, 0, (list) => {
          this.auditedList = list
          if (list.length === 0 || list.length < 20) {
            this.$refs.scroller.disablePullup()
          } else {
            this.$refs.scroller.donePullup()
          }
          this.scrollerRest2Top()
        })
      } else {
        this.scrollerRest2Top()
      }
    },
    onRefused () {
      console.log('onRefused', this.refuseList)
      this.tabColor(3)
      this.checkStatus = 2
      if (this.refuseList.length === 0) {
        this.getList(this.checkStatus, 0, (list) => {
          this.refuseList = list
          if (list.length === 0 || list.length < 20) {
            this.$refs.scroller.disablePullup()
          } else {
            this.$refs.scroller.donePullup()
          }
          this.scrollerRest2Top()
        })
      } else {
        this.scrollerRest2Top()
      }
    },
    tabColor (index) {
      this.divColor1 = '#666'
      this.divColor2 = '#666'
      this.divColor3 = '#666'
      if (index === 1) {
        this.divColor1 = '#8ebf52'
      } else if (index === 2) {
        this.divColor2 = '#8ebf52'
      } else if (index === 3) {
        this.divColor3 = '#8ebf52'
      }
    },
    selectLeagueTab () {
      var orgManagementId = this.$route.params.orgManagementId
      var leagueId = this.$route.params.leagueId
      if (orgManagementId !== undefined) {
        this.$router.push({name: 'orgActivitySignUpCount', params: {orgManagementId: orgManagementId, activityId: this.$route.params.activityId}})
      } else if (leagueId !== undefined) {
        this.$router.push({name: 'leagueActivitySignUpCount', params: {leagueId: leagueId, activityId: this.$route.params.activityId}})
      }
    },
    getList (checkStatus, rowStart, callback) {
      var orgId = this.$route.params.orgManagementId
      var leagueId = this.$route.params.leagueId
      var activityId = this.$route.params.activityId
      var rowCount = 20
      api.getAuditList({orgId, leagueId, activityId, checkStatus, rowStart, rowCount}, (list) => {
        callback(list)
      }, () => {})
    },
    getFormateTime (time) {
      return dateFormat(time, 'YYYY/MM/DD')
    },
    isOrgMember (inOrg) {
      return inOrg ? '本群成员' : '非本群成员'
    },
    skipInfo (val) {
      var orgId = this.$route.params.orgManagementId
      var leagueId = this.$route.params.leagueId
      if (orgId !== undefined) {
        this.$router.push({name: 'orgActivitySignUpUserInfo', params: {orgManagementId: orgId, activityId: val.activityId, auditUserId: val.userId}})
      } else if (leagueId !== undefined) {
        this.$router.push({name: 'leagueActivitySignUpUserInfo', params: {leagueId: leagueId, activityId: val.activityId, auditUserId: val.userId}})
      }
    },
    loadMore () {
      // aaa
      switch (this.checkStatus) {
        case 1:
          this.getList(this.checkStatus, this.unAuditList.length, (list) => {
            this.unAuditList = this.unAuditList.concat(list)
            if (list.length === 0 || list.length < 20) {
              this.$refs.scroller.disablePullup()
            } else {
              this.$refs.scroller.donePullup()
            }
            this.scrollerRest()
          })
          break
        case 2:
          this.getList(this.checkStatus, this.refuseList.length, (list) => {
            this.refuseList = this.refuseList.concat(list)
            if (list.length === 0 || list.length < 20) {
              this.$refs.scroller.disablePullup()
            } else {
              this.$refs.scroller.donePullup()
            }
            this.scrollerRest()
          })
          break
        case 3:
          this.getList(this.checkStatus, this.auditedList.length, (list) => {
            this.auditedList = this.auditedList.concat(list)
            if (list.length === 0 || list.length < 20) {
              this.$refs.scroller.disablePullup()
            } else {
              this.$refs.scroller.donePullup()
            }
            this.scrollerRest()
          })
          break
      }
    },
    scrollerRest2Top () {
      this.$nextTick(() => {
        this.$refs.scroller.reset({top: 0})
      })
    },
    scrollerRest () {
      this.$nextTick(() => {
        this.$refs.scroller.reset()
      })
    }
  },
  mounted () {
    this.untreated()
    var orgId = this.$route.params.orgManagementId
    var leagueId = this.$route.params.leagueId
    var activityId = this.$route.params.activityId
    api.getAuditCount({orgId, leagueId, activityId}, (data) => {
      this.auditCount = data
    }, () => {})
  }
}
</script>

<style>

.tab-item-sel {
  text-align: center;
  color: #A2D268;
}
.tab-item {
  text-align: center;
  color: #000;
}
.tab-divider {
  text-align: center;
  margin: 0 auto;
  background-color: #e5e5e5;
  width: 1px;
  height: 30px;
}
.btn-item{
  width:120px !important; 
  color: #fff;
  height:30px; 
  line-height:30px;
  font-size: 16px;
  background-color: #FF843E!important
}
.cell-img{
  display:block;
  margin-right:8px; 
  border-radius: 25px;
  width: 50px;
  height: 50px;
}
.cell-btn{
  /*display:block;*/
  margin-right:8px; 
  font-size: 14px;
  /*border-radius: 25px;*/
  width: 60px!important;
}
.cell-img-error {
  background-image: url("../../../assets/head.png") no-repeat;
  background-size: 100% 100% !important;
}
.tab-div{
  display:table-cell;
  font-size: 14px;
  height: 8vw;
  line-height:8vw;
  padding-left:10px;
}

</style>
