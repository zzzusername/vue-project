<template>
  <div>
    <org-hand :title="$route.meta.title" featureCode="JIFENSHANGCHENG"></org-hand>
    <group v-if="userInfo !== null" gutter="0">
      <div style="display: flex;height:45px;backgroundColor:#fff;" class="vux-1px-b">
        <p style="flex: 1;textAlign:center;line-height:45px;color: #666;">可用积分: <span style="color:#f36d21;">{{userInfo.score==null?0:userInfo.score}}</span></p>
        <p style="height:35px;width:1px;backgroundColor:#d9d9d9;marginTop:5px;"></p>
        <p style="flex: 1;textAlign:center;line-height:45px;color: #666;" v-on:click="$router.push({name: 'orgShowIntegralRules'})">赚取积分</p>
      </div>
    </group>
    <group>
      <div style="display: flex;padding:15px 0 7px 0;" class="vux-1px-b">
        <div style="flex: 1;" @click="skipAllProducts()">
          <p class="iconfont icon-gongneng01" style="fontSize:20px;width:40px;height:40px;margin:auto;textAlign:center;color:#fff;backgroundColor:#21BD8F;borderRadius:20px;lineHeight:40px;"></p>
          <p style="fontSize:13px;color: #666;textAlign:center;marginTop:5px;">全部商品</p>
        </div>
        <div style="flex: 1;" @click="skipOrderList()">
          <p class="iconfont icon-dingdan" style="fontSize:20px;width:40px;height:40px;margin:auto;textAlign:center;color:#fff;backgroundColor:#54A8E8;borderRadius:20px;lineHeight:40px;"></p>
          <p style="fontSize:13px;color: #666;textAlign:center;marginTop:5px;">我的订单</p>
        </div>
      </div>
    </group>
    <group title="热门推荐">
      <div style="display: flex;padding:5px 0 5px 0;" v-for="(item, index) in dataList" :key="index">
        <div style="flex: 1;margin:0 2px 0 0px;" @click="skipProductInfo(item[0].psgId)">
          <div style="width:100%;height:150px;display:block;margin:auto;" class="product_img">
            <div :style="{'background-image':'url('+orgImgUrl(item[0].psgMainImg)+')'}" src=""></div>
          </div>
          <p style="fontSize:13px;color: #666;marginTop:5px;marginLeft:5%">{{item[0].psgName}}</p>
          <p style="fontSize:13px;color: #666;marginTop:5px;marginLeft:5%;color:#f36d21;">
            <span v-if="item[0].psgCostPrice !== 0 || (item[0].psgPoints == 0 && item[0].psgCostPrice == 0)">¥ {{item[0].psgCostPrice.toFixed(2)}}</span>
            <span v-if="item[0].psgPoints !== 0 && item[0].psgCostPrice !== 0"> + </span>
            <span v-if="item[0].psgPoints !== 0">{{item[0].psgPoints}} 积分</span>
          </p>
        </div>
        <div style="flex: 1;margin:0 0px 0 2px;" @click="skipProductInfo(item[1].psgId)">
          <div v-if="item.length === 2" style="width:100%;height:150px;display:block;margin:auto;" class="product_img">
            <div :style="{'background-image':'url('+orgImgUrl(item[1].psgMainImg)+')'}"></div>
          </div>
          <p v-if="item.length === 2" style="fontSize:13px;color: #666;marginTop:5px;marginLeft:5%;">{{item[1].psgName}}</p>
          <p v-if="item.length === 2" style="fontSize:13px;color: #666;marginTop:5px;marginLeft:5%;color:#f36d21;">
            <span v-if="item[1].psgCostPrice !== 0 || (item[1].psgCostPrice == 0 && item[1].psgPoints == 0)">¥ {{item[1].psgCostPrice.toFixed(2)}}</span>
            <span v-if="item[1].psgPoints !== 0 && item[1].psgCostPrice !== 0"> + </span>
            <span v-if="item[1].psgPoints !== 0">{{item[1].psgPoints}} 积分</span>
          </p>
        </div>
      </div>
    </group>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
  import OrgHand from '@/feature/org/components/OrgHand.vue'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import api from '@/feature/store/api'
  import { Group } from 'vux'
  export default {
    components: {
      OrgHand, Group, DetailTabbar
    },
    data () {
      return {
        dataList: [],
        userInfo: null
      }
    },
    mounted () {
      // orgId, leagueId, rowStart, rowCount
      var orgId = this.$route.params.orgId
      var leagueId = this.$route.params.leagueId
      var rowStart = 0
      var rowCount = 6
      api.getProducts({orgId, leagueId, rowStart, rowCount}, (list) => {
        var totalList = list.hotList.concat(list.goodsList)
        var tempList = []
        for (var i = 0; i < totalList.length; i++) {
          tempList.push(totalList[i])
          if ((i !== 0 && i % 2 !== 0) || (totalList.length % 2 !== 0 && i === totalList.length - 1)) {
            this.dataList.push(tempList)
            tempList = []
          }
        }
      }, () => {})
      api.getUserInfo({orgId}, (userInfo) => {
        this.userInfo = userInfo
      }, () => {})
    },
    methods: {
      skipProductInfo (id) {
        this.$router.push({name: 'storeProductInfo', params: {productId: id}})
      },
      skipAllProducts () {
        this.$router.push({name: 'storeAllProducts'})
      },
      skipOrderList () {
        this.$router.push({name: 'storeOrderList'})
        // this.$router.push({name: 'storeAddProducts'})
      },
      orgImgUrl (url) {
        return this.tools.cdn(url)
      }
    }
  }
</script>

<style>
.product_img div {
  width: 100%;
  height: 100%;
  background-position: center center;
  background-size: cover;
}
</style>
