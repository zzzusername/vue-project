<template>
  <div>
    <group>
      <cell v-for="(item, index) in list" :key="index" @click.native="skipDetail(index)">
        <p slot="title" style="font-size:16px;padding-right:5px;overflow:hidden;text-overflow:ellipsis;word-break:break-all;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">{{item.title}}</p>
        <div slot="icon" class="sign_up_list_img" :style="{'background-image':'url('+tools.cdn(item.itemLogo, 'logo.png', 128)+')'}" src=""></div>
        <p slot="inline-desc" style="margin-top:7px;font-size:13px;">
          <span>{{getFormateDate(item.applyTime)}}</span>
          <span :style="{'float':'right', 'color': item.statusColor}">{{item.statusTitle}}</span>
        </p>
      </cell>
    </group>
    <actionsheet v-model="showMenu" :menus="managemenus" @on-click-menu="menuClick" show-cancel></actionsheet>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import { Cell, Group, dateFormat, Actionsheet } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '@/feature/vote/api'
export default {
  components: {
    Cell, Group, DetailTabbar, Actionsheet
  },
  data () {
    return {
      list: [],
      showMenu: false,
      managemenus: [],
      selectedIndex: 0
    }
  },
  mounted () {
    api.getMySignUpList({schoolId: this.$route.params.schoolId, voteId: this.$route.params.voteId}, (data) => {
      this.list = data
      this.list.forEach(element => {
        if (!this.tools.isNull(element.studentName)) {
          element.title = element.studentName + '的报名申请'
        } else if (!this.tools.isNull(element.teacherName)) {
          element.title = element.teacherName + '的报名申请'
        }
        if (element.isAgree === 0) {
          element.statusTitle = '待审核'
          element.statusColor = '#46A0FC'
        } else if (element.isAgree === 1) {
          element.statusTitle = '已通过'
          element.statusColor = '#8FBE58'
        } else if (element.isAgree === 2) {
          element.statusTitle = '未通过'
        }
      })
    }, () => {})
  },
  methods: {
    skipDetail (index) {
      this.selectedIndex = index
      var currentItem = this.list[this.selectedIndex]
      if (currentItem.isAgree === 2) {
        // 被拒绝只能删除
        this.managemenus = {
          delete: '删除'
        }
      } else if (currentItem.isAgree === 1) {
        // 审核通过
        this.managemenus = {
          info: '预览'
        }
      } else {
        // 未审核
        this.managemenus = {
          edit: '修改',
          delete: '删除'
        }
      }
      this.showMenu = true
    },
    getFormateDate (time) {
      return dateFormat(time, 'YYYY-MM-DD HH:mm')
    },
    menuClick (key) {
      var currentItem = this.list[this.selectedIndex]
      switch (key) {
        case 'edit':
          this.$router.push({name: 'educationSignUpEdit', params: {schoolId: this.$route.params.schoolId, voteId: this.$route.params.voteId, applyId: currentItem.applyId}})
          break
        case 'info':
          this.$router.push({name: 'educationSignUpDetail', params: {schoolId: this.$route.params.schoolId, voteId: this.$route.params.voteId, itemId: currentItem.itemId}})
          break
        case 'delete':
          api.deleteApplyItem({schoolId: this.$route.params.schoolId, voteId: this.$route.params.voteId, applyId: currentItem.applyId}, () => {
            this.tools.successToast('删除成功')
            this.list.splice(this.selectedIndex, 1)
          }, () => {
            this.tools.warnToast('删除失败')
          })
          break
      }
    }
  }
}
</script>

<style>
.sign_up_list_img {
  width: 18vw;
  height:13vw;
  display: block;
  border-radius: 2px;
  margin-right: 10px;
  background-position: center center;
  background-size: cover;
  border-style:none;
  border-width:0;
}
</style>
