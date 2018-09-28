<template>
  <div>
    <x-dialog v-model="showDialog" :dialog-style="{'text-align': 'left', 'min-height': '60vh', 'border-radius': '8px'}" hide-on-blur>
      <div>
        <scroller>
          <cell :title="'['+detail.studentName+'] '+detail.projectName" style="background:#f6f6f6" :value="getValue() + '分'">
            <p style="color:#FC5355;">{{detail.isRemove ? '已消分' : getValue() + '分'}}</p>
          </cell>
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
      <div class="btn" v-if="!detail.isRemove" @click="() => {showConfirm=true, showDialog = false}">消 分</div>
    </x-dialog>
    <confirm v-model="showConfirm"
      title="提示"
      @on-cancel="() => {showConfirm=false, showDialog=true}"
      @on-confirm="onConfirm">
        <p style="text-align:center;">您确定为【{{detail.studentName}}】消分吗</p>
    </confirm>
  </div>
</template>

<script>
import api from '../api'
import {XDialog, Group, Cell, Confirm} from 'vux'
export default {
  components: {
    XDialog, Group, Cell, Confirm
  },
  props: {
    show: Boolean,
    detail: Object
  },
  data() {
    return {
      showDialog: false,
      showConfirm: false
    }
  },
  watch: {
    show(cval, oval) {
      console.log(cval)
      this.showDialog = cval
    },
    showDialog(cval, oval) {
      if (!cval) {
        this.$emit('close', cval)
      }
    }
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
    },
    onConfirm() {
      api.clearStudentMorlScore({schoolId: this.$route.params.schoolId, evaluateId: this.detail.evaluateId}, (data) => {
        this.tools.successToast('消分成功')
        this.showDialog = false
        this.$emit('clear-score-success', this.detail.evaluateId)
      }, (er) => {
        if (er.toUser) {
          this.tools.warnToast(er.message)
          return
        }
        this.tools.warnToast('消分失败')
      })
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

