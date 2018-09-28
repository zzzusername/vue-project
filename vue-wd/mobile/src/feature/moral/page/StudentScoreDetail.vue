<template>
  <div v-if="detail.projectName" style="background-color: #fff;min-height: 100vh">
    <cell style="font-size: 16px;" :title="detail.projectName+'['+detail.itemName+']'" :value="getValue() + '分'">
      <p slot="inline-desc">{{tools.formateTime(detail.evaluateDate, 'YYYY-MM-DD HH:mm')}}</p>
    </cell>
    <div style="margin: 5px 15px;font-size: 16px;">
      <!-- <p>{{detail.projectName + '[' + detail.itemName + ']'}}: <span>{{getValue() + '分'}}</span></p> -->
       <p>{{detail.evaluateDesc}}</p>
       <img v-if="detail.evaluateImg" style="width: 100%" v-for="(item, index) in getImgs()" :key="index" :src="tools.cdn(item)"/>
    </div>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import DetailTabbar from '@/components/DetailTabbar.vue'
import {Group, Cell} from 'vux'
import api from '../api'
export default {
  components: {
    DetailTabbar, Group, Cell
  },
  data() {
    return {
      detail: {}
    }
  },
  computed: {
    schoolId() {
      return this.$route.params.schoolId
    },
    studentId() {
      return this.$route.params.studentId
    },
    evaluateId() {
      return this.$route.params.evaluateId
    }
  },
  mounted() {
    api.getStudentScoreDetail({schoolId: this.schoolId, studentId: this.studentId, evaluateId: this.evaluateId}, data => {
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
      if (!this.detail.isRemove) {
        if (this.detail.projectType === 1) {
          return '+' + this.detail.evaluateStore
        } else {
          return '-' + this.detail.evaluateStore
        }
      } else {
        return '已消'
      }
    },
    getImgs() {
      if (this.detail.evaluateImg) {
        return this.detail.evaluateImg.split(',')
      }
    }
  }
}
</script>

<style>

</style>
