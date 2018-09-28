<template>
  <div>
    <group title="请选择">
      <cell v-for="item in newList" :key="item.orgId" :title="item.title" :inline-desc="item.orgDesc" class="jhy-cell-title" :link="{name:'index',params:{orgId:item.orgId}}" >
        <x-img slot="icon" :src="tools.cdn(item.orgLogo, 'logo.png', 128)" class="jhy-cell-img" error-class="org-cell-img-error"></x-img>
      </cell>
    </group>
    <detail-tabbar v-if="isShowTabbar"></detail-tabbar>
    <div v-transfer-dom @click="hideCreateOrg">
      <popup v-model="showCreateOrg" is-transparent height="100%">
        <div class="join_org_popup">
          <p class="join_org_des">请添加我为好友</p>
          <img class="join_org_qrcode" :src="createOrgQrcode">
          <p class="join_org_des">长按识别二维码</p>
        </div>
      </popup>
    </div>
  </div>
</template>

<script>
import { Cell, Group, XButton, Flexbox, FlexboxItem, XImg, Popup, TransferDom, dateFormat } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '@/feature/org/api'

export default {
  directives: {
    TransferDom
  },
  components: {
    Cell, Group, DetailTabbar, XButton, Flexbox, FlexboxItem, XImg, Popup, dateFormat
  },
  data () {
    return {
      createOrgQrcode: '',
      showCreateOrg: false,
      isShowTabbar: false,
      list: []
    }
  },
  mounted () {
    var orgId = this.$route.params.orgId
    if (orgId === undefined || orgId === null) {
      this.isShowTabbar = false
    } else {
      this.isShowTabbar = true
    }
    api.getJoinOrgList((data) => {
      this.list = data
      if (data.length === 0) {
        this.$router.replace({name: 'orgCreateNewOrg', params: {orgId: '0'}})
        // this.tools.toast('您还没有加入的群，可以创建并管理自己的群', '240px')
      }
    }, () => {
      this.$router.replace({name: 'orgCreateNewOrg'})
    })
  },
  methods: {
    createOrg (type) {
      if (type === 1) {
        // alert('加系统分配的机器人为好友，机器人会指导您创建群流程')
        this.showCreateOrg = true
        api.getRobotQr({}, robotQr => {
          if (robotQr.qrPath !== null) {
            this.createOrgQrcode = this.tools.cdn(robotQr.qrPath)
          }
        }, () => {})
      } else if (type === 2) {
        alert('还未开通')
      }
    },
    selectLeagueTab () {
      this.$router.replace({name: 'orgMyleaguelist'})
    },
    hideCreateOrg () {
      this.showCreateOrg = false
    }
  },
  computed: {
    newList: function () {
      var _list = []
      this.list.forEach(element => {
        var o = {...element}
        o.title = element.orgName
        o.orgDesc = element.memberNum + '人' + ' | 创建者：' + element.masterName
        // console.log('currentDate', this.tools.computingDate(element.createDate))
        o.value = element.orgId === this.$route.params.orgId ? '' : '进入'
        _list.push(o)
      })
      return _list
    }
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
}
.org-cell-img-error {
  background-image: url("../../../assets/logo.png") no-repeat;
  background-size: 100% 100% !important;
}
</style>
