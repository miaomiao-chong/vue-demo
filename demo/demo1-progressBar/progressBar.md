##  进度条相关

https://developer.mozilla.org/zh-CN/docs/Web/API/TouchEvent

中间的进度条是一个进度条组件，一个黑色的背景是进度的总长度，左侧黄色的条是当前播放的进度，中间的滑块是可以左右拖动的，可以手动改变进度条，在播放的过程中，进度条是会变长的，并且滑块是向右偏移的，可以左右拖动滑块，拖动也是改变了播放进度，并且左侧的时间是会发生变化的

来实现播放过程中，进度条也会随之播放 组件的状态靠什么决定呢  可以靠进度来决定，组件的任何状态都可以根据进度来决定，父组件传入一个数字类型的progress 

btn的位置，以及progress黄条的宽度都是根据progress计算而来的，宽度可以用一个数据offset来表示(定义个data),之后要监听progess,

https://cn.vuejs.org/v2/api/#vm-el

知识 获取根 DOM 元素

```js
      watch: {
        progress(newProgress) {
          // 进度条宽度
          const barWidth = this.$el.clientWidth - progressBtnWidth
          // 偏移量
          this.offset = barWidth * newProgress
        }
      }
```

知识  当然可以用computed,但是要注意用computed获取el的宽度一开始肯定是获取不到的，computed一开始上来就计算一次，在模板被渲染的时候就会访问offset,然后就会计算一次el宽度，这时候组件还没有mounted,是获取不到的；watch的话，progress变化的时候其实已经渲染了，所以clientWidth就可以拿到，另外，因为之后还要处理一些逻辑，更偏向逻辑的编写，所以应该用watch去实现

有了offset之后要去映射dom,给黄色进度条和btn设置一个动态的style,
![在这里插入图片描述](https://img-blog.csdnimg.cn/353b3d4960814b2eafa5fc771eca3740.png)

他们两个的style都是根据offset计算而来的，

```js
      computed: {
        progressStyle(){
          return  `width: ${this.offset}px`
        },
        btnStyle() {
          return `transform: translate3d(${this.offset}px,0,0)`
        }
      },
```

现在来根据offset来计算出它的样式是怎么样的  我们接受progress这个属性，当外部的progress变了之后，就根据progress计算出它的offset,有了偏移量，样式就能发生变化，

疑问 flex 0 0 40px  与width   两者效果是类似的，但是在某些场合下，flex布局会出现挤压或塌陷的现象，导致宽度被挤压，所以设定width可以保证我们的宽度不变化

这里是监听canplay事件

![在这里插入图片描述](https://img-blog.csdnimg.cn/2805c300e6c74144a189f114cf031e74.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5Lyk5b-D5bCP546L5a2Q,size_20,color_FFFFFF,t_70,g_se,x_16)

父组件计算属性 播放进度：已播放时间/总时间   总时间已经拿到了，播放时间可以用一个事件：timeupdate来监听

![在这里插入图片描述](https://img-blog.csdnimg.cn/371afd961f9744288f83a14c73671455.png)

现在的效果

可以看出来这是秒数，需要格式化时间，定义一个工具函数

插播 函数柯里化  https://www.jianshu.com/p/2975c25e4d71       IIFE：自我执行函数  柯里化
还有位运算一些东西  https://www.jianshu.com/p/a3202bc3f7a4
![在这里插入图片描述](https://img-blog.csdnimg.cn/fc9ca53f6a70416eb802607bbcc626bd.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5Lyk5b-D5bCP546L5a2Q,size_15,color_FFFFFF,t_70,g_se,x_16)

![在这里插入图片描述](https://img-blog.csdnimg.cn/0f584e3c2ea8422bbe67a505ef21a8af.png)

一个疑问  xxx.yyy|0 为什么等于xxx 为什么这里或运算符能有取整的作用呢 

知识padstart方法

formatTime函数

```js
formatTime(interval) {
  // interval 向下取整
  interval = interval | 0
  // 不足两位的话就向前填充一个0
  const minute = ((interval / 60 | 0) + '').padstart(2, '0')
  const second = ((interval % 60 | 0) + '').padstart(2, '0')
  return `${minute}:${second}`
}
```

但是并不能用  它识别不了这个padstart方法

所以只能自己写了 

```js
        formatTime(interval) {
          // interval 向下取整
          interval = interval | 0
          // 不足两位的话就向前填充一个0
          let minute = ((interval / 60 | 0) + '')
          let second = ((interval % 60 | 0) + '')
          let len = minute.length
          for( ;len<2;len++){
            minute='0'+minute
          }
          len = second.length
          for( ;len<2;len++){
            second='0'+second
          }
          return `${minute}:${second}`
        }
```

接下来写进度条的交互逻辑

支持拖动和点击

在移动端常见的就是ontouchstart ontouchmove ontouchend
https://developer.mozilla.org/zh-CN/docs/Web/API/TouchEvent

知识 prevent修饰符

给滑块添加三个事件

```js
      methods: {
        onTouchStart(e) {
          console.log(e);
        },
        onTouchMove(e) {
          console.log(e);
        },
        onTouchEnd(e) {
          console.log(e);
        }
      },
```



需要获取两个信息，一个是要知道它点击的位置，也就是说要知道他的横坐标是什么。以及左侧进度条的宽度（offset）

[[screenX clientX pageX概念](https://www.cnblogs.com/honghong87/p/9473599.html)

因为横坐标的位置在touchmove的时候也需要获取，所以可以把数据绑定到一个可以被共享的对象上，可以在created钩子函数中定义一个对象，

```js
      created() {
        this.touch = {}
      },
```

给黄条一个ref 之后

```js
        onTouchStart(e) {
          // console.log(e);
          this.touch.x1=e.changedTouches[0].clientX
          // 黄色进度条初始宽度
          this.touch.beginWidth = this.$refs.progress.clientWidth
          console.log(this.touch);
        },
```

```js
        onTouchStart(e) {
          // console.log(e);
          this.touch.x1=e.changedTouches[0].clientX
          // 黄色进度条初始宽度
          this.touch.beginWidth = this.$refs.progress.clientWidth
          console.log(this.touch);
        },
        onTouchMove(e) {
          // console.log(e);
          // x偏移量
          const delta = e.changedTouches[0].clientX-this.touch.x1
          // 之前的width+这次拖动增加的偏移量=应有的黄条长度
          const tempWidth = this.touch.beginWidth + delta
          // 再拿到barWidth
          const barWidth = this.$el.clientWidth - progressBtnWidth
          // 黄条长度/barwidth = progress 现在应该有的进度
          const progress = tempWidth/barWidth
          this.offset = barWidth * progress
          // console.log("tempWidth", tempWidth);
          // console.log("barWidth", barWidth);
          // console.log("progress", progress);

        },
```

来整理一下，最终目的是要拿到offset,offset是由progress和barWidth共同决定的，这里progress怎么算呢需要拿到当前黄条应该的宽度除总宽度，黄条应该的宽度就是一开始的宽度+这次滑动的x距离，然后barWidth的获取是简单的，之后就可以算出来了    

会不会觉得多此一举呢 直接原来的黄条宽度+这次滑动的长度不就可以了吗 为什么还要算progress呢，因为要让外部知道，歌曲的进度发生了改变，要让他们对应上才可以，最终是要修改audio的，这个是用父组件做的，现在只是实现了拖动，所以需要派发事件，这里派发两个自定义事件，一个progress-changing事件，表示手指还在拖动的过程中，还没有离开，当手指离开的时候还要派发一个progress-change 把新的progress传出去

实时修改currentTime的值

![在这里插入图片描述](https://img-blog.csdnimg.cn/48a64694ffc2426387d58155e2b7f1fe.png)

这是拖动的时候修改currentTIme,修改音乐的时间是在手松开的时候，

![在这里插入图片描述](https://img-blog.csdnimg.cn/f6760a88f8ac43a3bc9aa5761ff1b935.png)

但是我们暂停的时候发现是可以拖动的，但是播放的时候拖动发现是有问题的，

优化：在change的时候，如果是暂停的效果就让他播放，这时候就要定义一个isplay在点击播放暂停的时候翻转

![在这里插入图片描述](https://img-blog.csdnimg.cn/03a307b0750f4bbcb0dea00dc1efa9e2.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5Lyk5b-D5bCP546L5a2Q,size_17,color_FFFFFF,t_70,g_se,x_16)

现在来改bug，在播放的时候，拖动进度会出问题，为什么呢，监听progressChanging,我们修改了currentTime,这个currentTime一旦发生了改变，progress会根据currentTime做一个新的计算，然后传给子组件，子组件他就会进入到这个逻辑

![在这里插入图片描述](https://img-blog.csdnimg.cn/e8ffaf5b37b440db8ff95320e326ebe7.png)

offset就会重新做一次计算，

最后这里会覆盖

![在这里插入图片描述](https://img-blog.csdnimg.cn/535f7302ec0e4eacafc11a4742c4b20d.png)

应该在update的时候需要做一些控制，在changing的过程加一个标志位，

![在这里插入图片描述](https://img-blog.csdnimg.cn/94b2639b2f7048019d988255115118f2.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5Lyk5b-D5bCP546L5a2Q,size_17,color_FFFFFF,t_70,g_se,x_16)



就是说在update函数中，如果changing在拖动的过程中，不要去修改currentTime，在changing的过程中，就认为是进度条改变，他修改进度条的优先级高，自身播放导致的currentTime改变优先级比较低， 

这样就ok了

除了拖动，我们还希望点击它跳转到对应位置，

知识webapi  --getBoundingClientRect  方法返回元素的大小及其相对于视口的位置(获取短的那一条)。

![在这里插入图片描述](https://img-blog.csdnimg.cn/ed43a5a8ee684776a91c1db13c70e904.png)

用pagex获取长的那一条

```js
        clickProgress(e){
          // console.log("fds");
          console.log('getBoundingClientRect', this.$el.getBoundingClientRect());
          const rect = this.$el.getBoundingClientRect()
          // 黄条应有的宽度
          const offsetWidth = e.pageX - rect.x
          const barWidth = this.$el.clientWidth - progressBtnWidth
          const progress = offsetWidth/barWidth
          this.$emit('progress-changed', progress)
          console.log(offsetWidth)
        }
```

