<template>
  <div v-if="admissionInfo !== null">
    <div v-show="admissionInfo.contentType === 'CONTENT'">
      <div class="admission_detail_header">
        <p style="fontSize: 18px;">{{admissionInfo.guideTitle}}</p>
        <div class="admission_detail_time">
          <span>结束时间: {{getDateTime(admissionInfo.closeDate)}}</span>
        </div>
      </div>
      <group gutter="10px" label-width="5em" label-margin-right="0.5em" label-align="right">
        <cell style="fontSize:14px;" v-for="(item, index) in getInfoList(admissionInfo)" :title="item.name" v-show="item.value != null" :key="index">
          <p slot="value">{{item.value}}</p>
        </cell>
      </group>
      <!--<group gutter="10px">
        <p style="fontSize:14px;margin:10px 10px 5px 10px;color:#444;"><strong>报名信息:(已报名<span style="color:#82C97B;">{{admissionInfo}}</span>人, 通过<span style="color:#82C97B;">{{admissionInfo.signSuccessCount}}</span>人)</strong></p>
        <div style="paddingLeft:10px;float:left;marginBottom:10px;" v-for="item in admissionInfo.signUser">
          <img style="height:40px;width: 40px;border-radius:20px;" :src="tools.cdn(item.userIcon, 'logo.png')">
          <p style="width:40px;textAlign:center;fontSize:12px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">{{item.userName}}</p>
        </div>
        <div v-if="admissionInfo.signUser.length === 5" style="paddingLeft:10px;float:left;marginTop:5px;marginBottom:10px;" @click="skipUserList">
          <p style="height:40px;border-radius:20px;textAlign:center;line-height:40px;background:#82C97B;fontSize:14px;color:#fff">更多</p>
          <p style="width:40px;textAlign:center;fontSize:12px;"></p>
        </div>
      </group>-->
      <group gutter="10px">
        <p style="margin:10px 10px 5px 10px;fontSize:14px;color:#444;"><strong>招生详情</strong></p>
        <p style="fontSize:16px;margin:5px 10px 10px 10px;line-height:24px" v-html="admissionInfo.contentText !== null?admissionInfo.contentText.replace(/\n/g, '<br/>'):''"></p>
        <div style="margin-bottom:15px">
          <img style="width:95%;padding:10 10px;display:block;margin:5px auto 0;margin-top:0px" v-for="(item, index) in contentImgArray" :key="index" :src="tools.cdn(item)">
        </div>
      </group>
    </div>
    <div v-show="admissionInfo.contentType === 'LINK'">
      <iframe style="border:0px;width:100vw;" :height="height" :src="admissionInfo.contentUrl" frameborder="0" scrolling="yes"></iframe>
    </div>
    <!--<x-dialog v-model="showDialogStyle" hide-on-blur :dialog-style="{'max-width': '100%', width: '100%', height: '100%', 'background-color': 'transparent'}" @click.native="closeDialog">
      <div style="background-color:#FF6D56;color:#fff;text-align:top;" >
          <span style="font-size:18px;">点击右上角图标进行分享</span>
          <span class="iconfont icon-arrowupright2"></span>
      </div>
    </x-dialog>-->
    <detail-tabbar :actionLink="onAction" :actions="actions"></detail-tabbar>
  </div>
</template>

<script>
import { Group, Scroller, Cell, dateFormat } from 'vux'
import api from '@/feature/admission/api'
import DetailTabbar from '@/components/DetailTabbar.vue'
export default {
  components: {
    DetailTabbar, Group, Scroller, Cell, dateFormat
  },
  data () {
    return {
      admissionInfo: null,
      height: '100vh',
      actions: [
        {
          name: '我要报名',
          code: 'apply'
        }
      ],
      isManage: false,
      contentImgArray: []
    }
  },
  mounted () {
    if (this.$route.params.orgManagementId !== undefined || this.$route.params.leagueId !== undefined) {
      this.isManage = true
    }
    this.height = (window.innerHeight - 50) + 'px'
    var orgId = ''
    if (this.$route.params.myOrgId !== undefined) {
      orgId = this.$route.params.myOrgId
    } else if (this.$route.params.orgManagementId !== undefined) {
      orgId = this.$route.params.orgManagementId
    } else {
      orgId = this.$route.params.orgId
    }
    api.getAdmissionInfo({orgId: orgId, guideId: this.$route.params.admissionId}, (data) => {
      if (data.guideStatus === 2) {
        if (data.userState) {
          this.actions = [
            {
              name: '已报名',
              color: '#bbbbbb',
              code: ''
            }
          ]
        } else {
          this.actions = [
            {
              name: '活动已结束',
              color: '#bbbbbb',
              code: ''
            }
          ]
        }
      } else if (data.isPowerDeputy === true && this.isManage === false) {
        if (data.userState) {
          this.actions = [
            {
              name: '分享拿奖品',
              code: 'share',
              color: '#2E84D4'
            },
            {
              name: '已报名',
              color: '#bbbbbb',
              code: ''
            }
          ]
        } else {
          this.actions = [
            {
              name: '分享拿奖品',
              code: 'share',
              color: '#2E84D4'
            },
            {
              name: '我要报名',
              code: 'apply'
            }
          ]
        }
      } else if (this.isManage === false) {
        if (data.userState) {
          this.actions = [
            {
              name: '已报名',
              color: '#bbbbbb',
              code: ''
            }
          ]
        }
      }
      if (data.contentImg !== null) {
        this.contentImgArray = data.contentImg.split(',')
      }
      this.admissionInfo = data
    }, (data) => {
      if (data.toUser) {
        this.tools.warnToast(data.message, '170px')
      } else {
        this.tools.warnToast('招生信息获取失败')
      }
    })
  },
  methods: {
    getDateTime (time) {
      return dateFormat(time, 'YYYY-MM-DD HH:mm')
    },
    getInfoList (info) {
      return [
        {
          name: '招生专业',
          value: info.subject.length > 0 ? this.getSubjectStr(info.subject) : null
        },
        {
          name: '招生地址',
          value: info.guideLinkAddress
        },
        {
          name: '联系人姓名',
          value: info.guideLinkPeople
        },
        {
          name: '联系电话',
          value: info.guideLinkTelephone
        }
      ]
    },
    getSubjectStr (subject) {
      var names = []
      subject.forEach((element) => {
        names.push(element.subjectName)
      }, this)
      return names.toString()
    },
    onAction (type) {
      if (type === 'apply') {
        if (this.$route.params.inviteDeputyId !== undefined) {
          this.$router.push({name: 'admissionInviteApplyInfo', params: {admissionId: this.admissionInfo.guideId, inviteDeputyId: this.$route.params.inviteDeputyId}})
        } else {
          this.$router.push({name: 'admissionApplyInfo', params: {admissionId: this.admissionInfo.guideId}})
        }
      } else if (type === 'share') {
        if (this.$route.params.inviteDeputyId !== undefined) {
          this.$router.push({name: 'admissionInviteShare', params: {admissionId: this.admissionInfo.guideId, inviteDeputyId: this.$route.params.inviteDeputyId}})
        } else {
          this.$router.push({name: 'admissionShare', params: {admissionId: this.admissionInfo.guideId}})
        }
      }
    }
  }
}
</script>

<style>
.admission_detail_header {
  position: relative;
  padding: 10px;
  background-color: #fff;
}
.admission_detail_time {
  position: relative;
  font-size: 13px;
  color: #666;
}
.admission_detail_header::before{
  content: '';    /*追加一个空*/
  position: absolute;    /*设置定位*/
  top: 0;  /*如果不设置可能会出现偏移*/
  left: 0;  
  border-bottom: 1px solid #D9D9D9;    /*设置边框*/
  width: 200%;    /*设置为插入元素的两倍宽高*/
  height: 200%;
  transform-origin: 0 0;    /*设置元素的基点为0 0*/
  transform: scale(0.5,0.5);    /*宽高缩小一半*/
  box-sizing: border-box;    /*设置盒模型 这一步必须要有,否则边框不会随着一起缩放*/
}
</style>

