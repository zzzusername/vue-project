<template>
  <div>
    <div :style="{position: 'relative', height: contentHeight+'px'}">
      <scroller>
        <group gutter="0">
          <cell :title="'['+detail.studentName+'] '+detail.projectName" style="background:#f6f6f6" :value="getValue() + '分'">
            <p style="color:#FC5355;">{{detail.isRemove ? '已消分' : getValue() + '分'}}</p>
          </cell>
        </group>
        <div class="score-detail">
          <p class="title">评定明细</p>
          <p class="content"><span>{{detail.itemName}}:</span><span style="margin-left: 5px">{{getValue()}}分</span></p>
          <div class="content" style="padding-top: 5px;" v-if="detail.classEvaluateId">
            <p><span>{{'['+detail.className + '] ' + detail.classProjectName + '(' + detail.classItemName + ')'}}: </span><span style="margin-left: 5px;">{{getClassValue() + '分'}}</span></p>
          </div>
        </div>
        <div>
          <p class="title">评定原因</p>
          <p class="content">{{detail.evaluateDesc}}</p>
          <div v-if="detail.evaluateImg">
            <img style="width:100%;" v-for="(item, index) in getImgs()" :key="index" :src="tools.cdn(item)" alt="">
          </div>
        </div>
        <div v-if="!detail.isRemove" style="height:40px"></div>
      </scroller>
    </div>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import api from '../api'
import DetailTabbar from '@/components/DetailTabbar.vue'
import {Group, Cell} from 'vux'
export default {
  components: {
    DetailTabbar, Group, Cell
  },
  data() {
    return {
      contentHeight: 0,
      detail: {}
    }
  },
  computed: {
    schoolId() {
      return this.$route.params.schoolId
    },
    classId() {
      return this.$route.params.classId
    },
    evaluateId() {
      return this.$route.params.evaluateId
    }
  },
  mounted() {
    this.contentHeight = window.innerHeight - 50
    api.getScoreStudentDetail({schoolId: this.schoolId, classId: this.classId, evaluateId: this.evaluateId}, data => {
      this.detail = data
    }, er => {
      if (er.toUser) {
        this.tools.warnToast(er.message)
        return
      }
      this.tools.warnToast('获取详情失败')
    })
  },
  methods: {
    getValue() {
      if (this.detail.projectType === 1) {
        return '+' + this.detail.evaluateStore
      } else {
        return '-' + this.detail.evaluateStore
      }
    },
    getClassValue() {
      if (this.detail.projectType === 1) {
        return '+' + this.detail.classStore
      } else {
        return '-' + this.detail.classStore
      }
    },
    getImgs() {
      return this.detail.evaluateImg.split(',')
    }
  }
}
</script>

<style lang="less" scoped>
@import '~vux/src/styles/close';
.title {
  text-align: center;
  font-weight: bold;
  // background-color: #f6f6f6;
  padding: 10px 15px;
}
.content {
  padding: 10px 15px 5px;
}
.btn {
  height: 40px;
  text-align: center;
  position: fixed;
  bottom: 0;
  width: 100%;
  line-height: 40px;
  font-size: 16px;
  background-color: rgb(46, 132, 212);
  border-radius: 0 0 5px 5px;
  color: #fff;
}
</style>

