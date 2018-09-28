<template>
  <div>
    <group>
      <cell v-for="(item, index) in list" :key="index" :title="scoreNames[item.scoreType]">
        <div slot="after-title" style="color:#666;font-size:14px;margin-top:8px"><span v-for="(item2,index) in item.desc" :key="index" style="margin-left:0px">{{item2}}</br></span></div>
      </cell>
    </group>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import { Group, Cell } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '@/feature/org/api'
export default {
  components: {
    Group,
    Cell,
    DetailTabbar
  },
  data () {
    return {
      list: [],
      scoreNames: {
        VISIT: '访问空间',
        SHARE: '分享',
        COMMENT: '评论',
        SPEAK: '活跃',
        FIRST_JOIN: '首次进群'
      }
    }
  },
  mounted () {
    api.getScoreList({orgId: this.$route.params.orgId}, (data) => {
      data.forEach(function(element) {
        element.desc = []
        if (element.scoreType === 'VISIT') {
          element.desc.push('可获得 ' + element.scoreRule + ' 积分')
        } else if (element.scoreType === 'SHARE') {
          element.desc.push('可获得 ' + element.scoreRule + ' 积分')
        } else if (element.scoreType === 'COMMENT') {
          var a = element.scoreRule.split('-')
          element.desc.push('每次评论可获得 ' + a[0] + ' 积分，' + '每天最多累加 ' + a[1] + ' 次')
        } else if (element.scoreType === 'SPEAK') {
          var arr = element.scoreRule.split(',')
          arr.forEach(function(ele) {
            var b = ele.split('-')
            var c = '每天活跃排名 ' + b[0] + ' 到 ' + b[1] + ' 名可获得 ' + b[2] + ' 积分'
            element.desc.push(c)
          }, this)
        } else if (element.scoreType === 'FIRST_JOIN') {
          element.desc.push('可获得 ' + element.scoreRule + ' 积分')
        }
      }, this)
      this.list = data
    }, () => {})
  }
}
</script>

<style>

</style>
