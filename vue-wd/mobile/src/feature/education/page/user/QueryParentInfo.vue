<template>
  <div>
    <group title="基本信息" label-width="5em" label-margin-right="0.5em" label-align="left">
      <cell title="姓名" value-align="left" :value="parentInfo.parentName"></cell>
      <!-- <cell title="手机号" value-align="left" :value="parentInfo.telephoneNum"></cell> -->
      <cell v-for="(item, index) in parentInfo.extendParam" :key="index" :title="item.key" :value="item.value" value-align="left"></cell>
    </group>
    <group title="子女信息">
      <cell is-link @click.native="Unbundling">
        <span slot="title">解绑与<i style="color:rgb(255, 109, 86);font-style: normal;">{{studentInfo.studentName}}</i>的关系</span>
      </cell>
    </group>
    <detail-tabbar></detail-tabbar>
    <actionsheet v-model="showMenu" :menus="managemenus" @on-click-menu="menuClick" show-cancel @on-click-menu-cancel="showMenu=false"></actionsheet>
  </div>
</template>
<script>
  import { Group, Cell, Actionsheet } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import api from '../../api'
  export default{
    components: {Group, Cell, DetailTabbar, Actionsheet},
    data () {
      return {
        actions: [],
        parentInfo: {
          parentName: null,
          telephoneNum: null
        },
        studentInfo: {
          studentName: null
        },
        showMenu: false,
        managemenus: []
      }
    },
    mounted () {
      api.teacherQueryParentInfo({schoolId: this.$route.params.schoolId, parentId: this.$route.params.parentId, classId: this.$route.params.classId, studentId: this.$route.params.studentId}, (data) => {
        data.extendParam = JSON.parse(data.extendParam)
        this.parentInfo = data
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
      api.queryStudentInfo({schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId}, (data) => {
        this.studentInfo = data
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    methods: {
      Unbundling () {
        this.showMenu = true
        this.managemenus = {
          'title.noop': '您确定要解绑该家长与此学生的关系吗?<br/>',
          delete: '<span style="color:red">解绑</span>'
        }
      },
      menuClick (code) {
        if (code === 'delete') {
          api.delParentBindingStudent({schoolId: this.$route.params.schoolId, parentId: this.$route.params.parentId, studentId: this.$route.params.studentId, classId: this.$route.params.classId}, (data) => {
            this.tools.successToast('解绑成功！')
            this.showMenu = false
            this.$router.go(-1)
          }, (er) => {
            if (er.toUser !== undefined && er.toUser) {
              this.tools.warnToast(er.message)
            } else {
              this.tools.warnToast('解绑失败！')
            }
          })
        }
      }
    }
  }
</script>
<style>

</style>

