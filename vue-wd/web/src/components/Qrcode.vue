<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="cover_wrap" @click.self="showTaglink">
        <div class="cover_inner">
          <qriously ref="qriously" level="M" :value="value" :size="size" :backgroundAlpha="1.0" background="white" foreground="black" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Vue from 'vue'
import VueQriously from 'vue-qriously'
Vue.use(VueQriously)
export default {
  props: ['value', 'size'],
  data () {
    return {}
  },
  methods: {
    showTaglink () {
      this.$emit('close-qrcode')
    }
  }
}
</script>

<style lang="less" scoped>
.cover_wrap{
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  background: rgba(0, 0, 0, .5);
  .cover_inner{
    border-radius: 5px;
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform:translate(-50%,-50%);
    -moz-transform:translate(-50%,-50%);
    -o-transform:translate(-50%,-50%);
    transform:translate(-50%,-50%);
    z-index: 101;
  }
}
</style>

