<template>
  <div>
    <Group title="基础信息" label-width="5em" label-margin-right="0.5em" label-align="left">
      <cell value-align="left" is-link @click.native="editQuestionInfo">
        <span slot="after-title">问卷标题&nbsp;&nbsp;&nbsp;{{questionInfo.questionTitle}}</span>
        <span slot="inline-desc">截止时间&nbsp;&nbsp;&nbsp;{{questionInfo.endDate}}</span>
      </cell>
    </Group>
    <Group title="设置题目" v-if="list.length>0">
      <cell value-align="left" v-for="(item, index) in list" :key="index">
        <span slot="icon" class="iconfont icon-jiantoushang publick" @click="upClick(item, index)" v-if="list.length>1"></span>
        <span slot="icon" class="iconfont icon-jiantouxia publick distance" @click="downClick(item, index)" v-if="list.length>1"></span>
        <span slot="title" :style="{'width': windowWidth+'px', 'display': 'inline-block'}">{{(index+1) + '、'+ item.subjectTitle + '(' + editType(item.subjectType) + ')'}}</span>
        <span slot="child" class="btnstyle" style="background:rgb(46, 132, 212);" @click="changeQuestion(item, index)">修改</span>
        <span slot="child" class="btnstyle" style="margin-right:0;" @click="deleteQuestion(item, index)">删除</span>
      </cell>
    </Group>
    <div style="padding:10px 20px;box-sizing: border-box;">
      <x-button type="primary" @click.native="addSubject">增加题目</x-button>
    </div>
    <div v-transfer-dom>
      <confirm v-model="showConfirm" title="操作提示" @on-confirm="onConfirm">
        <p style="text-align:center;color:rgb(255, 109, 86);">{{textMessage}}</p>
      </confirm>
    </div>
    <detail-tabbar :actionLink="submit" :actions="actions" :isHideMe="true"></detail-tabbar>
  </div>
</template>
<script>
import { Group, Cell, XButton, Confirm, TransferDomDirective as TransferDom } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '../api'
export default {
  directives: {
    TransferDom
  },
  components: {
    Group, Cell, DetailTabbar, XButton, Confirm
  },
  data () {
    return {
      questionInfo: {},
      title: null,
      dateTime: null,
      list: [],
      actions: [
        {
          name: '预览',
          code: 'preview',
          color: 'rgb(46, 132, 212)'
        },
        {
          name: '完成并发布',
          code: 'publish'
        }
      ],
      showConfirm: false,
      textMessage: null,
      item: null,
      index: null,
      windowWidth: 0,
      type: null
    }
  },
  mounted () {
    this.windowWidth = window.innerWidth - 152
    api.questionSimplenessInfo({schoolId: this.$route.params.schoolId, questionId: this.$route.params.questionId}, (data) => {
      data.endDate = this.tools.formateTime(data.endDate, 'YYYY-MM-DD HH:mm')
      this.questionInfo = data
    }, (er) => {
      if (er.toUser !== undefined && er.toUser) {
        this.tools.warnToast(er.message)
      }
    })
    api.selectQuestionSubjecListToManage({schoolId: this.$route.params.schoolId, questionId: this.$route.params.questionId, rowStart: 0, rowCount: 99999}, (data) => {
      this.list = data
    }, (er) => {
      if (er.toUser !== undefined && er.toUser) {
        this.tools.warnToast(er.message)
      }
    })
  },
  methods: {
    upClick (item, index) {
      var sortArr = this.list.slice(0)
      if (index <= 0) {
        sortArr.splice(index, 1)
        sortArr.push(item)
      } else {
        sortArr.splice(index, 1)
        sortArr.splice(index - 1, 0, item)
      }
      this.$nextTick(function () {
        this.moveList(sortArr)
      })
    },
    downClick (item, index) {
      var sortArr = this.list.slice(0)
      if (index === sortArr.length - 1) {
        sortArr.splice(index, 1)
        sortArr.unshift(item)
      } else {
        sortArr.splice(index, 1)
        sortArr.splice(index + 1, 0, item)
      }
      this.$nextTick(function () {
        this.moveList(sortArr)
      })
    },
    moveList (sortArr) {
      var newArr = []
      sortArr.forEach((element) => {
        newArr.push(element.subjectId)
      })
      api.orderQuestionSubject({schoolId: this.$route.params.schoolId, questionId: this.$route.params.questionId, subjectIds: newArr}, (data) => {
        this.list = sortArr
        this.tools.successToast('移动成功')
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        } else {
          this.tools.warnToast('移动失败，请稍后再试')
        }
      })
    },
    editType (item) {
      switch (item) {
        case 1:
          return '文本'
        case 2:
          return '单选'
        case 3:
          return '多选'
        case 4:
          return '评分'
      }
    },
    onConfirm () {
      if (this.type === 'delete') {
        api.deleteQuestionSubject({schoolId: this.$route.params.schoolId, questionId: this.$route.params.questionId, subjectId: this.item.subjectId}, (data) => {
          this.tools.successToast('删除成功')
          this.list.splice(this.index, 1)
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.tools.warnToast(er.message)
          } else {
            this.tools.wranToast('删除失败')
          }
        })
      } else {
        this.publish()
      }
    },
    deleteQuestion (item, index) {
      this.type = 'delete'
      this.showConfirm = true
      this.textMessage = '您确定删除此问题吗？'
      this.item = item
      this.index = index
    },
    changeQuestion (item) {
      this.$router.push({name: 'questionEditSubject', params: {questionId: this.$route.params.questionId, subjectId: item.subjectId}})
    },
    submit (code) {
      if (code === 'preview') {
        this.$router.push({name: 'questionDetail', params: {questionId: this.questionInfo.questionId}})
      } else {
        this.type = 'publish'
        this.showConfirm = true
        this.textMessage = '您确定发布此问卷吗？一旦发布无法修改。'
      }
    },
    publish () {
      if (this.list.length <= 0) {
        this.tools.warnToast('请增加题目')
        return
      }
      api.publishQuestion({schoolId: this.$route.params.schoolId, questionId: this.$route.params.questionId}, (data) => {
        this.tools.successToast('发布成功')
        this.$router.replace({name: 'questionManageViewList'})
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        } else {
          this.tools.warnToast('发布失败')
        }
      })
    },
    addSubject () {
      this.$router.push({name: 'questionAddSubject', params: {questionId: this.$route.params.questionId}})
    },
    editQuestionInfo () {
      this.$router.push({name: 'questionEditCreatedForm', params: {questionId: this.$route.params.questionId}})
    }
  }
}
</script>
<style>
.publick{
  color: #fff;
  padding:5px 2px;
  box-sizing: border-box;
  background: rgb(46, 132, 212);
  border-radius: 5px;
  font-size: 12px;
}
.distance{
  margin: 0 4px;
}
.btnstyle{
  background:rgb(255, 109, 86);
  padding: 2px 3px;
  margin-right: 5px;
  border-radius: 5px;
  color:#fff;
  font-size: 12px;
  text-align: center;
}
</style>

