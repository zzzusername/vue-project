<template>
  <div>
    <group>
      <cell title="群名称"  :value="orgInfo.orgName"></cell>
      <cell title="群头像" @click.native='chooseImg("orgLogo")' is-link>
        <img slot="default" :src="tools.cdn(orgInfo.orgLogo,'logo.png')" class="cell-head-img"/>
      </cell>
      <cell title="群封面"  @click.native='chooseImg("orgImgUrl")' is-link>
        <img slot="default" :src="tools.cdn(orgInfo.orgImgUrl,'logo.png')" class="cell-cover-img"/>
      </cell>
      <popup-picker title="群类别" v-model="category" :data="categoryList" show-name @on-hide="categoryHide"></popup-picker>
      <x-address title="群所在地" v-model="address" raw-value :list="addressData" @on-hide="addressHide"></x-address>
      <cell title="群介绍"  :value="orgInfo.orgIntroduce?orgInfo.orgIntroduce.substring(0,10)+'...':''" @click.native='showEditTextarea("请输入群介绍","orgIntroduce",orgInfo.orgIntroduce)' is-link></cell> 
    </group>
    <group>
      <cell title="设置群昵称" :value="settingInfo.robotNickName" @click.native='showEditText("请输入群助手的群昵称","robotNickName",settingInfo.robotNickName)'  is-link></cell>
      <cell title="入群欢迎语" :value="tools.getLength(settingInfo.orgWelcome)>16?tools.subStr(settingInfo.orgWelcome,16):settingInfo.orgWelcome" @click.native='showEditTextarea("请输入欢迎语","orgWelcome")' is-link></cell>
      <x-switch title="开启自动发送欢迎语" v-model="settingInfo.isSendWelcome" @on-change="val=>{changeSwitchStatus(val,'isSendWelcome')}"></x-switch>
      <cell title="群规则" :value="tools.getLength(settingInfo.orgRule)>16?tools.subStr(settingInfo.orgRule,16):settingInfo.orgRule" @click.native='showEditTextarea("请输入群规则","orgRule")' is-link></cell>
      <x-switch title="开启群规" v-model="settingInfo.isSendRule" @on-change="val=>{changeSwitchStatus(val,'isSendRule')}"></x-switch>
      <cell title="关键字" :link="{name:'orgSetKeyword'}"></cell>
    </group>
    <group>
      <x-switch title="仅群成员访问空间" v-model="settingInfo.isOnlyVisit" @on-change="val=>{changeSwitchStatus(val,'isOnlyVisit')}"></x-switch>
      <cell title="群主二维码" @click.native='chooseImg("orgMasterQrcode")' is-link>
        <img slot="default" :src="tools.cdn(settingInfo.orgMasterQrcode,'logo.png')" class="cell-head-img"/>
      </cell> 
      <!--<cell title="群二维码" @click.native='chooseImg("orgQrcode")' is-link>
        <img slot="default" :src="tools.cdn(settingInfo.orgQrcode,'logo.png')" class="cell-head-img"></x-img>  
      </cell> -->
      <cell title="公号二维码" @click.native='chooseImg("mpQrcode")' is-link>
        <img slot="default" :src="tools.cdn(settingInfo.mpQrcode,'logo.png')" class="cell-head-img"/>
      </cell>
    </group>
    <detail-tabbar ></detail-tabbar>
    
    <popup v-model="isShowEditText" height="145px" is-transparent v-transfer-dom>
      <div flots="default" style="width: 95%;background-color:#fbf9fe;height:125px;margin:0 auto;border-radius:5px;padding-top:10px;">
        <x-input v-model="newEditTextValue" :placeholder="placeholder" style="background-color:#fff;margin:10px 15px;" :show-clear="true"></x-input>
        <div style="padding:10px 15px;">
          <x-button type="primary" @click.native="saveEditTextValue()" > 确定 </x-button>
        </div>
      </div>
    </popup>
    <popup v-model="isShowEditTextarea" height="245px" is-transparent v-transfer-dom>
      <div flots="default" style="width: 95%;background-color:#fbf9fe;height:225px;margin:0 auto;border-radius:5px;padding-top:10px;">
        <x-textarea :rows="7" style="height:140px" v-model="newEditTextValue" :placeholder="placeholder" ></x-textarea>
        <div style="padding:10px 15px;">
          <x-button type="primary" @click.native="saveEditTextareaValue ()" > 确定 </x-button>
        </div>
      </div>
    </popup>
    <popup v-model="isShowEditOrgImgUrl" height="380px" is-transparent v-transfer-dom>
      <div flots="default" style="width: 95%;background-color:#fbf9fe;height:360px;margin:0 auto;border-radius:5px;padding-top:10px;">
        <input type="file">
        <img src="http://img1.vued.vanthink.cn/vued751d13a9cb5376b89cb6719e86f591f3.png" style="width:95vw; height:38vw">
        <div style="padding:10px 15px;">
          <x-button type="primary" @click.native="hideEditOrgImgUrl ()" > 确定 </x-button>
        </div>
      </div>
    </popup>
    <image-crop field="img"
                @crop-success="cropSuccess"
                v-model="isShowImgCrop" 
            :width="640"
            :height="256"
            url="/upload"
            img-format="png"></image-crop>
  </div>
</template>

<script>
import { Cell, Group, Popup, XButton, XSwitch, XImg, XTextarea, XAddress, ChinaAddressV3Data, TransferDomDirective as TransferDom, XInput, PopupPicker } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import { mapGetters } from 'vuex'
import ImageCrop from '@/components/ImageCrop.vue'
import api from '@/feature/org/api'

export default {
  components: {
    Cell, Group, DetailTabbar, Popup, XButton, XTextarea, XInput, ImageCrop, XSwitch, XImg, XAddress, ChinaAddressV3Data, PopupPicker
  },
  data () {
    return {
      settingInfo: {},
      orgInfo: {},
      categoryList: [[{
        name: '电商',
        value: 'DIANSHANG'
      }, {
        name: '教育',
        value: 'JIAOYU'
      }, {
        name: '证劵',
        value: 'ZHENGJUAN'
      }, {
        name: '理财',
        value: 'LICAI'
      }]],
      isShowImgCrop: false,
      isShowEditText: false,
      isShowEditTextarea: false,
      isShowEditFile: false,
      newEditTextValue: '',
      placeholder: '',
      currentPropertyName: '',
      isShowEditOrgImgUrl: false,
      addressData: ChinaAddressV3Data,
      category: [],
      address: [],
      isLoadFinish: false // 页面已渲染完成
    }
  },
  computed: {
    ...mapGetters({
      wechatConfig: 'wechatConfig'
    })
  },
  mounted () {
    api.getOrgInfo({orgId: this.$route.params.orgManagementId}, orgInfo => {
      this.orgInfo = orgInfo
      if (this.orgInfo.orgArea !== null) {
        var provinceCode = this.orgInfo.orgArea.substring(0, 2) + '0000'
        var cityCode = this.orgInfo.orgArea.substring(0, 4) + '00'
        this.address = [provinceCode, cityCode, this.orgInfo.orgArea]
      }
      if (this.orgInfo.orgType != null) {
        this.category = [this.orgInfo.orgType]
      }
    }, () => {})
    api.getOrgSetting({orgId: this.$route.params.orgManagementId}, setting => {
      if (setting !== null) {
        this.settingInfo = setting
      }
      this.$nextTick(() => {
        this.isLoadFinish = true
      })
    }, () => {})
  },
  methods: {
    hideEditOrgImgUrl () {
      this.isShowEditOrgImgUrl = false
    },
    cropSuccess ({imgDataUrl, data2blob}, field) {
      this.saveOrgImgUrl({orgImgUrl: imgDataUrl, data2blob})
    },
    showEditText (placeholder, name, value) {
      this.placeholder = placeholder
      this.isShowEditText = true
      this.currentPropertyName = name
      if (typeof value === 'undefined') {
        this.newEditTextValue = this.settingInfo[name]
      } else {
        this.newEditTextValue = value
      }
    },
    saveEditTextValue () {
      this.isShowEditText = false
      if (this.currentPropertyName === 'orgName') {
        this.orgInfo.orgName = this.newEditTextValue
        api.saveOrgName({orgId: this.$route.params.orgManagementId, masterId: this.orgInfo.masterId, orgName: this.newEditTextValue}, userInfo => {
          this.tools.successToast('设置成功')
        }, () => {
          this.tools.warnToast('设置失败')
        })
        // this.saveOrgName({orgName: this.newEditTextValue})
      } else if (this.currentPropertyName === 'robotNickName') {
        api.saveRobotName({orgId: this.$route.params.orgManagementId, robotNickName: this.newEditTextValue}, (data) => {
          this.tools.successToast('设置成功')
        }, () => {
          this.tools.warnToast('设置失败')
        })
      } else {
        let param = {orgId: this.$route.params.orgManagementId, [this.currentPropertyName]: this.newEditTextValue}
        api.saveOrgSettingData(param, (data) => {
          this.settingInfo[this.currentPropertyName] = this.newEditTextValue
          this.tools.successToast('设置成功')
        }, () => {
          this.tools.warnToast('设置失败')
        })
      }
    },
    showEditTextarea (placeholder, name, value) {
      this.placeholder = placeholder
      this.isShowEditTextarea = true
      this.currentPropertyName = name
      if (typeof value === 'undefined') {
        this.newEditTextValue = this.settingInfo[name]
      } else {
        this.newEditTextValue = value
      }
    },
    saveEditTextareaValue () {
      this.isShowEditTextarea = false
      if (this.currentPropertyName === 'orgIntroduce') {
        this.orgInfo.orgIntroduce = this.newEditTextValue
        api.saveOrgIntroduce({orgId: this.$route.params.orgManagementId, masterId: this.orgInfo.masterId, orgIntroduce: this.newEditTextValue}, userInfo => {}, () => {})
        // this.saveOrgIntroduce({orgIntroduce: this.newEditTextValue})
      } else {
        let param = {orgId: this.$route.params.orgManagementId, [this.currentPropertyName]: this.newEditTextValue}
        api.saveOrgSettingData(param, (data) => {
          this.settingInfo[this.currentPropertyName] = this.newEditTextValue
        })
      }
    },
    changeSwitchStatus (currentValue, name) {
      if (this.isLoadFinish) {
        let param = {orgId: this.$route.params.orgManagementId, [name]: currentValue}
        api.saveOrgSettingData(param)
      }
    },
    chooseImg (name) {
      this.$wechat.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: res => {
          this.$wechat.getLocalImgData({
            localId: res.localIds[0], // 图片的localID
            success: res2 => {
              if (name === 'orgImgUrl') { // 修改群封面
                this.orgInfo.orgImgUrl = this.tools.data2imgDataUrl(res2.localData)
                api.saveOrgImgUrl({orgId: this.$route.params.orgManagementId, masterId: this.orgInfo.masterId, data2blob: this.tools.data2blob(res2.localData)},
                () => {},
                () => {})
                // this.saveOrgImgUrl({orgId: this.$route.params.orgManagementId, orgImgUrl: this.tools.data2imgDataUrl(res2.localData), data2blob: this.tools.data2blob(res2.localData)})
              } else if (name === 'orgLogo') { // 修改群图标
                this.orgInfo.orgLogo = this.tools.data2imgDataUrl(res2.localData)
                api.saveOrgLogo({orgId: this.$route.params.orgManagementId, masterId: this.orgInfo.masterId, data2blob: this.tools.data2blob(res2.localData)},
                () => {},
                () => {})
              } else { // 修改群设置中的图片选项
                this.settingInfo[name] = this.tools.data2imgDataUrl(res2.localData)
                let param = {orgId: this.$route.params.orgManagementId, [name]: this.tools.data2blob(res2.localData)}
                api.saveOrgSettingImg(param)
              }
            }
          })
        }
      })
    },
    addressHide (closeType) {
      if (closeType === true) { // 完成
        this.orgInfo.orgArea = this.address[2] + ''
        let param = {orgId: this.$route.params.orgManagementId, masterId: this.orgInfo.masterId, orgArea: this.orgInfo.orgArea}
        api.saveOrgArea(param, () => {}, () => {})
      }
    },
    categoryHide (closeType) {
      if (closeType === true) { // 完成
        console.log('category', this.category)
        this.orgInfo.orgType = this.category[0] + ''
        let param = {orgId: this.$route.params.orgManagementId, masterId: this.orgInfo.masterId, orgType: this.orgInfo.orgType}
        api.saveOrgType(param, () => {}, () => {})
      }
    }
  },
  directives: {
    TransferDom
  }
}
</script>

<style>

.cell-head-img{
  display:block;
  margin-right:8px; 
  border-radius: 25px;
  width: 50px;
  height: 50px;
}
.cell-cover-img{
  display:block;
  margin-right:8px; 
  border-radius: 5px;
  width: 120px;
  height: 60px;
}
</style>
