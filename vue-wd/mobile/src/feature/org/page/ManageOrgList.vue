<template>
  <div>
    <flexbox v-show="$route.params.showTab != 1" style='height:50px; background:#fff; border-bottom:1px solid #ededed' :gutter="0">
      <flexbox-item :span="159/320" @click.native="selectMyOrgTab()"><div class="tab-item">我创建的群</div></flexbox-item>
      <flexbox-item style="minWidth: 1px;"><div class="tab-divider"></div></flexbox-item>
      <flexbox-item :span="160/320"><div class="tab-item-sel">我管理的群</div></flexbox-item>
    </flexbox>
    <group>
      <cell v-for="item in newList" :key="item.orgId" :title="item.title" class="jhy-cell-title" :link="{name:'orgManagement',params:{orgManagementId:item.orgId}}" >
        <x-img slot="icon" :src="tools.cdn(item.orgLogo, 'logo.png', 128)" class="jhy-cell-img" error-class="org-cell-img-error"></x-img>
        <p v-if="item.robotQuit === true" slot="inline-desc" style="margin-top:6px;color:#FF6D56">{{item.orgDesc}}</p>
        <p v-else slot="inline-desc" style="margin-top:6px;">{{item.orgDesc}}</p>
      </cell>
    </group>
    <p v-if="newList.length==0" style="textAlign:center;marginTop:10px;color:#999;font-size:14px">没有管理的群～</p>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import { Cell, Group, XButton, Flexbox, FlexboxItem, XImg, Popup, TransferDom, dateFormat } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import { mapGetters, mapActions } from 'vuex'
import * as types from '../types'
// import api from '@/feature/org/api'

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
      showCreateOrg: false
    }
  },
  methods: {
    ...mapActions({
      getList: types.GET_MANAGER_ORG_LIST
    }),
    selectMyOrgTab () {
      this.$router.replace({name: 'orgMyorglist'})
    }
  },
  computed: {
    ...mapGetters({
      list: types.MANAGER_ORG_LIST
    }),
    newList () {
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
