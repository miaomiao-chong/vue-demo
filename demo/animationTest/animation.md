![在这里插入图片描述](https://img-blog.csdnimg.cn/04245f739f9e4e29b066e7ad6add93c2.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5Lyk5b-D5bCP546L5a2Q,size_13,color_FFFFFF,t_70,g_se,x_16)
这样一个布局如何产生这样一个效果呢？ 
-- 先隐藏歌词，歌词在图片下面，点击图片以后，能够让图片渐出，让歌词渐入， 之后点击歌词以后也能让歌词渐出，然后让图片渐入

发现了一个问题 keyframes里面是不能写display none 和display block的

所以要想其他的办法了

既然不能消失，可以让他们重叠  -- position absolute可以脱离文档流

动画：

```css

.fadeout {
  animation: ease-out .5s fadeout forwards;
}

.fadein {
  animation: ease-in .5s fadein forwards;
}

@keyframes fadein {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes fadeout {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
```

根据事件代理，可以让父盒子增加点击事件

![在这里插入图片描述](https://img-blog.csdnimg.cn/0cd542bbf66e4be09174b8e4758c3081.png)

```js
    toggleClick() {
      this.startAnimation = true
      this.isShowLyric = !this.isShowLyric
    }
```

