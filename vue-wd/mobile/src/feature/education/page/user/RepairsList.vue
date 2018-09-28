<template>
  <div>
    <div :style="{'height': scrollerHeight + 'px', 'position': 'relative'}">
      <scroller :on-infinite="infinite" ref="comments_scroller">
        <p style="padding: 15px;textAlign: center;color: #a2a2a2" v-if="emptyHint != null">{{emptyHint}}</p>
        <cell v-for="(item, index) in list" :key="index" style="backgroundColor: #fff" is-link @click.native="itemClick(item)">
          <p style="fontSize: 17px;" slot="title">{{item.repairTitle}}</p>
          <p slot="inline-desc">
            <span>{{getType(item.repairType)}}</span>&nbsp;&nbsp;
            <span>{{formateTime(item.repairDate)}}</span><br>
            <span v-if="item.repairTeacherId != null && item.repairTeacherName != null">处理人: {{item.repairTeacherName}}</span>
          </p>
          <p>{{item.isComplete ? '已处理':'待处理'}}</p>
        </cell>
      </scroller>
    </div>
    <detail-tabbar :actionLink="publish" :actions="actions"></detail-tabbar>
    <actionsheet v-model="showMenu" :menus="menus" show-cancel @on-click-menu="clickMenu"></actionsheet>
    <div v-transfer-dom>
      <confirm v-model="showConfirm" title="提示" theme="ios" @on-confirm="onConfirm">
        <p style="text-align:center;">{{ confirmHint }}</p>
      </confirm>
    </div>
  </div>
</template>

<script>
import { Cell, Actionsheet, Confirm, dateFormat, TransferDomDirective as TransferDom } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '../../api'
export default {
  directives: {
    TransferDom
  },
  components: {
    Cell, DetailTabbar, Actionsheet, Confirm
  },
  data() {
    return {
      scrollerHeight: 0,
      list: [],
      actions: [
        { name: '发布报修' }
      ],
      menus: {
        look: '查看',
        del: '删除'
      },
      showMenu: false,
      selectData: null,
      showConfirm: false,
      confirmHint: '',
      emptyHint: null
    }
  },
  mounted() {
    this.scrollerHeight = window.innerHeight - 50
  },
  methods: {
    clickMenu(val) {
      switch (val) {
        case 'look':
          this.$router.push({ name: 'educationRepairsDetail', params: { repairId: this.selectData.repairId, isManage: false } })
          break
        case 'del':
          this.confirmHint = '您确定删除标题为"' + this.selectData.repairTitle + '"的报修吗？'
          this.showConfirm = true
          break
      }
    },
    onConfirm() {
      api.delRepair({ schoolId: this.$route.params.schoolId, repairId: this.selectData.repairId }, (data) => {
        for (var index = 0; index < this.list.length; index++) {
          var element = this.list[index]
          if (element.repairId === this.selectData.repairId) {
            this.list.splice(index, 1)
          }
        }
        this.tools.successToast('删除成功')
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    itemClick(val) {
      this.selectData = val
      this.showMenu = true
    },
    publish() {
      this.$router.push({ name: 'educationRepairsPublish' })
    },
    infinite(done) {
      api.queryRepairsList({ schoolId: this.$route.params.schoolId, rowStart: this.list.length, rowCount: 20 }, (data) => {
        this.list = this.list.concat(data)
        if (data.length < 20) {
          done(true)
        } else {
          done()
        }
        if (this.list.length === 0) {
          this.emptyHint = '暂无报修～'
        }
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    formateTime(time) {
      return dateFormat(time, 'YYYY-MM-DD HH:mm')
    },
    getType(val) {
      var str = ''
      switch (val) {
        case '1':
          str = '水电'
          break
        case '2':
          str = '宿舍'
          break
        case '3':
          str = '教学器材'
          break
      }
      return str
    }
  }
}
</script>

<style>

</style>
