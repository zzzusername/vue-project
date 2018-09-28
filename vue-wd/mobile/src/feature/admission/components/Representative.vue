<template>
  <div>
    <popup v-model="isShowPopup" height="90vh">
      <group>
        <x-switch title="是否开启招生代表功能" v-model="temp.isPowerDeputy"></x-switch>
      </group>
      <group v-show="temp.isPowerDeputy">
        <group-title v-show="isNew == true" slot="title"><span style="color:#FF6D56">注：成功发布后不能修改奖励设置</span></group-title>
        <group-title v-show="isNew == false" slot="title"><span style="color:#FF6D56">注：不能修改奖励设置</span></group-title>
        <cell title="招生代表奖励设置" is-link @click.native="onAward"></cell>
        <x-switch v-show="temp.isPowerDeputy" title="是否开启招生代表入群" v-model="temp.isDeputyJoinOrg"></x-switch>
        <cell v-show="temp.isDeputyJoinOrg" title="招生代表群二维码" @click.native='chooseImg("qrcode")' is-link>
          <img slot="default" :src="tools.cdn(temp.deputyOrgQrcodeData,'logo.png')" class="adminssion-cell-qrcode-img"></img>
        </cell>
      </group>
      <group v-show="temp.isPowerDeputy" title="请输入二维码居分享图片的位置，单位：px">
        <cell>
          <div slot="after-title">
            <div style="float:left;height:38px; line-height:38px;">二维码位置</div>
            <x-input class="admission-poistion-input" style="float:left;width:35px !important;font-size:14px" keyboard="number" :show-clear="false" placeholder="居左" v-model="temp.deputyInviteQrcodePositionLeft"></x-input>
            <x-input class="admission-poistion-input" style="float:left;width:35px !important;font-size:14px" keyboard="number" :show-clear="false" placeholder="居上" v-model="temp.deputyInviteQrcodePositionTop"></x-input>
            <x-input class="admission-poistion-input" style="float:left;width:35px !important;font-size:14px" keyboard="number" :show-clear="false" placeholder="宽高" v-model="temp.deputyInviteQrcodePositionWidth"></x-input>
          </div>
        </cell>
        <cell v-show="temp.isPowerDeputy" title="招生代表分享图片" @click.native='chooseImg("share")' is-link>
          <img slot="default" :src="tools.cdn(temp.deputyInviteImgData,'logo.png')" class="adminssion-cell-qrcode-img"></img>
        </cell>
        <div style="'width:50vw;position:relative;margin:0 auto;height:60vw;margin-bottom:50px">
          <image-qrcode class="admission-share-review" :src="tools.cdn(temp.deputyInviteImgData)" :x="parseInt(temp.deputyInviteQrcodePositionLeft)" :y="parseInt(temp.deputyInviteQrcodePositionTop)" value="http://www.baidu.com" :size="parseInt(temp.deputyInviteQrcodePositionWidth)" ></image-qrcode>
        </div>
        <!--<cell v-show="temp.isPowerDeputy" title="预览二维码图片" is-link></cell>-->
      </group>
      <tabbar style="position:fixed">
        <tabbar-item @on-item-click="goBack">
          <span slot="label" >取消</span>
        </tabbar-item>
        <tabbar-item style="background-color:#8ebf52">
          <span slot="label" style="color:#fff" @click="onDone">完成</span>
        </tabbar-item>
      </tabbar>
    </popup>
    <award :isShow="isShowAward" :goBack="goBackAward" :returnData="getAwardData" :defaultData="{deputyRewardUnit: temp.deputyRewardUnit, deputyRewards: temp.deputyRewards, recruitGuideRewards: temp.recruitGuideRewards, isNew: this.isNew}"></award>
  </div>
</template>

<script>
import { Group, XSwitch, Cell, Popup, Tabbar, TabbarItem, XInput, GroupTitle } from 'vux'
import Award from './Award'
import ImageQrcode from '@/components/ImageQrcode.vue'
export default {
  components: {
    Group, XSwitch, Cell, Popup, Tabbar, TabbarItem, Award, XInput, ImageQrcode, GroupTitle
  },
  props: ['isShow', 'goBack', 'returnData', 'defaultData'],
  data () {
    return {
      data: {
        isPowerDeputy: false,
        isDeputyJoinOrg: false,
        deputyOrgQrcodeBinaryData: null,
        deputyOrgQrcodeData: null,
        deputyInviteImgBinaryData: null,
        deputyInviteImgData: null,
        deputyInviteQrcodePosition: null,
        deputyInviteQrcodePositionTop: null,
        deputyInviteQrcodePositionLeft: null,
        deputyInviteQrcodePositionWidth: null,
        deputyRewardUnit: null,
        recruitGuideRewards: null,
        deputyRewards: null
      },
      temp: {},
      isShowAward: false,
      isShowPopup: false,
      isNew: false
    }
  },
  watch: {
    isShow(newValue, old) {
      this.isShowPopup = newValue
      if (newValue === true) {
        if (this.defaultData !== null) {
          this.data = this.defaultData
        } else {
          this.isNew = true
        }
        console.log(this.data)
        this.temp = JSON.parse(JSON.stringify(this.data))
        if (this.temp.deputyRewards === null || this.temp.deputyRewards === undefined) {
          this.temp.deputyRewards = []
        } else {
          var tempRewards = JSON.parse(this.temp.deputyRewards)
          this.temp.deputyRewards = []
          for (var i = 0; i < tempRewards.length; i++) {
            var item = tempRewards[i]
            this.temp.deputyRewards.push({key: (i + 1) + '级奖励', value: item})
          }
        }
      }
    },
    isShowPopup(newValue, old) {
      if (newValue === false) {
        this.goBack()
      }
    }
  },
  methods: {
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
        localId: localId,
        success: res2 => {
          if (type === 'share') {
            this.temp.deputyInviteImgData = this.tools.data2imgDataUrl(res2.localData)
            this.temp.deputyInviteImgBinaryData = this.tools.data2blob(res2.localData)
          } else if (type === 'qrcode') {
            this.temp.deputyOrgQrcodeData = this.tools.data2imgDataUrl(res2.localData)
            this.temp.deputyOrgQrcodeBinaryData = this.tools.data2blob(res2.localData)
          }
        }
      })
    },
    onDone () {
      this.temp.deputyInviteQrcodePosition = (this.temp.deputyInviteQrcodePositionLeft === null ? 0 : this.temp.deputyInviteQrcodePositionLeft) + ',' + (this.temp.deputyInviteQrcodePositionTop === null ? 0 : this.temp.deputyInviteQrcodePositionTop) + ',' + (this.temp.deputyInviteQrcodePositionWidth === null ? 0 : this.temp.deputyInviteQrcodePositionWidth)
      this.returnData(this.temp)
    },
    onAward () {
      this.isShowAward = true
    },
    goBackAward () {
      this.isShowAward = false
    },
    getAwardData (val) {
      this.temp.deputyRewards = val.deputyRewards
      this.temp.deputyRewardUnit = val.deputyRewardUnit
      this.temp.recruitGuideRewards = val.recruitGuideRewards
      this.isShowAward = false
    },
    onReview () {

    }
  }
}
</script>

<style>
.admission-poistion-input:before {
  border-top: 0px !important;
}
.admission-share-review img{
  width:inherit;
  max-width: 100%;
  max-height: 100%;
  display:block;
  position:absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
