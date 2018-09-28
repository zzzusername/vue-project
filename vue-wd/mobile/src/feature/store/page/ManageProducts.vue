<template>
  <div>
    <flexbox style='height:50px;background:#fff;border-bottom:1px solid #EDEDED' :gutter="0">
      <flexbox-item :span="159/320"><div class="tab-item-sel">商品管理</div></flexbox-item>
      <flexbox-item style="minWidth: 1px;"><div class="tab-divider"></div></flexbox-item>
      <flexbox-item :span="160/320" @click.native="onTabClick" style="-webkit-tap-highlight-color:rgba(0,0,0,0)!important"><div class="tab-item">订单管理</div></flexbox-item>
    </flexbox>
    <group style="height:40px;background-color:#fff;">
      <div class="store-tab-div" v-bind:style="{ color:divColor1}" v-on:click="getSalesList">在售</div>
      <div class="store-tab-div" v-bind:style="{ color:divColor2}" v-on:click="getSoldOutList">未上架</div>
    </group>
    <scroller use-pullup lock-x height="-160" ref="scroller" v-model="status" @on-pullup-loading="loadMore">
      <div>
        <cell style="background-color:#fff" v-for="(item,index) in list" :key="index" :title="item.psgName" :value="(item.cates.length > 0 && item.cates[0].psgcType === 'hot')?'已推荐':''" is-link @click.native="onManage(item)">
          <x-img slot="icon" :src="tools.cdn(item.psgMainImg, 'logo.png', 128)" class="jhy-cell-img"></x-img>
          <div slot="after-title" style="color:#666;font-size:14px;margin-top:8px">库存：{{item.psgCount}} <span style="margin-left:30px;"></span><span v-if="item.psgCostPrice>0||(item.psgPoints==0&&item.psgCostPrice==0)">￥{{item.psgCostPrice.toFixed(2)}}</span><span v-if="item.psgCostPrice>0&&item.psgPoints>0"> + </span><span v-if="item.psgPoints>0" style="color:#A2D268">{{item.psgPoints}}积分</span></div>
        </cell>
      </div>
      <div slot="pullup" style="position: absolute; width: 100%; height: 40px; margin-top:5px; text-align: center; font-size:16px;">
        <span v-show="status.pullupStatus === 'default'">{{ pullupStatusText }}</span>
        <span v-show="status.pullupStatus === 'loading'">加载中...</span>
      </div>
    </scroller>
    <actionsheet v-model="isShowActionsheet" :menus="menus" @on-click-menu="onClickMenu" show-cancel></actionsheet>
    <actionsheet v-model="isShowDeleteMenus" :menus="deleteMenus" @on-click-menu-delete="onConfirmDelete" show-cancel></actionsheet>
    <detail-tabbar :actionLink="onAddProducts" :actions="actions" isHideMe=true></detail-tabbar>
  </div>
</template>

<script>
import {Flexbox, FlexboxItem, Group, Cell, Scroller, XImg, Actionsheet} from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '@/feature/store/api'
export default {
  components: {
    DetailTabbar,
    Flexbox,
    FlexboxItem,
    Group,
    Cell,
    Scroller,
    XImg,
    Actionsheet
  },
  data () {
    return {
      divColor1: '#8ebf52',
      divColor2: '#666',
      list: [],
      status: {
        pullupStatus: 'default',
        pulldownStatus: 'default'
      },
      pullupStatusText: '',
      isShowActionsheet: false,
      menus: {
        modify: '修改商品',
        soldOut: '下架商品',
        del: '删除商品'
      },
      productModel: {},
      isShowDeleteMenus: false,
      deleteMenus: {},
      currentProductStatus: 1,
      actions: [{
        name: '新增商品',
        code: 'add'
      }]
    }
  },
  mounted () {
    this.getManageProductsList(1)
  },
  methods: {
    onManage (item) {
      this.isShowActionsheet = true
      this.productModel = item
      if (item.cates.length > 0 && item.cates[0].psgcType === 'hot' && item.psgStatus === 1) {
        delete this.menus.recommend
        this.menus.unrecommend = '取消推荐'
      } else if (item.cates.length === 0 && item.psgStatus === 1) {
        this.menus.recommend = '推荐商品'
        delete this.menus.unrecommend
      }
    },
    loadMore () {
      this.getManageProductsList(this.currentProductStatus)
    },
    onClickMenu (val) {
      if (val === 'soldUp') {
        // 上架
        this.setManageProductsStatus(this.productModel.psgId, 1)
      } else if (val === 'soldOut') {
        // 下架
        this.setManageProductsStatus(this.productModel.psgId, 0)
      } else if (val === 'modify') {
        // 修改
        var orgId = this.$route.params.orgManagementId
        var leagueId = this.$route.params.leagueId
        if (orgId !== undefined) {
          this.$router.push({name: 'storeOrgModifyProduct', params: {orgManagementId: orgId, productId: this.productModel.psgId}})
        } else if (leagueId !== undefined) {
          this.$router.push({name: 'storeLeagueModifyProduct', params: {leagueId: leagueId, productId: this.productModel.psgId}})
        }
      } else if (val === 'recommend') {
        // 推荐
        api.setManageProductsCate({orgId: this.$route.params.orgManagementId, leagueId: this.$route.params.leagueId, type: 'hot', psgId: this.productModel.psgId}, (data) => {
          this.productModel.cates = [{psgcType: data.psgcType, psgcId: data.psgcId}]
          this.tools.successToast('推荐成功')
        }, () => {})
      } else if (val === 'unrecommend') {
        // 取消推荐
        api.delManageProductsCate({orgId: this.$route.params.orgManagementId, leagueId: this.$route.params.leagueId, psgcId: this.productModel.cates[0].psgcId}, () => {
          this.productModel.cates = []
          this.tools.successToast('取消成功')
        }, () => {})
      } else if (val === 'del') {
        // 删除
        this.deleteMenus = {
          'title.noop': '您确定删除“' + this.productModel.psgName + '”商品吗?<br/>',
          delete: '<span style="color:red">删除</span>'
        }
        this.isShowDeleteMenus = true
      }
    },
    onAddProducts () {
      if (this.$route.params.orgManagementId !== undefined) {
        this.$router.push({name: 'storeOrgAddProducts', params: {orgManagementId: this.$route.params.orgManagementId}})
      } else {
        this.$router.push({name: 'storeLeagueAddProducts', params: {leagueId: this.$route.params.leagueId}})
      }
    },
    getSalesList () {
      this.divColor1 = '#8ebf52'
      this.divColor2 = '#666'
      this.list = []
      this.menus = {
        modify: '修改商品',
        soldOut: '下架商品',
        del: '删除商品'
      }
      this.currentProductStatus = 1
      this.getManageProductsList(this.currentProductStatus)
    },
    getSoldOutList () {
      this.divColor1 = '#666'
      this.divColor2 = '#8ebf52'
      this.menus = {
        modify: '修改商品',
        soldUp: '上架商品',
        del: '删除商品'
      }
      this.list = []
      this.currentProductStatus = 0
      this.getManageProductsList(this.currentProductStatus)
    },
    getManageProductsList (psgStatus) {
      api.getManageProductsList({orgId: this.$route.params.orgManagementId, leagueId: this.$route.params.leagueId, psgStatus, rowStart: this.list.length, rowCount: 20}, (data) => {
        var refresh = false
        if (this.list.length === 0) {
          refresh = true
        }
        this.list.push(...data)
        if (this.list.length === 0) {
          this.pullupStatusText = '暂无相关商品'
        } else if (data.length === 0) {
          this.pullupStatusText = '没有更多了'
        } else {
          this.pullupStatusText = ''
        }
        this.$nextTick(() => {
          this.$refs.scroller.donePullup()
          if (refresh) {
            this.$refs.scroller.reset({top: 0})
          } else {
            this.$refs.scroller.reset()
          }
        })
      }, () => {})
    },
    setManageProductsStatus (psgId, psgStatus) {
      api.setManageProductsStatus({orgId: this.$route.params.orgManagementId, leagueId: this.$route.params.leagueId, psgId, psgStatus}, (data) => {
        for (var i = 0; i < this.list.length; i++) {
          var item = this.list[i]
          if (item.psgId === psgId) {
            this.list.splice(i, 1)
            break
          }
        }
        if (psgStatus === 1) {
          this.tools.successToast('上架成功')
        } else if (psgStatus === 0) {
          this.tools.successToast('下架成功')
        } else if (psgStatus === -1) {
          this.tools.successToast('删除成功')
        }
      }, () => {})
    },
    onConfirmDelete () {
      this.setManageProductsStatus(this.productModel.psgId, -1)
    },
    onTabClick () {
      if (this.$route.params.orgManagementId !== undefined) {
        this.$router.replace({name: 'storeOrgManageOrders', params: {orgManagementId: this.$route.params.orgManagementId}})
      } else {
        this.$router.replace({name: 'storeLeagueManageOrders', params: {leagueId: this.$route.params.leagueId}})
      }
    }
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
.store-tab-div{
  display:table-cell;
  font-size: 15px;
  height: 40px;
  line-height:40px;
  padding-left:15px;
  -webkit-tap-highlight-color:rgba(0,0,0,0)!important;
}
</style>
