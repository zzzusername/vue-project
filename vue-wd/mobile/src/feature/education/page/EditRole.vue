<template>
  <div>
    <Group gutter="0" label-width="5em" label-margin-right="0.5em" label-align="left">
      <x-input title="角色名称" v-model="roleName" required placeholder="请输入角色名称"></x-input>
      <selector v-if="this.$route.params.roleId==null || this.$route.params.roleId == undefined" title="角色类型" :options="options" v-model="selectedRoleType"></selector>
      <cell v-if="selectedRoleType == 2 || roleClassList.length>0" title="关联班级" :value="classDesc" value-align="left" is-link @click.native="onShowClassList"></cell>
      <x-textarea title="角色描述" v-model="roleDescribe" placeholder="请输入角色描述"></x-textarea>
    </Group>
    <popup v-model="showClassList" height="90%">
      <div :style="{'height': scrollerHeight + 'px', 'position': 'relative'}">
        <scroller>
          <checklist title="请选择关联班级" :options="allClassList" v-model="selectAllClassKey" @on-change="changeAllClass"></checklist>
          <checklist style="margin-top:-1px" :options="classList" v-model="selectClassKey" @on-change="changeClass"></checklist>
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
    <div class="vux-1px-t" style="position:fixed;bottom:0;left:0;height:50px;width:100%;backgroundColor:#fff;color:#999;">
      <div style="position:relative;width:100%;height:100%;">
        <div @click="() => {$router.go(-1)}" style="position:relative;float:left;left:0;width:25%;textAlign:center;height:100%;" :class="{addWidth : !showDelete}">
          <span style="display:block;margin:auto;lineHeight:50px;"><span class="iconfont icon-fanhui1" style="marginRight:5px;color:#a2d268"></span>返回</span>
        </div>
        <div @click="deleteRole" v-if="this.$route.params.roleId" style="position:relative;float:left;left:0;width:25%;textAlign:center;height:100%;background-color: rgb(252, 80, 31);color:#fff;">
          <span style="display:block;margin:auto;lineHeight:50px;">删除</span>
        </div>
        <div @click="saveRole" style="position:relative;float:left;left:0;width:50%;textAlign:center;height:100%;backgroundColor:#8ebf52">
          <span style="display:block;margin:auto;lineHeight:50px;color:#fff;">保存并提交</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { XInput, Group, XTextarea, Cell, Popup, Checklist, Selector } from 'vux'
  import api from '../api'
  export default{
    components: {XInput, Group, XTextarea, Cell, Popup, Checklist, Selector},
    data () {
      return {
        roleName: '',
        roleDescribe: '',
        showDelete: false,
        isDeleted: false,
        showClassList: false,
        allClassList: [{key: '1', value: '全选'}],
        classDesc: '',
        roleClassList: [], // 已选班级
        classList: [],
        selectClassKey: [], // 临时选择班级
        selectAllClassKey: [],
        changeAllClassStatus: false, // true 不做联动变化
        isAllowDeleteClass: true, // 编辑班级是否允许取消关联班级
        scrollerHeight: 0,
        options: [{
          key: '1',
          value: '管理角色'
        }, {
          key: '2',
          value: '班级角色'
        }],
        selectedRoleType: null
      }
    },
    mounted () {
      this.scrollerHeight = window.innerHeight * 0.9 - 50
      if (this.$route.params.roleId) {
        this.showDelete = true
        api.queryRoleByid({schoolId: this.$route.params.schoolId, roleId: this.$route.params.roleId}, (data) => {
          if (data === null) {
            this.isDeleted = true
            return
          }
          if (!this.tools.isNull(data.roleName)) {
            this.roleName = data.roleName
          }
          if (!this.tools.isNull(data.roleDes)) {
            this.roleDescribe = data.roleDes
          }
          if (data.classId !== null && data.classId.length > 0) {
            // 已经关联班级的权限，不允许取消关联班级
            this.isAllowDeleteClass = false
            data.classId.forEach((element) => {
              this.roleClassList.push(element + '')
            }, this)
          }
          this.selectedRoleType = data.roleType
          this.updateClassDesc()
        }, (er) => {})
      }
    },
    methods: {
      confirmClass () {
        this.roleClassList = this.selectClassKey
        this.showClassList = false
        this.updateClassDesc()
      },
      updateClassDesc () {
        if (this.roleClassList.length > 0) {
          this.classDesc = '已关联' + this.roleClassList.length + '个班'
        } else {
          this.classDesc = ''
        }
      },
      changeAllClass () {
        if (this.changeAllClassStatus === false) {
          if (this.selectAllClassKey.length > 0) {
            this.selectClassKey = []
            this.classList.forEach((element) => {
              this.selectClassKey.push(element.key)
            }, this)
          } else {
            this.selectClassKey = []
          }
        }
      },
      changeClass () {
        if (this.classList.length > 0 && this.selectClassKey.length !== this.classList.length) {
          this.selectAllClassKey = []
          this.changeAllClassStatus = true
          this.$nextTick(() => {
            this.changeAllClassStatus = false
          })
        } else if (this.classList.length > 0) {
          this.selectAllClassKey = ['1']
        }
      },
      onShowClassList () {
        this.selectClassKey = this.roleClassList
        this.showClassList = true
        api.getClassList({ schoolId: this.$route.params.schoolId, rowStart: 0, rowCount: 9999 }, (data) => {
          this.classList = []
          data.forEach((element) => {
            var item = {key: element.classId + '', value: element.className}
            this.classList.push(item)
          }, this)
        }, (er) => {})
      },
      deleteRole () {
        if (this.isDeleted) {
          this.tools.warnToast('角色已经删除')
          return
        }
        api.deleteRole({schoolId: this.$route.params.schoolId, roleId: this.$route.params.roleId}, (data) => {
          this.tools.successToast('删除成功')
          this.$router.replace({name: 'educationRoleManage'})
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.tools.warnToast(er.message)
          } else {
            this.tools.warnToast('删除失败')
          }
        })
      },
      saveRole () {
        if (this.isDeleted) {
          this.tools.warnToast('角色已经删除')
          return
        }
        if (this.isAllowDeleteClass === false && this.roleClassList.length === 0) {
          this.tools.warnToast('不允许取消关联班级', '170px')
          return
        }
        if (parseInt(this.selectedRoleType) === 1) {
          this.roleClassList = []
        }
        api.saveRole({schoolId: this.$route.params.schoolId, roleId: this.$route.params.roleId, roleName: this.roleName, roleDes: this.roleDescribe, roleClass: this.roleClassList, roleType: this.selectedRoleType}, (data) => {
          sessionStorage.setItem('roleName', this.roleName)
          if (this.tools.isNull(this.$route.params.roleId)) {
            this.$router.replace({name: 'educationRoleDetails', params: {roleId: data.roleId}})
          } else {
            this.tools.successToast('保存成功')
            this.$router.back()
          }
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.tools.warnToast(er.message)
          } else {
            this.tools.warnToast('保存失败')
          }
        })
      }
    }
  }
</script>
<style>
.addWidth{
  width:50% !important;
}
</style>

