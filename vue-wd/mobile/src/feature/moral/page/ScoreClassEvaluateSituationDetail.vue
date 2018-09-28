<template>
  <div>
    <span v-if="options.length>0" style="position: absolute;right: 0;top: 0;margin-right:10px;margin-top:5px;color:#2E84D4;" @click="showOptionsSelecter=true">查看单项报告</span>
    <group v-if="isAllReport" :gutter="options.length>0?'30px':'20px'">
      <cell v-for="(item, index) in reportData" :key="index" :title="item.className" :value="item.totalScore+'分'" is-link @click.native="onDetail(item)">
        <p slot="inline-desc" style="margin-top:5px;">排名：{{item.ranking}}</p>
      </cell>
    </group>
    <group v-else :gutter="options.length>0?'30px':'20px'">
      <cell v-for="(item, index) in reportOneData" :key="index" :title="item.projectName" :value="item.projecttotalStore+'分'" is-link @click.native="onDetail(item)">
        <p slot="inline-desc" style="margin-top:5px;">排名：{{item.projectRanking}}</p>
      </cell>
    </group>
    <div v-transfer-dom>
      <popup v-model="showOptionsSelecter">
        <group gutter="0">
          <cell>
            <p slot="title" style="color: #999" @click="showOptionsSelecter = false">取消</p>
            <p style="color: #A2D268" @click="confirm">完成</p>
          </cell>
        </group>
        <picker :data='options' v-model='selectOption'></picker>
      </popup>
    </div>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import { Group, Cell, TransferDomDirective as TransferDom, Popup, Picker } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '@/feature/moral/api'
export default {
  directives: {
    TransferDom
  },
  components: {
    DetailTabbar, Cell, Group, Popup, Picker
  },
  data () {
    return {
      reportData: [],
      options: [],
      showOptionsSelecter: false,
      selectOption: [],
      reportOneData: [],
      isAllReport: true
    }
  },
  mounted () {
    api.queryClassReportInfo({schoolId: this.$route.params.schoolId, reportId: this.$route.params.reportId}, (data) => {
      this.reportData = data
      if (data.length > 0) {
        let list = [{value: '0', name: '全部选项'}]
        data[0].projects.forEach(element => {
          list.push({value: element.projectId + '', name: element.projectName})
        })
        if (list.length > 0) {
          this.options.push(list)
        }
      }
    }, () => {})
  },
  methods: {
    confirm () {
      if (this.selectOption[0] === '0') {
        // 全部选项排名
        this.showOptionsSelecter = false
        this.isAllReport = true
      } else {
        // 单项排名
        this.showOptionsSelecter = false
        this.reportData.forEach(element => {
          element.projects.forEach(projectElement => {
            if (parseInt(projectElement.projectId) === parseInt(this.selectOption[0])) {
              element.projectRanking = projectElement.ranking
              element.projectName = projectElement.projectName
              element.projecttotalStore = projectElement.totalStore
            }
          })
        })
        this.reportData.sort((obj1, obj2) => {
          let val1 = obj1.projectRanking
          let val2 = obj2.projectRanking
          if (val1 < val2) {
            return -1
          } else if (val1 > val2) {
            return 1
          } else {
            return 0
          }
        })
        this.reportOneData = JSON.parse(JSON.stringify(this.reportData))
        this.isAllReport = false
      }
    },
    onDetail (item) {
      this.$router.push({name: 'educationMoralClassScoreForGrade', params: {recordId: item.recordId}})
    }
  }
}
</script>

<style>

</style>
