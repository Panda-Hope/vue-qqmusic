## Vue-QQMusic
#### 简介：
最近有点小闲置，于是乎希望写点东西，正好自己喜欢听歌，便决定自己写一个QQ音乐的简易版。
顺便进一步加深下自己对移动端的知识。我会在每个核心组件和部分都加下注解大致说明原理，争取提供一个良好的代码阅读环境，在注视部分是采用英文写的，请原谅我撇脚的英语o(╯□╰)o，欢迎大家给我提出更好的意见( *︾▽︾)

#### 原理简介：
首先这里通过Jsonp来进行跨域获取QQ音乐API数据，在[API Hanler](https://github.com/Panda-Hope/vue-qqmusic/blob/master/src/api/index.js)对API进行处理导出统一的方法来获取数据。  
核心文件则是在[Vuex](https://github.com/Panda-Hope/vue-qqmusic/blob/master/src/store/index.js),在这里使用Vuex统一管理页面切换动画，歌曲播放状态，歌曲进度等信息。所有对于歌曲的操作都通过Vuex来进行全局管理，然后对相应的变化做出全局改变。

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

