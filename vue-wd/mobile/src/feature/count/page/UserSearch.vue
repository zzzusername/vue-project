<template>
  <div>
    <div style="margin-bottom:20px">
      <CountTotal :totalData="totalData.slice(0,4)" />
      <CountPie :opinion="pieData.opinion" :opinionData="pieData.opinionData" />
      <CountTable v-for="(v,k) in tableData" :key="k" :title="v.title" :code="v.code" :thData="v.thData" :tdData="v.tdData" />
    </div>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
  import { dateFormat } from 'vux'
  import CountTable from '../components/CountTable'
  import CountPie from '../components/CountPie'
  import CountTotal from '../components/CountTotal'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import api from '@/feature/count/api'
  export default {
    components: {
      CountTable,
      CountPie,
      CountTotal,
      DetailTabbar
    },
    data() {
      return {
        totalData: [{
          key: '用户数',
          num: 0
        }, {
          key: '活跃用户数',
          num: 0
        }, {
          key: '新增用户数',
          num: 0
        }, {
          key: '退群用户数',
          num: 0
        }],
        pieData: {
          opinion: ['意见领袖', '普通活跃', '沉默用户'],
          opinionData: [{
            value: 0,
            name: '意见领袖'
          }, {
            value: 0,
            name: '普通活跃'
          }, {
            value: 0,
            name: '沉默用户'
          }]
        },
        tableData: [],
        dateType: this.$route.params.countDateType,
        date: this.$route.params.countDate,
        rowStart: 0,
        rowCount: 5
      }
    },
    mounted () {
      this.onLoad()
    },
    methods: {
      onLoad () {
        // 获取用户数

        api.getOrgUserCount({orgId: this.$route.params.orgId}, (data) => {
          this.totalData[0].num = data.result
          api.getOrgUserActiveCount({orgId: this.$route.params.orgId, type: this.dateType, date: this.date}, (data) => {
            this.totalData[1].num = data.result
            api.getOrgUserLeaderCount({orgId: this.$route.params.orgId, type: this.dateType, date: this.date}, (data) => {
              // 意见领袖
              this.pieData.opinionData[0].value = data.result
              this.pieData.opinionData[1].value = this.totalData[1].num - data.result
              this.pieData.opinionData[2].value = this.totalData[0].num - this.totalData[1].num
              this.pieData = JSON.parse(JSON.stringify(this.pieData))
            }, () => {})
          }, () => {})
        }, () => {})
        api.getOrgUserNewCount({orgId: this.$route.params.orgId, type: this.dateType, date: this.date}, (data) => {
          this.totalData[2].num = data.result
        }, () => {})
        api.getOrgUserQuitCount({orgId: this.$route.params.orgId, type: this.dateType, date: this.date}, (data) => {
          this.totalData[3].num = data.result
        }, () => {})

        this.getLeaderUserList()
      },
      getLeaderUserList () {
        // 获取意见领袖
        api.getOrgUserList({orgId: this.$route.params.orgId, type: this.dateType, date: this.date, rowStart: this.rowStart, rowCount: this.rowCount, apiType: 'leader'}, (data) => {
          if (data.result != null && data.result.length > 0) {
            var userTable = {}
            userTable.title = '意见领袖'
            userTable.code = 'leader'
            userTable.thData = [{
              width: '50%',
              name: '用户名'
            }, {
              name: '消息数'
            }]
            userTable.tdData = []
            data.result.forEach(function(element) {
              var value = []
              value.push(element.nickName)
              value.push(element.count)
              // value.push(dateFormat(element.date, 'YYYY-MM-DD'))
              userTable.tdData.push(value)
            }, this)
            this.tableData.push(userTable)
          }
          this.getActiveUserList()
        }, () => {
          this.getActiveUserList()
        })
      },
      getAddedUserList () {
        // 新增用户
        api.getOrgUserList({orgId: this.$route.params.orgId, type: this.dateType, date: this.date, rowStart: this.rowStart, rowCount: this.rowCount, apiType: 'new'}, (data) => {
          if (data.result != null && data.result.length > 0) {
            var userTable = {}
            userTable.title = '新增用户'
            userTable.code = 'new'
            userTable.thData = [{
              width: '30%',
              name: '用户名'
            }, {
              width: '30%',
              name: '入群时间'
            }]
            userTable.tdData = []
            data.result.forEach(function(element) {
              var value = []
              value.push(element.nickName)
              value.push(dateFormat(element.joinDate, 'YYYY-MM-DD HH:mm'))
              userTable.tdData.push(value)
            }, this)
            this.tableData.push(userTable)
          }
          this.getQuitUserList()
        }, () => {
          this.getQuitUserList()
        })
      },
      getActiveUserList () {
        // 获取活跃用户
        api.getOrgUserList({orgId: this.$route.params.orgId, type: this.dateType, date: this.date, rowStart: this.rowStart, rowCount: this.rowCount, apiType: 'active'}, (data) => {
          if (data.result != null && data.result.length > 0) {
            var userTable = {}
            userTable.title = '活跃用户'
            userTable.code = 'active'
            userTable.thData = [{
              width: '50%',
              name: '用户名'
            }, {
              name: '消息数'
            }]
            userTable.tdData = []
            data.result.forEach(function(element) {
              var value = []
              value.push(element.nickName)
              value.push(element.count)
              // value.push(dateFormat(element.date, 'YYYY-MM-DD'))
              userTable.tdData.push(value)
            }, this)
            this.tableData.push(userTable)
          }
          this.getAddedUserList()
        }, () => {
          this.getAddedUserList()
        })
      },
      getQuitUserList () {
        // 退群用户
        api.getOrgUserList({orgId: this.$route.params.orgId, type: this.dateType, date: this.date, rowStart: this.rowStart, rowCount: this.rowCount, apiType: 'quit'}, (data) => {
          if (data.result != null && data.result.length > 0) {
            var userTable = {}
            userTable.title = '退群用户'
            userTable.code = 'quit'
            userTable.thData = [{
              width: '50%',
              name: '用户名'
            }, {
              width: '50%',
              name: '退群时间'
            }]
            userTable.tdData = []
            data.result.forEach(function(element) {
              var value = []
              value.push(element.nickName)
              value.push(dateFormat(element.exitDate, 'YYYY-MM-DD HH:mm'))
              userTable.tdData.push(value)
            }, this)
            setTimeout(() => {
              this.tableData.push(userTable)
            }, 300)
          }
        }, () => {})
      }
    }
  }
</script>

<style>
  body {
    font-family: PingFangSC-Regular;
  }
</style>

