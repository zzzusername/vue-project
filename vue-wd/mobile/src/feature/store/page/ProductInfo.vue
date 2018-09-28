<template>
  <div v-if="detailData !== null">
    <org-hand :title="$route.meta.title" featureCode="JIFENSHANGCHENG"></org-hand>
    <group gutter="0">
      <div style="padding:10px 10px 5px;overflow:hidden;">
        <div style="float:left;">
          <p style="fontSize:18px;">{{detailData.psgName}}</p>
          <p style="fontSize:14px;color:#f36d21;marginTop:5px;">
            <span style="fontSize:18px;" v-if="detailData.psgCostPrice !== 0 || (detailData.psgCostPrice == 0 && detailData.psgPoints == 0)">¥ {{detailData.psgCostPrice}}</span>
            <span v-if="detailData.psgPoints !== 0 && detailData.psgCostPrice !== 0"> + </span>
            <span style="fontSize:18px;" v-if="detailData.psgPoints !== 0">{{detailData.psgPoints}} <span style="fontSize:14px;">积分</span></span>
            <span v-if="detailData.psgPrice !== 0" style="text-decoration:line-through;fontSize:12px;color:#999;margin-left:5px">¥ {{detailData.psgPrice}}</span>
          </p>
          <!--<p style="fontSize:12px;">本商品由<span style="color:blue;">北京君和羊网络科技有限公司</span>友情提供</p>-->
        </div>
        <div style="fontSize:12px;color:#999;float:right;height:100%;marginTop:14px;">
          <p>库存：{{detailData.psgCount}}</p>
          <p>运费：{{detailData.psgCourierPrice}}元</p>
        </div>
      </div>
    </group>
    <group title="商品详情">
      <div style="padding:10px 10px 5px;overflow:hidden;">
        <p style="fontSize:16px;marginTop:5px;" v-html="detailData.psgDetail.replace(/\n/g, '<br/>')"></p>
        <img v-for="(item, index) in JSON.parse(detailData.psgDetailImg)" :key="index" style="width:100%;marginTop:5px;" :src="tools.cdn(item)">
      </div>
    </group>
    <div class="jhy-1px-t" style="position:fixed;bottom:0;left:0;height:50px;width:100%;backgroundColor:#F7F7FA;color:#999;">
      <div style="position:relative;width:100%;height:100%;">
        <div @click="() => {$router.go(-1)}" style="position:relative;float:left;left:0;width:50%;textAlign:center;height:100%;">
          <span style="display:block;margin:auto;lineHeight:50px;"><span class="iconfont icon-fanhui1" style="marginRight:5px;color:#a2d268"></span>返回</span>
        </div>
        <div @click="skipOrder()" style="position:relative;float:left;left:0;width:50%;textAlign:center;height:100%;backgroundColor:#8ebf52">
          <span style="display:block;margin:auto;lineHeight:50px;color:#fff;">立即兑换</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import OrgHand from '@/feature/org/components/OrgHand.vue'
  import { Group } from 'vux'
  import api from '@/feature/store/api'
  export default {
    components: {
      OrgHand, Group
    },
    data () {
      return {
        detailData: null
      }
    },
    mounted () {
      var psgId = this.$route.params.productId
      api.getProductInfo({psgId}, (data) => {
        this.detailData = data
      }, () => {})
    },
    methods: {
      skipOrder () {
        this.$router.push({name: 'storeConfirmOrder', params: {productId: this.$route.params.productId, saId: 0}})
      }
    }
  }
</script>
