<template>
  <div>
    <group>
      <cell v-for="item in infoList" :key="item" :title="item">
      </cell>
    </group>
    <group :title="title">
      <div v-for="item in authorizeList" :key="item.featureId" :style="{height: item.desc!=null?'70px':''}" class="jhy-1px-t">
        <x-switch :title="item.fName" v-model="item.isAuth" style="height:40px"></x-switch>
        <span v-if="item.desc!=null" style="font-size:14px;margin-left:15px;margin-top:-7px;position:absolute;color:#8ebf52" v-on:click="onCheckDetail(item)">查看分成详情</span>
      </div>
      <cell v-for="item in otherList" :key="item.featureId" :title="item.fName" inline-desc="开通该功能后才可以授权给联盟" @click.native="itemOnclick(item.featureId)" is-link>
        <span class="jhy-text-xs">开通</span>
      </cell>
      <cell v-if="isShowFeatureSetting" title="开启更多联盟功能" is-link :link="{name: 'leagueFeatureSetting'}"></cell>
    </group>
    <alert v-model="isShowAlert" title="分成详情" :content="detailTitle"></alert>
    <detail-tabbar :actions="actions" :actionLink="submitAuthorize" isHideMe=true></detail-tabbar>
  </div>
</template>

<script>
  import {Group, Cell, XImg, XSwitch, TransferDomDirective as TransferDom, Tabbar, TabbarItem, Alert} from 'vux'
  import api from '@/feature/league/api'
  import orgApi from '@/feature/org/api'
  import { mapGetters } from 'vuex'
  import DetailTabbar from '@/components/DetailTabbar.vue'

  export default {
    components: {
      Group,
      Cell,
      XImg,
      XSwitch,
      Tabbar,
      TabbarItem,
      DetailTabbar,
      Alert
    },
    data () {
      return {
        infoList: [],
        otherList: [],
        authorizeList: [],
        submitText: '',
        leagueInfo: {},
        orgInfo: {},
        featureList: [],
        isShowFeatureSetting: false,
        actions: [],
        detailTitle: '',
        isShowAlert: false
      }
    },
    computed: {
      ...mapGetters({
        userInfo: 'userInfo'
      }),
      title() {
        if (this.featureList.length === 0 && this.userInfo.userId === this.leagueInfo.masterId) {
          this.isShowFeatureSetting = true
          return '联盟没有开启任何功能'
        } else if (this.featureList.length > 0) {
          this.isShowFeatureSetting = false
          return '选择“' + this.orgInfo.orgName + '”的功能授权给群联盟'
        } else {
          this.isShowFeatureSetting = false
          return '联盟还没有开通联盟功能，暂时无法操作授权'
        }
      }
    },
    mounted () {
      orgApi.getOrgInfo({orgId: this.$route.params.leagueOrgId}, (data) => {
        this.orgInfo = data
      }, () => {})
      api.getLeagueInfo({leagueId: this.$route.params.leagueId}, (data) => {
        this.leagueInfo = data
        this.infoList.push('联盟名称：' + data.leagueName)
        if (data.leagueIntroduce !== null) {
          // this.infoList.push('联盟简介：' + (data.leagueIntroduce.length > 80 ? data.leagueIntroduce.substring(0, 80) + '...' : data.leagueIntroduce))
          this.infoList.push('联盟简介：' + data.leagueIntroduce)
        }
        if (data.joinCost === null) {
          data.joinCost = 0
        }
        if (data.masterId !== this.userInfo.userId) {
          this.infoList.push('加入联盟费用：' + (data.joinCost === 0 ? '免费' : data.joinCost))
          this.infoList.push('是否需要审核：' + (data.isCheck ? '是' : '否'))
        }
        if (data.joinCost === 0 || data.masterId === this.userInfo.userId) {
          this.actions = [{
            name: '免费加入联盟'
          }]
        } else {
          this.actions = [{
            name: '支付￥' + data.joinCost + ' 加入联盟'
          }]
        }
      }, () => {})
      api.getFeatureByLeagueIdForOrgId({orgId: this.$route.params.leagueOrgId, leagueId: this.$route.params.leagueId}, (data) => {
        this.featureList = data
        data.forEach((element) => {
          if (element.isExist) {
            if (element.fCode === 'HUODONG') {
              element.desc = '查看分成详情'
            } else {
              element.desc = null
            }
            this.authorizeList.push(element)
          } else {
            this.otherList.push(element)
          }
        })
      }, () => {})
    },
    methods: {
      itemOnclick (featureId) {
        var orgId = this.$route.params.leagueOrgId
        this.$router.push({name: 'payOneFeature', params: { orgId, featureId }})
      },
      submitAuthorize () {
        var featureId = []
        this.authorizeList.forEach((element) => {
          if (element.isAuth) {
            featureId.push(element.featureId)
          }
        })
        if (featureId.length === 0) {
          this.tools.toast('请选择功能授权给联盟', '180px')
          return
        }
        api.applyMemberInvite({orgId: this.$route.params.leagueOrgId, leagueId: this.$route.params.leagueId, featureId}, (data) => {
          if (data.isToPay) {
            this.$router.replace({name: 'payIndex', params: {orderId: data.orderId}})
          } else {
            this.$router.back()
            this.tools.successToast('加入成功')
          }
        }, (data) => {
          this.tools.toast(data.message, '200px')
        })
      },
      onBack () {
        this.$router.back()
      },
      onCheckDetail (item) {
        var leagueId = this.$route.params.leagueId
        api.getLeagueActivityDividendSetting({leagueId}, (data) => {
          if (data.dividendType === 1) {
            // 百分比分成
            this.detailTitle = '每报名一人可获得报名费用的 ' + data.incomePercentage + '%' + (data.maxIncome === 0 ? '' : ', 最多可获得 ' + data.maxIncome + ' 元')
          } else if (data.dividendType === 2) {
            // 固定分成
            this.detailTitle = '每报名一人可获得 ' + data.fixedIncome + ' 元'
          }
          this.isShowAlert = true
        }, () => {})
      }
    },
    directives: {
      TransferDom
    }
  }
</script>

<style>
  .cell-img{
    display:block;
    margin-right:8px; 
    border-radius: 25px;
    width: 50px;
  }
</style>
