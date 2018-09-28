<template>
  <div>
    <group label-width="6em" label-margin-right="0.5em" label-align="left" gutter="10px">
      <datetime-range title="活动结束时间" :start-date="tools.formateTime(new Date(), 'YYYY-MM-DD')" 
        :end-date="tools.formateTime(endDateTime, 'YYYY-MM-DD')" placeholder="请选择时间" 
        v-model="advancedSetting.endDate" format="YYYY年MM月DD日" value-text-align="left">
      </datetime-range>
      <datetime-range title="开始报名时间" :start-date="tools.formateTime(new Date(), 'YYYY-MM-DD')" 
        :end-date="tools.formateTime(endDateTime, 'YYYY-MM-DD')" placeholder="请选择时间" 
        v-model="advancedSetting.signStartDate" format="YYYY年MM月DD日" value-text-align="left">
      </datetime-range>
      <datetime-range title="结束报名时间" :start-date="tools.formateTime(new Date(), 'YYYY-MM-DD')" 
        :end-date="tools.formateTime(this.advancedSetting.endDate.length != 0 ? this.advancedSetting.endDate[0] + ' '+this.advancedSetting.endDate[1]+':'+this.advancedSetting.endDate[2] : endDateTime, 'YYYY-MM-DD')" placeholder="请选择时间" 
        v-model="advancedSetting.signEndDate" format="YYYY年MM月DD日" value-text-align="left">
      </datetime-range>
      <!-- 活动结束时间、开始报名时间、结束报名时间、报名所需积分、报名费用、每人可报名人数、报名所需资料设置、关于费用、关于退款、报名是否需要审核、是否需要核销） -->
      <x-input title="每人可报名人数" v-model="advancedSetting.userMaxSignNum"></x-input>
      <cell title="报名所需资料设置" is-link @click.native="showContactInfo"></cell>
      <!-- <x-textarea title="关于费用" placeholder="请输入费用说明" v-model="advancedSetting.aboutCost" :rows="3"></x-textarea>
      <x-textarea title="关于退款" placeholder="请输入退款说明" v-model="advancedSetting.aboutRefund" :rows="3"></x-textarea> -->
      <!-- <x-textarea title="关于报名" placeholder="请输入费用说明" v-model="advancedSetting.activityDetailsText" :rows="2"></x-textarea> -->
      <x-switch title="报名是否需要审核" v-model="advancedSetting.isCheck"></x-switch>
      <x-switch title="报名是否需要核销" v-model="advancedSetting.isVerificationCode"></x-switch>
    </group>
    <detail-tabbar :actions="actions" :actionLink="onSave" isHideMe=true></detail-tabbar>

    <popup v-model="showContactInfoSetting" height="80%">
      <cell style="fontSize: 14px;" title="请添加报名所需资料">
        <p style="color: blue" @click="addContact">添加</p>
      </cell>
      <div :style="{'position':'relative', 'height': addContactHeight+'px', 'overflow': 'scroll'}">
        <!-- <scroller> -->
          <group gutter="0">
            <cell v-for="(item, index) in advancedSetting.userLinkData" :key="index" v-if="index <= 1" :title="item.key"></cell>
            <x-input v-else v-model="item.key" :show-clear="false" placeholder="编辑选项">
              <div slot="right" style="width: 26px;height: 26px;" @click="deleteContact(index)">
                <x-icon type="ios-close-outline" size="26" style="fill: red"></x-icon>
              </div>
            </x-input>
            <x-input v-for="(item, index) in tempContact" :key="index" v-model="item.key" :show-clear="false" placeholder="编辑选项">
              <div slot="right" style="width: 26px;height: 26px;" @click="deleteTempContact(index)">
                <x-icon type="ios-close-outline" size="26" style="fill: red"></x-icon>
              </div>
            </x-input>
          </group>
        <!-- </scroller> -->
      </div>
      <div style="display:flex;position: fixed;width: 100vw;bottom: 0;height: 50px;">
        <div style="flex: 1;backgroundColor:rgb(230, 230, 230)" @click="showContactInfoSetting = false">
          <p style="line-height: 50px; textAlign: center;">关闭</p>
        </div>
        <div style="flex: 1;backgroundColor: #8ebf52" @click="confirmContact">
          <p style="line-height: 50px; textAlign: center;color: #fff;">确定</p>
        </div>
      </div>
    </popup>
  </div>
</template>

<script>
import { Group, DatetimeRange, XInput, Cell, XTextarea, XSwitch, Popup } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
export default {
  components: {
    Group, DatetimeRange, XInput, Cell, XTextarea, XSwitch, Popup, DetailTabbar
  },
  data() {
    return {
      advancedSetting: {
        endDate: [],
        signStartDate: [],
        signEndDate: [],
        userMaxSignNum: null,
        // aboutCost: '',
        // aboutRefund: '',
        isCheck: false,
        isVerificationCode: false,
        userLinkData: [{key: '姓名', value: ''}, {key: '手机号', value: ''}]
      },
      actions: [{name: '保存'}],
      showContactInfoSetting: false,
      tempContact: [],
      addContactHeight: 0
    }
  },
  computed: {
    endDateTime() {
      let date = new Date()
      date.setFullYear(date.getFullYear() + 1)
      return date
    }
  },
  mounted() {
    this.addContactHeight = window.innerHeight * 0.8 - 92
    let obj = JSON.parse(JSON.stringify(this.$store.getters.getAdvanceSettings))
    if (obj !== null) {
      this.advancedSetting = obj
    }
  },
  methods: {
    onSave() {
      if (this.advancedSetting.endDate.length !== 0 || this.advancedSetting.signStartDate.length !== 0 || this.advancedSetting.signEndDate.length !== 0) {
        if (!(this.advancedSetting.endDate.length === 0 || this.advancedSetting.signStartDate.length === 0 || this.advancedSetting.signEndDate.length === 0)) {
          let endDate = new Date(this.advancedSetting.endDate[0] + ' ' + this.advancedSetting.endDate[1] + ':' + this.advancedSetting.endDate[2])
          let signStartDate = new Date(this.advancedSetting.signStartDate[0] + ' ' + this.advancedSetting.signStartDate[1] + ':' + this.advancedSetting.signStartDate[2])
          let signEndDate = new Date(this.advancedSetting.signEndDate[0] + ' ' + this.advancedSetting.signEndDate[1] + ':' + this.advancedSetting.signEndDate[2])
          if (signEndDate > endDate) {
            this.tools.warnToast('报名结束时间必须小于\n或等于活动结束时间', 180)
            return
          }
          if (signStartDate >= signEndDate) {
            this.tools.warnToast('报名开始时间必须小于报名结束时间')
            return
          }
        } else {
          this.tools.warnToast('请完善所有时间')
          return
        }
      }
      this.$store.commit('setAdvanceSettings', this.advancedSetting)
      this.$router.go(-1)
    },
    showContactInfo() {
      this.showContactInfoSetting = true
      this.tempContact = []
    },
    addContact() {
      this.tempContact.push({key: '', value: ''})
    },
    deleteContact(index) {
      this.advancedSetting.userLinkData.splice(index, 1)
    },
    deleteTempContact(index) {
      this.tempContact.splice(index, 1)
    },
    confirmContact() {
      this.tempContact.forEach(element => {
        if (element.key !== '') {
          this.advancedSetting.userLinkData.push(element)
        }
      })
      // this.advancedSetting.userLinkData = this.advancedSetting.userLinkData.concat(this.tempContact)
      this.tempContact.splice(0, this.tempContact.length)
      this.showContactInfoSetting = false
    }
  }
}
</script>

<style>

</style>
