<template>
  <div class="line-content" :style="{width: opinionWidth==null?'96vw':opinionWidth}">
    <div id="line-main" :style="{width: opinionWidth==null?'96vw':opinionWidth}"></div>
  </div>
</template>

<script>
  import Echarts from 'echarts'
  export default {
    props: ['opinion', 'opinionData', 'opinionXAxis', 'opinionWidth'],
    mounted() {
      this.drawGraph('line-main')
    },
    data() {
      return {
        chart: null
      }
    },
    watch: {
      opinionData: function (val, oldVal) {
        console.log('val', val)
        this.drawGraph('line-main')
      }
    },
    methods: {
      drawGraph(id) {
        this.chart = Echarts.init(document.getElementById(id))
        this.chart.showLoading()
        this.chart.setOption({
          color: ['#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#6495ed', '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0', '#1e90ff', '#ff6347', '#7b68ee', '#00fa9a', '#ffd700', '#6699FF', '#ff6666', '#3cb371', '#b8860b', '#30e0e0'],
          legend: {
            x: 'center',
            y: '260px',
            data: this.opinion
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.opinionXAxis
          },
          yAxis: {
            type: 'value'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} － {c} '
          },
          series: this.opinionData
        })
        this.chart.hideLoading()
      }
    }
  }
</script>

<style>
  .line-content {
    position: relative;
    text-align: center;
    /* width: 96vw; */
    margin: 0 auto;
  }

  #line-main {
    margin-top:-20px;
    position: relative;
    float: left;
    /* width: 96vw; */
    height: 300px;
  }
</style>

