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
      // 可以进入container的元素
      isStart: false,
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
      // 没有超出范围
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

    // 走完一轮的路程
    totalDistance() {
      if (!this.isOverflow) {
        return;
      }
      return this.contentWidth + this.containerWidth;
    },
    // 根据距离右边的距离判断另一个元素是否可以进入
    contentRightToContainerRight() {
      // 第二个开始进入container逻辑
      // console.log(this.offset + this.openCpBox);
      if (this.offset + this.openCpBox < this.step) {
        console.log("第二个要开始进入container逻辑");
        this.isStart = true;
        // this.cpOffset = this.cpOffset - this.step;
        return 1;
      }
      // 第一个开始进入container逻辑
      if (this.cpOffset + this.openCpBox < this.step) {
        console.log("第一个要开始进入container逻辑");
        // this.offset = this.offset - this.step;
        return 2;
      }
      return -1;
    },
    isToEnd() {
      // console.log(Math.abs(-this.offset - this.totalDistance));
      if (this.offset + this.totalDistance < this.step) {
        console.log("第一个滚动到最后了");
        this.offset = 0;
        return 1;
      }
      if (this.cpOffset + this.totalDistance <= this.step) {
        console.log("第二个滚动到最后了");
        this.cpOffset = 0;
        return;
      }
      return false;
    },
  },
  methods: {
    run() {
      run1flag=false
      run2flag=false
      let interval = setInterval(() => {
      if (!this.isStart) {
          this.offset = this.offset - this.step;
        }
        const contentRightToContainerRight = this.contentRightToContainerRight;
        if (contentRightToContainerRight == 1) {
          this.cpOffset = this.cpOffset - this.step;
        } else if (contentRightToContainerRight == 2) {
          this.offset = this.offset - this.step;
        }

        const isToEnd = this.isToEnd;
        if (isToEnd == 1) {
          
        }

        // this.isStart=true
        // this.contentRightToContainerRight
        // this.isToEnd

        // this.offset = this.offset - this.step;
        // let offsetVal = this.offset;
        // if (this.isOpenCpbox) {
        //   this.cpOffset = this.cpOffset - this.step;
        // }
        // if (this.contentRightToContainerRight) {
        //   console.log("true");
        // }
        // // console.log(this.cpOffset, "   ", this.totalDistance);
        // if (this.isToEnd) {
        //   // console.log(123456);
        //   clearInterval(interval);
        //   this.offset = -(this.containerWidth - this.startWidth);
        //   this.cpOffset = 0;
        //   this.run();
        // }
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
  /* overflow: hidden; */
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