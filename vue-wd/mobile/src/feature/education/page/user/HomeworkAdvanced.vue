<template>
  <div>
    <group v-if="classes" gutter="0">
      <cell v-for="(item, index) in classes" :key="index" :class="index == select.index && select.isSelect ? 'select-style' : 'not-select-style'" @click.native="selectClass(index, item)">
        <p slot="title" style="font-size: 14px;">{{item.value}}</p>
        <p slot="inline-desc" style="font-size: 12px;">已选择{{studentCounts[item.key] == undefined ? '全部' : studentCounts[item.key]}}学生接收作业</p>
      </cell>
    </group>
    <group v-if="checkClass.value" :title="checkClass.value + '学生'">
      <div style="display: flex;font-size: 14px;padding: 0 10px">
        <p style="flex: 1">
          <check-icon style="padding: 10px 0" :value="allReceive" type="plain" @update-value="(val) => {check(val, 'ALL')}">全部学生接收作业</check-icon>
          <check-icon style="padding: 10px 0" :value.sync="checkReceive" type="plain" @update-value="(val) => {check(val, 'CHECK')}">全部接收者在线提交</check-icon>
        </p>
      </div>
      <cell v-for="(item, index) in studentList" :key="index">
        <div slot="icon" class="avater" :style="{'background-image':'url('+tools.cdn(item.userIcon, 'head.png', 128)+')'}"></div>
        <p slot="title" style="font-size: 14px;">{{item.studentName}}</p>
        <div>
          <checker v-model="item.check" type="checkbox" default-item-class="item-default" selected-item-class="item-selected">
            <checker-item v-if="item.check.indexOf(2) >= 0" :value="1" @on-item-click="(val) => {studentItemClick(val, index)}">在线提交</checker-item>
            <checker-item :value="2" @on-item-click="(val) => {studentItemClick(val, index)}">接收作业</checker-item>
          </checker>
        </div>
      </cell>
    </group>
    <detail-tabbar isHideMe=true :actions="actions" :actionLink="confirm" ></detail-tabbar>
  </div>
</template>

<script>
import {Group, Cell, Checker, CheckerItem} from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import CheckIcon from '@/components/CheckIcon'
import api from '../../api'
export default {
  components: {
    Group, Cell, CheckIcon, Checker, CheckerItem, DetailTabbar
  },
  data() {
    return {
      classes: [],
      checkClass: {},
      students: {},
      select: {index: 0, isSelect: true},
      allReceive: true,
      checkReceive: false,
      studentList: [],
      actions: [{name: '确定'}],
      studentCounts: {}
    }
  },
  mounted() {
    // this.init()
    this.$store.commit('setClassStudents', null)
    this.classes = [].concat(this.$store.getters.getSelectClassList)
  },
  watch: {
    studentList: {
      handler(cval, oval) {
        let selectAll = true
        let count = 0
        let checkCount = 0
        for (const key in cval) {
          if (cval.hasOwnProperty(key)) {
            const element = cval[key]
            if (element.check.indexOf(2) < 0) {
              selectAll = false
            } else {
              count += 1
              if (element.check.indexOf(1) >= 0) {
                checkCount += 1
              }
            }
          }
        }
        console.log(count, checkCount)
        this.studentCounts[this.checkClass.key] = count
        this.allReceive = selectAll
        if (count !== 0 && count === checkCount) {
          this.checkReceive = true
        } else {
          this.checkReceive = false
        }
      },
      deep: true
    },
    classes: {
      handler(cval, oval) {
        this.init()
      },
      deep: true
    }
  },
  methods: {
    init() {
      let settings = this.$store.getters.getStudentHomeworkSetting
      let students = []
      if (settings !== null) {
        students = [].concat(settings)
      }
      this.getStudents(this.classes[0].key, data => {
        let array = [].concat(data)
        array.forEach(element => {
          element.check = []
          if (students.length > 0) {
            students.forEach(student => {
              if (student.studentId === element.studentId) {
                if (!student.isRequire) {
                  element.check = [2]
                } else {
                  element.check = [1, 2]
                }
              }
            })
          } else {
            element.check = [2]
          }
        })
        this.checkClass = this.classes[0]
        this.students[this.classes[0].key] = array
        this.studentList = array
      })
    },
    selectClass(index, val) {
      this.checkClass = val
      if (this.select.index === index) {
      } else {
        this.select.isSelect = true
        if (!this.students[val.key]) {
          this.getStudents(val.key, data => {
            let array = [].concat(data)
            array.forEach(element => {
              element.check = [2]
            })
            this.students[val.key] = array
            this.studentList = this.students[val.key]
          })
        } else {
          this.studentList = this.students[val.key]
        }
      }
      this.select.index = index
    },
    getStudents(classId, callback) {
      api.queryStudentListOrderName({schoolId: this.$route.params.schoolId, classId}, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        } else {
          this.tools.warnToast('获取数据失败')
        }
      })
    },
    check(val, type) {
      switch (type) {
        case 'ALL':
          this.studentList.forEach(element => {
            if (val) {
              element.check = element.check.concat(2) // TODO 注意有值的情况
            } else {
              element.check = []
            }
          })
          break
        case 'CHECK':
          this.studentList.forEach(element => {
            if (element.check.indexOf(2) >= 0) {
              if (val) {
                element.check = element.check.concat(1)
              } else {
                element.check.splice(element.check.indexOf(1), 1)
              }
            }
          })
          break
      }
      this.students[this.checkClass.key] = this.studentList
    },
    studentItemClick(val, index) {
      if (val === 2) {
        if (this.studentList[index].check.indexOf(2) < 0) {
          this.allReceive = false
          if (this.studentList[index].check.indexOf(1) >= 0) {
            this.studentList[index].check = []
          }
        }
      } else if (val === 1) {
        if (this.studentList[index].check.indexOf(2) >= 0) {
          if (this.studentList[index].check.indexOf(1) < 0) {
            this.checkReceive = false
          }
        }
      }
      this.students[this.checkClass.key] = this.studentList
    },
    confirm() {
      // console.log(this.students)
      this.$store.commit('setClassStudents', JSON.parse(JSON.stringify(this.students)))
      this.$router.go(-1)
    },
    isContained(a, b) {
      if (!(a instanceof Array) || !(b instanceof Array)) return false
      if (a.length < b.length) return false
      var aStr = JSON.stringify(a)
      for (var i = 0, len = b.length; i < len; i++) {
        if (aStr.indexOf(JSON.stringify(b[i])) === -1) return false
      }
      return true
    }
  },
  activated() {
    // this.classes = [].concat(this.$store.getters.getcheckClassList)
    let classs = this.$store.getters.getSelectClassList
    if (!this.isContained(classs, this.classes)) {
      this.classes = [].concat(this.$store.getters.getSelectClassList)
    } else {
      if (classs !== null && this.classes.length !== classs.length) {
        this.classes = [].concat(this.$store.getters.getSelectClassList)
      }
    }
    // if (!this.isContained(classs, this.classes)) {
    //   this.init()
    // }
  }
}
</script>

<style lang="less" scoped>
.select-style {
  background-color: aliceblue;
}
.not-select-style {
  background-color: #fff;
}
.avater {
  width: 40px;
  height: 40px;
  display: block;
  margin-right: 10px;
  background-position: center center;
  background-size: cover;
}
.item-default {
  border: 1px solid #ececec;
  padding: 5px 15px;
  font-size: 12px
}
.item-selected {
  background: #ffffff url(../../../../assets/active.png) no-repeat right bottom;
  border: 1px solid #FC4B1E;
  font-size: 12px;
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

