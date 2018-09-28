<template>
  <div>
    <canvas v-show="false" ref="canvas" :width="width" :height="height"></canvas>
    <qriously v-show="false" ref="qriously" level="M" :value="value" :size="size" :backgroundAlpha="1.0" background="white" foreground="black" />
    <img v-bind:src="qrimg" width="100%" >
  </div>
</template>
<script>
import Vue from 'vue'
import VueQriously from 'vue-qriously'

Vue.use(VueQriously)

export default {
  props: {
    src: {type: String},
    x: {type: Number},
    y: {type: Number},
    size: {type: Number},
    value: {type: String}
  },
  computed: {
    refreshKey: function() {
      return this.src + '-' + this.x + '-' + this.y + '-' + this.size + '-' + this.value
    }
  },
  components: {
  },
  mounted() {
    this.start()
  },
  watch: {
    refreshKey(curVal, oldVal) {
      this.start()
    }
  },
  methods: {
    start() {
      var img = new Image()
      img.onload = () => {
        this.drawImg(img, img.width, img.height)
      }
      img.crossOrigin = 'anonymous'
      img.src = this.src
    },
    drawImg(img, width, height) {
      let canvas = this.$refs.canvas
      canvas.width = width
      canvas.height = height
      let cxt = canvas.getContext('2d')
      cxt.drawImage(img, 0, 0, width, height)
      this.drawQr(cxt)
    },
    drawQr(cxt) {
      let qriously = this.$refs.qriously
      var img = new Image()
      img.onload = () => {
        cxt.drawImage(img, this.x, this.y, img.width, img.height)
        this.qrimg = cxt.canvas.toDataURL('image/jpeg')
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
