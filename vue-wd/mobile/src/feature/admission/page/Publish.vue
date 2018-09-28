<template>
  <div>
    <group >
      <x-input title="标题" placeholder="请输入标题" v-model="data.guideTitle"></x-input>
      <cell title="封面" @click.native='chooseImg("image")' is-link>
        <img slot="default" :src="tools.cdn(guideImgData==null?data.guideImg:guideImgData,'logo.png')" class="adminssion-cell-cover-img"/>
      </cell>
      <datetime-range title="结束时间" v-model="data.closeDate" :start-date="startDateTime" :end-date="endDateTime" placeholder="请选择时间" format="YYYY年MM月DD日"></datetime-range>
      <x-switch v-show="isEdit==false" title="是否开启人工审核" v-model="data.isApplyVerify"></x-switch>
      <!--<x-switch title="是否开启短信验证" v-model="data.isSmsVerify"></x-switch>-->
      <cell title="招生代表设置" is-link @click.native="onRepresentative" :value="data.isPowerDeputy===true?'已开启':'未开启'"></cell>
      <cell title="报名所需资料设置" is-link @click.native="onApplyExt" value="‧‧‧"></cell>
      <x-textarea title="报名奖励说明" placeholder="例：立即报名，您将获得精美礼品「哥德巴赫猜想」1本" :rows="3" v-model="data.applyRewardDes"></x-textarea>
      <x-switch title="是否开启报名后入群" v-model="data.isJoinOrg"></x-switch>
      <cell title="报名群二维码" v-show="data.isJoinOrg" @click.native='chooseImg("qrcode")' is-link>
        <img slot="default" :src="tools.cdn(applyOrgQrcodeData==null?data.applyOrgQrcode:applyOrgQrcodeData,'logo.png')" class="adminssion-cell-qrcode-img"/>
      </cell>
      <x-switch title="是否使用招生宣传链接" v-model="data.contentType"></x-switch>
      <x-input v-show="data.contentType" title="招生宣传链接" placeholder="请输入链接地址" v-model="data.contentUrl"></x-input>
      <cell title="招生专业设置" is-link @click.native="onRecruitSubjects" :value="data.recruitSubjects!=null&&data.recruitSubjects.length>0?'‧‧‧':''"></cell>
      <x-input v-show="!data.contentType" title="招生地址" placeholder="请输入地址" v-model="data.guideLinkAddress"></x-input>
      <x-input v-show="!data.contentType" title="招生联系人" placeholder="请输入联系人" v-model="data.guideLinkPeople"></x-input>
      <x-input v-show="!data.contentType" title="招生联系电话" placeholder="请输入联系人电话" v-model="data.guideLinkTelephone" is-type="china-mobile" keyboard='number'></x-input>
      <x-textarea v-show="!data.contentType" title="招生说明" placeholder="请输入招生说明" :rows="5" v-model="data.contentText"></x-textarea>
      <div v-show="!data.contentType" style="overflow:hidden;backgroundColor: #fff;marginTop:10px;marginLeft:1em;">
        <div style="width:60px;height:60px;margin:10px 5px 10px 10px;float:left;border: 1px #d9d9d9 solid;position:relative" v-if="contentImgList.length>0" v-for="(item, index) in contentImgList" :key="index" @click="showOperate(index)">
          <img style="max-width: 100%;max-height: 100%;display:block;position:absolute;left: 50%;top: 50%;transform: translate(-50%, -50%);" :src="tools.cdn(item.imgData)">
        </div>
        <img style="width:60px;margin:10px;" v-if="contentImgList.length < 9" src="../../../assets/addImg.png" @click="chooseContentImg()">
      </div>
    </group>
    <info :isShow="isShowInfo" :goBack="goBack" :returnData="getInfoData" :defaultData="data.applyExt"></info>
    <professional :isShow="isShowProfessional" :goBack="goBack" :returnData="getProfessionalData" :defaultData="data.recruitSubjects"></professional>
    <representative :isShow="isShowRepresentative" :goBack="goBack" :returnData="getRepresentativeData" :defaultData="representativeDefaultData"></representative>
    <actionsheet v-model="showActionSheet" :menus="menu" @on-click-menu="actionSheetClick" show-cancel></actionsheet>
    <!--<loading v-model="isLoading" text="加载中..." v-transfer-dom></loading>-->
    <detail-tabbar :actionLink="onPublish" :actions="actions" isHideMe=true></detail-tabbar>
  </div>
</template>

<script>
import { Group, XInput, DatetimeRange, dateFormat, XSwitch, Cell, XTextarea, Actionsheet, Loading } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import Info from '../components/Info'
import Professional from '../components/Professional'
import Representative from '../components/Representative'
import api from '@/feature/admission/api'
export default {
  components: {
    Group, XInput, DatetimeRange, XSwitch, Cell, XTextarea, DetailTabbar, Info, Professional, Representative, Actionsheet, Loading
  },
  data () {
    return {
      startDateTime: dateFormat(new Date().getTime() + 86400 * 1000, 'YYYY-MM-DD'),
      actions: [
        {
          name: '发布',
          code: 'apply'
        }
      ],
      data: {
        guideTitle: null, // 标题
        guideImg: null, // 封面
        closeDate: [], // 结束时间
        contentType: false, // 内容类型 LINK外链    CONTENT 内容
        contentUrl: null, // 外链地址
        contentImg: null, // 招生说明图片
        contentText: null, // 招生说明
        guideLinkAddress: null, // 招生地址
        guideLinkPeople: null, // 招生联系人
        guideLinkTelephone: null, // 招生联系电话
        applyExt: null, // 申请报名扩展字段
        isPowerDeputy: false, // 是否启用招生代表
        deputyInviteImg: null, // 邀请分享图片
        deputyInviteQrcodePosition: null, // 邀请分享图片二维码位置
        deputyRewards: null, // 奖励
        isDeputyJoinOrg: false, // 招生代表入群
        deputyOrgQrcode: null, // 招生代表群二维码
        isJoinOrg: false, // 报名后入群
        applyOrgQrcode: null, // 群二维码
        isApplyVerify: false, // 是否申请验证
        isSmsVerify: false, // 是否短信验证
        recruitSubjects: null, // 专业设置
        applyRewardDes: null // 奖励说明
      },
      isShowInfo: false,
      isShowProfessional: false,
      isShowAward: false,
      isShowRepresentative: false,
      contentImgList: [],
      contentImgPathList: [],
      imgNum: 9,
      showActionSheet: false,
      menu: {
        delete: '<p style="color:red;">删除</p>'
      },
      currentImageIndex: 0,
      guideImgBinaryData: null,
      guideImgData: null,
      deputyInviteImgBinaryData: null,
      deputyOrgQrcodeBinaryData: null,
      applyOrgQrcodeBinaryData: null,
      applyOrgQrcodeData: null,
      // isLoading: false,
      isEdit: false,
      representativeDefaultData: null,
      type: 'ORG' // 获取token用，区分联盟还是群
    }
  },
  computed: {
    endDateTime () {
      var date = new Date()
      date.setFullYear(date.getFullYear() + 1)
      return dateFormat(date, 'YYYY-MM-HH')
    }
  },
  mounted () {
    // 判断是联盟还是群
    if (!this.tools.isNull(this.$route.params.leagueId)) {
      this.type = 'LEAGUE'
    }

    // 处理编辑数据
    if (!this.tools.isNull(this.$route.params.admissionId)) {
      this.isEdit = true
      this.actions = [
        {
          name: '保存',
          code: 'apply'
        }
      ]
      api.getManagerAdmissionInfo({orgId: this.$route.params.orgManagementId, leagueId: this.$route.params.leagueId, guideId: this.$route.params.admissionId}, (data) => {
        this.contentImgList = []
        if (!this.tools.isNull(data.contentImg)) {
          data.contentImg.split(',').forEach((element) => {
            this.contentImgList.push({imgData: element})
          }, this)
        }
        this.data = {
          guideTitle: data.guideTitle, // 标题
          guideImg: data.guideImg, // 封面
          closeDate: this.tools.isNull(data.closeDate) ? [] : [dateFormat(data.closeDate, 'YYYY-MM-DD'), dateFormat(data.closeDate, 'HH'), dateFormat(data.closeDate, 'mm')], // 结束时间
          contentType: !(data.contentType === 'CONTENT'), // 内容类型 LINK外链    CONTENT 内容
          contentUrl: data.contentUrl, // 外链地址
          contentImg: null, // 招生说明图片
          contentText: data.contentText, // 招生说明
          guideLinkAddress: data.guideLinkAddress, // 招生地址
          guideLinkPeople: data.guideLinkPeople, // 招生联系人
          guideLinkTelephone: data.guideLinkTelephone, // 招生联系电话
          applyExt: JSON.parse(data.applyExt), // 申请报名扩展字段
          isPowerDeputy: data.isPowerDeputy, // 是否启用招生代表
          deputyInviteImg: data.deputyInviteImg, // 邀请分享图片
          deputyInviteQrcodePosition: data.deputyInviteQrcodePosition, // 邀请分享图片二维码位置
          deputyRewards: null, // 奖励
          isDeputyJoinOrg: data.isDeputyJoinOrg, // 招生代表入群
          deputyOrgQrcode: data.deputyOrgQrcode, // 招生代表群二维码
          isJoinOrg: data.isJoinOrg, // 报名后入群
          applyOrgQrcode: data.applyOrgQrcode, // 群二维码
          isApplyVerify: data.isApplyVerify, // 是否申请验证
          isSmsVerify: data.isSmsVerify, // 是否短信验证
          recruitSubjects: null, // 专业设置
          applyRewardDes: data.applyRewardDes
        }
        // 如果开启招生代表，需要构造数据传入组件
        this.setRepresentativeDefaultData(data)
        // 专业
        if (data.recruitSubjects !== null && data.recruitSubjects.length > 0) {
          this.data.recruitSubjects = []
          data.recruitSubjects.forEach((element) => {
            this.data.recruitSubjects.push(element.subjectName)
          }, this)
        }
      }, () => {})
    }
  },
  methods: {
    setRepresentativeDefaultData (data) {
      if (data.isPowerDeputy) {
        this.representativeDefaultData = {}
        this.representativeDefaultData.isPowerDeputy = data.isPowerDeputy
        if (data.deputyInviteImgData !== null && data.deputyInviteImgData !== undefined) {
          this.representativeDefaultData.deputyInviteImgData = data.deputyInviteImgData
        } else {
          this.representativeDefaultData.deputyInviteImgData = data.deputyInviteImg
        }
        if (data.deputyOrgQrcodeData !== null && data.deputyOrgQrcodeData !== undefined) {
          this.representativeDefaultData.deputyOrgQrcodeData = data.deputyOrgQrcodeData
        } else {
          this.representativeDefaultData.deputyOrgQrcodeData = data.deputyOrgQrcode
        }
        this.representativeDefaultData.isDeputyJoinOrg = data.isDeputyJoinOrg
        this.representativeDefaultData.deputyRewards = data.deputyRewards
        this.representativeDefaultData.deputyInviteQrcodePosition = data.deputyInviteQrcodePosition
        this.representativeDefaultData.deputyRewardUnit = data.deputyRewardUnit
        this.representativeDefaultData.recruitGuideRewards = data.recruitGuideRewards
        if (!this.tools.isNull(data.deputyInviteQrcodePosition)) {
          this.representativeDefaultData.deputyInviteQrcodePositionLeft = data.deputyInviteQrcodePosition.split(',')[0]
          this.representativeDefaultData.deputyInviteQrcodePositionTop = data.deputyInviteQrcodePosition.split(',')[1]
          this.representativeDefaultData.deputyInviteQrcodePositionWidth = data.deputyInviteQrcodePosition.split(',')[2]
        }
      }
    },
    chooseImg (type) {
      this.$wechat.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: res => {
          var localIds = res.localIds
          this.getLocalImgs(localIds, type)
          // this.getLocalImgs(localIds, position)
        }
      })
    },
    getLocalImgs (localIds, type) {
      var localId = localIds.pop()
      this.$wechat.getLocalImgData({
        localId: localId, // 图片的localID
        success: res2 => {
          if (type === 'image') { // 封面
            this.guideImgData = this.tools.data2imgDataUrl(res2.localData)
            this.guideImgBinaryData = this.tools.data2blob(res2.localData)
          } else if (type === 'qrcode') { // 报名群二维码
            this.applyOrgQrcodeData = this.tools.data2imgDataUrl(res2.localData)
            this.applyOrgQrcodeBinaryData = this.tools.data2blob(res2.localData)
          }
        }
      })
    },
    chooseContentImg () {
      var num = 9 - this.contentImgList.length
      this.$wechat.chooseImage({
        count: num,
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: res => {
          var localIds = res.localIds
          this.getLocalContentImgs(localIds)
        }
      })
    },
    getLocalContentImgs (localIds) {
      var localId = localIds.pop()
      this.$wechat.getLocalImgData({
        localId: localId, // 图片的localID
        success: res2 => {
          this.contentImgList.push({imgData: this.tools.data2imgDataUrl(res2.localData), binaryData: this.tools.data2blob(res2.localData)})
          if (localIds.length > 0) {
            this.getLocalContentImgs(localIds)
          }
        }
      })
    },
    onPublish () {
      if (this.data.guideTitle === null || this.data.guideTitle === '') {
        this.tools.warnToast('请输入标题')
        return
      } else if (this.guideImgBinaryData === null && this.guideImg === null) {
        this.tools.warnToast('请上传封面')
        return
      } else if (this.data.closeDate.length < 3) {
        this.tools.warnToast('请选择结束时间')
        return
      }
      // this.isLoading = true
      // 封装所有上传图片
      var arr = []
      // this.guideImgBinaryData = this.tools.data2blob('data:image/png;base64,abc')
      if (this.guideImgBinaryData !== null) {
        arr.push({type: this.type + '_RECRUIT_GUIDE_COVER', args: this.$route.params.orgManagementId, data: this.guideImgBinaryData}) // 封面
      }
      if (this.deputyInviteImgBinaryData !== null) {
        arr.push({type: this.type + '_RECRUIT_GUIDE_DEPUTY_INVITE_IMG', args: this.$route.params.orgManagementId, data: this.deputyInviteImgBinaryData}) // 分享图片
      }
      if (this.deputyOrgQrcodeBinaryData !== null) {
        arr.push({type: this.type + '_RECRUIT_GUIDE_DEPUTY_QRCODE', args: this.$route.params.orgManagementId, data: this.deputyOrgQrcodeBinaryData}) // 招生代表入群二维码
      }
      if (this.applyOrgQrcodeBinaryData !== null) {
        arr.push({type: this.type + '_RECRUIT_GUIDE_APPLY_QRCODE', args: this.$route.params.orgManagementId, data: this.applyOrgQrcodeBinaryData}) // 报名入群二维码
      }
      for (var i = 0; i < this.contentImgList.length; i++) {
        var item = this.contentImgList[i]
        if (!this.tools.isNull(item.binaryData)) {
          arr.push({type: this.type + '_RECRUIT_GUIDE_CONTENT', args: this.$route.params.orgManagementId, data: item.binaryData}) // 报名入群二维码
        }
      }
      // 上传图片
      if (arr.length > 0) {
        this.upload(arr, () => {
          this.data.contentImg = this.contentImgPathList.toString()
          this.save()
        })
      } else {
        this.save()
      }
    },
    upload (arr, callBack) {
      var count = 0
      arr.forEach((element) => {
        this.uploadApi.getToken({type: element.type, args: element.args}, (data) => {
          this.uploadApi.uploadImage({token: data.result.token, file: element.data, key: data.result.path}, (qndata) => {
            count++
            if (element.type === this.type + '_RECRUIT_GUIDE_COVER') {
              this.data.guideImg = qndata.key
            } else if (element.type === this.type + '_RECRUIT_GUIDE_DEPUTY_INVITE_IMG') {
              this.data.deputyInviteImg = qndata.key
            } else if (element.type === this.type + '_RECRUIT_GUIDE_DEPUTY_QRCODE') {
              this.data.deputyOrgQrcode = qndata.key
            } else if (element.type === this.type + '_RECRUIT_GUIDE_APPLY_QRCODE') {
              this.data.applyOrgQrcode = qndata.key
            } else if (element.type === this.type + '_RECRUIT_GUIDE_CONTENT') {
              this.contentImgPathList.push(qndata.key)
            }
            if (arr.length === count) {
              callBack()
            }
          }, () => {
            this.tools.warnToast('图片上传失败')
          })
        }, () => {
          this.tools.warnToast('图片上传失败')
        })
      }, this)
    },
    save () {
      // this.isLoading = false
      if (this.isEdit) {
        api.editAdmission({orgId: this.$route.params.orgManagementId, leagueId: this.$route.params.leagueId, guideId: this.$route.params.admissionId, data: this.data}, () => {
          // this.isLoading = false
          this.tools.successToast('修改成功')
          this.$router.go(-1)
        }, (data) => {
          // this.isLoading = false
          if (data.toUser) {
            this.tools.warnToast(data.message, '160px')
          } else {
            this.tools.warnToast('修改失败')
          }
        })
      } else {
        api.publishAdmission({orgId: this.$route.params.orgManagementId, leagueId: this.$route.params.leagueId, data: this.data}, () => {
          // this.isLoading = false
          this.tools.successToast('发布成功')
          this.$router.go(-1)
        }, (data) => {
          // this.isLoading = false
          if (data.toUser) {
            this.tools.warnToast(data.message, '160px')
          } else {
            this.tools.warnToast('发布失败')
          }
        })
      }
    },
    goBack () {
      this.isShowInfo = false
      this.isShowProfessional = false
      this.isShowRepresentative = false
    },
    getInfoData (val) {
      this.data.applyExt = val
      this.isShowInfo = false
    },
    onApplyExt () { // 报名资料
      this.isShowInfo = true
    },
    onRecruitSubjects () { // 专业设置
      this.isShowProfessional = true
    },
    getProfessionalData (val) {
      this.data.recruitSubjects = val
      this.isShowProfessional = false
    },
    onRepresentative () {
      this.isShowRepresentative = true
    },
    getRepresentativeData (val) {
      this.setRepresentativeDefaultData(val)
      this.data.isPowerDeputy = val.isPowerDeputy
      this.data.isDeputyJoinOrg = val.isDeputyJoinOrg
      if (val.deputyOrgQrcodeBinaryData !== null && val.deputyOrgQrcodeBinaryData !== undefined) {
        this.deputyOrgQrcodeBinaryData = val.deputyOrgQrcodeBinaryData
      }
      if (val.deputyInviteImgBinaryData != null && val.deputyInviteImgBinaryData !== undefined) {
        this.deputyInviteImgBinaryData = val.deputyInviteImgBinaryData
      }
      this.data.deputyInviteQrcodePosition = val.deputyInviteQrcodePosition
      this.data.deputyRewards = val.deputyRewards
      this.data.deputyRewardUnit = val.deputyRewardUnit
      this.data.recruitGuideRewards = val.recruitGuideRewards
      this.isShowRepresentative = false
    },
    showOperate (index) {
      this.showActionSheet = true
      this.currentImageIndex = index
    },
    actionSheetClick (key) {
      switch (key) {
        case 'delete':
          this.contentImgList.splice(this.currentImageIndex, 1)
          break
      }
    }
  }
}
</script>

<style>
.adminssion-cell-cover-img{
  display:block;
  border-radius: 5px;
  width: 80px;
  height: 60px;
}
.adminssion-cell-qrcode-img{
  display:block;
  border-radius: 5px;
  width: 50px;
  height: 50px;
}
</style>
