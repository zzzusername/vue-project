<template>
  <div>
    <table width="100%">
      <thead>
        <tr>
          <th style="minWidth: 2em" align="center" v-for="(item, index) in tabHead" :key="index">{{ item.title }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in tables" :key="index" :style="{'backgroundColor': index == selectRow ? '#A2D268' : index % 2 == 0 ? '#e2e2e2' : '#c2c2c2'}">
          <td style="minWidth: 3em;padding:5px;" align="center" v-for="(obj, i) in item" :key="i" v-if="i == 0" @click="clickName(index)">{{obj != null ? obj.title : ''}}</td>
          <td style="minWidth: 2em;padding:5px;" align="center" v-else v-html="obj != null ? func(obj) : ''"></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectRow: -1
    }
  },
  props: {
    tabData: Object,
    func: Function
  },
  computed: {
    tabHead: function () {
      let list = []
      if (this.tabData.colList === undefined || this.tabData.colList === null) {
        return list
      }
      this.tabData.colList.forEach(element => {
        list.push(element)
      })
      list.unshift({})
      return list
    },
    tables: function() {
      let list = []
      if (this.tabData.dataList === undefined || this.tabData.dataList === null) {
        return list
      }
      this.tabData.dataList.forEach(element => {
        list.push(element)
      })
      for (let index = 0; index < list.length; index++) {
        list[index].unshift(this.tabData.rowList[index])
      }
      return list
    }
  },
  methods: {
    clickName(val) {
      if (this.selectRow === val) {
        this.selectRow = -1
        return
      }
      this.selectRow = val
    }
  }
}
</script>

<style>

</style>
