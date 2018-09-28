<template>
    <div class="input_view" :style="{height: inputBoxHeight + 'px'}" v-transfer-dom ref="input_box">
      <input ref="chat_input_edit" :style="{ width: editWidth + 'px' }" class="chat_content_edit " type="text" :value="inputText" placeholder="请输入..." @input="input" @focus="focus" @blur="blur">
      <img class="chat_emoji_btn" src="../../../assets/chat_emoji.png" @click="emojiClick">
      <img class="chat_more_btn" src="../../../assets/chat_more.png" v-show="showMoreBtn" @click="liveChatMoreClick">
      <input class="send_msg_btn" type="button" v-show="showSendBtn" @click="sendLiveChatMsg" value="发送"></input>
      <emoji v-if="emojiListShow" style="position=absolute; top:0; marginTop:50px" @select-emoji="selectEmoji"></emoji>
    </div>
</template>

<script>
  import { WechatEmotion, Scroller, TransferDomDirective as TransferDom } from 'vux'
  import Emoji from '@/components/Emoji'
  export default {
    directives: {
      TransferDom
    },
    data () {
      return {
        inputBoxHeight: 50,
        showInputView: true,
        showSendBtn: false,
        showMoreBtn: true,
        intervalId: 0,
        editWidth: 0,
        inputText: '',
        emojiListShow: false,
        joinSuccess: false
      }
    },
    created () {
      console.log('chatinputview_create')
      this.joinLiveChatRoom()
    },
    mounted () {
      this.editWidth = window.innerWidth - 96
    },
    methods: {
      joinLiveChatRoom () {
        // var targetId = '1212'
        // this.tools.loadRongImJs((RongIMLib) => {
        //   RongIMLib.RongIMClient.getInstance().joinChatRoom(targetId, -1, {
        //     onSuccess: function () {
        //       console.log('joinChatRoom Successfully')
        //       this.joinSuccess = true
        //     },
        //     onError: function (error) {
        //       console.log('joinChatRoom:errorcode:' + error)
        //       this.joinSuccess = false
        //     }
        //   })
        // })
      },
      focus () {
        console.log('focus' + this.$refs.input_box.nodeName)
        var inputBox = this.$refs.input_box
        if (navigator.userAgent.match('iPhone')) {
          this.intervalId = setInterval(function () {
            console.log('scroll:' + inputBox.nodeName)
            inputBox.scrollIntoView(true)
          }, 500)
        }
      },
      blur () {
        console.log('blur')
        // this.showSendBtn = false
        // this.showMoreBtn = true
        if (navigator.userAgent.match('iPhone')) {
          clearInterval(this.intervalId)
        }
      },
      input () {
        var msgText = this.$refs.chat_input_edit.value
        this.inputText = msgText
        console.log('input' + this.inputText)
        if (msgText !== '') {
          this.showSendBtn = true
          this.showMoreBtn = false
        } else {
          this.showSendBtn = false
          this.showMoreBtn = true
        }
      },
      emojiClick () {
        console.log('emojiClick')
        if (this.emojiListShow) {
          this.inputBoxHeight = 50
          this.emojiListShow = false
        } else {
          this.inputBoxHeight = 170
          this.emojiListShow = true
        }
      },
      liveChatMoreClick () {
        console.log('liveChatMoreClick')
      },
      selectEmoji (val) {
        console.log(val)
        this.inputText = this.inputText + val
      },
      sendLiveChatMsg () {
        this.showSendBtn = false
        this.showMoreBtn = true
        console.log('sendmsg')
        // this.tools.loadRongImJs((RongIMLib) => {
        //   // 定义消息类型,文字消息使用 RongIMLib.TextMessage
        //   var msg = new RongIMLib.TextMessage({content: 'hello', extra: '附加信息'})
        //   // 或者使用RongIMLib.TextMessage.obtain 方法.具体使用请参见文档
        //   // var msg = RongIMLib.TextMessage.obtain("hello");
        //   var conversationtype = RongIMLib.ConversationType.CHATROOM // 私聊
        //   var targetId = '1212' // 目标 Id
        //   if (!this.joinSuccess) {
        //     this.joinLiveChatRoom()
        //     return
        //   }
        //   RongIMLib.RongIMClient.getInstance().sendMessage(conversationtype, targetId, msg, {
        //       // 发送消息成功
        //     onSuccess: function (message) {
        //       // message 为发送的消息对象并且包含服务器返回的消息唯一Id和发送消息时间戳
        //       console.log('Send successfully')
        //     },
        //     onError: function (errorCode, message) {
        //       var info = ''
        //       switch (errorCode) {
        //         case RongIMLib.ErrorCode.TIMEOUT:
        //           info = '超时'
        //           break
        //         case RongIMLib.ErrorCode.UNKNOWN_ERROR:
        //           info = '未知错误'
        //           break
        //         case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
        //           info = '在黑名单中，无法向对方发送消息'
        //           break
        //         case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
        //           info = '不在讨论组中'
        //           break
        //         case RongIMLib.ErrorCode.NOT_IN_GROUP:
        //           info = '不在群组中'
        //           break
        //         case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
        //           info = '不在聊天室中'
        //           break
        //         default :
        //           info = 'aa'
        //           break
        //       }
        //       console.log('发送失败:' + info)
        //     }
        //   })
        // })
      }
    },
    watch: {
      inputText: function (val, oldVal) {
        if (val !== '') {
          this.showSendBtn = true
          this.showMoreBtn = false
        } else {
          this.showSendBtn = false
          this.showMoreBtn = true
        }
        console.log('new:' + val + '  old:' + oldVal)
      }
    },
    components: {
      WechatEmotion, Scroller, Emoji
    }
  }
</script>

<style>
  * {
    padding: 0;
    margin: 0;
  }

  .input_view {
    background-color: white;
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 1000px;
  }
  .chat_emoji_btn {
    height: 26px;
    position: absolute;
    top: 0;
    right: 0;
    margin-right: 48px;
    margin-top: 12.5px;
  }

  .chat_more_btn {
    height: 26px;
    position: absolute;
    top: 0;
    right: 0;
    margin-right: 12px;
    margin-top: 12.5px;
  }

  .send_msg_btn {
    border: 1px solid green;
    margin-right: 5px;
    color: white;
    background-color: green;
    position: absolute;
    top: 0;
    right: 0;
    border-radius: 3px;
    width: 38px;
    height: 26px;
    margin-top: 12px;
  }
  .chat_content_edit {
    height: 33px;
    border: 1px solid #f6f6f7;
    border-radius: 5px;
    background-color: #f6f6f7;
    margin-left: 12px;
    margin-top: 8.5px;
    position: absolute;
    top: 0;
    left: 0;
  }

  .emoji_box {
    position: absolute;
    top: 0;
    left: 0;
    margin-top: 50px;
    height: 135px;
    width: 100%;
  }

</style>
