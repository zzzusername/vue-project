<template>
  <div>
    <div style="margin-bottom:20px">
      <SelectBar actionName="countAction" :times="times" :selectTime="selectTime" :onItemClick="onItemClick" :onSearch="onSearch"/>
      <div class="img-title" style="border-bottom: 1px solid rgb(230, 230, 230);">行为纵览</div>
      <CountTotal :totalData="totalData.slice(0,8)" />
      <div class="img-title">饼状分布图</div>
      <CountPie :opinion="pieData.opinion" :opinionData="pieData.opinionData" />
      <div v-show="lineData.opinionXAxis.length>0&&dateType!='DAY'" class="img-title" style="border-bottom: 1px solid rgb(230, 230, 230);">时间分布</div>
      <CountTime v-show="lineData.opinionXAxis.length>0&&dateType!='DAY'" :opinion="lineData.opinion" :opinionData="lineData.opinionData" :opinionXAxis="lineData.opinionXAxis"/>
      <div v-show="tableData.length>0" class="img-title" style="border-bottom: 1px solid rgb(230, 230, 230);">行为排名</div>
      <CountTable v-for="(v,k) in tableData" :key="k" :title="v.title" :thData="v.thData" :tdData="v.tdData" />
    </div>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
  import { dateFormat } from 'vux'
  import SelectBar from '../components/SelectBar'
  import CountTable from '../components/CountTable'
  import CountPie from '../components/CountPie'
  import CountTotal from '../components/CountTotal'
  import CountTime from '../components/CountTime'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import api from '@/feature/count/api'
  export default {
    components: {
      SelectBar,
      CountTable,
      CountPie,
      CountTotal,
      CountTime,
      DetailTabbar
    },
    data() {
      return {
        times: ['今日', '本周', '本月'],
        dateType: 'DAY',
        date: dateFormat(new Date(), 'YYYY-MM-DD'),
        rowStart: 0,
        rowCount: 5,
        selectTime: 0,
        totalData: [{
          key: '文本消息',
          num: 0
        }, {
          key: '表情消息',
          num: 0
        }, {
          key: '图片消息',
          num: 0
        }, {
          key: '语音消息',
          num: 0
        }, {
          key: '红包消息',
          num: 0
        }, {
          key: '视频消息',
          num: 0
        }, {
          key: '链接消息',
          num: 0
        }, {
          key: '小程序消息',
          num: 0
        }],
        pieData: {
          opinion: ['文本', '表情', '图片', '语音', '红包', '视频', '链接', '小程序'],
          opinionData: [{
            value: 0,
            name: '文本'
          }, {
            value: 0,
            name: '表情'
          }, {
            value: 0,
            name: '图片'
          }, {
            value: 0,
            name: '语音'
          }, {
            value: 0,
            name: '红包'
          }, {
            value: 0,
            name: '视频'
          }, {
            value: 0,
            name: '链接'
          }, {
            value: 0,
            name: '小程序'
          }]
        },
        lineData: {
          opinion: ['文本', '表情', '图片', '语音', '红包', '视频', '链接', '小程序'],
          opinionXAxis: [],
          opinionData: [{
            type: 'line',
            name: '表情',
            data: 0
          }, {
            type: 'line',
            name: '图片',
            data: 0
          }, {
            type: 'line',
            name: '链接',
            data: 0
          }, {
            type: 'line',
            name: '小程序',
            data: 0
          }, {
            type: 'line',
            name: '红包',
            data: 0
          }, {
            type: 'line',
            name: '文本',
            data: 0
          }, {
            type: 'line',
            name: '视频',
            data: 0
          }, {
            type: 'line',
            name: '语音',
            data: 0
          }]
        },
        tableData: [],
        tempTableData: []
      }
    },
    mounted () {
      this.onLoad()
    },
    methods: {
      onItemClick(k) {
        this.$data.selectTime = k
        if (k === 0) {
          this.dateType = 'DAY'
        } else if (k === 1) {
          this.dateType = 'WEEK'
        } else if (k === 2) {
          this.dateType = 'MONTH'
        }
        this.tableData = []
        this.onLoad()
      },
      onLoad () {
        api.getOrgBehaviorCount({orgId: this.$route.params.orgId, type: this.dateType, date: this.date}, (data) => {
          this.totalData[0].num = this.pieData.opinionData[0].value = data.result.textCount
          this.totalData[1].num = this.pieData.opinionData[1].value = data.result.emojiCount
          this.totalData[2].num = this.pieData.opinionData[2].value = data.result.imgCount
          this.totalData[3].num = this.pieData.opinionData[3].value = data.result.voiceCount
          this.totalData[4].num = this.pieData.opinionData[4].value = data.result.redCunt
          this.totalData[5].num = this.pieData.opinionData[5].value = data.result.videoCount
          this.totalData[6].num = this.pieData.opinionData[6].value = data.result.linkCount
          this.totalData[7].num = this.pieData.opinionData[7].value = data.result.miniCount
          this.pieData = JSON.parse(JSON.stringify(this.pieData))
        }, () => {
          this.pieData = JSON.parse(JSON.stringify(this.pieData))
        })
        if (this.dateType !== 'DAY') {
          api.getOrgBehaviorIntervalReport({orgId: this.$route.params.orgId, type: this.dateType}, (data) => {
            if (data.result === null) {
              return
            }
            this.lineData.opinionXAxis = []
            data.result.date.forEach((element) => {
              this.lineData.opinionXAxis.push(dateFormat(element, 'MM-DD'))
            }, this)
            this.lineData.opinionData[0].data = data.result.emoji
            this.lineData.opinionData[1].data = data.result.img
            this.lineData.opinionData[2].data = data.result.link
            this.lineData.opinionData[3].data = data.result.mini
            this.lineData.opinionData[4].data = data.result.red
            this.lineData.opinionData[5].data = data.result.text
            this.lineData.opinionData[6].data = data.result.video
            this.lineData.opinionData[7].data = data.result.voice
            this.lineData = JSON.parse(JSON.stringify(this.lineData))
          }, () => {
            this.lineData = JSON.parse(JSON.stringify(this.lineData))
          })
        }
        // 排序类型  TEXT 文本消息 IMG 图片 EMOJI 表情 VOICE 音频 RED 红包 VIDEO 视频 LINK 链接 MINI 小程序
        this.getOrgBehaviorUserList({title: '文本消息用户排名', type: 'TEXT', countStr: 'textCount'})
        this.getOrgBehaviorUserList({title: '表情消息用户排名', type: 'EMOJI', countStr: 'emojiCount'})
        this.getOrgBehaviorUserList({title: '图片消息用户排名', type: 'IMG', countStr: 'imgCount'})
        this.getOrgBehaviorUserList({title: '语音消息用户排名', type: 'VOICE', countStr: 'voiceCount'})
        this.getOrgBehaviorUserList({title: '红包消息用户排名', type: 'RED', countStr: 'redCunt'})
        this.getOrgBehaviorUserList({title: '视频消息用户排名', type: 'VIDEO', countStr: 'videoCount'})
        this.getOrgBehaviorUserList({title: '链接消息用户排名', type: 'LINK', countStr: 'linkCount'})
        this.getOrgBehaviorUserList({title: '小程序消息用户排名', type: 'MINI', countStr: 'miniCount'})
      },
      getOrgBehaviorUserList ({title, type, countStr}) {
        api.getOrgBehaviorUserList({orgId: this.$route.params.orgId, type: this.dateType, date: this.date, rowStart: this.rowStart, rowCount: this.rowCount, sortType: type}, (data) => {
          if (data.result != null && data.result.length > 0) {
            var userTable = {}
            userTable.title = title
            userTable.code = type
            userTable.thData = [{
              width: '30%',
              name: '用户名'
            }, {
              width: '30%',
              name: '消息数'
            }]
            userTable.tdData = []
            data.result.forEach(function(element) {
              var value = []
              value.push(element.nickName)
              value.push(element[countStr] === null ? 0 : element[countStr])
              userTable.tdData.push(value)
            }, this)
            this.tempTableData.push(userTable)
          } else {
            this.tempTableData.push(null)
          }
          if (this.tempTableData.length === 8) {
            // 清理无用数据
            for (var i = this.tempTableData.length - 1; i >= 0; i--) {
              var item = this.tempTableData[i]
              if (item === null) {
                this.tempTableData.splice(i, 1)
              }
            }
            this.setTableData('TEXT')
            this.setTableData('EMOJI')
            this.setTableData('IMG')
            this.setTableData('VOICE')
            this.setTableData('RED')
            this.setTableData('VIDEO')
            this.setTableData('LINK')
            this.setTableData('MINI')
            this.tempTableData = []
          }
        }, () => {})
      },
      setTableData (type) {
        for (var i = 0; i < this.tempTableData.length; i++) {
          var item = this.tempTableData[i]
          if (item.code === type) {
            this.tableData.push(item)
            return
          }
        }
      },
      onSearch (searchType, searchDate) {
        this.$router.push({name: 'searchCountAction', params: {countDateType: searchType, countDate: searchDate}})
      }
    }
  }
</script>

<style>
  body {
    font-family: PingFangSC-Regular;
  }

  .img-title {
    float: left;
    position: relative;
    color: #908F8F;
    height: 2rem;
    line-height: 2rem;
    font-size: 0.75rem;
    padding-left: 4%;
    margin-top:10px;
    width: 96%;
  }
</style>

