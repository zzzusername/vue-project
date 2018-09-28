<template>
  <div>
    <group style="margin-top:0px" title="请选择群授权给联盟">
      <cell v-for="item in newList" :key="item.orgId" :title="item.title" class="jhy-cell-title" :inline-desc="item.orgDesc" @click.native="onInvate(item)" >
        <x-img slot="icon" :src="tools.cdn(item.orgLogo, 'logo.png', 128)" class="jhy-cell-img" error-class="org-cell-img-error"></x-img>
      </cell>
    </group>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import { Cell, Group, XButton, Flexbox, FlexboxItem, XImg, Popup, TransferDom, dateFormat } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import { mapGetters, mapActions } from 'vuex'
import * as types from '../../org/types'

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
    onInvate (item) {
      this.$router.push({name: 'leagueAuthFeature', params: {leagueOrgId: item.orgId, leagueId: this.$route.params.leagueId}})
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
        o.orgDesc = element.memberNum + '人' + ' | 有效期：' + this.tools.computingDate(new Date().getTime(), element.expiryDate)
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
