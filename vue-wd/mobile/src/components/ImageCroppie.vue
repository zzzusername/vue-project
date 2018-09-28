<template>
  <div v-transfer-dom>
    <popup v-model="show" height="100%">
      <div class="popup0">
        <vue-croppie ref=croppieRef 
        :enableOrientation="true" 
        :viewport="{ width: this.viewWidth, height: this.viewHeight }" 
        :boundary="{ width: '100vw', height: '100vh' }" 
        :enableExif="true"
        :showZoomer="false">
        </vue-croppie>
      </div>
      <tabbar  style="position:fixed">
          <tabbar-item @on-item-click="cancel()">
            <span slot="label" >
              <span class="iconfont icon-fanhui1 jhy-text-big" style="color:#a2d268;"></span>
              <span slot="label" >返回</span>
            </span>
          </tabbar-item>
          <tabbar-item @on-item-click="rotate(-90)">
            <span slot="label" >
              <span class="iconfont icon-zuoxuanzhuan90du jhy-text-big" style="color:#a2d268;"></span>
              <span slot="label" >左旋转</span>
            </span>
          </tabbar-item>
          <tabbar-item @on-item-click="rotate(90)">
           <span slot="label" >
              <span class="iconfont icon-youxuanzhuan90du jhy-text-big" style="color:#a2d268;"></span>
              <span slot="label" >右旋转</span>
            </span>
          </tabbar-item>
          <tabbar-item  @on-item-click="crop()" :style="{'background-color':'#8ebf52'}">
            <span slot="label" style="color:#fff">确定</span>
          </tabbar-item>
        </tabbar>
    </popup>
  </div>
</template>
<<script>
import { TransferDom, Popup, Flexbox, FlexboxItem, XButton, Tabbar, TabbarItem } from 'vux'
import Vue from 'vue'
import VueCroppie from 'vue-croppie'

Vue.use(VueCroppie)

export default {
  props: [ 'width', 'height', 'type' ],
  computed: {
    viewWidth: function() {
      if (parseInt(this.width) > parseInt(this.height)) {
        return 300
      } else {
        return 300 * this.width / this.height
      }
    },
    viewHeight: function() {
      if (parseInt(this.width) > parseInt(this.height)) {
        return 300 * this.height / this.width
      } else {
        return 300
      }
    },
    myType: function() {
      return (this.type) ? this.type : 'canvas'
    }
  },
  directives: {
    TransferDom
  },
  components: {
    TransferDom, Popup, Flexbox, FlexboxItem, XButton, Tabbar, TabbarItem
  },
  mounted() {
  },
  methods: {
    start() {
      // this.$refs.croppieRef.bind({ url: '' })
      this.$refs.croppieRef.destroy()
      this.$refs.croppieRef.initCroppie()
      this.show = true
      this.chooseImg()
    },
    cancel() {
      this.show = false
    },
    crop() {
      let options = {
        format: 'jpeg',
        circle: false,
        quality: 1,
        type: this.myType,
        size: {
          width: this.width,
          height: this.height
        }
      }
      this.$refs.croppieRef.result(options, (output) => {
        this.$emit('crop', [output])
        this.show = false
      })
    },
    rotate(rotationAngle) {
      this.$refs.croppieRef.rotate(rotationAngle)
    },
    chooseImg () {
      var that = this
      this.$wechat.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: res => {
          this.$wechat.getLocalImgData({
            localId: res.localIds[0], // 图片的localID
            success: res2 => {
              that.$refs.croppieRef.bind({
                url: res2.localData
              })
            }
          })
        },
        cancel: function () {
          that.show = false
        }
      })
    }
  },
  data () {
    return {
      show: false
    }
  }
}
</script>
