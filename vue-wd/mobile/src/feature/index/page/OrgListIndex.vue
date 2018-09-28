<template>
  <div>
    <x-button class="btn-item jhy-background-warning" style="margin-top:30px" @click.native="switchUser">登陆用户</x-button>
    <group>
      <cell v-for="item in newList" :key="item.orgId" :title="item.title" value="进入" :inline-desc="item.orgDesc" :link="{name:'index',params:{orgId:item.orgId}}" >
        <x-img slot="icon" :src="tools.cdn(item.orgLogo, 'logo.png', 128)" class="cell-img" error-class="org-cell-img-error"></x-img>
      </cell>
    </group>
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
  data () {
    return {
      createOrgQrcode: '',
      showCreateOrg: false
    }
  },
  methods: {
    ...mapActions({
      getList: types.GET_JOIN_ORG_LIST
    }),
    switchUser () {
      this.$router.push({name: 'userLoginList'})
    }
  },
  computed: {
    ...mapGetters({
      list: types.JOIN_ORG_LIST
    }),
    newList: function () {
      var _list = []
      this.list.forEach(element => {
        var o = {...element}
        o.title = element.orgName + ' 【' + element.memberNum + '人】'
        o.orgDesc = '开通日期：' + dateFormat(element.createDate || new Date(), 'YYYY/MM/DD') + ' 已开通' + element.featureNum + '个功能'
        // o.value = element.orgId === this.$route.params.orgId ? '' : '进入'
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
.cell-img{
  display:block;
  margin-right:8px; 
  border-radius: 25px;
  width: 50px;
}
.org-cell-img-error {
  background-image: url("../../../assets/logo.png") no-repeat;
  background-size: 100% 100% !important;
}
</style>
