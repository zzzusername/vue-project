<template>
  <div>
    <group label-width="4em" label-margin-right="1em" label-align="right">
      <x-input style="fontSize:16px;" v-for="(item, index) in formList" v-if="item.type === 'text'" :title="item.name" :key="index" :placeholder="item.hint" v-model="item.value" text-align="left" :type="item.inputType"></x-input>
      <cell style="fontSize:16px;" v-else-if="item.type === 'cover'" :title="item.name" @click.native='chooseImg(1, index)' is-link>
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
        <img style="width:60px;margin:10px;" v-if="imgList.length === 0" src="../../../assets/addImg.png" @click="chooseImg(imgNum, index)">
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
    <actionsheet v-model="showHintDeleteImg" :menus="deleteImgHint" @on-click-menu-delete="deleteAllImg" show-cancel></actionsheet>
  </div>
</template>

<script>
import { Group, XInput, Cell, XTextarea, XSwitch, Actionsheet } from 'vux'
import { mapGetters } from 'vuex'
import api from '@/feature/store/api'
export default {
  components: {
    Group, XInput, Cell, XTextarea, XSwitch, Actionsheet
  },
  computed: {
    ...mapGetters({
      wechatConfig: 'wechatConfig'
    })
  },
  data() {
    return {
      imgList: [],
      imgNum: 9,
      coverData: null,
      formList: [],
      showHintDeleteImg: false,
      deleteImgHint: {
        'title.noop': '确定删除所有图片重新上传吗？',
        delete: '<span style="color:red">删除</span>'
      }
    }
  },
  mounted() {
    var psgId = this.$route.params.productId
    api.getProductInfo({ psgId }, (data) => {
      this.coverData = this.tools.cdn(data.psgMainImg)
      if (data.psgDetailImg !== null) {
        var imgs = JSON.parse(data.psgDetailImg)
        for (var i = 0; i < imgs.length; i++) {
          this.imgList.push({imgData: this.tools.cdn(imgs[i])})
        }
      }
      this.formList = [{
        name: '商品名称',
        hint: '请输入商品名称',
        type: 'text',
        value: data.psgName,
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
        value: data.psgPrice + '',
        code: 'psgPrice',
        inputType: 'number'
      },
      {
        name: '商品数量',
        hint: '请输入商品库存数量',
        type: 'text',
        value: data.psgCount + '',
        code: 'psgCount',
        inputType: 'number'
      },
      {
        name: '运费',
        hint: '请输入运费',
        type: 'text',
        value: data.psgCourierPrice + '',
        code: 'psgCourierPrice',
        inputType: 'number'
      },
      {
        name: '支付积分',
        hint: '请输入需要支付的积分',
        type: 'text',
        value: data.psgPoints + '',
        code: 'psgPoints',
        inputType: 'number'
      },
      {
        name: '支付现金',
        hint: '请输入需要支付的金钱',
        type: 'text',
        value: data.psgCostPrice + '',
        code: 'psgCostPrice',
        inputType: 'number'
      },
      {
        name: '数量限制',
        hint: '请输入用户最多购买数量',
        type: 'text',
        value: data.singleBuyCount + '',
        code: 'singleBuyCount',
        inputType: 'number'
      },
      {
        name: '是否上架',
        type: 'switch',
        value: data.psgStatus === 1,
        code: 'psgStatus'
      },
      {
        name: '商品描述',
        hint: '请输入描述文字',
        type: 'textarea',
        value: data.psgDetail,
        code: 'psgDetail'
      },
      {
        name: '详情图片',
        type: 'detailImg',
        value: null,
        code: 'psgDetailImg'
      }]
    }, () => { })
  },
  methods: {
    chooseImg(num, index) {
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
    submitAddProducts() {
      var orgId = this.$route.params.orgManagementId
      var leagueId = this.$route.params.leagueId
      var formList = this.formList
      var detailImgs = this.imgList
      var psgId = this.$route.params.productId
      for (var i = 0; i < formList.length; i++) {
        if (formList[i].code === 'psgName' && formList[i].value.length > 48) {
          this.tools.warnToast('商品名称不能超过48字', '190px')
          return
        }
        if (formList[i].code === 'psgDetail' && formList[i].value.length > 500) {
          this.tools.warnToast('商品描述不能超过500字', '190px')
          return
        }
        if (formList[i].code === 'psgPoints' && parseInt(formList[i].value) > 9999999999) {
          this.tools.warnToast('支付积分数过大', '170px')
          return
        }
        if (formList[i].code === 'psgCostPrice') {
          if (isNaN(parseFloat(formList[i].value))) {
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
        }
      }
      api.modifyProduct({ psgId, orgId, leagueId, formList, detailImgs }, (data) => {
        if (data !== null && data.rs === 1 && data.message === 'ok') {
          this.$router.go(-1)
          this.tools.toast('修改商品成功')
        } else {
          this.tools.toast(data.message)
        }
      }, (val) => {
        this.tools.toast(val.message)
      })
    },
    getLocalImgs(localIds, index) {
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
            this.imgList.push({ imgData: this.tools.data2imgDataUrl(res2.localData), binaryData: this.tools.data2blob(res2.localData) })
            this.imgNum = 9 - this.imgList.length
          }
        }
      })
    },
    showOperate(index) {
      this.showHintDeleteImg = true
    },
    deleteAllImg () {
      this.imgList = []
    }
  }
}
</script>

<style>
.cell-cover-img {
  display: block;
  margin-right: 8px;
  border-radius: 5px;
  width: 120px;
  height: 60px;
}
</style>
