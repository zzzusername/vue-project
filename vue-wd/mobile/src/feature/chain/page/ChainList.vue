<template>
  <div>
    <div :style="{'position': 'relative', 'height': scrollerHeight + 'px'}">
      <scroller :on-infinite="infinite" no-data-text="没有更多接龙～" ref="manage_scroller">
        <div style="height: 1px" v-if="list.length==0"></div>
        <Group>
          <cell :title="item.chainTitle" v-for="(item, index) in list" :key="index" @click.native="detail(item)" is-link>
            <p slot="inline-desc" style="margin-top:5px;">
              <span style="margin-right: 10px;">{{item.teacherName}}</span>
              <span>截止时间：{{tools.formateTime(item.endDate, 'YYYY-MM-DD HH:mm')}}</span>
            </p>
            <!-- <span slot v-if='parseInt(item.isAgreeType) != 2' :style="{'color':parseInt(item.isAgreeType)== 1?'rgb(142, 191, 82)':'#999999', 'font-size': '14px'}">{{parseInt(item.isAgreeType) == 0 ? '未参与': '已参与'}}</span>
            <span slot style="font-size: 14px;" v-else>不需要参与</span> -->
            <span slot :style="{'color':parseInt(item.isAgreeType)== 1?'rgb(142, 191, 82)':'#999999', 'font-size': '14px'}">{{parseInt(item.isAgreeType) == 0 ? '未参与': parseInt(item.isAgreeType) == 1 ? "已参与" : '不需要参与'}}</span>
          </cell>
        </Group>
      </scroller>
    </div>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
  import { Group, Cell } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import api from '../api.js'
  export default {
    components: {
      Group, Cell, DetailTabbar
    },
    data () {
      return {
        scrollerHeight: 0,
        list: []
      }
    },
    mounted () {
      this.scrollerHeight = window.innerHeight - 50
    },
    methods: {
      infinite(done) {
        this.queryChainStudent(this.list.length, (data) => {
          this.list = this.list.concat(data)
          if (data.length >= 20) {
            done()
          } else {
            done(true)
          }
        })
      },
      queryChainStudent (rowStart, cb) {
        api.queryChainStudent({schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId, rowStart: rowStart, rowCount: 20}, (data) => {
          cb(data)
        }, (er) => {})
      },
      detail (item) {
        this.$router.push({name: 'educationChainDetail', params: { chainId: item.chainId }})
      }
    }
  }
</script>

<style scoped>

</style>
