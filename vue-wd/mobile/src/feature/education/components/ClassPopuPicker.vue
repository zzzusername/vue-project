<template>
  <div>
    <popu-custom-picker :show="show" :list="classes" @confirm="confirm">
      <p v-if="isManage">您好！当前没有可用班级，请<span style="color: blue" @click="addClass">点击此处</span>为您自己所在角色关联班级</p>
      <p v-else>您好！当前没有可用班级，请联系本校管理员为您所在角色关联班级</p>
    </popu-custom-picker>
  </div>
</template>

<script>
import PopuCustomPicker from './PopuCustomPicker'
import { mapGetters } from 'vuex'
import api from '../api'
export default {
  components: {
    PopuCustomPicker
  },
  data() {
    return {
      classes: [],
      isManage: false
    }
  },
  props: {
    show: Boolean,
    featureCode: String
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    })
  },
  mounted() {
    if (this.userInfo.feature !== undefined) {
      this.isManage = this.userInfo.feature.roleManage
    }
    this.queryTeacherClassList((data) => {
      this.classes.splice(0, this.classes.length)
      let list = []
      data.forEach(element => {
        list.push({name: element.className, value: element.classId})
      })
      this.classes.push(list)
      if (list.length === 1) {
        this.$emit('confirm', list[0])
      } else {
        this.$emit('confirm', {})
      }
    })
  },
  watch: {
    userInfo(nval, oval) {
      this.isManage = nval.feature.roleManage
    }
  },
  methods: {
    addClass () {
      this.$router.push({name: 'educationRoleManage'})
    },
    confirm(val) {
      this.$emit('confirm', val)
    },
    queryTeacherClassList(callback) {
      api.queryTeacherClassList({ schoolId: this.$route.params.schoolId, featureCode: this.featureCode }, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    }
  }
}
</script>

<style>

</style>
