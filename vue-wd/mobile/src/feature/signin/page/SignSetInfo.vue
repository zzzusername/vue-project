<template>
  <div>
    <group>
      <cell v-if="userGroupDesc.length>0" title="允许签到用户组">
        <div slot="after-title" style="color:#666;font-size:14px;margin-top:8px"><span v-for="(item,index) in userGroupDesc" :key="index" style="margin-left:0px">{{item}}</br></span></div>
      </cell>
      <cell v-if="dateDesc.length>0" title="每日签到时间">
        <div slot="after-title" style="color:#666;font-size:14px;margin-top:8px"><span v-for="(item,index) in dateDesc" :key="index" style="margin-left:0px">{{item}}</br></span></div>
      </cell>
      <cell v-if="scoreDesc.length>0" title="签到奖励积分">
        <div slot="after-title" style="color:#666;font-size:14px;margin-top:8px"><span v-for="(item,index) in scoreDesc" :key="index" style="margin-left:0px">{{item}}</br></span></div>
      </cell>
      <cell v-if="scoreMultDesc.length>0" title="签到积分翻倍">
        <div slot="after-title" style="color:#666;font-size:14px;margin-top:8px"><span v-for="(item,index) in scoreMultDesc" :key="index" style="margin-left:0px">{{item}}</br></span></div>
      </cell>
      <cell v-if="linkScoreDesc.length>0" title="连续签到奖励积分">
        <div slot="after-title" style="color:#666;font-size:14px;margin-top:8px"><span v-for="(item,index) in linkScoreDesc" :key="index" style="margin-left:0px">{{item}}</br></span></div>
      </cell>
    </group>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import {Group, Cell, dateFormat} from 'vux'
import api from '@/feature/signin/api'
import DetailTabbar from '@/components/DetailTabbar.vue'
export default {
  components: {
    Group,
    Cell,
    DetailTabbar
  },
  data () {
    return {
      list: [{}],
      userGroupDesc: [],
      dateDesc: [],
      scoreDesc: [],
      scoreMultDesc: [],
      linkScoreDesc: []
    }
  },
  mounted () {
    var orgId = this.$route.params.orgId
    api.getLevelList({orgId}, (levelList) => {
      api.getVipLevelList({orgId}, (vipList) => {
        api.getSignSetInfo({orgId}, (data) => {
          // 可签到用户
          var levelArray = data.allowLevel.split(',')
          var levelNameArray = []
          levelArray.forEach(function(levelId) {
            levelList.forEach(function(levelModel) {
              if (levelModel.levelId === parseInt(levelId)) {
                levelNameArray.push(levelModel.levelName)
              }
            }, this)
          }, this)
          var vipArray = data.allowVip.split(',')
          var vipNameArray = []
          vipArray.forEach(function(vipId) {
            vipList.forEach(function(vipModel) {
              if (vipModel.vipId === parseInt(vipId)) {
                vipNameArray.push(vipModel.vipName)
              }
            }, this)
          }, this)
          if (levelNameArray.length > 0) {
            this.userGroupDesc.push('等级 － ' + levelNameArray)
          }
          if (vipNameArray.length > 0) {
            this.userGroupDesc.push('VIP － ' + vipNameArray)
          }

          // 可签到时间
          if (data.isOpenTime === true && data.signStartTime !== null && data.signStartTime > 0 && data.signEndTime !== null && data.signEndTime > 0) {
            this.dateDesc.push(dateFormat(data.signStartTime, 'HH:mm') + '-' + dateFormat(data.signEndTime, 'HH:mm'))
          }

          // 签到奖励积分
          if (data.baseScore !== null && data.baseScore > 0) {
            this.scoreDesc.push('每日签到奖励 ' + data.baseScore + ' 积分')
          }
          if (data.rankScore !== null && data.rankScore !== '') {
            var rankScoreArray = data.rankScore.split(',')
            rankScoreArray.forEach((rankScore) => {
              this.scoreDesc.push('每日签到第 ' + rankScore.split('-')[0] + ' 到第 ' + rankScore.split('-')[1] + ' 名可额外奖励 ' + rankScore.split('-')[2] + ' 积分')
            }, this)
          }
          // 签到翻倍
          if (data.levelScore !== null && data.levelScore.length > 0) {
            var levelScoreArray = data.levelScore.split(',')
            levelScoreArray.forEach(function(levelStr) {
              var levelId = levelStr.split('-')[0]
              var multiple = levelStr.split('-')[1]
              levelList.forEach((levelModel) => {
                if (levelModel.levelId === parseInt(levelId) && multiple > 0) {
                  this.scoreMultDesc.push(levelModel.levelName + '等级 － 积分翻 ' + multiple + ' 倍')
                }
              }, this)
            }, this)
          }
          if (data.vipScore !== null && data.vipScore.length > 0) {
            var vipScoreArray = data.vipScore.split(',')
            vipScoreArray.forEach(function(vipStr) {
              var vipId = vipStr.split('-')[0]
              var multiple = vipStr.split('-')[1]
              vipList.forEach((vipModel) => {
                if (vipModel.vipId === parseInt(vipId) && multiple > 0) {
                  this.scoreMultDesc.push(vipModel.vipName + ' － 积分翻 ' + multiple + ' 倍')
                }
              }, this)
            }, this)
          }
          // 连续签到
          if (data.linkScore !== null && data.linkScore !== '') {
            this.linkScoreDesc.push('连续签到 ' + data.linkScore.split('-')[0] + ' 天奖励 ' + data.linkScore.split('-')[1] + ' 积分')
          }
        }, () => {})
      }, () => {})
    }, () => {})
  }
}
</script>

<style>
div {
  -webkit-tap-highlight-color:rgba(0, 0, 0, 0)
}
</style>
