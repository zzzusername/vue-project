<template>
  <!-- <div :style="{'height': scrollerHeight+'px', 'position': 'relative'}"> -->
    <div>
    <!-- <scroller> -->
      <div v-if="detail.questionImage" class="question-cover" :style="{'background-image':'url('+tools.cdn(detail.questionImage)+')', 'height': coverHeight + 'px'}"></div>
      <group gutter="0">
        <cell>
          <p slot="title"><strong>{{detail.questionTitle}}</strong></p>
          <p slot="inline-desc"><span>发布者: {{detail.teacherName}}</span><br><span>截止日期: {{tools.formateTime(detail.endDate, 'YYYY/MM/DD')}}</span>
          <span v-if="detail.className"><br>目标班级：{{detail.className}}</span>
          </p>
        </cell>
      </group>
      <group gutter="2px">
        <p style="padding: 10px 15px;font-size: 15px;">{{detail.questionDes}}</p>
        <div v-for="(item, index) in detail.subject" :key="index">
          <p style="padding: 3px 10px;color: #1296db;marginTop: 20px">{{item.subjectTitle}}&nbsp;<span>{{(item.subjectType == 2 || item.subjectType == 4)?'(单选)': item.subjectType == 3?item.maxItem==null?'(多选)':'(多选, 最多选'+ item.maxItem +'项)':'(填空)'}}</span>&nbsp;<span v-if="item.isRequired" style="color: red">*</span></p>
          <form v-if="item.subjectType == 2 || item.subjectType == 4">
            <div class="radio-input" v-for="(option, i) in item.item" :key="i" style="padding:10px 15px">
              <input type="radio" :name="item.subjectId" :value="option.itemId" :id="option.itemId" v-model="item.check">
              <label :for="option.itemId">{{option.itemNo+'、'+option.itemDesc}}</label>
              <input class="input-style" v-if="option.isFill" type="text" v-model="item.text" maxlength="200">
              <br>
            </div>
          </form>
          <form v-else-if="item.subjectType == 3">
            <div v-for="(option, i) in item.item" :key="i" style="padding:10px 15px">
              <input ref="checkboxitem" type="checkbox" :value="option.itemId" :id="option.itemId" v-model="item.check" @change="(e) => {changeCheck(item, e)}">
              <label :for="option.itemId">{{option.itemNo+'、'+option.itemDesc}}</label>
              <input class="input-style" v-if="option.isFill" type="text" v-model="option.text"  maxlength="200">
              <br>
            </div>
          </form>
          <div v-else-if="item.subjectType == 1" style="padding:10px 15px">
            <input class="input-style" type="text" v-model="item.text" maxlength="200">
          </div>
          <!-- <checklist v-if="item.subjectType == 2 || item.subjectType == 3" :max="item.subjectType == 2?1:item.subjectType == 3?item.maxItem:1" :required="item.isRequired" :options="item.checklist" v-model="item.select"></checklist> -->
          <!-- <x-input style="border: 1px solid #999; margin: 5px 15px;border-radius: 5px;" v-else-if="item.subjectType == 1" v-model="item.select"></x-input> -->
        </div>
      </group>
    <!-- </scroller> -->
    <detail-tabbar :actionLink="submit" :actions="actions"></detail-tabbar>
  </div>
</template>

<script>
import { Group, Cell, Checklist, XInput, AlertPlugin } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '../api'
import Vue from 'vue'
Vue.use(AlertPlugin)

export default {
  components: {
    Group, Cell, Checklist, XInput, DetailTabbar
  },
  data() {
    return {
      detail: {},
      coverHeight: 0,
      scrollerHeight: 0,
      actions: [],
      beforeDestroy: false
    }
  },
  mounted() {
    this.coverHeight = window.innerWidth * 0.5
    this.scrollerHeight = window.innerHeight - 50
    let schoolId = this.$route.params.schoolId
    let studentId = this.$route.params.studentId
    let questionId = this.$route.params.questionId
    api.getQuestionaireInfo({schoolId, studentId, questionId}, (detail) => {
      if (detail.isAnswer) {
        // 跳转已答卷详情
        if (this.tools.isNull(studentId)) {
          this.$router.replace({name: 'questionAnswerDetail', params: {questionId: questionId}})
        } else {
          this.$router.replace({name: 'questionParentAnswerDetail', params: {studentId: studentId, questionId: questionId}})
        }
        return
      } else if (detail.questionPublish === false) {
        this.actions = null
      } else {
        if (detail.isFinish === true) {
          this.$vux.alert.show({
            title: '提示',
            content: '此问卷已经结束！'
          })
        } else if (!this.tools.isNull(studentId) && detail.answerUserType === 2) {
          // 家长不能答卷 提示
          this.$vux.alert.show({
            title: '提示',
            content: '此问卷是学生问卷，家长不能参与！'
          })
        } else {
          // 判断是否有答卷资格
          this.localStorage.getUserInfo({schoolId: this.$route.params.schoolId}, (data) => {
            if ((detail.questionType === 1 || detail.questionType === 3) && (data.isMaster === true || data.isTeacher === true) && this.tools.isNull(studentId)) {
              // 区分教师和学生的身份，教师不能答学生的问卷
              this.actions = null
            } else if ((detail.questionType === 1 || detail.questionType === 3) && data.isStudent === true && detail.answerUserType === 3) {
              // 班级问卷只允许家长答卷，学生不允许 提示
              this.$vux.alert.show({
                title: '提示',
                content: '此问卷是家长问卷，学生不能参与！'
              })
            } else if (detail.questionType === 2 && data.isMaster === false && data.isTeacher === false && data.isParent === true) {
              // 家长不能答教师的问卷
              this.actions = null
            } else if (detail.questionType === 2 && data.isMaster === false && data.isTeacher === false && data.isStudent === true) {
              // 学生不能答教师的问卷
              this.actions = null
            } else {
              this.actions = [{name: '提交', code: 'submit'}]
            }
          }, () => {})
        }
      }
      this.detail = detail
      this.detail.subject.forEach(element => {
        if (element.subjectType === 2) {
          element.check = null
        } else if (element.subjectType === 3) {
          element.check = []
          element.click = null
          element.clickNum = 0
        } else if (element.subjectType === 1) {
        } else if (element.subjectType === 4) {
          element.check = null
          element.item = [
            {isFill: false, itemDesc: '非常满意', itemId: 5, itemNo: 'A', subjectId: element.subjectId},
            {isFill: false, itemDesc: '满意', itemId: 4, itemNo: 'B', subjectId: element.subjectId},
            {isFill: false, itemDesc: '一般', itemId: 3, itemNo: 'C', subjectId: element.subjectId},
            {isFill: false, itemDesc: '不满意', itemId: 2, itemNo: 'D', subjectId: element.subjectId},
            {isFill: false, itemDesc: '非常不满意', itemId: 1, itemNo: 'E', subjectId: element.subjectId}
          ]
        }
      })
    }, (er) => {
      if (er.toUser) {
        this.tools.warnToast(er.message)
      }
    })
  },
  methods: {
    submit(key) {
      if (key !== 'submit') {
        return
      }
      let data = []
      let list = this.detail.subject
      for (let index = 0; index < list.length; index++) {
        const element = list[index]
        if (element.subjectType === 1) {
          if ((element.text === undefined || element.text === null) && element.isRequired) {
            this.tools.warnToast('请完成题目<' + element.subjectTitle + '>')
            return
          }
          data.push({subjectId: element.subjectId, valueDesc: element.text})
        } else if (element.subjectType === 2) {
          if ((element.check === undefined || element.check === null) && element.isRequired) {
            this.tools.warnToast('请完成题目<' + element.subjectTitle + '>')
            return
          }
          element.item.forEach(item => {
            if (element.check === item.itemId) {
              if (item.isFill) {
                data.push({subjectId: element.subjectId, valueItemDesc: element.text == null ? '' : element.text, valueItemId: element.check})
              } else {
                data.push({subjectId: element.subjectId, valueItemId: element.check})
              }
            }
          })
        } else if (element.subjectType === 3) {
          if (element.check.length === 0 && element.isRequired) {
            this.tools.warnToast('请完成题目<' + element.subjectTitle + '>')
            return
          }
          element.item.forEach(item => {
            element.check.forEach(check => {
              if (check === item.itemId) {
                if (item.isFill) {
                  data.push({subjectId: element.subjectId, valueItemDesc: item.text === undefined ? '' : item.text, valueItemId: check})
                } else {
                  data.push({subjectId: element.subjectId, valueItemId: check})
                }
              }
            })
          })
        } else if (element.subjectType === 4) {
          if ((element.check === undefined || element.check === null) && element.isRequired) {
            this.tools.warnToast('请完成题目<' + element.subjectTitle + '>')
            return
          }
          data.push({subjectId: element.subjectId, valueScore: element.check})
        }
      }
      // console.log(data)
      let schoolId = this.$route.params.schoolId
      let studentId = this.$route.params.studentId
      let questionId = this.$route.params.questionId
      api.submitQuestionnaire({schoolId, questionId, studentId, items: data}, (data) => {
        this.tools.successToast('提交成功')
        this.goBack()
      }, (er) => {
        if (er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    changeCheck(item, e) {
      if (item.maxItem !== null && item.maxItem < item.check.length) {
        if (e.target.checked) {
          item.check.pop()
          e.target.checked = false
        }
      }
    },
    goBack () {
      if (this.$store.state.canGoBack) {
        this.$router.back()
        setTimeout(() => {
          if (!this.beforeDestroy) {
            if (this.tools.isNull(this.$route.params.schoolId)) {
              this.$router.push({name: 'index'})
            } else {
              this.$router.push({name: 'schoolIndex', params: {schoolId: this.$route.params.schoolId}})
            }
          }
        }, 200)
      } else {
        if (this.tools.isNull(this.$route.params.schoolId)) {
          this.$router.push({name: 'index'})
        } else {
          this.$router.push({name: 'schoolIndex', params: {schoolId: this.$route.params.schoolId}})
        }
      }
    }
  },
  beforeDestroy () {
    this.beforeDestroy = true
  },
  watch: {
    detail: {
      handler(curval, oval) {
        // this.detail = JSON.parse(JSON.stringify(curval))
      },
      deep: true
    }
  }
}
</script>
<style scoped>
.question-cover {
  width: 100vw;
  display: block;
  margin-right: 10px;
  background-position: center center;
  background-size: cover;
  border-style:none;
  border-width:0;
}
.input-style{
  width: 98%;
  border: 1px solid #999;
  border-radius: 3px;
  padding: 5px 2px;
  margin: 5px 0;
  font-size: 17px;
  outline: none;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
}
input[type=radio],input[type=checkbox]  {
	display: inline-block;
	vertical-align: middle;
	width: 24px;
	height: 24px;
	/* margin-left: 5px; */
	-webkit-appearance: none;
	background-color: transparent;
	border: 0;
	outline: 0 !important;
	line-height: 20px;
	color: #d8d8d8;
}
input[type=radio]:after  {
	content: "";
	display:block;
	width: 20px;
	height: 20px;
	border-radius: 50%;
	text-align: center;
	line-height: 14px;
	font-size: 16px;
	color: #fff;
	border: 2px solid #ddd;
	background-color: #fff;
	box-sizing:border-box;
}

input[type=checkbox]:after  {
	content: "";
	display:block;
	width: 20px;
	height: 20px;
  text-align: center;
  border-radius: 50%;
	line-height: 14px;
	font-size: 16px;
	color: #fff;
	border: 2px solid #ddd;
	background-color: #fff;
	box-sizing:border-box;
}
input[type=checkbox]:checked:after  {
  content: "L";
	transform:matrix(-0.766044,-0.642788,-0.642788,0.766044,0,0);
	-webkit-transform:matrix(-0.766044,-0.642788,-0.642788,0.766044,0,0);
	border-color: #A2D268;
	background-color: #A2D268;
}

input[type=radio]:checked:after  {
	content: "L";
	transform:matrix(-0.766044,-0.642788,-0.642788,0.766044,0,0);
	-webkit-transform:matrix(-0.766044,-0.642788,-0.642788,0.766044,0,0);
	border-color: #A2D268;
	background-color: #A2D268;
}
</style>
