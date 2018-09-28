<template>
  <div>
    <group v-if="orgInfo.orgId != undefined && $route.params.orgId != $route.params.orgManagementId">
      <cell :title="orgInfo.orgName" value="进入" :link="{name:'index',params:{orgId:$route.params.orgManagementId}}"></cell>
    </group>
    <group title="群基础管理" v-if="baseList.length>0">
      <cell v-for="(item,index) in baseList" :title="item.fName" :inline-desc="item.orgDesc" is-link :key="index" :link="item.link">
        <span slot="icon" class="org-icon-circle iconfont " v-bind:class="item.fIcon" v-bind:style="{ color:item.fColor}" style='margin-right:5px;'></span>
      </cell>
    </group>
    <group v-show="newList.length>0" title="群功能管理">
      <cell v-for="(item,index) in newList" :title="item.fName" :inline-desc="item.orgDesc" is-link :key="index" :link="item.link">
        <span slot="icon" class="org-icon-circle iconfont " v-bind:class="item.fIcon" v-bind:style="{ color:item.fColor}" style='margin-right:5px;'></span>
      </cell>
    </group>
    <group v-show="buyList.length>0&&userInfo.isMaster==true" title="待购买功能">
      <cell v-for="(item,index) in buyList" :title="item.fName" value="购买" is-link :key="index"  @click.native="onItemClick(item.featureId)">
        <span slot="icon" class="org-icon-circle iconfont " v-bind:class="item.fIcon" v-bind:style="{ color:item.fColor}" style='margin-right:5px;'></span>
      </cell>
    </group>
    <group v-show="newList.length>0&&userInfo.isMaster==true" title="待续费功能">
      <cell v-for="(item,index) in renewList" :key="index" :title="item.fName" :inline-desc="item.orgDesc" value="续费" is-link @click.native="onItemClick(item.featureId)">
        <span slot="icon" class="org-icon-circle iconfont " v-bind:class="item.fIcon" v-bind:style="{ color:item.fColor}" style='margin-right:5px;'></span>
      </cell>
    </group>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
  import { Cell, Group, dateFormat } from 'vux'
  import { mapGetters } from 'vuex'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import api from '@/feature/org/api'
  export default {
    components: {
      Cell, Group, DetailTabbar, dateFormat
    },
    data () {
      return {
        featureListData: [],
        baseList: [],
        buyList: [],
        renewList: [],
        orgInfo: {}
      }
    },
    mounted () {
      api.getOrgInfo({orgId: this.$route.params.orgManagementId}, (data) => {
        this.orgInfo = data
      }, () => {})
      api.getFeatures({orgId: this.$route.params.orgManagementId}, (featureListData) => {
        this.featureListData = featureListData
      }, () => {})
      // document.documentElement.scrollTop = 0
    },
    methods: {
      onItemClick (featureId) {
        var orgId = this.$route.params.orgManagementId
        this.$router.push({name: 'payOneFeature', params: { orgId, featureId }})
      }
    },
    computed: {
      ...mapGetters({
        orgId: 'orgId',
        userInfo: 'userInfo'
      }),
      newList: function () {
        var _list = []
        this.featureListData.forEach(element => {
          var o = {...element}
          if (o.fManagerOrgUrl !== null && o.fManagerOrgUrl !== '') {
            try {
              o.link = JSON.parse(o.fManagerOrgUrl)
              o.link.params = {orgManagementId: this.$route.params.orgManagementId}
            } catch (error) {
              console.log('o.error', error)
            }
          }
          o.orgDesc = '有效期：' + this.tools.computingDate(new Date().getTime(), element.expiryDate)
          if (o.fCode === 'SHEZHI' && o.isExist === true) {
            this.baseList.push(o)
            this.renewList.push(o)
          } else if (o.fCode === 'YONGHU' && o.isExist === true) {
            this.baseList.push(o)
            this.renewList.push(o)
          } else if (o.isExist === true) {
            if (o.fCode !== 'XUEXIAO') {
              _list.push(o)
              this.renewList.push(o)
            }
          } else {
            if (o.fCode !== 'XUEXIAO') {
              this.buyList.push(o)
            }
          }
        })
        return _list
      }
    }
  }
</script>

<style>
.org-icon-circle {
	display: block;
	margin: auto;
	margin-bottom: 0.0rem;
	width: 2.7rem;
	height: 2.7rem;
	border-radius: 5rem;
	text-align: center;
	line-height: 2.9rem;
	font-size: 1.6rem;
	color: #fff;
}
</style>

