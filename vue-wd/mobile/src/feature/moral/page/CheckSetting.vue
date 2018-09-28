<template>
  <!-- 德育管理考勤设置 -->
  <div>
    <group title="考勤设置">
      <cell title="迟到应扣分数" is-link :value="late" @click.native="changeScore('CHIDAO')"></cell>
      <cell title="早退应扣分数" is-link :value="leaveEarly" @click.native="changeScore('ZAOTUI')"></cell>
      <cell title="旷课应扣分数" is-link :value="absenteeism" @click.native="changeScore('KUANGKE')"></cell>
      <cell title="接收考勤通知设置" is-link :link="{name: 'educationAttendPushSetting'}"></cell>
    </group>
    <popup v-model="showPopupInput" is-transparent>
      <div flots="default" style="width: 95%;background-color:#fbf9fe;margin:0 auto;border-radius:5px;padding-top:10px;margin-bottom:10px">
        <div>
          <x-input title="选项名称" type="number" v-model="store" :show-clear="true" placeholder="请输入分数"></x-input>
        </div>
        <div style="padding:10px 15px;">
          <flexbox>
            <flexbox-item><x-button type="primary" @click.native="saveEditValue"> 确定 </x-button></flexbox-item>
          </flexbox>
        </div>
      </div>
    </popup>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import { Group, Cell, XInput, Popup, XButton, Flexbox, FlexboxItem } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '../api'
export default {
  components: {
    Group, Cell, XInput, XButton, Popup, Flexbox, FlexboxItem, DetailTabbar
  },
  data () {
    return {
      settingInfo: [],
      showPopupInput: false,
      store: null,
      type: null,
      late: null,
      leaveEarly: null,
      absenteeism: null
    }
  },
  mounted () {
    api.addCheckSettingInfo({schoolId: this.$route.params.schoolId}, (data) => {
      if (data.itemList !== null && data.itemList !== undefined) {
        this.settingInfo = data.itemList
      }
      if (this.settingInfo.length > 0) {
        for (let i = 0; i < this.settingInfo.length; i++) {
          switch (this.settingInfo[i].itemCode) {
            case 'CHIDAO':
              this.late = this.settingInfo[i].itemStore
              break
            case 'ZAOTUI':
              this.leaveEarly = this.settingInfo[i].itemStore
              break
            case 'KUANGKE':
              this.absenteeism = this.settingInfo[i].itemStore
              break
          }
        }
      }
    }, (er) => {})
  },
  methods: {
    saveEditValue () {
      if (!this.store) {
        this.tools.warnToast('请填写分数')
        return
      }
      api.addCheckSetting({schoolId: this.$route.params.schoolId, code: this.type, store: this.store}, (data) => {
        this.tools.successToast('保存成功')
        switch (this.type) {
          case 'CHIDAO':
            this.late = this.store
            break
          case 'ZAOTUI':
            this.leaveEarly = this.store
            break
          case 'KUANGKE':
            this.absenteeism = this.store
            break
        }
        this.showPopupInput = false
        this.store = null
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        } else {
          this.tools.warnToast('保存失败')
        }
      })
    },
    changeScore (type) {
      this.type = type
      switch (type) {
        case 'CHIDAO':
          this.store = this.late
          break
        case 'ZAOTUI':
          this.store = this.leaveEarly
          break
        case 'KUANGKE':
          this.store = this.absenteeism
          break
      }
      this.showPopupInput = true
    }
  }
}
</script>

<style>

</style>
