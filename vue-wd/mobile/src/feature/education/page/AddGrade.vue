<template>
  <div>
    <group gutter="0">
      <x-input title="年级名称" v-model="gradeName" :placeholder="'必填'"></x-input>
      <!-- <x-switch v-if="gradeId" title="是否为毕业班" v-model="isGraduation"></x-switch> -->
    </group>
    <detail-tabbar v-if="gradeId" :actionLink="save" :actions="actions" isHideMe=true></detail-tabbar>
    <detail-tabbar :actionLink="save" :actions="actions"></detail-tabbar>
  </div>
</template>

<script>
import { Group, XInput, XSwitch } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '../api'
export default {
  components: {
    Group, XInput, DetailTabbar, XSwitch
  },
  data () {
    return {
      gradeName: '',
      actions: [{name: '保存', code: 'save'}],
      gradeInfo: null,
      isGraduation: false
    }
  },
  computed: {
    gradeId() {
      return this.$route.params.gradeId
    },
    schoolId() {
      return this.$route.params.schoolId
    }
  },
  mounted() {
    if (this.gradeId) {
      this.actions = [{name: '删除年级', color: '#FF6D56', code: 'del'}, {name: '保存', code: 'modify'}]
      this.getInfo((info) => {
        this.gradeInfo = info
        this.gradeName = info.gradeName
        this.isGraduation = info.isFinish
      })
    }
  },
  methods: {
    save (key) {
      switch (key) {
        case 'save':
          this.addGrade()
          break
        case 'del':
          this.delGrade()
          break
        case 'modify':
          this.editGrade()
          break
      }
    },
    getInfo(callback) {
      api.getGradeInfo({schoolId: this.schoolId, gradeId: this.gradeId}, (data) => {
        callback(data)
      }, er => { this.error(er, '获取年级信息失败') })
    },
    addGrade() {
      api.addGrade({schoolId: this.$route.params.schoolId, gradeName: this.gradeName}, (data) => {
        this.tools.successToast('保存成功')
        this.$router.replace({name: 'educationGradeLeaderManage', params: {gradeId: data.gradeId}})
      }, er => {
        this.error(er, '保存失败')
      })
    },
    delGrade() {
      api.delGrade({schoolId: this.schoolId, gradeId: this.gradeId}, (data) => {
        this.tools.successToast('删除成功')
        this.$router.replace({name: 'educationClassManage'})
      }, (er) => { this.error(er, '删除失败') })
    },
    editGrade() {
      api.saveGrade({schoolId: this.schoolId, gradeId: this.gradeId, gradeName: this.gradeName}, (data) => {
        this.tools.successToast('修改成功')
        this.$router.go(-1)
      }, (er) => { this.error(er, '修改失败') })
    },
    error(er, hint) {
      if (er.toUser) {
        this.tools.warnToast(er.message)
        return
      }
      this.tools.warnToast(hint)
    }
  }
}
</script>

<style>

</style>
