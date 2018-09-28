<template>
  <div>
    <div :style="{'height': scrollerHeight + 'px', 'position': 'relative'}">
      <scroller :on-infinite="infinite" ref="comments_scroller">
        <cell v-if="canteenData.length > 0" v-for="(item, index) in canteenData" :key="index" is-link style="backgroundColor: #fff" @click.native="goDetails(item, index)">
          <span slot="title" style="font-size:16px;">菜谱{{item.menuDate | filterTitle}}</span>
          <span slot="title" style="margin-left:15px;font-size: 13px;color: rgb(153, 153, 153);">{{item.mealType | filterMealType}}</span>
          <!-- <span slot="title" style="margin-left:15px;font-size: 13px;color: rgb(153, 153, 153); v-if="item.groupType !== 0"">{{item.groupType | filterGroupType}}</span> -->
          <span slot="inline-desc">{{item.menuDate | filterTime}}</span>
        </cell>
      </scroller>
      <p style="text-align:center;font-size: 16px;padding: 20px 15px;fontSize:16px;color:#a2a2a2" v-show="canteenData.length <= 0">没有菜谱</p>
    </div>
    <div v-transfer-dom>
      <confirm v-model="showConfirm" title="操作提示" @on-cancel="onCancel" @on-confirm="onConfirm">
        <p style="text-align:center;">{{propTitle}}</p>
      </confirm>
    </div>
    <actionsheet v-model="showActionSheet" :menus="menu" @on-click-menu="actionSheetClick" show-cancel></actionsheet>
    <detail-tabbar :actionLink="skip" :actions="actions"></detail-tabbar>
  </div>
</template>
<script>
  import { Confirm, Actionsheet, dateFormat, Group, Cell, TransferDomDirective as TransferDom } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import api from '../../api'
  export default{
    components: {Confirm, Actionsheet, dateFormat, Group, Cell, DetailTabbar},
    directives: {
      TransferDom
    },
    data () {
      return {
        tag: null,
        propTitle: '',
        showConfirm: false,
        showActionSheet: false,
        menu: {
          query: '查看详情',
          change: '修改',
          push: '推送',
          delete: '<p style="color:red;">删除</p>'
        },
        actions: [],
        canteenData: [],
        scrollerHeight: 0,
        isManage: false,
        canteenMenuId: null,
        currentIndex: 0
      }
    },
    mounted () {
      this.scrollerHeight = window.innerHeight - 50
      if (this.$route.name === 'educationMenuManage') {
        this.actions = [
          { name: '发布菜谱' }
        ]
        this.isManage = true
      } else {
        this.isManage = false
      }
    },
    methods: {
      onCancel () {
        this.showConfirm = false
      },
      onConfirm () {
        if (this.tag === 'DELETE') {
          api.delCanteenMenu({schoolId: this.$route.params.schoolId, canteenMenuId: this.canteenMenuId}, (data) => {
            this.tools.successToast('删除成功！')
            this.canteenData.splice(this.currentIndex, 1)
          }, (er) => {
            if (er.toUser !== undefined && er.toUser) {
              this.tools.warnToast(er.message)
            } else {
              this.tools.warnToast('删除失败！')
            }
          })
        } else if (this.tag === 'PUSH') {
          api.pushCanteenMenu({schoolId: this.$route.params.schoolId, canteenMenuId: this.canteenMenuId}, (data) => {
            this.tools.successToast('推送成功！')
          }, (er) => {
            if (er.toUser !== undefined && er.toUser) {
              this.tools.warnToast(er.message)
            } else {
              this.tools.warnToast('推送失败！')
            }
          })
        }
      },
      goDetails (item, index) {
        this.canteenMenuId = item.canteenMenuId
        if (!this.isManage) {
          this.$router.push({name: 'educationMenuDetails', params: {canteenMenuId: this.canteenMenuId}})
          return
        } else {
          this.currentIndex = index
          this.showActionSheet = true
        }
      },
      actionSheetClick (code) {
        switch (code) {
          case 'query':
            this.$router.push({name: 'educationMenuDetails', params: {canteenMenuId: this.canteenMenuId}})
            break
          case 'delete':
            this.tag = 'DELETE'
            this.propTitle = '您确定要删除吗？'
            this.showConfirm = true
            break
          case 'push':
            this.tag = 'PUSH'
            this.propTitle = '您确定要推送吗？'
            this.showConfirm = true
            break
          case 'change':
            this.$router.push({name: 'educationEditMenu', params: {canteenMenuId: this.canteenMenuId}})
            break
        }
      },
      infinite(done) {
        this.getCanteenData(this.canteenData.length, (data) => {
          this.canteenData = this.canteenData.concat(data)
          if (data.length < 20) {
            done(true)
          } else {
            done()
          }
        })
      },
      skip () {
        this.$router.push({name: 'educationPublishMenu'})
      },
      getCanteenData(rowStart, callback) {
        api.queryCanteen({ schoolId: this.$route.params.schoolId, rowStart: rowStart, rowCount: 20 }, (data) => {
          callback(data)
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.tools.warnToast(er.message)
          }
        })
      }
    },
    filters: {
      filterTitle: function (val) {
        if (val) {
          return dateFormat(val, 'YYYY-MM-DD').replace(/-/g, '')
        }
      },
      filterTime: function(val) {
        if (val) {
          return dateFormat(val, 'YYYY-MM-DD')
        }
      },
      filterGroupType: function (val) {
        if (val === 0) {
          return '全部'
        } else if (val === 1) {
          return '老师'
        } else {
          return '学生'
        }
      },
      filterMealType: function (val) {
        if (val === 1) {
          return '早餐'
        } else if (val === 2) {
          return '午餐'
        } else if (val === 3) {
          return '晚餐'
        } else {
          return '夜宵'
        }
      }
    }
  }
</script>
<style>

</style>
