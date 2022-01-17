<!--  -->
<template>
  <div>
    index<br />
    <router-link to="/marquee">marquee</router-link> <br />
    <router-link to="/rank">rank</router-link><br />
    <router-link to="/debounce">debounce</router-link><br />
    <router-link to="/fenye">分页</router-link><br />
    <router-link to="/switchTab">switchTab</router-link><br />
    <!-- <router-link to="/marquee">marquee</router-link> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      inputData: "",
      songs: [],
      hasMore: true,
      songCount: 0,
      // offset: 0,
      limit: 50,
      page: 0,
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
  mounted() {},
  watch: {
    // page变化的时候 请求下一页
    async page(val) {
      // 请求到数据后拼接到songs后面
      const data = await this.searchFun();
      this.songs = this.songs.concat(data.songs);
      this.hasMore = data.hasMore;
    },
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
  },
};
</script>
<style>
</style>