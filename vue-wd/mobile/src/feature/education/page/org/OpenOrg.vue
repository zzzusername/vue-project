<template>
  <div>
    <div :style="{'font-size': '16px', 'padding': '10px 20px', 'fontSize':'16px', 'color':'#222222', 'background':'#fff', 'height': '100vh'}">
      <img class="dispatch_user_icon" :src="tools.cdn(userInfo.userIcon)">
      <p style="textAlign:center;fontSize: 16px">{{userInfo.userName}}</p>
      <div v-if="isAllowCreateOrg">
        <p style="margin-top:1.2em;">仅需两步，{{ userInfo.schoolModel == 2 ? '便可为微信群添加管理功能' : '便可将已有微信群添加进学校'}}</p>
          <p style="margin-top:1.2em"></p>
        <div v-if="isShowQrcode">
          <p style="margin-top:1.2em; color:#626262"><strong style="color:#000">一、长按识别下面的二维码</strong>，添加教师小助手为微信好友</p>
          <div style="textAlign:center;margin-top:10px;">
            <qrcode :value="createOrgQrcode" :size="180" ></qrcode>
          </div>
          <p style="paddingLeft: 2em;fontSize: 14px;color: red">注：加为好友后，请不要和教师小助手聊天。</p>
        </div>
        <div v-else>
          <p style="margin-top:1.2em; color:#626262"><strong style="color:#000">一、微信搜索{{createOrgQrcode}}，并添加微信好友</strong></p>
          <p style="paddingLeft: 2em;fontSize: 14px;color: red">注：加为好友后，请不要和教师小助手聊天。</p>
        </div>
        <p style="margin-top:0.3em; color:#626262;margin-top:10px;"><strong style="color:#000">二、将教师小助手拉进目标微信群（{{schoolInfo.schoolModel == 2 ? '仅限学校学生群和家长群' : '仅限学校学生群、家长群或老师群'}}）</strong>，教师小助手入群后会给您发送其成功入群的消息，根据消息提示操作，即可完成。</p>
      </div>
      <div v-if="isError">
        <p style="margin-top:1.2em;">您没有为{{schoolInfo.schoolName==null?'本校':'［'+schoolInfo.schoolName+'］'}}添加微信群的权限！</p>
        <p style="margin-top:1.2em">如果您希望继续操作，请联系本校管理员，为您添加［微信群管理］权限。</p>
      </div>
      <div style="height: 50px"></div>
    </div>
    <detail-tabbar></detail-tabbar>
  </div>
  <!-- <div style="padding: 10px;backgroundColor: #fff;minHeight: 100vh">
    <p style="fontSize: 16px;">仅需两步，便可将已有微信群添加进学校</p>
    <p style="fontSize: 16px;marginLeft: 1em;marginTop: 10px">一、长按识别下面的二维码，添加家校小助手为微信好友</p>
    <div style="textAlign:center">
      <qrcode :value="createOrgQrcode" :size="180" ></qrcode>
    </div>
    <p style="paddingLeft: 2em;fontSize: 14px;color: red">注：加为好友后，请不要和小助手聊天。</p>
    <p style="fontSize: 16px;marginLeft: 1em;marginTop: 10px">二、将家校小助手拉进目标微信群（仅限学校学生群、家长群或老师群），小助手入群后会给您发送其成功入群的消息，根据消息提示操作，即可完成。</p>
    <detail-tabbar></detail-tabbar>
  </div> -->
</template>

<script>
  import { Cell } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import Qrcode from '@/components/Qrcode.vue'
  import orgApi from '@/feature/org/api'
  import api from '../../api'
  import { mapGetters } from 'vuex'
  export default {
    components: {
      Cell, DetailTabbar, Qrcode
    },
    computed: {
      ...mapGetters({
        userInfo: 'userInfo'
      })
    },
    data () {
      return {
        createOrgQrcode: '',
        schoolInfo: {},
        isAllowCreateOrg: true,
        isShowQrcode: true,
        isError: false
      }
    },
    mounted () {
      if (window.__wxjs_environment === 'miniprogram') {
        this.isShowQrcode = false
      }
      if (this.$route.params.schoolId !== null && this.$route.params.schoolId !== undefined) {
        api.getSchoolInfo({ schoolId: this.$route.params.schoolId }, (data) => {
          this.schoolInfo = data
        }, () => {})
        api.getTeacherFeatures({ schoolId: this.$route.params.schoolId }, (data) => {
          let isQunManager = false
          data.forEach(element => {
            if (element.featureCode === 'QUN') {
              isQunManager = true
            }
          })
          // 如果不是群管理员则判断是否有针对班级建群的权限
          if (isQunManager === false) {
            api.getTeacherNeedBindClassList({schoolId: this.$route.params.schoolId}, (data) => {
              if (data.length === 0) {
                // 报错
                this.isError = true
              } else {
                this.isAllowCreateOrg = true
                // 显示二维码
              }
            }, () => {
              // 报错
              this.isError = true
            })
          } else {
            this.isAllowCreateOrg = true
            // 显示二维码
          }
        }, (er) => {
          this.isAllowCreateOrg = true
          // 默认显示二维码
        })
      } else {
        this.isAllowCreateOrg = true
        this.isError = false
      }
      orgApi.getRobotQr({salesmanId: this.$route.params.salesmanId}, robotQr => {
        if (robotQr.qrPath !== null) {
          if (window.__wxjs_environment === 'miniprogram') {
            this.createOrgQrcode = robotQr.userName
            return
          }
          this.createOrgQrcode = robotQr.qrcode
        }
      }, () => {})
    }
  }
</script>

<style>
  .create_new_org_qrcode{
    display: block;
    width: 160px;
    margin: 10px auto;
  }
</style>
