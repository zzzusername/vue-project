<template>
  <div>
    <Group title="基础设置" label-width="5em" label-margin-right="1em" label-align="left">
      <x-input title="题目标题" v-model="subjectTitle" placeholder="请输入题目标题"></x-input>
      <x-switch title="是否必填" v-model="isRequired"></x-switch>
      <selector title="题目类型" :options="option" v-model="subjectType" placeholder="请选择题目类型"></selector>
      <selector title="最多可选项" v-if="subjectType === '3'" :options="list" v-model="maxItem" placeholder="请选择最多可选项"></selector>
    </Group>
    <Group title="答案设置" v-if="subjectType === '2' || subjectType === '3'">
      <x-input v-for="(item, index) in lists" :key="index" v-model="item.itemDesc" placeholder="请填写答案" :show-clear="false">
        <span slot="label">{{sortList[index]}}、</span>
        <span slot="right" class="button_color" v-bind:class="{change_color: item.isFill}" @click="isFill(item, index)">可填空</span>
        <span slot="right" style="background:rgb(255, 109, 86);" class="button_color" @click="deleteQuestion(item, index)" v-if="lists.length > 2">删除</span>
      </x-input>
    </Group>
    <x-button mini type="primary" style="float:right;margin:10px 10px 10px 0;" @click.native="addQuestion" v-if="subjectType === '2' || subjectType === '3'">增加选项</x-button>
    <detail-tabbar :actionLink="save" :actions="actions"></detail-tabbar>
  </div>
</template>
<script>
import { Group, XSwitch, XInput, CheckIcon, PopupPicker, Selector, XButton } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '../api'
export default {
  components: {Group, DetailTabbar, XSwitch, XInput, CheckIcon, PopupPicker, Selector, XButton},
  data () {
    return {
      actions: [{name: '保存', code: 'save'}],
      subjectTitle: null,
      isRequired: true,
      list: [
        {key: '0', value: '无限制'},
        {key: '1', value: '1项'},
        {key: '2', value: '2项'},
        {key: '3', value: '3项'},
        {key: '4', value: '4项'}
      ],
      maxItem: null,
      subjectType: null,
      option: [
        {key: '1', value: '文本'},
        {key: '2', value: '单选'},
        {key: '3', value: '多选'},
        {key: '4', value: '评分'}
      ],
      lists: [
        {
          itemDesc: null,
          isFill: false
        },
        {
          itemDesc: null,
          isFill: false
        },
        {
          itemDesc: null,
          isFill: false
        },
        {
          itemDesc: null,
          isFill: false
        }
      ],
      sortList: [
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
      ]
    }
  },
  watch: {
    lists (newLists, old) {
      this.list = []
      for (let i = 0; i < newLists.length + 1; i++) {
        if (i === 0) {
          let item1 = {
            key: i,
            value: '无限制'
          }
          this.list.push(item1)
        } else {
          let item2 = {
            key: i,
            value: i + '项'
          }
          this.list.push(item2)
        }
      }
      console.log(newLists)
    },
    subjectType (newSubjectType, old) {
      if (newSubjectType !== '3') {
        this.maxItem = null
      }
    }
  },
  mounted () {
    if (this.$route.params.subjectId) {
      this.actions = [{name: '修改并保存', code: 'edit'}]
      api.questionSubjectInfo({schoolId: this.$route.params.schoolId, questionId: this.$route.params.questionId, subjectId: this.$route.params.subjectId}, (data) => {
        this.subjectTitle = data.subject.subjectTitle
        this.isRequired = data.subject.isRequired
        this.subjectType = data.subject.subjectType.toString()
        if (data.subject.maxItem !== null && data.subject.maxItem !== undefined) {
          this.maxItem = data.subject.maxItem.toString()
        } else {
          this.maxItem = 0
        }
        var newArr = []
        data.item.forEach((element) => {
          var strip = {
            itemDesc: element.itemDesc,
            isFill: element.isFill
          }
          newArr.push(strip)
        })
        this.lists = newArr
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    }
  },
  methods: {
    isFill (item, index) {
      for (let i = 0; i < this.lists.length; i++) {
        if (index !== i) {
          if (this.lists[i].isFill) {
            this.lists[i].isFill = !this.lists[i].isFill
          }
        }
      }
      this.lists[index].isFill = !this.lists[index].isFill
    },
    deleteQuestion (item, index) {
      this.lists.splice(index, 1)
    },
    addQuestion () {
      let item = {
        itemDesc: null,
        isFill: false
      }
      this.lists.push(item)
    },
    save (code) {
      for (let i = 0; i < this.lists.length; i++) {
        this.lists[i].itemNo = this.sortList[i]
      }
      if (!this.subjectTitle) {
        this.tools.warnToast('请填写题目标题', '160px')
        return
      }
      if (!this.subjectType) {
        this.tools.warnToast('请选择题目类型', '160px')
        return
      } else {
        if (this.subjectType === '1' || this.subjectType === '4') {
          this.lists = []
        } else if (this.subjectType === '2') {
          for (let i = 0; i < this.lists.length; i++) {
            if (!this.lists[i].itemDesc) {
              this.tools.warnToast('请填写答案' + this.lists[i].itemNo, '160px')
              return
            }
          }
        } else if (this.subjectType === '3') {
          for (let i = 0; i < this.lists.length; i++) {
            if (!this.lists[i].itemDesc) {
              this.tools.warnToast('请填写答案' + this.lists[i].itemNo, '160px')
              return
            }
          }
          if (this.maxItem !== null && this.maxItem !== undefined) {
            if (parseInt(this.maxItem) === 0) {
              this.maxItem = null
            } else {
              this.maxItem = this.maxItem
            }
          } else {
            this.tools.warnToast('请选择最多可选项', '160px')
            return
          }
        }
      }
      if (code === 'save') {
        api.addQuestionSubject({schoolId: this.$route.params.schoolId, questionId: this.$route.params.questionId, subjectId: this.$route.params.subjectId, subjectTitle: this.subjectTitle, subjectType: this.subjectType, maxItem: this.maxItem, isRequired: this.isRequired, item: this.lists, type: 'save'}, (data) => {
          this.tools.successToast('保存成功')
          this.$router.go(-1)
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.tools.warnToast(er.message)
          } else {
            this.ttols.warnToast('保存失败')
          }
        })
      } else {
        api.addQuestionSubject({schoolId: this.$route.params.schoolId, questionId: this.$route.params.questionId, subjectId: this.$route.params.subjectId, subjectTitle: this.subjectTitle, subjectType: this.subjectType, maxItem: this.maxItem, isRequired: this.isRequired, item: this.lists, type: 'edit'}, (data) => {
          this.tools.successToast('修改成功')
          this.$router.go(-1)
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.tools.warnToast(er.message)
          } else {
            this.ttols.warnToast('修改失败')
          }
        })
      }
    }
  }
}
</script>
<style>
.button_color{
  padding: 2px 3px;
  margin-right: 5px;
  border-radius: 5px;
  color:#fff;
  font-size: 14px;
  background:#999;
  font-size: 12px;
}
.change_color{
  background:rgb(46, 132, 212);
}
</style>

