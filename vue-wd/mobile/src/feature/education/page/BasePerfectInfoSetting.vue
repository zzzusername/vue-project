<template>
  <div> 
    <group v-show="type == '1'">
      <cell title="教师基础信息" inline-desc="系统已提供 4 项基础信息：教师姓名、教师性别、教师生日、教师手机号"></cell>
    </group>
    <group v-show="type == '2'">
      <cell title="学生基础信息" inline-desc="系统已提供 5 项基础信息：学生姓名、学生性别、学生班级、学生学号、学生手机号"></cell>
    </group>
    <group v-show="type == '3'">
      <cell title="家长基础信息" inline-desc="系统已提供 3 项基础信息：家长姓名、家长手机号、与孩子的关系"></cell>
    </group>
    <group :title="groupTitle">
      <cell v-for="(item, index) in list" :key="index" :title="item.key" :value="getStatusTitle(item)" is-link @click.native="onItemClick(index)"></cell>
    </group>
    <x-button style="margin-top:20px;width:60vw;text-align:center" type="primary" @click.native="addItem()" > 添加选项 </x-button>
    <detail-tabbar :actionLink="save" :actions="actions" isHideMe = true></detail-tabbar>
    <popup v-model="showPopupInput" is-transparent>
      <div flots="default" style="width: 95%;background-color:#fbf9fe;margin:0 auto;border-radius:5px;padding-top:10px;margin-bottom:10px">
        <div>
          <x-input title="选项名称" v-model="newItem.key" :show-clear="true"></x-input>
          <selector title="选项类型" :options="options" v-model="newItem.status"></selector>
        </div>
        <div style="padding:10px 15px;">
          <flexbox v-if="isEdit==true">
            <flexbox-item :span="1/4"><x-button plain type="warn" @click.native="deleteItem()"> 删除 </x-button></flexbox-item>
            <flexbox-item :span="2.9/4"><x-button type="primary" @click.native="saveEditValue()"> 确定 </x-button></flexbox-item>
          </flexbox>
          <flexbox v-else>
            <flexbox-item><x-button type="primary" @click.native="saveEditValue()"> 确定 </x-button></flexbox-item>
          </flexbox>
        </div>
      </div>
    </popup>
  </div>
</template>

<script>
import {Group, Cell, Popup, XInput, XButton, Selector, Flexbox, FlexboxItem} from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '../api'
export default {
  components: {
    Cell, Group, DetailTabbar, Popup, XInput, XButton, Selector, Flexbox, FlexboxItem
  },
  data () {
    return {
      list: [],
      type: this.$route.params.type + '',
      actions: [{
        name: '保存并提交',
        code: 'save'
      }],
      showPopupInput: false,
      options: [{key: '1', value: '必填项'}, {key: '2', value: '选填项'}],
      newItem: {},
      currentItem: null,
      currentIndex: 0,
      isEdit: false
    }
  },
  computed: {
    groupTitle () {
      if (this.type === '1') {
        return '请添加更多信息选项'
      } else if (this.type === '2') {
        return '请添加更多信息选项'
      } else if (this.type === '3') {
        return '请添加更多信息选项'
      }
    }
  },
  mounted () {
    api.querySchoolDatum({schoolId: this.$route.params.schoolId, extendType: this.type}, (data) => {
      this.list = JSON.parse(data.extendParam)
    }, () => {})
  },
  methods: {
    getStatusTitle (item) {
      if (item.status === '1') {
        return '必填项'
      } else if (item.status === '2') {
        return '选填项'
      } else {
        return ''
      }
    },
    onItemClick (index) {
      this.currentIndex = index
      this.currentItem = this.list[index]
      this.newItem.key = this.list[index].key
      this.newItem.status = this.list[index].status
      this.isEdit = true
      this.showPopupInput = true
    },
    addItem () {
      this.currentItem = null
      this.newItem = {}
      this.isEdit = false
      this.showPopupInput = true
    },
    saveEditValue () {
      if (this.tools.isNull(this.newItem.key)) {
        this.tools.warnToast('选项名称不能为空', '160px')
        return
      }
      if (this.tools.isNull(this.newItem.status)) {
        this.tools.warnToast('必须选择选项类型', '160px')
        return
      }
      if (this.currentItem === null) {
        // 新增
        this.showPopupInput = false
        this.list.push(this.newItem)
      } else {
        // 编辑
        this.currentItem.key = this.newItem.key
        this.currentItem.status = this.newItem.status
        this.showPopupInput = false
      }
    },
    deleteItem () {
      this.list.splice(this.currentIndex, 1)
      this.showPopupInput = false
    },
    save () {
      if (this.list.length > 2) {
        for (var i = 0; i < this.list.length; i++) {
          var item = this.list[i]
          for (var j = i + 1; j < this.list.length; j++) {
            console.log(j)
            var itemJ = this.list[j]
            if (item.key === itemJ.key) {
              this.tools.warnToast('选项［' + item.key + '］重复', '170px')
              return
            }
          }
        }
      }
      api.saveSchoolDatum({schoolId: this.$route.params.schoolId, extendType: this.type, extendParam: JSON.stringify(this.list)}, (data) => {
        this.tools.successToast('保存成功')
        this.$router.back()
      }, (data) => {
        if (data.toUser) {
          this.tools.warnToast(data.message, '170px')
        } else {
          this.tools.warnToast('保存失败')
        }
      })
    }
  }
}
</script>
