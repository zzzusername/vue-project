export default {
  methods: {
    warnMessage (msg) {
      this.$message({message: msg, type: 'warning'})
    },
    successMessage (msg) {
      this.$message({message: msg, type: 'success'})
    },
    errorMessage (msg) {
      this.$message.error(msg)
    },
    // message (msg) {
    //   this.$message(msg)
    // },
    responseError (er, hint) {
      if (er && er.toUser) {
        this.errorMessage(er.message)
      } else {
        this.errorMessage(hint)
      }
    },
    warnConfirm (title, hintText, confirm) {
      this.$confirm(hintText, title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        confirm()
      })
    },
    warnAlert (messge) {
      this.$alert('<span style="color: #f56c6c">' + messge + '</span>', '错误提示', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定'
      })
    },
    confirm (title, message, confirmText, confirm, cancel) {
      this.$confirm(message, title, {
        dangerouslyUseHTMLString: true,
        confirmButtonText: confirmText,
        cancelButtonText: '取消'
      }).then(() => {
        confirm()
      }).catch(() => {
        cancel()
      })
    },
    isInteger (val) {
      let reg = '^[1-9]\\d*$'
      if (val) {
        return new RegExp(reg).test(val)
      }
      return false
    },
    getFileType (filePath) {
      let startIndex = filePath.lastIndexOf('.')
      if (startIndex !== -1) {
        return filePath.substring(startIndex + 1, filePath.length).toLowerCase()
      } else { return '' }
    }
  }
}
