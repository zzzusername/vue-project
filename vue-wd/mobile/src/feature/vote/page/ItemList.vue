<template>
  <div>
    <div :style="{position: 'relative', height: scorllerHeight +'px'}">
      <scroller :on-infinite="infinite" no-data-text="您可以添加更多投票项">
        <div style="height: 10px" v-if="list.length == 0"></div>
        <group gutter="0">
          <cell v-for="item in list" :key="item.itemId" v-if="item" :title="getName(item)" is-link @click.native="itemClick(item)">
            <div v-if="item.itemLogo" slot="icon" class="cover-vote" :style="{'background-image':'url('+tools.cdn(item.itemLogo, 'head.png', 128)+')'}"></div>
            <p slot="inline-desc">{{item.itemDesc}}</p>
          </cell>
        </group>
      </scroller>
    </div>
    <detail-tabbar :actionLink="add" :actions="actions"></detail-tabbar>
    <!-- 选项操作 -->
    <actionsheet :menus="menus" v-model="showActionsheet" show-cancel @on-click-menu="menuItemClick"></actionsheet>
    <!-- 提示 -->
    <confirm v-if="tempData" title="提示" v-model="showConfirm" @on-confirm="confirmDelete">
      <p style="color: red">您确定删除【{{getName(tempData)}}】投票项吗</p>
    </confirm>
  </div>
</template>

<script>
import api from '../api.js'
import {Group, Cell, Actionsheet, Confirm} from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
export default {
  components: {
    Group, Cell, Actionsheet, Confirm, DetailTabbar
  },
  data() {
    return {
      scorllerHeight: 0,
      actions: [{name: '添加'}],
      showActionsheet: false,
      menus: {preview: '预览', modify: '修改', del: '删除'},
      list: [],
      tempData: null,
      showConfirm: false
    }
  },
  computed: {
    schoolId() {
      return this.$route.params.schoolId
    },
    voteId() {
      return this.$route.params.voteId
    },
    type() {
      return this.$route.params.type
    }
  },
  mounted() {
    this.scorllerHeight = window.innerHeight - 50
  },
  methods: {
    toast(er, hint = '') {
      if (er.toUser) {
        hint = er.message
      }
      this.tools.warnToast(hint)
    },
    add() {
      // 添加
      this.$router.push({name: 'educationVoteAddItem', params: {voteId: this.voteId, type: this.type}})
    },
    itemClick(val) {
      this.tempData = val
      this.showActionsheet = true
    },
    menuItemClick(key) {
      if (key === 'modify') {
        this.$router.push({name: 'educationVoteEditItem', params: {voteId: this.voteId, type: this.type, itemId: this.tempData.itemId}})
      } else if (key === 'del') {
        this.showConfirm = true
      } else if (key === 'preview') {
        this.$router.push({name: 'educationSignUpDetail', params: {voteId: this.voteId, itemId: this.tempData.itemId}})
      }
    },
    confirmDelete() {
      api.deleteItem({schoolId: this.schoolId, itemId: this.tempData.itemId}, (data) => {
        for (let index = 0; index < this.list.length; index++) {
          const item = this.list[index]
          if (item.itemId === this.tempData.itemId) {
            this.list.splice(index, 1)
          }
        }
        this.tools.successToast('删除成功')
      }, (er) => {
        this.toast(er, '删除失败')
      })
    },
    infinite(done) {
      api.getUserVoteItemList({schoolId: this.schoolId, voteId: this.voteId, rowStart: this.list.length, rowCount: 20}, (data) => {
        this.list = this.list.concat(data)
        if (data.length >= 20) {
          done()
        } else {
          done(true)
        }
      }, (er) => {
        this.toast(er, '获取列表失败')
      })
    },
    getName(val) {
      if (val.studentId) {
        return val.studentName
      }
      if (val.teacherId) {
        return val.teacherName
      }
      if (val.itemName) {
        return val.itemName
      }
    }
  }
}
</script>

<style lang="less" scoped>
.cover-vote {
  width: 12vw;
  height:12vw;
  display: inline-block;
  border-radius: 6px;
  margin-right: 10px;
  background-position: center center;
  background-size: cover;
  border-style:none;
  border-width:0;
  vertical-align:middle;
}
</style>

