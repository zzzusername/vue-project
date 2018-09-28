<template>
  <div style="margin-bottom:-50px;">
    <div :style="{'font-size': '16px', 'position': 'relative', 'fontSize':'16px', 'color':'#222222', 'background':'#2E3132', 'height':height+'px'}">
      <img class="qrcode_org_icon qrcode_childElement" :src="tools.cdn(qrInfo.qrImgUrl, 'logo.png')"/>
    </div>
  </div>
</template>

<script>
import { Cell } from 'vux'
import api from '../../personalApi'
export default {
  components: {
    Cell
  },
  data () {
    return {
      height: 0,
      qrInfo: {}
    }
  },
  mounted () {
    this.height = window.innerHeight
    api.getPersonalQrInfo({qrType: 'TEACHERORG'}, (data) => {
      this.qrInfo = data
    }, () => {})
  }
}
</script>

<style>
.qrcode_childElement{
  position: absolute;
  top: 17vh;
  left: 10vw;
 }
 .qrcode_org_icon {
  width: 80vw;
  height: 104vw;
  margin-right: 5px;
  background-position: center center;
  background-size: cover;
}
</style>
