<template>
  <div>
    <flexbox style='height:50px;background:#fff;border-bottom:1px solid #EDEDED' :gutter="0">
      <flexbox-item :span="159/320"><div class="tab-item-sel">我创建的群</div></flexbox-item>
      <flexbox-item style="minWidth: 1px;"><div class="tab-divider"></div></flexbox-item>
      <flexbox-item :span="160/320" @click.native="selectManageOrgTab()"><div class="tab-item">我管理的群</div></flexbox-item>
    </flexbox>
    <group>
      <flexbox style='height:60px;background:#fff'>
        <flexbox-item :span="1/2">
          <x-button class="btn-item" type="primary" @click.native="payAction(1)">创建新群</x-button>
        </flexbox-item>
        <flexbox-item :span="1/2">
          <x-button plain class="btn-item2" type="primary" @click.native="payAction(2)">购买群功能</x-button>
        </flexbox-item>
      </flexbox>
    </group>
    <group style="margin-top:0px">
      <cell v-for="item in newList" :key="item.orgId" :title="item.title==''?'群聊':item.title" class="jhy-cell-title" :link="{name:'orgManagement',params:{orgManagementId:item.orgId}}" >
        <x-img slot="icon" :src="tools.cdn(item.orgLogo, 'logo.png', 128)" class="jhy-cell-img" error-class="org-cell-img-error"></x-img>
        <p v-if="item.robotQuit === true" slot="inline-desc" style="margin-top:6px;color:#FF6D56">{{item.orgDesc}}</p>
        <p v-else slot="inline-desc" style="margin-top:6px;">{{item.orgDesc}}</p>
      </cell>
    </group>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import { Cell, Group, XButton, Flexbox, FlexboxItem, XImg, Popup, TransferDom, dateFormat } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import { mapGetters, mapActions } from 'vuex'
import * as types from '../types'

export default {
  directives: {
    TransferDom
  },
  components: {
    Cell, Group, DetailTabbar, XButton, Flexbox, FlexboxItem, XImg, Popup, dateFormat
  },
  methods: {
    ...mapActions({
      getList: types.GET_MY_ORG_LIST
    }),
    payAction (type) {
      if (type === 1) {
        this.$router.push({name: 'orgCreateNewOrg'})
      } else if (type === 2) {
        this.tools.toast('暂未开放批量购买群功能', '200px')
      }
    },
    selectManageOrgTab () {
      // alert('近期上线，敬请期待')
      // window.localStorage.removeItem('leagueListIndex')
      // this.$router.replace({name: 'leagueMyList'})
      this.$router.replace({name: 'orgManagerorglist'})
    }
  },
  computed: {
    ...mapGetters({
      list: types.MY_ORG_LIST
    }),
    newList: function () {
      var _list = []
      this.list.forEach((element) => {
        var o = {...element}
        o.title = element.orgName
        if (element.robotQuit === true) {
          o.orgDesc = '群管家被移除此群，无法正常使用'
        } else {
          o.orgDesc = element.memberNum + '人' + ' | 有效期：' + this.tools.computingDate(new Date().getTime(), element.expiryDate)
        }
        _list.push(o)
      })
      return _list
    }
  },
  created () {
    this.getList()
  }
}
</script>

<style>

.tab-item-sel {
  text-align: center;
  color: #A2D268;
  font-size: 16px;
}
.tab-item {
  text-align: center;
  color: #000;
  font-size: 16px;
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
  height:36px; 
  line-height:36px;
  font-size: 15px;
  border: 1px solid #8ebf52;
}
.btn-item2{
  width:120px !important; 
  height:36px; 
  line-height:36px;
  font-size: 15px;
  color: #8ebf52;
  border: 1px solid #8ebf52;
}
.org-cell-img-error {
  background-image: url("../../../assets/logo.png") no-repeat;
  background-size: 100% 100% !important;
}
</style>
