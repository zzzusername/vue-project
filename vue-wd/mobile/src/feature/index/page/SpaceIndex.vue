<template>
  <div>
    <org-hand :title="$route.meta.title" featureCode="HOME"></org-hand>
      <group>
        <div style="padding:10px">
          <span style="font-size:16px;">群基础功能</span>
        </div>
        <flexbox :gutter="0" wrap="wrap" style="margin-bottom:5px;">
          <flexbox-item v-for="(item, index) in jibenList" :key="index" :span="1/4" @click.native="onItemClick(item.isExist,item.featureId,item.fUserUrl)">
            <div style='text-align:center;margin-bottom:10px'>
              <span class="new-icon-circle iconfont " v-bind:class="item.fIcon" v-bind:style="{color:item.isExist?item.fColor:'#d2d2d2'}" ></span>
              <span style="font-size:14px" v-bind:style="{color:item.isExist?'#222':'#d2d2d2'}" >{{item.fName}}</span>
              <span v-if="!item.isExist" style="font-size:14px;color:#FF6D56" >开通</span>
            </div>
          </flexbox-item>
        </flexbox>
      </group>
    <group>
      <div style="padding:10px">
        <span style="font-size:16px;">群内容功能</span>
      </div>
      <flexbox :gutter="0" wrap="wrap" style="margin-bottom:5px;">
        <flexbox-item v-for="(item, index) in neirongList" :key="index" :span="1/4" @click.native="onItemClick(item.isExist,item.featureId,item.fUserUrl)">
          <div style='text-align:center;margin-bottom:10px'>
            <span class="new-icon-circle iconfont " v-bind:class="item.fIcon" v-bind:style="{color:item.isExist?item.fColor:'#d2d2d2'}" ></span>
            <span style="font-size:14px" v-bind:style="{color:item.isExist?'#222':'#d2d2d2'}">{{item.fName}}</span>
            <span v-if="!item.isExist" style="font-size:14px;color:#FF6D56" >开通</span>
          </div>
        </flexbox-item>
      </flexbox>
    </group>
    <group>
      <div style="padding:10px">
        <span style="font-size:16px;">群互动功能</span>
      </div>
      <flexbox :gutter="0" wrap="wrap" style="margin-bottom:5px;">
        <flexbox-item v-for="(item, index) in hudongList" :key="index" :span="1/4" @click.native="onItemClick(item.isExist,item.featureId,item.fUserUrl)">
          <div style='text-align:center;margin-bottom:10px'>
            <span class="new-icon-circle iconfont " v-bind:class="item.fIcon" v-bind:style="{color:item.isExist?item.fColor:'#d2d2d2'}" ></span>
            <span style="font-size:14px" v-bind:style="{color:item.isExist?'#222':'#d2d2d2'}">{{item.fName}}</span>
            <span v-if="!item.isExist" style="font-size:14px;color:#FF6D56" >开通</span>
          </div>
        </flexbox-item>
      </flexbox>
    </group>
    <group>
      <div style="padding:10px">
        <span style="font-size:16px;">群交易功能</span>
      </div>
      <flexbox :gutter="0" wrap="wrap" style="margin-bottom:5px;">
        <flexbox-item v-for="(item, index) in jiaoyiList" :key="index" :span="1/4" @click.native="onItemClick(item.isExist,item.featureId ,item.fUserUrl)">
          <div style='text-align:center;margin-bottom:10px'>
            <span class="new-icon-circle iconfont " v-bind:class="item.fIcon" v-bind:style="{color:item.isExist?item.fColor:'#d2d2d2'}" ></span>
            <span style="font-size:14px" v-bind:style="{color:item.isExist?'#222':'#d2d2d2'}">{{item.fName}}</span>
            <span v-if="!item.isExist" style="font-size:14px;color:#FF6D56" >开通</span>
          </div>
        </flexbox-item>
      </flexbox>
    </group>
    <actionsheet v-model="isShow" :menus="menus3" @on-click-menu="click" @on-click-menu-delete="onOpenFeature" show-cancel></actionsheet>
    <index-tabbar></index-tabbar>
  </div>
</template>

<script>
  import OrgHand from '@/feature/org/components/OrgHand.vue'
  import IndexTabbar from '@/components/IndexTabbar.vue'
  import {Group, Card, Flexbox, FlexboxItem, Actionsheet} from 'vux'
  import api from '@/feature/index/api'
  import { mapGetters } from 'vuex'

  export default {
    data () {
      return {
        featureList: [],
        jibenList: [],
        neirongList: [],
        hudongList: [],
        jiaoyiList: [],
        isShow: false,
        menus3: {
          'title.noop': '确定要为群主开通此功能吗？',
          delete: '<span style="color:red">去开通</span>'
        },
        currentFeatureId: 0
      }
    },
    computed: {
      ...mapGetters({
        userInfo: 'userInfo'
      })
    },
    mounted () {
      api.getSpaceFeatures({orgId: this.$route.params.orgId}, (data) => {
        this.featureList = data
        data.forEach(function(element) {
          if (element.fGroupCode === 'JIBEN') {
            this.jibenList.push(element)
          } else if (element.fGroupCode === 'NEIRONG') {
            this.neirongList.push(element)
          } else if (element.fGroupCode === 'HUDONG') {
            this.hudongList.push(element)
          } else if (element.fGroupCode === 'JIAOYI') {
            this.jiaoyiList.push(element)
          }
        }, this)
      }, () => {})
    },
    components: {
      OrgHand,
      IndexTabbar,
      Group,
      Card,
      Flexbox,
      FlexboxItem,
      Actionsheet
    },
    methods: {
      onItemClick (isExist, featureId, fUserUrl) {
        if (isExist) {
          this.$router.push(JSON.parse(fUserUrl))
        } else {
          if (this.userInfo.isManager === true || this.userInfo.isMaster === true) {
            var orgId = this.$route.params.orgId
            this.$router.push({name: 'payOneFeature', params: { orgId, featureId }})
          } else {
            this.currentFeatureId = featureId
            this.isShow = true
          }
        }
      },
      onOpenFeature () {
        var orgId = this.$route.params.orgId
        this.$router.push({name: 'payOneFeature', params: { orgId, featureId: this.currentFeatureId }})
      }
    }
  }
</script>

<style>
.space-icon-circle {
	display: block;
	margin: auto;
	width: 2.5rem;
	height: 2.5rem;
	text-align: center;
	line-height: 3.0rem;
	font-size: 1.7rem;
}
</style>
