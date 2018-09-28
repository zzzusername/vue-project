<template>
  <div>
    <group label-width="4em" label-margin-right="1em" label-align="right">
      <x-input style="fontSize:16px;" v-for="(item, index) in formList" v-if="item.type === 'text'" :title="item.name" :key="index" :placeholder="item.hint" v-model="item.value" text-align="left" :type="item.inputType" :keyboard="item.code=='psgPoints'||item.code=='psgCount'||item.code=='singleBuyCount'||item.code=='psgCourierPrice'?'number':''"></x-input>
      <cell style="fontSize:16px;" v-else-if="item.type === 'cover'" :title="item.name"  @click.native='chooseImg(1, index)' is-link>
        <!--<img slot="default" :src="coverData" class="cell-cover-img"></img>-->
        <div style="width:120px;height:60px;display:block;margin:auto;position:relative">
          <img style="max-width: 100%;max-height: 100%;display:block;position:absolute;left: 50%;top: 50%;transform: translate(-50%, -50%);" :src="coverData">
        </div>
      </cell>
      <x-switch v-else-if="item.type === 'switch'" :title="item.name" v-model="item.value"></x-switch>
      <x-textarea v-else-if="item.type === 'textarea'" :title="item.name" :placeholder="item.hint" v-model="item.value"></x-textarea>
      <div v-else style="overflow:hidden;backgroundColor: #fff;marginTop:10px;">
        <div style="width:60px;height:60px;margin:10px 5px 10px 10px;float:left;border: 1px #d9d9d9 solid;position:relative" v-if="imgList.length > 0" v-for="(item, index) in imgList" :key="index" @click="showOperate(index)">
          <img style="max-width: 100%;max-height: 100%;display:block;position:absolute;left: 50%;top: 50%;transform: translate(-50%, -50%);" :src="item.imgData">
        </div>
        <img style="width:60px;margin:10px;" v-if="imgList.length < 9" src="../../../assets/addImg.png" @click="chooseImg(imgNum, index)">
      </div>
    </group>
    <div class="vux-1px-t" style="position:fixed;bottom:0;left:0;height:50px;width:100%;backgroundColor:#fff;color:#999;">
      <div style="position:relative;width:100%;height:100%;">
        <div @click="() => {$router.go(-1)}" style="position:relative;float:left;left:0;width:50%;textAlign:center;height:100%;">
          <span style="display:block;margin:auto;lineHeight:50px;">返回</span>
        </div>
        <div @click="submitAddProducts()" style="position:relative;float:left;left:0;width:50%;textAlign:center;height:100%;backgroundColor:#8ebf52">
          <span style="display:block;margin:auto;lineHeight:50px;color:#fff;">提交</span>
        </div>
      </div>
    </div> 
  </div>
</template>

<script>
  import { Group, XInput, Cell, XTextarea, XSwitch } from 'vux'
  import { mapGetters } from 'vuex'
  import api from '@/feature/store/api'
  export default {
    components: {
      Group, XInput, Cell, XTextarea, XSwitch
    },
    mounted () {
    },
    computed: {
      ...mapGetters({
        wechatConfig: 'wechatConfig'
      })
    },
    data () {
      return {
        imgList: [],
        imgNum: 9,
        coverData: null,
        formList: [
          {
            name: '商品名称',
            hint: '请输入商品名称',
            type: 'text',
            value: '',
            code: 'psgName',
            inputType: 'text'
          },
          {
            name: '商品图片',
            type: 'cover',
            value: null,
            code: 'psgMainImg'
          },
          {
            name: '商品原价',
            hint: '请输入商品原价',
            type: 'text',
            value: '',
            code: 'psgPrice',
            inputType: 'number'
          },
          {
            name: '商品数量',
            hint: '请输入商品库存数量',
            type: 'text',
            value: '',
            code: 'psgCount',
            inputType: 'number'
          },
          {
            name: '运费',
            hint: '请输入运费',
            type: 'text',
            value: '',
            code: 'psgCourierPrice',
            inputType: 'number'
          },
          {
            name: '支付积分',
            hint: '请输入需要支付的积分',
            type: 'text',
            value: '',
            code: 'psgPoints',
            inputType: 'number'
          },
          {
            name: '支付现金',
            hint: '请输入需要支付的金钱',
            type: 'text',
            value: '',
            code: 'psgCostPrice',
            inputType: 'number'
          },
          {
            name: '数量限制',
            hint: '请输入用户最多购买数量',
            type: 'text',
            value: '',
            code: 'singleBuyCount',
            inputType: 'number'
          },
          {
            name: '是否上架',
            type: 'switch',
            value: false,
            code: 'psgStatus'
          },
          {
            name: '商品描述',
            hint: '请输入描述文字',
            type: 'textarea',
            value: '',
            code: 'psgDetail'
          },
          {
            name: '详情图片',
            type: 'detailImg',
            code: 'psgDetailImg'
          }
        ]
      }
    },
    methods: {
      chooseImg (num, index) {
        // choose img
        console.log('imgNum:' + num + ' index:' + index)
        this.$wechat.chooseImage({
          count: num,
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: res => {
            var localIds = res.localIds
            this.getLocalImgs(localIds, index)
          }
        })
      },
      submitAddProducts () {
        var orgId = this.$route.params.orgManagementId
        var leagueId = this.$route.params.leagueId
        var formList = this.formList
        var detailImgs = this.imgList
        for (var i = 0; i < formList.length; i++) {
          if (formList[i].code === 'psgName' && formList[i].value.length > 48) {
            this.tools.warnToast('商品名称不能超过48字', '190px')
            return
          }
          if (formList[i].code === 'psgDetail' && formList[i].value.length > 500) {
            this.tools.warnToast('商品描述不能超过500字', '190px')
            return
          }
          if (formList[i].code === 'psgCostPrice') {
            if (!/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(formList[i].value)) {
              this.tools.warnToast('支付金额格式错误', '170px')
              return
            } else if (parseInt(formList[i].value) > 99999999) {
              this.tools.warnToast('支付金额过大', '170px')
              return
            } else if (parseFloat(formList[i].value).toString().split('.').length === 2 && parseFloat(formList[i].value).toString().split('.')[1].length > 2) {
              this.tools.warnToast('支付金额小数不能超过2位', '200px')
              return
            }
          }
          if ((formList[i].type === 'text' || formList[i].type === 'textarea') && formList[i].value === '') {
            this.tools.warnToast(formList[i].name + ' 不能为空', '170px')
            return
          } else if (formList[i].type === 'cover' && formList[i].value === null) {
            this.tools.warnToast(formList[i].name + ' 不能为空', '170px')
            return
          }
          if (formList[i].code === 'psgCount' && !/^\+?[1-9][0-9]*$/.test(formList[i].value)) {
            this.tools.warnToast('商品数量必须是整数', '160px')
            return
          }
          if (formList[i].code === 'psgPoints') {
            if (parseInt(formList[i].value) > 9999999999) {
              this.tools.warnToast('支付积分数过大', '170px')
              return
            }
            if (!/^([1-9]\d*|[0]{1,1})$/.test(formList[i].value)) {
              this.tools.warnToast('支付积分必须是整数', '160px')
              return
            }
          }
          if (formList[i].code === 'singleBuyCount' && !/^\+?[1-9][0-9]*$/.test(formList[i].value)) {
            this.tools.warnToast('数量限制必须是整数', '160px')
            return
          }
        }
        api.addProducts({orgId, leagueId, formList, detailImgs}, (data) => {
          if (data !== null && data.rs === 1 && data.message === 'ok') {
            this.$router.go(-1)
            this.tools.toast('添加商品成功')
          } else {
            this.tools.warnToast(data.message)
          }
        }, (val) => {
          if (val.toUser) {
            this.tools.warnToast(val.message)
          } else {
            this.tools.warnToast('添加商品失败')
          }
        })
      },
      getLocalImgs (localIds, index) {
        var localId = localIds.pop()
        this.$wechat.getLocalImgData({
          localId: localId, // 图片的localID
          success: res2 => {
            if (localIds.length > 0) {
              this.getLocalImgs(localIds)
            }
            if (index === 1) {
              this.coverData = this.tools.data2imgDataUrl(res2.localData)
              this.formList[index].value = this.tools.data2blob(res2.localData)
            } else {
              this.imgList.push({imgData: this.tools.data2imgDataUrl(res2.localData), binaryData: this.tools.data2blob(res2.localData)})
              this.imgNum = 9 - this.imgList.length
            }
          }
        })
      }
    }
  }
</script>

<style>
  .cell-cover-img{
    display: block;
    margin-right: 8px; 
    border-radius: 5px;
    width: 120px;
    height: 60px;
  }
</style>
