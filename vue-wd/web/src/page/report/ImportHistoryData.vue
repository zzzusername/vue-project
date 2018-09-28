<template>
  <div class="warpper">
    <div class="header">
      <span>评价数据导入</span>
      <div style="display: inline-block;float: right;padding: 10px">
        <el-button type="text">下载模版</el-button>
        <el-button type="text" @click="importData">导入</el-button>
      </div>
    </div>
    <div style="margin-top: 10px;">
      <el-table :data="fileList" border :max-height="maxHeight">
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column label="文件名" prop="name" align="center" min-width="50"></el-table-column>
        <el-table-column label="班级" prop="className" align="center" min-width="50"></el-table-column>
        <el-table-column label="操作" align="center" width="250">
          <!-- <template slot-scope="scope">
            <el-button size="mini" type="primary">编辑</el-button>
            <el-button size="mini" type="primary">查看</el-button>
          </template> -->
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="导入历史数据" :visible.sync="dialogTableVisible">
      <div style="margin: 10px 0">
        <span>年级:</span>
        <el-select style="margin-left: 15px" v-model="importGradeId" clearable placeholder="请选择年级" @change="importGradeChange" @clear="clearImportGradeId">
          <el-option
            v-for="item in grades"
            :key="item.gradeId"
            :label="item.gradeName"
            :value="item.gradeId">
          </el-option>
        </el-select>
      </div>
      <div>
        <span>班级:</span>
        <el-select :disabled="importGradeId == null" style="margin-left: 15px" v-model="importClassId" clearable placeholder="请选择班级">
          <el-option
            v-for="item in classes"
            :key="item.classId"
            :label="item.className"
            :value="item.classId">
          </el-option>
        </el-select>
      </div>
      <div style="margin: 20px 0 10px;">
        <el-upload
          class="upload-demo"
          action=""
          :limit="1"
          :on-change="fileChange"
          :auto-upload="false">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <div slot="tip" class="el-upload__tip">只能上传excel文件</div>
        </el-upload>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveImport" :loading="importLoading">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import gradeApi from '../grademanage/api.js'
import api from '../api.js'
export default {
  data () {
    return {
      maxHeight: document.body.clientHeight - 169,
      fileList: [{name: '评价报告', className: '一年级一班'}],
      dialogTableVisible: false,
      importGradeId: null,
      importClassId: null,
      grades: [],
      classes: [],
      importLoading: false
    }
  },
  computed: {
    schoolId () {
      return this.$route.params.schoolId
    }
  },
  mounted () {
    gradeApi.getGradeList({schoolId: this.schoolId}, list => {
      this.grades = list
    }, er => {
      this.responseError(er, '获取年级列表失败，请刷新页面')
    })
  },
  methods: {
    importData () {
      this.dialogTableVisible = true
    },
    importGradeChange (val) {
      this.importClassId = null
      this.getClassList(val)
    },
    clearImportGradeId () {
      this.importGradeId = null
      this.importClassId = null
    },
    fileChange (file) {
      console.log(file)
    },
    saveImport () {
    },
    getClassList (val) {
      api.getClassList({schoolId: this.schoolId, rowStart: 0, rowCount: 999, gradeId: val}, list => {
        this.classes = list
      }, er => {
        this.responseError(er, '获取班级列表失败')
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../../style/public.less');
</style>

