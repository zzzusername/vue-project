<template>
  <div>
    <group gutter="5px">
      <cell>
        <p slot="title">{{detail.questionTitle}}</p>
        <p slot="inline-desc">截止日期: {{tools.formateTime(detail.endDate, 'YYYY/MM/DD HH:mm')}}</p>
      </cell>
      <p style="font-size: 14px;margin: 0px 15px 10px;color: #a2a2a2">注：交叉统计结果只针对除填空类型之外的问卷题目进行组合</p>
    </group>
    <group title="选择统计项－－最多可选择三种问卷题目">
      <p style="font-size: 14px;text-align: right;padding: 5px 15px;"><span style="color: #1296db;" @click="showQuestionPop = !showQuestionPop">选择问卷题目</span></p>
      <cell v-for="(item, index) in condition" :key="index" :id="index==0||condition.length==1?'item-cell':''">
        <p slot="title"><strong style="color:red">{{index + 1}}</strong>&nbsp;<span>{{item.name}}</span></p>
        <p style="font-size: 14px;color: #1296db" @click="deleteCondition(item)">删除</p>
      </cell>
      <p style="font-size: 14px;margin: 0px 15px 10px;color: #a2a2a2">说明：通过选择的先后顺序决定主次统计项；</p>
    </group>
    <cell title="交叉统计结果" style="padding: 5px 15px;color: #a2a2a2;">
      <p style="font-size: 14px;"><span style="color: #1296db;" @click="generateResult">生成统计结果</span></p>
    </cell>
    <!-- <group gutter="0"> -->
      <p style="font-size: 14px;text-align: left;padding: 5px 15px;background-color: #fff" v-if="answerCount">共{{answerCount}}人参与此问卷</p>
      <div v-for="(item, index) in previewList" :key="index" style="margin-top: 5px;background-color: #fff;">
        <p style="font-size: 14px;text-align: left;padding: 5px 15px;color: #1296db;" @click="skipDetail(item.param)">查看详情</p>
        <cell-form-preview :list="item.previews"></cell-form-preview>
      </div>
    <!-- </group> -->
    <!-- popu -->
    <div>
      <popup v-model="showQuestionPop" height="80%">
        <div v-if="showQuestionPop">
          <div :style="{'position': 'relative', 'height': popHeight + 'px'}">
            <scroller>
              <p style="padding: 10px; color: #a2a2a2;font-size: 14px;color: #1296db">请按主次顺序选择1～3个选项</p>
              <checklist :max="questions.length > 3 ? 3 : questions.length" style="backgroundColor: #fff" :options="questions" v-model="selectQuestion"></checklist>
            </scroller>
          </div>
          <div style="display:flex;position: fixed;width: 100vw;bottom: 0;height: 50px;">
            <div style="flex: 1;backgroundColor:rgb(230, 230, 230)" @click="showQuestionPop = false">
              <p style="line-height: 50px; textAlign: center;">关闭</p>
            </div>
            <div style="flex: 1;backgroundColor: #8ebf52" @click="confirmQuestion">
              <p style="line-height: 50px; textAlign: center;color: #fff;">确定</p>
            </div>
          </div>
        </div>
      </popup>
    </div>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import { Group, Cell, XInput, CellFormPreview, Popup, Checklist, Badge } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '../api'
export default {
  components: {
    Group, Cell, XInput, CellFormPreview, Popup, Checklist, DetailTabbar, Badge
  },
  data() {
    return {
      schoolId: this.$route.params.schoolId,
      questionId: this.$route.params.questionId,
      detail: {},
      previewList: [],
      showQuestionPop: false,
      popHeight: 0,
      questions: [],
      selectQuestion: [],
      condition: [],
      answerCount: 0
    }
  },
  mounted() {
    this.popHeight = window.innerHeight * 0.8 - 50
    api.questionSimplenessInfo({schoolId: this.schoolId, questionId: this.questionId}, (data) => {
      this.detail = data
    }, (er) => {
      if (er.toUser) {
        this.tools.warnToast(er.message)
      }
    })
    this.queryQuestions()
  },
  methods: {
    skipDetail(val) {
      let obj = {type: 'much'}
      for (let index = 0; index < this.condition.length; index++) {
        const element = this.condition[index]
        if (index === 0) {
          obj.subjectIdOne = element.id
        } else if (index === 1) {
          obj.subjectIdTwo = element.id
        } else {
          obj.subjectIdThree = element.id
        }
      }
      Object.assign(obj, val)
      this.$router.push({name: 'questionUserList', params: {questionId: this.questionId}, query: obj})
    },
    generateResult() {
      if (this.condition.length === 0) {
        this.tools.warnToast('请选择需要统计的问卷题目')
        return
      }
      let subjectIdOne
      let subjectIdTwo
      let subjectIdThree
      for (let index = 0; index < this.condition.length; index++) {
        const element = this.condition[index]
        if (index === 0) {
          subjectIdOne = element.id
        } else if (index === 1) {
          subjectIdTwo = element.id
        } else {
          subjectIdThree = element.id
        }
      }
      api.crossStatisticsResult({schoolId: this.schoolId, questionId: this.questionId, subjectIdOne, subjectIdTwo, subjectIdThree}, (data) => {
        this.answerCount = data.answerCount
        let scoreText = ['非常满意', '满意', '一般', '不满意', '非常不满意']
        scoreText.reverse()
        data.answers.forEach(element => {
          let oneText = element.subjectTypeOne === 4 ? scoreText[element.subjectOneItemId - 1] : element.subjectOneItemDesc
          let twoText = element.subjectTypeTwo === 4 ? scoreText[element.subjectTwoItemId - 1] : element.subjectTwoItemDesc
          let threeText = element.subjectTypeThree === 4 ? scoreText[element.subjectThreeItemId - 1] : element.subjectThreeItemDesc
          let title = '1=' + oneText
          let param = {subjectValueOne: element.subjectOneItemId}
          if (twoText !== null) {
            title += ' >> 2=' + twoText
            param.subjectValueTwo = element.subjectTwoItemId
          }
          if (threeText !== null) {
            title += ' >> 3=' + threeText
            param.subjectValueThree = element.subjectThreeItemId
          }
          this.previewList.push({param: param, previews: [{label: title, value: ''}, {label: '人数', value: element.answerCount}, {label: '百分比', value: element.pct + '%'}]})
        })
      }, (er) => {
        if (er.toUser) {
          this.tool.warnToast(er.message)
        }
      })
    },
    confirmQuestion() {
      this.condition.splice(0, this.condition.length)
      this.selectQuestion.forEach(element => {
        this.condition.push(JSON.parse(element))
      })
      this.showQuestionPop = false
    },
    deleteCondition(item) {
      for (let index = 0; index < this.condition.length; index++) {
        const element = this.condition[index]
        if (element.id === item.id) {
          this.condition.splice(index, 1)
          this.selectQuestion.splice(index, 1)
        }
      }
    },
    queryQuestions() {
      api.selectQuestionSubjecListToManage({schoolId: this.schoolId, questionId: this.questionId, rowStart: 0, rowCount: 999}, (data) => {
        data.forEach(element => {
          if (element.subjectType !== 1) {
            this.questions.push({key: JSON.stringify({id: element.subjectId, name: element.subjectTitle}), value: element.subjectTitle})
          }
        })
      }, (er) => {
        if (er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    }
  },
  watch: {
    condition: {
      handler(curval, oval) {
        this.previewList.splice(0, this.previewList.length)
      },
      deep: true
    }
  }
}
</script>

<style>
#item-cell::before {
  left: 0;
}
</style>
