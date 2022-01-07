<!--  -->
<template>
  <div id="hello-vue" class="demo">
    <input v-model="inputData" type="text" style="display:block; margin:0 auto" />
    <div ref="rootRef" class="scrollCon" style="margin-top:20px">
      <ul class="songContainer">
        <li v-for="(item, index) in songs" :key="index">
          {{ item.songName }}--{{ item.singer }}
        </li>
        <div style="width: 100% ; padding-bottom:20px" v-show="isPullUpLoad">
           <img src="https://img-blog.csdnimg.cn/fc901b1ca5974221b33e0d4b60eb64d2.gif" style="margin:0 auto ; display:block" width="30" height="30"/>
        </div>
        <div v-if="!hasMore && inputData">--------已经加载完了--------</div>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import BScroll from "better-scroll";
import { PullUpLoad } from "better-scroll";
import { ObserveDom } from "better-scroll";
BScroll.use(PullUpLoad);
BScroll.use(ObserveDom);
export default {
  data() {
    return {
      inputData: "ffafa",
      songs: [],
      hasMore: true,
      songCount: 0,
      // offset: 0,
      limit: 30,
      page: 0,
      isPullUpLoad: false,
      bs: null,
    };
  },
  computed: {},
  created() {
    // 防抖
    this.$watch(
      "inputData",
      this.debounce(async (val) => {
        this.initSearch();
        this.inputData = val;
        const data = await this.searchFun();
        (this.songs = data.songs), (this.hasMore = data.hasMore);
      })
    );
  },
  mounted() {
    const bscroll = (this.bs = new BScroll(this.$refs.rootRef, {
      pullUpLoad: true,
      observeDOM: true,
      click: true,
    }));
    bscroll.on("pullingUp", this.pullingUpHandler);
  },
  watch: {
    hasMore(val) {
      if (!val) {
        console.log("到最底部了");
      }
    },
  },
  methods: {
    // 防抖函数
    debounce(fn, delay = 300) {
      let timer = null;
      return function () {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          fn.apply(this, arguments);
          timer = null;
        }, delay);
      };
    },
    // 每次搜索page songs之类的信息需要清除
    initSearch() {
      (this.songs = []),
        (this.hasMore = true),
        (this.songCount = 0),
        (this.offset = 0),
        (this.page = 0);
    },
    // 向后端发送请求方法，返回请求到的数据
    async searchFun() {
      const result = await axios.get("http://localhost:8001/getSearchRes", {
        params: {
          keywords: this.inputData,
          limit: this.limit,
          offset: this.page * this.limit,
        },
      });
      console.log(result);
      return result.data;
    },
  async  pullingUpHandler() {
      this.isPullUpLoad = true;
      console.log(12345);
      this.page++;
      // 请求到数据后拼接到songs后面
      const data = await this.searchFun();
      this.songs = this.songs.concat(data.songs);
      this.hasMore = data.hasMore;
      this.bs.finishPullUp();
      this.bs.refresh();
      this.isPullUpLoad = false;
    },
  },
};
</script>
<style >
.scrollCon {
  height: 400px;
  overflow: hidden;
  padding-bottom: 30px;
}
</style>