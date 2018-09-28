<template>
  <div>
    <div :style="{'position': 'relative', 'height': scrollerHeight + 'px'}">
      <scroller :on-infinite="infinite" no-data-text="没有更多接龙～" ref="manage_scroller">
        <div style="height: 1px" v-if="chainIng.length==0&&chainSelf.length==0"></div>
        <div>
          <group v-if="chainIng.length>0" gutter="0" title="可参与的接龙任务">
            <cell v-for="(item, index) in chainIng" v-if="index<3" :title="item.chainTitle.length>25?item.chainTitle.substring(0,25)+'...':item.chainTitle" :key="index" @click.native="skipDetail(item, 'look')" is-link>
              <p slot="inline-desc" style="margin-top:5px;" v-if="item.className">
                <span>班级：{{item.className}}</span>
              </p>
              <p slot="inline-desc" style="margin-top:5px;">
                <span style="margin-right: 10px;">{{item.teacherName}}</span>
                <span>截止时间：{{tools.formateTime(item.endDate, 'YYYY-MM-DD HH:mm')}}</span>
              </p>
              <span slot :style="{'color':parseInt(item.isAgreeType)== 1?'rgb(142, 191, 82)':'#999999', 'font-size': '14px'}">{{parseInt(item.isAgreeType) == 0 ? '未参与': parseInt(item.isAgreeType) == 1 ? "已参与" : '不需要参与'}}</span>
            </cell>
          </group>
          <p v-if="chainIng.length>3" style="background:#fff;padding:5px 10px;text-align:center;color:#2E84D4;font-size:15px;" @click="more">查看更多</p>
          <group v-if="chainSelf.length>0" title="我发起的接龙任务">
            <cell v-for="(item, index) in chainSelf" :title="item.chainTitle.length>25?item.chainTitle.substring(0,25)+'...':item.chainTitle" :key="index" @click.native="skipDetail(item, 'self', index)" is-link>
              <p slot="inline-desc" style="margin-top:5px;" v-if="item.className">
                <span>班级：{{item.className}}</span>
              </p>
              <p slot="inline-desc" style="margin-top:5px;">
                <span>截止时间：{{tools.formateTime(item.endDate, 'YYYY-MM-DD HH:mm')}}</span>
              </p>
              <span slot v-if="item.commitNum == item.totalNum && item.totalNum != 0" style="color:rgb(142, 191, 82);font-size: 14px;">已完成</span>
              <span slot v-else style="font-size: 14px;">{{item.commitNum + '/' + item.totalNum}}人</span>
            </cell>
          </group>
        </div>
      </scroller>
    </div>
    <div v-transfer-dom>
      <confirm v-model="showConfirm"
      title="操作提示"
      @on-confirm="onConfirm">
        <p style="text-align:center;">{{confirmDesc}}</p>
      </confirm>
    </div>
    <actionsheet v-model="showMenu" :menus="managemenus" @on-click-menu="menuClick" show-cancel></actionsheet>
    <detail-tabbar :actionLink="onPublish" :actions="actions"></detail-tabbar>
  </div>
</template>

<script>
  import { Group, Cell, Actionsheet, Confirm, TransferDom } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import api from '../api.js'
  export default {
    directives: {
      TransferDom
    },
    components: {
      Group, Cell, DetailTabbar, Actionsheet, Confirm
    },
    data () {
      return {
        actions: [{name: '发布接龙', code: 'publish'}],
        scrollerHeight: 0,
        chainSelf: [],
        chainIng: [],
        showMenu: false,
        managemenus: {},
        showConfirm: false,
        selectedIndex: null,
        confirmDesc: ''
      }
    },
    mounted () {
      this.scrollerHeight = window.innerHeight - 50
      this.queryChainTeacher(1, 0, 5, (data) => {
        this.chainIng = data
      })
    },
    methods: {
      infinite(done) {
        this.queryChainTeacher(2, this.chainSelf.length, 20, (data) => {
          this.chainSelf = this.chainSelf.concat(data)
          if (data.length >= 20) {
            done()
          } else {
            done(true)
          }
        })
      },
      queryChainTeacher (type, rowStart, rowCount, cb) {
        api.queryChainTeacher({schoolId: this.$route.params.schoolId, type: type, rowStart: rowStart, rowCount: rowCount}, (data) => {
          cb(data)
        }, (er) => {})
      },
      more () {
        this.$router.push({name: 'educationChainHistory'})
      },
      skipDetail (item, code, index) {
        this.selectedIndex = index
        if (code === 'self') {
          this.showMenu = true
          if (parseInt(item.commitNum) === parseInt(item.totalNum) && parseInt(item.totalNum) !== 0) {
            this.managemenus = {
              'look': '查看',
              'delete': '删除'
            }
          } else {
            this.managemenus = {
              'look': '查看',
              'change': '修改',
              'delete': '删除'
            }
          }
        } else {
          this.$router.push({name: 'educationChainDetail', params: { chainId: item.chainId }})
        }
      },
      onPublish () {
        this.$router.push({name: 'educationChainPublish'})
      },
      menuClick (key) {
        switch (key) {
          case 'look':
            this.$router.push({name: 'educationChainDetail', params: { chainId: this.chainSelf[this.selectedIndex].chainId }})
            break
          case 'change':
            this.$router.push({name: 'educationChangeChain', params: { chainId: this.chainSelf[this.selectedIndex].chainId }})
            break
          case 'delete':
            var item = this.chainSelf[this.selectedIndex]
            this.showConfirm = true
            this.confirmDesc = '您确定要删除［' + item.chainTitle + '］吗'
            break
        }
      },
      onConfirm () {
        api.deleteChain({schoolId: this.$route.params.schoolId, chainId: this.chainSelf[this.selectedIndex].chainId}, (data) => {
          this.chainSelf.splice(this.selectedIndex, 1)
          this.tools.successToast('删除成功')
        }, (er) => {
          if (er.toUser) {
            this.tools.warnToast(er.message)
          } else {
            this.tools.successToast('推送失败')
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
