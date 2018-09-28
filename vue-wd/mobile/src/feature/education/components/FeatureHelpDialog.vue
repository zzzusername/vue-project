<template>
  <div style="max-height:80vh">
    <x-dialog v-model="show1" class="help-dialog">
      <div style="max-height:80vh;overflow-y: scroll;padding: 20px 20px 15px;font-size:16px;" ref="viewBox1">
        <strong style="text-align:center">{{userInfo.userName}} 您好！</strong>
        <p style="margin-top:15px;color:#222222;text-align:left;font-size:17px;">
这是您首次登陆［{{userInfo.schoolName}}］校和家，请按如下步骤完成系统的初始化。确认完成之后，老师、家长方可登录使用：
        </p>
        <p style="margin-top:15px;color:#666666;text-align:left"><strong style="color:#222">第一步：电脑登陆 <a href="https://edu.qunxiaozhu.com">edu.qunxiaozhu.com</a>，</strong>选择老师管理：导入教师名单；</p>
        <p style="margin-top:15px;color:#666666;text-align:left"><strong style="color:#222">第二步：电脑登陆 <a href="https://edu.qunxiaozhu.com">edu.qunxiaozhu.com</a>，</strong>选择班级学生管理：创建年级、班级，为班级添加班主任、导入学生名单；</p>
        <!-- <div>
          <img style="max-width:100%;margin-top:15px;" src="http://img.qunxiaozhu.com/help/2-1_2.png"></img>
        </div> -->
        <p style="margin-top:15px;color:#666666;text-align:left"><strong style="color:#222">第三步：为本校添加已有教师微信群，并通知教师完善信息。</strong>系统会引导班主任为各自班级绑定已有家长微信群，引导任课老师自己设置任课班级和课程。</p>
        <!-- <div>
          <img style="max-width:100%;margin-top:15px;" src="http://img.qunxiaozhu.com/help/2-1_2.png"></img>
        </div> -->
        <!-- <div>
          <img style="max-width:100%;margin-top:15px;" src="http://img.qunxiaozhu.com/help/2-1_2.png"></img>
        </div> -->
        <p style="margin-top:15px;color:#666666;text-align:left"><strong style="color:#222">如您遇到任课问题，请联系客服人员（电话：<a href="tel:13661212693">13661212693</a> 微信同号），我们提供免费支持及培训服务。</strong></p>
        <!-- <div>
          <img style="max-width:100%;margin-top:15px;" src="http://img.qunxiaozhu.com/help/2-1_2.png"></img>
        </div> -->
      </div>
      <div style="background:#f2f2f2;text-align:center;padding:8px 0px;font-size:16px;" @click="click">
        <span :style="{color:isAllowLink==true?'#8ebf52':'#a2a2a2'}">我已完成</span>
      </div>
    </x-dialog>
    <x-dialog v-model="show2" class="help-dialog">
      <div style="max-height:80vh;overflow-y: scroll;padding: 20px 15px 15px;font-size:16px;" ref="viewBox2">
        <strong style="text-align:center">{{userInfo.userName}}管理员，您好</strong>
        <p style="margin-top:15px;color:#222222;text-align:left;font-size:17px;">
这是您首次进行［教师管理］的初始设置，请按以下说明操作：
        </p>
        <p style="margin-top:15px;color:#666666;text-align:left">
1、<strong>添加老师</strong> 可手动添加或者登陆电脑网页用excel电子表格导入，导入表格的格式详见电脑页面说明。
        </p>
        <div>
          <img style="max-width:100%;margin-top:15px;" :src="tools.cdn('school/help/manager1-1.png')"/>
        </div>
        <p style="margin-top:15px;color:#666666;text-align:left">
2、将老师名录中的老师逐个绑定ta的微信，可以通过两种方式绑定
        </p>
        <p style="margin-top:15px;color:#666666;text-align:left">
<strong>1）群成员绑定（推荐使用）</strong> 点击老师列表中某个老师，选择群成员绑定。
        </p>
        <div>
          <img style="max-width:100%;margin-top:15px;" :src="tools.cdn('school/help/manager1-3.png')"/>
        </div>
        <p style="margin-top:15px;color:#666666;text-align:left">
<strong>2）二维码绑定</strong> 点击老师列表中某个老师，选择扫描二维码绑定。
        </p>
      </div>
      <div style="background:#f2f2f2;text-align:center;padding:8px 0px;font-size:16px;" @click="click">
        <span :style="{color:isAllowLink==true?'#8ebf52':'#a2a2a2'}">我已完成</span>
      </div>
    </x-dialog>
    <x-dialog v-model="show3" class="help-dialog">
      <div style="max-height:80vh;overflow-y: scroll;padding: 20px 15px 15px;font-size:16px;" ref="viewBox3">
        <strong style="text-align:center">{{userInfo.userName}}管理员，您好</strong>
        <p style="margin-top:15px;color:#222;text-align:left">
这是您首次进行［课程管理］的初始设置，请按以下说明操作：
        </p>
        <p style="margin-top:15px;color:#666666;text-align:left">
<strong>添加课程</strong> 手动添加课程名。
        </p>
        <div>
          <img style="max-width:100%;margin-top:15px;" :src="tools.cdn('school/help/manager1-4.png')"/>
        </div>
      </div>
      <div style="background:#f2f2f2;text-align:center;padding:8px 0px;font-size:16px;" @click="click">
        <span :style="{color:isAllowLink==true?'#8ebf52':'#a2a2a2'}">我已完成</span>
      </div>
    </x-dialog>
    <x-dialog v-model="show4" class="help-dialog">
      <div style="max-height:80vh;overflow-y: scroll;padding: 20px 15px 15px;font-size:16px;" ref="viewBox4">
        <strong style="text-align:center">{{userInfo.userName}}管理员，您好</strong>
        <p style="margin-top:15px;color:#222;text-align:left">
这是您首次进行［班级及学生管理］的初始设置，请按以下说明操作
        </p>
        <p style="margin-top:15px;color:#666666;text-align:left">
1、<strong>添加班级：</strong> 手动添加一个班级。
        </p>
        <div>
          <img style="max-width:100%;margin-top:15px;" :src="tools.cdn('school/help/manager1-5.png')"/>
        </div>
        <p style="margin-top:15px;color:#666666;text-align:left">
2、<strong>为班级设置班主任：</strong> 从教师列表中选定一位老师，设置为某个班级的班主任。同时，可以授权让班主任将该班级和他已有的班级微信群进行关联。
        </p>
        <div>
          <img style="max-width:100%;margin-top:15px;" :src="tools.cdn('school/help/manager1-6.png')"/>
        </div>
        <p style="margin-top:15px;color:#666666;text-align:left">
3、<strong>为班级导入学生：</strong> 点击某个班级，选择学生管理，可手动添加或者登陆电脑网页用excel电子表格导入，导入表格的格式详见电脑页面说明。
        </p>  
        <div>
          <img style="max-width:100%;margin-top:15px;" :src="tools.cdn('school/help/manager1-7.png')"/>
        </div>
      </div>
      <div style="background:#f2f2f2;text-align:center;padding:8px 0px;font-size:16px;" @click="click">
        <span :style="{color:isAllowLink==true?'#8ebf52':'#a2a2a2'}">我已完成</span>
      </div>
    </x-dialog>
    <x-dialog v-model="show5" class="help-dialog">
      <div style="max-height:80vh;overflow-y: scroll;padding: 20px 15px 15px;font-size:16px;" ref="viewBox5">
        <strong style="text-align:center">{{userInfo.userName}}班主任，您好！</strong>
        <p style="margin-top:15px;color:#222;text-align:left">
请按如下步骤对您的班级进行初始化设置，全部完成后，老师和家长方可正常使用：
        </p>
        <p style="margin-top:15px;color:#666666;text-align:left" v-if="!tools.isNull(extend.noStudentClass)">
          1、您的{{extend.noStudentClass}}当前没有任何学生！请用电脑登录 <span style="-webkit-touch-callout:default !important; -webkit-user-select:all !important;user-select:all !important;color: #2E84D4">https://edu.qunxiaozhu.com</span> 选择“班级学生”－“导入学生”，将学生名单（仅需学生姓名）拷贝粘贴到页面表格即可；
        </p>
        <p style="margin-top:15px;color:#666666;text-align:left">
          {{tools.isNull(extend.noStudentClass)?'1':'2'}}、点击首页【我的班级】，按页面提示将{{extend.orgClass}}和该班已有的家长微信群（或学生群）进行关联；
          <span style="color:#2E84D4" @click="onOrgClick(1)">立即操作</span>
        </p>
        <p style="margin-top:15px;color:#666666;text-align:left">
          {{(!tools.isNull(extend.noStudentClass) && !tools.isNull(extend.orgClass))?'3':'2'}}、在已关联班级的微信群里发布通知：邀请成员激活各自的账号；
          <!-- <span style="color:#2E84D4" @click="onOrgClick(2)">立即操作</span> -->
        </p>
      </div>
      <div style="background:#f2f2f2;text-align:center;padding:8px 0px;font-size:16px;" @click="click">
        <span :style="{color:isAllowLink==true?'#a2a2a2':'#a2a2a2'}">关闭</span>
      </div>
    </x-dialog>
    <x-dialog v-model="show6" class="help-dialog">
      <div style="max-height:80vh;overflow-y: scroll;padding: 20px 15px 15px;font-size:16px;" ref="viewBox6">
        <strong style="text-align:center">{{userInfo.userName}}管理员，您好</strong>
        <p style="margin-top:15px;color:#222;text-align:left">
这是您首次进行［微信群管理］的初始设置，请按以下说明操作：
        </p>
        <p style="margin-top:15px;color:#666666;text-align:left">
1、<strong>添加微信群</strong>：按下图提示操作。
        </p>
        <div>
          <img style="max-width:100%;margin-top:15px;" :src="tools.cdn('school/help/manager1-2.png')"/>
        </div>
        <p style="margin-top:15px;color:#666666;text-align:left">
2、<strong>设置群助手的昵称</strong>：按下图提示操作
        </p>
        <div>
          <img style="max-width:100%;margin-top:15px;" :src="tools.cdn('school/help/manager1-10.png')"/>
        </div>
      </div>
      <div style="background:#f2f2f2;text-align:center;padding:8px 0px;font-size:16px;" @click="click">
        <span :style="{color:isAllowLink==true?'#8ebf52':'#a2a2a2'}">我已完成</span>
      </div>
    </x-dialog>
  </div>
</template>

<script>
import { XDialog } from 'vux'
// import api from '../api'
import { mapGetters } from 'vuex'
export default {
  props: {
    type: Number,
    schoolId: String,
    title: String,
    extend: Object
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    })
  },
  components: {
    XDialog
  },
  data () {
    return {
      show1: false,
      show2: false,
      show3: false,
      show4: false,
      show5: false,
      show6: false,
      isAllowLink: false
    }
  },
  watch: {
    type: function (val, oldVal) {
      this.show1 = false
      this.show2 = false
      this.show3 = false
      this.show4 = false
      this.show5 = false
      this.show6 = false
      if (parseInt(val) === 1) {
        this.show1 = true
        setTimeout(() => {
          if (this.$refs.viewBox1.clientHeight === this.$refs.viewBox1.scrollHeight) {
            this.isAllowLink = true
          }
        }, 200)
      } else if (parseInt(val) === 2) {
        // this.show2 = true
        // setTimeout(() => {
        //   if (this.$refs.viewBox2.clientHeight === this.$refs.viewBox2.scrollHeight) {
        //     this.isAllowLink = true
        //   }
        // }, 200)
      } else if (parseInt(val) === 3) {
        // this.show3 = true
        // setTimeout(() => {
        //   if (this.$refs.viewBox3.clientHeight === this.$refs.viewBox3.scrollHeight) {
        //     this.isAllowLink = true
        //   }
        // }, 200)
      } else if (parseInt(val) === 4) {
        // this.show4 = true
        // setTimeout(() => {
        //   if (this.$refs.viewBox4.clientHeight === this.$refs.viewBox4.scrollHeight) {
        //     this.isAllowLink = true
        //   }
        // }, 200)
      } else if (parseInt(val) === 5) {
        this.show5 = true
        this.isAllowLink = true
        // setTimeout(() => {
        //   if (this.$refs.viewBox5.clientHeight === this.$refs.viewBox5.scrollHeight) {
        //     this.isAllowLink = true
        //   }
        // }, 200)
      } else if (parseInt(val) === 6) {
        // this.show6 = true
        // setTimeout(() => {
        //   if (this.$refs.viewBox6.clientHeight === this.$refs.viewBox6.scrollHeight) {
        //     this.isAllowLink = true
        //   }
        // }, 200)
      }
    }
  },
  mounted () {
    this.onScroll(this.$refs.viewBox1)
    this.onScroll(this.$refs.viewBox2)
    this.onScroll(this.$refs.viewBox3)
    this.onScroll(this.$refs.viewBox4)
    this.onScroll(this.$refs.viewBox5)
    this.onScroll(this.$refs.viewBox6)
  },
  methods: {
    onScroll (box) {
      box.addEventListener('scroll', () => {
        if ((box.scrollTop + box.clientHeight) < box.scrollHeight + 10 && (box.scrollTop + box.clientHeight) > box.scrollHeight - 10) {
          this.isAllowLink = true
        }
      }, false)
    },
    click () {
      if (this.isAllowLink === false) {
        return
      }
      if (this.type === 1) {
        // 主流程已阅读
        this.localStorage.setHelpProgressForSchoolMaster(this.$route.params.schoolId, 0)
        // this.localStorage.setHelpForSchoolManager(this.schoolId, true)
        this.show1 = false
      } else if (this.type === 2) {
        this.localStorage.setTeacherHelpForSchoolManager(this.schoolId, true)
        this.show2 = false
      } else if (this.type === 3) {
        this.localStorage.setLessonsHelpForSchoolManager(this.schoolId, true)
        this.show3 = false
      } else if (this.type === 3) {
        this.localStorage.setLessonsHelpForSchoolManager(this.schoolId, true)
        this.show3 = false
      } else if (this.type === 4) {
        this.localStorage.setClassHelpForSchoolManager(this.schoolId, true)
        this.show4 = false
      } else if (this.type === 5) {
        // this.localStorage.setCreateOrgHelpForSchoolManager(this.schoolId, true)
        this.show5 = false
      } else if (this.type === 6) {
        this.localStorage.setOrgManageHelpForSchoolManager(this.schoolId, true)
        this.show6 = false
      }
    },
    onItemClick (val) {
      switch (val) {
        case 1:
          this.$router.push({name: 'educationGroupList'})
          break
        case 2:
          this.$router.push({name: 'educationTeacherManage'})
          break
        case 3:
          this.$router.push({name: 'educationLessonsManage'})
          break
        case 4:
          this.$router.push({name: 'educationClassManage'})
          break
        case 5:
          this.$router.push({name: 'educationSchoolOpenOrg'})
          break
        default:
          break
      }
    },
    // 班主任的功能
    onOrgClick (val) {
      if (val === 1) {
        this.$router.push({name: 'educationViewStudentList'})
      } else if (val === 2) {
        this.$router.push({name: 'educationViewStudentList'})
      }
    }
  }

}
</script>

<style>
.help-dialog .weui-dialog {
  width:85vw !important;
  max-width:85vw !important;
}
</style>
