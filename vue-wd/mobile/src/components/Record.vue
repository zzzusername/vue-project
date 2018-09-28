<template>
  <div style="overflow: hidden; background-color: rgb(255, 255, 255); display:inline-block">
    <div v-transfer-dom>
      <popup v-model="showRecord" height="250px" :hide-on-blur="false">
        <span style="position: absolute;left:15px;top:15px;color:#666666" @click="closeRecord">取消</span>
        <span v-show="showStartRecord==false" style="position: absolute;display: block;left:50%;width:80px;margin-left:-40px;top: 30px;text-align:center;font-size:14px;color:#888888">{{time}}'</span>
        <div style="height:100%;text-align:center;line-height:250px;">
          <span v-if="showStartRecord" class="iconfont icon-record" style="font-size:80px;color:#FC5355;margin: 0 auto;-webkit-tap-highlight-color: transparent;" @click="startRecord"></span>
          <span v-else class="iconfont icon-recording" style="font-size:80px;color:#707070;margin: 0 auto;-webkit-tap-highlight-color: transparent;" @click="stopRecord"></span>
        </div>
        <span v-if="showStartRecord" style="position: absolute;display: block;left:50%;width:80px;margin-left:-40px;bottom: 55px;text-align:center;font-size:14px;color:#888888">点一下录音</span>
      </popup>
    </div>
    <div v-transfer-dom>
      <popup v-model="showPlay" height="250px" :hide-on-blur="false">
        <span style="position: absolute;left:15px;top:15px;color:#666666" @click="closePlay">{{isAudition==true?'取消':'关闭'}}</span>
        <span v-if="isAudition" style="position: absolute;right:15px;top:15px;color:#FC5355" @click="doneRecord">确定</span>
        <div v-show="showPlayVoice==false" class="recordAnim" style="position: absolute;display: block;left:50%;width:100px;height:25px;margin-left:-50px;top: 30px;text-align:center;font-size:14px;color:#888888"></div>
        <div style="height:100%;text-align:center;line-height:250px;">
          <span v-if="showPlayVoice" class="iconfont icon-play" style="font-size:80px;color:#FC5355;margin: 0 auto;-webkit-tap-highlight-color: transparent;" @click="playVoice"></span>
          <span v-else class="iconfont icon-recording" style="font-size:80px;color:#707070;margin: 0 auto;-webkit-tap-highlight-color: transparent;" @click="stopVoice"></span>
        </div>
        <span v-if="isAudition" style="position: absolute;display: block;left:50%;width:80px;margin-left:-40px;bottom: 55px;text-align:center;font-size:14px;color:#888888">试听</span>
        <audio id="audio" style="position: absolute;bottom:300px;height:0px;width:0px;" :src="tools.cdn(voicePath)" controls="controls"></audio> 
      </popup>
    </div>
  </div>
</template>

<script>
import { Popup, TransferDomDirective as TransferDom, Actionsheet, Confirm } from 'vux'
export default {
  directives: {
    TransferDom
  },
  components: {
    Popup, Actionsheet, Confirm
  },
  data () {
    return {
      showRecord: false,
      showStartRecord: false,
      showRecording: false,
      currentVoiceInfo: {},
      showPlay: false,
      showPlayVoice: false,
      time: 0,
      currentTimeout: null,
      voicePath: null,
      isAudition: false
    }
  },
  props: ['callback', 'record', 'play', 'voice'], // status: 1 startRecord 2 stopRecord
  watch: {
    record (newValue, oldValue) {
      if (this.showRecord === false) {
        // 显示录音界面
        this.showRecord = true
        this.showStartRecord = true
      }
    },
    play (newValue, oldValue) {
      if (this.showPlay === false) {
        // 显示播放页面
        this.showPlay = true
        this.playVoice()
      }
    }
  },
  mounted () {
  },
  methods: {
    // 开始录音
    startRecord () {
      this.$wechat.startRecord({
        success: (res) => {
          this.showStartRecord = false
          this.time = 0
          this.keepTime()
        },
        fail: (res) => {
          // 录音失败
          this.tools.warnToast('录音失败')
        }
      })
      this.$wechat.onVoiceRecordEnd({
          // 录音时间超过一分钟没有停止的时候会执行 complete 回调
        complete: (res) => {
          this.mStopRecord(res)
        }
      })
    },
    stopRecord () {
      this.$wechat.stopRecord({
        success: (res) => {
          this.mStopRecord(res)
        },
        fail: (res) => {
          this.tools.warnToast('录音失败')
        }
      })
    },
    mStopRecord (res) {
      // 关闭录音窗口
      this.showRecord = false
      if (this.currentTimeout !== null) {
        clearTimeout(this.currentTimeout)
      }
      // 回调信息
      // this.currentVoiceInfo = {}
      this.voice = {localId: res.localId}
      // this.callback(this.currentVoiceInfo)
      this.showPlay = true
      this.showPlayVoice = true
      this.isAudition = true
      // this.playVoice()
    },
    closeRecord () {
      this.showRecord = false
      this.$wechat.stopRecord()
      if (this.currentTimeout !== null) {
        clearTimeout(this.currentTimeout)
      }
    },
    closePlay () {
      this.showPlay = false
      this.stopVoice()
    },
    playVoice () {
      if (typeof this.voice === 'string') {
        // 网络文件
        this.voicePath = this.voice
        setTimeout(() => {
          this.showPlayVoice = false
          let audio = document.getElementById('audio')
          audio.play()
          // audio.loop = false
          audio.addEventListener('ended', () => {
            this.showPlayVoice = true
          }, false)
        }, 200)
      } else {
        // 本地文件
        this.showPlayVoice = false
        this.$wechat.playVoice({
          localId: this.voice.localId // 需要播放的音频的本地ID，由stopRecord接口获得
        })
        this.$wechat.onVoicePlayEnd({
          success: (res) => {
            this.showPlayVoice = true
          }
        })
      }
    },
    stopVoice () {
      this.showPlayVoice = true
      if (this.tools.isNull(this.voice.localId)) {
        let audio = document.getElementById('audio')
        audio.currentTime = 0
        audio.pause()
      } else {
        this.$wechat.stopVoice({
          localId: this.voice.localId // 需要停止的音频的本地ID，由stopRecord接口获得
        })
      }
    },
    keepTime () {
      this.currentTimeout = setTimeout(() => {
        this.time = this.time + 1
        this.keepTime()
      }, 1000)
    },
    doneRecord () {
      this.isAudition = false
      this.closePlay()
      setTimeout(() => {
        this.currentVoiceInfo = {localId: this.voice.localId}
        this.callback(this.currentVoiceInfo)
      }, 200)
    }
  }
}
</script>

<style>
  @keyframes run{
    0% {background-position: 0px 0px ;} 
    5% {background-position: 5px 0px ;} 
    10% {background-position: 10px 0px ;} 
    15% {background-position: 15px 0px ;} 
    20% {background-position: 20px 0px ;} 
    25% {background-position: 25px 0px ;} 
    30% {background-position: 30px 0px ;} 
    35% {background-position: 35px 0px ;} 
    40% {background-position: 40px 0px ;} 
    45% {background-position: 45px 0px ;} 
    50% {background-position: 50px 0px ;} 
    55% {background-position: 55px 0px ;} 
    60% {background-position: 60px 0px ;} 
    65% {background-position: 65px 0px ;} 
    70% {background-position: 70px 0px ;} 
    75% {background-position: 75px 0px ;} 
    80% {background-position: 80px 0px ;} 
    85% {background-position: 85px 0px ;} 
    90% {background-position: 90px 0px ;} 
    95% {background-position: 95px 0px ;} 
    100% {background-position: 0px 0px ;} 
}
@-webkit-keyframes run{
    0% {background-position: 0px 0px ;} 
    5% {background-position: 5px 0px ;} 
    10% {background-position: 10px 0px ;} 
    15% {background-position: 15px 0px ;} 
    20% {background-position: 20px 0px ;} 
    25% {background-position: 25px 0px ;} 
    30% {background-position: 30px 0px ;} 
    35% {background-position: 35px 0px ;} 
    40% {background-position: 40px 0px ;} 
    45% {background-position: 45px 0px ;} 
    50% {background-position: 50px 0px ;} 
    55% {background-position: 55px 0px ;} 
    60% {background-position: 60px 0px ;} 
    65% {background-position: 65px 0px ;} 
    70% {background-position: 70px 0px ;} 
    75% {background-position: 75px 0px ;} 
    80% {background-position: 80px 0px ;} 
    85% {background-position: 85px 0px ;} 
    90% {background-position: 90px 0px ;} 
    95% {background-position: 95px 0px ;} 
    100% {background-position: 0px 0px ;} 
}
.recordAnim{
    width:50px;
    height:25px;
    background: url(http://img1.sq3q.com/test/play21.png) ;
    animation:run 1.5s steps(1, start) infinite;
        -webkit-animation:run 1.5s steps(1, start) infinite;
}
</style>
