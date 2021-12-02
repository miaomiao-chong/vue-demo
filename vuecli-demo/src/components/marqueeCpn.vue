<!--  -->
<template>
  <div class="container" :style="containerStyle">
    <div class="content" :style="contentStyle">{{ word }}</div>
    <div class="contentcp" :style="contentcpStyle">{{ word }}</div>
  </div>
</template>

<script>
export default {
  props: {
    word: String,
    // 开始滚动时距离左边间距
    startWidth: {
      type: Number,
      default: 20,
    },
    // 距离右边多少距离开始循环下一跳
    endWidth: {
      type: Number,
      default: 5,
    },
    // 每interval秒滚动多少px
    step: {
      type: Number,
      default: 1,
    },
    // 每多少毫秒滚动一次
    interval: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      isOverflow: false,
      // 偏移量
      offset: 0,
      cpOffset: 0,
      // 垂直居中要用到
      containerHeight: "",
      containerWidth: 0,
      // 内容宽度
      contentWidth: 0,
    };
  },
  mounted() {
    this.$nextTick(() => {
      console.log(document.getElementsByClassName("container"));
      const containerWidth =
        document.getElementsByClassName("container")[0].clientWidth;
      const contentWidth =
        document.getElementsByClassName("content")[0].clientWidth;
      const containerHeight =
        document.getElementsByClassName("container")[0].clientHeight;
      if (containerWidth >= contentWidth) {
        this.isOverflow = false;
      } else {
        this.isOverflow = true;
      }
      console.log(containerHeight);
      this.containerHeight = containerHeight;
      this.containerWidth = containerWidth;
      this.contentWidth = contentWidth;
      if (this.containerWidth < this.contentWidth) {
        this.isOverflow = true;
        const startWidth = new Number(this.startWidth);
        this.offset = -(this.containerWidth - startWidth);
        this.run();
      } else {
        this.isOverflow = false;
      }
    });
  },
  computed: {
    containerStyle() {
      return {};
    },
    // 初始化布局
    contentStyle() {
      if (!this.isOverflow) {
        return {
          textAlign: "center",
          lineHeight: this.containerHeight + "px",
        };
      } else {
        // console.log(`translate3d(${this.offset}px,0,0)`);
        return {
          transform: `translate3d(${this.offset}px,0,0)`,
          left: this.containerWidth + "px",
          lineHeight: this.containerHeight + "px",
        };
      }
    },
    contentcpStyle() {
      if (!this.isOverflow) {
        return;
      }
      return {
        left: this.containerWidth + "px",
        top: -this.containerHeight + "px",
        lineHeight: this.containerHeight + "px",
        transform: `translate3d(${this.cpOffset}px,0,0)`,
      };
    },
    // 第二个能动需要移动的距离
    openCpBox() {
      if (!this.isOverflow) {
        return;
      }
      return this.contentWidth + this.endWidth;
    },
    // 第二个能动的判断
    isOpenCpbox() {
      if (!this.isOverflow) {
        return;
      }
      return this.offset <= -this.openCpBox;
    },
    // 走完一轮的路程
    totalDistance() {
      if (!this.isOverflow) {
        return;
      }
      return this.contentWidth + this.containerWidth;
    },
    scrollSecondDistance() {
      if (!this.isOverflow) {
        return;
      }
      // return this.contentWidth-this.endWidth
    },
  },
  methods: {
    run() {
      // let interval = setInterval(() => {
      //   if (-this.marqueeDistance2 < this.length) {
      //     // 如果文字滚动到出现marquee2_margin=30px的白边，就接着显示
      //     this.marqueeDistance2 = this.marqueeDistance2 - this.marqueePace;
      //     this.marquee2copy_status =
      //       this.length + this.marqueeDistance2 <=
      //       this.windowWidth + this.marquee2_margin;
      //   } else {
      //     if (-this.marqueeDistance2 >= this.marquee2_margin) {
      //       // 当第二条文字滚动到最左边时
      //       this.marqueeDistance2 = this.marquee2_margin; // 直接重新滚动
      //       clearInterval(interval);
      //       this.run2();
      //     } else {
      //       clearInterval(interval);
      //       this.marqueeDistance2 = -this.windowWidth;
      //       this.run2();
      //     }
      //   }
      // }, 20);
      let interval = setInterval(() => {
        this.offset = this.offset - this.step;
        let offsetVal = this.offset;
        if (this.isOpenCpbox) {
          this.cpOffset = this.cpOffset - this.step;
        }
        // console.log(this.cpOffset, "   ", this.totalDistance);
        if (this.cpOffset <= -this.totalDistance) {
          // console.log(123456);
          clearInterval(interval);
          this.offset = -(this.containerWidth - this.startWidth);
          this.cpOffset = 0;
          this.run();
        }
      }, this.interval);
    },
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
};
</script>
<style>
.container {
  height: 100%;
  border: 1px solid #333;
  text-align: center;
  overflow: hidden;
}
.content {
  position: relative;

  white-space: nowrap;
  display: inline-block;
}
.contentcp {
  position: relative;
  white-space: nowrap;
  display: inline-block;
}
</style>