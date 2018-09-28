<template>
  <div>
    <div :style="{'font-size': '16px', 'padding': '10px 20px', 'fontSize':'16px', 'color':'#222222', 'background':'#fff'}"><!--, 'height':hintHeight+'px'-->
      <img class="fail_user_icon" :src="tools.cdn(userInfo.userIcon)">
      <p style="textAlign:center;fontSize: 16px">{{userInfo.userName}}</p>
      <div v-if="userInfo !== null && userInfo.isSubscribe">
        <p style="margin-top:1.2em;">您好！欢迎使用【校和家】，请正确填写孩子信息完成绑定</p>
      </div>
    </div>
    <div>
      <group gutter="0" label-width="6em" label-margin-right="0.5em" label-align="left">
        <x-input title="孩子姓名" placeholder="必填" v-model="studentName"></x-input>
        <popup-picker v-if="gradeList.length>0" title="所在年级" :data="gradeList" :columns="1" v-model="currentGradeId" placeholder="必选" show-name @on-change="onChangeGrade" value-text-align="left"></popup-picker>
        <popup-picker v-if="gradeList.length == 0 || currentGradeId.length > 0" title="所在班级" :data="classList" :columns="1" v-model="currentClassId" placeholder="必选"  show-name value-text-align="left"></popup-picker>
        <selector title="与学生的关系" placeholder="必选" v-model="relation" :options="plainList"></selector>
      </group>
      <x-button type="primary" style="width:80vw;margin-top:30px;" @click.native="onBind(false)">绑定</x-button>
    </div>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import { Group, Cell, XInput, Selector, XButton, TransferDom, AlertPlugin, PopupPicker, ConfirmPlugin } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '../../api'
import { mapGetters } from 'vuex'
import Vue from 'vue'
Vue.use(AlertPlugin)
Vue.use(ConfirmPlugin)
export default {
  directives: {
    TransferDom
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    })
  },
  components: {
    Group, Cell, XInput, Selector, XButton, PopupPicker, DetailTabbar
  },
  data () {
    return {
      height: 0,
      plainList: [
        '爸爸', '妈妈', '爷爷', '奶奶', '姥爷', '姥姥', '亲戚'
      ],
      studentName: null,
      relation: null,
      userInfo: {},
      gradeList: [],
      classList: [],
      currentGradeId: [],
      currentClassId: [],
      normalClassList: []
    }
  },
  mounted () {
    this.height = window.innerHeight - 20
    this.localStorage.getUserInfo({schoolId: this.$route.params.schoolId}, (data) => {
      this.userInfo = data
    }, () => {})
    api.getGradeList({schoolId: this.$route.params.schoolId}, (data) => {
      this.gradeList = []
      data.forEach(element => {
        let gradeInfo = {
          name: element.gradeName,
          value: element.gradeId.toString(),
          parent: 0
        }
        this.gradeList.push(gradeInfo)
      })
      if (this.gradeList.length === 0) {
        this.getClassList(null)
      }
    }, () => {})
  },
  methods: {
    getClassList (gradeId) {
      api.getClassList({ schoolId: this.$route.params.schoolId, gradeId, classType: 1, rowStart: 0, rowCount: 999 }, (data) => {
        this.normalClassList = data
        this.classList = []
        data.forEach(element => {
          let classInfo = {
            name: element.classInfoName,
            value: element.classId.toString(),
            parent: 0
          }
          this.classList.push(classInfo)
        })
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    onChangeGrade (val) {
      let gradeId = this.currentGradeId.length > 0 ? this.currentGradeId[0] : null
      this.getClassList(gradeId)
    },
    onBind (isContinue) {
      if (this.tools.isNull(this.studentName)) {
        this.tools.warnToast('请输入孩子姓名')
        return
      }
      if (this.currentClassId.length === 0) {
        this.tools.warnToast('请选择所在班级')
        return
      }
      if (this.tools.isNull(this.relation)) {
        this.tools.warnToast('请输入与学生的关系')
        return
      }
      api.addConnectStudent({schoolId: this.$route.params.schoolId, classId: this.currentClassId[0], relationship: this.relation, studentName: this.studentName}, () => {
        this.tools.successToast('添加成功')
        this.$router.back()
      }, (err) => {
        if (err.errCode === '21130103') {
          let self = this
          this.$vux.confirm.show({
            content: err.message,
            confirmText: '通知审核',
            onConfirm () {
              api.sendParentApply({schoolId: self.$route.params.schoolId, studentId: err.ext.studentId, relationship: self.relation, parentName: self.userInfo.parentName}, () => {
                self.$vux.alert.show({
                  title: '成功提示',
                  content: '通知已发送成功，请耐心等待对方审核',
                  onHide () {
                    self.$router.back()
                  }
                })
              }, () => {})
            }
          })
        } else if (err.errCode === '21130104') {
          let info = {}
          info.classId = this.currentClassId[0]
          this.normalClassList.forEach(element => {
            if (parseInt(element.classId) === parseInt(info.classId)) {
              info.className = element.className
            }
          })
          info.studentName = this.studentName
          info.relationship = this.relation
          info.parentName = this.userInfo.parentName
          sessionStorage.setItem('validateBindStudentName', JSON.stringify(info))
          this.$router.replace({name: 'educationValidateBindParents'})
        } else if (err.toUser) {
          this.$vux.alert.show({
            title: '提示',
            content: err.message
          })
        } else {
          this.tools.warnToast('添加失败')
        }
      })
    }
  }
}
</script>

<style>
</style>
