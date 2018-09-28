<template>
  <div>
    <p class="jhy-margin">
      <x-button type="primary" class="jhy-background-success" @click.native="addRules()">添加积分规则</x-button>
    </p>
    <group>
      <cell v-for="(item, index) in list" :key="index" :title="'活跃用户' + item.min + '-' + item.max + '名'" :value="item.value" is-link @click.native="openRulesView(index)"></cell>
    </group>
    <popup v-model="isShowEditText" height="255px" is-transparent v-transfer-dom>
      <div flots="default" style="width: 95%;background-color:#fbf9fe;height:235px;margin:0 auto;border-radius:5px;padding-top:10px;">
        <div>
          <x-input v-model="min" title="排名下限" style="background-color:#fff;margin:10px 15px;" type='tel' :show-clear="true"></x-input>
        </div>
        <div>
          <x-input v-model="max" title="排名上限" style="background-color:#fff;margin:10px 15px;" type='tel' :show-clear="true"></x-input>
        </div>
        <div>
          <x-input v-model="score" title="每天获取积分数" style="background-color:#fff;margin:10px 15px;" type='tel' :show-clear="true"></x-input>
        </div>
        <div style="padding:10px 15px;">
          <x-button type="primary" @click.native="setRules()" > 设置 </x-button>
        </div>
      </div>
    </popup>
    <detail-tabbar :actionLink="saveRules" :actions="actions" isHideMe=true></detail-tabbar>
  </div>
</template>

<script>
import { Cell, Group, XButton, Popup, TransferDomDirective as TransferDom, XInput, Picker, Tabbar, TabbarItem } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '@/feature/org/api'

export default {
  components: {
    Cell, Group, XButton, Popup, XInput, TransferDom, DetailTabbar, Picker, Tabbar, TabbarItem
  },
  data () {
    return {
      list: [],
      isShowEditText: false,
      newEditTextValue: '',
      currentIndex: 0,
      max: 0,
      min: 0,
      score: '',
      actions: [{
        name: '保存',
        code: 'save'
      }]
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      api.getScoreList({orgId: this.$route.params.orgManagementId}, (data) => {
        data.forEach((element) => {
          if (element.scoreType === 'SPEAK') {
            var _list = element.scoreRule.split(',')
            _list.forEach(function(e) {
              var vl = e.split('-')
              var item = {}
              // item.name = '活跃用户' + vl[0] + '-' + vl[1] + '名'
              item.value = vl[2]
              item.max = vl[1]
              item.min = vl[0]
              this.list.push(item)
            }, this)
          }
        }, this)
      }, () => {})
    },
    openRulesView (index) {
      this.currentIndex = index
      this.isShowEditText = true
      var item = this.list[index]
      this.max = item.max
      this.min = item.min
      this.score = item.value
    },
    onBack () {
      this.$router.back()
    },
    setRules () {
      if (this.min === '' || this.max === '' || this.score === '' || isNaN(this.min) || isNaN(this.max) || isNaN(this.score)) {
        this.tools.toast('数据错误，请重新输入', '180px')
        return
      }
      var _list = [...this.list]
      var item = _list[this.currentIndex]
      if (this.currentIndex === -1) {
        item = {}
        item.max = this.max
        item.min = this.min
        item.value = this.score
        _list.push(item)
      } else {
        item.max = this.max
        item.min = this.min
        item.value = this.score
      }
      this.list = _list
      this.isShowEditText = false
    },
    saveRules () {
      var scoreRule = null
      this.list.forEach(function(element) {
        if (scoreRule == null) {
          scoreRule = element.min + '-' + element.max + '-' + element.value
        } else {
          scoreRule = scoreRule + ',' + element.min + '-' + element.max + '-' + element.value
        }
      }, this)
      api.saveScore({orgId: this.$route.params.orgManagementId, scoreRule, scoreType: 'SPEAK'}, () => {
        this.$router.back()
        this.tools.successToast('保存成功')
      }, () => {})
    },
    addRules () {
      this.isShowEditText = true
      this.currentIndex = -1
      this.max = null
      this.min = null
      this.score = null
    }
  },
  directives: {
    TransferDom
  }
}
</script>

<style>

</style>
