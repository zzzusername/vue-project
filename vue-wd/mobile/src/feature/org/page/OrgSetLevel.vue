<template>
  <div>
    <group>
      <cell v-for="item in list" :key="item.levelId" :title="item.levelName" is-link :value="item.levelStartScore + '-'+ item.levelEndScore" @click.native="editLevel(item)"></cell>
    </group>
    <popup v-model="isShowEdit"  is-transparent v-transfer-dom>
      <div flots="default" style="background-color:#fbf9fe;margin:10px;border-radius:5px;">
        <div class="jhy-padding-top-xs">
           <x-input v-model="levelInfo.levelName" placeholder="请输入积分等级名称"></x-input>
           <x-input v-model="levelInfo.levelStartScore" type="number" placeholder="请输入此等级最小分数"></x-input>
           <x-textarea v-model="levelInfo.levelDesc" placeholder="请输入简介"></x-textarea>
        </div>
        <div class="jhy-padding-horizontal jhy-padding-bottom">
          <x-button type="primary" class="jhy-background-success" @click.native="saveLevel ()" > 确定 </x-button>
        </div>
      </div>
    </popup>
    <detail-tabbar :actionLink="addLevel" :actions="actions" isHideMe=true></detail-tabbar>
  </div>
</template>

<script>
import api from '../api'
import { Cell, Group, XButton, Popup, TransferDomDirective as TransferDom, XInput, XTextarea } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
export default {
  data () {
    return {
      isShowEdit: false,
      levelInfo: {
        LevelName: '',
        levelStartScore: 0,
        levelDesc: '',
        levelId: null
      },
      list: [],
      actions: [{
        name: '添加成长等级',
        code: 'add'
      }]
    }
  },
  components: {
    Cell, Group, XButton, Popup, XInput, TransferDom, XTextarea, DetailTabbar
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      api.getLevelList({orgId: this.$route.params.orgManagementId}, list => {
        this.list = list
      })
    },
    editLevel (item) {
      this.isShowEdit = true
      this.levelInfo = {...item}
      this.levelInfo.levelStartScore = '' + item.levelStartScore
    },
    addLevel () {
      this.isShowEdit = true
      this.levelInfo = {}
    },
    saveLevel () {
      this.levelInfo.orgId = this.$route.params.orgManagementId
      api.saveLevelInfo(this.levelInfo, () => {
        this.getList()
        this.isShowEdit = false
      }, () => {
      })
    }
  },
  directives: {
    TransferDom
  }
}
</script>

<style>

</style>
