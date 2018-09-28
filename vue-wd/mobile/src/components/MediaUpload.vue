<template>
  <div>
    <div style="overflow:hidden;backgroundColor: #fff;marginTop:10px;marginLeft:1em;">
      <div style="width:60px;height:60px;margin:10px 5px 10px 10px;float:left;border: 1px #d9d9d9 solid;position:relative" v-if="imageList.length>0" v-for="(item, index) in imageList" :key="index" @click="showOperate(index)">
        <img style="max-width: 100%;max-height: 100%;display:block;position:absolute;left: 50%;top: 50%;transform: translate(-50%, -50%);" :src="tools.cdn(item+'?imageView2/1/w/100/h/100')">
      </div>
      <div style="width:60px;height:60px;margin:10px 5px 10px 10px;float:left;border: 1px #d9d9d9 solid;position:relative;text-align:center" v-if="audioList.length>0" v-for="(item, index) in audioList" :key="index" @click="showAudioOperate(index)">
        <img style="width:33px;margin-top:5px;" src="../assets/record_normal.png">
        <p style="font-size:12px;margin-top:-3px;">语音{{index+1}}</p>
      </div>
      <div style="width:60px;height:60px;margin:10px 5px 10px 10px;float:left;border: 1px #d9d9d9 solid;position:relative;text-align:center" v-if="videoList.length>0" v-for="(item, index) in videoList" :key="index" @click="showVideoOperate(index)">
        <img style="width:33px;margin-top:5px;" src="../assets/play_icon.png">
        <p style="font-size:12px;margin-top:-3px;">视频{{index+1}}</p>
      </div>
      <img v-if="isShowAdd" style="width:60px;margin:10px;" src="../assets/addImg.png" @click="addMedia">
      <p v-if="videoList.length>0" style="color:red;font-size:14px;">视频只保留30天</p>
    </div>
    <input ref="videoinput" style="display:none" type="file" accept="video/*" @change="selectVideoFile"/>
    <actionsheet v-model="showFileSheet" :menus="fileMenus" @on-click-menu="onFileMenuclick" show-cancel></actionsheet>
    <actionsheet v-model="showActionSheet" :menus="menu" @on-click-menu="actionSheetClick" show-cancel></actionsheet>
    <actionsheet v-model="showAudioActionSheet" :menus="audioMenu" @on-click-menu="audioActionSheetClick" show-cancel></actionsheet>
    <actionsheet v-model="showVideoActionSheet" :menus="videoMenu" @on-click-menu="videoActionSheetClick" show-cancel></actionsheet>
    <record :record="showRecord" :play="showPlayVoice" :callback="recordCallback" :voice="currentVoice"></record>
    <video-dialog :show="playVideo" @hide-dialog="hideVideoDialog" :source="tools.cdn(currentVideo)"></video-dialog>
  </div>
</template>

<script>
import { Actionsheet, LoadingPlugin, XDialog } from 'vux'
import VideoDialog from './VideoDialog.vue'
import Record from '@/components/Record'
import Vue from 'vue'
Vue.use(LoadingPlugin)
export default {
  components: {
    Record, Actionsheet, XDialog, VideoDialog
  },
  props: [ 'callBack', 'imageData', 'audioData', 'videoData', 'imageType', 'audioType', 'videoType', 'args', 'count' ],
  data () {
    return {
      fileMenus: {
        image: '照片'
      },
      showFileSheet: false,
      showActionSheet: false,
      menu: {
        delete: '<p style="color:red;">删除</p>'
      },
      showAudioActionSheet: false,
      audioMenu: {
        play: '播放',
        delete: '<p style="color:red;">删除</p>'
      },
      showVideoActionSheet: false,
      videoMenu: {
        play: '预览',
        delete: '<p style="color:red;">删除</p>'
      },
      showRecord: false,
      showPlayVoice: false,
      currentVoice: null,
      imageList: [],
      audioList: [],
      videoList: [],
      currentAudioIndex: 0,
      imageMaxCount: 9,
      isShowAdd: true,
      currentVideo: null,
      playVideo: false,
      currentVideoIndex: 0
    }
  },
  watch: {
    imageData (newValue, oldValue) {
      if (newValue.length > 0 && this.imageList.length === 0) {
        this.imageList = newValue
      }
    },
    audioData (newValue, oldValue) {
      if (newValue.length > 0 && this.audioList.length === 0) {
        this.audioList = newValue
      }
    },
    videoData (newValue, oldValue) {
      if (newValue.length > 0 && this.videoList.length === 0) {
        this.videoList = newValue
      }
    },
    imageList (newValue, oldValue) {
      this.callBack({imageData: newValue, audioData: this.audioList, videoData: this.videoList})
      if (newValue.length < this.imageMaxCount || (this.audioType !== null && this.audioType !== undefined)) {
        this.isShowAdd = true
      } else {
        this.isShowAdd = false
      }
    },
    audioList (newValue, oldValue) {
      this.callBack({imageData: this.imageList, audioData: newValue, videoData: this.videoList})
    },
    videoList (newValue, oldValue) {
      this.callBack({imageData: this.imageList, audioData: this.audioList, videoData: newValue})
    }
  },
  mounted () {
    if (parseInt(this.count) > 0) {
      this.imageMaxCount = parseInt(this.count)
    }
  },
  methods: {
    addMedia () {
      if (!this.tools.isNull(this.audioType)) {
        this.fileMenus.audio = '音频'
      }
      if (!this.tools.isNull(this.videoType)) {
        this.fileMenus.video = '视频'
      }
      if (this.tools.isNull(this.audioType) && this.tools.isNull(this.videoType)) {
        this.chooseImage()
      } else {
        this.showFileSheet = true
      }
    },
    // 上传文件事件
    onFileMenuclick (key) {
      if (key === 'image') {
        this.chooseImage()
      } else if (key === 'audio') {
        this.showRecord = !this.showRecord
      } else if (key === 'video') {
        if (this.$refs.videoinput) {
          this.$refs.videoinput.click()
        }
      }
    },
    // 点击图片
    showOperate (index) {
      this.showActionSheet = true
      this.currentImageIndex = index
    },
    actionSheetClick (key) {
      switch (key) {
        case 'delete':
          this.imageList.splice(this.currentImageIndex, 1)
          break
      }
    },
    // 点击语音
    showAudioOperate (index) {
      this.showAudioActionSheet = true
      this.currentAudioIndex = index
    },
    audioActionSheetClick (type) {
      if (type === 'play') {
        this.currentVoice = this.audioList[this.currentAudioIndex]
        console.log('currentVoice', JSON.stringify(this.currentVoice))
        this.showPlayVoice = !this.showPlayVoice
      } else if (type === 'delete') {
        this.audioList.splice(this.currentAudioIndex, 1)
      }
    },
    recordCallback (res) {
      // 上传录音
      this.$vux.loading.show({
        text: '语音上传中'
      })
      this.$wechat.uploadVoice({
        localId: res.localId,
        isShowProgressTips: 0,
        success: (res) => {
          this.uploadApi.uploadAudio({type: this.audioType, args: this.args, mediaId: res.serverId}, (data) => {
            this.audioList.push(data.result.path)
            this.$vux.loading.hide()
          }, () => {
            this.tools.warnToast('语音上传失败')
            this.$vux.loading.hide()
          })
        },
        fail: (res) => {
          console.log('wechat err', res)
          this.$vux.loading.hide()
        }
      })
    },
    chooseImage () {
      var num = this.imageMaxCount - this.imageList.length
      this.$wechat.chooseImage({
        count: num,
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: res => {
          this.$vux.loading.show({
            text: '图片上传中'
          })
          var localIds = res.localIds
          this.uploadImage(localIds)
        }
      })
    },
    uploadImage (localIds) {
      if (localIds.length === 0) {
        this.$vux.loading.hide()
      }
      var localId = localIds.shift()
      this.$wechat.uploadImage({
        localId: localId,
        isShowProgressTips: 0,
        success: (res) => {
          this.uploadApi.uploadMpImage({type: this.imageType, args: this.args, mediaId: res.serverId}, (data) => {
            this.imageList.push(data.result.path)
            this.uploadImage(localIds)
          }, () => {
            this.tools.warnToast('图片上传失败')
            this.$vux.loading.hide()
          })
        }
      })
    },
    selectVideoFile (e) {
      let file = e.target.files[0]
      let reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = () => {
        let dataURL = reader.result
        this.uploadVideo(dataURL)
      }
    },
    uploadVideo (file) {
      this.$vux.loading.show({
        text: '视频上传中'
      })
      this.uploadApi.getToken({type: this.videoType, args: this.$route.params.schoolId}, (data) => {
        this.uploadApi.uploadImage({token: data.result.token, file: this.tools.data2blob(file), key: data.result.path}, (data) => {
          this.videoList.push(data.key)
          this.tools.successToast('视频上传成功')
          this.$vux.loading.hide()
        }, (er) => {
          this.tools.warnToast('视频上传失败')
          this.$vux.loading.hide()
        })
      }, () => {
        this.tools.warnToast('视频上传失败')
        this.$vux.loading.hide()
      })
    },
    showVideoOperate (index) {
      this.showVideoActionSheet = true
      this.currentVideoIndex = index
    },
    hideVideoDialog () {
      this.playVideo = false
    },
    videoActionSheetClick (type) {
      if (type === 'play') {
        this.currentVideo = this.videoList[this.currentVideoIndex]
        this.playVideo = true
      } else if (type === 'delete') {
        this.videoList.splice(this.currentVideoIndex, 1)
      }
    }
  }
}
</script>

<style>

</style>
