<!--  -->
<template>
  <div class="container" :style="containerStyle">
    <div class="content" :style="contentStyle">{{ word }}</div>
    <div v-if="isOverflow" class="contentcp" :style="contentcpStyle">
      {{ word }}
    </div>
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
      default: 30,
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
      // 字的长度是否超出父盒子
      isOverflow: false,
      // 偏移量
      offset: 0,
      // 拷贝的那一份的文本的偏移量
      cpOffset: 0,
      // 垂直居中要用到
      containerHeight: "",
      // 盒子宽度
      containerWidth: 0,
      // 内容宽度
      contentWidth: 0,
    };
  },
  mounted() {
    this.$nextTick(() => {
      // console.log(document.getElementsByClassName("container"));
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
      // console.log(containerHeight);
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
    // totalDistance() {
    //   if (!this.isOverflow) {
    //     return 0;
    //   }
    //   if (this.cpOffset!=0) {
    //     // console.log(-this.cpOffset - (this.contentWidth - this.startWidth));
    //     return (
    //       -this.cpOffset - (this.contentWidth - this.startWidth) < this.step
    //     );
    //   }
    // },

    // contentRightToContainerRight() {
    //   // 第二个开始进入container逻辑
    //   if (Math.abs(this.offset - this.openCpBox) <= this.step) {
    //     console.log("第二个开始进入container逻辑");
    //     return true;
    //   }
    //   return false;
    // },
    isToEnd() {
      // console.log(Math.abs(-this.offset-this.totalDistance));
      // console.log(Math.abs(-this.cpOffset - (this.contentWidth - this.startWidth)));
      // if (Math.abs(-this.cpOffset - (this.contentWidth - this.startWidth)) < this.step && this.cpOffset!=0) {
      //   return true;
      // }
      if (this.containerWidth-this.startWidth+this.cpOffset<this.step) {
        return true;
      }
      return false;
    },
  },
  methods: {
    run() {
      let interval = setInterval(() => {
        this.offset = this.offset - this.step;
        let offsetVal = this.offset;
        // 达到了第二个能动的条件
        if (this.isOpenCpbox) {
          this.cpOffset = this.cpOffset - this.step;
        }
        // console.log(this.cpOffset, "   ", this.totalDistance);
        // 如果第二个到达了末尾 那么重新开定时器
        if (this.isToEnd) {
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