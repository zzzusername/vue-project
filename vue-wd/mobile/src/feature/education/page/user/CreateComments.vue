<template>
  <div>
    <group gutter="10px" label-width="4em" label-margin-right="1em">
      <x-input title="评语标题" v-model="commentsTitle" placeholder="请输入评语标题"></x-input>
      <popup-picker value-text-align="left" show-name title="评语类型" :data="commentsType" v-model="selectType" placeholder="请选择评语类型"></popup-picker>
      <!-- <popup-picker v-if="!isEdit" value-text-align="left" show-name title="目标班级" :data="classList" v-model="selectClass" placeholder="请选择目标班级"></popup-picker> -->
      <cell v-if="!isEdit" title="目标班级" value-align="left" :value="selectClass.name" @click.native="showClassPopu = !showClassPopu" is-link></cell>
      <cell v-else title="目标班级" value-align="left">
        <p style="color:#000">{{className}}</p>
      </cell>
    </group>
    <class-popu-picker :show="showClassPopu" @confirm="selectClassPicker" feature-code="PINGYU"></class-popu-picker>
    <detail-tabbar :actionLink="submit" :actions="actions"></detail-tabbar>
  </div>
</template>

<script>
import { Group, XInput, PopupPicker, Cell } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import ClassPopuPicker from '../../components/ClassPopuPicker'
import api from '../../api'
export default {
  components: {
    Group, XInput, PopupPicker, Cell, DetailTabbar, ClassPopuPicker
  },
  data() {
    return {
      actions: [{ name: '创建' }],
      commentsType: [[{ name: '周评语', value: '1' }, { name: '月评语', value: '2' }, { name: '学期评语', value: '3' }]],
      selectType: [],
      commentsTitle: '',
      classList: [],
      // selectClass: [],
      isEdit: false,
      className: '',
      showClassPopu: false,
      selectClass: {}
    }
  },
  mounted() {
    this.queryTeacherClassList((data) => {
      var list = []
      for (var i = 0; i < data.length; i++) {
        list.push({ name: data[i].className, value: String(data[i].classId) })
      }
      this.classList.push(list)
    })
    var commentPeriodId = this.$route.params.commentPeriodId
    if (commentPeriodId !== undefined && commentPeriodId !== null) {
      this.getCommentsInfo((data) => {
        this.isEdit = true
        this.actions = [{ name: '修改' }]
        this.commentsTitle = data.commentTitle
        this.selectType.push(String(data.commentType))
        this.className = data.className
      })
    }
  },
  methods: {
    selectClassPicker(val) {
      this.selectClass = val
    },
    submit() {
      // 跳转学生列表
      if (!this.isEdit) {
        if (this.commentsTitle === '') {
          this.tools.warnToast('标题不能为空')
          return
        } else if (this.selectType.length === 0) {
          this.tools.warnToast('评语类型不能为空', '150px')
          return
        } else if (this.selectClass.value === undefined || this.selectClass.value === null) {
          this.tools.warnToast('目标班级不能为空', '150px')
          return
        }
        this.createComments((data) => {
          this.$router.replace({ name: 'educationWriteComments', params: { commentPeriodId: data.commentPeriodId } })
        })
      } else {
        this.editCycleComment((data) => {
          this.$router.go(-1)
          this.tools.successToast('修改成功')
        })
      }
    },
    createComments(callback) {
      api.createCycleComments({ schoolId: this.$route.params.schoolId, classesId: this.selectClass.value, lessonId: null, commentTitle: this.commentsTitle, commentType: this.selectType[0] }, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    queryTeacherClassList(callback) {
      api.queryTeacherClassList({ schoolId: this.$route.params.schoolId, featureCode: 'PINGYU' }, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    getCommentsInfo(callback) {
      api.getCommentsInfo({ schoolId: this.$route.params.schoolId, commentPeriodId: this.$route.params.commentPeriodId }, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    editCycleComment(callback) {
      api.editCycleComment({ schoolId: this.$route.params.schoolId, commentPeriodId: this.$route.params.commentPeriodId, lessonId: null, commentTitle: this.commentsTitle, commentType: this.selectType[0] }, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    }
  }
}
</script>

<style>

</style>
