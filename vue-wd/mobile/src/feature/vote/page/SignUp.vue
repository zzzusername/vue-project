<template>
  <div>
    <Group gutter="10px" label-width="6em" label-margin-right="0.8em" label-align="left">
      <cell title="姓名" value-align="left" v-if="studentName || teacherName">{{studentName ? studentName : teacherName}}</cell>
      <cell v-if="isParent == 'parent'" title="关联学生" :value="selecteText" is-link @click.native="onShowConfirm" value-align="left"></cell>
      <cell title="封面图片" @click.native="chooseImg()" is-link value-align="left">
        <div>
          <img v-if="itemLogo" :src="tools.cdn(itemLogo+'?imageView2/1/w/100/h/100')" class="cell-cover-img">
          <div v-else class="cell-cover-img"></div>
          <p style="fontSize: 14px;marginTop: 3px">建议上传宽高比为2:1的图片</p>
        </div>
      </cell>
      <!-- <x-input title="联系人" placeholder="选填" v-model="linkPeople"></x-input> -->
      <x-input title="联系电话" placeholder="选填" ref="mobilePhone" keyboard="number" is-type="china-mobile" v-model="linkPhone"></x-input>
      <x-textarea title="描述" v-model="itemDesc" placeholder="必填" :rows="4" @on-change="val => {if(val !== ''){showContentHint = false} else {showContentHint = true}}"></x-textarea>
      <media-upload :imageData="itemImgs" :args="mediaArgs" :imageType="mediaImageType" :callBack="mediaCallBack"></media-upload>
    </Group>
    <confirm
      v-model="showConfirm"
      title="请选择学生"
      @on-confirm="confirmChildren">
      <group gutter="0">
        <checklist style="text-align:left;color: #000;" label-position="left" :max="1" :options="childrenList" v-model="selectChildren"></checklist>
      </group>
    </confirm>
    <detail-tabbar :actionLink="confirmVote" :actions="actions"></detail-tabbar>
  </div>
</template>

<script>
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import { Group, Cell, Actionsheet, Confirm, XInput, XTextarea, Checklist, TransferDom, AlertPlugin } from 'vux'
  import MediaUpload from '@/components/MediaUpload.vue'
  import api from '../api.js'
  import eduApi from '@/feature/education/api'
  import Vue from 'vue'
  Vue.use(AlertPlugin)
  export default {
    directives: {
      TransferDom
    },
    components: {
      MediaUpload, DetailTabbar, Group, Cell, Actionsheet, Confirm, XInput, XTextarea, Checklist
    },
    data () {
      return {
        itemName: null,
        linkPeople: null,
        linkPhone: null,
        itemDesc: null,
        studentName: null,
        teacherName: null,
        selectChildren: [],
        itemImgs: [],
        mediaArgs: [],
        mediaImageType: 'SCHOOL_VOTE',
        itemLogo: null,
        actions: [
          {
            name: '确认报名',
            code: 'vote'
          }
        ],
        userInfo: {},
        selecteText: '',
        showConfirm: false,
        childrenList: []
      }
    },
    mounted () {
      this.mediaArgs = [
        this.$route.params.schoolId
      ]
      this.localStorage.getUserInfo({schoolId: this.$route.params.schoolId}, (data) => {
        this.userInfo = data
      }, () => {})
      if (this.$route.params.type === 'parent') {
        this.getChildren()
      }
      if (this.$route.params.voteId && this.$route.params.applyId) {
        this.actions = [
          {
            name: '确认修改',
            code: 'edit'
          }
        ]
        api.applyItemInfo({schoolId: this.$route.params.schoolId, voteId: this.$route.params.voteId, applyId: this.$route.params.applyId}, (data) => {
          this.itemDesc = data.itemDesc
          this.itemLogo = data.itemLogo
          this.linkPeople = data.linkPeople
          this.linkPhone = data.linkPhone
          this.studentName = data.studentName
          this.teacherName = data.teacherName
          if (!this.tools.isNull(data.itemImgs)) {
            data.itemImgs.split(',').forEach((element) => {
              this.itemImgs.push(element)
            }, this)
          }
        }, (er) => {})
      }
    },
    computed: {
      isParent () {
        return this.$route.params.type
      }
    },
    methods: {
      identity () {
      },
      onShowConfirm () {
        if (this.childrenList.length <= 0 || this.childrenList.length === 1) {
          return
        }
        this.showConfirm = true
      },
      confirmChildren () {
        if (this.selectChildren.length > 0) {
          this.childrenList.forEach((element) => {
            if (parseInt(element.key) === parseInt(this.selectChildren[0])) {
              this.selecteText = element.value
            }
          })
        }
      },
      confirmVote (code) {
        // if (!this.itemLogo) {
        //   this.tools.warnToast('请上传封面图片')
        //   return
        // }
        if (this.isParent === 'parent' && this.selectChildren.length <= 0) {
          this.tools.warnToast('请关联学生')
          return
        }
        if (!this.$refs.mobilePhone.valid && this.linkPhone) {
          this.tools.warnToast('请填写正确的电话好吗', '180px')
          return
        }
        if (!this.itemDesc) {
          this.tools.warnToast('请填写描述')
          return
        }
        let list = {
          studentId: this.selectChildren[0],
          itemName: this.itemName,
          itemDesc: this.itemDesc,
          itemLogo: this.itemLogo,
          linkPeople: this.linkPeople,
          linkPhone: this.linkPhone,
          itemImgs: this.itemImgs.length > 0 ? this.itemImgs : null
        }
        if (code === 'vote') {
          api.voteApply({schoolId: this.$route.params.schoolId, voteId: this.$route.params.voteId, data: list}, (data) => {
            this.tools.successToast('报名成功')
            this.$router.go(-1)
          }, (er) => {
            if (er.toUser) {
              this.$vux.alert.show({
                title: '提示',
                content: er.message
              })
            } else {
              this.tools.warnToast('报名失败')
            }
          })
        } else if (code === 'edit') {
          let listEdit = {
            itemName: this.itemName,
            itemDesc: this.itemDesc,
            itemLogo: this.itemLogo,
            linkPeople: this.linkPeople,
            linkPhone: this.linkPhone,
            itemImgs: this.itemImgs.length > 0 ? this.itemImgs : null
          }
          api.editItemApply({schoolId: this.$route.params.schoolId, applyId: this.$route.params.applyId, data: listEdit}, (data) => {
            this.tools.successToast('修改成功')
            this.$router.go(-1)
          }, (er) => {
            if (er.toUser) {
              this.tools.warnToast(er.message)
            } else {
              this.tools.warnToast('修改失败')
            }
          })
        }
      },
      getChildren () {
        eduApi.getParentInfoSelf({schoolId: this.$route.params.schoolId}, (data) => {
          this.childrenList = []
          data.studentlist.forEach((element) => {
            let item = {
              key: element.studentId,
              value: element.studentName
            }
            this.childrenList.push(item)
          })
          if (this.childrenList.length === 1) {
            this.selectChildren.push(this.childrenList[0].key)
            this.selecteText = this.childrenList[0].value
          } else {
            this.selecteText = '请选择学生'
          }
        })
      },
      chooseImg () {
        this.$wechat.chooseImage({
          count: 1,
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: res => {
            this.$vux.loading.show({
              text: '图片上传中'
            })
            var localIds = res.localIds
            this.$wechat.uploadImage({
              localId: localIds[0],
              isShowProgressTips: 0,
              success: (res) => {
                this.uploadApi.uploadMpImage({type: 'SCHOOL_VOTE', args: this.mediaArgs, mediaId: res.serverId}, (data) => {
                  this.itemLogo = data.result.path
                  this.$vux.loading.hide()
                }, () => {
                  this.tools.warnToast('图片上传失败')
                  this.$vux.loading.hide()
                })
              }
            })
          }
        })
      },
      mediaCallBack ({imageData}) {
        this.itemImgs = imageData
      }
    }
  }
</script>

<style scoped>
.cell-cover-img{
  border-radius: 5px;
  width: 100px;
  height: 50px;
  display: block;
  margin-right: 10px;
  background-position: center center;
  background-size: cover;
  background-image: url(../../../assets/logo.png)
}
</style>
