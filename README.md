## Vue-QQMusic
#### 简介：
最近有点小闲置，于是乎希望写点东西，正好自己喜欢听歌，便决定自己写一个QQ音乐的简易版。
顺便进一步加深下自己对移动端的知识。我会在每个核心组件和部分都加下注解大致说明原理，争取提供一个良好的代码阅读环境，在注视部分是采用英文写的，请原谅我撇脚的英语o(╯□╰)o，欢迎大家给我提出更好的意见( *︾▽︾)

#### 原理简介：
首先这里通过Jsonp来进行跨域获取QQ音乐API数据，在[API Hanler](https://github.com/Panda-Hope/vue-qqmusic/blob/master/src/api/index.js)对API进行处理导出统一的方法来获取数据。  
核心文件则是在[Store](https://github.com/Panda-Hope/vue-qqmusic/blob/master/src/store/index.js),在这里使用Vuex统一管理页面切换动画，歌曲播放状态，歌曲进度等信息。所有对于歌曲的操作都通过Vuex来进行全局管理，然后对相应的变化做出全局改变。

## 技术栈
- Vue全家桶（使用Vue-cli作为构建工具）
- Webpack
- Mint-Ui
- Es6
- Sass
- Velocity, AlloyTouch等第三方库

## 运行演示
#### 线上地址：[Vue-QQMusic](https://panda-hope.github.io/)
#### 移动端请扫描下面二维码：
![二维码](https://github.com/Panda-Hope/panda-hope.github.io/blob/master/gif/qrcode.png)
#### 运行截图：
<div align="space-between">
    <img src="https://github.com/Panda-Hope/panda-hope.github.io/blob/master/gif/music1.gif" width="375" height="667">
    <img src="https://github.com/Panda-Hope/panda-hope.github.io/blob/master/gif/music2.gif" align="right" width="375" height="667">
</div>

## 项目组件
- [x] 首页 -- 完成
- [ ] 电台 -- 无法获取电台API
- [X] 歌手信息 -- 完成
- [X] 歌手列表 -- 完成
- [x] 歌曲排行 -- 完成
- [x] 歌曲列表 -- 完成
- [x] 热门推荐 -- 完成
- [x] 歌曲搜索 -- 完成
- [x] 歌曲播放 -- 完成
- [x] 底部固定歌曲播放条 -- 完成

## 项目结构 ##
```

|-- build                            // webpack配置文件
|-- config                           // 项目打包路径
|-- src                              // 源码目录 
|   |-- api                          // QQ音乐Api分析文件
|       |-- index.js                 
|   |-- assets                       // 图片资源文件
|   |-- components                   // 组件
|       |-- fallback.vue             // 公用后退组件
|       |-- header.vue           	 // 重写Mini-Ui头部组件，来实现更多效果
|       |-- index.vue                // 首页界面
|       |-- list.vue                 // 公用歌曲列表组件
|       |-- lyrics.vue               // 歌词组件
|       |-- play-fixed.vue           // 底部固定歌曲播放组件
|       |-- playing.vue              // 歌曲播放页面
|       |-- radio.vue                // 电台界面
|       |-- ranklist.vue             // 歌曲排行榜界面
|       |-- recommend.vue            // 推荐歌曲界面
|       |-- search.vue               // 搜索界面
|       |-- singer.vue               // 歌手界面
|       |-- singerlist.vue           // 歌手列表界面
|       |-- slider.vue               // 歌词滑动组件
|       |-- special.vue              // 特殊界面用于使用Iframe包含封面等QQ音乐原生界面
|       |-- toplist.vue              // QQ音乐巅峰榜界面
|   |-- mixin                        // 全局mixin方法
|       |-- index.js          
|   |-- router                       // Vue 路由
|       |-- index.js
|   |-- sass                         // css文件夹，采用Sass进行预编译
|       |-- packages                 // Mint-Ui文件夹，覆盖Mint-Ui原有样式
|            |-- cell.scss
|            |-- header.scss
|            |-- index.scss
|            |-- navbar.scss
|            |-- search.scss
|       |-- themes                   // APP主题CSS，未来将增加主题切换功能
|           |-- index.scss
|       |-- transition               // 全局公用Transition, Animation
|            |-- index.scss
|       |-- dimension.scss           // 阿里SUI, Rem屏幕适应变化css(暂未使用)
|       |-- index.scss               // Sass 入口文件
|       |-- mixins.scss              // Sass 公用全局Mixin
|       |-- normalize.scss           // Normalize.css
|       |-- page.scss                // 页面布局css
|       |-- scaffold.scss            // scaffold css 设置基本全局样式
|       |-- util.scss                // 公用全局Sass组件
|       |-- var.scss                 // 全局Sass变量，这里使用sass-resources-loader向全局注入Sass变量
|   |-- store                        // Vuex Store文件，APP核心所在
|       |-- index.js       
|   |-- util                         // 全局公用函数
|       |-- index.js                 
|   |-- App.vue                      // App入口文件
|   |-- filter.js                    // 注册全局Vue filter
|   |-- main.js                      // 程序入口文件，加载Vuex,Vue-router等插件
|   |-- mintUi.js                    // Mint-Ui配置文件
|   |-- test                         // 测试目录，暂未使用
|-- .babelrc                         // ES6语法编译配置
|-- .editorconfig                    // 代码编写规格
|-- .eslintignore                    // Eslint 忽略的文件
|-- .eslintrc.js                     // EsLint 配置 暂未使用 
|-- .gitignore                       // git ingnore
|-- .postcssrc.js                    // post css 配置文件
|-- README.md                        // README
|-- index.html                       // 入口html文件
`-- package.json                     // 项目及工具的依赖配置文件

```

## Build Setup

``` bash
# download
git clone https://github.com/Panda-Hope/vue-qqmusic

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

