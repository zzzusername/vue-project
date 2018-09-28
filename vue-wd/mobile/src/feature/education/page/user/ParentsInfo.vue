<template>
  <div>
    <group title="基本信息" label-width="6em" label-margin-right="0.5em" label-align="left">
      <x-input type="text" title="家长姓名" v-model="parentInfo.parentName" placeholder="必填"></x-input>
      <!-- <x-input type="tel" title="手机号" ref="mobilePhone" v-model="parentInfo.telephoneNum" keyboard="number" is-type="china-mobile" placeholder="选填"></x-input> -->
      <selector v-if="showParent" v-model="relationship" :title="'与' + parentInfo.studentName + '关系'" :options="plainList"></selector>
    </group>
    <group title="完善信息" label-width="6em" label-margin-right="0.5em" label-align="left" v-if="parentInfo.extendParam !== null && parentInfo.extendParam.length > 0">
      <x-input v-for="(item, index) in parentInfo.extendParam" :key="index" :title="item.key" v-model="item.value" :placeholder="item.status==1 ? '必填' : '选填'"></x-input>
    </group>
    <detail-tabbar :actionLink="saveInfo" :actions="actions"></detail-tabbar>
    <span v-if="showUnbinding" style="float: right;margin-right:20px;line-height:40px;font-size: 16px;color: rgb(46, 132, 212);" @click="unBinding">解绑家长身份</span>
    <div v-transfer-dom>
      <confirm v-model="showConfirm" title="操作提示" theme="ios" @on-confirm="onConfirm">
        <p style="text-align:center;color:rgb(255, 109, 86);">{{text}}</p>
      </confirm>
    </div>
    <popup v-model="showFilter" height="60%">
      <div :style="{'height': scrollerHeight + 'px', 'position': 'relative'}">
        <scroller>
          <!-- <group gutter="0" title="请选择需要解绑关系的子女"> -->
            <p style="padding:0 15px;line-height:30px;">请选择需要解绑关系的子女</p>
            <cell v-for="(item, index) in parentInfo.studentlist" :key= "index" :title="'姓名：' + item.studentName" style="backgroundColor: #fff;">
              <span slot="default" style="background:rgb(46, 132, 212);color:#fff;padding: 5px 10px;border-radius: 5px;text-align: center;font-size:12px;" @click="unBindingStudent(item, index)">解绑</span>
            </cell>
          <!-- </group> -->
        </scroller>
      </div>
    </popup>
  </div>
</template>
<script>
import { Cell, Popup, Confirm, Group, XInput, Selector, TransferDomDirective as TransferDom } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import { mapGetters } from 'vuex'
import api from '../../api'
export default {
  components: {
    Cell, Popup, Confirm, Group, XInput, DetailTabbar, Selector
  },
  directives: {
    TransferDom
  },
  data() {
    return {
      scrollerHeight: 0,
      alow: false,
      relationship: null,
      parentId: null,
      showParent: false,
      studentName: null,
      parentInfo: {
        'userName': null,
        'userIcon': null,
        'parentId': null,
        'userId': null,
        'schoolId': null,
        'parentName': null,
        'parentJob': null,
        'parentEducation': null,
        'parentAddress': null,
        'telephoneNum': null,
        'extendParam': [],
        'studentName': null
      },
      studentId: null,
      plainList: [
        '爸爸', '妈妈', '爷爷', '奶奶', '姥爷', '姥姥', '亲戚'
      ],
      actions: [
        {
          name: '保存并绑定',
          code: 'bindingParent'
        }
      ],
      showUnbinding: false,
      showConfirm: false,
      showFilter: false,
      text: null,
      index: null
    }
  },
  mounted () {
    this.scrollerHeight = (window.innerHeight * 0.6)
    if (this.$route.params.bindingCode) {
      this.showUnbinding = false
      this.actions = [
        {
          name: '保存并绑定',
          code: 'bindingParent'
        }
      ]
      api.bindingToParentInfo({schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId, bindingCode: this.$route.params.bindingCode}, (data) => {
        data.extendParam = JSON.parse(data.extendParam)
        this.editextendParam(data.extendParam)
        this.parentInfo = data
        this.editStudentRelation(data.studentlist)
        this.relationship = data.relationship
        this.showParent = true
        this.alow = true
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message, '180px')
        } else {
          this.tools.warnToast('获取信息失败！')
        }
      })
    } else {
      if (this.$route.params.studentId) {
        this.alow = true
        this.actions = [
          {
            name: '保存并绑定',
            code: 'bindParent'
          }
        ]
        this.showUnbinding = false
      } else {
        this.actions = [
          {
            name: '保存并完善',
            code: 'saveParent'
          }
        ]
        this.showUnbinding = true
      }
      api.getParentInfoSelf({schoolId: this.$route.params.schoolId}, (data) => {
        console.log(data)
        data.extendParam = JSON.parse(data.extendParam)
        this.editextendParam(data.extendParam)
        this.parentInfo = data
        this.parentId = data.parentId
        this.alow = true
        if (this.$route.params.studentId) {
          this.showParent = true
          this.editStudentRelation(data.studentlist)
        } else {
          this.showParent = false
        }
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        } else {
          this.tools.warnToast('获取信息失败！')
        }
      })
    }
  },
  computed: {
    ...mapGetters({
      orgInfo: 'orgInfo',
      userInfo: 'userInfo'
    })
  },
  methods: {
    onConfirm () {
      let data = {
        parentId: this.parentId,
        studentId: this.studentId
      }
      api.identity({schoolId: this.$route.params.schoolId, data}, (data) => {
        this.localStorage.setSchoolUserIdentity(this.$route.params.schoolId, this.userInfo.userId, '')
        this.tools.successToast('解绑成功')
        if (this.parentInfo.studentlist.length <= 1) {
          this.$router.push({name: 'userIndex'})
        } else {
          this.parentInfo.studentlist.splice(this.index, 1)
        }
        if (this.parentInfo.studentlist.length <= 1) {
          this.showFilter = false
        }
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        } else {
          this.tools.warnToast('解绑失败')
        }
      })
    },
    unBinding () {
      if (this.parentInfo.studentlist.length <= 1) {
        for (let i = 0; i < this.parentInfo.studentlist.length; i++) {
          this.text = '您确定解绑与' + this.parentInfo.studentlist[i].studentName + '的关系吗？'
          this.studentId = this.parentInfo.studentlist[i].studentId
        }
        this.showConfirm = true
      } else {
        this.showFilter = true
      }
    },
    unBindingStudent (item, index) {
      this.index = index
      this.text = '您确定解绑与' + item.studentName + '的关系吗？'
      this.studentId = item.studentId
      this.showConfirm = true
      // this.showFilter = false
    },
    editStudentRelation (data) {
      if (data === undefined || data === null) {
        return
      }
      for (let i = 0; i < data.length; i++) {
        if (data[i].studentId === this.$route.params.studentId) {
          console.log(data[i].studentName)
          this.parentInfo.studentName = data[i].studentName
        }
      }
    },
    editextendParam (data) {
      if (data !== null && data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          if (data[i].value === undefined) {
            data[i].value = null
          }
        }
      }
    },
    saveInfo(code) {
      if (!this.alow) {
        return
      }
      if (!this.parentInfo.parentName) {
        this.tools.warnToast('请填姓名', '160px')
        return
      }
      // if (this.parentInfo.telephoneNum) {
      //   if (!this.$refs.mobilePhone.valid) {
      //     this.tools.warnToast('请填写合法的手机号', '160px')
      //     return
      //   }
      // }
      if (this.showParent) {
        if (!this.relationship) {
          this.tools.warnToast('请选择与学生关系', '160px')
          return
        }
      }
      var upon = false
      if (this.parentInfo.extendParam !== null && this.parentInfo.extendParam.length > 0) {
        for (var i = 0; i < this.parentInfo.extendParam.length; i++) {
          if (this.parentInfo.extendParam[i].status === '1') {
            if (this.parentInfo.extendParam[i].value === null || this.parentInfo.extendParam[i].value === '' || this.parentInfo.extendParam[i].value === undefined) {
              this.tools.warnToast('请填写' + this.parentInfo.extendParam[i].key)
              upon = false
              return
            } else {
              upon = true
            }
          } else {
            upon = true
          }
        }
      } else {
        upon = true
      }
      if (upon) {
        if (code === 'bindingParent') {
          var obj = {
            bindingCode: this.$route.params.bindingCode,
            studentId: this.$route.params.studentId,
            bindingStatus: '1',
            parentName: this.parentInfo.parentName,
            telephoneNum: this.parentInfo.telephoneNum,
            relationship: this.relationship,
            parentId: this.parentInfo.parentId
          }
          if (this.parentInfo.extendParam !== null && this.parentInfo.extendParam.length > 0) {
            obj.extendParam = JSON.stringify(this.parentInfo.extendParam)
          }
          api.parentBindingStudent({schoolId: this.$route.params.schoolId, data: obj}, (data) => {
            this.tools.successToast('绑定成功！')
            this.$router.replace({name: 'educationParentsHome'})
          }, (er) => {
            if (er.toUser !== undefined && er.toUser) {
              this.tools.warnToast(er.message)
            } else {
              this.tools.warnToast('绑定失败！')
            }
          })
        } else if (code === 'bindParent') {
          var o = {
            studentId: this.$route.params.studentId,
            parentName: this.parentInfo.parentName,
            telephoneNum: this.parentInfo.telephoneNum,
            relationship: this.relationship,
            parentId: this.parentInfo.parentId
          }
          if (this.parentInfo.extendParam !== null && this.parentInfo.extendParam.length > 0) {
            o.extendParam = JSON.stringify(this.parentInfo.extendParam)
          }
          api.updateParentBindInfo({schoolId: this.$route.params.schoolId, data: o}, (data) => {
            this.tools.successToast('绑定成功！')
            this.$router.replace({name: 'educationParentsHome'})
          }, (er) => {
            if (er.toUser !== undefined && er.toUser) {
              this.tools.warnToast(er.message)
            } else {
              this.tools.warnToast('绑定失败！')
            }
          })
        } else {
          var updateObj = {
            parentId: this.parentId,
            parentName: this.parentInfo.parentName,
            telephoneNum: this.parentInfo.telephoneNum,
            extendParam: JSON.stringify(this.parentInfo.extendParam)
          }
          api.updateParentInfo({schoolId: this.$route.params.schoolId, data: updateObj}, (data) => {
            this.tools.successToast('保存成功！')
            this.$router.go(-1)
          }, (er) => {
            if (er.toUser !== undefined && er.toUser) {
              this.tools.warnToast(er.message)
            } else {
              this.tools.warnToast('保存失败！')
            }
          })
        }
      }
    }
  }
}
</script>
