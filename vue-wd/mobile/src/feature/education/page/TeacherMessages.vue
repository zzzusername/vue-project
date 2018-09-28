<template>
  <div>
    <Group title="基础信息" label-width="5em" label-margin-right="0.5em" label-align="left">
      <cell title="姓名" value-align="left" :value="teacherInfo.teacherName"></cell>
      <cell title="教师性别" value-align="left" :value="teacherInfo.teacherSex"></cell>
      <cell title="教师生日" value-align="left" :value="teacherInfo.teacherBirthday"></cell>
      <cell v-if="userInfo.schoolModel == 1" title="教师手机号" value-align="left" :value="teacherInfo.teacherTelephoneNum"></cell>
      <!-- <div v-if="teacherInfo.extendParam !== null && teacherInfo.extendParam.length > 0"> -->
      <cell v-if="teacherInfo.extendParam !== null && teacherInfo.extendParam.length > 0" :title="item.key" v-for="(item, index) in teacherInfo.extendParam" :key="index" value-align="left" :value="item.value"></cell>
      <!-- </div> -->
    </Group>
    <Group title="二维码绑定">
      <cell :title="teacherInfo.userId==null?'绑定教师微信':teacherInfo.userName" is-link @click.native="popupQrcode"></cell>
      <div style="position: absolute;right:35px;top: 7px;color: #666;" @click="popupQrcode">
        <span class="iconfont icon-erweimazhuanhuan" style="fontSize: 20px;"></span>
      </div>
    </Group>
    <!-- <div v-transfer-dom>
      <x-dialog v-model="showPopup" class="dialog-demo" hide-on-blur @on-hide="showMenu=false">
        <div class="img-style">
          <div style="width: 180px; height: 180px;margin: auto;" v-if="!teacherInfo.weixin">
            <qrcode style="text-align:center;" :value="url" type="img"></qrcode>
          </div>
          <p style="text-align: center;margin-top: 2vw;" v-if="!teacherInfo.weixin">
            <span style="font-size:18px;">请扫码绑定微信！</span>
          </p>
          <div style="width: 180px; margin: auto;" v-if="teacherInfo.weixin">
            <p class="unbing_manage_img" :style="{'background-image':'url('+tools.cdn(teacherInfo.userIcon, 'head.png', 128)+')'}" src=""></p>
            <p style="font-size:18px;margin-top:5vw;">{{teacherInfo.userName}}</p>
          </div>
          <p style="text-align: center;margin-top: 5vw;" v-if="teacherInfo.weixin">
            <span @click="unBunding" style="display: inline-block;height: 10vw;width: 40vw;line-height: 10vw;background-color: rgb(142, 191, 82);border-radius: 5vw;color: #fff;">解绑</span>
          </p>
        </div>
      </x-dialog>
    </div> -->
    <div v-transfer-dom>
      <x-dialog v-model="showQrcode">
        <div style="padding: 10px 0;">
          <p style="textAlgin: center;padding: 10px;fontSize: 16px;"><span style="color: #2E84D4">{{teacherInfo.teacherName}}</span>的二维码</p>
          <qrcode :value="qrcodeUrl" type="img" :size="180"></qrcode>
          <p style="margin: 5px 20px 0px">请长按二维码，选择“发送给朋友”，将该二维码发送给<span style="color: #2E84D4">{{teacherInfo.teacherName}}</span>老师让其绑定；或者与其面对面扫码绑定。</p>
        </div>
        <div style="padding: 10px;" @click="showQrcode=false">
          <span class="vux-close"></span>
        </div>
      </x-dialog>
    </div>
    <div v-transfer-dom>
      <confirm v-model="showCancelBind" title="提示" @on-cancel="showCancelBind = false" @on-confirm="onConfirm">
        <div class="unbing_manage_img" :style="{'background-image':'url('+tools.cdn(teacherInfo.userIcon, 'head.png', 128)+')'}"></div>
        <p style="font-size:18px;margin-top:5px;">{{teacherInfo.userName}}</p>
        <p style="fontSize: 16px;margin: 5px;">您确定解除与该老师的绑定吗？</p>
      </confirm>
    </div>
    <!-- 教师群成员列表 -->
    <!-- <div v-transfer-dom>
      <popup v-model="showGroupTeacher" height="80%">
        <div>
          <search placeholder="搜索教师" top="0" position="absolute" @on-submit="searchTeacher" v-model="searchValue" @on-focus="searchFocus(true)" @on-cancel="searchFocus(false)"></search>
          <div v-if="showBlock" style="height: 44px"></div>
          <div :style="{'position': 'relative', 'height': teachersHeight + 'px'}">
            <scroller>
              <div style="textAlign:center; padding: 10px; color: #a2a2a2;font-size:16px;" v-if="teachers.length == 0 && bindTeachers.length == 0 && !isSearch">没有发现群成员, 请<span style="color:blue" @click="addOrg">添加</span>教师群</div>
              <p v-else-if="teachers.length == 0 && bindTeachers.length == 0 && isSearch" style="text-align:center;padding: 10px; color: #a2a2a2;font-size: 16px;">没有搜到任何结果，换个名字试试吧</p>
              <radio class="bind_teachers" style="backgroundColor: #fff" :options="teachers" v-model="selectTeacher"></radio>
              <cell style="backgroundColor: #fff" v-for="(item, index) in bindTeachers" :key="index">
                <div slot="icon" class="teachers_icon" :style="{'background-image':'url('+tools.cdn(item.userIcon, 'head.png', 128)+')'}"></div>
                <p slot="title" style="">{{item.userName}}<span v-if="item.userOrgName != null">({{item.userOrgName}})</span></p>
                <p style="color: #FF6D56"><span style="color: #666">{{item.teacherName}}</span>&nbsp;<span>已绑定</span></p>
              </cell>
            </scroller>
          </div>
        </div>
        <div style="display:flex;position: fixed;width: 100vw;bottom: 0;height: 50px;">
          <div style="flex: 1;backgroundColor:rgb(230, 230, 230)" @click="showGroupTeacher = false">
            <p style="line-height: 50px; textAlign: center;">关闭</p>
          </div>
          <div style="flex: 1;backgroundColor: #8ebf52" @click="confirmTeacher">
            <p style="line-height: 50px; textAlign: center;color: #fff;">确定</p>
          </div>
        </div>
      </popup>
    </div> -->
    <select-org-user :max="1" :show-popu="showPopuOrgUser" :filter="orgFilter" @on-hide="showPopuOrgUser = false" @select-value="selectUser"></select-org-user>
    <detail-tabbar :actionLink="operate " :actions="actions" isHideMe=true></detail-tabbar>
    <!-- <actionsheet v-model="showMenu" :menus="managemenus" @on-click-menu="menuClick" show-cancel @on-click-menu-cancel="showPopup=false"></actionsheet> -->
    <actionsheet v-model="showBindTeacher" :menus="bindMenus" @on-click-menu="menuClick" show-cancel ></actionsheet>
    <actionsheet v-model="showDeleteTeacher" :menus="managemenusTeacher" @on-click-menu="menuClickDelete" show-cancel @on-click-menu-cancel="showDeleteTeacher=false"></actionsheet>
  </div>
</template>
<script>
  import { Qrcode, Group, Cell, XInput, dateFormat, Actionsheet, XDialog, Confirm, Popup, Radio, Search, TransferDomDirective as TransferDom } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import SelectOrgUser from '@/feature/education/components/SelectOrgUser'
  import api from '../api'
  import Vue from 'vue'
  import VueQriously from 'vue-qriously'
  import getUserInfo from '@/fun/getUserInfo.js'
  import {mapGetters} from 'vuex'
  Vue.use(VueQriously)
  export default{
    directives: {
      TransferDom
    },
    components: { Qrcode, Group, Cell, XInput, DetailTabbar, Actionsheet, XDialog, Confirm, Popup, Radio, Search, SelectOrgUser },
    data () {
      return {
        showPopup: false,
        showMenu: false,
        showDeleteTeacher: false,
        managemenus: {
          'title.noop': '您确定要解绑此教师吗?<br/>',
          delete: '<span style="color:red">解绑</span>'
        },
        managemenusTeacher: null,
        teacherInfo: {
          extendParam: []
        },
        actions: [
          { name: '删除教师', code: 'delete', color: '#FF6D56' },
          { name: '编辑资料', code: 'edit' }
        ],
        showQrcode: false,
        qrcodeUrl: '',
        showCancelBind: false,
        showGroupTeacher: false,
        teachers: [],
        bindTeachers: [],
        searchValue: null,
        showBlock: false,
        teachersHeight: 0,
        selectTeacher: null,
        bindMenus: {
          select: '选择群成员绑定',
          qrcode: '扫码绑定'
        },
        showBindTeacher: false,
        isSearch: false,
        orgFilter: {type: 1},
        showPopuOrgUser: false // 兼容教师版本的绑定操作
      }
    },
    computed: {
      ...mapGetters({
        userInfo: 'userInfo'
      })
    },
    mounted () {
      this.teachersHeight = window.innerHeight * 0.8 - 94
      api.getTeacherinfo({schoolId: this.$route.params.schoolId, teacherId: this.$route.params.teacherId}, (data) => {
        if (data.teacherBirthday !== null) {
          data.teacherBirthday = dateFormat(data.teacherBirthday, 'YYYY-MM-DD')
        } else {
          data.teacherBirthday = null
        }
        if (data.teacherSex === 1) {
          data.teacherSex = '男'
        } else if (data.teacherSex === 2) {
          data.teacherSex = '女'
        }
        if (data.extendPaam !== null) {
          data.extendParam = JSON.parse(data.extendParam)
        }
        this.teacherInfo = data
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    methods: {
      addOrg() {
        this.$router.push({name: 'educationSchoolOpenOrg'})
      },
      confirmTeacher() {
        let obj = JSON.parse(this.selectTeacher)
        this.selectTeacherBind(obj)
      },
      selectTeacherBind(obj) {
        api.selectTeacherBind({schoolId: this.$route.params.schoolId, userId: obj.userId, teacherId: this.teacherInfo.teacherId, orgId: obj.orgId}, (data) => {
          this.teacherInfo.userId = obj.userId
          this.teacherInfo.userName = obj.userName
          this.showGroupTeacher = false
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.tools.warnToast(er.message)
          }
        })
      },
      searchFocus(val) {
        this.showBlock = val
        if (!val) {
          this.searchValue = null
          this.searchTeacher()
        } else {
          this.isSearch = true
        }
      },
      searchTeacher() {
        this.getNoBindTeacherList(this.searchValue, 0, (data) => {
          this.showGroupTeacher = true
          this.teachers.splice(0, this.teachers.length)
          this.bindTeachers.splice(0, this.bindTeachers.length)
          data.forEach(element => {
            if (element.isBind) {
              this.bindTeachers.push(element)
            } else {
              this.teachers.push({key: JSON.stringify(element), value: element.userOrgName == null ? element.userName : element.userName + '(' + element.userOrgName + ')', icon: this.tools.cdn(element.userIcon)})
            }
            if (!this.showBlock) {
              this.isSearch = false
            }
          })
        })
      },
      onConfirm() {
        if (this.teacherInfo.userId) {
          api.delTeacherBinding({schoolId: this.$route.params.schoolId, teacherId: this.$route.params.teacherId, userId: this.teacherInfo.userId}, (data) => {
            getUserInfo({schoolId: this.$route.params.schoolId}, this.$store, true)
            this.tools.successToast('解绑成功')
            this.showPopup = false
            this.teacherInfo.weixin = false
            this.teacherInfo.userId = null
          }, (er) => {
            if (er.toUser !== undefined && er.toUser) {
              this.tools.warnToast(er.message)
            } else {
              this.tools.warnToast('解绑失败！')
            }
          })
        }
      },
      operate (code) {
        switch (code) {
          case 'delete':
            this.managemenusTeacher = {
              'title.noop': '您确定删除此教师吗?<br/>',
              delete: '<span style="color:red">删除</span>'
            }
            this.showDeleteTeacher = true
            break
          case 'edit':
            if (this.userInfo.schoolModel === 1) {
              this.$router.push({name: 'educationEditTeacher', params: {teacherId: this.teacherInfo.teacherId}})
            } else {
              this.$router.push({name: 'educationPersonalEditTeacher', params: {teacherId: this.teacherInfo.teacherId}})
            }
            break
        }
      },
      popupQrcode () {
        if (this.teacherInfo.weixin) {
          this.showCancelBind = true
        } else {
          // this.showBindTeacher = true
          api.getTeacherBindingCode({schoolId: this.$route.params.schoolId, teacherId: this.$route.params.teacherId}, (data) => {
            this.qrcodeUrl = data
            this.localStorage.setHelpProgressForSchoolMaster(this.$route.params.schoolId, 0)
            this.showQrcode = true
          }, (er) => {
            if (er.toUser !== undefined && er.toUser) {
              this.tools.warnToast(er.message)
            } else {
              this.tools.warnToast('获取失败！')
            }
          })
        }
      },
      menuClick (key) {
        if (key === 'select') {
          this.showPopuOrgUser = true
          // this.getNoBindTeacherList(this.searchValue, 0, (data) => {
          //   if (this.userInfo.schoolModel === 2) {
          //     this.showPopuOrgUser = true
          //   } else if (this.userInfo.schoolModel === 1) {
          //     this.showGroupTeacher = true
          //   }
          //   this.teachers.splice(0, this.teachers.length)
          //   this.bindTeachers.splice(0, this.bindTeachers.length)
          //   data.forEach(element => {
          //     if (element.isBind) {
          //       this.bindTeachers.push(element)
          //     } else {
          //       this.teachers.push({key: JSON.stringify(element), value: element.userOrgName == null ? element.userName : element.userName + '(' + element.userOrgName + ')', icon: this.tools.cdn(element.userIcon)})
          //     }
          //   })
          // })
        } else if (key === 'qrcode') {
          api.getTeacherBindingCode({schoolId: this.$route.params.schoolId, teacherId: this.$route.params.teacherId}, (data) => {
            this.qrcodeUrl = data
            this.localStorage.setHelpProgressForSchoolMaster(this.$route.params.schoolId, 0)
            this.showQrcode = true
          }, (er) => {
            if (er.toUser !== undefined && er.toUser) {
              this.tools.warnToast(er.message)
            } else {
              this.tools.warnToast('获取失败！')
            }
          })
        }
      },
      menuClickDelete (code) {
        if (code === 'delete') {
          api.delTeacher({schoolId: this.$route.params.schoolId, teacherId: this.$route.params.teacherId}, (data) => {
            this.showDeleteTeacher = false
            this.tools.successToast('删除成功！')
            this.$router.go(-1)
          }, (er) => {
            if (er.toUser !== undefined && er.toUser) {
              this.tools.warnToast(er.message)
            } else {
              this.tools.warnToast('删除失败！')
            }
          })
        }
      },
      getNoBindTeacherList(searchName, start, callback) {
        api.getNoBindTeacherUser({schoolId: this.$route.params.schoolId, name: searchName, wantName: this.teacherInfo.teacherName, rowStart: start, rowCount: 999}, (data) => {
          callback(data)
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.tools.warnToast(er.message)
          }
        })
      },
      selectUser (val) {
        this.selectTeacherBind(val)
      }
    }
  }
</script>
<style>
body{
  width:100%;
}
.teacher-img-box {
  height: 350px;
  overflow: hidden;
}
.teacher-vux-close {
  margin-top: 8px;
  margin-bottom: 8px;
}
.unbing_manage_img {
  width: 60px;
  height:60px;
  display: inline-block;
  border-radius: 30px;
  background-position: center center;
  background-size: cover;
  border-style:none;
  border-width:0;
  vertical-align:middle;
}
.img-style{
  padding:20px 20px 20px 20px;
}
.img-style img{
  display: inline-block !important;
  width:100% !important;
}
</style>
<style lang="less" scoped>
@import '~vux/src/styles/close';
.dialog-demo {
  .vux-close {
    margin-top: 8px;
    margin-bottom: 8px;
  }
}
</style>
