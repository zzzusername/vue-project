<template>
  <div>
    <x-dialog v-model="showTask" :dialog-style="{'width':'auto', 'height':'auto'}">
      <div class="person-propagate" @click="skip">
        <img :src="imgUrl">
      </div>
      <div style="padding: 10px;" @click="done">
        <span class="vux-close"></span>
      </div>
    </x-dialog>
  </div>
</template>

<script>
import { XDialog } from 'vux'
export default {
  props: {
    show: Boolean,
    isTeacher: Boolean
  },
  components: {
    XDialog
  },
  data () {
    return {
      showTask: false,
      // userInfo: {},
      imgUrl: ''
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
    this.imgUrl = this.isTeacher ? 'http://img.qunxiaozhu.com/help/hb_jiaoshi_1.png' : 'http://img.qunxiaozhu.com/help/hb_jiazhang_1.png'
    // this.localStorage.getUserInfo({schoolId: this.$route.params.schoolId}, (info) => {
    //   this.userInfo = info
    // })
  },
  methods: {
    done () {
      this.showTask = false
      this.$emit('show-help-dialog')
      // if (this.userInfo.isParent) {
      //   this.localStorage.setRedEnvelopesPersonalSchoolParent(this.$route.params.schoolId, 8)
      //   return
      // }
      // if (this.userInfo.isTeacher) {
      //   this.localStorage.setRedEnvelopesPersonalSchoolMaster(this.$route.params.schoolId, 9)
      //   if (this.localStorage.getHelpForPersonalSchoolMaster(this.$route.params.schoolId) !== '1' && this.userInfo.isMaster) {
      //     this.$emit('show-help-dialog')
      //   }
      // }
    },
    skip() {
      this.$router.push({name: 'educationRedPacket'})
    }
  }

}
</script>

<style lang="less" scoped>
@import '~vux/src/styles/close';
.dialog-demo {
  .vux-close {
    margin-top: 8px;
    margin-bottom: 8px;
  }
}
.person-propagate {
  width: 75vw;
  img {
    height: 100%;
    width: 100%;
  }
}
</style>
