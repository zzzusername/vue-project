<template>
  <div>
    <div :style="{'position': 'relative', 'height': scrollerHeight + 'px'}">
      <scroller ref="manage_scroller">
        <Group gutter="0px">
          <cell style="font-size:16px;">
            <p slot="title">
              <span style="margin-right:10px;">姓名：{{tools.isNull(voteInfo.studentName) ? voteInfo.teacherName : voteInfo.studentName}}</span>
            </p>
            <p slot="inline-desc">联系电话：{{voteInfo.linkPhone}}</p>
          </cell>
          <p v-if="voteInfo.itemDesc" style="margin:10px 14px;font-size:14px;color:#666">
            {{voteInfo.itemDesc}}
          </p>
          <div style="font-size:0;padding:10px 10px;" v-if="imgs.length>0" v-for="(item, index) in imgs" :key="index" @click="previewImage('teacher' ,index, item.imgData)">
            <img slot="default" style="display:inline-block;width:100%;" :src="tools.cdn(item.imgData)"/>
          </div>
        </Group>
      </scroller>
    </div>
    <detail-tabbar :actionLink="linkFunction" :actions="actions"></detail-tabbar>
  </div>
</template>

<script>
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import { Group, Cell, Actionsheet, Confirm, Checklist, TransferDom, AlertPlugin } from 'vux'
  import api from '../api.js'
  import Vue from 'vue'
  Vue.use(AlertPlugin)
  export default {
    directives: {
      TransferDom
    },
    components: {
      DetailTabbar, Group, Cell, Actionsheet, Confirm, Checklist
    },
    data () {
      return {
        scrollerHeight: 0,
        actions: [
          {
            name: '拒绝',
            code: 'reject',
            color: '#FC5355'
          },
          {
            name: '同意',
            code: 'agree'
          }
        ],
        voteInfo: {},
        imgs: []
      }
    },
    mounted () {
      this.scrollerHeight = window.innerHeight - 50
      api.getApplyAuditInfo({schoolId: this.$route.params.schoolId, applyId: this.$route.params.applyId}, (data) => {
        this.voteInfo = data
        if (!this.tools.isNull(this.voteInfo.itemImgs)) {
          this.voteInfo.itemImgs.split(',').forEach((element) => {
            var item = {imgData: element}
            this.imgs.push(item)
          }, this)
        }
        if (this.voteInfo.isAgree === 1) {
          this.actions = [
            {
              name: '已同意',
              color: '#aaa'
            }
          ]
        } else if (this.voteInfo.isAgree === 2) {
          this.actions = [
            {
              name: '已拒绝',
              color: '#aaa'
            }
          ]
        }
      }, (er) => {})
    },
    methods: {
      linkFunction (code) {
        if (code === 'reject') {
          api.auditApplyItem({schoolId: this.$route.params.schoolId, applyId: this.$route.params.applyId, isPass: false}, () => {
            this.tools.successToast('操作成功')
            this.actions = [
              {
                name: '已拒绝',
                color: '#aaa'
              }
            ]
          }, (er) => {
            if (er.toUser) {
              this.$vux.alert.show({
                title: '提示',
                content: er.message
              })
            } else {
              this.tools.warnToast('操作失败')
            }
          })
        } else if (code === 'agree') {
          api.auditApplyItem({schoolId: this.$route.params.schoolId, applyId: this.$route.params.applyId, isPass: true}, () => {
            this.tools.successToast('操作成功')
            this.actions = [
              {
                name: '已同意',
                color: '#aaa'
              }
            ]
          }, (er) => {
            if (er.toUser) {
              this.$vux.alert.show({
                title: '提示',
                content: er.message
              })
            } else {
              this.tools.warnToast('操作失败')
            }
          })
        }
      }
    }
  }
</script>

<style scoped>

</style>
