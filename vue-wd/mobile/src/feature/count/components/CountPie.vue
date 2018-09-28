<template>
  <div class="pie-content">
    <div id="pie-main"></div>
  </div>
</template>

<script>
  import Echarts from 'echarts'
  export default {
    props: ['opinion', 'opinionData'],
    mounted() {
      // this.drawGraph('pie-main')
    },
    data() {
      return {
        chart: null
        // opinionData: this.$props.opinionData
      }
    },
    watch: {
      opinionData: function (val, oldVal) {
        this.drawGraph('pie-main')
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
            y: 'bottom',
            data: this.$props.opinion
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          series: [{
            name: '种类',
            type: 'pie',
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
            radius: '70%',
            center: ['50%', '40%'],
            data: this.opinionData
          }]
        })
        this.chart.hideLoading()
      }
    }
  }
</script>

<style>
  .pie-content {
    position: relative;
    /*float: left;*/
    text-align: center;
    width: 94%;
    margin: 0 auto;
  }

  #pie-main {
    position: relative;
    float: left;
    width: 100%;
    height: 300px;
  }
</style>

