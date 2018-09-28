<template>
  <div v-transfer-dom>
    <x-dialog v-model="showTask" :dialog-style="{'width': 'auto', 'background-color': 'transparent'}" @on-hide="hideVideo">
      <video ref="video" controls :src="source" preload="auto" autoplay="autoplay" controlsList="nodownload" height="400px" width="300px">
      </video>
      <x-icon type="ios-close-outline" style="fill:#fff;marginTop: 5px;width: 30px;height: 30px" @click="showTask=false"></x-icon>
    </x-dialog>
  </div>
</template>

<script>
import { XDialog, TransferDomDirective as TransferDom } from 'vux'
export default {
  directives: {
    TransferDom
  },
  props: ['show', 'source'],
  components: {
    TransferDom, XDialog
  },
  data () {
    return {
      showTask: false,
      userInfo: {}
    }
  },
  watch: {
    show(newValue, oldValue) {
      if (newValue === true) {
        this.showTask = true
      }
    }
  },
  mounted () {
    this.showTask = this.show
  },
  methods: {
    hideVideo() {
      this.$refs.video.pause()
      this.$emit('hide-dialog')
    }
  }

}
</script>

<style>
.help-dialog .weui-dialog {
  width:85vw !important;
  max-width:85vw !important;
}
video::-webkit-media-controls-fullscreen-button {
  display: none;
}
/* video::-webkit-media-controls-play-button { */
  /* display: none !important; */
/* } */
video::-internal-media-controls-download-button {
  display: none;
}
video::-webkit-media-controls-current-time-display{
  display: none !important;
}
video::-webkit-media-controls-time-remaining-display {
  display: none !important;
}
video::-webkit-media-controls-mute-button {
  display: none !important;
}
video::-webkit-media-controls-toggle-closed-captions-button {
  display: none !important;
}
video::-webkit-media-controls-volume-slider {
  display: none !important;
}
</style>
<style lang="less" scoped>
@import '~vux/src/styles/close';
.dialog-demo {
  .vux-close {
    margin-top: 8px;
    margin-bottom: 8px;
  }
}
</style>
