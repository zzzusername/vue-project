<template>
  <div>
    <group v-if="classes" gutter="0">
      <cell v-for="(item, index) in classes" :key="index" :class="index == select.index && select.isSelect ? 'select-style' : 'not-select-style'" @click.native="selectClass(index, item)">
        <p slot="title" style="font-size: 14px;">{{item.value}}</p>
        <p slot="inline-desc" style="font-size: 12px;">已选择{{studentCounts[item.key] == undefined ? '全部' : studentCounts[item.key]}}学生参与接龙</p>
      </cell>
    </group>
    <group v-if="checkClass.value" :title="checkClass.value + '学生'">
      <div style="display: flex;font-size: 14px;padding: 0 10px">
        <p style="flex: 1">
          <check-icon style="padding: 10px 0" :value="allReceive" type="plain" @update-value="(val) => {check(val, 'ALL')}">全部学生参与接龙</check-icon>
          <span style="float: right;line-height: 43px;color:rgb(46, 132, 212);" @click="filter">筛选</span>
        </p>
      </div>
      <cell v-for="(item, index) in studentList" :key="index">
        <div slot="icon" class="avater" :style="{'background-image':'url('+tools.cdn(item.userIcon, 'head.png', 128)+')'}"></div>
        <p slot="title" style="font-size: 14px;">{{item.studentName}}</p>
        <div>
          <checker v-model="item.check" type="checkbox" default-item-class="item-default" selected-item-class="item-selected">
            <checker-item :value="2" @on-item-click="(val) => {studentItemClick(val, index)}">是否参与接龙</checker-item>
          </checker>
        </div>
      </cell>
    </group>
    <detail-tabbar isHideMe=true :actions="actions" :actionLink="confirm" ></detail-tabbar>
    <popup v-model="showFilter" height="60%" style="backgroundColor: #fff;">
      <div style="backgroundColor: #fff;width: 100%;">
        <div style="padding: 10px 10px 5px;">
          <p style="marginBottom: 10px;">性别</p>
          <div>
            <checker v-model="filters.studentSex" default-item-class="default_class" selected-item-class="selected_class">
              <checker-item value="1">男</checker-item>
              <checker-item value="2">女</checker-item>
            </checker>
          </div>
        </div>
        <div style="padding: 10px 10px 5px;">
          <p style="marginBottom: 10px;">寄宿</p>
          <div>
            <checker v-model="filters.lodging" default-item-class="default_class" selected-item-class="selected_class">
              <checker-item value="true">是</checker-item>
              <checker-item value="false">否</checker-item>
            </checker>
          </div>
        </div>
        <p style="padding: 0 10px;color: red;font-size: 12px;">注：请确保学生信息已填写性别及寄宿情况</p>
        <div style="display:flex;position: fixed;z-index:;100000000;width: 100%;bottom: 0;height: 50px;">
          <div style="flex: 1;backgroundColor:rgb(230, 230, 230)" @click="clearFilter">
            <p style="line-height: 50px; textAlign: center;">重置</p>
          </div>
          <div style="flex: 1;backgroundColor: #8ebf52" @click="confirmFilter">
            <p style="line-height: 50px; textAlign: center;color: #fff;">确定</p>
          </div>
        </div>
       </div>
    </popup>
  </div>
</template>

<script>
import {Group, Cell, Checker, CheckerItem, Popup} from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import CheckIcon from '@/components/CheckIcon'
import api from '@/feature/education/api'
export default {
  components: {
    Group, Cell, CheckIcon, Checker, CheckerItem, DetailTabbar, Popup
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
      studentCounts: {},
      filters: {
        studentSex: null,
        lodging: null
      },
      showFilter: false
    }
  },
  mounted() {
    this.$store.commit('setClassStudents', null)
    this.classes = [].concat(this.$store.getters.getSelectClassList)
  },
  watch: {
    studentList: {
      handler(cval, oval) {
        let selectAll = true
        let count = 0
        for (const key in cval) {
          if (cval.hasOwnProperty(key)) {
            const element = cval[key]
            if (element.check.indexOf(2) < 0) {
              selectAll = false
            } else {
              count += 1
            }
          }
        }
        this.studentCounts[this.checkClass.key] = count
        this.allReceive = selectAll
      },
      deep: true,
      immediate: true
    },
    classes: {
      handler(cval, oval) {
        this.init()
      },
      deep: true
    }
  },
  methods: {
    filter () {
      this.showFilter = true
    },
    confirmFilter () {
      if ((this.filters.studentSex !== null && this.filters.studentSex !== '') || (this.filters.lodging !== null && this.filters.lodging !== '')) {
        this.editStudents()
      } else {
        this.tools.warnToast('请设置筛选条件')
      }
    },
    editStudents () {
      let list = this.studentList.slice(0)
      let newArr = []
      let loading = []
      let finfish = []
      if (this.filters.studentSex) {
        for (let j = 0; j < list.length; j++) {
          if (parseInt(list[j].studentSex) === parseInt(this.filters.studentSex) && list[j].studentSex !== null) {
            newArr.push(list[j])
          }
        }
      }
      if (this.filters.lodging) {
        if (newArr.length > 0) {
          for (let i = 0; i < newArr.length; i++) {
            if (newArr[i].lodging.toString() === this.filters.lodging) {
              loading.push(newArr[i])
            }
          }
        } else {
          if (this.filters.lodging) {
            for (let i = 0; i < list.length; i++) {
              if (list[i].lodging.toString() === this.filters.lodging) {
                loading.push(list[i])
              }
            }
          }
        }
        finfish = loading
      } else {
        finfish = newArr
      }
      for (let o = 0; o < this.studentList.length; o++) {
        this.studentList[o].check.splice(0, this.studentList[o].check.length)
        for (let k = 0; k < finfish.length; k++) {
          if (parseInt(finfish[k].studentId) === parseInt(this.studentList[o].studentId)) {
            if (this.studentList[o].check.length <= 0) {
              this.studentList[o].check.push(2)
            }
          }
        }
      }
      this.showFilter = false
    },
    clearFilter () {
      this.filters = {
        studentSex: null,
        lodging: null
      }
    },
    init () {
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
    check (val, type) {
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
      }
      this.students[this.checkClass.key] = this.studentList
    },
    confirm () {
      this.$store.commit('setClassStudents', JSON.parse(JSON.stringify(this.students)))
      this.$router.go(-1)
    },
    studentItemClick(val, index) {
      if (val === 2) {
        if (this.studentList[index].check.indexOf(2) < 0) {
          this.allReceive = false
          if (this.studentList[index].check.indexOf(1) >= 0) {
            this.studentList[index].check = []
          }
        }
      }
      this.students[this.checkClass.key] = this.studentList
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
    isContained(a, b) {
      if (!(a instanceof Array) || !(b instanceof Array)) return false
      if (a.length < b.length) return false
      var aStr = a.toString()
      for (var i = 0, len = b.length; i < len; i++) {
        if (aStr.indexOf(b[i]) === -1) return false
      }
      return true
    }
  },
  activated() {
    let classs = this.$store.getters.getSelectClassList
    if (!this.isContained(classs, this.classes)) {
      this.classes = [].concat(this.$store.getters.getSelectClassList)
    } else {
      if (classs !== null && this.classes.length !== classs.length) {
        this.classes = [].concat(this.$store.getters.getSelectClassList)
      }
    }
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
  background: #ffffff url(../../../assets/active.png) no-repeat right bottom;
  border: 1px solid #FC4B1E;
  font-size: 12px;
}
.default_class {
  border: 1px solid #ececec;
  padding: 5px 0;
  font-size: 12px;
  margin-bottom: 5px;
  width: 30%;
  text-align: center
}
.selected_class {
  background: #ffffff url(../../../assets/active.png) no-repeat right bottom;
  border: 1px solid #FC4B1E;
}
</style>

