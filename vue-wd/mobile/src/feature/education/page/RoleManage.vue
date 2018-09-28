<template>
  <div>
    <div :style="{'position': 'relative', 'height': scrollerHeight + 'px'}">
      <scroller ref="manage_scroller">
        <group gutter="0">
          <cell title="添加角色" is-link @click.native="addRole" style="background:#fff"></cell>
        </group>
        <group v-show="roleList.length > 0" title="自定义角色">
          <cell v-for="(item, index) in roleList" :key="index" :title="item.roleName" :inline-desc="item.roleDes" is-link @click.native="goRoleDetails(item.roleName, item.roleId)" value="管理" style="background:#fff">
          </cell>
        </group>
        <group v-show="defaultGradeRoleList.length > 0" title="年级默认角色">
          <cell v-for="(item, index) in defaultGradeRoleList" :key="index" :title="item.roleName" :inline-desc="item.roleDes" is-link @click.native="goRoleDetails(item.roleName, item.roleId)" value="管理" style="background:#fff">
          </cell>
        </group>
        <group v-show="defaultRoleList.length > 0" title="班级默认角色">
          <cell v-for="(item, index) in defaultRoleList" :key="index" :title="item.roleName" :inline-desc="item.roleDes" is-link @click.native="goRoleDetails(item.roleName, item.roleId)" value="管理" style="background:#fff">
          </cell>
        </group>
      </scroller>
    </div>
    <p v-show="roleList.length==0 && defaultRoleList.length>0" style="text-align:center;font-size: 16px;padding: 5px 15px;fontSize:16px;color:#a2a2a2;margin-top:20px;">您可以添加新角色，并授权给老师</p>
    <p v-show="roleList.length==0 && defaultRoleList.length==0" style="text-align:center;font-size: 16px;padding: 5px 15px;fontSize:16px;color:#a2a2a2; margin-top:20px;">没有可以管理的角色，请先添加角色或创建班级</p>
    <detail-tabbar :actionLink="addRole"></detail-tabbar>
  </div>
</template>
<script>
  import { Group, Cell } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import api from '../api'
  export default{
    components: { Group, Cell, DetailTabbar },
    data () {
      return {
        roleList: [],
        defaultRoleList: [],
        defaultGradeRoleList: [],
        scrollerHeight: 0
        // actions: [{
        //   name: '添加角色',
        //   code: 'addRole'
        // }]
      }
    },
    mounted () {
      this.scrollerHeight = window.innerHeight - 50
      api.queryRole({schoolId: this.$route.params.schoolId}, (data) => {
        data.forEach((element) => {
          if (element.isDefault === true) {
            this.defaultRoleList.push(element)
          } else if (element.isGradeDefault === true) {
            this.defaultGradeRoleList.push(element)
          } else {
            this.roleList.push(element)
          }
        }, this)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        } else {
          this.tools.warnToast('获取失败')
        }
      })
    },
    methods: {
      addRole (code) {
        // if (code === 'addRole') {
        this.$router.push({name: 'educationAddRole'})
        // }
      },
      goRoleDetails (roleName, roleId) {
        this.$router.push({name: 'educationRoleDetails', params: {roleId: roleId}})
      }
    }
  }
</script>
<style>

</style>

