<template>
  <div>
    <el-dialog :visible="true">
      <div ref="pdf"></div>
    </el-dialog>
  </div>
</template>

<script>
import PDFObject from 'pdfobject'
export default {
  computed: {
    schoolId () {
      return this.$route.params.schoolId
    },
    reportId () {
      return this.$route.query.reportId
    },
    studentId () {
      return this.$route.query.studentId
    }
  },
  mounted () {
    console.log(this.$route.query.reportId)
    let url = process.env.API_URL
    if (this.studentId) {
      url += '/school/evaluate/export/graduate/down.json?schoolId=' + this.schoolId + '&studentId=' + this.studentId
    } else {
      url += '/school/evaluate/export/down.json?schoolId=' + this.schoolId + '&reportId=' + this.reportId
    }
    PDFObject.embed(url, this.$refs.pdf)
    // alert(url)
  }
}
</script>

<style>
.pdfobject-container {
  height: 500px;
}
.pdfobject {
  border: 1px solid #ccc;
}
</style>
