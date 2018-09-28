<template>
  <div>
    <div :style="{'height': scrollerHeight + 'px', 'position': 'relative'}">
      <scroller :on-infinite="infinite" ref="rollcall_scroller" class="rollcall_scroller">
        <!-- 列表头 -->
        <cell style="backgroundColor:#fff;fontSize: 17px;">
          <p slot="title">
            <span>{{info.lessonName === null ? '点名' : info.lessonName}}</span>&nbsp;
            <span style="fontSize:13px;color:#999;margin-left:5px">{{info.className}}</span>
          </p>
          <p slot="inline-desc"><span v-show="!tools.isNull(info.teachingTeacherName)">任课教师：{{info.teachingTeacherName}} &nbsp;&nbsp; </span>学生人数： {{info.countStudent}}人</p>
        </cell>
        <!-- 列表元素 -->
        <cell id="rollcall_cell" v-for="(item, index) in students" :key="index" style="backgroundColor:#FFF">
          <div slot="icon" class="student_rollcall_img" :style="{'background-image':'url('+tools.cdn(item.userIcon, 'head.png', 128)+')'}" src=""></div>
          <p slot="title" style="fontSize: 17px">{{item.studentName}}</p>
          <p v-if="item.checkStatus > 1" slot="inline-desc" :style="{'fontSize': '14px', 'color':item.vacationTeacherRatify == 2 ? '#FF6D56' : '#2E84D4'}"><span>{{getRollcallStatus(item.checkStatus)}}</span>&nbsp; <span>{{item.vacationTeacherRatify == 2 ? '已批准' : '待审核'}}</span></p>
          <div style="height: 50px">
            <checker style="fontSize: 14px;" :radio-required="true" v-model="item.checked" default-item-class="default-item" :selected-item-class="item.checked==1?'selected-item':'selected-item-no'">
              <checker-item :value="1" @on-item-click="(value, disabled) => checked(value, disabled, index)">已到</checker-item>
              <checker-item :value="item.checked == null || item.checked == 1 ? -1 : item.checked " @on-item-click="(value, disabled) => checked(value, disabled, index)">{{item.checked >= 2 ? getRollcallStatus(item.checked) : '异常'}}</checker-item>
            </checker>
          </div>
        </cell>
      </scroller>
    </div>
    <detail-tabbar :actionLink="submit" :actions="actions" isHideMe=true></detail-tabbar>
    <!-- 异常点名dialog -->
    <div>
      <x-dialog v-model="showException" hide-on-blur :dialog-style="{'width': '75%'}">
        <div v-if="showException" style="padding: 20px 0;">
          <p style="textAlign: center;fontSize: 16px;">请选择异常类型</p>
          <checker v-for="(item, index) in exceptionList" :key="index" style="fontSize: 14px;" :radio-required="true" v-model="students[selectIndex].checked" default-item-class="default-item" :selected-item-class="'selected-item-no'">
            <checker-item style="margin: 10px 5px;;padding: 18px;" v-for="(info, i) in item" :key="i" :value="info.status" @on-item-click="(value, disabled) => checked(value, disabled, selectIndex)">{{info.text}}</checker-item>
          </checker>
        </div>
      </x-dialog>
    </div>
    <!-- <div>
      <x-dialog v-model="showDialog" hide-on-blur>
        <div style="padding: 20px 0 10px;">
          <p style="fontSize: 16px;">您确定结束本次点名吗?</p>
          <p style="fontSize: 13px;color: red; margin-top:10px">结束后不可再更改点名状态</p>
        </div>
        <div style="display: flex;border-top:1px #d2d2d2 solid">
          <div style="flex: 1;padding: 10px 0;border-right:1px #d2d2d2 solid" @click="showDialog = false">取消</div>
          <div style="flex: 1;padding: 10px 0;" @click="end()">确定</div>
        </div>
      </x-dialog>
    </div> -->
    <div v-transfer-dom>
      <confirm v-model="showDialog" title="操作提示" @on-cancel="showDialog = false" @on-confirm="end">
        <p style="text-align:center;color:red;">您确定结束本次点名吗?<br>结束后不可再更改点名状态</p>
      </confirm>
    </div>
  </div>
</template>

<script>
import { Group, Cell, XButton, CellBox, Checker, CheckerItem, XDialog, Confirm, TransferDomDirective as TransferDom } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '../../api'
export default {
  directives: {
    TransferDom
  },
  components: {
    Group, Cell, XButton, CellBox, Checker, CheckerItem, XDialog, Confirm, DetailTabbar
  },
  data() {
    return {
      scrollerHeight: 0,
      actions: [{ name: '结束点名并推送' }],
      info: {},
      students: [],
      showDialog: false,
      showException: false,
      exceptionValue: null,
      exceptionList: [[{status: 2, text: '未到'}, {status: 3, text: '请假'}, {status: 4, text: '迟到'}], [{status: 5, text: '早退'}, {status: 6, text: '旷课'}]],
      selectIndex: null
    }
  },
  mounted() {
    this.scrollerHeight = window.innerHeight - 50
    this.rollcallStatus = String(this.$route.params.status)
    // if (this.rollcallStatus === '2') {
    //   this.actions = [{ name: '首次点名已结束', color: 'rgb(230, 230, 230)' }]
    // }
    this.getInfo((data) => {
      this.info = data
    })
  },
  methods: {
    end() {
      this.endRollcall((data) => {
        this.tools.successToast('结束点名')
        this.$router.go(-1)
      })
    },
    submit() {
      if (this.rollcallStatus === '2' && this.isFirstRollcall) {
        return
      }
      this.showDialog = true
    },
    checked(value, disabled, index) {
      console.log(value, this.students[index])
      this.selectIndex = index
      if (value === -1) {
        this.showException = true
        return
      }
      if (this.students[index].checked === value && !this.showException) {
        this.showException = true
        return
      }
      if (value === this.students[index].checked) {
        return
      }
      this.rollcall(this.students[index].checkStudentId, value, () => {
        this.showException = false
      }, () => {})
    },
    infinite(done) {
      let len = this.students.length
      this.getStudentList(len, (data) => {
        data.forEach(element => {
          element.checked = element.checkStatus
        })
        this.students = this.students.concat(data)
        if (data.length < 20) {
          done(true)
        } else {
          done()
        }
      })
    },
    getStudentList(rowStart, callback) {
      api.getRollCallStudentList({ schoolId: this.$route.params.schoolId, classesId: this.$route.params.classId, checkId: this.$route.params.checkId, rowStart: rowStart, rowCount: 80 }, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    rollcall(checkStudentId, checkStatus, callback, error) {
      api.starRollcall({ schoolId: this.$route.params.schoolId, checkStudentId: checkStudentId, checkId: this.$route.params.checkId, classesId: this.$route.params.classId, checkStatus: checkStatus }, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
        error()
      })
    },
    getInfo(callback) {
      api.getTeacherRollcallInfo({ schoolId: this.$route.params.schoolId, classesId: this.$route.params.classId, checkId: this.$route.params.checkId }, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    endRollcall(callback) {
      api.endRollcall({schoolId: this.$route.params.schoolId, classesId: this.$route.params.classId, checkId: this.$route.params.checkId}, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    getRollcallStatus(val) {
      let status = {
        1: '已到', 2: '未到', 3: '请假', 4: '迟到', 5: '早退', 6: '旷课'
      }
      if (val !== null && val !== undefined) {
        return status[val]
      }
      return ''
    }
  }
}

</script>

<style>
.default-item {
  border: 1px solid #d2d2d2;
  padding: 13px 23px;
}

.selected-item {
  border: 1px solid #8ebf52;
  color: #8ebf52
}

.selected-item-no {
  border: 1px solid #FF6D56;
  color: #FF6D56
}

.student_rollcall_img {
  width: 40px;
  height:40px;
  display: inline-block;
  border-radius: 6px;
  margin-right: 10px;
  background-position: center center;
  background-size: cover;
  border-style:none;
  border-width:0;
  vertical-align:middle;
}
#rollcall_cell::before {
  right: 15px;
}
</style>
