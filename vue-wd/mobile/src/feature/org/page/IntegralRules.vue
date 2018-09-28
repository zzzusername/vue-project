<template>
  <div>
    <group>
      <cell v-for="(item, index) in list" :key="index" :title="item.scoreName" is-link :value="item.scoreValue" @click.native="setRules(index)"></cell>
    </group>
    <popup v-model="isShowEditText" height="145px" is-transparent v-transfer-dom>
      <div flots="default" style="width: 95%;background-color:#fbf9fe;height:125px;margin:0 auto;border-radius:5px;padding-top:10px;">
        <x-input v-model="newEditTextValue" title="获得积分数" style="background-color:#fff;margin:10px 15px;" :show-clear="true"></x-input>
        <div style="padding:10px 15px;">
          <x-button type="primary" @click.native="saveRules()" > 保存 </x-button>
        </div>
      </div>
    </popup>
    <popup v-model="isShowCommentEditText" height="205px" is-transparent v-transfer-dom>
      <div flots="default" style="width: 95%;background-color:#fbf9fe;height:185px;margin:0 auto;border-radius:5px;padding-top:10px;">
        <x-input v-model="commentScore" title="评论获得积分数" style="background-color:#fff;margin:10px 15px;" :show-clear="true"></x-input>
        <div>
          <x-input v-model="commentCount" title="每天最多次数" style="background-color:#fff;margin:10px 15px;" :show-clear="true"></x-input>
        </div>
        <div style="padding:10px 15px;">
          <x-button type="primary" @click.native="saveCommentRules()" > 保存 </x-button>
        </div>
      </div>
    </popup>
    <detail-tabbar ></detail-tabbar>
  </div>
</template>

<script>
import { Cell, Group, XButton, Popup, TransferDomDirective as TransferDom, XInput, Picker } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '@/feature/org/api'

export default {
  components: {
    Cell, Group, XButton, Popup, XInput, TransferDom, DetailTabbar, Picker
  },
  data () {
    return {
      scoreNames: {
        VISIT: '访问空间',
        SHARE: '分享',
        COMMENT: '评论',
        SPEAK: '活跃',
        FIRST_JOIN: '首次进群'
      },
      list: [
        {scoreType: 'VISIT', scoreName: '访问空间', scoreRule: '0'},
        {scoreType: 'SHARE', scoreName: '分享', scoreRule: '0'},
        {scoreType: 'COMMENT', scoreName: '评论', scoreRule: '0'},
        {scoreType: 'SPEAK', scoreName: '活跃', scoreRule: '0'},
        {scoreType: 'FIRST_JOIN', scoreName: '首次进群', scoreRule: '0'}
      ],
      isShowEditText: false,
      newEditTextValue: '',
      currentScoreType: '',
      isShowCommentEditText: false,
      commentScore: '',
      commentCount: ''
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      api.getScoreList({orgId: this.$route.params.orgManagementId}, (data) => {
        data.forEach((element) => {
          for (var i = this.list.length - 1; i >= 0; i--) {
            var item = this.list[i]
            if (element.scoreType === item.scoreType) {
              this.list.splice(i, 1)
            }
          }
        }, this)
        data.push(...this.list)
        data.forEach((element) => {
          element.scoreName = this.scoreNames[element.scoreType]
          if (element.scoreType !== 'COMMENT' && element.scoreType !== 'SPEAK') {
            element.scoreValue = element.scoreRule + ''
          }
        }, this)
        this.list = data
      }, () => {})
    },
    setRules (index) {
      var scoreInfo = this.list[index]
      this.currentScoreType = scoreInfo.scoreType
      if (scoreInfo.scoreType === 'COMMENT') {
        this.isShowCommentEditText = true
        this.commentScore = scoreInfo.scoreRule.split('-')[0]
        this.commentCount = scoreInfo.scoreRule.split('-')[1]
      } else if (scoreInfo.scoreType === 'SPEAK') {
        this.$router.push({name: 'orgModifyActiveIntegralRules'})
      } else {
        this.newEditTextValue = scoreInfo.scoreValue
        this.isShowEditText = true
      }
    },
    saveRules () {
      api.saveScore({orgId: this.$route.params.orgManagementId, scoreRule: this.newEditTextValue, scoreType: this.currentScoreType}, () => {
        this.isShowEditText = false
        var _list = [...this.list]
        _list.forEach((element) => {
          if (element.scoreType === this.currentScoreType) {
            element.scoreRule = this.newEditTextValue
            element.scoreValue = this.newEditTextValue
          }
        }, this)
        this.list = _list
        this.tools.successToast('保存成功')
      }, () => {})
    },
    saveCommentRules () {
      var score = this.commentScore + '-' + this.commentCount
      api.saveScore({orgId: this.$route.params.orgManagementId, scoreRule: score, scoreType: this.currentScoreType}, () => {
        this.isShowCommentEditText = false
        var _list = [...this.list]
        _list.forEach((element) => {
          if (element.scoreType === this.currentScoreType) {
            element.scoreRule = score
          }
        }, this)
        this.list = _list
        this.tools.successToast('保存成功')
      }, () => {})
    }
  },
  directives: {
    TransferDom
  }
}
</script>

<style>

</style>
