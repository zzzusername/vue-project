<template>
  <div>
    <group v-show="commonList.length>0">
      <cell title="请选择感兴趣的专业" is-link @click.native="onSelectSubject"></cell>
    </group>
    <group title="报名信息">
      <x-input v-for="(item, index) in applyExt" :key="index" :title="item.key" v-model="item.value" :placeholder="item.key=='姓名'||item.key=='手机号'?'必填项':''" :is-type="item.key=='手机号'?'china-mobile':''" :keyboard="item.key=='手机号'?'number':''"></x-input>
    </group>
    <group v-show="applyInfo.joinOrg == true" title="入群二维码">
      <div style="width:90vw;backgroud:#f2f2f2;position:relative;margin:0 auto;height:200px;margin-top:10px;margin-bottom:20px">
        <img class="admission_apply_qrcode_img" :src="tools.cdn(applyInfo.applyOrgQrcode, 'logo.png')">
      </div>
      <span style="width:100vw;position:absolute;margin:0 auto;text-align:center;left:0px;font-size:14px;bottom:0px;">长按识别二维码</span>
    </group>
    <popup v-model="isShowPopup" height="60vh">
      <div>
        <checklist :options="commonList" v-model="checklist"></checklist>
      </div>
    </popup>
    <div style="margin:15px;color:#FF6D56;font-size:16px">{{applyInfo.applyRewardDes}}</div>
    <detail-tabbar :actionLink="onApply" :actions="actions"></detail-tabbar>
  </div>
</template>

<script>
import DetailTabbar from '@/components/DetailTabbar.vue'
import { Group, Cell, XInput, Checklist, Popup } from 'vux'
import api from '@/feature/admission/api'

export default {
  components: {
    DetailTabbar, Group, Cell, XInput, Checklist, Popup
  },
  data () {
    return {
      applyInfo: null,
      applyExt: [],
      isShowPopup: false,
      commonList: [],
      checklist: [],
      actions: [
        {
          name: '完成并提交',
          code: 'apply'
        }
      ]
    }
  },
  mounted () {
    api.getApplyInfo({orgId: this.$route.params.orgId, guideId: this.$route.params.admissionId}, (data) => {
      this.applyInfo = data
      this.applyExt = JSON.parse(data.applyExt)
      if (data.subject !== null && data.subject.length > 0) {
        data.subject.forEach((element) => {
          this.commonList.push({key: element.subjectId + '', value: element.subjectName})
        }, this)
      }
    }, () => {})
  },
  methods: {
    onSelectSubject () {
      this.isShowPopup = true
    },
    onApply () {
      var userName = null
      if (!this.tools.isNull(this.applyExt[0].value)) {
        userName = this.applyExt[0].value
      } else {
        this.tools.warnToast('姓名不能为空')
        return
      }
      var userPhone = null
      if (!this.tools.isNull(this.applyExt[1].value)) {
        userPhone = this.applyExt[1].value
      } else {
        this.tools.warnToast('手机号不能为空')
        return
      }
      var data = {
        applyExt: JSON.stringify(this.applyExt),
        userName: userName,
        userPhone: userPhone,
        subjectIds: this.checklist.toString()
      }
      api.applyAdmission({orgId: this.$route.params.orgId, guideId: this.$route.params.admissionId, deputyId: this.$route.params.inviteDeputyId, data: data}, (data) => {
        this.tools.successToast('报名成功')
        this.$router.go(-1)
      }, (data) => {
        if (data.toUser) {
          this.tools.warnToast(data.message, '150px')
        } else {
          this.tools.warnToast('报名失败')
        }
      })
    }
  }
}
</script>


<style>
.admission_apply_qrcode_img{
  /*width:inherit;*/
  max-width: 100%;
  max-height: 100%;
  display:block;
  position:absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
