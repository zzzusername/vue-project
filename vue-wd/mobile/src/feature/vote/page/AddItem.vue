<template>
  <div>
    <group gutter="10px" v-if="type === '1'">
      <x-input title="名称" v-model="data.itemName" placeholder="必填"></x-input>
      <x-textarea title="描述" v-model="data.itemDesc" placeholder="必填"></x-textarea>
    </group>
    <group gutter="10x" v-if="type === '2'" label-width="6em" label-margin-right="1em" label-align="left">
      <x-input v-if="!showTeacher && !showStudent" title="名称" v-model="data.itemName" placeholder="必填"></x-input>
      <cell title="封面图片" @click.native="chooseImg()" is-link value-align="left">
        <div>
          <img v-if="data.itemLogo!=null" :src="tools.cdn(data.itemLogo+'?imageView2/1/w/100/h/100')" class="cell-cover-img">
          <div v-else class="cell-cover-img"></div>
          <p style="fontSize: 14px;marginTop: 3px">建议上传宽高比为2:1的图片</p>
        </div>
      </cell>
      <!-- 教师 -->
      <!-- <cell v-if="showTeacher" title="教师所在群" is-link @click.native="showOrgList = true" :value="currentName"></cell> -->
      <cell v-if="showTeacher && !itemId" title="选择教师" is-link @click.native="showUsers = true" :value="teacherName?teacherName:'请选择'"></cell>
      <!-- 班级 -->
      <cell v-if="showStudent && !itemId" title="学生所在班级" is-link @click.native="showClassList = true" :value="currentName?currentName:'请选择'"></cell>
      <cell v-if="showStudent && currentId && !itemId" title="选择学生" is-link @click.native="showUsers = true" :value="studentName?studentName:'请选择'"></cell>

      <cell v-if="itemId && data.teacherId" title="教师" :value="data.teacherName"></cell>
      <cell v-if="itemId && data.classId" title="学生所在班级" :value="data.className"></cell>
      <cell v-if="itemId && data.studentId" title="选择学生" :value="data.studentName"></cell>

      <!-- <x-input title="联系人" v-model="data.linkPeople" placeholder="选填"></x-input> -->
      <x-input title="联系电话" v-model="data.linkPhone" type="tel" placeholder="选填"></x-input>
      <x-textarea title="描述" v-model="data.itemDesc" :rows="5" placeholder="必填"></x-textarea>
      <media-upload :imageData="contentImgPathList" :args="mediaArgs" :imageType="mediaImageType" :callBack="mediaCallBack"></media-upload>
    </group>
    <detail-tabbar :actionLink="add" :actions="actions" isHideMe=true></detail-tabbar>
    <!-- 班级列表 -->
    <popup v-model="showClassList" height="80%">
      <div :style="{'height': scrollerHeight + 44 + 'px', 'position': 'relative'}">
        <scroller>
          <group gutter="0">
            <radio style="margin-top:-1px" :options="classList" v-model="selectTempKey"></radio>
          </group>
        </scroller>
      </div>
      <div style="display:flex;position: fixed;width: 100vw;bottom: 0;height: 50px;">
        <div style="flex: 1;backgroundColor:rgb(230, 230, 230)" @click="showClassList = false">
          <p style="line-height: 50px; textAlign: center;">关闭</p>
        </div>
        <div style="flex: 1;backgroundColor: #8ebf52" @click="confirmClass()">
          <p style="line-height: 50px; textAlign: center;color: #fff;">确定</p>
        </div>
      </div>
    </popup>
    <!-- 选择教师群 -->
    <popup v-model="showOrgList" height="80%">
      <div :style="{'height': scrollerHeight + 'px', 'position': 'relative'}">
        <scroller>
          <group gutter="0">
            <radio style="margin-top:-1px" :options="orgList" v-model="selectTempKey"></radio>
          </group>
        </scroller>
      </div>
      <div style="display:flex;position: fixed;width: 100vw;bottom: 0;height: 50px;">
        <div style="flex: 1;backgroundColor:rgb(230, 230, 230)" @click="showOrgList = false">
          <p style="line-height: 50px; textAlign: center;">关闭</p>
        </div>
        <div style="flex: 1;backgroundColor: #8ebf52" @click="confirmClass()">
          <p style="line-height: 50px; textAlign: center;color: #fff;">确定</p>
        </div>
      </div>
    </popup>
    <!-- 选择学生/教师 -->
    <popup v-model="showUsers" height="80%">
      <search position="absolute" top="0" @on-submit="searchUser" v-model="searchValue" @on-focus="searchFocus(true)" @on-cancel="searchFocus(false)"></search>
      <div v-if="showBlock" style="height: 44px;"></div>
      <div :style="{'height': scrollerHeight + 'px', 'position': 'relative'}">
        <scroller ref="scroller" :on-infinite="infinite" v-if="showUsers">
          <group gutter="0">
            <radio class="vote-user" style="margin-top:-1px" :options="users" v-model="selectUser"></radio>
          </group>
        </scroller>
      </div>
      <div style="display:flex;position: fixed;width: 100vw;bottom: 0;height: 50px;">
        <div style="flex: 1;backgroundColor:rgb(230, 230, 230)" @click="showUsers = false">
          <p style="line-height: 50px; textAlign: center;">关闭</p>
        </div>
        <div style="flex: 1;backgroundColor: #8ebf52" @click="confirmUser()">
          <p style="line-height: 50px; textAlign: center;color: #fff;">确定</p>
        </div>
      </div>
    </popup>
  </div>
</template>

<script>
import api from '../api.js'
import eduApi from '@/feature/education/api'
import {Group, Cell, XInput, XTextarea, Radio, Popup, Search} from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import MediaUpload from '@/components/MediaUpload.vue'
import { mapGetters } from 'vuex'
export default {
  components: {
    Group, Cell, XInput, XTextarea, DetailTabbar, MediaUpload, Radio, Popup, Search
  },
  data() {
    return {
      actions: [{name: '添加'}],
      imgPath: null,
      mediaImageType: 'SCHOOL_VOTE',
      contentImgPathList: [],
      mediaArgs: [],
      data: {
        itemName: null,
        itemDesc: null,
        itemLogo: null,
        linkPeople: null,
        linkPhone: null
      },
      showStudent: false,
      showTeacher: false,
      scrollerHeight: 0,
      showClassList: false,
      classList: [],
      selectTempKey: null,
      showOrgList: false,
      orgList: [],
      currentId: null,
      currentName: null,
      showUsers: false,
      users: [],
      selectUser: null,
      searchValue: null,
      showBlock: false,
      studentName: null,
      teacherName: null
    }
  },
  computed: {
    schoolId() {
      return this.$route.params.schoolId
    },
    voteId() {
      return this.$route.params.voteId
    },
    type() {
      return String(this.$route.params.type)
    },
    itemId() {
      return this.$route.params.itemId
    },
    ...mapGetters({wechatConfig: 'wechatConfig'})
  },
  mounted() {
    this.scrollerHeight = window.innerHeight * 0.8 - 94
    this.mediaArgs = [this.schoolId]
    if (this.itemId) {
      this.actions = [{name: '修改'}]
      api.getUserVoteItemInfo({schoolId: this.schoolId, voteId: this.voteId, itemId: this.itemId}, (data) => {
        this.data = data
        let studentId = data.studentId
        let teacherId = data.teacherId
        this.contentImgPathList = data.itemImgs.split(',')
        if (studentId) {
          this.currentId = data.classId
          this.currentName = data.className
          this.studentName = data.studentName
          this.data.studentId = studentId
        }
        if (teacherId) {
          this.currentId = teacherId
          this.currentName = data.teacherName
          this.data.teacherId = teacherId
        }
      }, (er) => { this.toast(er, '获取详情失败') })
    }
    api.getVoteInfo({schoolId: this.schoolId, voteId: this.voteId}, (info) => {
      this.info = info
      if (info.base.voteType === 'STUDENT') {
        this.showStudent = true
      } else if (info.base.voteType === 'TEACHER') {
        this.showTeacher = true
      }
    }, (er) => {
      this.toast(er, '获取详情失败')
    })
    this.localStorage.getFeatureManageStatus({schoolId: this.$route.params.schoolId}, (data) => {
      if (data.schoolVoteStatus) { // 全校投票管理权限
        // 所有班级
        eduApi.getClassList({ schoolId: this.$route.params.schoolId, rowStart: 0, rowCount: 9999 }, (data) => {
          this.classList = []
          data.forEach((element) => {
            var item = {key: element.classId + '', value: element.className}
            this.classList.push(item)
          }, this)
        }, (er) => {})
        eduApi.queryRelationOrg({schoolId: this.$route.params.schoolId, orgType: 1, rowStart: 0, rowCount: 100}, (data) => {
          this.orgList = []
          data.forEach((element) => {
            var item = {key: element.orgId + '', value: element.orgName}
            this.orgList.push(item)
          }, this)
        }, (er) => {})
      } else { // 班级投票管理权限
        // this.data.base.voteScope = '3'
        // 有权限的班级
        eduApi.queryTeacherClassList({schoolId: this.$route.params.schoolId, featureCode: 'TOUPIAO_BANJI'}, (data) => {
          this.classList = []
          data.forEach((element) => {
            var item = {key: element.classId + '', value: element.className}
            this.classList.push(item)
          }, this)
        }, () => {})
      }
    }, () => {})
  },
  methods: {
    add() {
      if (this.type === '1' || (this.type === '2' && !this.showTeacher && !this.showStudent)) {
        if (!this.data.itemName) {
          this.toast({}, '请输入名称')
          return
        }
      }
      if (this.type === '2') {
        if (!this.data.itemLogo) {
          this.toast({}, '请上传封面图片')
          return
        }
      }
      if (this.showStudent) {
        if (!this.data.classId) {
          this.toast({}, '请选择学生所在班级')
          return
        } else {
          if (!this.data.studentId) {
            this.toast({}, '请选择学生')
            return
          }
        }
      }
      if (this.showTeacher) {
        if (!this.data.teacherId) {
          this.toast({}, '请选择教师')
          return
        }
      }
      if (!this.data.itemDesc || this.data.itemDesc === '') {
        this.toast({}, '请输入描述')
        return
      }
      api.addOrUpdateVoteItem({schoolId: this.schoolId, voteId: this.voteId, itemId: this.itemId, params: this.data}, (data) => {
        this.$router.go(-1)
        this.tools.successToast(this.itemId ? '修改成功' : '添加成功')
      }, (er) => {
        let hint = '添加失败'
        if (er.toUser) {
          hint = er.message
        }
        this.tools.warnToast(hint)
      })
    },
    chooseImg() {
      this.$wechat.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: res => {
          this.$vux.loading.show({
            text: '图片上传中'
          })
          var localIds = res.localIds
          this.$wechat.uploadImage({
            localId: localIds[0],
            isShowProgressTips: 0,
            success: (res) => {
              this.uploadApi.uploadMpImage({type: this.mediaImageType, args: [this.schoolId], mediaId: res.serverId}, (data) => {
                this.data.itemLogo = data.result.path
                this.$vux.loading.hide()
              }, () => {
                this.tools.warnToast('图片上传失败')
                this.$vux.loading.hide()
              })
            }
          })
        }
      })
    },
    mediaCallBack({imageData}) {
      this.contentImgPathList = imageData
      console.log(imageData)
      this.data.itemImgs = imageData.join(',')
    },
    toast(er, hint = '请求失败') {
      if (er.toUser) {
        hint = er.message
      }
      this.tools.warnToast(hint)
    },
    confirmClass() {
      this.currentId = this.selectTempKey
      if (this.showStudent) {
        this.showClassList = false
        this.data.classId = this.selectTempKey
        this.classList.forEach(item => {
          if (item.key === this.selectTempKey) {
            this.currentName = item.value
          }
        })
      }
      if (this.showTeacher) {
        this.showOrgList = false
        this.orgList.forEach(item => {
          if (item.key === this.selectTempKey) {
            this.currentName = item.value
          }
        })
      }
    },
    confirmUser() {
      if (this.showStudent) {
        this.data.studentId = this.selectUser
      } else {
        this.data.teacherId = this.selectUser
      }
      this.users.forEach(item => {
        if (item.key === this.selectUser) {
          if (this.showStudent) {
            this.studentName = item.value
          } else if (this.showTeacher) {
            this.teacherName = item.value
          }
        }
      })
      this.showUsers = false
    },
    infinite(done) {
      if (this.showStudent) {
        this.getStudentList(this.currentId, this.searchValue, this.users.length, data => {
          data.forEach(item => {
            this.users.push({key: item.studentId, value: item.studentName, icon: this.tools.cdn(item.userIcon, 'head.png')})
          })
          if (data.length >= 20) {
            done()
          } else {
            done(true)
          }
        })
      } else if (this.showTeacher) {
        this.getTeacherList(this.searchValue, this.users.length, data => {
          data.forEach(item => {
            this.users.push({key: item.teacherId, value: item.teacherName, icon: this.tools.cdn(item.userIcon, 'head.png')})
          })
          if (data.length >= 20) {
            done()
          } else {
            done(true)
          }
        })
      }
    },
    getStudentList(classId, studentName, start, callBack) {
      eduApi.getStudentList({schoolId: this.schoolId, studentName: studentName, classId: classId, rowStart: start, rowCount: 20}, (data) => {
        callBack(data)
      }, (er) => {
        this.toast(er, '获取学生失败')
      })
    },
    getTeacherList(teacherName, rowStart, callBack) {
      eduApi.getTeacherList({schoolId: this.schoolId, teacherName, rowStart, rowCount: 20}, data => {
        callBack(data)
      }, er => { this.toast(er, '获取教师失败') })
    },
    searchFocus(val) {
      this.showBlock = val
      if (!val) {
        this.searchValue = null
        this.users = []
        this.$refs.scroller.finishInfinite()
      }
    },
    searchUser() {
      this.users = []
      this.$refs.scroller.finishInfinite()
    }
  }
}
</script>

<style lang="less" scoped>
.cell-cover-img{
  border-radius: 5px;
  width: 130px;
  height: 65px;
  display: block;
  margin-right: 10px;
  background-position: center center;
  background-size: cover;
  background-image: url(../../../assets/logo.png)
}
</style>

<style>
.vote-user .vux-radio-icon {
  width: 40px;
  height: 40px;
}
</style>

