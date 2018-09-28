# qun

> 描述

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

## 命名规范
> 描述

1. 项目已经开启ES6验证，严格编码
2.  组件命名 大驼峰式
3.  变量命名 小驼峰式
4. 路由规范
	1. 路径命名 /app/:orgId 为根路径；功能模块模块按 /功能/子功能 方式 例如: /notice/add /notice/list
	2. 必须给每个路由命名，格式为 小驼峰试
	3. 路由设置 mita.title 为网页标题
	4. 网页跳转使用名称模式，尽量不要使用路径模式
5. 全局配置在 config 目录下面，分 dev prod test
6. 目录划分
	1. 树形结构，feature 放所有的功能
	2. router.js 编写路由代码
	3. store.js 编写vuex代码
	4. api 编写网络请求代码
	5. 每个目录下面page 放页面组件
	6. 最外层有，基础的 router store 文件
	7. 最外层的 assets 放静态文件


## CSS样式表
1. 全局设置

> 全局字体设置设置

  		```
  		全局默认字体大小为 14px 
  		全局默认字体为 微软雅黑
  		```
  		
> 背景颜色设置

| class        | 颜色           |
| ------------- |:-------------:|
| jhy-background-success      | #a2d268 |
| jhy-background-warning      | #f36d21 |
| jhy-background-danger | #dd514c |

> 边框颜色设置

| class        | 颜色           |
| ------------- |:-------------:|
| jhy-border-color      | #e5e5e5   |
 
> 文字颜色设置

| class        | 颜色           |
| ------------- |:-------------:|
| jhy-text-a-color     | #2c83ba  |

2. 布局相关

> 显示属性

        .jhy-block -display 设置为 block
        .jhy-inline -display 设置为 inline
        .jhy-inline-block -display 设置为 inline-block
        
> 隐藏元素

        添加 .jhy-hide class
        
> 内外边距
    
>> 尺寸
    
    xs -5px
    sm -10px
    default -15px
    lg -24px
    xl -32px

    
>>class列表

| margin        | padding           |
| ------------- |:-------------:|
| .jhy-margin       | .jhy-padding   |
| .jhy-margin-{size} | .jhy-padding-{size}  |

| 水平方向外边距        | 水平方向内边距           |
| ------------- |:-------------:|
| .jhy-margin-horizontal       | .jhy-padding-horizontal   |
| .jhy-margin-horizontal-{size} | .jhy-padding-horizontal-{size}  |

| 垂直方向外边距        | 垂直方向内边距           |
| ------------- |:-------------:|
| .jhy-margin-vertical     | .jhy-padding-vertical   |
| .jhy-margin-vertical-{size} | .jhy-padding-vertical-{size}  |

| 左外边距        | 左内边距           |
| ------------- |:-------------:|
| .jhy-margin-left       | .jhy-padding-left   |
| .jhy-margin-left-{size} | .jhy-padding-left-{size}  |

| 右外边距        | 右内边距           |
| ------------- |:-------------:|
| .jhy-margin-right       | .jhy-padding-right   |
| .jhy-margin-right-{size} | .jhy-padding-right-{size}  |

| 上外边距        | 上内边距           |
| ------------- |:-------------:|
| .jhy-margin-top       | .jhy-padding-top   |
| .jhy-margin-top-{size} | .jhy-padding-top-{size}  |

| 下外边距        | 下内边距           |
| ------------- |:-------------:|
| .jhy-margin-bottom       | .jhy-padding-bottom   |
| .jhy-margin-bottom-{size} | .jhy-padding-bottom-{size}  |
 
3. 文本工具

>链接颜色减淡

超链接颜色默认为主色（蓝色），添加 .jhy-link-muted class 将链接颜色设置为灰色。

>文字大小

 设置class为 .jhy-text-{size} 改变字体大小
 xs -12px
 default -14px
 big -17px

>文本左右对齐

| 左对齐        | 右对齐           | 居中对齐           | 自适应对齐           |
| ------------- |:-------------:|:-------------:|:-------------:|
| .jhy-text-left       | .jhy-text-right   |.jhy-text-center   |.jhy-text-justify   |

>文本垂直对齐

    .jhy-text-top - 顶部对齐
    .jhy-text-middle - 居中对齐
    .jhy-text-bottom -底部对齐

>文字换行及截断

| class        | 描述          |
| ------------- |:-------------:|
| .jhy-text-truncate       | 禁止换行，超出容器部分截断（以 ... 结束）   |
| .jhy-text-break  | 超出文字容器宽度时强制换行，主要用于英文排版  |
| .jhy-text-nowrap  | 禁止换行，不截断超出容器宽度部分  |

>单行文字截断


    .jhy-text-truncate，元素 display 属性需为 block 或 inline-block。

>浮动相关

    .jhy-fl - 左浮动
    .jhy-fr - 右浮动
    .jhy-center - 水平居中

    测试
    测试
    测试
    ceshi
    测试
    测试
    测试