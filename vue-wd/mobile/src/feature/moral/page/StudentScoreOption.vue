<template>
  <div>
    <p style="font-size: 14px;padding:10px 15px;color:#FC5355">请用电脑登陆edu.qunxiaozhu.com操作新增／编辑</p>
    <group gutter="0">
      <cell v-for="(item, index) in list" :key="index"
      :title="item.projectName"
      :border-intent="false">
        <div slot="inline-desc">
          <p v-if="item.projectDesc">{{'说明: ' + item.projectDesc}}</p>
          <p v-for="(data, index) in item.items" :key="index" style="text-indent: 1em">
            <span>{{index + 1}}.&nbsp;</span>
            <span>{{data.itemName + ":"}}</span>
            <span style="margin-left: 5px;">{{getItemValue(data.itemStore)}}</span>
          </p>
        </div>
      </cell>
    </group>
    <detail-tabbar></detail-tabbar>
    <div v-transfer-dom>
      <confirm v-model="showTemplate"
      title="操作提示"
      @on-cancel="showTemplate = false"
      @on-confirm="onConfirm"
      cancel-text="关闭"
      confirm-text="导入模版">
        <p style="text-align:center;">本系统提供德育学生操行评定项默认模版</p>
      </confirm>
    </div>
  </div>
</template>

<script>
import {Group, Cell, Confirm, TransferDom} from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '../api'
export default {
  directives: {
    TransferDom
  },
  components: {
    Group, Cell, DetailTabbar, Confirm
  },
  data() {
    return {
      list: [],
      showContent: false,
      showTemplate: false
    }
  },
  computed: {
    type() {
      return String(this.$route.params.projectType)
    }
  },
  mounted() {
    if (this.type === '1') {
      this.$route.meta.title = '加分项列表'
      document.title = '加分项列表'
    } else if (this.type === '2') {
      this.$route.meta.title = '减分项列表'
      document.title = '减分项列表'
    }
    this.getList()
  },
  methods: {
    getList () {
      api.studentMoralTreeList({schoolId: this.$route.params.schoolId, projectType: this.type}, (data) => {
        data.forEach(element => {
          element.showContent = false
        })
        this.list = data
        if (this.list.length <= 0) {
          this.showTemplate = true
        }
      }, (er) => {
        if (er.toUser) {
          this.tools.warnToast(er.message)
          return
        }
        this.tools.warnToast('获取信息失败')
      })
    },
    onConfirm () {
      api.studentAddTemplate({schoolId: this.$route.params.schoolId, type: this.type}, (data) => {
        this.tools.successToast('导入成功')
        this.getList()
      }, (er) => {
        if (er.toUser) {
          this.tools.warnToast(er.message)
          return
        } else {
          this.tools.warnToast('导入失败')
        }
      })
    },
    getItemValue (val) {
      if (this.type === '1') {
        return '+' + val + '分'
      }
      return '-' + val + '分'
    }
  }
}
</script>

<style lang="less" scoped>

</style>

