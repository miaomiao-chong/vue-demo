<!--  -->
<template>
  <div class="listContainer">
    <ul v-for="(item, index) in rankList" :key="item">
      <li class="item">
        <div class="rank">
          <span :class="getRankCls(index)">
            {{ getRankText(index) }}
          </span>
        </div>
        <div class="content">{{ item }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "rankListCpn",
  props: {
    rankList: Array,
    rank: Boolean, // 默认为false
  },
  data() {
    return {};
  },
  methods: {
    getRankText(index) {
      if (index > 2) {
        return index + 1;
      }
    },
    getRankCls(index) {
      if (index <= 2) {
        return `icon icon${index}`;
      } else {
        return "text";
      }
    },
  },
  created() {},

  mounted() {},
};
</script>
<style>
li {
  display: flex;
  text-decoration: none;
  list-style: none;
}
.rank {
  height: 20px;
  width: 20px;
  margin-right: 20px;
  text-align: center;
  flex: 0 0 25px;
}
.icon {
  width: 20px;
  height: 20px;
  background-size: 20px 20px;
  display: inline-block;
}
.icon0{
 background-image: url("https://img-blog.csdnimg.cn/afbafe8c9c95444380857650c7b2a80b.png");
}
.icon1{
  background-image: url("https://img-blog.csdnimg.cn/020180cc5f514d809aa4e2b25aee93ec.png");
}
.icon2{
  background-image: url("https://img-blog.csdnimg.cn/afbafe8c9c95444380857650c7b2a80b.png");
}

</style>