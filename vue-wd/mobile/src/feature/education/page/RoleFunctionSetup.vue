<template>
  <div>
    <Group v-if="classFeatureList.length > 0" title="班级功能授权">
      <x-switch v-for="(item, index) in classFeatureList" :key="index" :title="item.featureName" prevent-default v-model="item.isExist" @on-click="onClick(index, item, item.isExist)" :inline-desc="item.featureDes">
      </x-switch>
    </Group>
    <Group v-if="manageFeatureList.length > 0" title="学校管理授权">
      <x-switch v-for="(item, index) in manageFeatureList" :key="index" :title="item.featureName" prevent-default v-model="item.isExist" @on-click="onClick(index, item, item.isExist)" :inline-desc="item.featureDes">
      </x-switch>
    </Group>
    <confirm v-model="showConfirm"
    title="提示"
    @on-confirm="onConfirm" confirm-text="关联班级">
      <p style="text-align:center;color:#FF6D56">请先关联班级后再操作授权！</p>
    </confirm>
    <detail-tabbar></detail-tabbar>
  </div>
</template>
<script>
  import { Group, Cell, Actionsheet, XSwitch, Confirm } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import api from '../api'
  export default{
    components: {Group, Cell, Actionsheet, DetailTabbar, XSwitch, Confirm},
    data () {
      return {
        roleName: '',
        classFeatureList: [],
        manageFeatureList: [],
        isHaveClass: false,
        showConfirm: false,
        roleInfo: {}
      }
    },
    mounted () {
      this.roleName = sessionStorage.getItem('roleName')
      this.getRoleFeature()
    },
    methods: {
      getRoleFeature () {
        api.queryRoleByid({schoolId: this.$route.params.schoolId, roleId: this.$route.params.roleId}, (roleInfo) => {
          this.roleInfo = roleInfo
          if (roleInfo.classId.length > 0) {
            this.isHaveClass = true
          }
          api.getRoleFeature({schoolId: this.$route.params.schoolId, roleId: this.$route.params.roleId, roleType: roleInfo.roleType}, (data) => {
            this.classFeatureList = []
            this.manageFeatureList = []
            data.forEach(element => {
              if (element.isClass) {
                this.classFeatureList.push(element)
              } else {
                this.manageFeatureList.push(element)
              }
            })
          }, (er) => {})
        }, (er) => {})
      },
      onClick (index, item, isExist) {
        let featureId = item.featureId
        if (this.isHaveClass === false && item.isClass === true && !this.roleInfo.isGradeDefault) {
          this.showConfirm = true
          return
        }
        api.changeRoleFeature({schoolId: this.$route.params.schoolId, roleId: this.$route.params.roleId, featureId: featureId, isExist: !isExist}, (data) => {
          this.localStorage.clearTeacherFeature() // 清空教师功能缓存
          this.tools.successToast('授权成功')
          this.getRoleFeature()
        }, (er) => {
          this.tools.warnToast('修改失败')
        })
      },
      onConfirm () {
        this.$router.push({name: 'educationEditRole', params: {roleId: this.$route.params.roleId}})
      }
    }
  }
</script>
<style>

</style>

