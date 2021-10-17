# 演示

![在这里插入图片描述](https://img-blog.csdnimg.cn/d3fbbcc9c7524bd2a3bd41d5010bbfb4.gif#pic_center)
需要注意：引入vue.js与lyric-parser.js
lyric-parser.js地址：https://github.com/ustbhuangyi/lyric-parser/blob/master/src/index.js
因为是网易云的歌词，与这个库解析的歌词不适配，有个地方改一下就行了
![在这里插入图片描述](https://img-blog.csdnimg.cn/72156b5185da44a288cd9077c99cb13f.png)

# 代码
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
<div id="app">
    <audio ref="audioRef" autoplay @canplay='canplay' @timeupdate='update'></audio>
    <button @click="play">播放</button>
    <button @click="pause">暂停</button>
    <div class="progress-wrapper">
        <span class="time time-l">{{formatTime(currentTime)}}</span>
        <div class="progress-bar-wrapper">
            <cpn :progress=progress
                 @progress-changing="onProgressChanging"
                 @progress-changed='progressChanged'>
            </cpn>
        </div>
        <span class="time time-l">{{formatTime(duration)}}</span>
    </div>
    <div class="lyric-container" ref="lyricContainer">
        <div class="cotnent" ref="lyricListRef">
            <p class="text" v-for="(line, index) in currentLyric.lines" :class="{'current': currentLineNum ===index}">
                {{line.txt}}
            </p>
        </div>
    </div>
<!--    <button @click="startScroll">点我开始</button>-->

</div>

<!-- 子组件 -->
<template id="myCpn">

    <div class="progress-bar">
        <!-- 后面黑色的一条 -->
        <div class="bar-inner" @click="clickProgress">
            <!-- 已经播放的区域 -->
            <div class="progress" :style='progressStyle' ref="progress">
            </div>
            <!-- btn -->
            <div class="progress-btn-wrapper" :style='btnStyle' @touchstart.preventDefault='onTouchStart'
                 @touchmove.preventDefault='onTouchMove' @touchend.preventDefault='onTouchEnd'>
                <div class="progress-btn"></div>
            </div>
        </div>
    </div>
</template>


<script src="../../js/vue.js"></script>
<script type="module">
  import Lyric from "./lyricParser.js"

  let audioEl;
  let lyricEl;
  let lyricListEl = null
  audioEl = null
  lyricEl = null
  const progressBtnWidth = 16
  // 子组件
  const cpn = {
    template: "#myCpn",
    props: {
      progress: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        offset: 0
      }
    },
    mounted() {

    },
    created() {
      this.touch = {}
    },
    computed: {
      progressStyle() {
        return `width: ${this.offset}px`
      },
      btnStyle() {
        // console.log('fds');
        return `transform: translate3d(${this.offset}px,0,0)`
      },
    },
    watch: {
      progress(newProgress) {
        // 进度条宽度
        const barWidth = this.$el.clientWidth - progressBtnWidth
        this.offset = barWidth * newProgress
      },

    },
    methods: {
      onTouchStart(e) {
        // console.log(e);
        this.touch.x1 = e.changedTouches[0].clientX
        // 黄色进度条初始宽度
        this.touch.beginWidth = this.$refs.progress.clientWidth
        console.log(this.touch);
      },
      onTouchMove(e) {
        // console.log(e);
        // x偏移量
        const delta = e.changedTouches[0].clientX - this.touch.x1
        // 之前的width+这次拖动增加的偏移量=应有的黄条长度
        const tempWidth = this.touch.beginWidth + delta
        // 再拿到barWidth
        const barWidth = this.$el.clientWidth - progressBtnWidth
        // 黄条长度/barwidth = progress 现在应该有的进度
        const progress = tempWidth / barWidth
        this.offset = barWidth * progress
        this.$emit('progress-changing', progress)

      },
      onTouchEnd(e) {
        // console.log(e);
        const barWidth = this.$el.clientWidth - progressBtnWidth
        const progress = this.$refs.progress.clientWidth / barWidth
        this.$emit('progress-changed', progress)
      },
      // 点击进度条
      clickProgress(e) {
        console.log('getBoundingClientRect', this.$el.getBoundingClientRect());
        const rect = this.$el.getBoundingClientRect()
        // 黄条应有的宽度
        const offsetWidth = e.pageX - rect.x
        const barWidth = this.$el.clientWidth - progressBtnWidth
        // const progress = offsetWidth/barWidth
        const progress = Math.min(1, Math.max(offsetWidth / barWidth, 0))
        this.$emit('progress-changed', progress)
        // console.log(offsetWidth)
      }
    },
  }
  const app = new Vue({
    el: "#app",
    data: {
      content: 'fdasdf',
      // 天外来物
      src: 'https://music.163.com/song/media/outer/url?id=1463165983.mp3',
      currentTime: 0,
      duration: 0,
      isplay: false,
      progressChanging: false,
      lyric: "[00:00.000] 作词 : 薛之谦\n[00:01.000] 作曲 : 罗小黑\n[00:02.000] 编曲 : 周以力\n[00:03.000] 制作人 : 周以力/郑伟\n[00:18.042]你降落的 太突然了\n[00:24.240]我刚好呢 又路过了\n[00:32.325]机会难得 又主观觉得\n[00:38.725]想明抢 又碰不得\n[00:46.157]你带来了 我的快乐\n[00:53.157]让这世界 有点颜色\n[01:00.444]我好想指责 你太随意了\n[01:06.991]宝物该有人捧着  你是不是我的\n[01:17.333]你像 天外来物一样 求之不得\n[01:24.269]你在世俗里的名字 不重要了\n[01:31.516]正好 我隐藏的人格是锲而不舍\n[01:38.299]直到蜂拥而至的人都透明了\n[01:45.943]我在 不近又不远处\n[01:49.925]用明天换你 靠近我\n[02:07.554]你占领了 我的快乐\n[02:14.406]和这世界 已没有瓜葛\n[02:21.639]任事物干渴  都褪去颜色\n[02:28.340]只有你是天蓝色  我开始找你了\n[02:40.569]会像 天外来物一样 失而复得\n[02:47.769]你在世俗里的名字  被人用了\n[02:54.662]反正 我隐藏的人格是锲而不舍\n[03:01.730]直到蜂拥而至的人都透明了\n[03:08.793]我在 不近又不远处\n[03:12.651]用明天换你 靠近我\n[03:18.765]你就像 天外来物一样 求之不得\n[03:26.717]我在世俗里的描写被取笑了\n[03:33.681]反正我隐藏的人格是非你不可\n[03:40.352]直到别有用心的人都透明了\n[03:47.895]我在 不近又不远处\n[03:52.044]用明天换你 靠近我\n[03:54.560] 吉他 : 张淞\n[03:57.076] 大提琴 : 郎莹\n[03:59.592] 鼓 : 褚伟明\n[04:02.108] 贝斯 : 努而德柯\n[04:04.624] 人声录音 : 郑伟 夏之炜 吴身宝\n[04:07.140] 人声编辑 : 郑伟\n[04:09.656] 人声录音室 : 上海广播大厦200studio\n[04:12.172] 乐器录音棚 : soundhub studio\n[04:14.688] 混音 : 全相彦 @OK master studio\n[04:17.204] 母带 : 全相彦 @OK master studio\n",
      currentLyric: '',
      // 当前播放行数  用来设置class
      currentLineNum: 0
    },
    components: {
      cpn
    },
    mounted() {
      // 解析歌词
      this.currentLyric = new Lyric(this.lyric, this.handleLyric)
      this.$nextTick(() => {
        audioEl = this.$refs.audioRef
        audioEl.src = this.src
        audioEl.volume = 0.1
        console.log(this.$refs.audioRef)
        // 默认暂停
        audioEl.pause()
        lyricEl = this.$refs.lyricContainer
        lyricListEl = this.$refs.lyricListRef
        console.log("lyricListEl", lyricListEl)
        // this.currentLyric = new Lyric(this.lyric, this.handleLyric)
      })
      // console.log(window)
    },
    computed: {
      progress() {
        return this.currentTime / this.duration
        console.log("progress", this.currentTime / this.duration);
      },
    },

    methods: {
      play() {
        audioEl.play()
        this.isplay = true
        this.playLyric()
      },
      pause() {
        console.log("pause")
        audioEl.pause()
        this.isplay = false
        // console.log();
        this.stopLyric()
      },
      canplay(e) {
        // console.log(123456);
        // console.log(e);
        console.log("canplay")
        this.duration = e.target.duration

      },
      update(e) {
        if (!this.progressChanging) {
          this.currentTime = e.target.currentTime
        }
        // console.log(this.currentTime)
      },
      onProgressChanging(e) {
        // console.log("onProgressChanging", e);
        this.progressChanging = true
        // 实时修改currentTime值
        this.currentTime = this.duration * e
        console.log(this.currentTime)
        this.stopLyric()
      },
      progressChanged(e) {
        this.stopLyric()
        // console.log(e);
        this.progressChanging = false

        audioEl.currentTime = this.currentTime = this.duration * e
        if (!this.isplay) {
          console.log("------");
          audioEl.play()
        }
        // this.currentLyric.play(0)
        // this.currentLyric.stop()
        this.playLyric()
      },

      // -----------歌词有关-------------
      // 歌词滚动条
      handleLyric({lineNum, txt}) {
        // console.log(this.currentLyric)
        // console.log(lineNum, txt)
        this.currentLineNum = lineNum
        if (!lyricListEl) {
          return
        }
        if (lineNum > 3) {
          const lineEl = lyricListEl.children[0]
          // 拿到行的高度
          const lineHeight= lineEl.clientHeight
          // 滚动到哪里呢  到一行高度*当前的行-3行
          lyricEl.scrollTo({
            top: lineHeight*(lineNum-3),
            left: 0,
            behavior: 'smooth'
          });
        }
      },
      // 测试滚动功能
      // startScroll() {
      //   // console.log(1)
      //   setInterval(() => {
      //     lyricEl.scrollTop += 42
      //   }, 1000)
      // },
      // 播放歌词
      playLyric() {
        // clearTimeout()
        console.log(this.currentLyric.lines)
        console.log("播放了")
        console.log(this.currentLyric)
        this.currentLyric.seek(this.currentTime * 1000)
      },
      stopLyric() {
        console.log("暂停了")
        if (this.currentLyric) {
          this.currentLyric.stop()
        }
      },
      formatTime(interval) {
        // interval 向下取整
        interval = interval | 0
        // 不足两位的话就向前填充一个0
        let minute = ((interval / 60 | 0) + '')
        let second = ((interval % 60 | 0) + '')
        let len = minute.length
        for (; len < 2; len++) {
          minute = '0' + minute
        }
        len = second.length
        for (; len < 2; len++) {
          second = '0' + second
        }
        return `${minute}:${second}`
      }
    },
  })
</script>
</body>
<style>
    #app {
        width: 100%;
    }

    .progress-wrapper {
        display: flex;
        width: 80%;
        padding: 10px 0;
        align-items: center;
        margin: 0 auto;
    }

    .time {
        width: 40px;
        flex: 0 0 40px;
        font-size: 8px;
        margin: 0 auto;
        padding: 0 8px;
    }

    .time-l {
        text-align: left;
    }

    .time-l {
        text-align: right;
    }

    .progress-bar-wrapper {
        flex: 1;
    }

    /* 子组件样式 */
    .progress-bar {
        height: 30px;
    }

    .bar-inner {
        position: relative;
        top: 11px;
        height: 8px;
        background-color: rgba(87, 82, 82, 0.062);
        border-radius: 5px;
    }

    .progress {
        position: absolute;
        height: 100%;
        background-color: rgb(238, 238, 136);
    }

    .progress-btn-wrapper {
        position: absolute;
        left: -8px;
        top: -11px;
        width: 30px;
        height: 30px;
    }

    .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid rgb(189, 189, 218);
        border-radius: 50%;
        background: rgb(123, 192, 212);
    }

    .lyric-container {
        padding: 0px;
        width: 300px;
        height: 300px;
        background-color: antiquewhite;
        overflow: scroll;

    }

    ::-webkit-scrollbar {
        width: 0px;
        height: 0px;

    }

    p {
        display: block;
        margin: 0;
        padding: 10px;
        text-align: center;
        box-sizing: border-box;
    }

    .current {
        color: white;
    }
</style>

</html>
```

# 解说

来看一下

在音乐加载完之后（不应该在这里实例化，后面有改）

![在这里插入图片描述](https://img-blog.csdnimg.cn/737b6628df2d486ba3b45155fdac20af.png)

handleLyric   给currentLine赋值  用来高亮

![在这里插入图片描述](https://img-blog.csdnimg.cn/7bd541fa44704081a45810d205967bfb.png)

点击暂停和播放

![在这里插入图片描述](https://img-blog.csdnimg.cn/04bb836a95854e9cbcf0560a57a29991.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5Lyk5b-D5bCP546L5a2Q,size_10,color_FFFFFF,t_70,g_se,x_16)

播放音乐中



![在这里插入图片描述](https://img-blog.csdnimg.cn/422da00373aa46f3ab899ec438091373.png)



playLyric

![在这里插入图片描述](https://img-blog.csdnimg.cn/87925d02e419447caf9f592fab4277e4.png)

页面



![在这里插入图片描述](https://img-blog.csdnimg.cn/b73cc54c435a4a26bee2d9bffb8915dc.png)

但是会发现有时候高亮会有延迟，这是因为lyric-parser的问题

修改方法

https://github.com/ustbhuangyi/lyric-parser/issues/11

![在这里插入图片描述](https://img-blog.csdnimg.cn/0e8cccb0159245faa0c0e051c6740ed6.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5Lyk5b-D5bCP546L5a2Q,size_20,color_FFFFFF,t_70,g_se,x_16)

![在这里插入图片描述](https://img-blog.csdnimg.cn/77548ee8798840559b067ca12d405e95.png)



这样就ok了

但是发现个bug

![在这里插入图片描述](https://img-blog.csdnimg.cn/7f45cfa99f5a4f3799e726caca21f66e.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5Lyk5b-D5bCP546L5a2Q,size_9,color_FFFFFF,t_70,g_se,x_16)

它为什么会跳到前面

试了一下，不拖动的话是没有问题的，但是一旦拖动或者点击再点暂停，暂停功能就会失效 

为什么呢 因为如果拖动的话canplay是会触发的，所以可能创建了很多个实例，开了很多定时器（可以看lyric-parse的源码），上一个还没被销毁就又创建了一个，导致上一个还没有关掉  

再来整理一下
实例化
![在这里插入图片描述](https://img-blog.csdnimg.cn/39673809aff746a2b4794bfa0a4f60dd.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5Lyk5b-D5bCP546L5a2Q,size_17,color_FFFFFF,t_70,g_se,x_16)

playLyric与stopLyric
![在这里插入图片描述](https://img-blog.csdnimg.cn/c72813ee546f4f538502129e4e1f8c18.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5Lyk5b-D5bCP546L5a2Q,size_12,color_FFFFFF,t_70,g_se,x_16)


用到playLyric和stopLyric的地方

![在这里插入图片描述](https://img-blog.csdnimg.cn/cd27a2ba7bac4b2e8bb4ab88a0ce4250.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/edd03a2567794d5cb776c4a3712e702d.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5Lyk5b-D5bCP546L5a2Q,size_16,color_FFFFFF,t_70,g_se,x_16)

这样高亮功能就完成了，接下来完成自动滚动

希望的效果：前5行，不动，接下来第六行:当前减去前五行保证一直在中间的位置

![在这里插入图片描述](https://img-blog.csdnimg.cn/aedc7875e5b94c20ad1ed6fc0bad3568.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5Lyk5b-D5bCP546L5a2Q,size_9,color_FFFFFF,t_70,g_se,x_16)

获取外层滚动的盒子el，和滚动盒子里面内容的el

获取外层滚动盒子的el是为了能够滚动，获取里面的内容是为了拿到里面的子元素，获取一行的dom，计算出它的高度

我又改了一下样式，再来整理一下这个功能，因为p标签它自动会加上margin ,上下的margin还是重叠的，获取height的时候还不会加上margin的值，很麻烦，所以吧margin去掉了，换成了padding
![在这里插入图片描述](https://img-blog.csdnimg.cn/700ce950a74b48e9897df314c3cbe859.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5Lyk5b-D5bCP546L5a2Q,size_12,color_FFFFFF,t_70,g_se,x_16)

web-api scrollTo的用法

https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTo

![在这里插入图片描述](https://img-blog.csdnimg.cn/0982c9aea09a4815905a80ed9f4333a8.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5Lyk5b-D5bCP546L5a2Q,size_12,color_FFFFFF,t_70,g_se,x_16)