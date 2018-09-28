
const QualityRouter = Array.of(
  {
    path: 'quality',
    component: resolve => require(['./page/Index'], resolve),
    children: [
      { name: 'educationQualityIndex', path: '', component: resolve => require(['./page/Index'], resolve), meta: {title: '综合素质评价'} }
    ]
  }
)

export default QualityRouter
