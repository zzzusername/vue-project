<template>
  <div v-transfer-dom style="max-height:80vh">
    <x-dialog v-model="show1" class="help-dialog">
      <div style="max-height:80vh;overflow-y: scroll;padding: 20px 20px 15px;font-size:16px;">
        <strong style="text-align:center">恭喜您！您的学校已创建成功！</strong>
        <p style="margin-top:15px;color:#666666;text-align:left">
接下来，您可以添加1名教师作为管理员，帮您一起完成学校的初始设置。
        </p>
        <p style="margin-top:15px;color:#666666;text-align:left">例如：录入教师名录、添加班级、导入学生名录等功能</p>
        <div>
          <img style="max-width:100%;margin-top:15px;" :src="tools.cdn('school/help/master_help1.jpeg')"></img>
        </div>
        <p style="margin-top:15px;color:#666666;text-align:left;font-size:14px;">
          <strong>提示：</strong>如后续您希望添加更多教师时，可打开学校首页，点击上图所示图标操作
        </p>
        <div style="background:#f2f2f2;text-align:center;padding:8px 0px;color:#576b95;font-size:16px;margin-top:15px;" @click="click">
          <span>添加教师</span>
        </div>
      </div>
    </x-dialog>
    <x-dialog v-model="show2" class="help-dialog">
      <div style="max-height:80vh;overflow-y: scroll;padding: 20px 15px 15px;font-size:16px;">
        <strong style="text-align:center">恭喜您！您已成功添加1名老师！</strong>
        <p style="margin-top:15px;color:#666666;text-align:left">
接下来，您需要为该老师设置管理员权限
        </p>
        <div>
          <img style="max-width:100%;margin-top:15px;" :src="tools.cdn('school/help/master_help2.jpeg')"></img>
        </div>
        <p style="margin-top:15px;color:#666666;text-align:left;font-size:14px;">
          <strong>提示：</strong>如后续您希望为其它教师添加管理员权限，可按上图所示进行操作
        </p>
        <div style="background:#f2f2f2;text-align:center;padding:8px 0px;color:#576b95;font-size:16px;margin-top:15px;" @click="click">
          <span>设置管理权限</span>
        </div>
      </div>
    </x-dialog>
    <x-dialog v-model="show3" class="help-dialog">
      <div style="max-height:80vh;overflow-y: scroll;padding: 20px 15px 15px;font-size:16px;">
        <strong style="text-align:center">恭喜您！您已成功添加1名管理员！</strong>
        <p style="margin-top:15px;color:#666666;text-align:left">
接下来，您需要为该管理员绑定Ta的微信，绑定成功后该老师才能打开页面进行管理操作。
        </p>
        <div>
          <img style="max-width:100%;margin-top:15px;" :src="tools.cdn('school/help/master_help3.jpeg')"></img>
        </div>
        <!-- <p style="margin-top:15px;color:#666666;text-align:left;font-size:14px;">
          <strong>提示：</strong>如后续您希望为其它教师添加管理员权限，可按上图所示进行操作
        </p> -->
        <div style="background:#f2f2f2;text-align:center;padding:8px 0px;color:#576b95;font-size:16px;margin-top:15px;" @click="click">
          <span>绑定教师微信</span>
        </div>
      </div>
    </x-dialog>
  </div>
</template>

<script>
import { XDialog, TransferDomDirective as TransferDom } from 'vux'
import api from '../api'
export default {
  directives: {
    TransferDom
  },
  props: {
    progress: Number
  },
  components: {
    TransferDom, XDialog
  },
  data () {
    return {
      show1: false,
      show2: false,
      show3: false
    }
  },
  watch: {
    progress: function (val, oldVal) {
      this.show1 = false
      this.show2 = false
      this.show3 = false
      if (parseInt(val) === 1) {
        this.show1 = false
      } else if (parseInt(val) === 2) {
        this.show2 = false
      } else if (parseInt(val) === 3) {
        this.show3 = false
      }
    }
  },
  mounted () {
  },
  methods: {
    click () {
      if (this.progress === 1) {
        this.$router.push({name: 'educationAddTeacher'})
      } else if (this.progress === 2) {
        api.queryRole({schoolId: this.$route.params.schoolId}, (data) => {
          if (data.length > 0) {
            let roleId = null
            data.forEach(element => {
              if (element.isDefault === false) {
                roleId = element.roleId
              }
            })
            if (roleId !== null) {
              this.$router.push({name: 'educationRoleDetails', params: {roleId: roleId}})
            } else {
              // 数据出错了，直接跳过此步骤
              this.localStorage.setHelpProgressForSchoolMaster(this.$route.params.schoolId, 3)
              this.$router.push({name: 'educationRoleManage'})
            }
          } else {
            // 去权限管理页面
            this.$router.push({name: 'educationRoleManage'})
          }
        }, () => {})
      } else if (this.progress === 3) {
        this.$router.push({name: 'educationTeacherManage'})
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
