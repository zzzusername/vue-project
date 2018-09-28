<template>
    <div>
      <div v-if="detail.questionImage" class="question-cover" :style="{'background-image':'url('+tools.cdn(detail.questionImage)+')', 'height': coverHeight + 'px'}"></div>
      <group gutter="0">
        <cell>
          <p slot="title"><strong>{{detail.questionTitle}}</strong></p>
          <p slot="inline-desc"><span>发布者: {{detail.teacherName}}</span><br><span>截止日期: {{tools.formateTime(detail.endDate, 'YYYY/MM/DD')}}</span></p>
        </cell>
      </group>
      <group gutter="2px">
        <p style="padding: 10px 15px;font-size: 15px;">{{detail.questionDes}}</p>
        <div v-for="(item, index) in detail.subjects" :key="index">
          <p style="padding: 3px 10px;color: #1296db;marginTop: 20px">{{item.subjectTitle}}&nbsp;<span>{{(item.subjectType == 2 || item.subjectType == 4)?'(单选)': item.subjectType == 3?item.maxItem==null?'(多选)':'(多选, 最多选'+ item.maxItem +'项)':'(文本)'}}</span>&nbsp;<span v-if="item.isRequired" style="color: red">*</span></p>
          <form v-if="item.subjectType == 2 || item.subjectType == 4">
            <div v-for="(option, i) in item.items" :key="i" style="padding:10px 15px">
              <input disabled="true" type="radio" :name="item.subjectId" :value="option.itemId" :id="option.itemId" v-model="item.check">
              <label :for="option.itemId">{{option.itemNo+'、'+option.itemDesc}}</label><br v-if="option.isFill">
              <span class="input-style" v-if="option.isFill">{{item.text}}</span>
              <br>
            </div>
          </form>
          <form v-else-if="item.subjectType == 3">
            <div v-for="(option, i) in item.items" :key="i" style="padding:10px 15px">
              <input disabled="true" ref="checkboxitem" type="checkbox" :value="option.itemId" :id="option.itemId" v-model="item.check" @change="(e) => {changeCheck(item, e)}">
              <label :for="option.itemId">{{option.itemNo+'、'+option.itemDesc}}</label><br v-if="option.isFill">
              <span class="input-style" v-if="option.isFill">{{option.text}}</span>
              <br>
            </div>
          </form>
          <div v-else-if="item.subjectType == 1" style="padding:10px 15px">
            <p class="input-style" style="margin-left: 0em">{{item.valueDesc}}</p>
          </div>
          <!-- <checklist v-if="item.subjectType == 2 || item.subjectType == 3" :max="item.subjectType == 2?1:item.subjectType == 3?item.maxItem:1" :required="item.isRequired" :options="item.checklist" v-model="item.select"></checklist> -->
          <!-- <x-input style="border: 1px solid #999; margin: 5px 15px;border-radius: 5px;" v-else-if="item.subjectType == 1" v-model="item.select"></x-input> -->
        </div>
      </group>
    <!-- </scroller> -->
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import { Group, Cell, Checklist, XInput } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '../api'
export default {
  components: {
    Group, Cell, Checklist, XInput, DetailTabbar
  },
  data() {
    return {
      detail: {},
      coverHeight: 0,
      scrollerHeight: 0
    }
  },
  mounted() {
    this.coverHeight = window.innerWidth * 0.5
    this.scrollerHeight = window.innerHeight - 50
    let schoolId = this.$route.params.schoolId
    let studentId = this.$route.params.studentId
    let questionId = this.$route.params.questionId
    let answerId = this.$route.params.answerId
    if (answerId) {
      api.getCountAnswerDetail({schoolId, questionId, answerId}, (detail) => {
        this.detail = detail
        this.dataFormate()
      }, (er) => {
        if (er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
      return
    }
    api.getAnswerDetail({schoolId, studentId, questionId}, (detail) => {
      this.detail = detail
      this.dataFormate()
    }, (er) => {
      if (er.toUser) {
        this.tools.warnToast(er.message)
      }
    })
  },
  methods: {
    changeCheck(item, e) {
      if (item.maxItem !== null && item.maxItem < item.check.length) {
        if (e.target.checked) {
          item.check.pop()
          e.target.checked = false
        }
      }
    },
    dataFormate() {
      this.detail.subjects.forEach(element => {
        if (element.subjectType === 4) {
          element.check = element.valueScore
          element.items = [
            {isFill: false, itemDesc: '非常满意', itemId: 5, itemNo: 'A', subjectId: element.subjectId},
            {isFill: false, itemDesc: '满意', itemId: 4, itemNo: 'B', subjectId: element.subjectId},
            {isFill: false, itemDesc: '一般', itemId: 3, itemNo: 'C', subjectId: element.subjectId},
            {isFill: false, itemDesc: '不满意', itemId: 2, itemNo: 'D', subjectId: element.subjectId},
            {isFill: false, itemDesc: '非常不满意', itemId: 1, itemNo: 'E', subjectId: element.subjectId}
          ]
        }
        if (element.subjectType !== 1 && element.subjectType !== 4) {
          if (element.subjectType === 3) {
            element.check = []
          }
          element.items.forEach(item => {
            element.valueItemId.forEach(value => {
              if (item.itemId === value.valueItemId) {
                if (element.subjectType === 2) {
                  element.check = item.itemId
                  element.text = value.valueItemDesc
                } else {
                  element.check.push(item.itemId)
                  item.text = value.valueItemDesc
                }
              }
            })
          })
        }
      })
      console.log(this.detail)
    }
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
  margin-left: 1.5em;
  color: #999;
  /* width: 98%; */
  /* border: 1px solid #999; */
  /* border-radius: 3px; */
  /* padding: 5px 2px;
  margin: 5px 0;
  font-size: 17px; */
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
