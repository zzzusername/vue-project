
const CommentRouter = Array.of(
  {
    path: 'comment',
    component: resolve => require(['./page/Index'], resolve),
    children: [
      { name: 'educationCommentReaderList', path: 'reader/bs/:commentBsId/type/:commentType', component: resolve => require(['./page/ReaderList'], resolve), meta: {title: '阅读列表'} }
    ]
  }
)

export default CommentRouter
