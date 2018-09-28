<template>
  <div>
    <canvas v-show="false" ref="canvas" :width="width" :height="height"></canvas>
    <qriously v-show="false" ref="qriously" level="Q" :value="value" :size="size" :backgroundAlpha="1.0" background="white" foreground="black" />
    <img v-bind:src="qrimg" :width="size" :height="size" >
  </div>
</template>
<script>
import Vue from 'vue'
import VueQriously from 'vue-qriously'

Vue.use(VueQriously)

export default {
  props: {
    src: {type: String},
    size: {type: Number},
    value: {type: String}
  },
  computed: {
    refreshKey: function() {
      return this.src + '-' + this.size + '-' + this.value
    }
  },
  components: {
  },
  mounted() {
    this.$nextTick(() => this.start())
  },
  watch: {
    refreshKey(curVal, oldVal) {
      this.$nextTick(() => this.start())
    }
  },
  methods: {
    start() {
      if (this.value) {
        let canvas = this.$refs.canvas
        canvas.width = this.size
        canvas.height = this.size
        let ctx = canvas.getContext('2d')
        this.drawQr(ctx)
      }
    },
    drawImg(ctx) {
      let img = new Image()
      let s = this.size / 4
      let p = (this.size - s) / 2
      img.onload = () => {
        ctx.fillStyle = 'white'
        ctx.fillRect(p - 2, p - 2, s + 4, s + 4)
        ctx.drawImage(img, p, p, s, s)
        this.qrimg = ctx.canvas.toDataURL('image/jpeg')
      }
      img.crossOrigin = 'anonymous'
      img.src = this.src
    },
    drawQr(ctx) {
      let qriously = this.$refs.qriously
      let img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0, this.size, this.size)
        if (this.src) {
          this.drawImg(ctx)
        } else {
          this.qrimg = ctx.canvas.toDataURL('image/jpeg')
        }
      }
      img.src = qriously.qrious.toDataURL()
    }
  },
  data () {
    return {
      qrimg: null,
      width: 200,
      height: 200
    }
  }
}
</script>
