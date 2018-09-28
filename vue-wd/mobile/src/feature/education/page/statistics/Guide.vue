<template>
  <div>
    <div style="text-align:center;padding-top:100px">
      <span class="iconfont icon-zhuzhuangtu" style="color:#e2e2e2;font-size:90px"></span>
    </div>
    <!-- <p style="text-align:center;margin-top:-20px;color:#a2a2a2">{{tools.isNull(filterDesc)?'请选择筛选条件':filterDesc}}</p> -->
    <div>
      <slot></slot>
    </div>
    <div style="text-align:center;">
      <x-button style="margin: 10px auto;width: 80px;display:block;font-size:14px;margin-top:30px" text="筛选" type="primary" @click.native="filterLink"></x-button>
    </div>
  </div>
</template>

<script>
import {XButton} from 'vux'
export default {
  components: {
    XButton
  },
  data () {
    return {
    }
  },
  props: ['filterLink', 'filterDesc'],
  mounted () {
  }
}
</script>

<style>

</style>
