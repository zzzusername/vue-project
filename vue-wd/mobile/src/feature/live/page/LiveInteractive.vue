<template>
  <div class="wechat_root" >
    <remote-js src="http://cdn.ronghub.com/RongIMLib-2.2.5.js" @load-js-finish="loadRongJs"></remote-js>
    <div id="videoBox" ref="video_layout">
      <input ref="live_play_btn" id="playBtn" type="button" value="" @click="play" >
      <img ref="live_bg" id="live_poster" src="../../../assets/player.jpg" alt="" @load="setCoverHeight">
      <video ref="player" id="videoLive" preload="auto" poster="" x5-video-player-type="h5" x5-video-player-fullscreen="true" webkit-playsinline="true" x-webkit-airplay="true" playsinline="true">
        <source src="http://1011.hlsplay.aodianyun.com/demo/game.m3u8">
      </video>
      <div class="live_tab" ref="tab">
        <tab :line-width="1" custom-bar-width="60px">
          <tab-item v-for="(tabItem, index) in liveTabList" :selected="tabItem == tabCurrent" @on-item-click="tabClick(index, tabItem)" :key="index">{{tabItem}}</tab-item>
        </tab>
      </div>
    </div>
    <div :style= "{marginTop: listMarginTop + 'px' }">
      <router-view></router-view>
    </div>
    <!--<scroller class="scroll_view" :style= "{marginTop: listMarginTop + 'px' }" :height="listHeight + ''" lock-x  @on-scroll="onScroll" ref="scrollerEvent">
    </scroller>-->
    <chat-input-view></chat-input-view>
  </div>
</template>
    
<script>
  import ChatInputView from './ChatInputView'
  import { Scroller, Tab, TabItem } from 'vux'
  export default {
    created () {
    },
    mounted () {
      window.onresize = () => {
        return (() => {
          console.log('====onresize====')
          this.autoWH()
          console.log(this.iWindowHeight + ':' + this.iWindowWidth)
          this.$refs.player.style.width = this.iWindowWidth + 'px'
          this.$refs.player.style.height = this.iWindowHeight + 'px'
          this.listHeight = this.listHeight + 0.1
          this.$store.commit('setLiveChatRoomHeight', this.listHeight)
          // console.log('height' + this.listHeight + 'offset:' + this.$refs.player.offsetWidth * 9 / 16 + 'aa:' + this.$refs.tab.offsetHeight)
        })()
      }
      // this.tools.loadRongImJs((RongIMLib) => {})
      console.log('listheight' + this.listHeight)
      // this.initRong()
      // this.$router.push({name: 'livechatroom', params: {height: this.listHeight}})
      // window.addEventListener('touchmove', function (e) { e.preventDefault() }, false)
      this.$refs.player.addEventListener('x5videoexitfullscreen', function () {
        this.$refs.live_play_btn.style.display = 'block'
        console.log('====x5videoexitfullscreen====')
      })
    },
    data () {
      return {
        iWindowWidth: 0,
        iWindowHeight: 0,
        listMarginTop: 0,
        listHeight: 0,
        liveTabList: ['互动', '介绍', '榜单', '合作'],
        tabCurrent: '互动'
      }
    },
    methods: {
      play (event) {
        this.$refs.player.play()
        // this.$refs.tab.style.marginTop = this.$refs.player.offsetWidth * 9 / 16 + 2 + 'px'
        this.$refs.live_bg.style.display = this.$refs.live_play_btn.style.display = 'none'
        // this.listMarginTop = this.$refs.player.offsetWidth * 9 / 16 + this.$refs.tab.offsetHeight
        // this.listHeight = -(this.$refs.player.offsetWidth * 9 / 16 + this.$refs.tab.offsetHeight + 50) + ''
        console.log('play' + this.listHeight)
      },
      autoWH () {
        this.iWindowWidth = window.innerWidth
        this.iWindowHeight = window.innerHeight
      },
      setCoverHeight (event) {
        this.$refs.live_bg.style.height = this.$refs.player.offsetWidth * 9 / 16 + 'px'
        this.$refs.tab.style.marginTop = this.$refs.video_layout.style.height = this.$refs.live_bg.offsetHeight + 'px'
        this.listMarginTop = this.$refs.live_bg.offsetHeight + this.$refs.tab.offsetHeight
        this.listHeight = -(this.$refs.live_bg.offsetHeight + this.$refs.tab.offsetHeight + 50)
        this.$store.commit('setLiveChatRoomHeight', this.listHeight)
        this.$router.replace({name: 'livechatroom'})
      },
      tabClick (index, val) {
        // tab点击
        this.tabCurrent = val
        switch (index) {
          case 0:
            this.$router.replace({name: 'livechatroom'})
            break
          case 1:
            this.$router.replace({name: 'liveintroduce'})
            break
        }
      },
      onScroll () {

      },
      loadRongJs () {
        // console.log('loadRongjs', RongIMLib) // eslint-disable-line
        this.initRong(RongIMLib) // eslint-disable-line
      },
      initRong (RongIMLib) {
        console.log('initRong', RongIMLib)
        RongIMLib.RongIMClient.init('sfci50a7somri')
        var token = 'SltixG2BhdkUVqaO1oxviWIeLiqF2F8wj9y48OXkqLOlE4M8mDWPVYWHKY5JFXuz4jowOje3A2O9V7Sbt1K0cQ=='
        RongIMLib.RongIMClient.connect(token, {
          onSuccess: function (userId) {
            console.log('Login successfully.' + userId)
          },
          onTokenIncorrect: function () {
            console.log('token无效')
          },
          onError: function (errorCode) {
            var info = ''
            switch (errorCode) {
              case RongIMLib.ErrorCode.TIMEOUT:
                info = '超时'
                break
              case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                info = '未知错误'
                break
              case RongIMLib.ErrorCode.UNACCEPTABLE_PaROTOCOL_VERSION:
                info = '不可接受的协议版本'
                break
              case RongIMLib.ErrorCode.IDENTIFIER_REJECTED:
                info = 'appkey不正确'
                break
              case RongIMLib.ErrorCode.SERVER_UNAVAILABLE:
                info = '服务器不可用'
                break
            }
            console.log(errorCode + ':' + info)
          }
        })
        RongIMLib.RongIMClient.setConnectionStatusListener({
          onChanged: function (status) {
            switch (status) {
              // 链接成功
              case RongIMLib.ConnectionStatus.CONNECTED:
                console.log('链接成功')
                break
                // 正在链接
              case RongIMLib.ConnectionStatus.CONNECTING:
                console.log('正在链接')
                break
                // 重新链接
              case RongIMLib.ConnectionStatus.DISCONNECTED:
                console.log('断开连接')
                break
                // 其他设备登录
              case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
                console.log('其他设备登录')
                break
                // 网络不可用
              case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
                console.log('网络不可用')
                break
            }
          }
        })
        // 消息监听器
        RongIMLib.RongIMClient.setOnReceiveMessageListener({
        // 接收到的消息
          onReceived: function (message) {
            // 判断消息类型
            switch (message.messageType) {
              case RongIMLib.RongIMClient.MessageType.TextMessage:
                // 发送的消息内容将会被打印
                console.log(message.content.content)
                break
              case RongIMLib.RongIMClient.MessageType.VoiceMessage:
                // 对声音进行预加载
                // message.content.content 格式为 AMR 格式的 base64 码
                RongIMLib.RongIMVoice.preLoaded(message.content.content)
                break
              case RongIMLib.RongIMClient.MessageType.ImageMessage:
                // do something...
                break
              case RongIMLib.RongIMClient.MessageType.DiscussionNotificationMessage:
                // do something...
                break
              case RongIMLib.RongIMClient.MessageType.LocationMessage:
                // do something...
                break
              case RongIMLib.RongIMClient.MessageType.RichContentMessage:
                // do something...
                break
              case RongIMLib.RongIMClient.MessageType.InformationNotificationMessage:
                // do something...
                break
              case RongIMLib.RongIMClient.MessageType.ContactNotificationMessage:
                // do something...
                break
              case RongIMLib.RongIMClient.MessageType.ProfileNotificationMessage:
                // do something...
                break
              case RongIMLib.RongIMClient.MessageType.CommandNotificationMessage:
                // do something...
                break
              case RongIMLib.RongIMClient.MessageType.CommandMessage:
                // do something...
                break
              case RongIMLib.RongIMClient.MessageType.UnknownMessage:
                // do something...
                break
              default:
                // 自定义消息
                // do something...
            }
          }
        })
      //   this.tools.loadRongImJs((RongIMLib) => {
      //     RongIMLib.RongIMClient.init('sfci50a7somri')
      //     var token = 'd2DZPplNNli7ijN+EFLa1mIeLiqF2F8wj9y48OXkqLOlE4M8mDWPVVnetAgqbxVTd8WjqtPYa4+9V7Sbt1K0cQ=='
      //     // 连接融云服务器。
      //     RongIMLib.RongIMClient.connect(token, {
      //       onSuccess: function (userId) {
      //         console.log('Login successfully.' + userId)
      //       },
      //       onTokenIncorrect: function () {
      //         console.log('token无效')
      //       },
      //       onError: function (errorCode) {
      //         var info = ''
      //         switch (errorCode) {
      //           case RongIMLib.ErrorCode.TIMEOUT:
      //             info = '超时'
      //             break
      //           case RongIMLib.ErrorCode.UNKNOWN_ERROR:
      //             info = '未知错误'
      //             break
      //           case RongIMLib.ErrorCode.UNACCEPTABLE_PaROTOCOL_VERSION:
      //             info = '不可接受的协议版本'
      //             break
      //           case RongIMLib.ErrorCode.IDENTIFIER_REJECTED:
      //             info = 'appkey不正确'
      //             break
      //           case RongIMLib.ErrorCode.SERVER_UNAVAILABLE:
      //             info = '服务器不可用'
      //             break
      //         }
      //         console.log(errorCode + ':' + info)
      //       }
      //     })
  
      //     RongIMLib.RongIMClient.setConnectionStatusListener({
      //       onChanged: function (status) {
      //         switch (status) {
      //           // 链接成功
      //           case RongIMLib.ConnectionStatus.CONNECTED:
      //             console.log('链接成功')
      //             break
      //             // 正在链接
      //           case RongIMLib.ConnectionStatus.CONNECTING:
      //             console.log('正在链接')
      //             break
      //             // 重新链接
      //           case RongIMLib.ConnectionStatus.DISCONNECTED:
      //             console.log('断开连接')
      //             break
      //             // 其他设备登录
      //           case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
      //             console.log('其他设备登录')
      //             break
      //             // 网络不可用
      //           case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
      //             console.log('网络不可用')
      //             break
      //         }
      //       }
      //     })
      //   })
      }
    },
    components: {
      ChatInputView,
      Scroller,
      Tab,
      TabItem
    }
  }
  // http://eshare.live.otvcloud.com/otv/nyz/live/channel89/700.m3u8
</script>

<style>
  .wechat_root {
    height: 100%;
  }

  .scroll_view {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 0;
    margin-bottom: 50px;
  }
  
  video {
    object-position: 0px 0px;
    width: 100%;
  }
  
  .live_tab {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
  }

  #videoBox {
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
  }
  
  #playBtn {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    display: block;
    border: none;
    background: url("../../../assets/playBtn.png") center no-repeat;
    z-index: 1000;
    width: 100%;
    background-size: 100px;
    height: 180px;
  }
  
  #live_poster {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 100;
  }
</style>
