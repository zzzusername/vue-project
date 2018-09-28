<template>
  <div>
    <flexbox :gutter="0" wrap="wrap" style="background:#708090;">
      <flexbox-item v-for="(item, index) in featureList" :key="index" :span="1/2" @click.native="onFeatureItemClick(item)" style="padding-top: 20px;padding-bottom: 20px">
        <div class="flex-demo jhy-flex-demo">
          <span class="agent-new-icon-circle iconfont " v-bind:class="item.featureIcon" v-bind:style="{ color:item.featureColor}"></span>
          <span style="font-size:14px;color:#fff">{{item.featureName}}</span>
        </div>
      </flexbox-item>
    </flexbox>
    <group title="代理商服务">
      <cell title="客户管理" is-link :link="{name: 'agentCustomerList', params:{isAgent: false}}"></cell>
      <!-- <cell title="产品列表" :link="{name: 'agentProductList'}"></cell> -->
      <cell title="产品宣传资料" :link="{name: 'agentInfoList'}"></cell>
    </group>
    <group>
      <cell title="帮助" is-link @click.native="onHelp"></cell>
    </group>
  </div>
</template>

<script>
import { Group, Cell, Flexbox, FlexboxItem } from 'vux'
export default {
  components: {
    Group, Cell, Flexbox, FlexboxItem
  },
  data () {
    return {
      featureList: [
        {
          featureColor: '#fff',
          featureIcon: 'icon-jiaoyijilu',
          featureName: '收入流水',
          featureCode: 'JIAOYIJILU'
        },
        {
          featureColor: '#fff',
          featureIcon: 'icon-zhouzhangdan',
          featureName: '周账单',
          featureCode: 'ZHOUZHANGDAN'
        }
      ]
    }
  },
  mounted () {
  },
  methods: {
    onFeatureItemClick (item) {
      console.log(item)
      if (item.featureCode === 'JIAOYIJILU') {
        this.$router.push({name: 'agentSalesmanRecord', params: {'type': 'salesMan'}})
      } else {
        this.$router.push({name: 'salemenWeekBill'})
      }
    },
    onHelp () {
      location.href = '//doc.qunxiaozhu.com/index.php?s=/page/60'
    }
  }
}
</script>

<style>
.agent-new-icon-circle {
	display: block;
	margin: auto;
	width: 2.7rem;
	height: 2.7rem;
	text-align: center;
	line-height: 3.0rem;
	font-size: 2rem;
	color: #fff;
}
</style>
