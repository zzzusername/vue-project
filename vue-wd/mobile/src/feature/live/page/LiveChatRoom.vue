<template>
  <scroller :height="liveChatRoomHeight + ''" lock-x>
    <ul>
      <li v-for="item in 30">
        <div style="maginTop: 5px;">
          <img class="user_icon jhy-margin-left-xs" src="http://img0.imgtn.bdimg.com/it/u=3600885227,393530587&fm=11&gp=0.jpg">
          <h5 style="marginLeft: 43px;">你的名字</h5>
          <p class="msg_content jhy-margin-right-xs">图片是指由图形、图像等构成的平面媒体。图片的格式很多，但总体上可以分为点阵图和矢量图两大类，我们常用BMP、JPG等格式都是点阵图形，而SWF、CDR、AI等格式的图形属于矢量图形。有形式的事物，我们看到的，是图画、照片、拓片等的统称。</p>
        </div>
      </li>
    </ul>
  </scroller>
</template>

<script>
  import { Scroller } from 'vux'
  export default {
    components: {
      Scroller
    },
    created () {
      this.receiveMsg()
    },
    data () {
      return {
      }
    },
    computed: {
      liveChatRoomHeight () {
        return this.$store.getters.getLiveChatRoomHeight
      }
    },
    methods: {
      receiveMsg () {
      //   this.tools.loadRongImJs((RongIMLib) => {
      //     // 消息监听器
      //     RongIMLib.RongIMClient.setOnReceiveMessageListener({
      //     // 接收到的消息
      //       onReceived: function (message) {
      //         // 判断消息类型
      //         switch (message.messageType) {
      //           case RongIMLib.RongIMClient.MessageType.TextMessage:
      //             // 发送的消息内容将会被打印
      //             console.log(message.content.content)
      //             break
      //           case RongIMLib.RongIMClient.MessageType.VoiceMessage:
      //             // 对声音进行预加载
      //             // message.content.content 格式为 AMR 格式的 base64 码
      //             RongIMLib.RongIMVoice.preLoaded(message.content.content)
      //             break
      //           case RongIMLib.RongIMClient.MessageType.ImageMessage:
      //             // do something...
      //             break
      //           case RongIMLib.RongIMClient.MessageType.DiscussionNotificationMessage:
      //             // do something...
      //             break
      //           case RongIMLib.RongIMClient.MessageType.LocationMessage:
      //             // do something...
      //             break
      //           case RongIMLib.RongIMClient.MessageType.RichContentMessage:
      //             // do something...
      //             break
      //           case RongIMLib.RongIMClient.MessageType.InformationNotificationMessage:
      //             // do something...
      //             break
      //           case RongIMLib.RongIMClient.MessageType.ContactNotificationMessage:
      //             // do something...
      //             break
      //           case RongIMLib.RongIMClient.MessageType.ProfileNotificationMessage:
      //             // do something...
      //             break
      //           case RongIMLib.RongIMClient.MessageType.CommandNotificationMessage:
      //             // do something...
      //             break
      //           case RongIMLib.RongIMClient.MessageType.CommandMessage:
      //             // do something...
      //             break
      //           case RongIMLib.RongIMClient.MessageType.UnknownMessage:
      //             // do something...
      //             break
      //           default:
      //             // 自定义消息
      //             // do something...
      //         }
      //       }
      //     })
      //   })
      }
    }
  }
</script>

<style>
  .user_icon {
    float: left;
    height: 36px;
    border-radius: 5px;
  }
  .msg_content {
    margin-left: 43px;
  }
</style>
