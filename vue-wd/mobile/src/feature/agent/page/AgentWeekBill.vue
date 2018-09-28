<template>
  <div>
    <div :style="{'height': scrollerHeight + 'px', 'position': 'relative'}">
      <scroller :on-infinite="infinite">
        <p v-if="emptyHint != ''" style="color: #a2a2a2;textAlign: center;padding: 15px;fontSize: 16px;">{{emptyHint}}</p>
        <div v-for="(item, index) in list" :key="index" style="background:#fff">
          <group gutter="10px">
            <cell is-link value="" :link="{name: 'agentSalemenWeekBill', params: {reportDate: item.reportDate}}">
              <p slot="title" style="fontSize: 16px;">{{item.title}}</p>
              <p slot="value" style="fontSize: 14px;">按业务员查看</p>
            </cell>
            <cell-form-preview style="fontSize: 14px;" :list="item.moneys"></cell-form-preview>
          </group>
        </div>
      </scroller>
    </div>
  </div>
</template>

<script>
import { Group, Cell, CellFormPreview, dateFormat } from 'vux'
import api from '../api'
export default {
  components: {
    Group, Cell, CellFormPreview
  },
  data() {
    return {
      scrollerHeight: 0,
      list: [],
      emptyHint: ''
    }
  },
  mounted() {
    this.scrollerHeight = window.innerHeight
  },
  methods: {
    infinite(done) {
      api.getAgentsWeekBill({rowStart: this.list.length, rowCount: 20}, (data) => {
        var temp = []
        data.forEach(function(element) {
          temp.push({reportDate: element.reportDate, title: dateFormat(element.reportDate, 'YYYY-MM-DD') + ' 账单', moneys: [{label: '货款抵扣金额', value: '¥' + element.agentDeductionMoney.toFixed(2)}, {label: '代理商收款', value: '¥' + element.settlementMoney.toFixed(2)}, {label: '平台应付款', value: '¥' + element.notSettlementMoney.toFixed(2)}]})
        })
        this.list = this.list.concat(temp)
        if (this.list.length === 0) {
          this.emptyHint = '暂无周账单～'
        } else {
          this.emptyHint = ''
        }
        if (data.length < 20) {
          done(true)
        } else {
          done()
        }
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnTost(er.message)
        }
      })
    }
  }
}
</script>

<style>

</style>
