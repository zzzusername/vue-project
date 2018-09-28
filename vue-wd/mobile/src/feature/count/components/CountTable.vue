<template>
  <div width="100%">
    <div class="count-table-title count-table-font">
      <span>{{title}}</span>
    </div>
    <div v-show="tdData.length>5" class="count-table-more">
      <label @click="onMore(code)">查看更多</label>
    </div>
    <x-table full-bordered id="count-table" class="count-table-font">
      <thead>
        <tr>
          <th v-for="v in thData" :width="v.width" :key="v.name">{{v.name}}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="v in tdData" :key="v">
          <td v-for="(tv,tk) in v" :key="tk">{{tv}}</td>
        </tr>
      </tbody>
    </x-table>
  </div>
</template>

<script>
  import {
    XTable
  } from 'vux'
  export default {
    components: {
      XTable
    },
    props: ['title', 'code', 'thData', 'tdData', 'onMore'],
    methods: {
    }
  }
</script>

<style>
  #count-table {
    margin-left: 7%;
    width: 86%;
  }

  #count-table tr th,td {
    height: 1.8rem;
    line-height: 1.8rem;
    font-size: 0.8rem;
  }

  .count-table-font {
    color: #666;
    font-family: PingFangSC-Regular;
  }

  .count-table-title {
    width: 50%;
    float: left;
    position: relative;
    margin: 0.8rem 0 0.3rem 25%;
    text-align: center;
    font-size: 0.8rem;
    color: black;
  }
  .count-table-more {
    text-align: center;
    float: right;
    position: relative;
    margin-top:0.8rem;
    margin-right:1.6rem;
    font-size: 0.7rem;
    color:#8ebf52;
  }
</style>

